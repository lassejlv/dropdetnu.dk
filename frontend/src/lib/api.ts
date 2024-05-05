import { UserType } from "@kinde-oss/kinde-typescript-sdk";

export async function GetUser() {
  const response = await fetch("/api/auth/me");

  if (!response.ok) return null;

  const data = (await response.json()) as { user: UserType };

  return data.user;
}
