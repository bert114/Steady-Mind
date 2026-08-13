import { recordEnergyLog, fetchEnergyLog } from "./energy.service.js";

export async function handleCreateEnergyLog(req, res, next) {
  try {
    const { clerkId, batteryLevel, moodScore, logDate } = req.body;
    const result = await recordEnergyLog(
      clerkId,
      batteryLevel,
      moodScore,
      logDate,
    );

    res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetEnergyLog(req, res) {
  const { clerkId } = req.params;
  const { date } = req.query;

  const log = await fetchEnergyLog(clerkId, date);

  res.status(200).json({
    status: "success",
    data: log,
  });
}
