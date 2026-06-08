import { describe, it, expect } from "vitest";
import { validateContact, buildMailto } from "@/lib/validation";

describe("validateContact", () => {
  it("signale les champs vides/invalides", () => {
    const e = validateContact({ name: "", email: "x", message: "court" });
    expect(e.name).toBeTruthy();
    expect(e.email).toBeTruthy();
    expect(e.message).toBeTruthy();
  });

  it("ne signale rien quand tout est valide", () => {
    const e = validateContact({ name: "Jean", email: "a@b.fr", message: "Bonjour, je veux m'inscrire svp." });
    expect(Object.keys(e)).toHaveLength(0);
  });
});

describe("buildMailto", () => {
  it("génère un mailto encodé", () => {
    const url = buildMailto("club@x.fr", { name: "Jean", email: "a@b.fr", message: "Bonjour ceci est un test." });
    expect(url.startsWith("mailto:club@x.fr?subject=")).toBe(true);
  });
});
