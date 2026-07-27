import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const sessionCookie = "rumky_portfolio_session";

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) return null;
  return new TextEncoder().encode(value);
}

export async function createSession() {
  const key = secret();
  if (!key) throw new Error("AUTH_SECRET must contain at least 32 characters.");
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(key);
}

export async function isAuthenticated() {
  const key = secret();
  if (!key) return false;
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return false;
  try {
    const result = await jwtVerify(token, key);
    return result.payload.role === "admin";
  } catch {
    return false;
  }
}
