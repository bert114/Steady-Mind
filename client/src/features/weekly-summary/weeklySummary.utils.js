export const MOOD_LABELS = ["Very Low", "Low", "Okay", "Good", "Great"];

export const formatNumber = (value, suffix = "") =>
  value === null || value === undefined ? "--" : `${value}${suffix}`;

export const moodLabel = (score) => {
  if (score === null || score === undefined) return null;
  return MOOD_LABELS[Math.max(1, Math.min(5, Math.round(score))) - 1];
};

export const hasSummaryData = (data) =>
  !!data &&
  ((data.energy?.average != null ||
    data.mood?.average != null ||
    data.drain?.average != null) ||
    (data.interactions?.length ?? 0) > 0);

export const buildFeltMetrics = (data) => [
  {
    label: "Average energy",
    value: formatNumber(data.energy?.average),
    detail: `/ 100 · ${data.energy?.loggedDays ?? 0} logged days`,
  },
  {
    label: "Average mood",
    value: moodLabel(data.mood?.average) || "--",
    detail: `${formatNumber(data.mood?.average)}/5`,
  },
];
