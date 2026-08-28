import { getAuth } from "@clerk/express";
import { getAnalytics } from "./analytics.service.js";

export async function handleGetAnalytics(req, res, next) {
  try {
    const { userId } = getAuth(req);
    const data = await getAnalytics(userId);

    res.status(200).json({ status: "success", data });
  } catch (error) {
    next(error);
  }
}
