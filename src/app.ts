import { connectDB } from "config/database";
import express from "express";
import authRouter from "presentation/controllers/auth.controller";
import userRouter from "presentation/routes/user.route";
import { ErrorMiddleware } from "shared/middleware/error.middleware";

export async function createApp() {
  await connectDB();

  const app = express();
  app.use(express.json());

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);

  app.use(ErrorMiddleware);
  return app;
}
