import { Router } from "express";
import { requireAuth } from "@clerk/express";
import validate from "../../middleware/validate.js";
import { createDataSchema } from "./clerk.js";
import { createData, getDashboard } from "./clerk.controller.js";

const router = Router();

router.get("/dashboard", requireAuth(), getDashboard);
router.post("/data", requireAuth(), validate(createDataSchema), createData);

export default router;
