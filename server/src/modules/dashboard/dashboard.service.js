import db from "../../config/db.js";
import { calculateUserBurnoutRisk } from "../burnout/burnout.service.js";
import { formatLogDate } from "../burnout/burnout.utils.js";
import { getEnergyLogByDate } from "../logs/energy/energy.query.js";
import { getAllUserSocialInteractions } from "../logs/interactions/interaction.service.js";
import { getLatestInsight } from "../weekly/weekly.service.js";
import { FETCH_HISTORY } from "./dashboard.query.js";
import {
  buildCustomQuery,
  buildQuerySelect,
  formatWeeklyData,
  formatWeeklyMood,
} from "./dashboard.utils.js";

export const getDashboardSummary = async (clerkUserId) => {
  const todayStr = formatLogDate(new Date());

  const burnoutRisk = await calculateUserBurnoutRisk(clerkUserId);

  const todayEnergy = await getEnergyLogByDate(clerkUserId, todayStr);

  const recentInteractions = await getAllUserSocialInteractions(clerkUserId);

  const weeklyInsight = await getLatestInsight(clerkUserId);

  return {
    clerkUserId,
    metrics: {
      batteryLevel: todayEnergy ? todayEnergy.battery_level : null,
      moodScore: todayEnergy ? todayEnergy.mood_score : null,
      lastUpdated: todayEnergy ? todayEnergy.created_at : null,
    },
    burnoutRisk,
    recentInteractions: recentInteractions.slice(0, 5), // Return latest 5
    weeklyInsight,
  };
};

export const getEnergyHistory = async (clerkUserId) => {
  const result = await db.query(FETCH_HISTORY, [clerkUserId]);

  const weeklyMood = formatWeeklyMood(result);
  const weeklyData = formatWeeklyData(result);

  const fields = ["battery_level"];
  const query = fetchColumns({
    tableName: "social_interactions",
    userId: clerkUserId,
    arrayOfFields: fields,
    additionalClause: `AND log_date >= CURRENT_DATE - INTERVAL '7 days' ORDER BY log_date DESC`,
  });

  const testWeeklyData = fetchColumns({
    tableName: "social_interactions",
    userId: clerkUserId,
    arrayOfFields: ["log_date", "mood_score", "battery_level"],
    additionalClause: `AND log_date >= CURRENT_DATE - INTERVAL '7 days' ORDER BY log_date DESC`,
  });

  console.log(query);

  return { result, weeklyMood, weeklyData };
};

export const fetchColumns = ({
  userId,
  arrayOfFields,
  additionalClause,
  tableName,
}) => {
  const logFields = ["log_date", "mood_score", "battery_level"];
  const query = buildQuerySelect(
    tableName,
    arrayOfFields,
    userId,
    additionalClause,
  );

  return query;
};

export const getHistory = async (userId) => {
  const query = buildQuerySelect({
    tableName: "daily_logs",
    userId,
    arrayOfFields: ["log_date", "mood_score", "battery_level"],
    additionalClause: `AND log_date >= CURRENT_DATE - INTERVAL '7 days' ORDER BY log_date DESC`,
  });

  const response = await db.query(query, [userId]);

  return formatWeeklyData(response);
};

export const getWeeklyInteraction = async (userId) => {
  const query = buildCustomQuery({
    selectFields: [
      "si.id",
      "si.duration_minutes",
      "si.drain_score",
      "si.interaction_time",
      "si.custom_name",
      "rt.name as relationship_type",
    ],
    fromTable: "social_interactions si",
    joins: [
      "LEFT JOIN relationship_types rt ON si.relationship_type_id = rt.id",
      "JOIN daily_logs dl ON si.daily_log_id = dl.id",
    ],
    whereClause: "dl.user_id = $1",
    orderBy: "si.interaction_time DESC",
    limit: 10,
  });

  const response = await db.query(query, [userId]);

  return response;
};
