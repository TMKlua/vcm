# Prompt Claude Code : Boutique en ligne du VCM

> À coller tel quel dans Claude Code, à la racine du dépôt `vcm`.

---

## Rôle et cadre

Tu es lead front-end et designer produit sur le site du **Volley Club Marseillanais (VCM)** (Marseillan, Hérault, étang de Thau, fondé en 1992, environ 150 licenciés : baby volley, jeunes, loisir, compétition, beach volley, sport santé). Le site est en Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, framer-motion, Lenis et lucide-react. Le contenu est éditable depuis `/admin` et stocké dans Vercel Blob.

Ta mission : **ajouter un onglet « Boutique »**, une vraie boutique en ligne pour le club. Elle doit être spectaculaire et animée, tout en restant cohérente avec le design existant. Cette première itération est un **aperçu front**. Le paiement passera plus tard par **HelloAsso**. Pour l'instant, le bouton de paiement affiche un aperçu et ne débite rien.

### Règles absolues

1. **Local uniquement.** Pas de `git push`, pas de `vercel deploy`, pas de commit sauf demande explicite. Aucune écriture dans le blob de contenu (aucun POST sur `/api/content`).
2. **Ne rien casser.** Ne renomme ni ne supprime aucune clé existante de `SiteContent`, car le contenu publié est fusionné par-dessus les valeurs par défaut et un renommage efface des saisies réelles. N'ajoute que des clés **optionnelles**. Les pages existantes ne doivent pas changer, à l'exception de l'ajout du lien de navigation.
3. **Aucune dépendance nouvelle.** framer-motion, lucide-react et Tailwind suffisent.
4. Lis le code existant avant d'écrire, et imite-le : commentaires en français, même densité, mêmes composants (`PageHero`, `Section`, `Reveal`, `StaggerGroup` / `StaggerItem`, `TiltCard`, `MagneticButton`, `Marquee`, `AnimatedGradient`, `CourtLines`, `BrandLogo`) et mêmes tokens (`ink`, `night`, `violet-700`, `violet-500`, `magenta`, `fuchsia-vcm`, `lilac`, `encre`). Les titres sont en Anton majuscules (`font-display`), le texte en Inter, et le kicker suit le motif « trait dégradé + petites capitales fuchsia tracking 0.25em ».
5. **Accessibilité** : navigation clavier complète, focus visibles (`ring-fuchsia-vcm/70`), `aria-live` pour le panier, `prefers-reduced-motion` respecté partout avec `useReducedMotion`, contrastes AA, et cibles tactiles d'au moins 44 px.
6. Lenis gère le scroll. Tout panneau défilant (tiroir panier, modale) porte `data-lenis-prevent`.
7. À la fin, `npm run typecheck`, `npm run lint` et `npm test` doivent passer. Vérifie ensuite chaque page dans le navigateur, en desktop (1440 px) et en mobile (390 px).

---

## Ce qu'il faut savoir pour le catalogue

Recherche faite sur les clubs français :
- **Chaumont VB 52** vend une vingtaine d'articles en trois rayons : Sportswear, Lifestyle, Goodies. Maillot 50 à 70 €, sweats 50 à 60 €, goodies de 2 à 12 €.
- **Narbonne Volley** a un gros rayon famille et bébé (peluches, bodies, bavoirs) et offre la livraison dès 40 €.
- **Arago de Sète**, le voisin, se limite au maillot et au short. Il y a donc une place à prendre sur le lifestyle et le beach.
- Les clubs amateurs sur HelloAsso vendent avant tout des **sweats à capuche (30 à 40 €)**. Le retrait se fait au gymnase, le flocage est en option payante (+3 € le numéro, +5 € le nom) et les commandes sont souvent groupées.

**Catalogue à créer** (dans `src/data/shop.ts`, typé, prix TTC) :

| Rayon | Articles |
|---|---|
| Textile | Sweat à capuche (38 €, best-seller, flocage +5 €), T-shirt Club (15 €), Veste zippée Staff (45 €), Short d'entraînement (20 €), Chaussettes (8 €) |
| Beach | Débardeur Beach (18 €), Bob Étang de Thau (15 €, édition limitée), Serviette microfibre (22 €) |
| Supporter | Casquette (15 €), Porte-clés crabe (5 €), Stickers (4 €). Écharpe et ballon dès que le club aura des photos sans marque tierce |
| Au quotidien | Mug (10 €), Gourde isotherme (18 €), Tote bag (10 €), Carte cadeau (25, 50 ou 75 €) |
| Packs | Licencié : sweat + t-shirt + gourde (60 € au lieu de 71 €). Supporter : casquette + mug + porte-clés (26 € au lieu de 30 €). Beach : débardeur + bob + serviette (46 € au lieu de 55 €) |

Palette produits dérivée du logo (crabe + joueuse, aquarelle lilas) : violet nuit `#2a1258`, violet `#7c3aed`, fuchsia `#c026d3`, lilas `#c4b5fd`, blanc `#f5f3ff`, noir `#16131f`, sable `#e9dcc4`, bleu étang `#1f6f8b`, corail crabe `#ff6b5a`. Chaque couleur porte un accent et une couleur d'encre lisible.

Tailles : de 6 ans au XXL pour le textile, pointures pour les chaussettes, taille unique pour la casquette.

---

## Visuels produits : photos réalistes, pas de dessins

Le rendu doit ressembler à une vraie boutique en ligne. Les **photos produits sont photoréalistes** : de vrais vêtements et objets, photographiés en studio ou portés, avec **le vrai logo du club imprimé dessus**.

Il n'y a pas encore de shooting. On part donc de **photos libres de droits** (licence Unsplash, usage commercial autorisé) de vêtements et d'objets **vierges**, choisies pour leur cadrage e-commerce (fond studio uni ou mannequin sur fond neutre, sans marque visible). Un script Node local, `scripts/boutique/mockups.mjs` (avec `sharp`), fabrique les visuels :

1. **Détourage** de l'article. On utilise des masques `rembg` (modèle open source `isnet-general-use`, lancé en local via `uv`, sans dépendance ajoutée au projet). Sur les photos portées, on les croise avec un filtre de chroma et de luminosité pour exclure la peau, les cheveux et le jean.
2. **Recoloration** dans les couleurs du club : la luminance d'origine module la couleur cible, ce qui garde plis, ombres et reflets.
3. **Impression du logo** (`content.club.logo`) :
   - mode « encre » (multiplication) sur tissu clair ;
   - mode « écusson » sur tissu foncé ;
   - déformation par les plis (gradient de luminance), ombrage par l'éclairage de la photo, déformation cylindrique sur le mug et la gourde ;
   - les marques existantes sont effacées par clonage.
4. **Exports** :
   - photos carrées en WebP dans `public/images/boutique/<slug>--<couleur>[--dos|--porte|--cintre].webp` ;
   - versions **détourées** (fond transparent) pour les articles qui flottent dans le hero ;
   - une vue **de dos** pour les articles floquables, sur laquelle le nom et le numéro s'incrustent en direct (SVG, encre en `multiply`).

Chaque couleur d'un produit porte `photo`, `back` et `alt`. La seconde photo s'affiche en fondu au survol de la carte, comme sur les sites e-commerce. Les packs sont un montage des photos de leurs articles. Le dessin vectoriel (`ProductArt`) ne sert plus que de repli. Le jour du vrai shooting, on remplace simplement les fichiers WebP.

On écarte toute photo qui porte la marque d'un tiers (un ballon Wilson, l'écharpe d'un autre club…), plutôt que de la vendre sous le nom du VCM.

## Pages et fonctionnalités

### `/boutique` : le catalogue
1. **Hero boutique sur mesure**, pas le `PageHero` standard : fil d'Ariane, kicker « Boutique officielle », titre géant « PORTEZ LE VCM » révélé mot à mot, sous-titre et deux CTA (« Voir la collection », « Les packs »). À droite, **3 articles phares qui flottent** en lévitation douce, avec un léger parallaxe à la souris (désactivé en mouvement réduit) et un halo dégradé derrière. Une bande de réassurance : paiement sécurisé HelloAsso, retrait gratuit au gymnase, 100 % des bénéfices au club.
2. **Marquee** : « Boutique officielle · Depuis 1992 · Étang de Thau · Allez le VCM ».
3. **Barre de filtres collante** : chips par rayon avec pastille animée (`layoutId`), compteur d'articles et tri (mis en avant, prix croissant, prix décroissant).
4. **Grille produits** (2 colonnes en mobile, 3 en tablette, 4 en desktop) animée avec `AnimatePresence` + `layout` quand on filtre. Chaque **carte** a :
   - un fond dégradé teinté par la couleur active et un `TiltCard` 3D au survol ;
   - un badge (Best-seller, Nouveau, Édition limitée, Pack) ;
   - des pastilles couleur qui repeignent la maquette avec un fondu ;
   - un bouton « Ajout rapide » qui monte au survol (toujours visible au tactile), ou qui ouvre la fiche si une taille est requise ;
   - le prix, le prix barré pour les packs, et la mention « Flocage dispo ».
5. **Section « Collection Été / Beach »** : bandeau immersif bleu étang et sable, l'article vedette en grand et un CTA.
6. **Section Packs** : 3 grandes cartes avec l'économie mise en avant.
7. **Comment ça marche** en 3 étapes animées : je commande sur le site → je paie en sécurité sur HelloAsso → je récupère au gymnase ou à l'entraînement.
8. **Bloc confiance** : « Chaque achat finance les équipes, les déplacements et le matériel du club ».

### `/boutique/[slug]` : la fiche produit
- Grande scène à gauche : maquette sur fond dégradé animé et bascule **Face / Dos** avec une rotation 3D (`rotateY`) quand l'article se floque.
- À droite : badge, nom, prix animé (il change quand on active le flocage), description, **sélecteur de couleur** (pastilles + nom), **sélecteur de taille** (grille de boutons et lien « Guide des tailles » dans une modale), **flocage** (interrupteur, puis champs nom (12 caractères maximum) et numéro (0 à 99) ; la vue bascule seule sur le dos et l'aperçu se met à jour pendant la saisie), **quantité** et **« Ajouter au panier »**. Au clic, une vignette de l'article **vole jusqu'au bouton panier**, qui rebondit, puis le tiroir s'ouvre.
- Accordéons : détails, entretien, retrait et livraison.
- Contenu des packs listé.
- « Vous aimerez aussi » : 4 articles du même rayon.
- `generateStaticParams` n'est pas nécessaire (le site est en `force-dynamic`), mais un `notFound()` est requis pour un slug inconnu.

### Panier (toutes les pages `/boutique/*`)
- `CartProvider` dans `src/app/(site)/boutique/layout.tsx`, persistance `localStorage` (lecture après montage, try/catch). Une ligne = produit + couleur + taille + flocage.
- **Bouton panier flottant** en bas à droite : pastille de compteur et animation de rebond à chaque ajout.
- **Tiroir latéral** (`AnimatePresence`, overlay flouté, piège de focus, Échap pour fermer, `role="dialog"`, `aria-modal`) : lignes avec mini-maquette, quantités +/−, suppression, sous-total, barre de progression « encore X € pour le cadeau stickers offert » dès 40 €, et CTA « Commander ».

### `/boutique/commande` : le récapitulatif
- Stepper : Panier → Coordonnées → Paiement.
- Formulaire : prénom, nom, e-mail, téléphone, « je suis licencié(e) » (et alors équipe et nom de l'enfant), validation en ligne.
- Mode de remise : retrait au gymnase (gratuit), remise à l'entraînement (gratuit), Colissimo (6,90 €).
- **Arrondi solidaire** facultatif : un don de 1, 2 ou 5 € au club (HelloAsso gère `containsDonation`).
- Récapitulatif collant : lignes, sous-total, livraison, don, total.
- Bouton **« Payer avec HelloAsso »** aux couleurs HelloAsso : si `HELLOASSO.organizationSlug` est vide, il ouvre une **modale d'aperçu** qui explique la redirection vers HelloAsso et montre le récapitulatif envoyé. Pas de redirection, pas d'appel réseau.

### Navigation et SEO
- Ajouter `{ key: "boutique", label: "Boutique", href: "/boutique" }` dans `src/data/nav.ts`, entre Partenaires et Inscriptions. Ajouter `boutique?: string` dans `NavLabels` et la clé `boutique?: SeoPageMeta` dans `SeoSettings.pages`. Les deux sont optionnelles, aucun défaut n'est requis.
- Ajouter l'entrée « Boutique » dans l'éditeur de libellés de navigation de `/admin` (`TextEditor`).
- **Ne pas** ajouter `/boutique` au sitemap tant que la boutique est en aperçu, et mettre `robots: { index: false }` sur ces pages.

---

## Animations : le niveau attendu

- Transitions avec l'easing maison `[0.16, 1, 0.3, 1]`, apparitions avec `Reveal` et `StaggerGroup`.
- Hero : lévitation (`y` en boucle, déphasée par article), parallaxe souris par ressort (`useSpring`), halo qui respire.
- Cartes : tilt 3D, maquette qui grossit légèrement et monte au survol, reflet qui balaie la carte, fondu croisé au changement de couleur.
- Filtres : pastille partagée `layoutId`, réorganisation de la grille avec `layout`.
- Ajout au panier : vignette qui vole jusqu'au bouton (position calculée avec `getBoundingClientRect`), rebond du compteur, confettis aux couleurs du club au premier ajout (DOM léger, sans librairie).
- Fiche : bascule face/dos en 3D, prix animé, chiffres du flocage qui apparaissent lettre à lettre.
- Tout ceci est désactivé ou réduit à un fondu quand `prefers-reduced-motion` est actif.

---

## Ensuite : HelloAsso (prochaine itération, à ne pas faire maintenant)

Deux options, à présenter au club :
1. **Simple** : chaque produit, ou le panier, renvoie vers un **formulaire Boutique HelloAsso**. HelloAsso gère alors le stock, les tailles (un tarif par taille), les champs personnalisés pour le flocage, le retrait et les reçus. Le club fournit `organizationSlug` et `formSlug`.
2. **Intégré** : le panier du site, puis l'**API Checkout v5**.
   - Une route serveur `POST /api/boutique/checkout` obtient un token (`POST https://api.helloasso.com/oauth2/token`, `grant_type=client_credentials`) puis appelle `POST /v5/organizations/{organizationSlug}/checkout-intents` avec `totalAmount` et `initialAmount` (en centimes), `itemName`, `backUrl`, `errorUrl`, `returnUrl`, `containsDonation`, `payer`, et `metadata` (le contenu du panier).
   - Elle redirige ensuite vers `redirectUrl`, valable 15 minutes.
   - La commande est validée par **webhook** (eventType `Order`/`Payment`), ou par `GET …/checkout-intents/{id}`, jamais par les paramètres de `returnUrl`.
   - Le club fournit `clientId` et `clientSecret`, stockés côté serveur dans les variables d'environnement Vercel, ainsi qu'un compte sandbox (`api.helloasso-sandbox.com`).

---

## Livrable et vérification

1. Lance `npm run dev -- -p <port libre>` et ouvre `/boutique`, une fiche avec flocage, le panier et `/boutique/commande`. Fais des captures en desktop et en mobile.
2. `npm run typecheck && npm run lint && npm test`.
3. Termine par un récapitulatif : fichiers créés et modifiés, choix de design, ce qui est maquette et ce qui est fonctionnel, et la liste de ce que le club doit fournir (photos produits, prix validés, accès HelloAsso).
