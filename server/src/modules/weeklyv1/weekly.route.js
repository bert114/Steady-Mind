import { requireAuth } from "@clerk/express";
import express from "express";
import { handleWeeklyOverview } from "./weekly.controller.js";

const router = express.Router();

router.get("/current", requireAuth(), handleWeeklyOverview);
//router.get("/latest", requireAuth(), handleGetLatest);

export default router;
