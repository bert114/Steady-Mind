import { apiClient } from "../api/axiosClient.js";

export const recoveryService = {
  getRecommendations: async (clerkId) => {
    const response = await apiClient.get(
      `/recovery/recommendations/${clerkId}`,
    );

    return response.data;
  },

  logAction: async (clerkId, { interactionId, activityId, rating }) => {
    const test = {
      activityId,
      interactionId,
      activityId,
      rating,
    };

    const response = await apiClient.post(`/recovery/action/${clerkId}`, {
      interactionId,
      activityId,
      rating,
    });
    return response.data;
  },

  getDashboardState: async (clerkId) => {
    const response = await apiClient.get(`/recovery/dashboard/${clerkId}`);
    return response.data;
  },
};
