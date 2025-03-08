import { create } from "zustand";

interface ToolbarStore {  
  showInsertLinkModal: boolean;
  setShowInsertLinkModal: (show: boolean) => void;

  currentFontSize: number;
  setCurrentFontSize: (size: number) => void;
  currentBlockType: string;
  setCurrentBlockType: (type: string) => void;
}

export const useToolbarStore = create<ToolbarStore>((set) => ({
  showInsertLinkModal: false,
  setShowInsertLinkModal: (show) => set({ showInsertLinkModal: show }),

  currentFontSize: 14,
  setCurrentFontSize: (size) => set({ currentFontSize: size }),

  currentBlockType: "paragraph",
  setCurrentBlockType: (type) => set({ currentBlockType: type }),
}));
