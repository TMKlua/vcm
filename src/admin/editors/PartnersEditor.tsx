"use client";

import { Plus } from "lucide-react";
import type { Partner } from "@/types";
import { useAdminDraft } from "../useAdminDraft";
import { Button, Card, Field, SectionTitle, TextInput } from "../ui";
import ImageInput from "../ImageInput";
import { moveItem } from "./shared";
import { ItemControls, EmptyState } from "./CollectionControls";

const TIERS: { value: Partner["tier"]; label: string }[] = [
  { value: "principal", label: "Principal" },
  { value: "officiel", label: "Officiel" },
  { value: "institutionnel", label: "Institutionnel" },
];

const selectClasses =
  "w-full rounded-lg border border-white/15 bg-[#0a0418] px-3 py-2 text-sm text-white outline-none transition focus:border-[#a855f7] focus:ring-2 focus:ring-[#a855f7]/40";

export default function PartnersEditor() {
  const { draft, setSection } = useAdminDraft();
  if (!draft) return null;
  const partners = draft.partners;

  function commit(next: Partner[]) {
    setSection("partners", next);
  }
  function patch(i: number, partial: Partial<Partner>) {
    commit(partners.map((p, idx) => (idx === i ? { ...p, ...partial } : p)));
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Partenaires"
        description="Les partenaires et sponsors du club."
      />

      {partners.length === 0 && (
        <EmptyState>Aucun partenaire pour le moment.</EmptyState>
      )}

      <div className="space-y-4">
        {partners.map((p, i) => (
          <Card key={i} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white/70">
                {p.name || `Partenaire #${i + 1}`}
              </h3>
              <ItemControls
                index={i}
                count={partners.length}
                label={p.name || `Partenaire #${i + 1}`}
                onMoveUp={() => commit(moveItem(partners, i, i - 1))}
                onMoveDown={() => commit(moveItem(partners, i, i + 1))}
                onRemove={() => commit(partners.filter((_, idx) => idx !== i))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom" htmlFor={`pt-name-${i}`}>
                <TextInput
                  id={`pt-name-${i}`}
                  value={p.name}
                  onChange={(e) => patch(i, { name: e.target.value })}
                />
              </Field>
              <Field label="Niveau" htmlFor={`pt-tier-${i}`}>
                <select
                  id={`pt-tier-${i}`}
                  value={p.tier}
                  onChange={(e) =>
                    patch(i, { tier: e.target.value as Partner["tier"] })
                  }
                  className={selectClasses}
                >
                  {TIERS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Lien (URL)" htmlFor={`pt-url-${i}`}>
              <TextInput
                id={`pt-url-${i}`}
                value={p.url ?? ""}
                placeholder="https://…"
                onChange={(e) => patch(i, { url: e.target.value })}
              />
            </Field>
            <ImageInput
              label="Logo"
              value={p.logo}
              onChange={(src) => patch(i, { logo: src })}
            />
          </Card>
        ))}
      </div>

      <Button
        variant="primary"
        onClick={() =>
          commit([
            ...partners,
            { name: "", logo: "", url: "", tier: "officiel" },
          ])
        }
      >
        <Plus className="h-4 w-4" /> Ajouter un partenaire
      </Button>
    </div>
  );
}
