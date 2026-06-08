"use client";

import { Plus, AlertTriangle } from "lucide-react";
import type { NewsArticle } from "@/types";
import { useAdminDraft } from "../useAdminDraft";
import { Button, Card, Field, SectionTitle, TextArea, TextInput } from "../ui";
import ImageInput from "../ImageInput";
import { moveItem, uniqueSlug, isoToDateInput, todayISO } from "./shared";
import { ItemControls, EmptyState } from "./CollectionControls";

export default function NewsEditor() {
  const { draft, setSection } = useAdminDraft();
  if (!draft) return null;
  const news = draft.news;

  function commit(next: NewsArticle[]) {
    setSection("news", next);
  }
  function patch(i: number, partial: Partial<NewsArticle>) {
    commit(news.map((a, idx) => (idx === i ? { ...a, ...partial } : a)));
  }

  // slug → count, to flag duplicates.
  const slugCounts = news.reduce<Record<string, number>>((acc, a) => {
    acc[a.slug] = (acc[a.slug] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Actualités"
        description="Les articles publiés sur le site."
      />

      {news.length === 0 && (
        <EmptyState>Aucune actualité pour le moment.</EmptyState>
      )}

      <div className="space-y-4">
        {news.map((article, i) => {
          const dupSlug = article.slug !== "" && slugCounts[article.slug] > 1;
          return (
            <Card key={i} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-white/70">
                  {article.title || `Article #${i + 1}`}
                </h3>
                <ItemControls
                  index={i}
                  count={news.length}
                  label={article.title || `Article #${i + 1}`}
                  onMoveUp={() => commit(moveItem(news, i, i - 1))}
                  onMoveDown={() => commit(moveItem(news, i, i + 1))}
                  onRemove={() => commit(news.filter((_, idx) => idx !== i))}
                />
              </div>

              <Field label="Titre" htmlFor={`news-title-${i}`}>
                <TextInput
                  id={`news-title-${i}`}
                  value={article.title}
                  onChange={(e) => patch(i, { title: e.target.value })}
                />
              </Field>

              <Field
                label="Slug (URL)"
                htmlFor={`news-slug-${i}`}
                hint="Identifiant dans l'URL de l'article. Doit être unique."
              >
                <TextInput
                  id={`news-slug-${i}`}
                  value={article.slug}
                  onChange={(e) => patch(i, { slug: e.target.value })}
                />
              </Field>
              {dupSlug && (
                <p
                  role="alert"
                  className="flex items-center gap-1.5 text-xs text-amber-300"
                >
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                  Ce slug est utilisé par un autre article.
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Date" htmlFor={`news-date-${i}`}>
                  <TextInput
                    id={`news-date-${i}`}
                    type="date"
                    value={isoToDateInput(article.date)}
                    onChange={(e) => patch(i, { date: e.target.value })}
                  />
                </Field>
                <Field label="Catégorie" htmlFor={`news-cat-${i}`}>
                  <TextInput
                    id={`news-cat-${i}`}
                    value={article.category}
                    onChange={(e) => patch(i, { category: e.target.value })}
                  />
                </Field>
              </div>

              <Field label="Auteur" htmlFor={`news-author-${i}`}>
                <TextInput
                  id={`news-author-${i}`}
                  value={article.author ?? ""}
                  onChange={(e) => patch(i, { author: e.target.value })}
                />
              </Field>

              <Field label="Extrait" htmlFor={`news-excerpt-${i}`}>
                <TextArea
                  id={`news-excerpt-${i}`}
                  rows={2}
                  value={article.excerpt}
                  onChange={(e) => patch(i, { excerpt: e.target.value })}
                />
              </Field>

              <Field
                label="Contenu"
                htmlFor={`news-content-${i}`}
                hint="Un paragraphe par ligne. Les lignes vides sont ignorées."
              >
                <TextArea
                  id={`news-content-${i}`}
                  rows={Math.max(4, article.content.length + 1)}
                  value={article.content.join("\n")}
                  onChange={(e) =>
                    patch(i, {
                      content: e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </Field>

              <ImageInput
                label="Image"
                value={article.image}
                onChange={(src) => patch(i, { image: src })}
              />
            </Card>
          );
        })}
      </div>

      <Button
        variant="primary"
        onClick={() =>
          commit([
            ...news,
            {
              slug: uniqueSlug(
                "nouvel-article",
                news.map((a) => a.slug),
              ),
              title: "Nouvel article",
              excerpt: "",
              content: [],
              date: todayISO(),
              category: "",
              image: "",
              author: "",
            },
          ])
        }
      >
        <Plus className="h-4 w-4" /> Ajouter une actualité
      </Button>
    </div>
  );
}
