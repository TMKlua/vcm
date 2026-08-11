import { describe, it, expect } from "vitest";

import { defaultContent } from "./defaults";

/* ──────────────────────────────────────────────────────────────────────────
 * Sous-équipes livrées avec le site.
 *
 * Le contenu publié remplace `teams` en bloc et ignore encore la clé
 * `subTeams`, donc les sous-équipes d'exemple sont réappliquées après la
 * fusion. Ces tests verrouillent la règle qui décide OÙ elles s'appliquent :
 * `undefined` = jamais renseigné → exemple ; `[]` = vidé depuis /admin →
 * reste vide, sinon une suppression serait annulée à chaque rendu.
 * ────────────────────────────────────────────────────────────────────────── */

describe("sous-équipes par défaut", () => {
  it("attache la sous-équipe d'exemple au pôle jeunes", () => {
    const jeunes = defaultContent.teams.find((t) => t.slug === "jeunes");

    expect(jeunes).toBeDefined();
    expect(jeunes?.subTeams).toHaveLength(1);
    expect(jeunes?.subTeams?.[0]).toMatchObject({
      id: "jeunes-minimes-filles",
      name: "Minimes Filles",
    });
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
