import * as interactionService from "./interaction.service.js";
import AppError from "../../../utils/AppError.js";
import { RELATIONSHIP_ID_MAP } from "./interaction.utils.js";

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

    const savedInteraction = await interactionService.saveInteractionRecord({
      user_id,
      custom_name,
      duration_minutes,
      drain_score,
      timestamp,
      relationship_type_id,
    });

    console.log(savedInteraction);

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
