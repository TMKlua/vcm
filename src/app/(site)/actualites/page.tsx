import type { Metadata } from "next";
import ActualitesView from "./ActualitesView";
import { getContent } from "@/content/store";
import { metadataFor } from "@/lib/seo";

/**
 * Titre d'onglet et description Google de cette page — éditables depuis /admin,
 * section « Référencement & favicon ». Les valeurs livrées avec le site sont
 * celles qui étaient auparavant écrites en dur ici.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getContent();
  return metadataFor(content, "actualites", "/actualites");
}

export default function ActualitesPage() {
  return <ActualitesView />;
}
