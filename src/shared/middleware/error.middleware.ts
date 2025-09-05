import { NextFunction, Request, Response } from "express";
import ErrorHandler from "utils/errors/error.handler";
import { Logger } from "shared/services/logger.service";
import mongoose from "mongoose";

/**
 * Handle CastError database errors (invalid ObjectId)
 */
function handleCastErrorDB(err: any): ErrorHandler {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ErrorHandler(message, 400);
}

/**
 * Handle duplicate fields database errors
 */
function handleDuplicateFieldsDB(err: any): ErrorHandler {
  const value = err.errmsg.match(/(["'])(?:(?=(\\\?))\2.)*?\1/)?.[0] || "value";
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ErrorHandler(message, 400);
}

/**
 * Handle validation errors
 */
function handleValidationErrorDB(err: any): ErrorHandler {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new ErrorHandler(message, 400);
}

/**
 * Handle JWT errors
 */
function handleJWTError(): ErrorHandler {
  return new ErrorHandler("Invalid token. Please log in again!", 401);
}

/**
 * Handle JWT expired errors
 */
function handleJWTExpiredError(): ErrorHandler {
  return new ErrorHandler("Your token has expired. Please log in again!", 401);
}

/**
 * Handle Mongoose duplicate key errors
 */
function handleDuplicateKeyError(err: any): ErrorHandler {
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate value for field: ${field}. Please use another value!`;
  return new ErrorHandler(message, 400);
}

/**
 * Handle Mongoose validation errors
 */
function handleMongooseValidationError(err: any): ErrorHandler {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new ErrorHandler(message, 400);
}

/**
 * Handle Mongoose CastError
 */
function handleMongooseCastError(err: any): ErrorHandler {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ErrorHandler(message, 400);
}

/**
 * Send error response in development environment
 */
function sendErrorDev(err: ErrorHandler, req: Request, res: Response) {
  Logger.error("ERROR 💥", err);
  
  return res.status(err.statusCode).json({
    ...err.toJSON(),
    path: req.path,
    method: req.method,
    timestamp: err.timestamp.toISOString()
  });
}

/**
 * Send error response in production environment
 */
function sendErrorProd(err: ErrorHandler, req: Request, res: Response) {
  // Log error
  Logger.error("ERROR 💥", err);
  
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      ...err.toJSON(),
      path: req.path,
      method: req.method
    });
  }
  
  // Programming or unknown error: don't leak details
  return res.status(500).json({
    success: false,
    message: "Something went wrong on our end. Please try again later.",
    path: req.path,
    method: req.method
  });
}

/**
 * Global error handling middleware
 */
export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Ensure we have an ErrorHandler instance
  let error = err instanceof ErrorHandler 
    ? err 
    : new ErrorHandler(err.message || "Internal Server Error", err.statusCode || 500, {
        originalError: err.name,
        stack: err.stack,
        ...(process.env.NODE_ENV === 'development' && { details: err })
      });
  
  // Set default status code and operational flag
  error.statusCode = error.statusCode || 500;
  error.isOperational = error.isOperational ?? true;

  // Handle different types of errors
  if (err.name === "CastError") error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === "ValidationError") error = handleValidationErrorDB(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();
  
  // Mongoose-specific errors
  if (err.name === "MongoServerError" && err.code === 11000) {
    error = handleDuplicateKeyError(err);
  }
  if (err instanceof mongoose.Error.ValidationError) {
    error = handleMongooseValidationError(err);
  }
  if (err instanceof mongoose.Error.CastError) {
    error = handleMongooseCastError(err);
  }

  // Send appropriate response based on environment
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};

/**
 * 404 Not Found handler
 */
export const NotFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const error = new ErrorHandler(`Can't find ${req.originalUrl} on this server!`, 404);
  next(error);
};
