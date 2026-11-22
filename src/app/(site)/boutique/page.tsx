import type { Metadata } from "next";
import BoutiqueView from "./BoutiqueView";
import { getContent } from "@/content/store";
import { metadataFor } from "@/lib/seo";

/**
 * La boutique est encore un aperçu (prix à valider, paiement non branché) :
 * elle reste hors de Google et hors du sitemap jusqu'à son ouverture.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getContent();
  const base = metadataFor(content, "boutique", "/boutique");
  return {
    ...base,
    title: content.seo?.pages?.boutique?.title?.trim() || "Boutique officielle",
    robots: { index: false, follow: true },
  };
}

export default function BoutiquePage() {
  return <BoutiqueView />;
}
