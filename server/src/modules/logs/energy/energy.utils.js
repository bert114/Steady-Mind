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
