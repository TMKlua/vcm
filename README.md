# Volley Club Marseillanais — Site officiel

Site web officiel du **Volley Club Marseillanais (VCM)**, club de volley-ball convivial et compétitif basé à Marseillan (Hérault, 34340), au bord de l'étang de Thau. Le club propose toutes les pratiques : Baby Volley dès 3 ans, jeunes en compétition, loisir adulte, sport santé et beach volley.

Site entièrement statique, généré avec Next.js 16 (App Router, output statique) — aucune base de données, aucun backend. Conçu pour être déployé sur Vercel ou tout hébergeur de fichiers statiques.

---

## Stack technique

| Technologie | Rôle |
|---|---|
| [Next.js 16](https://nextjs.org/) (App Router) | Framework React, SSG/SSR |
| [React 19](https://react.dev/) | UI |
| [TypeScript 5](https://www.typescriptlang.org/) | Typage statique |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styles utilitaires |
| [Framer Motion](https://www.framer.com/motion/) | Animations et transitions |
| [GSAP 3](https://gsap.com/) + ScrollTrigger | Timeline animée (page Histoire uniquement, import dynamique) |
| [Lenis](https://lenis.darkroom.engineering/) | Smooth scroll |
| [Lucide React](https://lucide.dev/) | Icônes |
| [next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) | Polices auto-hébergées (Anton + Inter) |
| [Vitest](https://vitest.dev/) + Testing Library | Tests unitaires |

---

## Commandes

```bash
# Installer les dépendances
npm install

# Serveur de développement (Turbopack)
npm run dev

# Build de production (statique)
npm run build

# Serveur de prévisualisation (post-build)
npm run start

# Tests unitaires
npm run test

# Lint ESLint
npm run lint

# Vérification TypeScript
npm run typecheck
```

Requires **Node.js 20+** (recommandé : Node 22 LTS).

---

## Structure du projet

```
src/
├── app/              # Pages (App Router Next.js)
│   ├── page.tsx      # Accueil
│   ├── histoire/
│   ├── equipes/
│   ├── sport-sante/
│   ├── inscriptions/
│   ├── partenaires/
│   ├── galerie/
│   ├── actualites/   # Liste + 5 pages d'articles SSG
│   └── contact/
├── components/       # Composants React
│   ├── layout/       # Navbar, Footer, PageHero, Loader…
│   ├── sections/     # Sections réutilisables (Hero, Timeline, etc.)
│   ├── ui/           # Briques UI (Cards, Accordion, Lightbox…)
│   └── motion/       # Composants d'animation (Reveal, TextReveal…)
├── data/             # Contenu du site — SEUL endroit à éditer
├── lib/              # Utilitaires (SEO, fonts, formatage)
└── types/            # Types TypeScript
```

---

## Où éditer le contenu

Tout le contenu du site se trouve dans **`src/data/`**. Vous n'avez pas besoin de modifier les composants pour mettre à jour les textes, chiffres ou listes.

| Fichier | Ce qu'il contrôle |
|---|---|
| `club.ts` | Informations générales du club : nom, adresse, contact (téléphone, email, responsable), horaires, réseaux sociaux. |
| `teams.ts` | Liste des équipes/pratiques : nom, catégorie, description, objectifs, horaires, image, tranche d'âge. |
| `news.ts` | Articles d'actualité : titre, slug, extrait, contenu (tableau de paragraphes), date, catégorie, image, auteur. Chaque article génère automatiquement une page statique `/actualites/[slug]`. |
| `events.ts` | Événements à venir : titre, date, lieu, description, image. Affichés sur la page d'accueil et sur d'autres pages. |
| `partners.ts` | Partenaires : nom, logo (chemin SVG), URL, tier (`principal` / `officiel` / `institutionnel`). |
| `gallery.ts` | Galerie photos : chemin de l'image, texte alternatif, dimensions (width/height), catégorie. |
| `faq.ts` | Questions/réponses affichées sur la page Inscriptions. |
| `timeline.ts` | Événements historiques affichés sur la page Histoire (Timeline GSAP). |
| `stats.ts` | Chiffres clés affichés sur la page d'accueil (licenciés, équipes, etc.). |
| `nav.ts` | Liens de navigation (barre de menu principale). |

---

## Comment remplacer les images

> **Important** : toutes les images sous `public/images/` et tous les logos sous `public/logos/` sont des **visuels AI-générés à titre d'illustration** (placeholders). Ils doivent être remplacés par de vraies photos et vrais logos avant la mise en ligne.

### Méthode

Déposez votre fichier au **même chemin** avec le **même nom de fichier**. Aucune modification de code n'est nécessaire. Respectez autant que possible le même ratio d'image pour éviter les décalages de mise en page.

### Dossiers et fichiers

| Dossier | Contenu | Champ de données |
|---|---|---|
| `public/images/hero/` | Photo principale pleine page | `src/components/sections/Hero.tsx` (fixe : `hero-1.jpg`) |
| `public/images/teams/` | Photos des équipes | Champ `image` dans `src/data/teams.ts` |
| `public/images/news/` | Photos des articles | Champ `image` dans `src/data/news.ts` |
| `public/images/events/` | Photos des événements | Champ `image` dans `src/data/events.ts` |
| `public/images/gallery/` | Photos de la galerie | Champ `src` dans `src/data/gallery.ts` |
| `public/logos/` | Logos partenaires (SVG) | Champ `logo` dans `src/data/partners.ts` |

La liste complète des fichiers avec leurs dimensions est disponible dans `scripts/fetch-images.md`.

---

## Contenus à confirmer

Les contenus rédigés sur la base d'informations disponibles publiquement sont signalés par le marqueur `[À CONFIRMER]`. Avant la mise en ligne, ces éléments doivent être validés par le club.

### Comment les retrouver

```bash
grep -rn "À CONFIRMER" src
```

### Principaux points à valider

- **`src/data/stats.ts`** — Nombre de licenciés, nombre d'équipes engagées, nombre d'années d'existence du club.
- **`src/data/timeline.ts`** — Dates et descriptions des grandes étapes de l'histoire du club (année de fondation, etc.).
- **`src/data/teams.ts`** — Horaires précis de chaque équipe (créneaux, jours).
- **`src/data/faq.ts`** — Tarifs des licences, documents requis, horaires d'entraînement.
- **`src/data/news.ts`** — Contenu des articles (certains sont rédigés à titre d'exemple).
- **`src/data/events.ts`** — Dates, lieux et descriptions des événements.
- **`src/app/inscriptions/page.tsx`** — Tarifs, modalités de règlement, procédure d'inscription.
- **`src/app/histoire/page.tsx`** — Texte historique (année de création 1996, etc.).
- **`src/app/partenaires/page.tsx`** — Détail des offres de partenariat.
- **Lien FFVolley** (`src/app/inscriptions/page.tsx`) — Vérifier l'URL de la plateforme de licence FFVolley.

---

## SEO et domaine de production

Le domaine de production est défini dans **`src/lib/seo.ts`** :

```typescript
// [À CONFIRMER] domaine de production
export const SITE_URL = "https://www.volleymarseillan.com";
```

Remplacez cette valeur par le vrai domaine avant le déploiement. Ce champ alimente :
- `metadataBase` (Open Graph, Twitter Card, canonicals)
- Le JSON-LD SportsClub
- Le sitemap XML

---

## Déploiement

Le site est **entièrement statique** (`next build` génère un dossier `.next/` exportable).

### Vercel (recommandé)

1. Connectez le dépôt Git à [Vercel](https://vercel.com/).
2. Framework : **Next.js** — détecté automatiquement.
3. Build command : `npm run build`
4. Output directory : `.next`
5. Node.js version : **20.x** ou 22.x

### Hébergement statique alternatif (Netlify, S3, etc.)

Ajoutez `output: 'export'` dans `next.config.ts` pour générer un dossier `out/` de fichiers HTML/CSS/JS purs. Note : les routes API et Server Actions ne sont pas utilisées dans ce projet, donc l'export statique est totalement compatible.

---

## Accessibilité et performances

### Ce qui a été mis en place

- **Polices** : Anton et Inter chargées via `next/font` avec `display: swap` — aucune requête vers Google Fonts en production, zéro CLS dû aux polices.
- **Images** : toutes servies via `next/image` avec attributs `sizes` appropriés. `priority` uniquement sur l'image hero et les images en haut de page (`actualites` featured card, article slug hero). `images.unoptimized: true` conservé pour la compatibilité déploiement statique.
- **GSAP** : importé dynamiquement (`await import('gsap')`) uniquement dans le composant Timeline de la page `/histoire` — aucun impact sur le bundle des autres pages.
- **Framer Motion** : utilisé côté client uniquement (`"use client"`), avec respect de `prefers-reduced-motion` sur tous les composants animés.
- **Lenis smooth scroll** : client-side uniquement, désactivé si reduced-motion.
- **Loader** : affiché une seule fois par session (sessionStorage), puis court-circuité.
- **JSON-LD** SportsClub sur toutes les pages (root layout).
- **Skip link** d'accessibilité visible au focus.
- **aria-label**, **aria-current**, **role** sur les éléments de navigation et les images décoratives.
- **Sitemap XML** et **robots.txt** générés automatiquement.

### Après déploiement

Lancer un audit **Lighthouse** (onglet Chrome DevTools ou `lighthouse <URL> --view`) sur les pages clés (accueil, inscriptions, histoire). Les optimisations ci-dessus ciblent un score > 95 en Performance, 100 en Accessibility et SEO.

---

## Tests

```bash
npm run test
```

Vitest + Testing Library. Les tests couvrent les utilitaires (`src/lib/`) et les données (`src/data/`).

```bash
npm run typecheck
```

Vérification TypeScript sans compilation (tsc --noEmit).

---

## Contact club

- **Responsable** : Delphine Mary
- **Email** : volleymarseillan@gmail.com
- **Tél.** : 06 81 82 26 60
- **Gymnase Louis Boudou**, Avenue de Florensac, 34340 Marseillan
- **Facebook** : [Volley Club Marseillanais](https://www.facebook.com/volleyclub.marseillanais/)

---

## Administration (/admin)

Le site embarque un mini-CMS **100 % côté client, sans base de données**. Il
permet à l'équipe du club de modifier l'intégralité du contenu depuis le
navigateur.

### Accès

- URL : **`/admin`** — page **cachée** (non listée dans la navigation) et en
  **`noindex`** (jamais indexée par les moteurs de recherche).
- Connexion par mot de passe. Mot de passe par défaut : **`vcm-admin-2026`**.
- Pour le changer : éditer `ADMIN_PASSWORD` dans **`src/admin/config.ts`** puis
  redéployer.
- ⚠️ **Protection légère côté client** : le mot de passe est embarqué dans le
  bundle JavaScript. Le but est uniquement de garder l'interface hors de portée
  du public — ce **n'est pas** une sécurité forte. La session reste active dans
  l'onglet courant (`sessionStorage`) jusqu'à la déconnexion ou la fermeture de
  l'onglet.

### Ce qu'on peut éditer

- **Tous les textes** : page d'accueil (hero, intro, chiffres, aperçus, bandeaux,
  contact rapide, pied de page) et toutes les pages internes (Histoire, Équipes,
  Sport Santé, Inscriptions, Partenaires, Galerie, Actualités, Contact).
- **Infos club** : identité, adresse, contact, réseaux sociaux.
- **Chiffres clés** (statistiques de l'accueil).
- **Équipes & joueurs** : chaque équipe + son effectif (photos, rôles, numéros).
- **Actualités**, **événements**, **partenaires** (logos), **galerie**, **FAQ**,
  **timeline** (historique).

### Images

- Formats acceptés : tout ce que le navigateur sait décoder (PNG, JPEG, WebP,
  GIF, AVIF, BMP…).
- Les images sont **redimensionnées automatiquement** (largeur max **1600 px**,
  ré-encodées en **WebP**, repli JPEG/PNG) puis **stockées directement dans le
  contenu** (data URL). Une alerte s'affiche si une image dépasse ~500 Ko.

### Persistance des modifications

- Les modifications sont enregistrées dans le **`localStorage` du navigateur**.
- Elles sont **visibles immédiatement sur CE navigateur** et **synchronisées
  entre les onglets ouverts** (événement `storage`).
- Elles ne sont **pas** visibles par les autres visiteurs tant qu'elles n'ont
  pas été publiées (voir ci-dessous).
- ⚠️ Le `localStorage` est **limité en taille** (~5 Mo selon le navigateur).
  Beaucoup d'images volumineuses peuvent saturer ce quota : dans ce cas
  l'enregistrement échoue et il faut **privilégier l'export**.

### Publier pour tout le monde

Comme il n'y a pas de base de données, la publication globale se fait via un
fichier JSON committé :

1. Dans **Import / Export**, cliquer sur **« Exporter »** → un fichier
   `vcm-contenu-AAAA-MM-JJ.json` est téléchargé.
2. Remplacer le contenu de **`src/content/imported.json`** par celui de ce
   fichier exporté.
3. **Commit + redéploiement** du site.
4. Tout le monde voit alors les changements.

Ordre de priorité du contenu effectif :
**`localStorage` (ce navigateur) > `src/content/imported.json` (committé, global)
> valeurs par défaut**. Un `imported.json` vide (`{}`) ne change rien.

### Réinitialiser

Le bouton **« Réinitialiser »** (Import / Export) efface les modifications
locales de ce navigateur et restaure le **contenu par défaut**.
