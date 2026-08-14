import { create } from "zustand";

export const useDashboardStore = create((set) => ({
  dashboardData: null,
  isLoading: false,
  error: null,

  setDashboardData: (data) => set({ dashboardData: data }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
