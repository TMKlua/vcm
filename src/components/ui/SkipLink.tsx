/**
 * SkipLink — "Aller au contenu" bypass link.
 *
 * Visually hidden until it receives keyboard focus, at which point it appears
 * top-left, high-contrast, above the navbar. Targets the `#contenu` landmark
 * (the <main> wrapper in the root layout). Must be rendered as the first
 * focusable element in the document.
 */
export default function SkipLink() {
  return (
    <a
      href="#contenu"
      className="
        sr-only
        focus-visible:not-sr-only
        focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[200]
        focus-visible:inline-flex focus-visible:items-center
        focus-visible:rounded-full
        focus-visible:bg-white focus-visible:px-5 focus-visible:py-3
        focus-visible:text-sm focus-visible:font-semibold focus-visible:uppercase
        focus-visible:tracking-wide focus-visible:text-encre
        focus-visible:shadow-2xl focus-visible:shadow-black/40
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm
        focus-visible:ring-offset-2 focus-visible:ring-offset-ink
      "
    >
      Aller au contenu
    </a>
  );
}
