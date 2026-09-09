export type AdminAuthConfig = {
  email: string;
  password: string;
  secret: string;
};

const MIN_PASSWORD_LENGTH = 16;
const MIN_SECRET_BYTES = 32;

export function getAdminAuthConfig(): AdminAuthConfig | null {
  const email = process.env.CMS_ADMIN_EMAIL?.trim().toLowerCase() ?? "";
  const password = process.env.CMS_ADMIN_PASSWORD?.trim() ?? "";
  const secret = process.env.AUTH_SECRET?.trim() ?? "";

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (
    !emailIsValid ||
    password.length < MIN_PASSWORD_LENGTH ||
    Buffer.byteLength(secret, "utf8") < MIN_SECRET_BYTES
  ) {
    return null;
  }

  return { email, password, secret };
}