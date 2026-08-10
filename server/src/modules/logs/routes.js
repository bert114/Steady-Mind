import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import {
  createEnergyLog,
  createInteraction,
  getCopingActivities,
  createCopingActivity,
} from "./controller.js";

const router = express.Router();

router.use(clerkMiddleware());

// Protected endpoints: require auth when Clerk enabled upstream
router.post("/energy", createEnergyLog);
router.post("/interactions", createInteraction);
router.get("/coping", getCopingActivities);
router.post("/coping", createCopingActivity);

export default router;
