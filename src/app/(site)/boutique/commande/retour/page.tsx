import type { Metadata } from "next";

import { getCheckoutIntent, isHelloAssoConfigured, isPaid } from "@/lib/helloasso";
import ReturnView from "./ReturnView";

export const metadata: Metadata = {
  title: "Commande",
  robots: { index: false, follow: false },
};

/**
 * Retour depuis HelloAsso. L'adresse contient `checkoutIntentId` (et `code` ou
 * `error`), mais on ne se fie pas à ces paramètres : on redemande l'état du
 * paiement à HelloAsso avant d'annoncer quoi que ce soit.
 */
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { checkoutIntentId } = await searchParams;
  let status: "paid" | "unpaid" | "unknown" = "unknown";
  let orderId: number | undefined;

  if (checkoutIntentId && /^\d+$/.test(checkoutIntentId) && isHelloAssoConfigured()) {
    try {
      const intent = await getCheckoutIntent(checkoutIntentId);
      status = isPaid(intent) ? "paid" : "unpaid";
      orderId = intent.order?.id;
    } catch (err) {
      console.error("[helloasso] lecture du paiement impossible", err);
    }
  }

  return <ReturnView status={status} orderId={orderId} />;
}
