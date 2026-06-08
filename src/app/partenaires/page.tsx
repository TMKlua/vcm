import type { Metadata } from "next";
import PartenairesView from "./PartenairesView";

export const metadata: Metadata = {
  title: "Nos Partenaires",
  description:
    "Découvrez les partenaires et sponsors qui soutiennent le Volley Club Marseillanais à Marseillan. Rejoignez notre communauté de partenaires engagés pour le sport, la jeunesse et les valeurs du volley-ball.",
};

export default function PartenairesPage() {
  return <PartenairesView />;
}
