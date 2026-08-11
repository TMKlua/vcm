import type { Metadata } from "next";
import ContactView from "./ContactView";
import { getContent } from "@/content/store";
import { metadataFor } from "@/lib/seo";

/**
 * Titre d'onglet et description Google de cette page — éditables depuis /admin,
 * section « Référencement & favicon ». Les valeurs livrées avec le site sont
 * celles qui étaient auparavant écrites en dur ici.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getContent();
  return metadataFor(content, "contact", "/contact");
}

export default function ContactPage() {
  return <ContactView />;
}
