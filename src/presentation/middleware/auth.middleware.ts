import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../../infrastructure/database/user.model";
import { env } from "../../config/env";
import { logger as Logger } from "shared/services/logger.service";
import ErrorHandler from "utils/errors/error.handler";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
}

/**
 * Authentication middleware to verify JWT token and attach user to request
 */
export const authMiddleware: (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void> = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ErrorHandler("No valid token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, env.JWT_ACCESS_TOKEN) as {
      id: string;
      email: string;
    };

    // Find user in database
    const userDoc = await UserModel.findById(decoded.id).lean();
    if (!userDoc) {
      Logger.warn(
        `Authentication failed: User with ID ${decoded.id} not found`
      );
      throw new ErrorHandler("User not found", 401);
    }

    // Attach user info to request
    req.user = {
      id: userDoc._id.toString(),
      email: userDoc.email,
      roles: userDoc.roles || [],
      permissions: userDoc.permissions || [],
    };

    Logger.info(`User ${req.user.email} authenticated successfully`);
    next();
  } catch (error) {
    Logger.error("Authentication error", { error: (error as Error).message });

    // If it's our custom error, let it pass to the error handler
    if (error instanceof ErrorHandler) {
      return next(error);
    }

    // Handle JWT-specific errors
    if (error.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid token", 401));
    }

    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Token expired", 401));
    }

    // Generic authentication error
    next(new ErrorHandler("Authentication failed", 401));
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token is provided
 * but still attaches user if token is valid
 */
export const optionalAuthMiddleware: (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<void> = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_ACCESS_TOKEN) as {
      id: string;
      email: string;
    };

    const userDoc = await UserModel.findById(decoded.id).lean();
    if (userDoc) {
      req.user = {
        id: userDoc._id.toString(),
        email: userDoc.email,
        roles: userDoc.roles || [],
        permissions: userDoc.permissions || [],
      };
      Logger.info(`Optional auth: User ${req.user.email} authenticated`);
    }

    next();
  } catch (error) {
    // For optional auth, we just ignore errors and continue
    Logger.warn("Optional auth failed, proceeding without user", {
      error: (error as Error).message,
    });
    next();
  }
};
