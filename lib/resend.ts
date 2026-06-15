import { Resend } from "resend";

let cached: Resend | null = null;

/**
 * Resend client for contact-form notification emails (CLAUDE.md §9).
 * Returns `null` when RESEND_API_KEY is absent so the route degrades gracefully.
 */
export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (cached) return cached;

  cached = new Resend(key);
  return cached;
}
