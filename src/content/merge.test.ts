import { describe, it, expect } from "vitest";
import { deepMerge } from "./merge";
import type { DeepPartial } from "./types";

describe("deepMerge", () => {
  it("merges nested objects without mutating the base", () => {
    const base = { a: { b: 1, c: 2 }, d: 3 };
    const override: DeepPartial<typeof base> = { a: { c: 99 } };
    const result = deepMerge(base, override);

    expect(result).toEqual({ a: { b: 1, c: 99 }, d: 3 });
    // Base untouched.
    expect(base).toEqual({ a: { b: 1, c: 2 }, d: 3 });
  });

  it("replaces arrays wholesale rather than merging element-by-element", () => {
    const base = { list: [1, 2, 3], keep: "x" };
    const override: DeepPartial<typeof base> = { list: [9] };
    const result = deepMerge(base, override);

    expect(result.list).toEqual([9]);
    expect(result.keep).toBe("x");
  });

  it("lets primitive override values win when defined", () => {
    const base = { title: "old", count: 1, flag: false };
    const override: DeepPartial<typeof base> = { title: "new", flag: true };
    const result = deepMerge(base, override);

    expect(result).toEqual({ title: "new", count: 1, flag: true });
  });

  it("returns the base unchanged when the override is undefined", () => {
    const base = { a: 1, b: { c: 2 } };
    const result = deepMerge(base, undefined);

    expect(result).toBe(base);
  });

  it("ignores undefined leaves in the override (base wins)", () => {
    const base = { a: 1, b: 2 };
    const override = { a: undefined, b: 5 } as DeepPartial<typeof base>;
    const result = deepMerge(base, override);

    expect(result).toEqual({ a: 1, b: 5 });
  });
});
