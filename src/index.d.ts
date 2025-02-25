declare module "@chocho/lexicaleditor" {
  import { ReactNode } from "react";

  export interface EditorProps {
    initialConfig?: any;
    onChange?: (editorState: any) => void;
  }

  export const Editor: (props: EditorProps) => ReactNode;
}
