import { randomBytes } from "node:crypto";

const MIN_PASSWORD_LENGTH = 16;
const MIN_SECRET_BYTES = 32;

function readEnvValue(content: string, key: string) {
  const match = content.match(new RegExp(`^${key}=(.*)$`, "m"));
  return match?.[1]?.trim().replace(/^(["'])(.*)\1$/, "$2") ?? "";
}

function writeEnvValue(content: string, key: string, value: string) {
  const line = `${key}=${JSON.stringify(value)}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  if (pattern.test(content)) {
    return content.replace(pattern, line);
  }
  return `${content.trimEnd()}\n${line}\n`;
}

export type PreparedLocalEnv = {
  content: string;
  changed: boolean;
  generatedEmail?: string | undefined;
  generatedPassword?: string | undefined;
};

export function prepareLocalAuthEnv(input: string): PreparedLocalEnv {
  let content = input;
  let changed = false;
  let generatedEmail: string | undefined;
  let generatedPassword: string | undefined;

  const currentSecret = readEnvValue(content, "AUTH_SECRET");
  if (Buffer.byteLength(currentSecret, "utf8") < MIN_SECRET_BYTES) {
    content = writeEnvValue(content, "AUTH_SECRET", randomBytes(32).toString("base64url"));
    changed = true;
  }

  const currentEmail = readEnvValue(content, "CMS_ADMIN_EMAIL").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail)) {
    generatedEmail = `admin.${randomBytes(4).toString("hex")}@local.test`;
    content = writeEnvValue(content, "CMS_ADMIN_EMAIL", generatedEmail);
    changed = true;
  }

  const currentPassword = readEnvValue(content, "CMS_ADMIN_PASSWORD");
  if (currentPassword.length < MIN_PASSWORD_LENGTH) {
    generatedPassword = randomBytes(18).toString("base64url");
    content = writeEnvValue(content, "CMS_ADMIN_PASSWORD", generatedPassword);
    changed = true;
  }

  return { content, changed, generatedEmail, generatedPassword };
}