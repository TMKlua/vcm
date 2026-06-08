"use client";

import { Plus } from "lucide-react";
import type { ClubEvent } from "@/types";
import { useAdminDraft } from "../useAdminDraft";
import { Button, Card, Field, SectionTitle, TextArea, TextInput } from "../ui";
import ImageInput from "../ImageInput";
import { genId, moveItem, isoToDateInput } from "./shared";
import { ItemControls, EmptyState } from "./CollectionControls";

export default function EventsEditor() {
  const { draft, setSection } = useAdminDraft();
  if (!draft) return null;
  const events = draft.events;

  function commit(next: ClubEvent[]) {
    setSection("events", next);
  }
  function patch(i: number, partial: Partial<ClubEvent>) {
    commit(events.map((e, idx) => (idx === i ? { ...e, ...partial } : e)));
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Événements"
        description="Les rendez-vous et temps forts du club."
      />

      {events.length === 0 && (
        <EmptyState>Aucun événement pour le moment.</EmptyState>
      )}

      <div className="space-y-4">
        {events.map((ev, i) => (
          <Card key={ev.id} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white/70">
                {ev.title || `Événement #${i + 1}`}
              </h3>
              <ItemControls
                index={i}
                count={events.length}
                label={ev.title || `Événement #${i + 1}`}
                onMoveUp={() => commit(moveItem(events, i, i - 1))}
                onMoveDown={() => commit(moveItem(events, i, i + 1))}
                onRemove={() => commit(events.filter((_, idx) => idx !== i))}
              />
            </div>
            <Field label="Titre" htmlFor={`ev-title-${i}`}>
              <TextInput
                id={`ev-title-${i}`}
                value={ev.title}
                onChange={(e) => patch(i, { title: e.target.value })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date" htmlFor={`ev-date-${i}`}>
                <TextInput
                  id={`ev-date-${i}`}
                  type="date"
                  value={isoToDateInput(ev.date)}
                  onChange={(e) => patch(i, { date: e.target.value })}
                />
              </Field>
              <Field label="Lieu" htmlFor={`ev-loc-${i}`}>
                <TextInput
                  id={`ev-loc-${i}`}
                  value={ev.location}
                  onChange={(e) => patch(i, { location: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Description" htmlFor={`ev-desc-${i}`}>
              <TextArea
                id={`ev-desc-${i}`}
                value={ev.description}
                onChange={(e) => patch(i, { description: e.target.value })}
              />
            </Field>
            <ImageInput
              label="Image"
              value={ev.image}
              onChange={(src) => patch(i, { image: src })}
            />
          </Card>
        ))}
      </div>

      <Button
        variant="primary"
        onClick={() =>
          commit([
            ...events,
            {
              id: genId("event"),
              title: "",
              date: "",
              location: "",
              description: "",
              image: "",
            },
          ])
        }
      >
        <Plus className="h-4 w-4" /> Ajouter un événement
      </Button>
    </div>
  );
}
