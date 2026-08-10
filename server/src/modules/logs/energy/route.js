import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { validateDailyLog } from "./middleware.js";
import { createLog, deleteLog, getLogs, updateLog } from "./controller.js";

const router = express.Router();

//router.use(clerkMiddleware());

router.post("/", validateDailyLog, createLog);
router.get("/:userId", getLogs);
router.put("/:id", updateLog);
router.delete("/:id", deleteLog);

export default router;
