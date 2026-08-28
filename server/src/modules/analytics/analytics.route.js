import express from "express";
import { requireAuth } from "@clerk/express";
import { handleGetAnalytics } from "./analytics.controller.js";

const router = express.Router();

router.get("/", requireAuth(), handleGetAnalytics);

export default router;
