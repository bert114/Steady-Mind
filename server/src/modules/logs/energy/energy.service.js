import { upsertDailyLog, getEnergyLogByDate } from "./energy.query.js";
import { calculateUserBurnoutRisk } from "../../burnout/burnout.service.js";
import throwError from "../../../utils/throwError.js";
import { formatLogDate } from "../../burnout/burnout.utils.js";

export async function recordEnergyLog(
  clerkId,
  batteryLevel,
  moodScore,
  rawDate,
) {
  const logDate = formatLogDate(rawDate);

  // 1. Save or update daily log entry
  const dailyLog = await upsertDailyLog(
    clerkId,
    logDate,
    batteryLevel,
    moodScore,
  );

  // 2. Re-evaluate burnout risk based on updated daily log
  const burnoutRisk = await calculateUserBurnoutRisk(clerkId);

  return {
    dailyLog,
    burnoutRisk,
  };
}

export async function fetchEnergyLog(clerkId, rawDate) {
  const logDate = formatLogDate(rawDate);
  const log = await getEnergyLogByDate(clerkId, logDate);

  if (!log) {
    throwError(`No energy log found for date ${logDate}`, 404);
  }

  return log;
}
