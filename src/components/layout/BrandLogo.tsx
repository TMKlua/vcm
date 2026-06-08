"use client";

import { useState } from "react";
import { Volleyball } from "lucide-react";
import { useContent } from "@/content/ContentContext";

/**
 * Brand mark for the VCM. Renders the club logo (`club.logo` — a file path like
 * /logo-vcm.png or an uploaded data URL from the admin). If no logo is set, or
 * the image fails to load, it gracefully falls back to the gradient volleyball
 * badge so the chrome never shows a broken image.
 *
 * `className` sizes the square mark (e.g. "size-10").
 */
export default function BrandLogo({ className = "size-10" }: { className?: string }) {
  const { content } = useContent();
  const { club } = content;
  const [errored, setErrored] = useState(false);

  const showImage = Boolean(club.logo) && !errored;

  if (showImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={club.logo}
        alt={`${club.name} — logo`}
        className={`${className} rounded-full object-contain`}
        onError={() => setErrored(true)}
      />
    );
  }

  // Fallback: gradient disc + volleyball glyph
  return (
    <span
      aria-hidden
      className={`relative grid ${className} place-items-center overflow-hidden rounded-full bg-gradient-to-br from-violet-700 via-magenta to-fuchsia-vcm shadow-lg shadow-magenta/30`}
    >
      <span className="absolute -right-1.5 -top-1.5 size-4 rounded-full bg-white/25 blur-md" />
      <Volleyball className="relative size-1/2 text-white" />
    </span>
  );
}
