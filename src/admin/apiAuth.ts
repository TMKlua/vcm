import { ADMIN_PASSWORD } from "./config";

/* ──────────────────────────────────────────────────────────────────────────
 * Admin check for the write routes.
 *
 * ⚠️ Deliberately as weak as the existing client-side gate, on the project
 * owner's explicit decision: the shared password ships in the public JS bundle,
 * so anyone who reads it can call these routes. This adds no protection beyond
 * what /admin already had — it simply avoids making things *worse*.
 *
 * To harden it later, set an ADMIN_PASSWORD environment variable on Vercel:
 * the env value takes precedence and the secret then never reaches the browser.
 * That is the one-line switch — no other code needs to change.
 * ────────────────────────────────────────────────────────────────────────── */

/** Header carrying the admin password on write requests. */
export const ADMIN_HEADER = "x-vcm-admin";

function expectedPassword(): string {
  return process.env.ADMIN_PASSWORD ?? ADMIN_PASSWORD;
}

/** True when the request carries the admin password. */
export function isAuthorized(request: Request): boolean {
  return request.headers.get(ADMIN_HEADER) === expectedPassword();
}
