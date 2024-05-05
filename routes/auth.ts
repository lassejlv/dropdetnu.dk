import { Hono } from "hono";
import { getUser, kindeClient, sessionManager } from "@/util/kinde";
const router = new Hono();

router.get("/login", async (c) => {
  const loginUrl = await kindeClient.login(sessionManager(c));
  return c.redirect(loginUrl.toString());
});

router.get("/register", async (c) => {
  const registerUrl = await kindeClient.register(sessionManager(c));
  return c.redirect(registerUrl.toString());
});

router.get("/callback", async (c) => {
  // get called eveyr time we login or register
  const url = new URL(c.req.url);
  await kindeClient.handleRedirectToApp(sessionManager(c), url);
  return c.redirect("/");
});

router.get("/logout", async (c) => {
  const logoutUrl = await kindeClient.logout(sessionManager(c));
  return c.redirect(logoutUrl.toString());
});

router.get("/me", getUser, async (c) => {
  const user = c.var.user;
  return c.json({ user });
});

export default router;
