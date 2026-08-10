export const buildPayload = (userId, energyLevel, mood) => ({
  userId: userId || "primary_user",
  timestamp: new Date().toISOString(),
  energyLevel: Number(energyLevel),
  mood,
});
