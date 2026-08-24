export const recoveryService = {
  async logRecoveryEvent(payload) {
    try {
      console.log("[RecoveryService] Payload logged:", payload);

      return { success: true };
    } catch (error) {
      console.error("[RecoveryService] Error logging payload:", error);
      return { success: false, error };
    }
  },

  getRecomendation: async (id) => {
    const response = await apiClient.post(`/recovery/action/${clerkId}`, {
      interactionId,
      activityId,
      rating,
    });

    return response.data;
  },

  logAction: async (clerkId, { interactionId, activityId, rating }) => {
    activityId: "opt_breath";
    rating: 4;

    const test = {
      activityId,
      rating,

      interactionId,
      activityId,
    };

    const response = await apiClient.post(`/recovery/action/${clerkId}`, {
      interactionId,
      activityId,
      rating,
    });

    return response.data;
  },
};
