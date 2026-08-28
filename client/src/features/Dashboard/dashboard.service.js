import { apiClient } from "../api/axiosClient";
import { id } from "../test/id";
import { useDashboardStore } from "./useDashboard.store";

export const fetchDashboardData = async (userId) => {
  const response = await apiClient.get(`/dashboard/${userId}`);

  return response.data.data;
};

export const refreshDashboard = async (userId = id) => {
  const refresh = useDashboardStore.getState().setDashboardData;
  const response = await apiClient.get(`/dashboard/${userId}`);

  refresh(response.data.data);
};
