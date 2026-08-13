import throwError from "../../utils/throwError.js";

export default (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    throwError(errorMessage, 400);
  }

  next();
};
