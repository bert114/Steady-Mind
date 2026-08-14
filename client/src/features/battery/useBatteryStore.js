import { create } from "zustand";

export const useBatteryStore = create((set) => ({
  percentage: 82,
  caption: "steady and clear",
  label: "Today",

  setPercentage: (level) =>
    set((state) => ({
      percentage: Math.max(0, Math.min(100, Number(level) || 0)),
    })),

  setBatteryData: (percentage, caption = "steady and clear", label = "Today") =>
    set({
      percentage: Math.max(0, Math.min(100, Number(percentage) || 0)),
      ...(caption && { caption }),
      ...(label && { label }),
    }),
}));
