import { getAuth } from "@clerk/express";
import {
  getBurnoutScore,
  getCurrentWeekInsight,
  getWeeklyEnergy,
  numberOfInteractions,
} from "./weekly.service.js";
import { translateWeekly } from "./weekly.translator.js";

export async function handleGetCurrentWeek(req, res, next) {
  try {
    const { userId } = getAuth(req);

    const battery = await getCurrentWeekInsight(userId, "battery");
    const mood = await getCurrentWeekInsight(userId, "mood");
    const drain_score = await getCurrentWeekInsight(userId, "drain_score");
    const interactionCount = await numberOfInteractions(userId);

    const weeklyEnergy = await getWeeklyEnergy(userId);
    const burnoutSummary = await getBurnoutScore(userId);

    console.log(burnoutSummary);

    //const data = await getCurrentWeekInsight(userId);

    const insight = translateWeekly({
      battery,
      mood,
      drain_score,
      interactionCount,
    });

    res.status(200).json({
      status: "success",
      data: {
        weeklyOverview: insight,
        weeklyEnergy: weeklyEnergy,
        burnoutSummary: burnoutSummary,
      },
    });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
}

export async function handleGetLatest(req, res, next) {
  try {
    const { userId } = getAuth(req);
    const data = await getLatestInsight(userId);

    res.status(200).json({ status: "success", data });
  } catch (error) {
    next(error);
  }
}
