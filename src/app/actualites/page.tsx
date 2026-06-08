import type { Metadata } from "next";
import ActualitesView from "./ActualitesView";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Retrouvez toutes les dernières actualités du Volley Club Marseillanais : résultats, événements, vie du club, beach volley, sport santé et bien plus.",
};

export default function ActualitesPage() {
  return <ActualitesView />;
}
