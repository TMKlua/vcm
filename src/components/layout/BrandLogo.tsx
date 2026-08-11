"use client";

import { useEffect, useRef, useState } from "react";
import { Volleyball } from "lucide-react";
import { useContent } from "@/content/ContentContext";

/**
 * Brand mark for the VCM. Renders the club logo (`club.logo` — a file path or an
 * uploaded blob URL from the admin). If no logo is set, or the image fails to
 * load, it falls back to the gradient volleyball badge so the chrome never
 * shows a broken image.
 *
 * `className` sizes the square mark (e.g. "size-10").
 */
export default function BrandLogo({ className = "size-10" }: { className?: string }) {
  const { content } = useContent();
  const { club } = content;
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // A 404 on the server-rendered <img> fires before React hydrates, so `onError`
  // alone never sees it and the browser paints the alt text instead — which used
  // to wrap over several lines and wreck the mobile navbar. Re-check on mount:
  // a decoded-but-zero-width image means the load already failed.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setErrored(true);
  }, [club.logo]);

  const showImage = Boolean(club.logo) && !errored;

  if (showImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={imgRef}
        src={club.logo}
        alt={`${club.name} - logo`}
        // `overflow-hidden` keeps a failed load from spilling alt text across
        // the header before the effect above swaps in the fallback.
        className={`${className} shrink-0 overflow-hidden rounded-full object-contain`}
        onError={() => setErrored(true)}
      />
    );
  }

  // Fallback: gradient disc + volleyball glyph
  return (
    <span
      aria-hidden
      className={`relative grid ${className} shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-violet-700 via-magenta to-fuchsia-vcm shadow-lg shadow-magenta/30`}
    >
      <span className="absolute -right-1.5 -top-1.5 size-4 rounded-full bg-white/25 blur-md" />
      <Volleyball className="relative size-1/2 text-white" />
    </span>
  );
}
