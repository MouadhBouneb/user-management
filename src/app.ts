import { connectDB } from "config/database";
import express from "express";
import authRouter from "presentation/controllers/auth.controller";
import userRouter from "presentation/routes/user.route";
import permissionRouter from "presentation/routes/permission.route";
import roleRouter from "presentation/routes/role.route";
import { ErrorMiddleware } from "shared/middleware/error.middleware";

export async function createApp() {
  await connectDB();

  const app = express();
  app.use(express.json());

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/permissions", permissionRouter);
  app.use("/api/v1/roles", roleRouter);

  app.use(ErrorMiddleware);
  return app;
}
