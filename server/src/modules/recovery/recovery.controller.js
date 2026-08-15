import { id } from "../../../../client/src/features/test/id.js";
import {
  getRecoveryRecommendations,
  getUserDashboardState,
  logRecoveryAction,
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
    const { interactionId, activityId, rating } = req.body;

    const session = await logRecoveryAction(
      clerkId,
      interactionId,
      activityId,
      rating,
    );

    res.status(201).json({
      status: "success",
      data: session,
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
