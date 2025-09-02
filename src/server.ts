import { registerProcessHandlers } from "utils/errors/process.handler";
import { createApp } from "./app";
import { env } from "config/env";

async function bootstrap() {
  const app = await createApp();
  const port = Number(env.PORT || 3000);
  const server = app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
  registerProcessHandlers(server);
}

bootstrap().catch((err) => {
  console.error("BOOTSTRAP ERROR! 💥 Shutting down...");
  if (err instanceof Error) {
    console.error(err.name, err.message);
    if (err.stack) console.error(err.stack);
  }
  process.exit(1);
});
