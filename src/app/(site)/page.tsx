import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import StatsSection from "@/components/sections/StatsSection";
import TeamsPreview from "@/components/sections/TeamsPreview";
import EventsPreview from "@/components/sections/EventsPreview";
import ShopTeaser from "@/components/sections/ShopTeaser";
import GalleryPreview from "@/components/sections/GalleryPreview";
import PartnersStrip from "@/components/sections/PartnersStrip";
import JoinCta from "@/components/sections/JoinCta";
import ContactQuick from "@/components/sections/ContactQuick";
import Marquee from "@/components/motion/Marquee";

/*
 * Pas de métadonnées ici : le titre d'onglet et la description Google de
 * l'accueil sont portés par la racine (`src/app/layout.tsx`), qui les lit dans
 * `seo.pages.home`. Les redéclarer à ce niveau ferait appliquer par-dessus le
 * gabarit « %s · … » et le nom du club apparaîtrait deux fois dans l'onglet.
 */

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <StatsSection />
      <TeamsPreview />
      <EventsPreview />
      <ShopTeaser />
      <GalleryPreview />
      <PartnersStrip />
      <div className="border-y border-white/[0.06] bg-night">
        <Marquee />
      </div>
      <JoinCta />
      <ContactQuick />
    </>
  );
}
