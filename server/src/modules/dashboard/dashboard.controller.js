import throwError from "../../utils/throwError.js";
import {
  fetchColumns,
  getDashboardSummary,
  getEnergyHistory,
  getHistory,
  getWeeklyInteraction,
} from "./dashboard.service.js";

export const getDashboardData = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throwError("User ID parameter is required.", 400);
    }

    const dashboard = await getDashboardSummary(userId);

    const moodAndBattery = await getHistory(userId);
    const weeklyInteraction = await getWeeklyInteraction(userId);

    res.status(200).json({
      status: "success",
      data: {
        moodAndBattery,
        weeklyInteraction,
        burnoutRisk: dashboard.burnoutRisk,
        batteryLevel: dashboard.metrics.batteryLevel,
      },
    });
  } catch (error) {
    next(error);
  }
};
