import express from "express";
import Joi from "joi";
import validate from "../../../middleware/validate.js";
import {
  handleCreateEnergyLog,
  handleGetEnergyLog,
} from "./energy.controller.js";
import { cleanData } from "./energy.middleware.js";

const router = express.Router();

const energySchema = Joi.object({
  clerkId: Joi.string().required(),
  batteryLevel: Joi.number().integer().min(0).max(100).required(),
  moodScore: Joi.string().required(),
  logDate: Joi.string().isoDate().optional(),
});

router.post("/", validate(energySchema), cleanData, handleCreateEnergyLog);

router.get("/:clerkId", handleGetEnergyLog);

export default router;
