import AppError from "./AppError.js";

const throwError = (message, statusCode = 400, error) => {
  throw new AppError(message, statusCode, error);
};

export default throwError;
