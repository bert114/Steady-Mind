import { apiClient } from "../api/axiosClient.js";

export async function fetchAnalytics() {
  const response = await apiClient.get("/analytics");

  console.log(response.data.data);
  return response.data.data;
}
