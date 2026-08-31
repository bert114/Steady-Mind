import { Router } from "express";
import validate from "../../middleware/validate.js";
import {
  handleGenerateBoundary,
  handleListBoundaries,
  handleSaveBoundary,
} from "./boundary.controller.js";
import {
  generateBoundarySchema,
  saveBoundarySchema,
} from "./boundary.validator.js";

const router = Router();

router.post(
  "/generate",
  validate(generateBoundarySchema),
  handleGenerateBoundary,
);

router.post("/messages", validate(saveBoundarySchema), handleSaveBoundary);

router.get("/messages", handleListBoundaries);

export const boundaryRoutes = router;
