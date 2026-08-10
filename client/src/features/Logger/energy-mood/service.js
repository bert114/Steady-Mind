import { apiClient } from "../../api/axiosClient";

export const submit = async (payload) => {
  const response = await apiClient.post("/logs/energy", payload);
  return response.data;
};
