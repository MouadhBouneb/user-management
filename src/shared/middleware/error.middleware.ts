import { NextFunction, Request, Response } from "express";
import ErrorHandler from "utils/errors/error.handler";

function handleCastErrorDB(err: any) {
  const message = `Resource not found. Invalid: ${err.path}`;
  return new ErrorHandler(message, 400);
}

function handleDuplicateFieldsDB(err: any) {
  const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
  return new ErrorHandler(message, 400);
}

function handleValidationErrorDB(err: any) {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new ErrorHandler(message, 400);
}

function handleJWTError() {
  return new ErrorHandler("Json web token is invalid, try again", 401);
}

function handleJWTExpiredError() {
  return new ErrorHandler("Json web token is expired, try again", 401);
}

function sendErrorDev(err: any, req: Request, res: Response) {
  return res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err: any, req: Request, res: Response) {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  // Programming or unknown error: don't leak details
  console.error("ERROR 💥", err);
  return res.status(500).json({
    success: false,
    message: "Something went very wrong!",
  });
}

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.isOperational = err.isOperational ?? true;

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err, message: err.message };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
