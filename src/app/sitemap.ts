import type { MetadataRoute } from "next";
import { getContent } from "@/content/store";
import { SITE_URL } from "@/lib/seo";

/* ── Static route definitions ───────────────────────────────────────────────── */

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/",             changeFrequency: "weekly",  priority: 1.0 },
  { path: "/histoire",     changeFrequency: "monthly", priority: 0.6 },
  { path: "/equipes",      changeFrequency: "monthly", priority: 0.8 },
  { path: "/sport-sante",  changeFrequency: "monthly", priority: 0.7 },
  { path: "/inscriptions", changeFrequency: "monthly", priority: 0.9 },
  { path: "/partenaires",  changeFrequency: "monthly", priority: 0.5 },
  { path: "/galerie",      changeFrequency: "monthly", priority: 0.6 },
  { path: "/actualites",   changeFrequency: "weekly",  priority: 0.8 },
  { path: "/contact",      changeFrequency: "monthly", priority: 0.7 },
];

/* ── Sitemap export ─────────────────────────────────────────────────────────── */

/**
 * Généré à chaque requête, comme le reste du site : sans cela Next figerait le
 * plan au moment du build, avec les articles qui existaient ce jour-là.
 */
export const dynamic = "force-dynamic";

/**
 * Le plan du site liste les actualités RÉELLEMENT publiées.
 *
 * Il partait des articles livrés avec le code : un article ajouté depuis /admin
 * n'était donc jamais signalé à Google, et un article supprimé y restait.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { content } = await getContent();
  const news = content.news;

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date("2025-09-01"),
      changeFrequency,
      priority,
    })
  );

  const articleEntries: MetadataRoute.Sitemap = news.map((article) => ({
    url: `${SITE_URL}/actualites/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticEntries, ...articleEntries];
}
