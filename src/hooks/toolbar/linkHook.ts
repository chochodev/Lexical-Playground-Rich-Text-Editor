import { useEffect } from 'react';
import { z } from 'zod';
import { TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useToolbarStore } from '@/store';
import {
  $getSelection,
  $isRangeSelection,
} from "lexical";
import { addToast } from '@heroui/react';

const useLinkHook = ({
  setHoveredLink,
  setLinkUrl
}) => {
  const [editor] = useLexicalComposerContext();
  const { setShowInsertLinkModal, } = useToolbarStore();

  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();

          if (!$isRangeSelection(selection)) {
            setHoveredLink(null);
            return;
          }

          const anchorNode = selection.anchor.getNode();
          const focusNode = selection.focus.getNode();

          const linkNode = $isLinkNode(anchorNode)
            ? anchorNode
            : $isLinkNode(anchorNode.getParent())
              ? anchorNode.getParent()
              : $isLinkNode(focusNode)
                ? focusNode
                : $isLinkNode(focusNode.getParent())
                  ? focusNode.getParent()
                  : null;

          if (linkNode && $isLinkNode(linkNode)) {
            const url = linkNode.getURL();
            const domNode = editor.getElementByKey(linkNode.getKey());

            if (domNode) {
              const rect = domNode.getBoundingClientRect();
              setHoveredLink({
                url,
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY,
              });
            }
          } else {
            setHoveredLink(null);
          }
        });
      },
    );

    return () => unregisterListener();
  }, [editor]);

  const insertLink = (link: string) => {
    const urlSchema = z.string().url();

    // :::::::::::::::::::::: Validates URL
    const result = urlSchema.safeParse(link);
    if (!result.success) {
      addToast({
        title: "Invalid URL",
        description: "Please enter a valid URL (usually starts with `https://`).",
        color: "warning",
      });
      return;
    }

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const focusNode = selection.focus.getNode();

        // Ensure we're only modifying one node at a time
        if (anchorNode === focusNode) {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, link);
        }
      }
    });

    setShowInsertLinkModal(false);
    setLinkUrl("");
  };

  // :::::::::::::::::::::::: Function: Unlink Text
  const unlinkText = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        nodes.forEach((node) => {
          const linkNode = $isLinkNode(node) ? node : node.getParent();

          if (linkNode && $isLinkNode(linkNode)) {
            const children = linkNode.getChildren();
            children.forEach((child) => linkNode.insertBefore(child));
            linkNode.remove();
            setShowInsertLinkModal(false);
          }
        });
      }
    });
  };

  return {
    insertLink,
    unlinkText,
  };
}

export default useLinkHook;