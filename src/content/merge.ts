import type { DeepPartial } from "./types";

/** True for plain objects (not arrays, not null, not class instances we care about). */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Recursively merge `override` onto `base`.
 *
 * Rules:
 *  - Plain objects are merged key-by-key (deep).
 *  - Arrays are REPLACED wholesale when the override provides one. This is how
 *    the admin manages collections (teams, news, …): editing the array replaces
 *    it entirely rather than merging element-by-element.
 *  - Primitives (string/number/boolean) from the override win when defined.
 *  - `undefined` override values are ignored (base wins). An explicit `null`
 *    override wins (used to clear a value).
 *
 * Pure function — never mutates `base` or `override`.
 */
export function deepMerge<T>(base: T, override: DeepPartial<T> | undefined): T {
  if (override === undefined) return base;

  // Override is an array → replace the base wholesale.
  if (Array.isArray(override)) {
    return override as unknown as T;
  }

  // Both are plain objects → merge recursively.
  if (isPlainObject(base) && isPlainObject(override)) {
    const result: Record<string, unknown> = { ...base };
    for (const key of Object.keys(override)) {
      const overrideValue = (override as Record<string, unknown>)[key];
      if (overrideValue === undefined) continue;
      const baseValue = (base as Record<string, unknown>)[key];
      result[key] = deepMerge(
        baseValue,
        overrideValue as DeepPartial<unknown>,
      );
    }
    return result as T;
  }

  // Primitive (or type mismatch) → override wins.
  return override as unknown as T;
}
