import type { Metadata } from "next";
import InscriptionsView from "./InscriptionsView";

export const metadata: Metadata = {
  title: "Inscriptions",
  description:
    "Comment rejoindre le Volley Club Marseillanais : étapes d'inscription, documents nécessaires (certificat médical, licence FFVolley), tarifs et FAQ. Contactez-nous pour une séance d'essai gratuite à Marseillan.",
};

export default function InscriptionsPage() {
  return <InscriptionsView />;
}
