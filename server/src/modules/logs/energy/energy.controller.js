import { getAuth } from "@clerk/express";
import { fetchEnergyLog, recordEnergyLog } from "./energy.service.js";

export async function handleCreateEnergyLog(req, res, next) {
  try {
    const { batteryLevel, moodScore, logDate } = req.body;

    const { userId: clerkId } = getAuth(req);

    const result = await recordEnergyLog(
      clerkId,
      batteryLevel,
      moodScore,
      logDate,
    );

    console.log(result);

    res.status(201).json({
      message: "energy log updated",
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetEnergyLog(req, res) {
  const { date } = req.query;

  const { userId: clerkId } = getAuth(req);

  const log = await fetchEnergyLog(clerkId, date);

  res.status(200).json({
    status: "success",
    data: log,
  });
}
