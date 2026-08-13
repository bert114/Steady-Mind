import throwError from "../../../utils/throwError.js";
import { RELATIONSHIP_ID_MAP } from "./interaction.utils.js";
import {
  getAllUserSocialInteractions,
  saveInteractionRecord,
} from "./interaction.service.js";

export const createInteraction = async (req, res, next) => {
  try {
    const {
      user_id,
      custom_name,
      relationship_type,
      duration_minutes,
      drain_score,
      timestamp,
    } = req.body;

    const relationship_type_id = relationship_type
      ? RELATIONSHIP_ID_MAP[relationship_type]
      : null;

    const { savedInteraction, burnoutRisk } = await saveInteractionRecord({
      user_id,
      custom_name: custom_name || null,
      duration_minutes,
      drain_score,
      timestamp,
      relationship_type_id,
    });

    res.status(201).json({
      status: "success",
      message:
        "Social interaction saved and burnout evaluation updated successfully.",
      data: {
        interaction: savedInteraction,
        burnoutRisk,
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
      status: "success",
      data: interactions,
    });
  } catch (error) {
    next(error);
  }
};
