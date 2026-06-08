import type { Metadata } from "next";
import ContactView from "./ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez le Volley Club Marseillanais à Marseillan (Hérault). Retrouvez nos coordonnées, l'adresse du Gymnase Louis Boudou, nos horaires d'entraînement et écrivez-nous directement depuis cette page.",
};

export default function ContactPage() {
  return <ContactView />;
}
