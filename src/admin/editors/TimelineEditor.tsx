"use client";

import { Plus } from "lucide-react";
import type { TimelineEntry } from "@/types";
import { useAdminDraft } from "../useAdminDraft";
import { Button, Card, Field, SectionTitle, TextArea, TextInput } from "../ui";
import { moveItem } from "./shared";
import { ItemControls, EmptyState } from "./CollectionControls";

export default function TimelineEditor() {
  const { draft, setSection } = useAdminDraft();
  if (!draft) return null;
  const timeline = draft.timeline;

  function commit(next: TimelineEntry[]) {
    setSection("timeline", next);
  }
  function patch(i: number, partial: Partial<TimelineEntry>) {
    commit(timeline.map((e, idx) => (idx === i ? { ...e, ...partial } : e)));
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Historique (timeline)"
        description="Les grandes étapes du club, affichées sur la page Histoire."
      />

      {timeline.length === 0 && (
        <EmptyState>Aucune étape pour le moment.</EmptyState>
      )}

      <div className="space-y-4">
        {timeline.map((entry, i) => (
          <Card key={i} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white/70">
                Étape #{i + 1}
              </h3>
              <ItemControls
                index={i}
                count={timeline.length}
                label={entry.title || entry.year || `Étape #${i + 1}`}
                onMoveUp={() => commit(moveItem(timeline, i, i - 1))}
                onMoveDown={() => commit(moveItem(timeline, i, i + 1))}
                onRemove={() => commit(timeline.filter((_, idx) => idx !== i))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
              <Field label="Année" htmlFor={`tl-year-${i}`}>
                <TextInput
                  id={`tl-year-${i}`}
                  value={entry.year}
                  onChange={(e) => patch(i, { year: e.target.value })}
                />
              </Field>
              <Field label="Titre" htmlFor={`tl-title-${i}`}>
                <TextInput
                  id={`tl-title-${i}`}
                  value={entry.title}
                  onChange={(e) => patch(i, { title: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Description" htmlFor={`tl-desc-${i}`}>
              <TextArea
                id={`tl-desc-${i}`}
                value={entry.description}
                onChange={(e) => patch(i, { description: e.target.value })}
              />
            </Field>
          </Card>
        ))}
      </div>

      <Button
        variant="primary"
        onClick={() =>
          commit([...timeline, { year: "", title: "", description: "" }])
        }
      >
        <Plus className="h-4 w-4" /> Ajouter une étape
      </Button>
    </div>
  );
}
