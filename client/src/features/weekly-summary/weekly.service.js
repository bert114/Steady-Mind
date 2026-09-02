import { apiClient } from "../api/axiosClient";

export async function fetchCurrentWeek() {
  const response = await apiClient.get("/weekly/v1/current");

  return response.data.data;
}
