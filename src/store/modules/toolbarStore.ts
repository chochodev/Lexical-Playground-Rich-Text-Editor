import { create } from "zustand";

interface ToolbarStore {  
  showInsertLinkModal: boolean;
  setShowInsertLinkModal: (show: boolean) => void;
}

export const useToolbarStore = create<ToolbarStore>((set) => ({
  showInsertLinkModal: false,
  setShowInsertLinkModal: (show) => set({ showInsertLinkModal: show }),
}));
