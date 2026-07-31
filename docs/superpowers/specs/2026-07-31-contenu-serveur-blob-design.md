# VCM — Contenu partagé côté serveur (Vercel Blob) · Design Spec

**Date :** 2026-07-31
**Projet :** Site officiel du Volley Club Marseillanais (VCM)
**Statut :** Validé pour planification

---

## 1. Problème

L'espace `/admin` enregistre les modifications dans le `localStorage` du navigateur
(`src/content/ContentContext.tsx:94`, clé `vcm_content_v1`). Le `localStorage` est
cloisonné par navigateur et par appareil : une modification faite sur le Mac de
l'administrateur n'existe ni sur un autre ordinateur, ni sur un téléphone, ni même dans
un autre navigateur de la même machine.

Le projet prévoyait une publication **manuelle** — exporter le JSON, le coller dans
`src/content/imported.json`, commiter, redéployer (voir `src/admin/editors/ImportExport.tsx:167`).
Cette étape n'a jamais été effectuée : `src/content/imported.json` contient `{}` (3 octets)
en local comme sur GitHub. Les visiteurs ne voient donc que le contenu par défaut de
`src/data/*.ts`.

## 2. Objectif

Toute modification faite par un administrateur, depuis n'importe quel appareil,
s'applique **immédiatement et pour tout le monde**, sans redéploiement et sans aucune
étape manuelle.

Exigence explicite de l'utilisateur : **aucun stockage local**. La source de vérité doit
être unique et côté serveur.

## 3. Contraintes

- **Hébergement Vercel**, dépôt `TMKlua/vcm` (public), branche `main`, déploiement
  automatique au push.
- **Système de fichiers en lecture seule au runtime** : écrire dans un fichier du projet
  depuis une route API est impossible. Il faut un stockage externe au bundle.
- **Pas de base de données** (contrainte fondatrice du projet, cf.
  `2026-06-08-vcm-site-premium-design.md` §2). Vercel Blob est du stockage de fichiers,
  pas une base : la contrainte est respectée.
- **L'authentification admin reste côté client**, sur décision explicite de
  l'utilisateur après exposition du risque (voir §9).

## 4. Approche retenue

Le contenu vit dans un fichier JSON stocké dans **Vercel Blob**. Les pages sont rendues
côté serveur à partir de ce fichier. L'admin écrit dedans via une route API, qui
invalide ensuite le cache de rendu.

Approches écartées :

- **Commit automatique vers GitHub** — envisagée puis abandonnée : sans couche locale
  pour masquer le délai de rebuild (~2 min), une modification enregistrée semblerait
  disparaître le temps du build. De plus, un build par enregistrement approche vite le
  plafond de déploiements quotidiens du plan Hobby.
- **Base de données Postgres** — disproportionné pour un document JSON unique, et
  contraire à la contrainte §3.

## 5. Architecture

### 5.1 Les deux stores

Le mode d'accès est une propriété **du store**, choisie à sa création et **irréversible**
(cf. documentation Vercel Blob). Il est donc impossible de mélanger blobs privés et
publics dans un même store : le projet en utilise **deux**.

| Store | Accès | Contenu | Justification |
|---|---|---|---|
| `vcm-contenu` | **Private** | `content.json` | Lu côté serveur au rendu, jamais servi tel quel au navigateur. Le mode privé autorise la lecture immédiate via `useCache: false`, qui contourne les jusqu'à 60 s de propagation du cache — condition indispensable à l'exigence « instantané » (§2). |
| `vcm-images` | **Public** | Photos uploadées | Servies directement par le CDN. En privé, elles transiteraient par une Function : latence et coûts d'egress accrus, ce que la documentation déconseille pour des fichiers destinés à l'affichage public. Le nom de fichier dérive du hash du binaire, donc un cache long est sûr par construction. |

Les deux stores sont connectés au même projet Vercel, avec des **préfixes de variables
d'environnement distincts** (Advanced Options à la création) pour éviter toute collision.

### 5.2 Format stocké

Le blob contient une enveloppe, pas le contenu brut :

```ts
interface ContentEnvelope {
  /** Date ISO de la dernière écriture, affichée dans l'admin. */
  updatedAt: string;
  content: SiteContent;
}
```

Si le blob n'existe pas encore (premier démarrage), la lecture renvoie `defaultContent`
sans ETag. Le premier enregistrement le crée.

Le contrôle de concurrence ne repose pas sur un numéro de version stocké mais sur
l'**ETag natif du blob** (§5.5).

### 5.3 Flux

```
Admin (n'importe quel appareil)
      │  « Enregistrer »
      ▼
POST /api/content ──▶ valide le payload
                  ──▶ écrit content.json (put conditionnel sur l'ETag)
                  ──▶ revalidateTag("vcm-content")
                            │
                            ▼
              Rendu serveur relit le contenu
                            │
                            ▼
   ✅ Mac, PC, téléphone : même source, même contenu, tout de suite
```

### 5.4 Chaîne de lecture

```
src/data/*.ts (defaults)  →  deepMerge  →  content.json (Blob)
```

`src/content/imported.json` et sa couche de fusion sont **supprimés** : ils n'ont plus
de rôle une fois le Blob en place, et les conserver créerait une troisième couche de
précédence source de confusion. `deepMerge` et ses tests sont conservés.

### 5.5 Verrou optimiste (écritures conditionnelles natives)

Plusieurs personnes pouvant désormais éditer, on s'appuie sur les **écritures
conditionnelles** de Vercel Blob plutôt que sur un compteur maison :

```ts
const meta = await head("content.json");          // → meta.etag
await put("content.json", json, {
  access: "private",
  allowOverwrite: true,                            // sinon Vercel refuse d'écraser
  ifMatch: meta.etag,                              // échoue si le blob a changé
});
// → BlobPreconditionFailedError si quelqu'un a écrit entre-temps
```

L'ETag chargé par l'admin fait l'aller-retour avec le brouillon. Sur
`BlobPreconditionFailedError`, la route répond `409` et l'admin affiche « le contenu a
été modifié entre-temps, recharge la page ». Aucune écriture n'écrase silencieusement le
travail d'un autre.

`allowOverwrite: true` est requis : par défaut, réécrire un chemin existant lève une
erreur.

### 5.6 Rendu et cache

La lecture du contenu est encapsulée dans une fonction serveur mise en cache, associée
au tag `vcm-content`. Toute écriture appelle `revalidateTag("vcm-content")`. Les pages
restent donc servies depuis le cache (rapides) tout en étant invalidées dès
l'enregistrement.

La primitive exacte (`use cache` + `cacheTag` des Cache Components, ou `unstable_cache`)
sera arrêtée dans le plan d'implémentation, en vérifiant ce que Next.js 16.2.7 expose
réellement dans ce projet — `next.config.ts` n'active aujourd'hui aucun flag de cache.

## 6. Modules

### 6.1 `src/content/store.ts` — accès serveur

```ts
/** Lit l'enveloppe + son ETag. Renvoie les defaults et etag: null si absente. */
function readContent(): Promise<{ content: SiteContent; etag: string | null }>;

/** Écrit le contenu. Échoue si l'ETag ne correspond plus (écriture concurrente). */
function writeContent(
  content: SiteContent,
  expectedEtag: string | null,
): Promise<{ ok: true; etag: string } | { ok: false; reason: "conflict" }>;
```

La lecture utilise `useCache: false` pour obtenir la version la plus récente sans subir
le délai de propagation du cache.

Seul module à connaître `@vercel/blob`. `import "server-only"` pour garantir qu'il ne
puisse jamais être inclus dans un bundle client.

### 6.2 `src/content/validate.ts` — pur, testable

```ts
type ValidationResult =
  | { ok: true; content: SiteContent }
  | { ok: false; error: string };

function validateContent(raw: unknown): ValidationResult;
```

`REQUIRED_KEYS` et `isValidContent` sont déplacés ici depuis `ImportExport.tsx`, puis
ré-importés par celui-ci : client et serveur partagent une règle unique. Contrôles
ajoutés : taille du JSON sérialisé ≤ 2 Mo, et refus de toute valeur `data:` résiduelle
(les images doivent être passées par l'upload, cf. §6.4).

Le plafond de 2 Mo tient compte de la **limite de taille de corps de requête des Vercel
Functions** documentée à 4,5 Mo pour les uploads serveur. Une fois les images sorties du
JSON, le contenu réel se compte en dizaines de kilo-octets : la marge est confortable.

### 6.3 `src/app/api/content/route.ts`

`POST` uniquement. Orchestre validation → écriture → `revalidateTag`. Pas de logique
métier propre : elle assemble `validate.ts` et `store.ts`.

### 6.4 `src/app/api/upload/route.ts`

Reçoit une image, la stocke dans le store **public** sous `images/<hash>.<ext>`, renvoie
son URL.

Le nom de fichier est **calculé côté serveur** à partir du hash du binaire, jamais dérivé
d'une valeur fournie par le client. Contrôles : type MIME dans `{webp, jpeg, png}`,
taille ≤ 2 Mo.

Le hash rend l'upload idempotent : réenvoyer la même image vise le même chemin. Comme
Vercel refuse par défaut d'écraser un blob existant, l'erreur « déjà présent » est traitée
comme un **succès** et l'URL existante est renvoyée — un contenu identique ne peut pas
produire un fichier différent.

Le redimensionnement côté navigateur existant (`src/admin/image.ts`, `fileToImageData`)
est conservé : il réduit le poids avant envoi et garde chaque upload très en deçà des
limites. Son résultat est désormais envoyé comme fichier au lieu d'être stocké en base64.

### 6.5 `src/content/ContentContext.tsx` — simplifié

Toute la logique `localStorage` disparaît : lecture au montage, écriture, écouteur
`storage` inter-onglets, gestion de quota (~60 lignes). Le provider reçoit le contenu
depuis le serveur et l'expose. `src/app/layout.tsx` devient un composant serveur
asynchrone qui appelle `readContent()` et passe le résultat au provider.

Conséquence bénéfique non demandée : le HTML servi contient enfin le contenu réel. Il
est aujourd'hui rendu avec les valeurs par défaut, donc les moteurs de recherche n'ont
jamais indexé les textes édités.

### 6.6 `src/admin/useAdminDraft.tsx` — brouillon en mémoire

Le brouillon vit dans l'état React uniquement. `save()` devient asynchrone : il appelle
`/api/content`, puis rafraîchit le rendu serveur en cas de succès.

Puisqu'il n'y a plus de filet `localStorage`, un `beforeunload` avertit lorsqu'on quitte
la page avec des modifications non enregistrées.

## 7. Confinement des écritures

La route ne peut écrire qu'à deux emplacements, **codés en dur** :

- `content.json` (blob privé)
- `images/<hash>.<ext>` (blobs publics)

Aucun chemin n'est construit à partir d'une valeur fournie par le client. Le pire cas
d'un abus est donc du contenu indésirable, jamais l'écriture de code exécutable.

## 8. Configuration

Deux stores à créer depuis **Storage → Create Database → Blob**, connectés au projet :

| Store | Accès | Préfixe de variables (Advanced Options) |
|---|---|---|
| `vcm-contenu` | **Private** | `CONTENU_` |
| `vcm-images` | **Public** | `IMAGES_` |

Vercel provisionne alors, par store et par préfixe, `…BLOB_STORE_ID` et
`…BLOB_READ_WRITE_TOKEN`. L'authentification par défaut des stores connectés repose sur
OIDC (`VERCEL_OIDC_TOKEN`, à rotation automatique) ; le token statique sert de repli hors
Vercel. Aucune de ces variables n'est exposée au navigateur.

Le mode d'accès étant **définitif**, il doit être choisi correctement à la création : un
store créé en Public ne pourra pas servir de stockage privé pour `content.json`.

Développement local : cocher aussi l'environnement **Development** à la création, puis
`vercel env pull .env.local`. Sans ces variables, les routes échouent avec un message
explicite (§10).

## 9. Risque de sécurité accepté

Le mot de passe admin est une constante du bundle JavaScript public
(`src/admin/config.ts:15`), dans un dépôt lui-même public. L'utilisateur a choisi
explicitement de conserver ce fonctionnement après exposition du risque.

**Conséquence, aggravée par la suppression du stockage local :** toute personne lisant
le bundle peut modifier le contenu du site pour tous les visiteurs, instantanément, et
l'utilisateur a également écarté l'archivage des versions (§12) — il n'existe donc
aucun moyen de restauration automatique. En cas d'effacement, la reconstruction se fait
manuellement, ou depuis un export JSON réalisé via l'onglet Import/Export.

**Atténuations retenues** (sans remettre en cause la décision) :

- La route exige le même mot de passe dans un en-tête : protection identique à
  l'existant, pas inférieure.
- Confinement strict des chemins d'écriture (§7).
- Validation de structure et plafonds de taille (§6.2, §6.4).
- La lecture du mot de passe est centralisée pour qu'un basculement vers un secret
  serveur soit un changement d'une seule ligne.

Ce risque, et la recommandation d'exporter régulièrement le contenu, sont documentés
dans le `README.md`.

## 10. Gestion d'erreurs

| Cas | Comportement |
|---|---|
| Variables Blob absentes | Lecture : repli sur `defaultContent`, le site reste debout. Écriture : 500 avec message explicite (« stockage non configuré »). |
| Blob inexistant (premier lancement) | `readContent()` renvoie les defaults avec `etag: null`, sans erreur. |
| JSON du blob corrompu | Repli sur `defaultContent` + log serveur. Le site ne tombe jamais à cause du contenu. |
| `BlobPreconditionFailedError` (écriture concurrente) | `409`, message « contenu modifié entre-temps ». Le brouillon en cours reste à l'écran. |
| Image déjà présente au même hash | Traité comme un succès, l'URL existante est renvoyée (§6.4). |
| Payload invalide | `400` avec le motif précis. |
| Échec réseau à l'enregistrement | Message d'erreur, brouillon conservé en mémoire, aucune perte tant que l'onglet reste ouvert. |

Principe invariant : **une erreur de contenu ne doit jamais rendre le site indisponible.**

## 11. Tests

Tests unitaires (vitest, déjà configuré) sur les fonctions pures :

- `validate` : rejet des clés manquantes, dépassement de taille, présence de `data:`
  résiduel ; acceptation d'un payload conforme.
- Nommage des images : déterminisme du hash, extension dérivée du MIME validé.
- `store.ts` avec client Blob simulé : repli sur les defaults quand le blob est absent
  ou corrompu, propagation de l'ETag, conversion de `BlobPreconditionFailedError` en
  `{ ok: false, reason: "conflict" }`.
- Routes API avec client Blob simulé : `409` sur conflit, `400` sur payload invalide,
  succès idempotent sur réenvoi d'une image déjà présente.

Les tests existants (`merge.test.ts`, `data.test.ts`, `validation.test.ts`,
`counter.test.ts`, `date.test.ts`) doivent rester verts.

## 12. Hors périmètre

- **Archivage et restauration des versions** — proposé, écarté par l'utilisateur pour
  rester simple. Conséquence assumée : aucun retour arrière automatique (cf. §9).
- Comptes utilisateurs distincts et traçabilité par éditeur.
- Prévisualisation d'un brouillon avant mise en ligne.
- Suppression automatique des images devenues orphelines dans le Blob.
- Migration du contenu déjà présent dans le `localStorage` de l'administrateur : à
  transférer une fois via Import/Export, puis enregistrer.

## 13. Workflow de développement

Le dossier local était un ZIP téléchargé, sans historique git. Il a été converti en clone
du dépôt (`git init` + `git reset origin/main`, sans modification des fichiers ; copie
locale vérifiée identique à `main`). Faire `git pull` avant chaque session.
