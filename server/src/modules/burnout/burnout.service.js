import {
  fetchRecentDailyLogs,
  fetchRecentInteractions,
  checkUserExists,
} from "./burnout.query.js";
import { formatBurnoutStatus } from "./burnout.utils.js";
import throwError from "../../utils/throwError.js";
import { evaluateBurnoutRisk } from "./burnout.helper.js";

export async function getUserBurnoutStatus(clerkId) {
  const exists = await checkUserExists(clerkId);
  if (!exists) {
    throwError(`User with ID '${clerkId}' not found.`, 404);
  }

  const dailyLogs = await fetchRecentDailyLogs(clerkId);
  const interactions = await fetchRecentInteractions(clerkId);

  const rawEvaluation = evaluateBurnoutRisk(dailyLogs, interactions);
  return formatBurnoutStatus(rawEvaluation);
}
