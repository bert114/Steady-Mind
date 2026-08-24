import { requireAuth } from "@clerk/express";
import express from "express";
import { getDashboardData } from "./dashboard.controller.js";
import { injectUser } from "./dashboard.middleware.js";

const router = express.Router();

router.get("/:userId", requireAuth(), injectUser, getDashboardData);

export default router;
