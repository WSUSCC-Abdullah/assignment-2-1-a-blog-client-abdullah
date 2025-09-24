import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin"
import { cookies } from "next/headers";

export async function isLoggedIn() {
  const userCookies = await cookies();

  // ASSIGNMENT 3
  // check that auth_token cookie exists and is valid
  const token = userCookies.get("auth_token")?.value;

  if (!token) {
    return false;
  }

  try {
    return jwt.verify(token, env.JWT_SECRET || "");
  } catch (error) {
    return false;
  }
}
