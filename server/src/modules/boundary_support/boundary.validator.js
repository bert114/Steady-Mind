import Joi from "joi";

export const generateBoundarySchema = Joi.object({
  situation: Joi.string().trim().min(5).max(500).required().messages({
    "string.empty": "Situation context cannot be empty.",
    "string.min": "Situation should be at least 5 characters long.",
    "string.max": "Situation context is too long (max 500 characters).",
  }),
});
