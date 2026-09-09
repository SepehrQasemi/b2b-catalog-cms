import { describe, expect, test } from "vitest";

import { prepareLocalAuthEnv } from "@/scripts/local-env";

describe("prepareLocalAuthEnv", () => {
  test("generates strong per-checkout values for a blank template", () => {
    const first = prepareLocalAuthEnv('AUTH_SECRET=""\nATA_ADMIN_EMAIL=""\nATA_ADMIN_PASSWORD=""\n');
    const second = prepareLocalAuthEnv('AUTH_SECRET=""\nATA_ADMIN_EMAIL=""\nATA_ADMIN_PASSWORD=""\n');

    expect(first.changed).toBe(true);
    expect(first.generatedEmail).toMatch(/^admin\.[a-f0-9]+@local\.test$/);
    expect(first.generatedPassword?.length).toBeGreaterThanOrEqual(16);
    expect(first.content).not.toBe(second.content);
  });

  test("preserves an existing strong configuration", () => {
    const existing = [
      'AUTH_SECRET="0123456789abcdef0123456789abcdef"',
      'ATA_ADMIN_EMAIL="admin@example.com"',
      'ATA_ADMIN_PASSWORD="correct-horse-battery-staple"',
      "",
    ].join("\n");

    expect(prepareLocalAuthEnv(existing)).toEqual({ content: existing, changed: false });
  });

  test("replaces weak secret and password values", () => {
    const prepared = prepareLocalAuthEnv(
      'AUTH_SECRET="short"\nATA_ADMIN_EMAIL="admin@example.com"\nATA_ADMIN_PASSWORD="short"\n',
    );

    expect(prepared.changed).toBe(true);
    expect(prepared.generatedEmail).toBeUndefined();
    expect(prepared.generatedPassword?.length).toBeGreaterThanOrEqual(16);
    expect(prepared.content).not.toContain('AUTH_SECRET="short"');
    expect(prepared.content).not.toContain('ATA_ADMIN_PASSWORD="short"');
  });
});