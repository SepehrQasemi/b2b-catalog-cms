import { afterEach, describe, expect, test, vi } from "vitest";

import { verifyAdminCredentials } from "@/lib/auth/credentials";
import {
  createAdminSessionCookie,
  decodeAdminSessionToken,
  shouldUseSecureAdminCookie,
} from "@/lib/auth/session";

const VALID_EMAIL = "admin@example.com";
const VALID_PASSWORD = "correct-horse-battery-staple";
const VALID_SECRET = "0123456789abcdef0123456789abcdef";

function configureValidAuth() {
  vi.stubEnv("CMS_ADMIN_EMAIL", VALID_EMAIL);
  vi.stubEnv("CMS_ADMIN_PASSWORD", VALID_PASSWORD);
  vi.stubEnv("AUTH_SECRET", VALID_SECRET);
}

describe("admin authentication guard", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("accepts only the configured strong credentials", () => {
    configureValidAuth();

    expect(verifyAdminCredentials({ email: VALID_EMAIL, password: VALID_PASSWORD })).toBe(true);
    expect(verifyAdminCredentials({ email: VALID_EMAIL, password: "wrong-password-value" })).toBe(false);
  });

  test.each(["CMS_ADMIN_EMAIL", "CMS_ADMIN_PASSWORD", "AUTH_SECRET"])(
    "fails closed when %s is missing",
    (missingKey) => {
      configureValidAuth();
      vi.stubEnv(missingKey, "");

      expect(verifyAdminCredentials({ email: VALID_EMAIL, password: VALID_PASSWORD })).toBe(false);
      expect(createAdminSessionCookie(VALID_EMAIL)).toBeNull();
    },
  );

  test("rejects weak or malformed authentication configuration", () => {
    configureValidAuth();
    vi.stubEnv("CMS_ADMIN_PASSWORD", "too-short");
    expect(verifyAdminCredentials({ email: VALID_EMAIL, password: "too-short" })).toBe(false);

    configureValidAuth();
    vi.stubEnv("AUTH_SECRET", "too-short");
    expect(createAdminSessionCookie(VALID_EMAIL)).toBeNull();

    configureValidAuth();
    vi.stubEnv("CMS_ADMIN_EMAIL", "not-an-email");
    expect(createAdminSessionCookie("not-an-email")).toBeNull();
  });

  test("creates and validates a session only for the configured administrator", () => {
    configureValidAuth();
    const cookie = createAdminSessionCookie(VALID_EMAIL);

    expect(cookie).not.toBeNull();
    expect(decodeAdminSessionToken(cookie!.value)).toMatchObject({
      email: VALID_EMAIL,
      role: "admin",
    });
    expect(createAdminSessionCookie("other@example.com")).toBeNull();
  });

  test("rejects tampered sessions and sessions after administrator changes", () => {
    configureValidAuth();
    const cookie = createAdminSessionCookie(VALID_EMAIL)!;
    const tampered = `${cookie.value.slice(0, -1)}x`;
    expect(decodeAdminSessionToken(tampered)).toBeNull();

    vi.stubEnv("CMS_ADMIN_EMAIL", "new-admin@example.com");
    expect(decodeAdminSessionToken(cookie.value)).toBeNull();
  });

  test("only enables secure admin cookies for https production URLs", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://127.0.0.1:3000");
    expect(shouldUseSecureAdminCookie()).toBe(false);

    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://catalog.example.com");
    expect(shouldUseSecureAdminCookie()).toBe(true);
  });
});