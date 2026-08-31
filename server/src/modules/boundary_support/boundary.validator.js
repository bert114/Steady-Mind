import Joi from "joi";

export const generateBoundarySchema = Joi.object({
  situation: Joi.string().trim().min(5).max(500).required().messages({
    "string.empty": "Situation context cannot be empty.",
    "string.min": "Situation should be at least 5 characters long.",
    "string.max": "Situation context is too long (max 500 characters).",
  }),
  tone: Joi.string().valid("soft", "direct", "firm").default("soft"),
});

export const saveBoundarySchema = Joi.object({
  situation: Joi.string().trim().min(5).max(500).required().messages({
    "string.empty": "Situation context cannot be empty.",
    "string.min": "Situation should be at least 5 characters long.",
    "string.max": "Situation context is too long (max 500 characters).",
  }),
  message: Joi.string().trim().min(1).max(2000).required().messages({
    "string.empty": "Boundary message cannot be empty.",
    "string.max": "Boundary message is too long (max 2000 characters).",
  }),
  tone: Joi.string().valid("soft", "direct", "firm").default("soft"),
  source: Joi.string().valid("ai", "fallback").default("ai"),
});