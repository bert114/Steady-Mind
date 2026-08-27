export const buildPayload = (energyLevel, mood) => ({
  logDate: new Date().toISOString(),
  batteryLevel: Number(energyLevel),
  moodScore: mood,
});
