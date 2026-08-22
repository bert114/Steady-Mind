import { apiClient } from "../api/axiosClient.js";
import { id } from "../test/id.js";

export const recoveryService = {
  saveRecoveryActivity: async (payload) => {
    console.log("sending to db", payload);

    const response = await apiClient.post(`/recovery/action/${id}`, payload);

    return { success: true, message: response.data.message };
  },
};
