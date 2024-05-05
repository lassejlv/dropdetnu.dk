import { db } from "@/util/db";
import { getUser } from "@/util/kinde";
import { Hono } from "hono";

const router = new Hono();

router.get("/", getUser, async (c) => {
  try {
    const user = c.var.user;

    const goals = await db.goals.findMany({
      where: { kinde_userId: user.id },
      take: 25,
    });

    return c.json({ ok: true, goals });
  } catch (error: any) {
    return c.json({ ok: false, error }, 500);
  }
});

export default router;
