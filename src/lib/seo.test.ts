import { describe, it, expect } from "vitest";

import { defaultContent } from "@/content/defaults";
import type { SiteContent } from "@/content/types";
import { iconsFor, metadataFor } from "./seo";

/* ──────────────────────────────────────────────────────────────────────────
 * Métadonnées pilotées par le contenu.
 *
 * Ces tests verrouillent trois promesses faites à l'admin :
 *  - le favicon saisi dans /admin arrive bien dans le <head> ;
 *  - un champ laissé vide retombe sur la valeur livrée, jamais sur du vide ;
 *  - le gabarit « %s · … » ne s'applique qu'à la racine, sinon le nom du club
 *    apparaîtrait deux fois dans l'onglet de l'accueil.
 * ────────────────────────────────────────────────────────────────────────── */

function withSeo(seo: SiteContent["seo"]): SiteContent {
  return { ...defaultContent, seo };
}

describe("iconsFor", () => {
  it("utilise le favicon choisi dans l'admin", () => {
    const icons = iconsFor({ favicon: "https://blob.example/logo.png" });

    expect(JSON.stringify(icons)).toContain("https://blob.example/logo.png");
  });

  it("retombe sur l'icône livrée quand le champ est vide", () => {
    expect(JSON.stringify(iconsFor({ favicon: "   " }))).toContain("/icon.png");
    expect(JSON.stringify(iconsFor(undefined))).toContain("/icon.png");
  });

  it("distingue l'icône iOS du favicon", () => {
    const icons = iconsFor({ favicon: "/a.png", appleIcon: "/b.png" });

    expect(JSON.stringify(icons)).toContain("/a.png");
    expect(JSON.stringify(icons)).toContain("/b.png");
  });
});

describe("metadataFor", () => {
  it("porte le gabarit de titre uniquement à la racine", () => {
    const root = metadataFor(defaultContent, undefined, "/");
    const page = metadataFor(defaultContent, "histoire", "/histoire");

    expect(root.title).toMatchObject({ template: expect.stringContaining("%s") });
    // Une page interne renvoie une chaîne simple : c'est Next qui lui applique
    // le gabarit de la racine. Un objet ici ferait doubler le suffixe.
    expect(typeof page.title).toBe("string");
  });

  it("donne à la racine le titre de l'accueil", () => {
    const content = withSeo({
      ...defaultContent.seo,
      pages: { home: { title: "Accueil du VCM" } },
    });

    expect(metadataFor(content, undefined, "/").title).toMatchObject({
      default: "Accueil du VCM",
    });
  });

  it("reprend le titre et la description propres à la page", () => {
    const content = withSeo({
      ...defaultContent.seo,
      pages: { contact: { title: "Nous écrire", description: "Coordonnées." } },
    });

    const meta = metadataFor(content, "contact", "/contact");

    expect(meta.title).toBe("Nous écrire");
    expect(meta.description).toBe("Coordonnées.");
  });

  it("retombe sur la description générale quand la page n'en a pas", () => {
    const content = withSeo({ description: "Description du club." });

    expect(metadataFor(content, "galerie", "/galerie").description).toBe(
      "Description du club.",
    );
  });

  it("ne renvoie jamais un titre ou une description vides", () => {
    const content = withSeo({
      siteName: "",
      defaultTitle: "",
      description: "",
      pages: { equipes: { title: "  ", description: "" } },
    });

    const meta = metadataFor(content, "equipes", "/equipes");

    expect(String(meta.title).trim()).not.toBe("");
    expect(String(meta.description).trim()).not.toBe("");
  });

  it("utilise l'image de partage choisie dans l'admin", () => {
    const content = withSeo({ ogImage: "https://blob.example/partage.jpg" });
    const meta = metadataFor(content, "actualites", "/actualites");

    expect(JSON.stringify(meta.openGraph)).toContain(
      "https://blob.example/partage.jpg",
    );
    expect(JSON.stringify(meta.twitter)).toContain(
      "https://blob.example/partage.jpg",
    );
  });

  it("pose le canonical sur le chemin de la page", () => {
    expect(
      metadataFor(defaultContent, "contact", "/contact").alternates?.canonical,
    ).toBe("/contact");
  });
});
