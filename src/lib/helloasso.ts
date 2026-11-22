import "server-only";

/* ──────────────────────────────────────────────────────────────────────────
 * Client HelloAsso (API v5, « Checkout »), côté serveur uniquement.
 *
 * Variables d'environnement (fichier .env.local en local, Vercel en ligne) :
 *   HELLOASSO_CLIENT_ID, HELLOASSO_CLIENT_SECRET, HELLOASSO_ORG_SLUG
 *   HELLOASSO_API (facultatif) : https://api.helloasso-sandbox.com pour le
 *   compte de test ; par défaut l'API réelle.
 * Le secret ne doit jamais partir dans le navigateur ni dans git.
 * ────────────────────────────────────────────────────────────────────────── */

const API = process.env.HELLOASSO_API ?? "https://api.helloasso.com";

export function isHelloAssoConfigured(): boolean {
  return Boolean(process.env.HELLOASSO_CLIENT_ID && process.env.HELLOASSO_CLIENT_SECRET && process.env.HELLOASSO_ORG_SLUG);
}

let cached: { token: string; expires: number } | null = null;

/** Jeton d'accès (valable 30 min), mis en cache jusqu'à une minute de sa fin. */
async function accessToken(): Promise<string> {
  if (cached && cached.expires > Date.now() + 60_000) return cached.token;
  const res = await fetch(`${API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.HELLOASSO_CLIENT_ID ?? "",
      client_secret: process.env.HELLOASSO_CLIENT_SECRET ?? "",
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HelloAsso : authentification refusée (${res.status})`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: data.access_token, expires: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await accessToken();
  const res = await fetch(`${API}/v5/organizations/${process.env.HELLOASSO_ORG_SLUG}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) throw new HelloAssoError(res.status, text);
  return (text ? JSON.parse(text) : {}) as T;
}

export class HelloAssoError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`HelloAsso ${status} : ${body.slice(0, 500)}`);
  }
}

export interface CheckoutIntentInput {
  /** Montants en centimes. */
  totalAmount: number;
  initialAmount: number;
  itemName: string;
  backUrl: string;
  errorUrl: string;
  returnUrl: string;
  containsDonation: boolean;
  payer: { firstName: string; lastName: string; email: string };
  metadata: Record<string, unknown>;
}

/** Crée l'intention de paiement ; renvoie l'URL de la page HelloAsso. */
export function createCheckoutIntent(input: CheckoutIntentInput) {
  return call<{ id: number; redirectUrl: string }>("/checkout-intents", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface CheckoutIntent {
  id: number;
  metadata?: Record<string, unknown>;
  order?: {
    id: number;
    date?: string;
    amount?: { total: number };
    payments?: { id: number; state: string; amount: number }[];
  };
}

/** Relit une intention de paiement : `order` n'existe que si le paiement a abouti. */
export function getCheckoutIntent(id: string | number) {
  return call<CheckoutIntent>(`/checkout-intents/${encodeURIComponent(String(id))}`);
}

/** Paiement encaissé : une commande existe et au moins un paiement est autorisé. */
export function isPaid(intent: CheckoutIntent): boolean {
  return Boolean(intent.order?.payments?.some((p) => p.state === "Authorized" || p.state === "Processed"));
}
