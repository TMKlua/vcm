import type { Metadata } from "next";
import { news } from "@/data/news";
import { getContent } from "@/content/store";
import { iconsFor, metadataFor } from "@/lib/seo";
import ArticleView from "./ArticleView";

/* ─────────────────────────────────────────────────────────────────────────────
   Static params — prerenders all 5 default article slugs at build time.
   dynamicParams = true allows admin-added articles (client-only) to resolve
   at runtime instead of returning a 404.
───────────────────────────────────────────────────────────────────────────── */
export const dynamicParams = true;

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

/* ─────────────────────────────────────────────────────────────────────────────
   Metadata — Next 16: params is a Promise.

   L'article est cherché dans le contenu PUBLIÉ, pas dans les données du code :
   un article écrit ou renommé depuis /admin porte donc son vrai titre dans
   l'onglet du navigateur et dans les partages, au lieu de retomber sur
   « Article introuvable ».
───────────────────────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { content } = await getContent();
  const article = content.news.find((n) => n.slug === slug);

  if (!article) {
    return {
      title: content.text.pages.actualites.notFoundTitle ?? "Article introuvable",
      icons: iconsFor(content.seo),
    };
  }

  const base = metadataFor(content, "actualites", `/actualites/${slug}`);

  return {
    ...base,
    title: article.title,
    description: article.excerpt,
    openGraph: {
      ...base.openGraph,
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image }],
    },
    twitter: {
      ...base.twitter,
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page component — Next 16: params is a Promise. Resolution happens client-side
   in ArticleView (reads content.news) so admin-added articles can render; no
   server notFound() for unknown slugs.
───────────────────────────────────────────────────────────────────────────── */
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticleView slug={slug} />;
}
