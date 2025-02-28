'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

// Import necessary nodes
import { ListNode, ListItemNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { LinkNode } from '@lexical/link';
import { CodeNode } from '@lexical/code';
import { ParagraphNode, TextNode } from 'lexical';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';

import Toolbar from './components/toolbar';
import { theme } from './components/theme';

export interface EditorProps {
  initialConfig?: any;
  onChange?: (editorState: any) => void;
}

const defaultConfig = {
  namespace: 'MyEditor',
  theme,
  onError(error: any) {
    console.error(error);
  },
  nodes: [
    ParagraphNode,
    TextNode,
    ListNode,
    ListItemNode,
    HeadingNode,
    QuoteNode,
    LinkNode,
    CodeNode,
    HorizontalRuleNode,
  ],
};

const Editor = ({ initialConfig = defaultConfig, onChange }: EditorProps) => {
  const handleChange = (editorState: any) => {
    editorState.read(() => {
      if (onChange) {
        onChange(editorState);
      }

      const jsonContent = JSON.stringify(editorState.toJSON(), null, 2);
      console.log('Editor Content (JSON):', jsonContent);
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container mx-auto my-4 w-full max-w-5xl">
        <div className="rounded-md border border-solid border-gray-200 p-2 sm:p-4">
          <Toolbar />
          <div className="editor-wrapper relative p-4">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor" />}
              placeholder={
                <span className="absolute left-4 top-4">Start writing...</span>
              }
              ErrorBoundary={(error) => <p>Error: {error.children}</p>}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
            <MarkdownShortcutPlugin />
            <OnChangePlugin onChange={handleChange} />
          </div>
        </div>
      </div>
    </LexicalComposer>
  );
};

export default Editor;
