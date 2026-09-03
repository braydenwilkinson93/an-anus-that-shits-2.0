import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "aats_admin_session";

// Single-process in-memory session store. This is intentionally simple:
// this admin system is designed to run locally on your machine while you
// build, not as a multi-user hosted CMS. See README.md before deploying
// this publicly.
const activeSessions = new Set<string>();

export function getAdminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) {
    throw new Error(
      "ADMIN_PASSWORD is not set. Copy .env.local.example to .env.local and set a password."
    );
  }
  return pw;
}

export function createSession(): string {
  const token = crypto.randomBytes(32).toString("hex");
  activeSessions.add(token);
  return token;
}

export function isValidSession(token: string | undefined): boolean {
  if (!token) return false;
  return activeSessions.has(token);
}

export function destroySession(token: string | undefined) {
  if (token) activeSessions.delete(token);
}

export async function requireAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return isValidSession(token);
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
