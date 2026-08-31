import { mapValidationErrors } from "../mapper/error.js";
import throwError from "../utils/throwError.js";

const validate = (schema) => (req, res, next) => {
  console.log(req.body);
  const { error } = schema.validate(req.body, {
    abortEarly: false,
  });

  console.log(error);

  if (error) {
    throwError("invalid", 400, mapValidationErrors(error));
  }

  next();
};

export default validate;
