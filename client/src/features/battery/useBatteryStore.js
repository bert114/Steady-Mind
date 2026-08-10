import { create } from "zustand";

export const useBatteryStore = create((set) => ({
  percentage: 82,
  caption: "steady and clear",
  label: "Today",
  setBatteryData: (percentage, caption = "steady and clear", label = "Today") =>
    set({
      percentage: Math.max(0, Math.min(100, percentage)),
      ...(caption && { caption }),
      ...(label && { label }),
    }),
}));
