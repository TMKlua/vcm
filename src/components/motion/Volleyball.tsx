/**
 * Stylised volleyball — white panels, violet→magenta pinwheel seams.
 * Shared between the Loader and the Hero so the loader ball can visually
 * "hand off" to the hero ball on the right.
 */
export default function Volleyball({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <radialGradient id="vb-body" cx="36%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="58%" stopColor="#f4eeff" />
          <stop offset="100%" stopColor="#cdb6ee" />
        </radialGradient>
        <linearGradient id="vb-seam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="55%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ff4dd2" />
        </linearGradient>
        <radialGradient id="vb-sheen" cx="32%" cy="26%" r="42%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vb-shade" cx="68%" cy="74%" r="60%">
          <stop offset="60%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#3a1d63" stopOpacity="0.28" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="95" fill="url(#vb-body)" />

      <g fill="none" stroke="url(#vb-seam)" strokeWidth="5.5" strokeLinecap="round">
        <path d="M100 6 C 36 56, 36 130, 92 196" />
        <path d="M100 6 C 36 56, 36 130, 92 196" transform="rotate(120 100 100)" />
        <path d="M100 6 C 36 56, 36 130, 92 196" transform="rotate(240 100 100)" />
      </g>
      <g fill="none" stroke="url(#vb-seam)" strokeWidth="2.5" strokeLinecap="round" opacity="0.55">
        <path d="M118 8 C 60 52, 56 126, 108 192" />
        <path d="M118 8 C 60 52, 56 126, 108 192" transform="rotate(120 100 100)" />
        <path d="M118 8 C 60 52, 56 126, 108 192" transform="rotate(240 100 100)" />
      </g>

      <circle cx="100" cy="100" r="95" fill="url(#vb-shade)" />
      <ellipse cx="72" cy="60" rx="44" ry="32" fill="url(#vb-sheen)" />
      <circle cx="100" cy="100" r="95" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.5" />
    </svg>
  );
}
