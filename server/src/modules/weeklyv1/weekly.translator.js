import { MOOD_LABELS } from "../analytics/analytics.constants.js";

const HIGH_BATTERY = 80;
const LOW_BATTERY = 50;
const DEPLETED_BATTERY = 30;

const ENERGIZING_DRAIN = 3;
const DRAINING_DRAIN = -3;

export function translateBattery(avg) {
  if (avg === null || avg === undefined) return null;
  if (avg >= HIGH_BATTERY) return "High";
  if (avg >= LOW_BATTERY) return "Steady";
  if (avg >= DEPLETED_BATTERY) return "Low";
  return "Depleted";
}

export function translateMood(avg) {
  if (avg === null || avg === undefined) return null;
  return MOOD_LABELS[Math.max(1, Math.min(5, Math.round(avg))) - 1];
}

export function translateDrain(avg) {
  if (avg === null || avg === undefined) return null;
  if (avg >= ENERGIZING_DRAIN) return "Energizing";
  if (avg >= 0) return "Neutral";
  if (avg >= DRAINING_DRAIN) return "Draining";
  return "Very draining";
}

export function translateWeekly({
  battery,
  mood,
  drain_score,
  interactionCount,
}) {
  return {
    battery: { value: battery, label: translateBattery(battery) },
    mood: { value: mood, label: translateMood(mood) },
    drain_score: { value: drain_score, label: translateDrain(drain_score) },
    interactionCount: { value: interactionCount },
  };
}
