'use client';

import { useState, useRef, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  UNDO_COMMAND,
  REDO_COMMAND,
} from 'lexical';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list';
import {
  FiItalic,
  FiLink,
  FiCode,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiRotateCcw,
  FiRotateCw,
} from 'react-icons/fi';
import {
  LuPencilLine,
  LuBold,
  LuList,
  LuListOrdered,
  LuPlus,
  LuMinus,
  LuChevronsUpDown,
  LuHeading1,
  LuHeading2,
  LuHeading3,
} from 'react-icons/lu';
import { BiParagraph } from 'react-icons/bi';
import { Button, Separator } from '../tool-button';
import LinkModal from '../link-modal';
import { Select, SelectItem } from '@heroui/react';
import { useToolbarStore } from '@/store';
import { useLinkHook, useFontSize } from '@/hooks';
// import { LexicalEditor } from 'lexical';
import { DEFAULT_FONT_SIZE } from '@/lib/utils';
import { type ToolbarAction } from '@/types/toolbar-type';

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { icon: <LuBold />, command: 'bold', type: 'text', label: 'Bold' },
  { icon: <FiItalic />, command: 'italic', type: 'text', label: 'Italic' },
  { icon: <FiCode />, command: 'code', type: 'text', label: 'Code' },
  {
    icon: <FiAlignLeft />,
    command: 'left',
    type: 'block',
    label: 'Align Left',
  },
  {
    icon: <FiAlignCenter />,
    command: 'center',
    type: 'block',
    label: 'Align Center',
  },
  {
    icon: <FiAlignRight />,
    command: 'right',
    type: 'block',
    label: 'Align Right',
  },
  {
    icon: <LuList />,
    command: INSERT_UNORDERED_LIST_COMMAND,
    type: 'list',
    label: 'Bullet List',
  },
  {
    icon: <LuListOrdered />,
    command: INSERT_ORDERED_LIST_COMMAND,
    type: 'list',
    label: 'Numbered List',
  },
  {
    icon: <FiLink />,
    command: 'insertLink',
    type: 'custom',
    label: 'Insert Link',
  },
];

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [linkUrl, setLinkUrl] = useState('');
  const { setShowInsertLinkModal, currentFontSize, currentBlockType } =
    useToolbarStore();
  const [hoveredLink, setHoveredLink] = useState<{
    url: string;
    x: number;
    y: number;
  } | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);

  

  // :::::::::::::::::::::: Hook: Manipulate Links (Insert, Unlink, Edit)
  const { insertLink, unlinkText } = useLinkHook({
    setHoveredLink,
    setLinkUrl,
  });

  const { changeFontSize, changeTextFormat, applyCommand } = useFontSize();
  useFontSize();
  

  return (
    <div className="relative flex flex-wrap gap-2 rounded-md bg-gray-50 p-2">
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

      {/* :::::::::::::::::::::::: Font Size Control */}
      <Button
        icon={<LuMinus />}
        onClick={() => changeFontSize(false)}
        label={'Decrease Size'}
      />

      <input
        type="text"
        className="w-8 h-7 my-auto text-sm rounded-md border border-solid border-gray-200 text-center"
        placeholder={`${DEFAULT_FONT_SIZE}`}
        value={`${currentFontSize}`}
        disabled
      />

      <Button
        icon={<LuPlus />}
        onClick={() => changeFontSize(true)}
        label={'Increase Size'}
      />

      {/* ::::::::::::::::::::::: Separator */}
      <Separator />

      {/* Undo & Redo Buttons */}
      <Button
        icon={<FiRotateCcw />}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        label={'Undo'}
      />
      <Button
        icon={<FiRotateCw />}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        label={'Redo'}
      />

      <Select
        disableSelectorIconRotation
        aria-label="Block Type"
        className="max-w-[4.5rem]"
        variant="faded"
        radius="sm"
        size="sm"
        selectedKeys={new Set([currentBlockType])}
        onSelectionChange={(keys) => {
          // Convert the Set to an array and get the first item
          const selectedKey = Array.from(keys)[0] as string;
          if (selectedKey) {
            changeTextFormat(selectedKey);
          }
        }}
        placeholder={
          currentBlockType === 'paragraph'
            ? 'P'
            : currentBlockType === 'h1'
            ? 'H1'
            : currentBlockType === 'h2'
            ? 'H2'
            : currentBlockType === 'h3'
            ? 'H3'
            : 'H0'
        }
        selectorIcon={<LuChevronsUpDown />}
      >
        <SelectItem key="paragraph" textValue="paragraph">
          <BiParagraph className="text-[1.5rem]" />
        </SelectItem>
        <SelectItem key="h1" textValue="h1">
          <LuHeading1 className="text-[1.5rem]" />
        </SelectItem>
        <SelectItem key="h2" textValue="h2">
          <LuHeading2 className="text-[1.5rem]" />
        </SelectItem>
        <SelectItem key="h3" textValue="h3">
          <LuHeading3 className="text-[1.5rem]" />
        </SelectItem>
      </Select>

      {hoveredLink && (
        <button
          ref={buttonRef}
          className="ease-300 fixed z-[50] rounded-md border border-solid border-neutral-200 bg-neutral-100 px-1.5 py-1 text-neutral-500 shadow-md hover:text-neutral-700 active:scale-95"
          style={{
            top: hoveredLink.y + 20,
            left: hoveredLink.x,
          }}
          onClick={() => {
            setLinkUrl(hoveredLink.url);
            setShowInsertLinkModal(true);
          }}
        >
          <LuPencilLine className="text-[0.875rem]" />
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
