import { NextResponse } from "next/server";

import { orderLabel, priceOrder } from "@/data/order";
import { createCheckoutIntent, HelloAssoError, isHelloAssoConfigured } from "@/lib/helloasso";

/**
 * Crée le paiement HelloAsso d'une commande et renvoie l'URL de paiement.
 *
 * Body : `{ lines, delivery, donation, customer: { firstName, lastName, email, phone?, licensed?, team?, player? } }`
 * Le total est recalculé ici à partir du catalogue, jamais repris du navigateur.
 */
export async function POST(request: Request) {
  if (!isHelloAssoConfigured()) {
    return NextResponse.json({ error: "Paiement non configuré." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Requête illisible." }, { status: 400 });
  }

  const priced = priceOrder(body.lines, body.delivery, body.donation);
  if (!priced.ok) return NextResponse.json({ error: priced.error }, { status: 400 });
  const { order } = priced;

  const c = (body.customer ?? {}) as Record<string, unknown>;
  const str = (v: unknown, max = 80) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const payer = { firstName: str(c.firstName), lastName: str(c.lastName), email: str(c.email, 120) };
  if (!payer.firstName || !payer.lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payer.email)) {
    return NextResponse.json({ error: "Coordonnées incomplètes." }, { status: 400 });
  }

  // HelloAsso n'accepte que des adresses de retour en https : en local
  // (http://localhost), on renvoie vers le site en ligne (SITE_URL).
  const here = new URL(request.url).origin;
  const origin = here.startsWith("https://") ? here : (process.env.SITE_URL ?? "https://www.volleymarseillan.com");
  const back = `${origin}/boutique/commande/retour`;
  const cents = (euros: number) => Math.round(euros * 100);

  try {
    const intent = await createCheckoutIntent({
      totalAmount: cents(order.total),
      initialAmount: cents(order.total),
      itemName: orderLabel(order),
      backUrl: `${origin}/boutique/commande`,
      errorUrl: back,
      returnUrl: back,
      containsDonation: order.donation > 0,
      payer,
      // Le détail complet (tailles, flocages, contact) reste attaché au paiement.
      metadata: {
        source: "site-boutique",
        delivery: order.delivery,
        donation: order.donation,
        phone: str(c.phone, 30),
        licensed: c.licensed === true,
        team: str(c.team),
        player: str(c.player),
        lines: order.lines.map((l) => ({ s: l.slug, c: l.color, t: l.size, f: l.flocage, q: l.qty, u: l.unit })),
      },
    });
    return NextResponse.json({ ok: true, redirectUrl: intent.redirectUrl, id: intent.id });
  } catch (err) {
    console.error("[helloasso] création du paiement impossible", err);
    // HelloAsso explique en français ce qui ne va pas (prénom trop court,
    // chiffres dans le nom, nom fictif comme « Test »…) : on le relaie.
    const reasons = err instanceof HelloAssoError && err.status === 400 ? payerErrors(err.body) : [];
    if (reasons.length) return NextResponse.json({ error: reasons.join(" ") }, { status: 400 });
    return NextResponse.json({ error: "Le paiement n'a pas pu être lancé. Réessayez dans un instant." }, { status: 502 });
  }
}

/** Messages de HelloAsso sur les coordonnées, rendus lisibles pour l'acheteur. */
function payerErrors(body: string): string[] {
  try {
    const { errors } = JSON.parse(body) as { errors?: { message?: string }[] };
    return (errors ?? [])
      .map((e) => e.message ?? "")
      .filter((m) => /prénom|nom|e-?mail|mail/i.test(m))
      .map((m) =>
        m
          .replace("Le champ prénom est invalide", "Prénom refusé par HelloAsso : indiquez votre vrai prénom.")
          .replace("Le champ nom est invalide", "Nom refusé par HelloAsso : indiquez votre vrai nom.")
          .replace(/([^.])$/, "$1."),
      );
  } catch {
    return [];
  }
}
