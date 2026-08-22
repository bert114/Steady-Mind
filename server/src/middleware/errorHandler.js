import { extractErrorSource } from "../utils/isolateError.js";
import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  const errorSource = extractErrorSource(err.stack);

  const errorResponse = {
    success: false,
    status: err.status || "error",
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    path: req ? req.originalUrl : undefined,
    method: req ? req.method : undefined,
    triggerFile: errorSource,
    errors: err.errors,
  };

  if (process.env.NODE_ENV === "development") {
    // logger.error(`${err.statusCode} - ${err.message}`);
    logger.error(JSON.stringify(errorResponse, null, 2));
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      errors: err.errors,
      message: err.message,
      stack: err.stack,
    });
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      logger.error("ERROR ", err);
      res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      });
    }
  }
};

export default errorHandler;
