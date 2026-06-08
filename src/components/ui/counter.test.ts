import { describe, it, expect } from "vitest";
import { clampProgress, easeOutValue } from "@/lib/format";
describe("counter math", () => {
  it("clampProgress borne entre 0 et 1", () => {
    expect(clampProgress(-5, 100)).toBe(0);
    expect(clampProgress(50, 100)).toBe(0.5);
    expect(clampProgress(200, 100)).toBe(1);
  });
  it("easeOutValue atteint la cible à p=1", () => {
    expect(easeOutValue(150, 1)).toBe(150);
    expect(easeOutValue(150, 0)).toBe(0);
  });
});
