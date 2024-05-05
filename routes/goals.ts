import { db } from "@/util/db";
import { Hono } from "hono";

const router = new Hono();

router.get("/", async (c) => {
  try {
    const goals = await db.goals.findMany({ take: 25 });

    return c.json({ ok: true, goals });
  } catch (error: any) {
    return c.json({ ok: false, error }, 500);
  }
});

export default router;
