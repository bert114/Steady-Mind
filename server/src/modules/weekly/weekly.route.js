import { requireAuth } from "@clerk/express";
import express from "express";
import {
  handleGetCurrentWeek,
  handleGetLatest,
} from "./weekly.controller.js";

const router = express.Router();

router.get("/current", requireAuth(), handleGetCurrentWeek);
router.get("/latest", requireAuth(), handleGetLatest);

export default router;