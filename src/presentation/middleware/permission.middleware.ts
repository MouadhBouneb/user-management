import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { logger as Logger } from "shared/services/logger.service";
import ErrorHandler from "utils/errors/error.handler";

/**
 * Map HTTP methods to actions
 */
const getActionFromMethod = (method: string, resource: string): string => {
  const actionMap: Record<string, string> = {
    GET: "read",
    POST: "create",
    PUT: "update",
    PATCH: "update",
    DELETE: "delete",
  };

  const action = actionMap[method.toUpperCase()];
  return `${resource}:${action}`;
};

/**
 * Middleware to automatically check user permissions
 * based on URL and HTTP method.
 */
export const autoPermissionMiddleware = (): (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => void => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ErrorHandler("Authentication required", 401);
      }

      // Extract resource from URL: /api/v1/users/123 -> "users"
      const pathParts = req.baseUrl.split("/").filter(Boolean);
      const resource = pathParts[pathParts.length - 1]; // Get last part (users, roles, permissions)

      if (!resource) {
        throw new ErrorHandler("Invalid resource", 400);
      }

      // Handle singular/plural forms (users -> user, roles -> role)
      const resourceName = resource.endsWith("s")
        ? resource.slice(0, -1)
        : resource;

      // Map HTTP method to permission action
      const requiredPermission = getActionFromMethod(req.method, resourceName);

      // Admin shortcut: admins bypass permissions
      if (req.user.roles?.includes("admin")) {
        Logger.info(
          `Admin access granted: ${req.user.email} for ${req.method} ${req.path}`
        );
        return next();
      }

      // Check if user has the required permission
      if (req.user.permissions?.includes(requiredPermission)) {
        Logger.info(
          `Permission granted: ${req.user.email} for ${requiredPermission}`
        );
        return next();
      }

      Logger.warn(
        `Permission denied: ${req.user.email} missing ${requiredPermission} for ${req.method} ${req.path}`
      );
      throw new ErrorHandler(
        `Forbidden: missing permission "${requiredPermission}"`,
        403
      );
    } catch (error) {
      Logger.error("Permission check failed", {
        error: (error as Error).message,
        user: req.user?.email,
        method: req.method,
        path: req.path,
        url: req.url,
      });

      // If it's our custom error, let it pass to the error handler
      if (error instanceof ErrorHandler) {
        return next(error);
      }

      // Generic permission error
      next(new ErrorHandler("Permission check failed", 500));
    }
  };
};

/**
 * Middleware to check for specific permissions
 * @param permissions - Array of required permissions
 */
export const requirePermissions = (permissions: string[]): (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => void => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ErrorHandler("Authentication required", 401);
      }

      // Admin shortcut: admins bypass all permissions
      if (req.user.roles?.includes("admin")) {
        Logger.info(
          `Admin access granted: ${req.user.email} for ${permissions.join(
            ", "
          )}`
        );
        return next();
      }

      // Check if user has all required permissions
      const missingPermissions = permissions.filter(
        (permission) => !req.user?.permissions?.includes(permission)
      );

      if (missingPermissions.length > 0) {
        Logger.warn(
          `Permission denied: ${
            req.user.email
          } missing ${missingPermissions.join(", ")}`
        );
        throw new ErrorHandler(
          `Forbidden: missing permissions: ${missingPermissions.join(", ")}`,
          403
        );
      }

      Logger.info(
        `Permissions granted: ${req.user.email} for ${permissions.join(", ")}`
      );
      next();
    } catch (error) {
      Logger.error("Permission check failed", {
        error: (error as Error).message,
        user: req.user?.email,
        requiredPermissions: permissions,
        method: req.method,
        path: req.path,
      });

      // If it's our custom error, let it pass to the error handler
      if (error instanceof ErrorHandler) {
        return next(error);
      }

      // Generic permission error
      next(new ErrorHandler("Permission check failed", 500));
    }
  };
};

/**
 * Middleware to check for specific roles
 * @param roles - Array of required roles
 */
export const requireRoles = (roles: string[]): (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => void => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ErrorHandler("Authentication required", 401);
      }

      // Check if user has any of the required roles
      const hasRequiredRole = roles.some((role) =>
        req.user?.roles?.includes(role)
      );

      if (!hasRequiredRole) {
        Logger.warn(
          `Role denied: ${req.user.email} missing required role(s) ${roles.join(
            ", "
          )}`
        );
        throw new ErrorHandler(
          `Forbidden: missing required role(s): ${roles.join(", ")}`,
          403
        );
      }

      Logger.info(`Role granted: ${req.user.email} for ${roles.join(", ")}`);
      next();
    } catch (error) {
      Logger.error("Role check failed", {
        error: (error as Error).message,
        user: req.user?.email,
        requiredRoles: roles,
        method: req.method,
        path: req.path,
      });

      // If it's our custom error, let it pass to the error handler
      if (error instanceof ErrorHandler) {
        return next(error);
      }

      // Generic role error
      next(new ErrorHandler("Role check failed", 500));
    }
  };
};
