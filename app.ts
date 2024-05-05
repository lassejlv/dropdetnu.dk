import { Hono } from "hono";
import { logger } from "hono/logger";
import GoalsRouter from "@/routes/goals";
import { serveStatic } from "hono/bun";

const app = new Hono();

app.use(logger());

app.basePath("/api").route("/goals", GoalsRouter);

app.get("*", serveStatic({ root: "./dist" }));
app.get("*", serveStatic({ path: "./dist/index.html" }));

export default app;
