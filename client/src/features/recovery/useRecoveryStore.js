import { create } from "zustand";

import { formatActivityList } from "./recovery.util";
import { recoveryService } from "./recovery.service";

export const useRecoveryStore = create((set, get) => ({
  recommendations: [],
  dashboardState: null,
  loading: false,
  error: null,

  // Fetch recommendations
  fetchRecommendations: async (clerkId) => {
    if (!clerkId) return;
    set({ loading: true, error: null });

    try {
      const res = await recoveryService.getRecommendations(clerkId);
      if (res.status === "success") {
        const formatted = formatActivityList(res.data.activities);
        set({ recommendations: formatted, loading: false });
      }
    } catch (err) {
      set({
        error: err.message || "Failed to load recovery activities",
        loading: false,
      });
    }
  },

  // Log a completed activity and automatically update store state
  completeActivity: async (
    clerkId,
    { interactionId = 1, activityId, rating = 5 },
  ) => {
    set({ loading: true, error: null });
    try {
      const res = await recoveryService.logAction(clerkId, {
        interactionId,
        activityId,
        rating,
      });

      if (res.status === "success") {
        // Filter out completed activity from local state
        set((state) => ({
          recommendations: state.recommendations.filter(
            (act) => act.id !== activityId,
          ),
          loading: false,
        }));
        return true;
      }
    } catch (err) {
      set({
        error: err.message || "Failed to submit recovery activity",
        loading: false,
      });
      return false;
    }
  },
}));
