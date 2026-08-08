"use client";

import { Clock, ExternalLink, MapPin } from "lucide-react";

import type { ClubInfo } from "@/types";

/* ──────────────────────────────────────────────────────────────────────────
 * ClubMap — carte Google Maps du gymnase, partagée par l'accueil et /contact.
 *
 * Deux façons de pointer le lieu :
 *   - `address.latitude` / `address.longitude` fournis → repère posé exactement
 *     là, avec le libellé `address.mapLabel`. C'est le mode par défaut : une
 *     recherche sur la seule adresse postale tombait sur un commerce voisin.
 *   - sinon → recherche textuelle sur l'adresse complète.
 *
 * `output=embed` ne demande aucune clé d'API : la carte marche sans facturation
 * Google à configurer côté club.
 * ────────────────────────────────────────────────────────────────────────── */

/** Adresse postale sur une ligne — sert au lien d'itinéraire et au repli. */
export function formatAddress(address: ClubInfo["address"]): string {
  return [
    address.venue,
    address.street,
    `${address.postalCode} ${address.city}`.trim(),
  ]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

/** URL de l'iframe Google Maps. */
export function mapEmbedSrc(address: ClubInfo["address"], label: string): string {
  const hasCoords =
    typeof address.latitude === "number" && typeof address.longitude === "number";

  const query = hasCoords
    ? `${address.latitude},${address.longitude} (${label})`
    : formatAddress(address);

  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=fr&z=17&output=embed`;
}

/** URL « Itinéraire » ouverte dans Google Maps. */
export function mapDirectionsHref(address: ClubInfo["address"]): string {
  const hasCoords =
    typeof address.latitude === "number" && typeof address.longitude === "number";

  const destination = hasCoords
    ? `${address.latitude},${address.longitude}`
    : formatAddress(address);

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export default function ClubMap({
  address,
  label,
  schedule,
  directionsLabel,
  className = "",
  frameClassName = "h-[260px] sm:h-[320px] md:h-[22rem]",
}: {
  address: ClubInfo["address"];
  /** Libellé du repère. Par défaut `address.mapLabel`, sinon le nom du lieu. */
  label?: string;
  /** Créneaux d'entraînement affichés sous la carte. Masqué si vide. */
  schedule?: string;
  /** Libellé du bouton d'itinéraire. */
  directionsLabel?: string;
  className?: string;
  /** Hauteurs de l'iframe — visible sur mobile portrait par défaut. */
  frameClassName?: string;
}) {
  const pinLabel = label ?? address.mapLabel ?? address.venue;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-night shadow-2xl shadow-black/40 ${className}`}
    >
      <iframe
        title={`Carte Google Maps — ${pinLabel}, ${formatAddress(address)}`}
        src={mapEmbedSrc(address, pinLabel)}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className={`block w-full border-0 ${frameClassName}`}
      />

      <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-sm text-white/75">
          <MapPin className="mt-0.5 size-4 shrink-0 text-fuchsia-vcm" aria-hidden />
          <span>
            <span className="font-medium text-white">{address.venue}</span>
            <br />
            {address.street}, {address.postalCode} {address.city}
          </span>
        </p>
        <a
          href={mapDirectionsHref(address)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Itinéraire vers le gymnase sur Google Maps (nouvel onglet)"
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/75 transition-colors duration-200 hover:border-fuchsia-vcm/40 hover:bg-fuchsia-vcm/10 hover:text-fuchsia-vcm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:self-auto"
        >
          {directionsLabel ?? "Itinéraire"}
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      </div>

      {/* Créneaux d'entraînement, sous la carte */}
      {schedule?.trim() && (
        <p className="flex items-center gap-2 border-t border-white/10 px-5 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-fuchsia-vcm/80">
          <Clock className="size-3.5 shrink-0" aria-hidden />
          {schedule}
        </p>
      )}
    </div>
  );
}
