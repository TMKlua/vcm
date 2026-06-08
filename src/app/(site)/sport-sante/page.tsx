import type { Metadata } from "next";
import SportSanteView from "./SportSanteView";

export const metadata: Metadata = {
  title: "Sport Santé & Soft Volley",
  description:
    "Le programme Sport Santé et Soft Volley du VCM : une pratique ludique, conviviale et accessible à tous, particulièrement adaptée aux personnes non sportives, en reprise d'activité ou souhaitant prendre soin de leur santé dans un cadre bienveillant à Marseillan.",
};

export default function SportSantePage() {
  return <SportSanteView />;
}
