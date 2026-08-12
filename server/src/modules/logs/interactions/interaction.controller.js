import AppError from "../../../utils/AppError.js";
import { RELATIONSHIP_ID_MAP } from "./interaction.utils.js";
import throwError from "../../../utils/throwError.js";
import {
  getAllUserSocialInteractions,
  saveInteractionRecord,
} from "./interaction.service.js";

export const createInteraction = async (req, res, next) => {
  try {
    const {
      user_id,
      custom_name,
      duration_minutes,
      drain_score,
      timestamp,
      relationship_type_id,
    } = req.body;

    console.log(req.body);

    const savedInteraction = await saveInteractionRecord({
      user_id,
      custom_name,
      duration_minutes,
      drain_score,
      timestamp,
      relationship_type_id,
    });

    res.status(201).json({
      status: "success",
      message: "Social interaction saved and dashboard updated successfully.",
      data: {
        interaction: savedInteraction,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSocialInteractions = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throwError("User ID is required.", 400);
    }

    const interactions = await getAllUserSocialInteractions(id);

    return res.status(200).json({
      success: true,
      data: interactions,
    });
  } catch (error) {
    next(error);
  }
};
