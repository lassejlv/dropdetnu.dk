import {
  GrantType,
  createKindeServerClient,
} from "@kinde-oss/kinde-typescript-sdk";
import { env } from "./env";

const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: env.KINDE_DOMAIN,
  clientId: env.KINDE_CLIENT_ID,
  clientSecret: env.KINDE_CLIENT_SECRET,
  redirectURL: env.KINDE_REDIRECT_URI,
  logoutRedirectURL: env.KINDE_LOGOUT_REDIRECT_URI,
});
