import { apiClient } from "../api/axiosClient.js";

export async function fetchCurrentWeek() {
  const response = await apiClient.get("/weekly/current");

  return response.data.data;
}