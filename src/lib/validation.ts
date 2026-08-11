export interface ContactValues {
  name: string;
  email: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export function validateContact(v: ContactValues): ContactErrors {
  const e: ContactErrors = {};
  if (!v.name.trim()) e.name = "Le nom est requis.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Email invalide.";
  if (v.message.trim().length < 10) e.message = "Message trop court (10 caractères min).";
  return e;
}

export function buildMailto(to: string, v: ContactValues): string {
  const subject = encodeURIComponent(`Contact site VCM - ${v.name}`);
  const body = encodeURIComponent(`${v.message}\n\n- ${v.name} (${v.email})`);
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
