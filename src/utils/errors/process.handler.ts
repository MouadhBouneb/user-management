import { Server } from "http";

type ErrorType =
  | "UNCAUGHT EXCEPTION"
  | "UNHANDLED REJECTION"
  | "BOOTSTRAP ERROR"
  | "SIGTERM"
  | "SIGINT";

function logError(type: ErrorType, error?: Error) {
  console.error(`${type}! 💥 Shutting down...`);
  if (error) {
    console.error(error.name, error.message);
    if (error.stack) console.error(error.stack);
  }
}

export function registerProcessHandlers(server?: Server) {
  process.on("uncaughtException", (err) => {
    logError("UNCAUGHT EXCEPTION", err);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason: unknown) => {
    const err = reason instanceof Error ? reason : new Error(String(reason));
    logError("UNHANDLED REJECTION", err);
    if (server) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  });

  process.on("SIGTERM", () => {
    logError("SIGTERM");
    if (server) {
      server.close(() => {
        console.log("💥 Process terminated!");
      });
    }
  });

  process.on("SIGINT", () => {
    logError("SIGINT");
    if (server) {
      server.close(() => {
        console.log("💥 Process terminated by SIGINT!");
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
}
