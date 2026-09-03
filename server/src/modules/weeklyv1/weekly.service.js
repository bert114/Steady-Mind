import db from "../../config/db.js";
import {
  calculateAverages,
  formatLogDates,
  getAverageDrainScore,
  getDetailedDrainingMessages,
  getHighestDrain,
} from "./weekly.helper.js";
import { GET_WEEKLYINTERACTIONS, weeklyBattery_Mood } from "./weekly.query.js";

async function getWeeklyOverview(userId) {
  const result = await db.query(weeklyBattery_Mood, [userId]);
  const interactions = await db.query(GET_WEEKLYINTERACTIONS, [userId]);

  const cleanInteraction = formatLogDates(interactions);

  const drainDetection = getDetailedDrainingMessages(cleanInteraction);

  const { averageBattery, averageMood } = calculateAverages(result);
  const highestDrainRelationship = getHighestDrain(interactions);

  return {
    averageBattery,
    averageMood: Math.floor(averageMood),
    interaction: {
      average: getAverageDrainScore(interactions),
      total: interactions.length,
      burnoutDetected: drainDetection,
    },
  };
}

export { getWeeklyOverview };
