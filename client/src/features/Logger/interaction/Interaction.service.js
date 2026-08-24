import { apiClient } from "../../api/axiosClient.js";
import { id } from "../../test/id.js";

export const socialService = {
  logInteraction: async (interactionPayload) => {
    try {
      const response = await apiClient.post(
        "/logs/interactions",
        interactionPayload,
      );

      return response.data;
    } catch (error) {
      console.error("Service Error: Failed to log interaction", error);
      throw error;
    }
  },

  getUserInteractions: async (userId) => {
    const response = await apiClient.get(`/logs/interactions/userInteraction/`);

    return response.data;
  },
};
