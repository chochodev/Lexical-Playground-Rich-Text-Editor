import { create } from "zustand";
import { LexicalEditor } from 'lexical';

interface EditorStore {  
  activeEditor: LexicalEditor;
  setActiveEditor: (show: LexicalEditor) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  activeEditor: null,
  setActiveEditor: (value) => set({ activeEditor: value }),
}));
