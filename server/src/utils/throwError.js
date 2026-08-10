import AppError from "./AppError.js";

const throwError = (message, statusCode = 400) => {
  throw new AppError(message, statusCode);
};
export default throwError;
