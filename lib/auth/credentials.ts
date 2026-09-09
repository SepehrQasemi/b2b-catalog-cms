import { getAdminAuthConfig } from "@/lib/auth/config";
import { adminLoginSchema } from "@/lib/validation/auth";

export function verifyAdminCredentials(input: unknown) {
  const parsed = adminLoginSchema.safeParse(input);
  const config = getAdminAuthConfig();

  if (!parsed.success || !config) {
    return false;
  }

  return parsed.data.email === config.email && parsed.data.password === config.password;
}