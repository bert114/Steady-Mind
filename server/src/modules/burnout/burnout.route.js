import express from "express";
import { handleGetBurnoutStatus } from "./burnout.controller.js";

const router = express.Router();

router.get("/:clerkId", handleGetBurnoutStatus);

export default router;
