import db from "../../config/db.js";
import {
  calculateAverage,
  formatLogDates,
  identifyBurnoutDays,
} from "./weekly.helper.js";
import Weekly, { WeeklyEnergy } from "./weekly.query.js";

export async function getCurrentWeekInsight(userId, table) {
  let query = "";

  switch (table) {
    case "battery":
      query = Weekly.battery;
      break;
    case "mood":
      query = Weekly.mood;
      break;
    case "drain_score":
      query = Weekly.drain_score;
      break;
    default:
      throw new Error("Invalid table specified");
  }

  const result = await db.query(query, [userId]);

  const { total, log_count } = result[0];

  return calculateAverage(total, log_count);
}

export async function numberOfInteractions(userId) {
  const result = await db.query(Weekly.social_interactions_count, [userId]);

  const { total } = result[0];

  return total;
}

export async function getWeeklyEnergy(userId) {
  const result = await db.query(WeeklyEnergy.getWeeklyEnergy, [userId]);

  return formatLogDates(result);
}

export async function getBurnoutScore(userId) {
  const result = await db.query(Weekly.burnout_score, [userId]);

  const formattedResult = formatLogDates(result);

  const burnoutDays = identifyBurnoutDays(formattedResult);

  return burnoutDays;
}
