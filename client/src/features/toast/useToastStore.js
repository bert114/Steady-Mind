import { create } from "zustand";

export const useToastStore = create((set) => ({
  isOpen: false,
  message: "",
  type: "success",
  duration: 3000,
  showToast: (message, type = "success", duration = 3000) =>
    set({ isOpen: true, message, type, duration }),
  hideToast: () => set({ isOpen: false }),
}));
