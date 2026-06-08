import type { Metadata } from "next";
import GalerieView from "./GalerieView";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Plongez dans la vie du Volley Club Marseillanais en images : matchs, entraînements, beach volley, jeunes et événements du club à Marseillan, au bord de l'étang de Thau.",
};

export default function GaleriePage() {
  return <GalerieView />;
}
