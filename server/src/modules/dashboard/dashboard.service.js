import { calculateUserBurnoutRisk } from "../burnout/burnout.service.js";
import { formatLogDate } from "../burnout/burnout.utils.js";
import { getEnergyLogByDate } from "../logs/energy/energy.query.js";
import { getAllUserSocialInteractions } from "../logs/interactions/interaction.service.js";

export const getDashboardSummary = async (clerkUserId) => {
  const todayStr = formatLogDate(new Date());

  const burnoutRisk = await calculateUserBurnoutRisk(clerkUserId);

  const todayEnergy = await getEnergyLogByDate(clerkUserId, todayStr);

  const recentInteractions = await getAllUserSocialInteractions(clerkUserId);

  return {
    clerkUserId,
    metrics: {
      batteryLevel: todayEnergy ? todayEnergy.battery_level : null,
      moodScore: todayEnergy ? todayEnergy.mood_score : null,
      lastUpdated: todayEnergy ? todayEnergy.created_at : null,
    },
    burnoutRisk,
    recentInteractions: recentInteractions.slice(0, 5), // Return latest 5
  };
};
