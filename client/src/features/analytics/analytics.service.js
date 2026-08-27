import { apiClient } from "../api/axiosClient.js";

export async function fetchAnalytics() {
  const response = await apiClient.get("/analytics");
  return response.data.data;
}
