import { getAuth } from "@clerk/express";
import {
  getCurrentWeekInsight,
  getLatestInsight,
} from "./weekly.service.js";

export async function handleGetCurrentWeek(req, res, next) {
  try {
    const { userId } = getAuth(req);
    const data = await getCurrentWeekInsight(userId);

    res.status(200).json({ status: "success", data });
  } catch (error) {
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