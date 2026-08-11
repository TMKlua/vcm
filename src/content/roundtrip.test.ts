import { describe, it, expect } from "vitest";

import { defaultContent } from "./defaults";
import { collectDataUrls, replaceDataUrls } from "./images";
import { deepMerge } from "./merge";
import type { DeepPartial, SiteContent } from "./types";
import { validateContent } from "./validate";

/* ──────────────────────────────────────────────────────────────────────────
 * Aller-retour de sauvegarde, sur les clés AJOUTÉES au modèle.
 *
 * Le chemin réel est : /admin → POST /api/content → validateContent →
 * upload des images intégrées → writeContent (blob) → readContent →
 * deepMerge(defaultContent, blob). Ces tests rejouent chaque maillon sur les
 * nouvelles clés (`seo`, textes de navigation, images de page) pour vérifier
 * qu'elles empruntent EXACTEMENT le même circuit que les anciennes — et qu'au-
 * cune n'est silencieusement perdue en route.
 * ────────────────────────────────────────────────────────────────────────── */

/** Ce que l'admin enverrait après avoir touché aux nouveaux champs. */
function editedContent(): SiteContent {
  return {
    ...defaultContent,
    seo: {
      ...defaultContent.seo,
      favicon: "https://blob.example/images/abc123.png",
      pages: {
        ...defaultContent.seo?.pages,
        contact: { title: "Nous écrire", description: "Nos coordonnées." },
      },
    },
    text: {
      ...defaultContent.text,
      nav: { ...defaultContent.text.nav, sportSante: "Santé & bien-être" },
      marquee: ["UN", "DEUX"],
      pages: {
        ...defaultContent.text.pages,
        sportSante: {
          ...defaultContent.text.pages.sportSante,
          image: "https://blob.example/images/def456.jpg",
        },
      },
    },
  };
}

describe("aller-retour de sauvegarde des nouvelles clés", () => {
  it("laisse passer la validation du serveur", () => {
    const result = validateContent(editedContent());

    expect(result.ok).toBe(true);
  });

  it("ne perd ni les réglages SEO ni les nouveaux textes à la validation", () => {
    const result = validateContent(editedContent());
    if (!result.ok) throw new Error(result.error);

    expect(result.content.seo?.favicon).toBe(
      "https://blob.example/images/abc123.png",
    );
    expect(result.content.seo?.pages?.contact?.title).toBe("Nous écrire");
    expect(result.content.text.nav?.sportSante).toBe("Santé & bien-être");
    expect(result.content.text.marquee).toEqual(["UN", "DEUX"]);
  });

  it("survit à la relecture du blob (fusion sur les défauts)", () => {
    const stored = JSON.parse(JSON.stringify(editedContent()));
    const reread = deepMerge(
      defaultContent,
      stored as DeepPartial<SiteContent>,
    );

    expect(reread.seo?.favicon).toBe("https://blob.example/images/abc123.png");
    expect(reread.text.pages.sportSante.image).toBe(
      "https://blob.example/images/def456.jpg",
    );
    expect(reread.text.nav?.sportSante).toBe("Santé & bien-être");
  });

  it("garde les valeurs livrées pour une clé jamais renseignée", () => {
    // Un contenu publié AVANT l'ajout de ces clés : elles doivent reprendre la
    // valeur du code, pas partir `undefined` et casser une page.
    const ancien = JSON.parse(JSON.stringify(defaultContent));
    delete ancien.seo;
    delete ancien.text.nav;
    delete ancien.text.pages.sportSante.image;

    const reread = deepMerge(defaultContent, ancien as DeepPartial<SiteContent>);

    expect(reread.seo?.favicon).toBe("/icon.png");
    expect(reread.text.nav?.home).toBe("Accueil");
    expect(reread.text.pages.sportSante.image).toBe(
      "/images/teams/sport-sante.jpg",
    );
  });

  it("envoie au stockage d'images une photo déposée dans un nouveau champ", () => {
    // Une image choisie hors ligne arrive en `data:` ; le serveur doit la
    // repérer où qu'elle soit dans l'arbre — y compris sous `seo`.
    const dataUrl = "data:image/png;base64,AAAA";
    const content = {
      ...defaultContent,
      seo: { ...defaultContent.seo, favicon: dataUrl },
    };

    expect(collectDataUrls(content).has(dataUrl)).toBe(true);

    const swapped = replaceDataUrls(
      content,
      new Map([[dataUrl, "https://blob.example/images/hash.png"]]),
    );
    expect(swapped.seo?.favicon).toBe("https://blob.example/images/hash.png");
  });

  it("reste très loin du plafond de taille du blob", () => {
    const bytes = new TextEncoder().encode(
      JSON.stringify(defaultContent),
    ).length;

    expect(bytes).toBeLessThan(500 * 1024);
  });
});
