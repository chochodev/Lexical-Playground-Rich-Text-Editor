'use client';

import { useState, useRef } from 'react';
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
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuAlignJustify,
  LuQuote,
  LuCode,
} from 'react-icons/lu';
import { BiParagraph } from 'react-icons/bi';
import { Button as ToolButton, Separator } from './tool-button';
import LinkModal from '../link-modal';
import { Select, SelectItem } from '@heroui/react';
import { useToolbarStore } from '@/store';
import { useLinkHook, useFontFormat } from '@/hooks';
import { DEFAULT_FONT_SIZE } from '@/lib/utils';
import { type ToolbarAction } from '@/types/toolbar-type';
import { ColorPicker } from '../color-picker';

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { icon: <FiItalic />, command: 'italic', type: 'text', label: 'Italic' },
  { icon: <FiCode />, command: 'code', type: 'text', label: 'Code' },
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

export const TEXT_FORMAT_OPTIONS = [
  {
    key: 'root',
    label: 'None',
    icon: <LuPlus className="text-[1.25rem]" />,
    shortcut: '',
  },
  {
    key: 'paragraph',
    label: 'Paragraph',
    icon: <BiParagraph className="text-[1.5rem]" />,
    shortcut: 'Ctrl+Alt+0',
  },
  {
    key: 'h1',
    label: 'Heading 1',
    icon: <LuHeading1 className="text-[1.5rem]" />,
    shortcut: 'Ctrl+Alt+1',
  },
  {
    key: 'h2',
    label: 'Heading 2',
    icon: <LuHeading2 className="text-[1.5rem]" />,
    shortcut: 'Ctrl+Alt+2',
  },
  {
    key: 'h3',
    label: 'Heading 3',
    icon: <LuHeading3 className="text-[1.5rem]" />,
    shortcut: 'Ctrl+Alt+3',
  },
  {
    key: 'bullet',
    label: 'Bullet List',
    icon: <LuList className="text-[1.25rem]" />,
    shortcut: 'Ctrl+Alt+4',
  },
  {
    key: 'number',
    label: 'Numbered List',
    icon: <LuListOrdered className="text-[1.25rem]" />,
    shortcut: 'Ctrl+Alt+5',
  },
  {
    key: 'quote',
    label: 'Quote',
    icon: <LuQuote className="text-[1.25rem]" />,
    shortcut: 'Ctrl+Alt+Q',
  },
  {
    key: 'code',
    label: 'Code Block',
    icon: <LuCode className="text-[1.25rem]" />,
    shortcut: 'Ctrl+Alt+C',
  },
];

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ['Inter', 'Inter'],
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana'],
];

const FONT_WEIGHTS = [
  { key: 'normal', label: 'Normal' },
  { key: '400', label: '400' },
  { key: '500', label: '500' },
  { key: '600', label: '600' },
  { key: '700', label: '700' },
  { key: '800', label: '800' },
  { key: '900', label: '900' },
];

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [linkUrl, setLinkUrl] = useState('');
  const {
    setShowInsertLinkModal,
    textProperties,
    currentBlockType,
    currentAlignFormat,
  } = useToolbarStore();
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

  // :::::::::::::::::::::: Hook: Font Format
  const {
    changeFontSize,
    changeTextFormat,
    applyCommand,
    setFontWeight,
    setFontFamily,
    setTextColor,
    setBackgroundColor,
  } = useFontFormat();
  useFontFormat();

  return (
    <div className="relative flex flex-wrap gap-2 rounded-md bg-gray-50 p-2">
      <ToolButton
        icon={<LuBold />}
        onClick={() => {
          console.log(
            'font weight: ',
            textProperties.fontWeight,
            typeof textProperties.fontWeight
          );
          setFontWeight(textProperties.fontWeight === '600' ? 'normal' : '600');
        }}
        label="Bold"
      />
      {TOOLBAR_ACTIONS.map(({ icon, command, type, label }, index) => (
        <div key={index} className="relative">
          <ToolButton
            icon={icon}
            onClick={() => applyCommand(command, type)}
            label={label}
          >
            {icon}
          </ToolButton>
        </div>
      ))}

      {/* ::::::::::::::::::::::: Separator */}
      <Separator />

      <Select
        disableSelectorIconRotation
        aria-label="Block Type"
        variant="faded"
        radius="sm"
        size="sm"
        classNames={{
          base: 'w-[5.5rem] rounded-md',
          trigger: 'max-w-[5.5rem] rounded-md',
          popoverContent: 'w-[10rem] rounded-md',
          label: 'text-xsm',
        }}
        selectedKeys={new Set([currentBlockType])}
        onSelectionChange={(keys) => {
          // Convert the Set to an array and get the first item
          const selectedKey = Array.from(keys)[0] as string;
          if (selectedKey) {
            changeTextFormat(selectedKey);
          }
          console.log('block type', currentBlockType);
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
            : currentBlockType === 'root'
            ? 'Paragraph'
            : currentBlockType.charAt(0).toUpperCase() +
              currentBlockType.slice(1)
        }
        selectorIcon={<LuChevronsUpDown />}
      >
        <SelectItem key="paragraph" textValue="Paragraph">
          <div className="flex gap-2 items-center w-full">
            <BiParagraph className="text-[1.5rem]" />
            <span>Paragraph</span>
          </div>
        </SelectItem>
        <SelectItem key="h1" textValue="H1">
          <div className="flex gap-2 items-center w-full">
            <LuHeading1 className="text-[1.5rem]" />
            <span>Heading 1</span>
          </div>
        </SelectItem>
        <SelectItem key="h2" textValue="H2">
          <div className="flex gap-2 items-center w-full">
            <LuHeading2 className="text-[1.5rem]" /> <span>Heading 2</span>
          </div>
        </SelectItem>
        <SelectItem key="h3" textValue="H3">
          <div className="flex gap-2 items-center w-full">
            <LuHeading3 className="text-[1.5rem]" /> <span>Heading 3</span>
          </div>
        </SelectItem>
      </Select>

      <Select
        aria-label="Font Weight"
        classNames={{
          base: 'w-[5.5rem] rounded-md',
          trigger: 'max-w-[6rem] rounded-md',
          popoverContent: 'w-[8rem] rounded-md',
        }}
        variant="faded"
        radius="sm"
        size="sm"
        placeholder="Weight"
        selectedKeys={new Set([textProperties.fontWeight])}
        onSelectionChange={(keys) => {
          const selectedWeight = Array.from(keys)[0] as string;
          if (selectedWeight) {
            setFontWeight(String(selectedWeight));
          }
        }}
        selectorIcon={<LuChevronsUpDown />}
      >
        {FONT_WEIGHTS.map((weight) => (
          <SelectItem key={weight.key} textValue={weight.label}>
            {weight.label}
          </SelectItem>
        ))}
      </Select>

      <Select
        aria-label="Font Family"
        classNames={{
          base: 'w-[5.5rem] rounded-md',
          trigger: 'max-w-[6rem] rounded-md',
          popoverContent: 'w-[8rem] rounded-md',
        }}
        variant="faded"
        radius="sm"
        size="sm"
        placeholder="Family"
        selectedKeys={new Set([textProperties.fontFamily])}
        onSelectionChange={(keys) => {
          const selectedWeight = Array.from(keys)[0] as string;
          if (selectedWeight) {
            setFontFamily(String(selectedWeight));
          }
        }}
        selectorIcon={<LuChevronsUpDown />}
      >
        {FONT_FAMILY_OPTIONS.map(([option, text]) => (
          <SelectItem key={option} textValue={text}>
            {option}
          </SelectItem>
        ))}
      </Select>

      <Select
        disableSelectorIconRotation
        aria-label="Text Alignment"
        variant="faded"
        radius="sm"
        size="sm"
        classNames={{
          base: 'w-[5.5rem] rounded-md',
          trigger: 'max-w-[5.5rem] rounded-md',
          popoverContent: 'w-[10rem] rounded-md',
          label: 'text-xsm',
        }}
        selectedKeys={new Set([currentAlignFormat])}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as string;
          if (selectedKey) {
            applyCommand(selectedKey as ToolbarAction['command'], 'block');
          }
        }}
        placeholder={
          currentAlignFormat.charAt(0).toUpperCase() +
            currentAlignFormat.slice(1) || 'Left'
        }
        selectorIcon={<LuChevronsUpDown />}
      >
        <SelectItem key="left" textValue="Left">
          <div className="flex gap-2 items-center w-full">
            <LuAlignLeft className="text-[1.25rem]" />
            <span className="text-xsm font-[600]">Align Left</span>
          </div>
        </SelectItem>
        <SelectItem key="center" textValue="Center">
          <div className="flex gap-2 items-center w-full">
            <LuAlignCenter className="text-[1.25rem]" />
            <span className="text-xsm font-[600]">Align Center</span>
          </div>
        </SelectItem>
        <SelectItem key="right" textValue="Right">
          <div className="flex gap-2 items-center w-full">
            <LuAlignRight className="text-[1.25rem]" />
            <span className="text-xsm font-[600]">Align Right</span>
          </div>
        </SelectItem>
        <SelectItem key="justify" textValue="Justify">
          <div className="flex gap-2 items-center w-full">
            <LuAlignJustify className="text-[1.25rem]" />
            <span className="text-xsm font-[600]">Align Justify</span>
          </div>
        </SelectItem>
      </Select>

      {/* ::::::::::::::::::::::: Separator */}
      <Separator />

      {/* :::::::::::::::::::::::: Font Size Control */}
      <ToolButton
        icon={<LuMinus />}
        onClick={() => changeFontSize(false)}
        label={'Decrease Size'}
      />

      <input
        type="text"
        className="w-8 h-7 my-auto text-sm rounded-md border border-solid border-gray-200 text-center"
        placeholder={`${DEFAULT_FONT_SIZE}`}
        value={`${textProperties.fontSize}`}
        disabled
      />

      <ToolButton
        icon={<LuPlus />}
        onClick={() => changeFontSize(true)}
        label={'Increase Size'}
      />

      {/* ::::::::::::::::::::::: Color Picker */}
      <ColorPicker
        type="text"
        label="Text Color"
        onChange={(value) => setTextColor(value)}
      />
      <ColorPicker
        type="background"
        label="Background Color"
        onChange={(value) => setBackgroundColor(value)}
      />

      {/* insert image, list, font family */}

      {/* ::::::::::::::::::::::: Separator */}
      <Separator />

      {/* Undo & Redo Buttons */}
      <ToolButton
        icon={<FiRotateCcw />}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        label={'Undo'}
      />
      <ToolButton
        icon={<FiRotateCw />}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        label={'Redo'}
      />

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
