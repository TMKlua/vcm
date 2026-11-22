"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleAlert, ShoppingBag } from "lucide-react";

import { STORAGE_KEY, useCart } from "@/components/shop/CartContext";
import { ORDER_CONTACT } from "@/data/shop";

const BTN =
  "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70";

export default function ReturnView({ status, orderId }: { status: "paid" | "unpaid" | "unknown"; orderId?: number }) {
  const { clear } = useCart();

  // Paiement confirmé par HelloAsso : le panier a été réglé, on le vide.
  // L'effet d'un enfant passe avant celui du CartProvider qui relit le
  // stockage : on efface donc aussi la sauvegarde, sinon le panier revient.
  useEffect(() => {
    if (status !== "paid") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    clear();
  }, [status, clear]);

  return (
    <section className="grid min-h-[80vh] place-items-center bg-ink px-5 pb-20 pt-36 text-center">
      <div className="max-w-xl">
        {status === "paid" ? (
          <>
            <CheckCircle2 className="mx-auto size-16 text-[#49d38a]" aria-hidden />
            <h1 className="mt-6 font-display text-5xl text-white">Merci, commande validée !</h1>
            <p className="mt-4 text-white/70">
              Votre paiement est bien reçu{orderId ? ` (commande n° ${orderId})` : ""}. HelloAsso vous envoie le reçu par e-mail.
              Nous vous préviendrons quand vos articles seront prêts à récupérer au gymnase.
            </p>
            <p className="mt-2 text-sm text-white/60">Une question ? Contactez {ORDER_CONTACT}.</p>
            <Link href="/boutique" className={`mt-8 ${BTN}`}>
              <ShoppingBag className="size-4" aria-hidden /> Retour à la boutique
            </Link>
          </>
        ) : (
          <>
            <CircleAlert className="mx-auto size-16 text-fuchsia-vcm" aria-hidden />
            <h1 className="mt-6 font-display text-5xl text-white">
              {status === "unpaid" ? "Paiement non abouti" : "Paiement non confirmé"}
            </h1>
            <p className="mt-4 text-white/70">
              {status === "unpaid"
                ? "Le paiement a été annulé ou refusé : aucun montant n'a été débité. Votre panier est conservé, vous pouvez réessayer."
                : `Nous n'avons pas pu vérifier votre paiement. Si vous avez reçu un reçu HelloAsso par e-mail, votre commande est bien prise en compte ; sinon, réessayez ou contactez ${ORDER_CONTACT}.`}
            </p>
            <Link href="/boutique/commande" className={`mt-8 ${BTN}`}>
              <ArrowLeft className="size-4" aria-hidden /> Revenir à ma commande
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
