import { Hono } from "hono";
import { logger } from "hono/logger";
import GoalsRouter from "@/routes/goals";
import AuthRouter from "@/routes/auth";
import { serveStatic } from "hono/bun";

const app = new Hono();

app.use(logger());

const apiRoutes = app
  .basePath("/api")
  .route("/goals", GoalsRouter)
  .route("/auth", AuthRouter);

app.get("/ping", (c) => {
  return c.json({ ping: "pong" });
});

app.get("*", serveStatic({ root: "./dist" }));
app.get("*", serveStatic({ path: "./dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
