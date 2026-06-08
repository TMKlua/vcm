"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { ADMIN_PASSWORD, ADMIN_SESSION_KEY } from "./config";

/**
 * Client-side password gate for the admin area.
 *
 * SSR-safe: starts in a "checking" state and renders nothing until the mount
 * effect reads sessionStorage — this avoids flashing either the admin content
 * or the login form before we know the real auth state (no hydration mismatch
 * because the very first client render matches the server: nothing).
 */
export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"checking" | "locked" | "authed">(
    "checking",
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const ok = window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "ok";
      setStatus(ok ? "authed" : "locked");
    } catch {
      setStatus("locked");
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      try {
        window.sessionStorage.setItem(ADMIN_SESSION_KEY, "ok");
      } catch {
        /* ignore — still allow this session in-memory */
      }
      setError(false);
      setPassword("");
      setStatus("authed");
    } else {
      setError(true);
    }
  }

  if (status === "checking") {
    // Matches the server render (empty) — no flash, no hydration mismatch.
    return null;
  }

  if (status === "authed") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0418] px-4 text-[#ece4ff]">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#15082e]/80 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#ff4dd2] shadow-lg shadow-fuchsia-500/20">
            <ShieldCheck className="h-7 w-7 text-white" aria-hidden />
          </span>
          <h1 className="font-display text-2xl uppercase tracking-wide">
            Administration
          </h1>
          <p className="mt-1 text-sm text-white/60">Volley Club Marseillanais</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-sm font-medium text-white/80"
            >
              Mot de passe
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                aria-hidden
              />
              <input
                id="admin-password"
                type="password"
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                aria-invalid={error}
                className="w-full rounded-lg border border-white/15 bg-[#0a0418] py-2.5 pl-9 pr-3 text-sm text-white outline-none transition focus:border-[#a855f7] focus:ring-2 focus:ring-[#a855f7]/40"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p role="alert" className="mt-2 text-sm text-rose-400">
                Mot de passe incorrect.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#c026d3] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          Accès réservé à l&apos;équipe du club.
        </p>
      </div>
    </div>
  );
}

/** Imperative logout helper — clears the session flag and reloads to the gate. */
export function adminLogout() {
  try {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    /* ignore */
  }
  window.location.reload();
}
