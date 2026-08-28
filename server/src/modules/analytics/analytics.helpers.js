import { MOOD_LABELS } from "./analytics.constants.js";

export const numberOrNull = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const dateKey = (value) => {
  if (!value) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
};

export const calendarDays = (days, now = new Date()) => {
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(end);
    date.setDate(end.getDate() - (days - index - 1));
    return date.toISOString().slice(0, 10);
  });
};

export const average = (values) => {
  const numbers = values.map(Number).filter(Number.isFinite);
  if (!numbers.length) return null;
  return Number(
    (numbers.reduce((sum, value) => sum + value, 0) / numbers.length).toFixed(
      1,
    ),
  );
};

export const moodLabel = (score) => {
  if (score === null) return null;
  return MOOD_LABELS[Math.max(1, Math.min(5, Math.round(score))) - 1];
};
