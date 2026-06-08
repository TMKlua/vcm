# Image Sources — VCM Site

## What these are

All images under `public/images/` are **real example photographs** from freely-licensed
sources. They are NOT real photographs of the Volley Club Marseillanais or its members.

**The club should replace these with its own photos** — either via the `/admin` CMS interface
or by dropping new files at the same paths listed below.

SVGs under `public/logos/` remain generated placeholder wordmarks and are unaffected.

---

## Sources

### Wikimedia Commons (CC-licensed)

Photos sourced from [Wikimedia Commons](https://commons.wikimedia.org/) under various
Creative Commons licenses (CC-BY, CC-BY-SA, public domain). Useful categories:
`Category:Volleyball`, `Category:Beach volleyball`, `Category:Volleyball matches`,
`Category:Volleyball players`, `Category:Women's volleyball`.

These images are used **for demonstration purposes only**. Before publishing the site
publicly, the club must replace them with its own photos or photos it holds the rights to.

| Folder | Source |
|--------|--------|
| `public/images/hero/` | Wikimedia Commons — volleyball match (CC) |
| `public/images/teams/jeunes.jpg` | Wikimedia Commons — village volleyball scene (CC) |
| `public/images/teams/loisir.jpg` | Wikimedia Commons — indoor volleyball match (CC) |
| `public/images/teams/competition.jpg` | Wikimedia Commons — CEV Champions League (CC) |
| `public/images/teams/beach-volley.jpg` | Wikimedia Commons — beach volleyball arena (CC) |
| `public/images/news/finale-championnat-*` | Wikimedia Commons — beach volleyball (CC) |
| `public/images/news/reprise-saison-*` | Wikimedia Commons — indoor volleyball (CC) |
| `public/images/news/tournoi-herault-*` | Wikimedia Commons — young players beach (CC) |
| `public/images/news/victoire-minimes-*` | Wikimedia Commons — volleyball match (CC) |
| `public/images/events/finale-*` | Wikimedia Commons — beach volleyball (CC) |
| `public/images/events/herault-*` | Wikimedia Commons — beach volleyball (CC) |
| `public/images/events/journee-portes-*` | Wikimedia Commons — volleyball tournament (CC) |
| `public/images/gallery/1.jpg` | Wikimedia Commons — volleyball match (CC) |
| `public/images/gallery/2.jpg` | Wikimedia Commons — volleyball player portrait (CC) |
| `public/images/gallery/3.jpg` | Wikimedia Commons — indoor volleyball (CC) |
| `public/images/gallery/6.jpg` | Wikimedia Commons — CEV volleyball (CC) |
| `public/images/gallery/7.jpg` | Wikimedia Commons — volleyball match (CC) |
| `public/images/gallery/8.jpg` | Wikimedia Commons — beach volleyball (CC) |
| `public/images/gallery/11.jpg` | Wikimedia Commons — beach volleyball (CC) |
| `public/images/gallery/13.jpg` | Wikimedia Commons — volleyball match (CC) |

### Lorem Picsum (https://picsum.photos)

Free placeholder photo service — CC0 / freely usable photos. Used where a specific
volleyball-themed image could not be found on Wikimedia, or where a specific aspect ratio
was needed (portrait, square, precise dimensions).

| Folder | Seed | Dimensions |
|--------|------|------------|
| `public/images/teams/baby-volley.jpg` | `vcm-baby-volley` | 1600×1000 |
| `public/images/teams/soft-volley.jpg` | `vcm-soft-volley` | 1600×1000 |
| `public/images/teams/sport-sante.jpg` | `vcm-sport-sante` | 1600×1000 |
| `public/images/news/sport-sante-nouveau-*` | `vcm-news-sante` | 1600×1000 |
| `public/images/events/tournoi-noel-*` | `vcm-event-noel` | 1600×1000 |
| `public/images/gallery/4.jpg` | `vcm-gal-4` | 1200×1200 |
| `public/images/gallery/5.jpg` | `vcm-gal-5` | 800×1200 |
| `public/images/gallery/9.jpg` | `vcm-gal-9` | 800×1000 |
| `public/images/gallery/10.jpg` | `vcm-gal-10` | 1000×1200 |
| `public/images/gallery/12.jpg` | `vcm-gal-12` | 800×1200 |
| `public/images/gallery/14.jpg` | `vcm-gal-14` | 1000×1000 |

---

## Gallery dimensions

The `src/data/gallery.ts` file stores each image's `width` and `height`. These values
have been updated to match the **actual pixel dimensions** of each downloaded file so
that the masonry layout renders without distortion.

---

## How to replace with club photos

1. Drop the club's own `.jpg` at the same path (e.g. `public/images/hero/hero-1.jpg`).
2. For gallery images, also update the corresponding `width` and `height` fields in
   `src/data/gallery.ts` to the new photo's real dimensions.
3. Via the admin CMS at `/admin`, media can be uploaded directly and the data fields
   updated in the interface — no code change needed.

---

## Full path list

### Hero
| Path | Actual size | Source |
|------|-------------|--------|
| `public/images/hero/hero-1.jpg` | 1920 × 1079 | Wikimedia Commons |

### Teams (actual downloaded size)
| Path | Label | Actual size | Source |
|------|-------|-------------|--------|
| `public/images/teams/baby-volley.jpg` | Baby Volley | 1600 × 1000 | Picsum |
| `public/images/teams/jeunes.jpg` | Jeunes | 1920 × 1440 | Wikimedia |
| `public/images/teams/loisir.jpg` | Loisir | 1920 × 1440 | Wikimedia |
| `public/images/teams/competition.jpg` | Compétition | 1920 × 1440 | Wikimedia |
| `public/images/teams/soft-volley.jpg` | Soft Volley | 1600 × 1000 | Picsum |
| `public/images/teams/sport-sante.jpg` | Sport Santé | 1600 × 1000 | Picsum |
| `public/images/teams/beach-volley.jpg` | Beach Volley | 1920 × 1440 | Wikimedia |

### News (actual downloaded size)
| Path | Title | Actual size | Source |
|------|-------|-------------|--------|
| `public/images/news/finale-championnat-beach-volley-herault-2026.jpg` | Finale Beach Volley | 1920 × 1372 | Wikimedia |
| `public/images/news/reprise-saison-2025-2026.jpg` | Reprise Saison | 1920 × 1440 | Wikimedia |
| `public/images/news/tournoi-herault-beach-volley-jeunes-2025.jpg` | Hérault Beach Jeunes | 1920 × 1280 | Wikimedia |
| `public/images/news/sport-sante-nouveau-programme-2025.jpg` | Sport Santé Programme | 1600 × 1000 | Picsum |
| `public/images/news/victoire-minimes-filles-championnat-herault.jpg` | Victoire Minimes | 1920 × 1440 | Wikimedia |

### Events (actual downloaded size)
| Path | Event | Actual size | Source |
|------|-------|-------------|--------|
| `public/images/events/herault-beach-volley-jeunes-2026.jpg` | Hérault Beach Volley Jeunes 2026 | 1920 × 1440 | Wikimedia |
| `public/images/events/finale-championnat-beach-volley-2026.jpg` | Finale Championnat Beach Volley | 1920 × 1278 | Wikimedia |
| `public/images/events/journee-portes-ouvertes-2026.jpg` | Journée Portes Ouvertes | 1920 × 1440 | Wikimedia |
| `public/images/events/tournoi-noel-vcm-2026.jpg` | Tournoi de Noël VCM | 1600 × 1000 | Picsum |

### Gallery (dimensions updated in gallery.ts to match actual file)
| Path | Width | Height | Category | Source |
|------|-------|--------|----------|--------|
| `public/images/gallery/1.jpg` | 1920 | 1079 | Matchs | Wikimedia |
| `public/images/gallery/2.jpg` | 1920 | 2859 | Entraînements | Wikimedia |
| `public/images/gallery/3.jpg` | 1920 | 1440 | Matchs | Wikimedia |
| `public/images/gallery/4.jpg` | 1200 | 1200 | Jeunes | Picsum |
| `public/images/gallery/5.jpg` | 800 | 1200 | Beach | Picsum |
| `public/images/gallery/6.jpg` | 1920 | 1440 | Entraînements | Wikimedia |
| `public/images/gallery/7.jpg` | 1920 | 1440 | Matchs | Wikimedia |
| `public/images/gallery/8.jpg` | 1920 | 1372 | Événements | Wikimedia |
| `public/images/gallery/9.jpg` | 800 | 1000 | Matchs | Picsum |
| `public/images/gallery/10.jpg` | 1000 | 1200 | Jeunes | Picsum |
| `public/images/gallery/11.jpg` | 1920 | 1440 | Beach | Wikimedia |
| `public/images/gallery/12.jpg` | 800 | 1200 | Événements | Picsum |
| `public/images/gallery/13.jpg` | 1920 | 1440 | Entraînements | Wikimedia |
| `public/images/gallery/14.jpg` | 1000 | 1000 | Événements | Picsum |

### Partner Logos (SVG, 400 × 120 viewBox) — unchanged
| Path | Partner |
|------|---------|
| `public/logos/ville-de-marseillan.svg` | Ville de Marseillan |
| `public/logos/comite-herault-volley.svg` | Comité Départemental de Volley-Ball de l'Hérault |
| `public/logos/region-occitanie.svg` | Région Occitanie |
| `public/logos/brasserie-du-soleil.svg` | Brasserie du Soleil |
| `public/logos/plomberie-meridionale.svg` | Plomberie Méridionale |
| `public/logos/thau-patrimoine.svg` | Agence Immobilière Thau Patrimoine |
| `public/logos/pharmacie-marseillan.svg` | Pharmacie de Marseillan |

---

## Regeneration

To regenerate all **AI-generated placeholder** images from scratch (reverts to branded gradient tiles):

```bash
node scripts/gen-placeholders.mjs
```

Requires Node.js 18+ and `sharp` installed as a dev dependency.
