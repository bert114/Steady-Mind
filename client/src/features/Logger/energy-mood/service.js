import { apiClient } from "../../api/axiosClient";

export const submit = async (payload) => {
  const response = await apiClient.post("/logs/energy", payload);

  console.log("Response from server:", response.data);

  return response.data;
};
