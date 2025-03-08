import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  TextNode,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  LexicalCommand,
} from "lexical";
import { $isHeadingNode, HeadingNode } from "@lexical/rich-text";
import { useToolbarStore } from "@/store";
import {
  updateFontSizeInSelection,
  DEFAULT_FONT_SIZE,
  formatHeading,
  formatParagraph
} from "@/lib/utils";
import { type ToolbarAction } from "@/types/toolbar-type";
import { TextFormatType, ElementFormatType } from "lexical";

const useFontFormat = () => {
  const [editor] = useLexicalComposerContext();
  const {
    setCurrentFontSize,
    setCurrentBlockType,
    setShowInsertLinkModal,
    currentBlockType
  } = useToolbarStore();

  // :::::::::::::::::::::: Extract font size from selected text
  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const selectedNodes = selection.getNodes().filter($isTextNode) as TextNode[];
          if (selectedNodes.length === 0) return;

          // Extract the font size from the first selected node
          const firstNode = selectedNodes[0];
          const style = firstNode.getStyle();
          const match = style.match(/font-size:\s*(\d+)px/);
          const size = match ? parseInt(match[1]) : DEFAULT_FONT_SIZE;

          setCurrentFontSize(size);
        });
      })

    return () => unregisterListener();
  }, [editor, setCurrentFontSize]);

  // :::::::::::::::::::::: Get Current Block Type
  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const node = selection.anchor.getNode();
        const parent = node.getParent();

        if (!parent) return

        console.log("Utils blockType: ", currentBlockType);
        
        if (parent.getType() !== "heading") {
          console.log("Utils Parent Type: ", parent.getType());
          setCurrentBlockType(
            parent.getType()
          );
        } else if (parent.getType() === "heading" && $isHeadingNode(parent)) {
          setCurrentBlockType(parent.getTag());
        }
      });
    });

    return () => unregisterListener();
  }, [editor, setCurrentBlockType]);

  // :::::::::::::::::::::: Function to change font size
  const changeFontSize = (increment: boolean) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const selectedNodes = selection.getNodes().filter($isTextNode) as TextNode[];
      if (selectedNodes.length === 0) return;

      selectedNodes.forEach((textNode) => {
        const style = textNode.getStyle();
        const match = style.match(/font-size:\s*(\d+)px/);
        const currentSize = match ? parseInt(match[1]) : DEFAULT_FONT_SIZE;

        const newSize = increment ?
          Math.min(42, currentSize + 2) : Math.max(10, currentSize - 2);
        updateFontSizeInSelection(editor, `${newSize}px`, null);

        setCurrentFontSize(newSize);
      });
    });
  };

  // :::::::::::::::::::::: Function: Apply Text Command
  const applyCommand = (
    command: ToolbarAction['command'],
    type: ToolbarAction['type']
  ) => {
    if (type === 'custom' && command === 'insertLink') {
      setShowInsertLinkModal(true);
      return;
    }

    editor.update(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) return;

      if ($isRangeSelection(selection)) {
        if (type === 'text') {
          editor.dispatchCommand(
            FORMAT_TEXT_COMMAND,
            command as TextFormatType
          );
        } else if (type === 'block') {
          editor.dispatchCommand(
            FORMAT_ELEMENT_COMMAND,
            command as ElementFormatType
          );
        } else if (type === 'list') {
          editor.dispatchCommand(command as LexicalCommand<unknown>, undefined);
        }
      }
    });
  };

  // :::::::::::::::::::::: Function: Change Font Size
  const changeExactFontSize = (size: number) => {
    if (!size) return;

    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const selectedNodes = selection.getNodes().filter($isTextNode) as TextNode[];
      if (!selectedNodes.length) return;

      updateFontSizeInSelection(editor, `${size}px`, null);
      setCurrentFontSize(size);
    });
  };

  // :::::::::::::::::::::: Function: Change Text format
  const changeTextFormat = (formatType: string) => {
    switch (formatType) {
      case 'paragraph':
        formatParagraph(editor);
        setCurrentBlockType("paragraph");
        break;
      case 'h1':
        formatHeading(editor, currentBlockType, 'h1');
        break;
      case 'h2':
        formatHeading(editor, currentBlockType, 'h2');
        break;
      case 'h3':
        formatHeading(editor, currentBlockType, 'h3');
        break;
      default:
        break;
    }
  };

  return { changeFontSize, changeExactFontSize, changeTextFormat, applyCommand };
};

export default useFontFormat;