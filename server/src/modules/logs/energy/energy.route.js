import express from "express";
import Joi from "joi";
import validate from "../../../middleware/validate.js";
import {
  handleCreateEnergyLog,
  handleGetEnergyLog,
} from "./energy.controller.js";

const router = express.Router();

const energySchema = Joi.object({
  clerkId: Joi.string().required(),
  batteryLevel: Joi.number().integer().min(0).max(100).required(),
  moodScore: Joi.number().integer().min(1).max(10).required(),
  logDate: Joi.string().isoDate().optional(),
});

router.post("/", validate(energySchema), handleCreateEnergyLog);

router.get("/:clerkId", handleGetEnergyLog);

export default router;
