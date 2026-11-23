"use client";

import { Plus } from "lucide-react";
import type { Partner } from "@/types";
import { useAdminDraft } from "../useAdminDraft";
import { Button, Card, Field, SectionTitle, TextArea, TextInput } from "../ui";
import { isPackTier, packText, PACK_TIERS } from "@/data/partnerPacks";
import ImageInput from "../ImageInput";
import { moveItem } from "./shared";
import { ItemControls, EmptyState } from "./CollectionControls";

/** Anciens niveaux : gardés pour les partenaires publiés avant les packs. */
const LEGACY_TIERS: { value: Partner["tier"]; label: string }[] = [
  { value: "principal", label: "Principal (ancien niveau)" },
  { value: "officiel", label: "Officiel (ancien niveau)" },
];

const selectClasses =
  "w-full rounded-lg border border-white/15 bg-[#0a0418] px-3 py-2 text-sm text-white outline-none transition focus:border-[#a855f7] focus:ring-2 focus:ring-[#a855f7]/40";

export default function PartnersEditor() {
  const { draft, setSection, update } = useAdminDraft();
  if (!draft) return null;
  const partners = draft.partners;
  const packs = draft.text.pages.partenaires.packs;

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

      <Card className="space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-white">Packs partenaires</h3>
          <p className="mt-1 text-xs text-white/50">
            Intitulé et légende de chaque pack, affichés sur la page Partenaires
            au-dessus des logos du pack. Un champ vide reprend le texte de la plaquette.
          </p>
        </div>
        {PACK_TIERS.map((tier) => (
          <div key={tier} className="grid gap-3 sm:grid-cols-[14rem_1fr]">
            <Field label="Intitulé" htmlFor={`pack-label-${tier}`}>
              <TextInput
                id={`pack-label-${tier}`}
                value={packs?.[tier]?.label ?? ""}
                placeholder={packText(undefined, tier).label}
                onChange={(e) => update(`text.pages.partenaires.packs.${tier}.label`, e.target.value)}
              />
            </Field>
            <Field label="Légende : ce que comprend le pack" htmlFor={`pack-desc-${tier}`}>
              <TextArea
                id={`pack-desc-${tier}`}
                rows={2}
                value={packs?.[tier]?.description ?? ""}
                placeholder={packText(undefined, tier).description}
                onChange={(e) => update(`text.pages.partenaires.packs.${tier}.description`, e.target.value)}
              />
            </Field>
          </div>
        ))}
      </Card>

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
              <Field label="Pack" htmlFor={`pt-tier-${i}`}>
                <select
                  id={`pt-tier-${i}`}
                  value={p.tier}
                  onChange={(e) =>
                    patch(i, { tier: e.target.value as Partner["tier"] })
                  }
                  className={selectClasses}
                >
                  {PACK_TIERS.map((tier) => (
                    <option key={tier} value={tier}>
                      {packText(packs, tier).label}
                    </option>
                  ))}
                  <option value="institutionnel">Institution (collectivité, fédération)</option>
                  {LEGACY_TIERS.filter((t) => t.value === p.tier).map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {isPackTier(p.tier) && (
                  <p className="mt-1.5 text-xs text-white/50">{packText(packs, p.tier).description}</p>
                )}
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
            { name: "", logo: "", url: "", tier: "digital" },
          ])
        }
      >
        <Plus className="h-4 w-4" /> Ajouter un partenaire
      </Button>
    </div>
  );
}
