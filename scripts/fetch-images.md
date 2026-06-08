# Image Placeholders — VCM Site

## What these are

All images under `public/images/` and all SVGs under `public/logos/` are **AI-generated branded placeholders**. They are NOT real photographs or real partner logos.

Each JPEG placeholder was generated with `sharp` from an SVG template that uses:
- A diagonal gradient background in VCM brand colors (`#0a0418` → `#2a0e6b` → `#7c3aed` → `#c026d3`)
- Subtle volleyball court lines at low opacity
- A stylised volleyball with seam lines and a soft glow
- A "VCM" watermark at very low opacity
- A readable label in the lower-left corner (image category in magenta, subject name in white)
- A radial vignette for depth

Each partner SVG logo is a simple wordmark: partner name in uppercase violet (`#a855f7`), with a small volleyball glyph, on a transparent background.

## Licensing

No licensing concerns — all files are self-generated. There are no stock photos, third-party artwork, or copyrighted assets.

## How to replace

Drop a real `.jpg` (or `.svg` for logos) at the same path, keeping a similar aspect ratio. The site references these paths directly from the data files. No code changes needed.

For raster images, aim to keep the same pixel dimensions listed below to avoid layout shifts.

---

## Full path list

### Hero
| Path | Size |
|------|------|
| `public/images/hero/hero-1.jpg` | 2400 × 1350 |

### Teams (1600 × 1000)
| Path | Label |
|------|-------|
| `public/images/teams/baby-volley.jpg` | Baby Volley |
| `public/images/teams/jeunes.jpg` | Jeunes |
| `public/images/teams/loisir.jpg` | Loisir |
| `public/images/teams/competition.jpg` | Compétition |
| `public/images/teams/soft-volley.jpg` | Soft Volley |
| `public/images/teams/sport-sante.jpg` | Sport Santé |
| `public/images/teams/beach-volley.jpg` | Beach Volley |

### News (1600 × 1000)
| Path | Title |
|------|-------|
| `public/images/news/finale-championnat-beach-volley-herault-2026.jpg` | Finale Beach Volley Hérault |
| `public/images/news/reprise-saison-2025-2026.jpg` | Reprise Saison 2025-2026 |
| `public/images/news/tournoi-herault-beach-volley-jeunes-2025.jpg` | Hérault Beach Volley Jeunes |
| `public/images/news/sport-sante-nouveau-programme-2025.jpg` | Sport Santé – Nouveau Programme |
| `public/images/news/victoire-minimes-filles-championnat-herault.jpg` | Victoire Minimes Filles |

### Events (1600 × 1000)
| Path | Event |
|------|-------|
| `public/images/events/herault-beach-volley-jeunes-2026.jpg` | Hérault Beach Volley Jeunes 2026 |
| `public/images/events/finale-championnat-beach-volley-2026.jpg` | Finale Championnat Beach Volley |
| `public/images/events/journee-portes-ouvertes-2026.jpg` | Journée Portes Ouvertes |
| `public/images/events/tournoi-noel-vcm-2026.jpg` | Tournoi de Noël VCM |

### Gallery (exact dimensions from gallery.ts)
| Path | Width | Height | Category |
|------|-------|--------|----------|
| `public/images/gallery/1.jpg` | 1200 | 800 | Matchs |
| `public/images/gallery/2.jpg` | 800 | 1200 | Entraînements |
| `public/images/gallery/3.jpg` | 1200 | 800 | Matchs |
| `public/images/gallery/4.jpg` | 1000 | 1000 | Jeunes |
| `public/images/gallery/5.jpg` | 800 | 1200 | Beach |
| `public/images/gallery/6.jpg` | 1200 | 800 | Entraînements |
| `public/images/gallery/7.jpg` | 1000 | 800 | Matchs |
| `public/images/gallery/8.jpg` | 1200 | 900 | Événements |
| `public/images/gallery/9.jpg` | 800 | 1000 | Matchs |
| `public/images/gallery/10.jpg` | 1000 | 1200 | Jeunes |
| `public/images/gallery/11.jpg` | 1200 | 800 | Beach |
| `public/images/gallery/12.jpg` | 800 | 1200 | Événements |
| `public/images/gallery/13.jpg` | 1200 | 800 | Entraînements |
| `public/images/gallery/14.jpg` | 1000 | 1000 | Événements |

### Partner Logos (SVG, 400 × 120 viewBox)
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

To regenerate all placeholders from scratch:

```bash
node scripts/gen-placeholders.mjs
```

Requires Node.js 18+ and `sharp` installed as a dev dependency.
