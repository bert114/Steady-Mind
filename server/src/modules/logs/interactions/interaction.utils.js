export const RELATIONSHIP_ID_MAP = {
  Friend: 1,
  Family: 2,
  Partner: 3,
  Coworker: 4,
  Manager: 5,
  Stranger: 6,
};

export const mapMoodToScore = (mood) => {
  const moodMap = {
    Happy: 5,
    Calm: 4,
    Neutral: 3,
    Restless: 2,
    Anxious: 1,
    Exhausted: 1,
  };
  return moodMap[mood] || 3;
};
