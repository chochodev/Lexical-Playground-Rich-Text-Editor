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
import { $isHeadingNode } from "@lexical/rich-text";

import { $patchStyleText } from '@lexical/selection';
import { useToolbarStore } from "@/store";
import {
  updateFontSizeInSelection,
  DEFAULT_FONT_SIZE,
  formatHeading,
  formatParagraph,
  formatBulletList,
  formatNumberedList,
  formatCheckList,
  formatQuote,
  formatCode
} from "@/lib/utils";
import { type ToolbarAction } from "@/types/toolbar-type";
import { TextFormatType, ElementFormatType } from "lexical";

const useFontFormat = () => {
  const [editor] = useLexicalComposerContext();
  const {
    setTextProperties,
    setCurrentBlockType,
    setShowInsertLinkModal,
    currentBlockType,
    setCurrentAlignFormat
  } = useToolbarStore();

  // :::::::::::::::::::::: Hook: Updates font styles from selected text
  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const selectedNodes = selection.getNodes().filter($isTextNode) as TextNode[];
          if (!selectedNodes.length) return;

          // Extract the font styles from the first selected node
          const firstNode = selectedNodes[0];
          const style = firstNode.getStyle();
          const match_font_size = style.match(/font-size:\s*(\d+)px/);
          const match_font_weight = style.match(/font-weight:\s*(\d+)/);
          const match_font_family = style.match(/font-family:\s*(\d+)/);

          const size = match_font_size ? parseInt(match_font_size[1]) : DEFAULT_FONT_SIZE;
          const weight = match_font_weight ? match_font_weight[1] : "normal";
          const family = match_font_family ? match_font_family[1] : "Arial";

          console.log('font family: ', family);

          setTextProperties({
            fontSize: size, fontWeight: String(weight), fontFamily: String(family)
          });
        });
      })

    return () => unregisterListener();
  }, [editor, setTextProperties]);

  // :::::::::::::::::::::: Hook: Updates Current Block Type & Align Format
  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const node = selection.anchor.getNode();
        const parent = node.getParent();

        if (!parent) return

        if (!$isHeadingNode(parent)) {
          setCurrentBlockType(
            parent.getType() || 'paragraph'
          );
        } else if ($isHeadingNode(parent)) {
          setCurrentBlockType(parent.getTag());
        }

        setCurrentAlignFormat(parent.getFormatType() || "left");
      });
    });

    return () => unregisterListener();
  }, [editor, setCurrentBlockType, setCurrentAlignFormat]);

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

        setTextProperties({ fontSize: newSize });
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
      setTextProperties({ fontSize: size });
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
      case "bullet":
        formatBulletList(editor, currentBlockType)
        break
      case "number":
        formatNumberedList(editor, currentBlockType)
        break
      case "check":
        formatCheckList(editor, currentBlockType)
        break
      case "quote":
        formatQuote(editor, currentBlockType)
        break
      case "code":
        formatCode(editor, currentBlockType)
        break
      default:
        break;
    }
  };

  // :::::::::::::::::::::: Function: Set Font Weight
  const setFontWeight = (fontWeight: string) => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        const newStyle = fontWeight === "normal"
          ? { "font-weight": null }
          : { "font-weight": fontWeight };

        $patchStyleText(selection, newStyle);
      }
    });
  };

  // :::::::::::::::::::::: Function: Set Font Family
  const setFontFamily = (fontFamily: string) => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          'font-family': fontFamily,
        });
      }
    });
  };

  return {
    changeFontSize,
    changeExactFontSize,
    changeTextFormat,
    setFontWeight,
    setFontFamily,
    applyCommand,
  };
};

export default useFontFormat;