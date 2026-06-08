# VCM — Site Officiel Premium · Design Spec

**Date :** 2026-06-08
**Projet :** Site vitrine premium du Volley Club Marseillanais (VCM)
**Statut :** Validé pour planification

---

## 1. Vision & objectif

Concevoir le site officiel **premium** du Volley Club Marseillanais — une présence
digitale digne d'un club professionnel moderne, pensée comme une **marque sportive**
(références : Nike, Adidas, Red Bull, Volleyball World / FIVB, clubs européens de haut
niveau). Effet « WOW » dès l'arrivée. Pas un site associatif classique, pas de MVP, pas
de version simplifiée : la meilleure version directement.

Cibles : visiteurs, licenciés, parents, partenaires et futurs sponsors.

## 2. Contraintes absolues

- **AUCUNE base de données.** Pas de Supabase, Firebase, SQL, Mongo, Prisma. Tout est
  statique : données en fichiers TypeScript/JSON locaux, images stockées localement.
- Le site fonctionne parfaitement après un **hard refresh** et **sans aucune API**.
- 100 % statique (SSG), déployable sur tout hébergeur statique.

## 3. Stack technique

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4** (design tokens, mobile-first)
- **Framer Motion** — reveals, stagger, hover, transitions de page, micro-interactions
- **GSAP + ScrollTrigger** — parallax, timeline, trajectoires de ballon, effets scroll
- **Lenis** — smooth scroll
- **Lucide** — icônes
- **next/font** — polices auto-hébergées (Anton, Inter) : zéro requête externe
- **next/image** — optimisation images

## 4. Identité visuelle (design tokens)

**Direction retenue : Violet + Magenta (énergie max)** — site majoritairement sombre
violet immersif, avec quelques sections blanches pour le contraste.

| Token | Valeur | Usage |
|---|---|---|
| `ink` | `#0a0418` | Fond le plus sombre |
| `night` | `#15082e` | Fond sombre secondaire |
| `violet-700` | `#7c3aed` | Primaire |
| `violet-500` | `#a855f7` | Primaire clair / améthyste |
| `magenta` | `#c026d3` | Accent |
| `fuchsia` | `#ff4dd2` | Accent vif / highlights |
| `paper` | `#ffffff` | Fond sections claires |
| `lilac` | `#f4f0ff` | Fond clair secondaire |
| `encre` | `#1a0b3a` | Texte sur fond clair |

**Gradients signature :** `violet→magenta`, `magenta→fuchsia`, halos radiaux violets.

**Typographie :**
- Titres : **Anton** (condensé, impactant, « marque sportive »)
- Corps : **Inter** (moderne, lisible)
- Échelle typographique fluide (`clamp()`), hiérarchie nette.

## 5. Stratégie de contenu & données

### 5.1 Données réelles (recherchées en ligne, à intégrer)

- **Club :** Volley Club Marseillanais (VCM), club convivial au bord de l'étang de Thau.
- **Lieu :** Gymnase Louis Boudou, Avenue de Florensac, 34340 Marseillan (Hérault, Occitanie).
- **Contact :** Delphine Mary — 06 81 82 26 60 — volleymarseillan@gmail.com
- **Créneaux :** lundi & mercredi · **Baby Volley dès 3 ans**.
- **Équipes :** Poussins (F/M), Benjamins (F), Minimes (F), Cadets (F), U18 (F),
  Loisir 6×6 (M1/M2), Soft Volley / Sport Santé, Beach Volley.
- **Beach Volley :** partenaire du Comité Départemental de l'Hérault (Hérault Beach
  Volley Jeunes, étape + finale du Championnat Départemental).
- **Liens :** site clubeo, volleymarseillan.com, Facebook
  (facebook.com/volleyclub.marseillanais).

### 5.2 Contenu réaliste à remplacer

Toute information non vérifiable (dates de création, historique détaillé, chiffres
précis, noms de sponsors, certaines photos) est générée de façon **réaliste** et
**clairement marquée `[À CONFIRMER]`** dans les fichiers de données, pour remplacement
facile par le club.

### 5.3 Images

- **Photos stock premium** de volley, libres de droits (Unsplash/Pexels),
  **téléchargées et stockées localement** dans `/public/images/`.
- Nommage explicite + manifeste documentant l'origine, pour remplacement par les vraies
  photos du club avant mise en ligne.
- Toutes servies via `next/image` (formats modernes, lazy-load, tailles responsives).

### 5.4 Modèle de données (fichiers `src/data/`)

Chaque entité est un module TypeScript typé (interfaces dans `src/types/`) :
`club.ts`, `nav.ts`, `teams.ts`, `news.ts`, `events.ts`, `partners.ts`, `gallery.ts`,
`faq.ts`, `timeline.ts`, `stats.ts`, `sportSante.ts`, `inscriptions.ts`.

## 6. Architecture des pages (App Router)

Toutes les pages, sans MVP :

1. **`/` Accueil** — Hero immersif (média plein écran, slogan, animation d'entrée, CTA),
   Présentation du club, Chiffres clés (compteurs animés), Nos équipes (cards/carrousel),
   Derniers événements, Galerie immersive, Partenaires, Rejoindre le club, Contact rapide.
2. **`/histoire`** — storytelling complet + **timeline animée** (création, évolution,
   moments marquants, développement, vision actuelle).
3. **`/equipes`** — présentation détaillée de chaque pratique (Baby Volley, Jeunes,
   Loisir, Compétition, Soft Volley, Sport Santé, Beach Volley) : photo, description,
   objectifs, horaires — **cards premium animées**.
4. **`/inscriptions`** — démarche, licences, documents nécessaires, **FAQ accordéon**,
   boutons vers les liens existants (clubeo / HelloAsso / FFvolley).
5. **`/partenaires`** — **mur de logos** premium animé (hover, mise en valeur) + section
   « Devenir partenaire » avec argumentaire sponsor.
6. **`/galerie`** — galerie immersive : **masonry layout**, **lightbox**, zoom, animations.
7. **`/actualites`** + **`/actualites/[slug]`** — actualités depuis JSON local, cards
   animées + pages détail.
8. **`/sport-sante`** — page humaine et moderne (Soft Volley, bien-être, accessibilité).
9. **`/contact`** — coordonnées réelles, téléphone, email, localisation (carte/embed
   statique), réseaux sociaux, **formulaire front-only** (validation client + `mailto:`,
   aucune base de données).

## 7. Composants premium (réutilisables)

- Navbar flottante + **mega-menu** (équipes/pratiques)
- Footer premium (liens, réseaux, contact, plan)
- **Loader animé** premium (ballon / trajectoire) au chargement initial
- **Curseur personnalisé** (désactivé sur tactile / reduced-motion)
- **Scroll progress bar**
- **Boutons magnétiques** + mouse tracking
- **Cards interactives** (hover 3D tilt, glow)
- **Hero** vidéo/photo plein écran
- **Galerie + lightbox**
- **FAQ accordéon**
- **Timeline** animée (GSAP)
- **Compteurs animés** (chiffres clés)
- **Fonds animés** : gradients animés, lignes de terrain, **trajectoires de ballon**,
  effets de smash/impact, mouvements inspirés des échanges
- Primitives d'animation : `Reveal`, `TextReveal`, `Parallax`, `Stagger`, `SectionTransition`

## 8. Animations & motion (thème volley partout)

Reveal au scroll, text reveal, parallax, hover 3D, floating, smooth scrolling, loading
screen, transitions de section, mouse tracking, boutons magnétiques, backgrounds &
gradients animés, stagger, **ball trajectory effects**. Le volley est présent dans tous
les motifs (trajectoires, lignes de terrain, impacts).

Toutes les animations respectent **`prefers-reduced-motion`** (fallback statique).

## 9. Responsive

Mobile-first. Parfait sur **mobile, tablette, desktop, ultra-wide**. Breakpoints Tailwind
+ typographie/spacing fluides.

## 10. SEO

`metadata` par page, **Open Graph**, **Twitter Cards**, `app/sitemap.ts`,
`app/robots.ts`, **JSON-LD** `SportsClub` (nom, lieu, contact). Titres/descriptions
optimisés, slugs propres, images avec `alt`.

## 11. Performance (objectif Lighthouse > 95)

SSG complet, `next/image`, `next/font` auto-hébergé, code-splitting, lazy-load des libs
d'animation lourdes (GSAP/Lenis montés client uniquement), images dimensionnées,
préchargement maîtrisé, pas de layout shift.

## 12. Accessibilité (WCAG)

Navigation clavier complète, focus visibles, `aria-label`/rôles, contrastes vérifiés
(texte sur fonds violets/blancs), respect de `prefers-reduced-motion`, structure
sémantique (landmarks, hiérarchie de titres), skip-link.

## 13. Hors périmètre (YAGNI)

- Aucun back-end, CMS, auth, paiement, base de données.
- Pas d'envoi serveur du formulaire de contact (front-only `mailto:` + validation).
- Pas de multilingue (français uniquement).
- Pas d'intégration temps réel des résultats/scores (données statiques).

## 14. Structure du projet (cible)

```
src/
  app/                # routes App Router (pages + layout + sitemap/robots)
  components/
    layout/           # Navbar, MegaMenu, Footer, Loader, Cursor, ScrollProgress
    ui/               # MagneticButton, TiltCard, Reveal, TextReveal, Counter, Accordion
    sections/         # Hero, Stats, TeamsPreview, NewsPreview, GalleryPreview, ...
    motion/           # primitives Framer/GSAP, providers (Lenis)
  data/               # données statiques typées
  types/              # interfaces TypeScript
  lib/                # utils (animation, format, seo helpers)
  styles/             # globals, tokens
public/
  images/             # photos stock premium locales
  logos/              # logos partenaires (placeholders marqués)
docs/                 # cette spec + plan
```

## 15. Critères de réussite

- Site complet (9 pages) entièrement statique, fonctionne hors-ligne / hard refresh.
- Effet « WOW » : hero immersif + animations premium cohérentes, thème volley partout.
- Aucune dépendance base de données ni API externe à l'exécution.
- Lighthouse > 95 (Perf, A11y, Best Practices, SEO).
- Données réelles intégrées ; contenus à confirmer clairement marqués et faciles à éditer.
- Build `next build` réussi sans erreur ; lint/typecheck propres.
