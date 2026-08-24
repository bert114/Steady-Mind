import { apiClient } from "../api/axiosClient.js";

export const recoveryService = {
  saveRecoveryActivity: async (payload) => {
    console.log("sending to db", payload);

    const response = await apiClient.post(`/recovery/action`, payload);

    return { success: true, message: response.data.message };
  },
};
