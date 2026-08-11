"use client";

import { useMemo } from "react";

import { useContent } from "@/content/ContentContext";
import type { NavLabels } from "@/content/types";
import type { NavLink } from "@/types";
import { navLinks } from "./nav";

/**
 * La navigation avec ses intitulés pris dans le contenu éditable.
 *
 * Un libellé vidé depuis /admin retombe sur celui livré avec le site plutôt que
 * d'afficher un lien sans texte — un menu muet serait pire qu'un menu figé.
 */
function labelFor(link: NavLink, nav: NavLabels | undefined): string {
  const fromContent = link.key ? nav?.[link.key] : undefined;
  return fromContent?.trim() ? fromContent : link.label;
}

export function useNavLinks(): NavLink[] {
  const nav = useContent().content.text.nav;

  return useMemo(
    () =>
      navLinks.map((link) => ({
        ...link,
        label: labelFor(link, nav),
        children: link.children?.map((child) => ({
          ...child,
          label: labelFor(child, nav),
        })),
      })),
    [nav],
  );
}

/** Intitulé d'une page pour son fil d'Ariane. */
export function useNavLabel(key: keyof NavLabels, fallback: string): string {
  const nav = useContent().content.text.nav;
  const value = nav?.[key];
  return value?.trim() ? value : fallback;
}
