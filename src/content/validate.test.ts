import { describe, it, expect } from "vitest";

import { defaultContent } from "./defaults";
import {
  MAX_CONTENT_BYTES,
  REQUIRED_KEYS,
  isValidContent,
  validateContent,
} from "./validate";

describe("validateContent", () => {
  it("accepts the built-in default content", () => {
    const result = validateContent(defaultContent);
    expect(result.ok).toBe(true);
  });

  it("rejects a payload missing a required section and names it", () => {
    const withoutTeams: Record<string, unknown> = { ...defaultContent };
    delete withoutTeams.teams;
    const result = validateContent(withoutTeams);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("teams");
  });

  it("rejects non-objects", () => {
    for (const value of [null, undefined, "text", 42, []]) {
      expect(validateContent(value).ok).toBe(false);
    }
  });

  it("rejects a payload above the size ceiling", () => {
    const bloated = {
      ...defaultContent,
      // One oversized string is enough to blow past the limit.
      text: { ...defaultContent.text, filler: "x".repeat(MAX_CONTENT_BYTES + 1) },
    };
    const result = validateContent(bloated);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("volumineux");
  });

  it("accepts content that still carries inline data URLs (migration path)", () => {
    const withInlineImage = {
      ...defaultContent,
      club: { ...defaultContent.club, logo: "data:image/webp;base64,AAAA" },
    };
    // The save route uploads these; validation must not stand in the way.
    expect(validateContent(withInlineImage).ok).toBe(true);
  });
});

describe("isValidContent", () => {
  it("requires every top-level section", () => {
    const complete = Object.fromEntries(REQUIRED_KEYS.map((k) => [k, {}]));
    expect(isValidContent(complete)).toBe(true);
    expect(isValidContent({})).toBe(false);
  });
});
