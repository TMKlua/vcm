"use client";

import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import type { Player, TeamContent } from "@/content/types";
import type { Team } from "@/types";
import { useAdminDraft } from "../useAdminDraft";
import { Button, Card, Field, SectionTitle, TextArea, TextInput } from "../ui";
import ImageInput from "../ImageInput";
import { genId, moveItem, uniqueSlug } from "./shared";
import { ItemControls, EmptyState } from "./CollectionControls";

const CATEGORIES: { value: Team["category"]; label: string }[] = [
  { value: "baby", label: "Baby Volley" },
  { value: "jeunes", label: "Jeunes" },
  { value: "loisir", label: "Loisir" },
  { value: "competition", label: "Compétition" },
  { value: "soft", label: "Soft Volley" },
  { value: "sante", label: "Sport Santé" },
  { value: "beach", label: "Beach Volley" },
];

const selectClasses =
  "w-full rounded-lg border border-white/15 bg-[#0a0418] px-3 py-2 text-sm text-white outline-none transition focus:border-[#a855f7] focus:ring-2 focus:ring-[#a855f7]/40";

export default function TeamsEditor() {
  const { draft, setSection } = useAdminDraft();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  if (!draft) return null;
  const teams = draft.teams;

  function commit(next: TeamContent[]) {
    setSection("teams", next);
  }
  function patch(i: number, partial: Partial<TeamContent>) {
    commit(teams.map((t, idx) => (idx === i ? { ...t, ...partial } : t)));
  }
  function patchPlayers(i: number, players: Player[]) {
    patch(i, { players });
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Équipes & joueurs"
        description="Gérez chaque équipe, ses informations, et son effectif (joueurs, rôles, photos)."
      />

      {teams.length === 0 && <EmptyState>Aucune équipe pour le moment.</EmptyState>}

      <div className="space-y-4">
        {teams.map((team, i) => {
          const open = openSlug === team.slug;
          return (
            <div
              key={team.slug}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#15082e]/60"
            >
              <div className="flex items-center gap-2 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setOpenSlug(open ? null : team.slug)}
                  aria-expanded={open}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left focus:outline-none"
                >
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-white/50 transition-transform ${open ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                  <span className="truncate font-display text-sm uppercase tracking-wide text-white">
                    {team.name || team.slug}
                  </span>
                  <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/50">
                    {team.players?.length ?? 0} joueur(s)
                  </span>
                </button>
                <ItemControls
                  index={i}
                  count={teams.length}
                  label={team.name || team.slug}
                  onMoveUp={() => commit(moveItem(teams, i, i - 1))}
                  onMoveDown={() => commit(moveItem(teams, i, i + 1))}
                  onRemove={() => commit(teams.filter((_, idx) => idx !== i))}
                />
              </div>

              {open && (
                <div className="space-y-4 border-t border-white/10 px-4 py-5 sm:px-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Nom" htmlFor={`team-name-${i}`}>
                      <TextInput
                        id={`team-name-${i}`}
                        value={team.name}
                        onChange={(e) => patch(i, { name: e.target.value })}
                      />
                    </Field>
                    <Field
                      label="Slug (URL / ancre)"
                      htmlFor={`team-slug-${i}`}
                    >
                      <TextInput
                        id={`team-slug-${i}`}
                        value={team.slug}
                        onChange={(e) => patch(i, { slug: e.target.value })}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Catégorie" htmlFor={`team-cat-${i}`}>
                      <select
                        id={`team-cat-${i}`}
                        value={team.category}
                        onChange={(e) =>
                          patch(i, {
                            category: e.target.value as Team["category"],
                          })
                        }
                        className={selectClasses}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field
                      label="Tranche d'âge"
                      htmlFor={`team-age-${i}`}
                    >
                      <TextInput
                        id={`team-age-${i}`}
                        value={team.ageRange ?? ""}
                        placeholder="ex. 6–11 ans"
                        onChange={(e) => patch(i, { ageRange: e.target.value })}
                      />
                    </Field>
                  </div>

                  <Field
                    label="Description courte"
                    htmlFor={`team-short-${i}`}
                  >
                    <TextArea
                      id={`team-short-${i}`}
                      rows={2}
                      value={team.shortDescription}
                      onChange={(e) =>
                        patch(i, { shortDescription: e.target.value })
                      }
                    />
                  </Field>

                  <Field label="Description" htmlFor={`team-desc-${i}`}>
                    <TextArea
                      id={`team-desc-${i}`}
                      value={team.description}
                      onChange={(e) =>
                        patch(i, { description: e.target.value })
                      }
                    />
                  </Field>

                  <Field
                    label="Objectifs"
                    htmlFor={`team-obj-${i}`}
                    hint="Un objectif par ligne. Les lignes vides sont ignorées."
                  >
                    <TextArea
                      id={`team-obj-${i}`}
                      rows={Math.max(3, team.objectives.length + 1)}
                      value={team.objectives.join("\n")}
                      onChange={(e) =>
                        patch(i, {
                          objectives: e.target.value
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </Field>

                  <Field label="Créneaux" htmlFor={`team-sched-${i}`}>
                    <TextInput
                      id={`team-sched-${i}`}
                      value={team.schedule}
                      onChange={(e) => patch(i, { schedule: e.target.value })}
                    />
                  </Field>

                  <ImageInput
                    label="Image de l'équipe"
                    value={team.image}
                    onChange={(src) => patch(i, { image: src })}
                  />

                  {/* Players sub-editor */}
                  <PlayersEditor
                    teamIndex={i}
                    players={team.players ?? []}
                    onChange={(players) => patchPlayers(i, players)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button
        variant="primary"
        onClick={() => {
          const slug = uniqueSlug(
            "nouvelle-equipe",
            teams.map((t) => t.slug),
          );
          const next: TeamContent = {
            slug,
            name: "Nouvelle équipe",
            category: "loisir",
            shortDescription: "",
            description: "",
            objectives: [],
            schedule: "",
            image: "",
            players: [],
          };
          commit([...teams, next]);
          setOpenSlug(slug);
        }}
      >
        <Plus className="h-4 w-4" /> Ajouter une équipe
      </Button>
    </div>
  );
}

/* ── Players sub-editor ──────────────────────────────────────────────────── */

function PlayersEditor({
  teamIndex,
  players,
  onChange,
}: {
  teamIndex: number;
  players: Player[];
  onChange: (players: Player[]) => void;
}) {
  function patch(i: number, partial: Partial<Player>) {
    onChange(players.map((p, idx) => (idx === i ? { ...p, ...partial } : p)));
  }

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-[#0a0418]/50 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-fuchsia-400">
        Effectif ({players.length})
      </h4>

      {players.length === 0 && (
        <p className="text-xs text-white/40">Aucun joueur pour cette équipe.</p>
      )}

      <div className="space-y-3">
        {players.map((player, i) => (
          <Card key={player.id} className="space-y-3 !p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-white/70">
                {player.name || `Joueur #${i + 1}`}
              </span>
              <ItemControls
                index={i}
                count={players.length}
                label={player.name || `Joueur #${i + 1}`}
                onMoveUp={() => onChange(moveItem(players, i, i - 1))}
                onMoveDown={() => onChange(moveItem(players, i, i + 1))}
                onRemove={() => onChange(players.filter((_, idx) => idx !== i))}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_6rem]">
              <Field label="Nom" htmlFor={`pl-name-${teamIndex}-${i}`}>
                <TextInput
                  id={`pl-name-${teamIndex}-${i}`}
                  value={player.name}
                  onChange={(e) => patch(i, { name: e.target.value })}
                />
              </Field>
              <Field label="Rôle / poste" htmlFor={`pl-role-${teamIndex}-${i}`}>
                <TextInput
                  id={`pl-role-${teamIndex}-${i}`}
                  value={player.role}
                  onChange={(e) => patch(i, { role: e.target.value })}
                />
              </Field>
              <Field label="N°" htmlFor={`pl-num-${teamIndex}-${i}`}>
                <TextInput
                  id={`pl-num-${teamIndex}-${i}`}
                  value={player.number ?? ""}
                  onChange={(e) => patch(i, { number: e.target.value })}
                />
              </Field>
            </div>
            <ImageInput
              label="Photo du joueur"
              value={player.image ?? ""}
              onChange={(src) => patch(i, { image: src })}
            />
          </Card>
        ))}
      </div>

      <Button
        variant="secondary"
        onClick={() =>
          onChange([
            ...players,
            { id: genId("player"), name: "", role: "", number: "", image: "" },
          ])
        }
      >
        <Plus className="h-4 w-4" /> Ajouter un joueur
      </Button>
    </div>
  );
}
