'use client';

import { useState, useEffect } from 'react';

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
import { ImageNode } from '@/nodes/ImageNode';

import Toolbar from './components/toolbar';
import { theme } from './components/theme';
import ImagesPlugin from '@/plugins/ImagesPlugin';
// import InlineImagePlugin from '@/plugins/InlineImagePlugin';

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
    ImageNode,
  ],
};

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Error in RichTextPlugin:', event.error);
      setHasError(true);
    };

    // Add a global error handler for the editor
    window.addEventListener('error', handleError);
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError) {
    return <div>An error occurred while rendering the content.</div>;
  }

  return <>{children}</>;
};

const Editor = ({ initialConfig = defaultConfig, onChange }: EditorProps) => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorComponent onChange={onChange} />
    </LexicalComposer>
  );
};

const EditorComponent = ({ onChange }: EditorProps) => {
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
    <div className="editor-container mx-auto my-4 w-full max-w-5xl">
      <div className="rounded-md border border-solid border-gray-200 p-2 sm:p-4">
        <Toolbar />
        <div className="editor-wrapper relative p-4">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor" />}
            placeholder={
              <span className="absolute left-4 top-4">Start writing...</span>
            }
            ErrorBoundary={ErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin />
          {/* {isRichText && (
            <> */}
              <ImagesPlugin />
              {/* <InlineImagePlugin editor={editor} /> */}
            {/* </> */}
          {/* )} */}
          <OnChangePlugin onChange={handleChange} />
        </div>
      </div>
    </div>
  );
};

export default Editor;
