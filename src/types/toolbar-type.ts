import React from 'react';
import {
  TextFormatType,
  ElementFormatType,
  LexicalCommand,
} from 'lexical';

export type ToolbarAction = {
  icon: React.ReactNode;
  command:
    | TextFormatType
    | ElementFormatType
    | LexicalCommand<unknown>
    | 'insertLink'
    | 'increaseFontSize'
    | 'decreaseFontSize';
  type: 'text' | 'block' | 'list' | 'custom';
  label: string;
};