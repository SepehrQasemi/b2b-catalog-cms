import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

import { getAdminAuthConfig } from "@/lib/auth/config";

export const ADMIN_SESSION_COOKIE_NAME = "ata_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12;

type AdminSession = {
  email: string;
  role: "admin";
  expiresAt: string;
};

export function shouldUseSecureAdminCookie() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return process.env.NODE_ENV === "production" && siteUrl.startsWith("https://");
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function encodeSession(session: AdminSession, secret: string) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

function buildAdminSession(email: string) {
  return {
    email,
    role: "admin" as const,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
  };
}

function buildAdminSessionCookieOptions(expiresAt: string): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureAdminCookie(),
    path: "/",
    expires: new Date(expiresAt),
  };
}

export function createAdminSessionCookie(email: string) {
  const config = getAdminAuthConfig();
  if (!config || email.trim().toLowerCase() !== config.email) {
    return null;
  }

  const session = buildAdminSession(config.email);
  return {
    name: ADMIN_SESSION_COOKIE_NAME,
    value: encodeSession(session, config.secret),
    options: buildAdminSessionCookieOptions(session.expiresAt),
  };
}

export function decodeAdminSessionToken(token: string): AdminSession | null {
  const config = getAdminAuthConfig();
  if (!config) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [payload, signature] = parts;
  if (!payload || !signature) {
    return null;
  }

  const expected = sign(payload, config.secret);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const candidate = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as unknown;
    if (!candidate || typeof candidate !== "object") {
      return null;
    }

    const session = candidate as Partial<AdminSession>;
    const expiresAt = typeof session.expiresAt === "string" ? Date.parse(session.expiresAt) : NaN;
    if (
      session.role !== "admin" ||
      session.email !== config.email ||
      !Number.isFinite(expiresAt) ||
      expiresAt <= Date.now()
    ) {
      return null;
    }

    return {
      email: session.email,
      role: "admin",
      expiresAt: session.expiresAt as string,
    };
  } catch {
    return null;
  }
}

export async function createAdminSession(email: string) {
  const sessionCookie = createAdminSessionCookie(email);
  if (!sessionCookie) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
  return true;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return decodeAdminSessionToken(token);
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}