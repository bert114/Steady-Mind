class AppError extends Error {
  constructor(error, statusCode, errors = null) {
    // console.log(
    //   "AppError constructor called with error:",
    //   error,
    //   "and statusCode:",
    //   statusCode,
    // );
    super(error);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.message = error;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
