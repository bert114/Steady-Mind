import express from "express";
import {
  handleGetRecommendations,
  handleExecuteRecovery,
  handleGetDashboard,
} from "./recovery.controller.js";
import Joi from "joi";
import validate from "../../middleware/validate.js";

const router = express.Router();

const logRecoverySessionSchema = Joi.object({
  id: Joi.required(),
  interact_id: Joi.number().integer().positive().allow(null).optional(),
  rating: Joi.number().integer().min(1).max(5).required(), // Based on CHECK constraint
  is_complete: Joi.required(),
  completedAt: Joi.date()
    .iso()
    .default(() => new Date().toISOString()),
});

router.get("/dashboard/:clerkId", handleGetDashboard);
router.get("/recommendations/:clerkId", handleGetRecommendations);
router.post(
  "/action/:clerkId",
  validate(logRecoverySessionSchema),
  handleExecuteRecovery,
);

export default router;
