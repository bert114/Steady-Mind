import { Router } from "express";
import { generateBoundarySchema } from "./boundary.validator.js";
import { handleGenerateBoundary } from "./boundary.controller.js";
import validate from "../../middleware/validate.js";

const router = Router();

router.post(
  "/generate",
  validate(generateBoundarySchema),
  handleGenerateBoundary,
);

export const boundaryRoutes = router;
