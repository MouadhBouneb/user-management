import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../../infrastructure/database/user.model";
import { env } from "../../config/env";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    roles: string[];
    permissions: string[];
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded: any = jwt.verify(token, env.JWT_ACCESS_TOKEN);

    const userDoc = await UserModel.findById(decoded.id).lean();
    if (!userDoc) return res.status(401).json({ error: "User not found" });

    req.user = {
      id: userDoc._id.toString(),
      roles: userDoc.roles,
      permissions: userDoc.permissions,
    };

    next();
    return;
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
