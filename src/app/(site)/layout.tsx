import SmoothScroll from "@/components/motion/SmoothScroll";
import Loader from "@/components/layout/Loader";
import ScrollProgress from "@/components/layout/ScrollProgress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SkipLink from "@/components/ui/SkipLink";
import ChristmasTheme from "@/components/seasonal/ChristmasTheme";

/**
 * Public site chrome.
 *
 * Everything visual that wraps the public pages lives here — SkipLink, Loader,
 * Cursor, ScrollProgress, SmoothScroll, Navbar, the <main> landmark and Footer.
 * The admin (under /admin, outside this route group) gets none of it.
 *
 * Route groups `(name)` do not affect URLs, so all routes keep their paths.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SkipLink />
      <Loader />
      <ScrollProgress />
      {/* Habillage saisonnier (neige, guirlande) : réglage dans src/data/seasonal.ts */}
      <ChristmasTheme />
      <SmoothScroll>
        <Navbar />
        <main id="contenu" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
