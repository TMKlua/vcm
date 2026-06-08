import type { Metadata } from "next";

import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import StatsSection from "@/components/sections/StatsSection";
import TeamsPreview from "@/components/sections/TeamsPreview";
import EventsPreview from "@/components/sections/EventsPreview";
import GalleryPreview from "@/components/sections/GalleryPreview";
import PartnersStrip from "@/components/sections/PartnersStrip";
import JoinCta from "@/components/sections/JoinCta";
import ContactQuick from "@/components/sections/ContactQuick";

export const metadata: Metadata = {
  title: "Volley Club Marseillanais — Club de volley à Marseillan",
  description:
    "Le Volley Club Marseillanais réunit passionnés et compétiteurs à Marseillan. Découvrez nos équipes, nos événements, notre galerie et rejoignez le club.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <StatsSection />
      <TeamsPreview />
      <EventsPreview />
      <GalleryPreview />
      <PartnersStrip />
      <JoinCta />
      <ContactQuick />
    </>
  );
}
