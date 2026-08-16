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

  const dailyLog = await upsertDailyLog(
    clerkId,
    logDate,
    batteryLevel,
    moodScore,
  );

  const burnoutRisk = await calculateUserBurnoutRisk(clerkId);

  console.log("check", dailyLog);

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
