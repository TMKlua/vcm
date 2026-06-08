"use client";

import { useRef, useState } from "react";
import { CheckCircle, Send } from "lucide-react";
import { validateContact, buildMailto, type ContactValues, type ContactErrors } from "@/lib/validation";
import { useContent } from "@/content/ContentContext";

const INITIAL_VALUES: ContactValues = { name: "", email: "", message: "" };

export default function ContactForm() {
  const { content } = useContent();
  const [values, setValues] = useState<ContactValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear the individual error as the user types
    if (errors[name as keyof ContactErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validation = validateContact(values);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      // Focus first invalid field
      if (validation.name) nameRef.current?.focus();
      else if (validation.email) emailRef.current?.focus();
      else if (validation.message) messageRef.current?.focus();
      return;
    }
    // Valid — open mail client
    window.location.href = buildMailto(content.club.contact.email, values);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-night p-10 text-center shadow-2xl shadow-black/40"
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-violet-700/20 ring-1 ring-violet-500/40">
          <CheckCircle className="size-8 text-violet-400" aria-hidden />
        </span>
        <div>
          <h3 className="font-display text-2xl text-white">Message prêt !</h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
            Votre client de messagerie s&rsquo;est ouvert avec le message pré-rempli.
            Envoyez-le pour contacter le VCM.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setSubmitted(false); setValues(INITIAL_VALUES); setErrors({}); }}
          className="text-xs font-medium text-fuchsia-vcm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-night p-8 shadow-2xl shadow-black/40 lg:p-10">
      {/* Card header */}
      <div className="mb-8">
        <div className="mb-5 flex items-center gap-3">
          <span
            aria-hidden
            className="h-px w-8 bg-gradient-to-r from-violet-700 to-fuchsia-vcm"
          />
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-fuchsia-vcm">
            Formulaire de contact
          </span>
        </div>
        <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-[0.95] tracking-tight text-white">
          Écrivez-nous
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Ce formulaire ouvrira votre client de messagerie avec le message pré-rempli.
          Aucune donnée n&rsquo;est envoyée directement par ce site.
        </p>
      </div>

      {/* Error summary for screen readers */}
      {hasErrors && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 rounded-xl border border-fuchsia-vcm/25 bg-fuchsia-vcm/5 px-4 py-3 text-sm text-fuchsia-vcm"
        >
          Veuillez corriger les erreurs ci-dessous avant d&rsquo;envoyer.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Name field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-wider text-white/70">
            Nom complet <span aria-hidden className="text-fuchsia-vcm">*</span>
          </label>
          <input
            ref={nameRef}
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "error-name" : undefined}
            placeholder="Jean Dupont"
            className={[
              "w-full rounded-xl border bg-ink/60 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-200",
              "focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/60",
              errors.name
                ? "border-fuchsia-vcm/60 focus:ring-fuchsia-vcm/40 focus:border-fuchsia-vcm/60"
                : "border-white/10 hover:border-white/20",
            ].join(" ")}
          />
          {/* Reserve space to avoid layout shift — always rendered, conditionally visible */}
          <p
            id="error-name"
            role="alert"
            className={[
              "text-xs text-fuchsia-vcm transition-opacity duration-200",
              errors.name ? "opacity-100" : "opacity-0 select-none pointer-events-none",
            ].join(" ")}
            aria-hidden={!errors.name}
          >
            {errors.name ?? " "}
          </p>
        </div>

        {/* Email field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-wider text-white/70">
            Email <span aria-hidden className="text-fuchsia-vcm">*</span>
          </label>
          <input
            ref={emailRef}
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "error-email" : undefined}
            placeholder="jean@exemple.fr"
            className={[
              "w-full rounded-xl border bg-ink/60 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-200",
              "focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/60",
              errors.email
                ? "border-fuchsia-vcm/60 focus:ring-fuchsia-vcm/40 focus:border-fuchsia-vcm/60"
                : "border-white/10 hover:border-white/20",
            ].join(" ")}
          />
          <p
            id="error-email"
            role="alert"
            className={[
              "text-xs text-fuchsia-vcm transition-opacity duration-200",
              errors.email ? "opacity-100" : "opacity-0 select-none pointer-events-none",
            ].join(" ")}
            aria-hidden={!errors.email}
          >
            {errors.email ?? " "}
          </p>
        </div>

        {/* Message field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-wider text-white/70">
            Message <span aria-hidden className="text-fuchsia-vcm">*</span>
          </label>
          <textarea
            ref={messageRef}
            id="contact-message"
            name="message"
            required
            rows={5}
            value={values.message}
            onChange={handleChange}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "error-message" : undefined}
            placeholder="Bonjour, je souhaite en savoir plus sur les inscriptions…"
            className={[
              "w-full resize-none rounded-xl border bg-ink/60 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all duration-200",
              "focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/60",
              errors.message
                ? "border-fuchsia-vcm/60 focus:ring-fuchsia-vcm/40 focus:border-fuchsia-vcm/60"
                : "border-white/10 hover:border-white/20",
            ].join(" ")}
          />
          <p
            id="error-message"
            role="alert"
            className={[
              "text-xs text-fuchsia-vcm transition-opacity duration-200",
              errors.message ? "opacity-100" : "opacity-0 select-none pointer-events-none",
            ].join(" ")}
            aria-hidden={!errors.message}
          >
            {errors.message ?? " "}
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-xl shadow-magenta/30 transition-shadow duration-300 hover:shadow-magenta/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-night"
        >
          <Send
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
          Ouvrir ma messagerie
        </button>
      </form>
    </div>
  );
}
