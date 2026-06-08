/**
 * Admin gate configuration.
 *
 * IMPORTANT — this is a LIGHT, client-side gate, NOT bank-grade security.
 * The password ships in the JS bundle, so anyone determined enough can read it.
 * Its only purpose is to keep the admin UI out of casual reach (and out of the
 * navigation / search engines). There is no backend and no real authentication.
 *
 * To change the password: edit `ADMIN_PASSWORD` below and redeploy. Visitors who
 * were already logged in keep their session until they close the tab or click
 * "Se déconnecter" (the session flag lives in sessionStorage, per-tab).
 */

/** [À CHANGER] mot de passe admin — gate client-side léger, pas une sécurité forte. */
export const ADMIN_PASSWORD = "vcm-admin-2026";

/** sessionStorage key holding the "logged in" flag for the current tab. */
export const ADMIN_SESSION_KEY = "vcm_admin_session";
