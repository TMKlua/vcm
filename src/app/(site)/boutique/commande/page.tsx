import type { Metadata } from "next";
import CheckoutView from "./CheckoutView";

export const metadata: Metadata = {
  title: "Ma commande · Boutique",
  robots: { index: false, follow: false },
};

export default function CommandePage() {
  return <CheckoutView />;
}
