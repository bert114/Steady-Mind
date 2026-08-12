import express from "express";
import { validateSocialInteraction } from "./interaction.middleware.js";
import {
  createInteraction,
  getUserSocialInteractions,
} from "./interaction.controller.js";

const router = express.Router();

router.post("/", validateSocialInteraction, createInteraction);
router.get("/userInteraction/:id", getUserSocialInteractions);

export default router;
