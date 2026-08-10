import AppError from "../../utils/AppError.js";
import { getUserData } from "./services.js";

export const getAnalytics = async (req, res, next) => {
  try {
    const mockUserId = "user_03ghi789";

    const result = await getUserData(mockUserId);

    res.status(200).json({
      status: "success",
      data: {
        ...result,
      },
    });
  } catch (error) {
    next(error);
  }
};
