import type { Metadata } from "next";
import { news } from "@/data/news";
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
   Metadata — Next 16: params is a Promise. Uses build-time defaults (SEO).
───────────────────────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = news.find((n) => n.slug === slug);

  if (!article) {
    return {
      title: "Article introuvable",
    };
  }

  return {
    title: `${article.title}`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image }],
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
