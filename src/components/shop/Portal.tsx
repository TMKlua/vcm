"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Rend ses enfants directement dans <body>.
 *
 * Les sections du site posent `isolate` : une modale rendue à l'intérieur
 * restait prisonnière de ce contexte d'empilement et passait sous le pied de
 * page, malgré son z-index.
 */
export default function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- montage côté client uniquement
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}
