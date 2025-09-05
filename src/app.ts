import { connectDB } from "config/database";
import express from "express";
import authRouter from "presentation/controllers/auth.controller";
import userRouter from "presentation/routes/user.route";
import permissionRouter from "presentation/routes/permission.route";
import roleRouter from "presentation/routes/role.route";
import { ErrorMiddleware, NotFoundMiddleware } from "shared/middleware/error.middleware";
import { Logger } from "shared/services/logger.service";

export async function createApp() {
  await connectDB();

  const app = express();
  
  // Parse JSON bodies
  app.use(express.json());
  
  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/permissions", permissionRouter);
  app.use("/api/v1/roles", roleRouter);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Handle 404 errors
  app.all("*", NotFoundMiddleware);

  // Global error handler
  app.use(ErrorMiddleware);
  
  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err: Error) => {
    Logger.error("UNHANDLED REJECTION! 💥", err);
    // Close server and exit process
    // In a real application, you might want to implement graceful shutdown
    process.exit(1);
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (err: Error) => {
    Logger.error("UNCAUGHT EXCEPTION! 💥", err);
    // Close server and exit process
    // In a real application, you might want to implement graceful shutdown
    process.exit(1);
  });

  return app;
}
