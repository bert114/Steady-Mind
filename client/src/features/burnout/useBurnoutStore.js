import { create } from "zustand";

export const useBurnoutStore = create((set) => ({
  burnoutRisk: null,
  isLoading: false,
  error: null,
  setBurnoutData: (data) => set({ burnoutRisk: data }),
  fetchBurnoutRisk: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock API Response matching your JSON structure
      const mockApiResponse = {
        status: "success",
        data: {
          burnoutRisk: {
            riskLevel: "GREEN",
            title: "Stable",
            reasons: [
              "Your energy and interaction patterns show normal recovery levels.",
            ],
            signals: {
              currentBattery: 85,
              lowBatteryStreak: 0,
              highDrainStreak: 0,
            },
            evaluatedAt: "2026-08-13T13:19:54.158Z",
          },
        },
      };

      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ burnoutRisk: mockApiResponse.data.burnoutRisk, isLoading: false });
    } catch (err) {
      set({ error: "Failed to load burnout evaluation.", isLoading: false });
    }
  },
}));
