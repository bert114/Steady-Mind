import express from "express";
import { validateSocialInteraction } from "./interaction.middleware.js";
import { createInteraction } from "./interaction.controller.js";

const router = express.Router();

router.post("/", validateSocialInteraction, createInteraction);

export default router;
