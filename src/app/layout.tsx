import type { Metadata } from "next";
import "./globals.css";
import { display, sans } from "@/lib/fonts";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Loader from "@/components/layout/Loader";
import Cursor from "@/components/layout/Cursor";
import ScrollProgress from "@/components/layout/ScrollProgress";

export const metadata: Metadata = {
  title: "Volley Club Marseillanais",
  description: "Site officiel du Volley Club Marseillanais",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body>
        <Loader />
        <Cursor />
        <ScrollProgress />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
