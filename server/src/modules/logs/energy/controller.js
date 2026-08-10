import AppError from "../../../utils/AppError.js";
import * as dailyLogService from "./service.js";
import { mapMoodToScore } from "./utils.js";

export const createLog = async (req, res, next) => {
  try {
    const { userId, timestamp, energyLevel, mood } = req.body;
    const logDate = new Date().toISOString().split("T")[0];
    const moodScore = mapMoodToScore(mood);

    const newLog = await dailyLogService.insertLog(
      userId,
      logDate,
      energyLevel,
      moodScore,
    );

    res.status(201).json({
      status: "success",
      message: "Daily log created successfully",
      data: newLog,
    });
  } catch (error) {
    next(error);
  }
};

export const getLogs = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const logs = await dailyLogService.fetchLogsByUserId(userId);
    res.status(200).json({
      status: "success",
      results: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { energyLevel, mood } = req.body;

    const moodScore = mood ? mapMoodToScore(mood) : undefined;

    const updatedLog = await dailyLogService.modifyLog(
      id,
      energyLevel,
      moodScore,
    );

    if (!updatedLog) {
      return next(new AppError("Daily log not found.", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Daily log updated successfully",
      data: updatedLog,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedLog = await dailyLogService.removeLog(id);

    if (!deletedLog) {
      return next(new AppError("Daily log not found.", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Daily log deleted successfully",
      id: deletedLog.id,
    });
  } catch (error) {
    next(error);
  }
};
