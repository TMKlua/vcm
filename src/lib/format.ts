export function clampProgress(elapsed: number, duration: number): number {
  if (duration <= 0) return 1;
  return Math.min(1, Math.max(0, elapsed / duration));
}
export function easeOutValue(target: number, progress: number): number {
  const eased = 1 - Math.pow(1 - progress, 3);
  return Math.round(target * eased);
}
