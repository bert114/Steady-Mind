import { id } from "../../../../client/src/features/test/id.js";
import {
  calculateAvgRating,
  getRecoveryRecommendations,
  getUserDashboardState,
  logRecoveryAction,
  logSession,
} from "./recovery.service.js";

export async function handleGetRecommendations(req, res, next) {
  try {
    const { clerkId } = req.params;
    const recommendations = await getRecoveryRecommendations(id);

    //console.log(recommendations);

    res.status(200).json({
      status: "success",
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleExecuteRecovery(req, res, next) {
  try {
    const { clerkId } = req.params;

    const { interact_id, id, rating, is_complete } = req.body;

    const session = await logSession({
      completedAt: new Date().toISOString().split("T")[0],
      interact_id,
      id,
      rating,
      is_complete,
    });

    const calculation = await calculateAvgRating(clerkId);

    const bestPerformedActivites = calculation;

    res.status(201).json({
      message: `activity has been saved`,
      status: "success",
      data: { calculation, session, bestPerformedActivites },
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetDashboard(req, res, next) {
  try {
    const { clerkId } = req.params;
    const dashboard = await getUserDashboardState(clerkId);

    res.status(200).json({
      status: "success",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
}
