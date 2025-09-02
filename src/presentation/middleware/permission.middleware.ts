import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

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
export const autoPermissionMiddleware = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      // Extract resource from URL: /user/123 -> "user"
      const pathParts = req.baseUrl.split("/").filter(Boolean);
      const resource = pathParts[pathParts.length - 1]; // Get last part (users, roles, permissions)

      if (!resource) return res.status(400).json({ error: "Invalid resource" });

      // Map HTTP method to permission action
      const requiredPermission = getActionFromMethod(req.method, resource.slice(0, -1)); // Remove 's' from plural

      // Admin shortcut: admins bypass permissions
      if (
        req.user.roles.includes("admin") ||
        req.user.permissions.includes(requiredPermission)
      ) {
        return next();
      }

      return res.status(403).json({
        error: `Forbidden: missing permission "${requiredPermission}"`,
      });
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };
};
