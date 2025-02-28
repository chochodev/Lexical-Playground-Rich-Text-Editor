"use client";

import React, { useState, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import {
  FiItalic,
  FiLink,
  FiCode,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiRotateCcw,
  FiRotateCw,
} from "react-icons/fi";
import { LuPencilLine, LuBold, LuList, LuListOrdered } from "react-icons/lu";
import { TextFormatType, ElementFormatType, LexicalCommand } from "lexical";
import { Button, Separator } from "../tool-button";
import LinkModal from "../link-modal";
import { useToolbarStore } from "@/store";
import { useLinkHook } from '@/hooks';

type ToolbarAction = {
  icon: React.ReactNode;
  command:
    | TextFormatType
    | ElementFormatType
    | LexicalCommand<unknown>
    | "insertLink";
  type: "text" | "block" | "list" | "custom";
  label: string;
};

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { icon: <LuBold />, command: "bold", type: "text", label: "Bold" },
  { icon: <FiItalic />, command: "italic", type: "text", label: "Italic" },
  { icon: <FiCode />, command: "code", type: "text", label: "Code" },
  {
    icon: <FiAlignLeft />,
    command: "left",
    type: "block",
    label: "Align Left",
  },
  {
    icon: <FiAlignCenter />,
    command: "center",
    type: "block",
    label: "Align Center",
  },
  {
    icon: <FiAlignRight />,
    command: "right",
    type: "block",
    label: "Align Right",
  },
  {
    icon: <LuList />,
    command: INSERT_UNORDERED_LIST_COMMAND,
    type: "list",
    label: "Bullet List",
  },
  {
    icon: <LuListOrdered />,
    command: INSERT_ORDERED_LIST_COMMAND,
    type: "list",
    label: "Numbered List",
  },
  {
    icon: <FiLink />,
    command: "insertLink",
    type: "custom",
    label: "Insert Link",
  },
];

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [linkUrl, setLinkUrl] = useState("");
  const { setShowInsertLinkModal } = useToolbarStore();
  const [hoveredLink, setHoveredLink] = useState<{
    url: string;
    x: number;
    y: number;
  } | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);

  // :::::::::::::::::::::: Apply Command
  const applyCommand = (
    command: ToolbarAction["command"],
    type: ToolbarAction["type"],
  ) => {
    if (type === "custom" && command === "insertLink") {
      setShowInsertLinkModal(true);
      return;
    }

    editor.update(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) return;

      if ($isRangeSelection(selection)) {
        if (type === "text") {
          editor.dispatchCommand(
            FORMAT_TEXT_COMMAND,
            command as TextFormatType,
          );
        } else if (type === "block") {
          editor.dispatchCommand(
            FORMAT_ELEMENT_COMMAND,
            command as ElementFormatType,
          );
        } else if (type === "list") {
          editor.dispatchCommand(command as LexicalCommand<unknown>, undefined);
        }
      }
    });
  };

  // :::::::::::::::::::::: Hook: Manipulate Links (Insert, Unlink, Edit)
  const { insertLink, unlinkText } = useLinkHook({
    editor,
    setHoveredLink,
    setLinkUrl,
  });

  return (
    <div className="relative flex flex-wrap gap-2 rounded-md bg-gray-100 p-2">
      {TOOLBAR_ACTIONS.map(({ icon, command, type, label }, index) => (
        <div key={index} className="relative">
          <Button
            icon={icon}
            onClick={() => applyCommand(command, type)}
            label={label}
          >
            {icon}
          </Button>
        </div>
      ))}

      {/* ::::::::::::::::::::::: Separator */}
      <Separator />

      {/* Undo & Redo Buttons */}
      <Button
        icon={<FiRotateCcw />}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        label={"Undo"}
      ></Button>
      <Button
        icon={<FiRotateCw />}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        label={"Redo"}
      ></Button>

      {hoveredLink && (
        <button
          ref={buttonRef}
          className="ease-300 fixed z-[50] rounded-sm border border-solid border-neutral-300 bg-neutral-200 px-2 py-1.5 text-neutral-500 shadow-md hover:text-neutral-700 active:scale-95"
          style={{
            top: hoveredLink.y + 20,
            left: hoveredLink.x,
          }}
          onClick={() => {
            setLinkUrl(hoveredLink.url);
            setShowInsertLinkModal(true);
          }}
        >
          <LuPencilLine className="text-[1rem]" />
        </button>
      )}
      {/* :::::::::::::::::: Link Modal */}
      <LinkModal
        linkUrl={linkUrl}
        insertLink={insertLink}
        unlinkText={unlinkText}
      />
    </div>
  );
};

export default Toolbar;
