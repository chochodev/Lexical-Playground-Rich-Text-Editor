import { create } from "zustand";

interface AlertStore {
  alert: {
    title: string;
    message: string;
    isOpen: boolean;
    type?: "success" | "warning" | "default" | "primary" | "secondary" | "danger"
  };
  setAlert: (
    alert: {
      title: string;
      message: string;
      type?: "success" | "warning" | "default" | "primary" | "secondary" | "danger";
    }) => void;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alert: {
    title: "",
    message: "",
    isOpen: false,
    type: "default"
  },
  setAlert: ({ title, message, type }) => set({
    alert: { title, message, isOpen: true, type: type || "default" }
  }),
  closeAlert: () => set({
    alert: {
      title: "",
      message: "",
      isOpen: false,
      type: "default"
    }
  }),
}));
