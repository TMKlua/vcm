"use client";

import { useAdminDraft } from "../useAdminDraft";
import { Card, Field, SectionTitle, TextInput, TextArea } from "../ui";
import ImageInput from "../ImageInput";

/** Editor for `draft.club` — identity, address, contact, socials. */
export default function ClubEditor() {
  const { draft, update } = useAdminDraft();
  if (!draft) return null;
  const club = draft.club;

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Infos club"
        description="Identité, coordonnées et réseaux sociaux du club."
      />

      <Card className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Identité
        </h3>
        <Field label="Nom complet" htmlFor="club-name">
          <TextInput
            id="club-name"
            value={club.name}
            onChange={(e) => update("club.name", e.target.value)}
          />
        </Field>
        <Field label="Nom court" htmlFor="club-shortName">
          <TextInput
            id="club-shortName"
            value={club.shortName}
            onChange={(e) => update("club.shortName", e.target.value)}
          />
        </Field>
        <Field label="Slogan" htmlFor="club-tagline">
          <TextInput
            id="club-tagline"
            value={club.tagline}
            onChange={(e) => update("club.tagline", e.target.value)}
          />
        </Field>
        <Field label="Description" htmlFor="club-description">
          <TextArea
            id="club-description"
            value={club.description}
            onChange={(e) => update("club.description", e.target.value)}
          />
        </Field>
        <Field label="Horaires (résumé)" htmlFor="club-schedule">
          <TextInput
            id="club-schedule"
            value={club.schedule}
            onChange={(e) => update("club.schedule", e.target.value)}
          />
        </Field>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Logo du club
        </h3>
        <ImageInput
          label="Logo (apparaît dans la navbar, le pied de page et le menu mobile)"
          value={club.logo ?? ""}
          onChange={(val) => update("club.logo", val)}
          help="PNG/JPEG/WebP. De préférence carré, fond transparent. Si vide, un badge dégradé est utilisé."
        />
      </Card>

      <Card className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Adresse
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Lieu / salle" htmlFor="club-venue">
            <TextInput
              id="club-venue"
              value={club.address.venue}
              onChange={(e) => update("club.address.venue", e.target.value)}
            />
          </Field>
          <Field label="Rue" htmlFor="club-street">
            <TextInput
              id="club-street"
              value={club.address.street}
              onChange={(e) => update("club.address.street", e.target.value)}
            />
          </Field>
          <Field label="Ville" htmlFor="club-city">
            <TextInput
              id="club-city"
              value={club.address.city}
              onChange={(e) => update("club.address.city", e.target.value)}
            />
          </Field>
          <Field label="Code postal" htmlFor="club-postalCode">
            <TextInput
              id="club-postalCode"
              value={club.address.postalCode}
              onChange={(e) =>
                update("club.address.postalCode", e.target.value)
              }
            />
          </Field>
        </div>

        <h3 className="pt-2 text-sm font-semibold uppercase tracking-wide text-white/50">
          Carte Google Maps
        </h3>
        <Field label="Nom affiché sur le repère" htmlFor="club-mapLabel">
          <TextInput
            id="club-mapLabel"
            value={club.address.mapLabel ?? ""}
            onChange={(e) => update("club.address.mapLabel", e.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Latitude" htmlFor="club-latitude">
            <TextInput
              id="club-latitude"
              inputMode="decimal"
              value={club.address.latitude?.toString() ?? ""}
              onChange={(e) => {
                const raw = e.target.value.trim().replace(",", ".");
                const num = Number.parseFloat(raw);
                // Champ vidé ou saisie en cours ("43.", "-") → on retire la
                // coordonnée : la carte retombe alors sur l'adresse postale.
                update(
                  "club.address.latitude",
                  raw === "" || Number.isNaN(num) ? null : num,
                );
              }}
            />
          </Field>
          <Field label="Longitude" htmlFor="club-longitude">
            <TextInput
              id="club-longitude"
              inputMode="decimal"
              value={club.address.longitude?.toString() ?? ""}
              onChange={(e) => {
                const raw = e.target.value.trim().replace(",", ".");
                const num = Number.parseFloat(raw);
                update(
                  "club.address.longitude",
                  raw === "" || Number.isNaN(num) ? null : num,
                );
              }}
            />
          </Field>
        </div>
        <p className="text-xs text-white/40">
          Les coordonnées posent le repère à l&rsquo;endroit exact. Laissez-les vides
          pour que Google cherche simplement l&rsquo;adresse postale.
        </p>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Contact
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Personne référente" htmlFor="club-person">
            <TextInput
              id="club-person"
              value={club.contact.person}
              onChange={(e) => update("club.contact.person", e.target.value)}
            />
          </Field>
          <Field label="Téléphone" htmlFor="club-phone">
            <TextInput
              id="club-phone"
              value={club.contact.phone}
              onChange={(e) => update("club.contact.phone", e.target.value)}
            />
          </Field>
          <Field label="Email" htmlFor="club-email">
            <TextInput
              id="club-email"
              type="email"
              value={club.contact.email}
              onChange={(e) => update("club.contact.email", e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Réseaux sociaux
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Facebook" htmlFor="club-facebook">
            <TextInput
              id="club-facebook"
              value={club.socials.facebook ?? ""}
              onChange={(e) => update("club.socials.facebook", e.target.value)}
            />
          </Field>
          <Field label="Instagram" htmlFor="club-instagram">
            <TextInput
              id="club-instagram"
              value={club.socials.instagram ?? ""}
              onChange={(e) => update("club.socials.instagram", e.target.value)}
            />
          </Field>
          <Field label="Site web" htmlFor="club-website">
            <TextInput
              id="club-website"
              value={club.socials.website ?? ""}
              onChange={(e) => update("club.socials.website", e.target.value)}
            />
          </Field>
          <Field label="Clubeo" htmlFor="club-clubeo">
            <TextInput
              id="club-clubeo"
              value={club.socials.clubeo ?? ""}
              onChange={(e) => update("club.socials.clubeo", e.target.value)}
            />
          </Field>
        </div>
      </Card>
    </div>
  );
}
