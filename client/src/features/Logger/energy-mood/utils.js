export const buildPayload = (userId, energyLevel, mood) => ({
  clerkId: userId || "primary_user",
  logDate: new Date().toISOString(),
  batteryLevel: Number(energyLevel),
  moodScore: mood,
});
