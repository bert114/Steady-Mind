import { getAuth } from "@clerk/express";
import { getWeeklyOverview } from "./weekly.service.js";

export async function handleWeeklyOverview(req, res, next) {
  try {
    const { userId } = getAuth(req);

    const data = await getWeeklyOverview(userId);

    res.status(200).json({ status: "success", data });
  } catch (error) {
    next(error);
  }
}
