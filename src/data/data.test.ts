import { describe, it, expect } from "vitest";
import { teams } from "@/data/teams";
import { news } from "@/data/news";
import { navLinks } from "@/data/nav";

describe("data integrity", () => {
  it("teams ont des slugs uniques et non vides", () => {
    const slugs = teams.map(t => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.every(Boolean)).toBe(true);
  });

  it("chaque équipe a au moins un objectif", () => {
    expect(teams.every(t => t.objectives.length > 0)).toBe(true);
  });

  it("news ont des slugs uniques", () => {
    const slugs = news.map(n => n.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("nav: tous les href commencent par /", () => {
    const all = navLinks.flatMap(l => [l, ...(l.children ?? [])]);
    expect(all.every(l => l.href.startsWith("/"))).toBe(true);
  });
});
