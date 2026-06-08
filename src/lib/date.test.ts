import { describe, it, expect } from "vitest";
import { sortByDateDesc } from "@/lib/date";
describe("date utils", () => {
  it("trie du plus récent au plus ancien", () => {
    const r = sortByDateDesc([{ date: "2024-01-01" }, { date: "2025-01-01" }]);
    expect(r[0].date).toBe("2025-01-01");
  });
});
