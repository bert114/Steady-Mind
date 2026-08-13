import { getUserBurnoutStatus } from "./burnout.service.js";

export async function handleGetBurnoutStatus(req, res, next) {
  try {
    const { clerkId } = req.params;
    const burnoutStatus = await getUserBurnoutStatus(clerkId);

    res.status(200).json({
      status: "success",
      data: burnoutStatus,
    });
  } catch (error) {
    next(error);
  }
}
