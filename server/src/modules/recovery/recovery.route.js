import express from "express";
import {
  handleGetRecommendations,
  handleExecuteRecovery,
  handleGetDashboard,
} from "./recovery.controller.js";

const router = express.Router();

router.get("/dashboard/:clerkId", handleGetDashboard);
router.get("/recommendations/:clerkId", handleGetRecommendations);
router.post("/action/:clerkId", handleExecuteRecovery);

export default router;
