import { create } from "zustand";
import { recoveryService } from "./recovery.service";
export const useRecoveryStore = create((set, get) => ({
  recommendations: [],
  dashboardState: null,
  loading: false,
  error: null,
  payload: { rating: null },

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
        set((state) => ({
          recommendations: state.recommendations.map((act) =>
            act.id === activityId
              ? { ...act, isCompleted: true, lastRating: rating }
              : act,
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

  addObject: (newObject) => {
    set((state) => ({
      payload: { ...state.payload, ...newObject },
    }));
  },
}));
