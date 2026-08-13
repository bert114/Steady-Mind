import express from "express";
import Joi from "joi";
import validate from "../../../middleware/validate.js";
import {
  createInteraction,
  getUserSocialInteractions,
} from "./interaction.controller.js";

const router = express.Router();

const interactionSchema = Joi.object({
  user_id: Joi.string().trim().required(),
  relationship_type: Joi.string()
    .valid("Friend", "Family", "Partner", "Coworker", "Manager", "Stranger")
    .optional(),
  custom_name: Joi.string().trim().max(100).optional(),
  duration_minutes: Joi.number().integer().positive().required(),
  drain_score: Joi.number().integer().min(-5).max(5).required(),
  timestamp: Joi.string().isoDate().optional(),
}).or("relationship_type", "custom_name");

router.post("/", validate(interactionSchema), createInteraction);

router.get("/userInteraction/:id", getUserSocialInteractions);

export default router;
