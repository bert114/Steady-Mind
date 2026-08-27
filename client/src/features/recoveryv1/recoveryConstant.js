export const RECOVERY_STATES = {
  DETECTED: "DETECTED",
  AVAILABLE: "AVAILABLE",
  SELECTED: "SELECTED",
  STARTED: "STARTED",
  COMPLETED: "COMPLETED",
  RATED: "RATED",
  ABANDONED: "ABANDONED",
};

export const DEFAULT_OPTIONS = [
  {
    id: "opt_walk",
    title: "Take a 10-minute walk",
    effort: "Low effort",
    durationMinutes: 10,
    description:
      "Find a comfortable path outside or around your space and take a short walk.",
    iconName: "walk",
    recommendationReason: "Usually helpful for you",
  },
  {
    id: "opt_music",
    title: "Listen to grounding music",
    effort: "Low effort",
    durationMinutes: 5,
    description:
      "Put on noise-canceling headphones and focus strictly on ambient rhythms.",
    iconName: "music",
  },
  {
    id: "opt_breath",
    title: "4-7-8 Breathing session",
    effort: "Low effort",
    durationMinutes: 3,
    description:
      "Inhale for 4 seconds, hold for 7, exhale for 8 to calm your nervous system.",
    iconName: "breath",
  },
];

export const RATING_OPTIONS = [
  { level: 1, emoji: "😞", label: "Didn't help" },
  { level: 2, emoji: "😐", label: "A little" },
  { level: 3, emoji: "🙂", label: "Helped" },
  { level: 4, emoji: "😊", label: "Helped a lot" },
];
