import type { Metadata } from "next";
import EquipesView from "./EquipesView";

export const metadata: Metadata = {
  title: "Nos Équipes",
  description:
    "Découvrez toutes les équipes et pratiques du Volley Club Marseillanais : Baby Volley, Pôle Jeunes, Loisir, Compétition, Soft Volley, Sport Santé et Beach Volley. Une place pour chaque âge et chaque niveau à Marseillan.",
};

export default function EquipesPage() {
  return <EquipesView />;
}
