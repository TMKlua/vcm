# VCM — Site Officiel Premium · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire le site officiel premium, 100 % statique (aucune base de données), du Volley Club Marseillanais en Next.js 15, avec animations haut de gamme et thème volley omniprésent.

**Architecture:** Next.js 15 App Router en SSG complet. Données statiques typées dans `src/data`. UI en composants focalisés (layout / ui / sections / motion). Animations via Framer Motion + GSAP/ScrollTrigger + Lenis, montées côté client uniquement et respectant `prefers-reduced-motion`. Images stock premium auto-hébergées servies par `next/image`.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, GSAP + ScrollTrigger, Lenis, Lucide, next/font (Anton, Inter), Vitest (logique pure).

**Verification model:** Pour ce site visuel, la porte de vérification de chaque tâche est : `npm run typecheck` + `npm run lint` + `npm run build` réussis, plus un contrôle visuel ciblé sur `npm run dev` quand indiqué. Les tests unitaires Vitest sont réservés à la logique pure (validation de formulaire, intégrité des données). On commit après chaque tâche.

---

## Conventions

- Gestionnaire de paquets : **npm**.
- Commits : préfixes conventionnels (`chore:`, `feat:`, `style:`, `docs:`). Terminer chaque message par une ligne vide puis `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- Tous les chemins sont relatifs à la racine du projet `/Users/thomaspoderoso/Documents/development/vcm-main`.
- Composants client : ajouter `"use client"` uniquement quand nécessaire (animations, état, hooks). Pages et sections de contenu restent Server Components par défaut.
- Tout texte « à confirmer » par le club est suffixé d'un commentaire `// [À CONFIRMER]` dans les data, et visuellement neutre côté rendu (pas de marquage visible).

---

## Phase 0 — Fondations

### Task 1: Scaffolding du projet Next.js 15

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.eslintrc` (via create-next-app)
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [ ] **Step 1: Générer le projet**

Run :
```bash
npx create-next-app@latest . --ts --app --tailwind --eslint --src-dir --import-alias "@/*" --no-turbopack --use-npm --yes
```
Si le dossier n'est pas vide (présence de `docs/`, `.git`), répondre pour conserver, ou générer dans un sous-dossier temporaire puis fusionner. Conserver `docs/`, `.gitignore`, `.git`.

- [ ] **Step 2: Ajouter les scripts dans `package.json`**

Dans `"scripts"`, garantir :
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "test": "vitest run"
}
```

- [ ] **Step 3: Installer les dépendances runtime et dev**

Run :
```bash
npm i framer-motion gsap lenis lucide-react
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 4: Vérifier le build initial**

Run : `npm run build`
Expected : build SSG réussi, page d'accueil par défaut générée.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 + dépendances animations"
```

---

### Task 2: Configuration Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Écrire `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
```

- [ ] **Step 2: Écrire `src/test/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Test sanity**

Create `src/test/sanity.test.ts` :
```ts
import { describe, it, expect } from "vitest";
describe("sanity", () => { it("works", () => { expect(1 + 1).toBe(2); }); });
```

- [ ] **Step 4: Lancer**

Run : `npm test`
Expected : 1 test PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: config Vitest pour logique pure"
```

---

### Task 3: Design tokens & polices (Tailwind v4 + next/font)

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/lib/fonts.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Définir les polices `src/lib/fonts.ts`**

```ts
import { Anton, Inter } from "next/font/google";

export const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
```

- [ ] **Step 2: Déclarer les tokens dans `globals.css`** (Tailwind v4 `@theme`)

Remplacer le contenu généré par :
```css
@import "tailwindcss";

@theme {
  --color-ink: #0a0418;
  --color-night: #15082e;
  --color-violet-700: #7c3aed;
  --color-violet-500: #a855f7;
  --color-magenta: #c026d3;
  --color-fuchsia-vcm: #ff4dd2;
  --color-paper: #ffffff;
  --color-lilac: #f4f0ff;
  --color-encre: #1a0b3a;

  --font-display: var(--font-display);
  --font-sans: var(--font-sans);
}

:root { color-scheme: dark; }

html { scroll-behavior: auto; } /* Lenis gère le smooth scroll */

body {
  background: var(--color-ink);
  color: #ece4ff;
  font-family: var(--font-sans), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, .font-display {
  font-family: var(--font-display), system-ui, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.01em;
}

/* Utilitaires gradient signature */
.text-gradient {
  background: linear-gradient(90deg, var(--color-violet-500), var(--color-fuchsia-vcm));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Brancher les polices dans `layout.tsx`**

Sur `<html>` : `className={\`${display.variable} ${sans.variable}\`}` et `lang="fr"`.

- [ ] **Step 4: Vérifier**

Run : `npm run dev` — vérifier visuellement qu'un `<h1>` utilise Anton et le corps Inter, fond violet sombre. Puis `npm run build`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "style: design tokens violet/magenta + polices Anton/Inter"
```

---

### Task 4: Types TypeScript (modèle de données)

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Écrire les interfaces**

```ts
export interface ClubInfo {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  address: { venue: string; street: string; city: string; postalCode: string };
  contact: { person: string; phone: string; email: string };
  schedule: string;
  socials: { facebook?: string; instagram?: string; website?: string; clubeo?: string };
}

export interface Stat { value: number; suffix?: string; label: string }

export interface Team {
  slug: string;
  name: string;
  category: "baby" | "jeunes" | "loisir" | "competition" | "soft" | "sante" | "beach";
  shortDescription: string;
  description: string;
  objectives: string[];
  schedule: string;
  image: string;
  ageRange?: string;
}

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];   // paragraphes
  date: string;        // ISO
  category: string;
  image: string;
  author?: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  date: string;        // ISO
  location: string;
  description: string;
  image: string;
}

export interface Partner {
  name: string;
  logo: string;
  url?: string;
  tier: "principal" | "officiel" | "institutionnel";
}

export interface GalleryImage { src: string; alt: string; width: number; height: number; category: string }

export interface FaqItem { question: string; answer: string }

export interface TimelineEntry { year: string; title: string; description: string }

export interface NavLink { label: string; href: string; children?: NavLink[] }
```

- [ ] **Step 2: Vérifier**

Run : `npm run typecheck`
Expected : aucun erreur.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: types du modèle de données statique"
```

---

### Task 5: Données statiques (contenu réel + réaliste)

**Files:**
- Create: `src/data/club.ts`, `src/data/nav.ts`, `src/data/stats.ts`, `src/data/teams.ts`, `src/data/news.ts`, `src/data/events.ts`, `src/data/partners.ts`, `src/data/gallery.ts`, `src/data/faq.ts`, `src/data/timeline.ts`
- Test: `src/data/data.test.ts`

- [ ] **Step 1: `club.ts`** (données réelles)

```ts
import type { ClubInfo } from "@/types";
export const club: ClubInfo = {
  name: "Volley Club Marseillanais",
  shortName: "VCM",
  tagline: "Joue. Smash. Gagne.",
  description:
    "Club convivial au bord de l'étang de Thau, le Volley Club Marseillanais fait vivre le volley pour tous les âges, du Baby Volley dès 3 ans à la compétition, en passant par le loisir et le sport santé.",
  address: { venue: "Gymnase Louis Boudou", street: "Avenue de Florensac", city: "Marseillan", postalCode: "34340" },
  contact: { person: "Delphine Mary", phone: "06 81 82 26 60", email: "volleymarseillan@gmail.com" },
  schedule: "Entraînements les lundis et mercredis",
  socials: {
    facebook: "https://www.facebook.com/volleyclub.marseillanais/",
    website: "https://www.volleymarseillan.com/",
    clubeo: "https://vcm-volley-club-marseillanais.clubeo.com/",
  },
};
```

- [ ] **Step 2: `nav.ts`** (navigation + mega-menu)

```ts
import type { NavLink } from "@/types";
export const navLinks: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Le Club", href: "/histoire", children: [
    { label: "Histoire", href: "/histoire" },
    { label: "Sport Santé", href: "/sport-sante" },
  ]},
  { label: "Équipes", href: "/equipes" },
  { label: "Actualités", href: "/actualites" },
  { label: "Galerie", href: "/galerie" },
  { label: "Partenaires", href: "/partenaires" },
  { label: "Inscriptions", href: "/inscriptions" },
  { label: "Contact", href: "/contact" },
];
```

- [ ] **Step 3: `stats.ts`** (chiffres clés — réalistes, à confirmer)

```ts
import type { Stat } from "@/types";
export const stats: Stat[] = [
  { value: 150, suffix: "+", label: "Licenciés" },     // [À CONFIRMER]
  { value: 10, label: "Équipes engagées" },            // [À CONFIRMER]
  { value: 3, label: "Âge minimum (Baby Volley)" },
  { value: 30, suffix: " ans", label: "De passion" },  // [À CONFIRMER]
];
```

- [ ] **Step 4: `teams.ts`** (7 pratiques, données réelles + objectifs réalistes)

Créer un tableau `teams: Team[]` couvrant : `baby` (Baby Volley dès 3 ans), `jeunes` (Poussins/Benjamins/Minimes/Cadets/U18), `loisir` (Loisir 6×6), `competition`, `soft` (Soft Volley), `sante` (Sport Santé), `beach` (Beach Volley). Chaque entrée : `slug`, `name`, `category`, `shortDescription`, `description` (2-3 phrases réalistes), `objectives` (3 items), `schedule` (`// [À CONFIRMER]` si inconnu), `image` (chemin `/images/teams/<slug>.jpg`), `ageRange`. Exemple :
```ts
import type { Team } from "@/types";
export const teams: Team[] = [
  {
    slug: "baby-volley",
    name: "Baby Volley",
    category: "baby",
    shortDescription: "Le volley en s'amusant, dès 3 ans.",
    description: "Un apprentissage 100 % ludique pour les plus petits : motricité, coordination et plaisir du jeu dans un cadre bienveillant.",
    objectives: ["Développer la motricité", "Découvrir le ballon en s'amusant", "Apprendre à jouer ensemble"],
    schedule: "Mercredi après-midi", // [À CONFIRMER]
    image: "/images/teams/baby-volley.jpg",
    ageRange: "3 à 6 ans",
  },
  // ... 6 autres entrées sur le même modèle
];
```

- [ ] **Step 5: `news.ts`** (4-6 articles réalistes marqués)

Tableau `news: NewsArticle[]`, triable par `date`. Chaque article : `slug`, `title`, `excerpt`, `content` (3-4 paragraphes), `date` ISO, `category`, `image` (`/images/news/<slug>.jpg`). Contenu réaliste `// [À CONFIRMER]`.

- [ ] **Step 6: `events.ts`** (3-4 événements, dont Beach Volley réel)

Inclure « Hérault Beach Volley Jeunes » et la finale du Championnat Départemental de Beach Volley (partenariat Comité de l'Hérault, réel). Autres réalistes.

- [ ] **Step 7: `partners.ts`** (logos placeholders marqués)

6-8 partenaires réalistes (ex. Mairie de Marseillan, Comité Départemental Hérault de Volley — institutionnels réels ; commerces locaux réalistes `// [À CONFIRMER]`), `logo: "/logos/<slug>.svg"`, `tier`.

- [ ] **Step 8: `gallery.ts`** (12-16 images avec dimensions)

Tableau `gallery: GalleryImage[]`, chemins `/images/gallery/<n>.jpg`, `width`/`height` réalistes pour masonry, `category`.

- [ ] **Step 9: `faq.ts`** (8 questions inscriptions/club)

Questions réelles utiles : comment s'inscrire, documents (certificat médical, licence FFvolley), tarifs `// [À CONFIRMER]`, âge minimum, créneaux, essai gratuit, équipement, contact.

- [ ] **Step 10: `timeline.ts`** (6 jalons réalistes)

`timeline: TimelineEntry[]` — création `// [À CONFIRMER]`, jalons d'évolution, Beach Volley, Sport Santé, vision actuelle.

- [ ] **Step 11: Test d'intégrité `src/data/data.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { teams } from "@/data/teams";
import { news } from "@/data/news";
import { navLinks } from "@/data/nav";

describe("data integrity", () => {
  it("teams ont des slugs uniques et non vides", () => {
    const slugs = teams.map(t => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.every(Boolean)).toBe(true);
  });
  it("chaque équipe a au moins un objectif", () => {
    expect(teams.every(t => t.objectives.length > 0)).toBe(true);
  });
  it("news ont des slugs uniques", () => {
    const slugs = news.map(n => n.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it("nav: tous les href commencent par /", () => {
    const all = navLinks.flatMap(l => [l, ...(l.children ?? [])]);
    expect(all.every(l => l.href.startsWith("/"))).toBe(true);
  });
});
```

- [ ] **Step 12: Lancer tests + typecheck**

Run : `npm test && npm run typecheck`
Expected : tous PASS.

- [ ] **Step 13: Commit**

```bash
git add -A && git commit -m "feat: données statiques (réelles + réalistes marquées)"
```

---

### Task 6: Acquisition des images stock premium

**Files:**
- Create: `scripts/fetch-images.md` (manifeste sources + licences)
- Create: `public/images/**`, `public/logos/**`

- [ ] **Step 1: Créer l'arborescence images**

```bash
mkdir -p public/images/{hero,teams,news,gallery,events} public/logos
```

- [ ] **Step 2: Télécharger des photos de volley libres de droits**

Télécharger depuis Unsplash/Pexels (URLs de téléchargement directes, licence libre) les images correspondant aux chemins référencés dans les data (hero, 7 équipes, news, 12-16 galerie, events). Stocker en `.jpg` aux chemins exacts. Dimensionner raisonnablement (largeur ≤ 2000px). Exemple de récupération :
```bash
curl -L -o public/images/hero/hero-1.jpg "https://images.unsplash.com/photo-XXXX?w=2000&q=80"
```
Documenter chaque source (URL + auteur + licence) dans `scripts/fetch-images.md`.

- [ ] **Step 3: Logos partenaires placeholders**

Créer des SVG placeholders sobres (nom du partenaire en monochrome violet sur fond transparent) pour chaque entrée de `partners.ts`, aux chemins `/logos/<slug>.svg`. Clairement remplaçables.

- [ ] **Step 4: Vérifier que tous les chemins data existent**

Run :
```bash
node -e "const t=require('ts-node')" 2>/dev/null; echo 'verif manuelle'
```
Vérifier manuellement que chaque `image`/`logo` référencé dans `src/data/*` a un fichier correspondant sous `public/`. Lister les manquants et les corriger.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: images stock premium auto-hébergées + manifeste sources"
```

---

## Phase 1 — Système de motion & layout

### Task 7: Provider Lenis (smooth scroll)

**Files:**
- Create: `src/components/motion/SmoothScroll.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Écrire `SmoothScroll.tsx`**

```tsx
"use client";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
```

- [ ] **Step 2: Envelopper le `body` dans `layout.tsx`**

Placer `<SmoothScroll>{children}</SmoothScroll>` autour du contenu.

- [ ] **Step 3: Vérifier**

Run : `npm run dev` — scroller, vérifier le smooth scroll ; activer reduced-motion système et vérifier le fallback natif. Puis `npm run build`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: smooth scroll Lenis (respect reduced-motion)"
```

---

### Task 8: Primitives d'animation Framer Motion

**Files:**
- Create: `src/components/motion/Reveal.tsx`
- Create: `src/components/motion/TextReveal.tsx`
- Create: `src/components/motion/Stagger.tsx`
- Create: `src/lib/motion.ts`

- [ ] **Step 1: Variants partagés `src/lib/motion.ts`**

```ts
import type { Variants } from "framer-motion";
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
```

- [ ] **Step 2: `Reveal.tsx`** (reveal au scroll réutilisable)

```tsx
"use client";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export default function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: `TextReveal.tsx`** (révèle mot par mot)

```tsx
"use client";
import { motion } from "framer-motion";

export default function TextReveal({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}
```

- [ ] **Step 4: `Stagger.tsx`** (conteneur + item)

```tsx
"use client";
import { motion } from "framer-motion";
import { staggerParent, fadeUp } from "@/lib/motion";

export function StaggerGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
      {children}
    </motion.div>
  );
}
export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} variants={fadeUp}>{children}</motion.div>;
}
```

- [ ] **Step 5: Vérifier**

Run : `npm run typecheck && npm run build`
Expected : OK.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: primitives motion (Reveal, TextReveal, Stagger)"
```

---

### Task 9: UI primitives — MagneticButton, TiltCard, Counter, Accordion

**Files:**
- Create: `src/components/ui/MagneticButton.tsx`
- Create: `src/components/ui/TiltCard.tsx`
- Create: `src/components/ui/Counter.tsx`
- Create: `src/components/ui/Accordion.tsx`
- Test: `src/components/ui/counter.test.ts`

- [ ] **Step 1: `MagneticButton.tsx`** (attraction magnétique au survol)

```tsx
"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";

export default function MagneticButton({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  function onMove(e: React.MouseEvent) {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  }
  function reset() { x.set(0); y.set(0); }
  return (
    <motion.a ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ x: sx, y: sy }}
      className={className} href={href} {...(href.startsWith("/") ? {} : { target: "_blank", rel: "noopener" })}>
      {children}
    </motion.a>
  );
}
```
(Pour les liens internes, wrapper `Link` autour ou utiliser `<motion.a>` — un lien interne reste acceptable en SSG.)

- [ ] **Step 2: `TiltCard.tsx`** (hover 3D)

```tsx
"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 12 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 12 });
  function onMove(e: React.MouseEvent) {
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 12); rx.set(-py * 12);
  }
  function reset() { rx.set(0); ry.set(0); }
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }} className={className}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: `Counter.tsx`** + helper testable

Créer `src/lib/format.ts` :
```ts
export function clampProgress(elapsed: number, duration: number): number {
  if (duration <= 0) return 1;
  return Math.min(1, Math.max(0, elapsed / duration));
}
export function easeOutValue(target: number, progress: number): number {
  const eased = 1 - Math.pow(1 - progress, 3);
  return Math.round(target * eased);
}
```
Puis `Counter.tsx` :
```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { clampProgress, easeOutValue } from "@/lib/format";

export default function Counter({ to, suffix = "", duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0; let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = clampProgress(t - start, duration);
      setVal(easeOutValue(to, p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}
```

- [ ] **Step 4: Test `src/components/ui/counter.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { clampProgress, easeOutValue } from "@/lib/format";

describe("counter math", () => {
  it("clampProgress borne entre 0 et 1", () => {
    expect(clampProgress(-5, 100)).toBe(0);
    expect(clampProgress(50, 100)).toBe(0.5);
    expect(clampProgress(200, 100)).toBe(1);
  });
  it("easeOutValue atteint la cible à p=1", () => {
    expect(easeOutValue(150, 1)).toBe(150);
    expect(easeOutValue(150, 0)).toBe(0);
  });
});
```

- [ ] **Step 5: `Accordion.tsx`** (FAQ, accessible)

```tsx
"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/types";

export default function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-white/10">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
              <span className="text-lg font-medium">{it.question}</span>
              <Plus className={`size-5 shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <p className="pb-5 text-white/70">{it.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 6: Tests + build**

Run : `npm test && npm run typecheck && npm run build`
Expected : tous PASS.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: UI primitives (magnetic, tilt, counter, accordion)"
```

---

### Task 10: Décors volley animés (SVG) — court lines & ball trajectory

**Files:**
- Create: `src/components/motion/CourtLines.tsx`
- Create: `src/components/motion/BallTrajectory.tsx`
- Create: `src/components/motion/AnimatedGradient.tsx`

- [ ] **Step 1: `AnimatedGradient.tsx`** (halo violet/magenta animé, décoratif)

```tsx
"use client";
import { motion } from "framer-motion";

export default function AnimatedGradient({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      <motion.div className="absolute -top-1/3 left-1/4 size-[60vw] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,.35), transparent 60%)" }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-0 right-1/5 size-[50vw] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(192,38,211,.30), transparent 60%)" }}
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
    </div>
  );
}
```

- [ ] **Step 2: `CourtLines.tsx`** (lignes de terrain SVG décoratives)

SVG `aria-hidden` représentant des lignes de terrain de volley (rectangle + ligne d'attaque + filet stylisé), trait `currentColor` à faible opacité, `className` pour positionnement. Animation optionnelle d'apparition du tracé via `pathLength` (Framer Motion `motion.path`).

- [ ] **Step 3: `BallTrajectory.tsx`** (trajectoire de ballon animée)

`motion.svg` `aria-hidden` : un `motion.path` en pointillés (arc de trajectoire) animé via `pathLength` au scroll/in-view, + un cercle (ballon) animé le long du chemin avec `offsetPath`/keyframes. Respecte reduced-motion (rendu statique si réduit).

- [ ] **Step 4: Vérifier**

Run : `npm run dev` — déposer temporairement les 3 décors sur la home pour contrôle visuel, puis `npm run build`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: décors volley animés (court lines, ball trajectory, gradient)"
```

---

### Task 11: Loader animé premium

**Files:**
- Create: `src/components/layout/Loader.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Écrire `Loader.tsx`**

Composant client : overlay plein écran `fixed inset-0 z-[100]` fond `ink`, logo/typo VCM + un ballon animé suivant une courte trajectoire + barre de progression factice. Disparaît (fade/slide up via `AnimatePresence`) après ~1.4 s au premier montage (state `done` + `sessionStorage` pour ne pas réapparaître à chaque navigation). Respecte reduced-motion (durée quasi nulle).

- [ ] **Step 2: Monter dans `layout.tsx`** au-dessus du contenu.

- [ ] **Step 3: Vérifier**

Run : `npm run dev` — recharger : le loader s'affiche puis disparaît proprement, sans bloquer le scroll ensuite. `npm run build`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: loader animé premium au chargement"
```

---

### Task 12: Curseur personnalisé + scroll progress bar

**Files:**
- Create: `src/components/layout/Cursor.tsx`
- Create: `src/components/layout/ScrollProgress.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: `Cursor.tsx`**

Curseur custom (point + anneau) suivant la souris via `useMotionValue` + `useSpring`, grossit au survol des éléments interactifs (`a, button`). **Désactivé** si pointeur tactile (`window.matchMedia("(pointer: coarse)")`) ou reduced-motion ; dans ce cas ne rien rendre et garder le curseur natif. Masquer le curseur natif via classe sur `body` uniquement quand le custom est actif.

- [ ] **Step 2: `ScrollProgress.tsx`**

Barre fixe en haut, largeur pilotée par `useScroll().scrollYProgress` (`scaleX`), gradient violet→magenta, `z-50`, `aria-hidden`.

- [ ] **Step 3: Monter dans `layout.tsx`.**

- [ ] **Step 4: Vérifier**

Run : `npm run dev` — desktop : curseur custom + barre de progression OK ; simuler tactile : curseur natif conservé. `npm run build`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: curseur personnalisé + scroll progress bar"
```

---

### Task 13: Navbar flottante + mega-menu + Footer

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/MegaMenu.tsx`
- Create: `src/components/layout/MobileMenu.tsx`
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: `Navbar.tsx`** (flottante, transparente → opaque au scroll)

Client component : `fixed top-0`, devient un « pill » flottant avec fond `night/70` + `backdrop-blur` après ~40px de scroll (via `useScroll`/state). Logo VCM (typo Anton + pastille gradient), liens desktop, bouton CTA magnétique « Rejoindre », bouton burger mobile. Lien actif souligné (via `usePathname`).

- [ ] **Step 2: `MegaMenu.tsx`** (survol « Équipes »/« Le Club »)

Panneau déroulant animé listant les pratiques (depuis `teams.ts`) avec icônes Lucide + descriptions courtes, en grille. Accessible clavier (focus, `Escape` ferme).

- [ ] **Step 3: `MobileMenu.tsx`**

Overlay plein écran animé (`AnimatePresence`), liens en `stagger`, fermeture au clic/échap, piège de focus basique, `aria-modal`.

- [ ] **Step 4: `Footer.tsx`** premium

Grille : bloc club (logo + tagline + réseaux Lucide), navigation, contact réel (adresse, tél, email cliquables), mini plan/CTA. Bas de page : mention « © {année} VCM », crédit discret, lignes de terrain décoratives.

- [ ] **Step 5: Monter Navbar + Footer dans `layout.tsx`** (Navbar au-dessus, Footer en bas, `main` entre les deux).

- [ ] **Step 6: Vérifier**

Run : `npm run dev` — desktop : navbar flottante au scroll, mega-menu au survol, footer complet ; mobile : burger + overlay. Test clavier (Tab/Échap). `npm run build`.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: navbar flottante, mega-menu, menu mobile, footer premium"
```

---

## Phase 2 — Sections & page d'accueil

### Task 14: Section Hero immersive

**Files:**
- Create: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Écrire `Hero.tsx`**

Section plein écran (`min-h-screen`) : image de fond `next/image` (`/images/hero/hero-1.jpg`, `priority`, `fill`, `object-cover`) + overlay gradient violet sombre, `AnimatedGradient` + `BallTrajectory` décoratifs. Contenu : kicker (« Volley Club Marseillanais »), titre `TextReveal` (tagline `club.tagline`), sous-titre, 2 CTA magnétiques (« Rejoindre le club » → /inscriptions, « Découvrir » → /histoire). Indicateur de scroll animé en bas. Parallax léger du fond via `useScroll`/`useTransform`.

- [ ] **Step 2: Vérifier**

Run : `npm run dev` — effet WOW à l'arrivée, LCP = image hero. `npm run build`.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: section hero immersive"
```

---

### Task 15: Sections home — Présentation, Stats, Aperçu équipes

**Files:**
- Create: `src/components/sections/Intro.tsx`
- Create: `src/components/sections/StatsSection.tsx`
- Create: `src/components/sections/TeamsPreview.tsx`
- Create: `src/components/ui/TeamCard.tsx`

- [ ] **Step 1: `Intro.tsx`**

Présentation du club (`club.description`) en `Reveal`/`TextReveal`, avec image (étang de Thau / gymnase) en `TiltCard` ou parallax. Section sombre.

- [ ] **Step 2: `StatsSection.tsx`**

Grille des `stats` avec `Counter` animé par item, `StaggerGroup`. Fond avec `CourtLines` décoratives.

- [ ] **Step 3: `TeamCard.tsx`** (carte équipe réutilisable)

`TiltCard` + `next/image` + nom + shortDescription + `ageRange` + lien vers `/equipes#<slug>`. Glow gradient au survol.

- [ ] **Step 4: `TeamsPreview.tsx`**

Sélection de 4-6 équipes en grille `StaggerGroup` de `TeamCard`, titre de section + CTA « Toutes nos équipes » → /equipes.

- [ ] **Step 5: Vérifier**

Run : `npm run dev` (les sections seront assemblées en Task 18) + `npm run build`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: sections intro, stats animées, aperçu équipes"
```

---

### Task 16: Sections home — Événements, Galerie aperçu

**Files:**
- Create: `src/components/sections/EventsPreview.tsx`
- Create: `src/components/sections/GalleryPreview.tsx`
- Create: `src/components/ui/EventCard.tsx`
- Create: `src/lib/date.ts`

- [ ] **Step 1: `src/lib/date.ts`** (formatage FR testable)

```ts
export function formatFrDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}
export function sortByDateDesc<T extends { date: string }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
```

- [ ] **Step 2: Test `src/lib/date.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { sortByDateDesc } from "@/lib/date";
describe("date utils", () => {
  it("trie du plus récent au plus ancien", () => {
    const r = sortByDateDesc([{ date: "2024-01-01" }, { date: "2025-01-01" }]);
    expect(r[0].date).toBe("2025-01-01");
  });
});
```

- [ ] **Step 3: `EventCard.tsx`** + `EventsPreview.tsx`

Cartes événement (image, date `formatFrDate`, lieu, titre) en `StaggerGroup`, 3 prochains événements.

- [ ] **Step 4: `GalleryPreview.tsx`**

Bande/mosaïque de 6-8 images `next/image` avec hover zoom + CTA « Voir la galerie » → /galerie.

- [ ] **Step 5: Tests + build**

Run : `npm test && npm run build`
Expected : PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: sections événements + aperçu galerie + utils date"
```

---

### Task 17: Sections home — Partenaires, Rejoindre, Contact rapide

**Files:**
- Create: `src/components/sections/PartnersStrip.tsx`
- Create: `src/components/sections/JoinCta.tsx`
- Create: `src/components/sections/ContactQuick.tsx`

- [ ] **Step 1: `PartnersStrip.tsx`**

Bandeau/marquee de logos partenaires (depuis `partners.ts`), grayscale → couleur au survol, lien. CTA « Devenir partenaire » → /partenaires.

- [ ] **Step 2: `JoinCta.tsx`**

Section pleine largeur fond gradient violet→magenta (section claire/contrastée), titre fort `TextReveal`, bouton magnétique « Rejoindre le club » → /inscriptions, décor `BallTrajectory`.

- [ ] **Step 3: `ContactQuick.tsx`**

Bloc contact condensé : coordonnées réelles (`club.contact`, `club.address`) + réseaux + CTA « Nous contacter » → /contact.

- [ ] **Step 4: Vérifier**

Run : `npm run build`
Expected : OK.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: sections partenaires, rejoindre, contact rapide"
```

---

### Task 18: Assemblage de la page d'accueil

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Composer la home**

Assembler dans l'ordre du spec : `Hero`, `Intro`, `StatsSection`, `TeamsPreview`, `EventsPreview`, `GalleryPreview`, `PartnersStrip`, `JoinCta`, `ContactQuick`. Alterner sections sombres/claires pour le rythme.

- [ ] **Step 2: Vérifier l'ensemble**

Run : `npm run dev` — parcourir toute la home, vérifier reveals au scroll, cohérence visuelle, responsive (mobile/desktop). `npm run build`.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: page d'accueil complète assemblée"
```

---

## Phase 3 — Pages intérieures

### Task 19: Composants de page partagés (PageHero, Section)

**Files:**
- Create: `src/components/layout/PageHero.tsx`
- Create: `src/components/layout/Section.tsx`

- [ ] **Step 1: `PageHero.tsx`**

En-tête de page réutilisable : titre (`TextReveal`), sous-titre, fil d'ariane optionnel, fond gradient + `CourtLines`, padding compensant la navbar fixe.

- [ ] **Step 2: `Section.tsx`**

Wrapper de section avec variantes `tone="dark" | "light"`, padding vertical cohérent, `max-w` container.

- [ ] **Step 3: Build**

Run : `npm run build`

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: composants de page partagés (PageHero, Section)"
```

---

### Task 20: Page Histoire (timeline animée)

**Files:**
- Create: `src/app/histoire/page.tsx`
- Create: `src/components/sections/Timeline.tsx`

- [ ] **Step 1: `Timeline.tsx`** (GSAP ScrollTrigger)

Client component : liste verticale des `TimelineEntry`, ligne centrale dont la hauteur se remplit au scroll (GSAP ScrollTrigger sur `scrub`), chaque entrée révélée alternée gauche/droite. **Important** : enregistrer `gsap.registerPlugin(ScrollTrigger)` côté client dans un `useEffect`, nettoyer via `ScrollTrigger.getAll().forEach(t => t.kill())` au démontage. Fallback reduced-motion : tout visible, sans scrub.

- [ ] **Step 2: `histoire/page.tsx`**

`PageHero` (« Notre Histoire ») + storytelling (`club` + paragraphes réalistes marqués) + `Timeline` + section vision actuelle + `metadata` export.

- [ ] **Step 3: Vérifier**

Run : `npm run dev` — la timeline se remplit au scroll, entrées révélées ; tester reduced-motion. `npm run build`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: page histoire avec timeline animée GSAP"
```

---

### Task 21: Page Équipes

**Files:**
- Create: `src/app/equipes/page.tsx`
- Create: `src/components/sections/TeamDetailCard.tsx`

- [ ] **Step 1: `TeamDetailCard.tsx`**

Carte détaillée par équipe : image `next/image`, nom, catégorie (badge), description, liste d'objectifs (icônes Lucide), horaires, `ageRange`. `id={slug}` pour ancrage. Layout alterné image/texte. `Reveal` à l'apparition.

- [ ] **Step 2: `equipes/page.tsx`**

`PageHero` (« Nos Équipes ») + intro + filtre visuel par catégorie (boutons d'ancre vers les sections) + map de `teams` en `TeamDetailCard`. `metadata` export.

- [ ] **Step 3: Vérifier**

Run : `npm run dev` — toutes les pratiques présentes, ancres fonctionnelles, responsive. `npm run build`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: page équipes (cards détaillées premium)"
```

---

### Task 22: Page Sport Santé

**Files:**
- Create: `src/app/sport-sante/page.tsx`

- [ ] **Step 1: Écrire la page**

Page humaine et moderne : `PageHero` (« Sport Santé & Soft Volley »), bloc Soft Volley (texte réel : pratique ludique, conviviale, adaptée aux non-sportifs/débutants/reprise), bénéfices bien-être (grille d'icônes + `Stagger`), accessibilité/inclusion, visuels chaleureux, CTA contact. Ton chaleureux, sections claires dominantes. `metadata` export.

- [ ] **Step 2: Vérifier**

Run : `npm run build`

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: page sport santé / soft volley"
```

---

### Task 23: Page Inscriptions (FAQ)

**Files:**
- Create: `src/app/inscriptions/page.tsx`

- [ ] **Step 1: Écrire la page**

`PageHero` (« Inscriptions ») + étapes « Comment rejoindre le club » (stepper visuel `Stagger`) + licences/documents (certificat médical, licence FFvolley) + tarifs `[À CONFIRMER]` + boutons vers liens existants (`club.socials.clubeo`, lien HelloAsso/FFvolley en `// [À CONFIRMER]`) via `MagneticButton` + `Accordion` (faq.ts). `metadata` export.

- [ ] **Step 2: Vérifier**

Run : `npm run dev` — accordéon fonctionne au clavier, liens externes ouvrent en nouvel onglet. `npm run build`.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: page inscriptions avec FAQ accordéon"
```

---

### Task 24: Page Partenaires

**Files:**
- Create: `src/app/partenaires/page.tsx`
- Create: `src/components/ui/PartnerLogo.tsx`

- [ ] **Step 1: `PartnerLogo.tsx`**

Cellule logo : `next/image`/SVG, grayscale→couleur + scale au survol (`TiltCard` léger), lien `url` si présent (nouvel onglet).

- [ ] **Step 2: `partenaires/page.tsx`**

`PageHero` (« Nos Partenaires ») + mur de logos groupé par `tier` (`StaggerGroup`) + section « Devenir partenaire » : argumentaire sponsor (visibilité, valeurs, audience locale, contreparties), CTA contact. `metadata` export.

- [ ] **Step 3: Vérifier**

Run : `npm run build`

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: page partenaires + section devenir partenaire"
```

---

### Task 25: Page Galerie (masonry + lightbox)

**Files:**
- Create: `src/app/galerie/page.tsx`
- Create: `src/components/sections/GalleryMasonry.tsx`
- Create: `src/components/ui/Lightbox.tsx`

- [ ] **Step 1: `Lightbox.tsx`**

Overlay `AnimatePresence` plein écran : image agrandie `next/image`, navigation préc./suiv. (clavier ← →, `Escape` ferme), compteur, fond `ink/90` `backdrop-blur`, `aria-modal`, piège de focus. Zoom au clic.

- [ ] **Step 2: `GalleryMasonry.tsx`**

Layout masonry CSS (`columns-2 md:columns-3 lg:columns-4`, `break-inside-avoid`) des `gallery` images en `next/image` (ratios via width/height), filtres par `category`, ouverture Lightbox au clic, reveal `Stagger`.

- [ ] **Step 3: `galerie/page.tsx`**

`PageHero` (« Galerie ») + `GalleryMasonry`. `metadata` export.

- [ ] **Step 4: Vérifier**

Run : `npm run dev` — masonry correct, lightbox ouvre/ferme/navigue au clavier, responsive. `npm run build`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: page galerie masonry + lightbox accessible"
```

---

### Task 26: Page Actualités (liste + détail)

**Files:**
- Create: `src/app/actualites/page.tsx`
- Create: `src/app/actualites/[slug]/page.tsx`
- Create: `src/components/ui/NewsCard.tsx`

- [ ] **Step 1: `NewsCard.tsx`**

Carte article : image, catégorie (badge), date (`formatFrDate`), titre, excerpt, lien vers `/actualites/[slug]`. `TiltCard`/hover.

- [ ] **Step 2: `actualites/page.tsx`**

`PageHero` (« Actualités ») + article à la une (le plus récent) + grille `NewsCard` (triés `sortByDateDesc`) en `StaggerGroup`. `metadata` export.

- [ ] **Step 3: `actualites/[slug]/page.tsx`** (SSG)

```tsx
import { news } from "@/data/news";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}
```
Rendu : image héro, méta (date/catégorie), titre, paragraphes `content`, lien retour. `generateMetadata` par article (title/description/OG). `notFound()` si slug inconnu.

- [ ] **Step 4: Vérifier**

Run : `npm run build` — vérifier que les routes statiques `/actualites/<slug>` sont générées (pré-rendu). `npm run dev` pour parcours liste→détail.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: actualités (liste + pages détail SSG)"
```

---

### Task 27: Page Contact (formulaire front-only)

**Files:**
- Create: `src/app/contact/page.tsx`
- Create: `src/components/sections/ContactForm.tsx`
- Create: `src/lib/validation.ts`
- Test: `src/lib/validation.test.ts`

- [ ] **Step 1: `src/lib/validation.ts`** (logique pure testable)

```ts
export interface ContactValues { name: string; email: string; message: string }
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export function validateContact(v: ContactValues): ContactErrors {
  const e: ContactErrors = {};
  if (!v.name.trim()) e.name = "Le nom est requis.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Email invalide.";
  if (v.message.trim().length < 10) e.message = "Message trop court (10 caractères min).";
  return e;
}
export function buildMailto(to: string, v: ContactValues): string {
  const subject = encodeURIComponent(`Contact site VCM — ${v.name}`);
  const body = encodeURIComponent(`${v.message}\n\n— ${v.name} (${v.email})`);
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
```

- [ ] **Step 2: Test `src/lib/validation.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { validateContact, buildMailto } from "@/lib/validation";

describe("validateContact", () => {
  it("signale les champs vides/invalides", () => {
    const e = validateContact({ name: "", email: "x", message: "court" });
    expect(e.name).toBeTruthy();
    expect(e.email).toBeTruthy();
    expect(e.message).toBeTruthy();
  });
  it("ne signale rien quand tout est valide", () => {
    const e = validateContact({ name: "Jean", email: "a@b.fr", message: "Bonjour, je veux m'inscrire svp." });
    expect(Object.keys(e)).toHaveLength(0);
  });
});
describe("buildMailto", () => {
  it("génère un mailto encodé", () => {
    const url = buildMailto("club@x.fr", { name: "Jean", email: "a@b.fr", message: "Bonjour ceci est un test." });
    expect(url.startsWith("mailto:club@x.fr?subject=")).toBe(true);
  });
});
```

- [ ] **Step 3: `ContactForm.tsx`** (client, front-only)

État contrôlé, `validateContact` au submit, affichage des erreurs (`aria-invalid`, `aria-describedby`), au succès : ouvrir `buildMailto` (`window.location.href`) + message de confirmation. **Aucun appel réseau, aucune DB.** Labels accessibles.

- [ ] **Step 4: `contact/page.tsx`**

`PageHero` (« Contact ») + grille : coordonnées réelles (adresse, tél cliquable `tel:`, email `mailto:`, réseaux), carte/embed statique de localisation (iframe OpenStreetMap ou image carte locale, sans clé API), `ContactForm`. `metadata` export.

- [ ] **Step 5: Tests + build**

Run : `npm test && npm run build`
Expected : PASS, formulaire validé sans réseau.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: page contact + formulaire front-only validé"
```

---

## Phase 4 — SEO, perf, accessibilité, finition

### Task 28: SEO global (metadata, sitemap, robots, JSON-LD)

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/lib/seo.ts`
- Create: `public/og-image.jpg`, `public/favicon.ico` (+ icons)

- [ ] **Step 1: `metadata` racine + template**

Dans `layout.tsx`, exporter `metadata: Metadata` avec `metadataBase`, `title.default` + `title.template` (`%s · VCM`), `description`, `openGraph` (type website, locale fr_FR, images `/og-image.jpg`), `twitter` (`summary_large_image`), `icons`.

- [ ] **Step 2: `seo.ts`** helper

Fonction `pageMetadata({ title, description, path })` retournant un `Metadata` cohérent (OG/Twitter inclus) à réutiliser dans chaque page.

- [ ] **Step 3: Appliquer `pageMetadata` à toutes les pages** (histoire, équipes, sport-santé, inscriptions, partenaires, galerie, actualités, contact) si pas déjà fait.

- [ ] **Step 4: `sitemap.ts`**

Générer toutes les routes statiques + `/actualites/<slug>` depuis `news`. `lastModified` constant.

- [ ] **Step 5: `robots.ts`**

`rules: { userAgent: "*", allow: "/" }`, `sitemap: <metadataBase>/sitemap.xml`.

- [ ] **Step 6: JSON-LD `SportsClub`** dans `layout.tsx`

`<script type="application/ld+json">` avec nom, sport « Volleyball », adresse (PostalAddress réelle), téléphone, email, sameAs (réseaux).

- [ ] **Step 7: OG image + favicons**

Créer `public/og-image.jpg` (1200×630, branding VCM violet/magenta) et favicons (`icon.png`/`apple-icon.png` ou `favicon.ico`).

- [ ] **Step 8: Vérifier**

Run : `npm run build` puis vérifier la présence de `sitemap.xml`/`robots.txt` dans la sortie. Inspecter le `<head>` d'une page en dev (OG/Twitter/JSON-LD présents).

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: SEO complet (metadata, sitemap, robots, JSON-LD, OG)"
```

---

### Task 29: Accessibilité & reduced-motion (audit ciblé)

**Files:**
- Modify: composants concernés (selon constats)
- Create: `src/components/ui/SkipLink.tsx`

- [ ] **Step 1: `SkipLink.tsx`** + `id="contenu"` sur `<main>`

Lien « Aller au contenu » visible au focus, en tête de `layout.tsx`.

- [ ] **Step 2: Audit clavier/sémantique**

Parcourir chaque page au clavier : ordre de focus logique, focus visibles (anneau violet via `:focus-visible`), `aria-label` sur boutons icônes (burger, lightbox, réseaux), landmarks (`header`/`main`/`footer`/`nav`), hiérarchie de titres correcte (un seul `h1` par page), `alt` pertinents sur images de contenu / `alt=""` sur décoratives.

- [ ] **Step 3: Vérifier reduced-motion partout**

Activer `prefers-reduced-motion` et vérifier : Lenis désactivé, loader instantané, curseur natif, animations GSAP/Framer en fallback statique.

- [ ] **Step 4: Contrastes**

Vérifier les textes sur fonds violets et sur fonds clairs (ratio AA). Ajuster opacités/teintes si nécessaire.

- [ ] **Step 5: Build**

Run : `npm run build`

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "a11y: skip-link, focus visibles, aria-labels, reduced-motion"
```

---

### Task 30: Performance & finition (Lighthouse > 95)

**Files:**
- Modify: `next.config.ts`, composants images, imports d'animation

- [ ] **Step 1: Images**

Vérifier que toutes les images de contenu passent par `next/image` avec `sizes` corrects ; `priority` uniquement sur le hero ; `placeholder="blur"` si pertinent ; pas d'images surdimensionnées.

- [ ] **Step 2: Découpage client/serveur**

Confirmer que GSAP/Lenis/curseur ne sont chargés que côté client et n'alourdissent pas les pages où ils sont inutiles. `dynamic(() => import(...), { ssr: false })` pour les décors lourds non critiques si besoin.

- [ ] **Step 3: `next.config.ts`**

Activer optimisations utiles (formats images `image/avif`+`image/webp`, `compress`). Pas de domaines distants (images locales).

- [ ] **Step 4: Build de prod + audit**

Run : `npm run build && npm run start` puis lancer Lighthouse (Chrome) sur `/` et 2-3 pages internes. Viser > 95 en Performance, A11y, Best Practices, SEO. Corriger les points signalés (CLS, LCP, contrastes, labels).

- [ ] **Step 5: Nettoyage**

Run : `npm run lint && npm run typecheck && npm test`
Expected : tout PASS, zéro warning lint bloquant.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "perf: optimisation images/bundles + finition Lighthouse >95"
```

---

### Task 31: README & passation

**Files:**
- Create: `README.md`

- [ ] **Step 1: Écrire `README.md`**

Présentation, stack, commandes (`dev`/`build`/`start`/`test`/`lint`/`typecheck`), **où éditer le contenu** (`src/data/*`), **comment remplacer les images** (`public/images`, manifeste `scripts/fetch-images.md`), liste des contenus `[À CONFIRMER]` à valider par le club, instructions de déploiement statique (Vercel ou export statique).

- [ ] **Step 2: Build final**

Run : `npm run build`
Expected : succès complet.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "docs: README + guide de passation"
```

---

## Self-Review (couverture spec)

- §3 Stack → Tasks 1, 7-10. ✅
- §4 Identité/tokens/typo → Task 3. ✅
- §5 Données (réelles + réalistes), images, modèle → Tasks 4, 5, 6. ✅
- §6 Pages (9) → Tasks 14-18 (accueil), 20 (histoire), 21 (équipes), 22 (sport-santé), 23 (inscriptions), 24 (partenaires), 25 (galerie), 26 (actualités liste+détail), 27 (contact). ✅
- §7 Composants premium (navbar/mega-menu/footer/loader/curseur/scroll-progress/magnétique/tilt/lightbox/accordéon/timeline/compteurs/fonds animés) → Tasks 9-13, 16, 25, 20. ✅
- §8 Animations & thème volley → Tasks 8, 10, 14 + partout. ✅
- §9 Responsive → contrôlé à chaque tâche UI + Task 30. ✅
- §10 SEO → Task 28. ✅
- §11 Perf → Task 30. ✅
- §12 A11y → Task 29. ✅
- §13 Hors périmètre (front-only, pas de DB) → respecté (Task 27 mailto, aucune dépendance DB). ✅
- §14 Structure projet → respectée par les chemins de fichiers. ✅

Aucun placeholder de plan (« TBD/TODO ») ; types cohérents entre tâches (`Team`, `NewsArticle`, `FaqItem`, `ContactValues`, helpers `formatFrDate`/`sortByDateDesc`/`validateContact` définis avant usage).
