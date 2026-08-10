import express from "express";
import { requireAuth } from "@clerk/express";
import { getAnalytics } from "./controller.js";

const router = express.Router();

// clerk yawa ka
router.get("/analytics", getAnalytics);

export default router;
