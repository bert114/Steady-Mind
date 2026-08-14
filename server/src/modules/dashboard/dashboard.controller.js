import throwError from "../../utils/throwError.js";
import { getDashboardSummary } from "./dashboard.service.js";

export const getDashboardData = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throwError("User ID parameter is required.", 400);
    }

    const dashboard = await getDashboardSummary(userId);

    res.status(200).json({
      status: "success",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};
