import AppError from "../../../utils/AppError.js";
import throwError from "../../../utils/throwError.js";

export const validateDailyLog = (req, res, next) => {
  const { userId, energyLevel, mood } = req.body;

  if (!userId || typeof userId !== "string") {
    throwError("Validation Error: userId is required and must be a string.");
  }

  if (
    energyLevel === undefined ||
    typeof energyLevel !== "number" ||
    energyLevel < 0 ||
    energyLevel > 100
  ) {
    throwError(
      "Validation Error: energyLevel must be a number between 0 and 100.",
    );
  }

  if (!mood || typeof mood !== "string") {
    throwError("Validation Error: mood is required and must be a string.");
  }

  next();
};
