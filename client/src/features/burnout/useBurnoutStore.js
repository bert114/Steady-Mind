import { create } from "zustand";

export const useBurnoutStore = create((set) => ({
  burnoutRisk: null,
  isLoading: false,
  error: null,
  setBurnoutData: (data) => set({ burnoutRisk: data }),
  fetchBurnoutRisk: async (userId) => {
    if (!userId) {
      console.warn("No user ID provided to fetchBurnoutRisk");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/v1/burnout/${userId}`);

      const result = await response.json();

      set({
        burnoutRisk: result.data.burnoutRisk,
        isLoading: false,
      });
    } catch (err) {
      console.error("Error fetching burnout risk:", err);
      set({
        error: "Failed to load burnout evaluation.",
        isLoading: false,
      });
    }
  },
}));
