import { Logger } from "term-logger";
import app from "./app";
import { env } from "./util/env";

const server = Bun.serve({
  port: Number(env.PORT),
  fetch: app.fetch,
});

Logger.success(`Started server on port ${server.port}`);
