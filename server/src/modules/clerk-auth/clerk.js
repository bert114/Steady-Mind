import Joi from "joi";

export const createDataSchema = Joi.object({
  content: Joi.string().min(1).max(500).required(),
  email: Joi.string().email().optional(),
});
