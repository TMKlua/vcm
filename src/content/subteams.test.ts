import { describe, it, expect } from "vitest";

import { defaultContent } from "./defaults";

/* ──────────────────────────────────────────────────────────────────────────
 * Sous-équipes.
 *
 * `defaultContent` = socle du code + contenu réellement publié (le snapshot).
 * La sous-équipe d'exemple livrée avec le site n'est réappliquée QUE sur une
 * équipe dont `subTeams` est absent — jamais par-dessus ce que le club a saisi.
 * Ces tests verrouillent cette priorité : le contenu du club gagne toujours.
 * ────────────────────────────────────────────────────────────────────────── */

describe("sous-équipes", () => {
  it("conserve les sous-équipes publiées par le club", () => {
    const jeunes = defaultContent.teams.find((t) => t.slug === "jeunes");

    expect(jeunes).toBeDefined();
    // Le club a saisi ses propres formations : l'exemple « Minimes Filles »
    // livré avec le code ne doit surtout pas les remplacer.
    expect(jeunes?.subTeams?.length).toBeGreaterThan(0);
    expect(jeunes?.subTeams?.map((s) => s.id)).not.toContain(
      "jeunes-minimes-filles",
    );
  });

  it("donne un nom à chaque sous-équipe", () => {
    const subTeams = defaultContent.teams.flatMap((t) => t.subTeams ?? []);

    for (const sub of subTeams) {
      expect(sub.name.trim()).not.toBe("");
    }
  });

  it("donne un identifiant unique à chaque sous-équipe", () => {
    const ids = defaultContent.teams.flatMap((t) =>
      (t.subTeams ?? []).map((s) => s.id),
    );

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("laisse les autres équipes sans sous-équipe", () => {
    const autres = defaultContent.teams.filter((t) => t.slug !== "jeunes");

    for (const team of autres) {
      expect(team.subTeams ?? []).toEqual([]);
    }
  });
});
