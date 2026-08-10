import { getAuth } from "@clerk/express";
import AppError from "../../utils/AppError.js";
import {
  insertEnergyLog,
  insertInteraction,
  fetchCopingActivities,
  insertCopingActivity,
} from "./services.js";

export const createEnergyLog = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const { log_date, battery_level, mood_score } = req.body;

    if (battery_level == null) {
      return next(new AppError("Missing required fields", 400));
    }

    const result = await insertEnergyLog("user_01abc123", {
      log_date: log_date || new Date().toISOString().split("T")[0],
      battery_level,
      mood_score,
    });

    res.status(201).json({
      message: "energy submitted",
      status: "success",
      result: { energyLog: result },
    });
  } catch (error) {
    next(error);
  }
};

export const createInteraction = async (req, res, next) => {
  try {
    const userId = req.auth?.userId || req.body.user_id || "user_03ghi789";
    const {
      daily_log_id,
      duration_minutes,
      drain_score,
      relationship_type_id,
      custom_name,
    } = req.body;

    if (!daily_log_id || duration_minutes == null || drain_score == null) {
      return next(new AppError("Missing required fields", 400));
    }

    const result = await insertInteraction(userId, {
      daily_log_id,
      duration_minutes,
      drain_score,
      relationship_type_id,
      custom_name,
    });

    res.status(201).json({ status: "success", data: { interaction: result } });
  } catch (error) {
    next(error);
  }
};

export const getCopingActivities = async (req, res, next) => {
  try {
    const userId = req.auth?.userId || req.query.user_id || "user_03ghi789";
    const activities = await fetchCopingActivities(userId);
    res.status(200).json({ status: "success", data: { activities } });
  } catch (error) {
    next(error);
  }
};

export const createCopingActivity = async (req, res, next) => {
  try {
    const userId = req.auth?.userId || req.body.user_id || "user_03ghi789";
    const { name, effort_level } = req.body;
    if (!name || !effort_level)
      return next(new AppError("Missing fields", 400));

    const activity = await insertCopingActivity(userId, { name, effort_level });
    res.status(201).json({ status: "success", data: { activity } });
  } catch (error) {
    next(error);
  }
};
