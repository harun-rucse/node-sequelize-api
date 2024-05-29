import logger from "../logger/index.js";
import AppError from "../utils/app-error.js";

function handleUniqueConstraintError(err) {
  const message = err.errors[0].message;

  return new AppError(message, 400);
}

const sendErrorDev = (err, req, res) => {
  logger.error(err.message);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Log unknown errors
    logger.error(err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    if (error.name === "SequelizeUniqueConstraintError") error = handleUniqueConstraintError(error);

    sendErrorProd(error, req, res);
  }
};

export default globalErrorHandler;
