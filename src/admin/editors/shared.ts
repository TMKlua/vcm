/* Small helpers shared by the collection editors. */

/** Slugify a string into a URL-safe lowercase token. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Ensure a slug is unique within `existing` by appending -2, -3, … */
export function uniqueSlug(base: string, existing: string[]): string {
  const root = slugify(base) || "element";
  if (!existing.includes(root)) return root;
  let n = 2;
  while (existing.includes(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

/** A reasonably unique id for items keyed by id rather than slug. */
export function genId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

/** Immutably move item at `from` to `to` within a copy of the array. */
export function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Today's date as YYYY-MM-DD, computed at call time (never module scope). */
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/** Convert an ISO datetime/date string to a YYYY-MM-DD value for <input type=date>. */
export function isoToDateInput(iso: string): string {
  if (!iso) return "";
  // Accept full ISO or already date-only.
  const m = iso.match(/^\d{4}-\d{2}-\d{2}/);
  return m ? m[0] : "";
}
