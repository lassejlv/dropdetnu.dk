import { db } from "@/util/db";
import { getUser } from "@/util/kinde";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

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

const schema = z.object({
  goal: z.string().max(256),
  days: z.number(),
});

router.post("/", getUser, zValidator("json", schema), async (c) => {
  const user = c.var.user;
  const goal = await c.req.valid("json");

  try {
    // Plus the goal.days to the current date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + goal.days);

    const newGoal = await db.goals.create({
      data: {
        kinde_userId: user.id,
        goal: goal.goal,
        days: goal.days,
        endDate,
      },
    });

    return c.json({ ok: true, goal: newGoal });
  } catch (error) {
    return c.json({ ok: false, error }, 500);
  }
});

export default router;
