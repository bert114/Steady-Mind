import { mapValidationErrors } from "../mapper/error.js";
import throwError from "../utils/throwError.js";

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throwError("invalid", 400, mapValidationErrors(error));
  }

  next();
};

export default validate;
