import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.string(),
    DATABASE_URL: z.string(),
    KINDE_DOMAIN: z.string(),
    KINDE_CLIENT_ID: z.string(),
    KINDE_CLIENT_SECRET: z.string(),
    KINDE_REDIRECT_URI: z.string(),
    KINDE_LOGOUT_REDIRECT_URI: z.string(),
  },
  runtimeEnv: process.env,
});
