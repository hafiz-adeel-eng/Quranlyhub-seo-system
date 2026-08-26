// Comma-separated list of admin emails allowed to approve manual payments.
// Set ADMIN_EMAILS in .env, e.g. ADMIN_EMAILS=you@example.com,partner@example.com
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}
