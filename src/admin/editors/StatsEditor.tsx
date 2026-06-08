"use client";

import { Plus } from "lucide-react";
import type { Stat } from "@/types";
import { useAdminDraft } from "../useAdminDraft";
import {
  Button,
  Card,
  Field,
  NumberInput,
  SectionTitle,
  TextInput,
} from "../ui";
import { moveItem } from "./shared";
import { ItemControls, EmptyState } from "./CollectionControls";

export default function StatsEditor() {
  const { draft, setSection } = useAdminDraft();
  if (!draft) return null;
  const stats = draft.stats;

  function commit(next: Stat[]) {
    setSection("stats", next);
  }
  function patch(i: number, partial: Partial<Stat>) {
    commit(stats.map((s, idx) => (idx === i ? { ...s, ...partial } : s)));
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Chiffres clés"
        description="Les statistiques mises en avant sur la page d'accueil."
      />

      {stats.length === 0 && <EmptyState>Aucun chiffre pour le moment.</EmptyState>}

      <div className="space-y-4">
        {stats.map((stat, i) => (
          <Card key={i} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white/70">
                Chiffre #{i + 1}
              </h3>
              <ItemControls
                index={i}
                count={stats.length}
                label={stat.label || `Chiffre #${i + 1}`}
                onMoveUp={() => commit(moveItem(stats, i, i - 1))}
                onMoveDown={() => commit(moveItem(stats, i, i + 1))}
                onRemove={() => commit(stats.filter((_, idx) => idx !== i))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Valeur" htmlFor={`stat-value-${i}`}>
                <NumberInput
                  id={`stat-value-${i}`}
                  value={Number.isFinite(stat.value) ? stat.value : 0}
                  onChange={(e) =>
                    patch(i, { value: Number(e.target.value) || 0 })
                  }
                />
              </Field>
              <Field label="Suffixe" htmlFor={`stat-suffix-${i}`}>
                <TextInput
                  id={`stat-suffix-${i}`}
                  value={stat.suffix ?? ""}
                  placeholder="+, %, …"
                  onChange={(e) => patch(i, { suffix: e.target.value })}
                />
              </Field>
              <Field label="Libellé" htmlFor={`stat-label-${i}`}>
                <TextInput
                  id={`stat-label-${i}`}
                  value={stat.label}
                  onChange={(e) => patch(i, { label: e.target.value })}
                />
              </Field>
            </div>
          </Card>
        ))}
      </div>

      <Button
        variant="primary"
        onClick={() => commit([...stats, { value: 0, suffix: "", label: "" }])}
      >
        <Plus className="h-4 w-4" /> Ajouter un chiffre
      </Button>
    </div>
  );
}
