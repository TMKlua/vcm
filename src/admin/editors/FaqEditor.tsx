"use client";

import { Plus } from "lucide-react";
import type { FaqItem } from "@/types";
import { useAdminDraft } from "../useAdminDraft";
import { Button, Card, Field, SectionTitle, TextArea, TextInput } from "../ui";
import { moveItem } from "./shared";
import { ItemControls, EmptyState } from "./CollectionControls";

export default function FaqEditor() {
  const { draft, setSection } = useAdminDraft();
  if (!draft) return null;
  const faq = draft.faq;

  function commit(next: FaqItem[]) {
    setSection("faq", next);
  }
  function patch(i: number, partial: Partial<FaqItem>) {
    commit(faq.map((f, idx) => (idx === i ? { ...f, ...partial } : f)));
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="FAQ"
        description="Questions fréquentes affichées sur la page Inscriptions."
      />

      {faq.length === 0 && <EmptyState>Aucune question pour le moment.</EmptyState>}

      <div className="space-y-4">
        {faq.map((item, i) => (
          <Card key={i} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white/70">
                Question #{i + 1}
              </h3>
              <ItemControls
                index={i}
                count={faq.length}
                label={item.question || `Question #${i + 1}`}
                onMoveUp={() => commit(moveItem(faq, i, i - 1))}
                onMoveDown={() => commit(moveItem(faq, i, i + 1))}
                onRemove={() => commit(faq.filter((_, idx) => idx !== i))}
              />
            </div>
            <Field label="Question" htmlFor={`faq-q-${i}`}>
              <TextInput
                id={`faq-q-${i}`}
                value={item.question}
                onChange={(e) => patch(i, { question: e.target.value })}
              />
            </Field>
            <Field label="Réponse" htmlFor={`faq-a-${i}`}>
              <TextArea
                id={`faq-a-${i}`}
                value={item.answer}
                onChange={(e) => patch(i, { answer: e.target.value })}
              />
            </Field>
          </Card>
        ))}
      </div>

      <Button
        variant="primary"
        onClick={() => commit([...faq, { question: "", answer: "" }])}
      >
        <Plus className="h-4 w-4" /> Ajouter une question
      </Button>
    </div>
  );
}
