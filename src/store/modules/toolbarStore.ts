import { create } from "zustand";
import { DEFAULT_FONT_SIZE } from '@/lib/utils';

interface TextProperties {
  blockType: string;
  fontSize: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right" | "justify";
}

interface ToolbarStore {  
  showInsertLinkModal: boolean;
  setShowInsertLinkModal: (show: boolean) => void;

  currentBlockType: string;
  setCurrentBlockType: (type: string) => void;

  currentAlignFormat: string;
  setCurrentAlignFormat: (format: string) => void;

  textProperties: TextProperties;
  setTextProperties: (properties: Partial<TextProperties>) => void;
}

export const useToolbarStore = create<ToolbarStore>((set) => ({
  showInsertLinkModal: false,
  setShowInsertLinkModal: (show) => set({ showInsertLinkModal: show }),

  currentBlockType: "paragraph",
  setCurrentBlockType: (type) => set({ currentBlockType: type }),

  textProperties: {
    blockType: "paragraph",
    fontSize: DEFAULT_FONT_SIZE,
    fontFamily: "Arial",
    fontWeight: "normal",
    textAlign: "left",
  },

  currentAlignFormat: "left",
  setCurrentAlignFormat: (format) => set({ currentAlignFormat: format }),

  setTextProperties: (properties) =>
    set((state) => ({
      textProperties: { ...state.textProperties, ...properties },
    })),
}));
