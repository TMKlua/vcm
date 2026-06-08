import type { Metadata } from "next";
import HistoireView from "./HistoireView";

export const metadata: Metadata = {
  title: "Notre Histoire",
  description:
    "Découvrez l'histoire du Volley Club Marseillanais : des origines du club au bord de l'étang de Thau jusqu'à aujourd'hui, en passant par le développement des sections jeunes, beach volley et sport santé.",
};

export default function HistoirePage() {
  return <HistoireView />;
}
