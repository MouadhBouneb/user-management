import { NextFunction, Request, Response } from "express";
import ErrorHandler from "./error.handler";
import { Logger } from "shared/services/logger.service";

tn;
/**
 * A higher-order function to wrap async route handlers and catch errors
 * @param fn The async function to wrap
 * @returns A wrapped function with proper error handling
 */
export const CatchAsyncError = <
  T extends (req: Request, res: Response, next: NextFunction) => Promise<any>
>(
  fn: T
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      // Log the error with additional context
      Logger.error("Async function error caught", {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
      });

      // If it's already an ErrorHandler, pass it to next
      if (error instanceof ErrorHandler) {
        return next(error);
      }

      // For other types of errors, wrap them in ErrorHandler
      next(
        new ErrorHandler(
          error.message || "Internal Server Error",
          error.statusCode || 500,
          {
            originalError: error.name,
            ...(process.env.NODE_ENV === "development" && {
              stack: error.stack,
            }),
          }
        )
      );
    });
  };
};

/**
 * A higher-order function to wrap async route controllers with additional error handling
 * @param controller The async controller function to wrap
 * @returns A wrapped controller with proper error handling
 */
export const AsyncController = <
  T extends (req: Request, res: Response, next: NextFunction) => Promise<any>
>(
  controller: T
) => {
  return CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await controller(req, res, next);

        // If the controller sends a response, we don't need to do anything else
        if (!res.headersSent) {
          // If the controller returns data but didn't send a response, send it
          if (result !== undefined) {
            res.status(200).json({
              success: true,
              data: result,
            });
          }
        }
      } catch (error) {
        // Error is already handled by CatchAsyncError, but we can add specific controller-level handling here if needed
        throw error;
      }
    }
  );
};
