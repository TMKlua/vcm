import type { Metadata } from "next";
import "./globals.css";
import { display, sans } from "@/lib/fonts";

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
      <body>{children}</body>
    </html>
  );
}
