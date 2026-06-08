"use client";

import {
  useEffect,
  type ReactNode,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";

/* ──────────────────────────────────────────────────────────────────────────
 * Reusable dark-theme admin UI kit. Accessible (labels, focus rings), SSR-safe.
 * Editors reuse these so the admin stays visually consistent.
 * ────────────────────────────────────────────────────────────────────────── */

const inputClasses =
  "w-full rounded-lg border border-white/15 bg-[#0a0418] px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#a855f7] focus:ring-2 focus:ring-[#a855f7]/40";

/** A labelled wrapper for any control. `htmlFor` links the label to the field. */
export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-white/80"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-white/40">{hint}</p>}
    </div>
  );
}

export function TextInput(
  props: InputHTMLAttributes<HTMLInputElement>,
) {
  return <input type="text" {...props} className={`${inputClasses} ${props.className ?? ""}`} />;
}

export function TextArea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      rows={4}
      {...props}
      className={`${inputClasses} resize-y ${props.className ?? ""}`}
    />
  );
}

export function NumberInput(
  props: InputHTMLAttributes<HTMLInputElement>,
) {
  return <input type="number" {...props} className={`${inputClasses} ${props.className ?? ""}`} />;
}

/** Accessible on/off toggle. */
export function Toggle({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  id?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50 ${
        checked ? "bg-gradient-to-r from-[#7c3aed] to-[#c026d3]" : "bg-white/15"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  variant = "secondary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50 disabled:cursor-not-allowed disabled:opacity-40";
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-r from-[#7c3aed] to-[#c026d3] text-white hover:opacity-90",
    secondary: "border border-white/15 bg-white/5 text-white hover:bg-white/10",
    ghost: "text-white/70 hover:bg-white/5 hover:text-white",
    danger:
      "border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20",
  };
  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${className}`}
    />
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#15082e]/60 p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-xl uppercase tracking-wide text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-white/50">{description}</p>
      )}
    </div>
  );
}

/** Transient save/feedback toast — auto-dismisses. SSR-safe. */
export function Toast({
  message,
  type = "success",
  onDismiss,
  duration = 2600,
}: {
  message: string;
  type?: "success" | "error";
  onDismiss: () => void;
  duration?: number;
}) {
  useEffect(() => {
    const id = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(id);
  }, [onDismiss, duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-2xl ${
        type === "success"
          ? "bg-gradient-to-r from-[#7c3aed] to-[#c026d3]"
          : "bg-rose-600"
      }`}
    >
      {message}
    </div>
  );
}
