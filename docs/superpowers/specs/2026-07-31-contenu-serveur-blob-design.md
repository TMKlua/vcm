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

### 5.1 Les deux stockages

| Donnée | Type de blob | Justification |
|---|---|---|
| `content.json` | **privé**, lu côté serveur via le SDK | Jamais servi tel quel au navigateur. La lecture passe par l'origine, pas par le CDN : aucun risque de servir une version périmée, ce qui est le point critique de l'exigence « instantané ». |
| Images uploadées | **publiques**, cache CDN long | Servies directement aux navigateurs. Le nom de fichier dérive du hash du contenu binaire : une image différente a forcément une URL différente, donc un cache long est sûr par construction. |

### 5.2 Format stocké

Le blob contient une enveloppe, pas le contenu brut :

```ts
interface ContentEnvelope {
  /** Incrémenté à chaque écriture. Base du verrou optimiste (§5.5). */
  version: number;
  /** Date ISO de la dernière écriture, affichée dans l'admin. */
  updatedAt: string;
  content: SiteContent;
}
```

Si le blob n'existe pas encore (premier démarrage), la lecture renvoie
`{ version: 0, content: defaultContent }`. Le premier enregistrement le crée.

### 5.3 Flux

```
Admin (n'importe quel appareil)
      │  « Enregistrer »
      ▼
POST /api/content ──▶ valide + vérifie la version
                  ──▶ écrit content.json dans le Blob (version + 1)
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

### 5.5 Verrou optimiste

Plusieurs personnes pouvant désormais éditer, l'admin renvoie la `version` qu'il a
chargée. Si elle ne correspond plus à celle du blob, le serveur répond `409` et l'admin
affiche « le contenu a été modifié entre-temps, recharge la page ». Aucune écriture
n'écrase silencieusement le travail d'un autre.

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
/** Lit l'enveloppe depuis le Blob. Renvoie les defaults si absente. */
function readContent(): Promise<ContentEnvelope>;

/** Écrit une nouvelle version. Rejette si expectedVersion ne correspond plus. */
function writeContent(
  content: SiteContent,
  expectedVersion: number,
): Promise<{ ok: true; version: number } | { ok: false; reason: "conflict" }>;
```

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
ajoutés : taille du JSON sérialisé ≤ 4 Mo, et refus de toute valeur `data:` résiduelle
(les images doivent être passées par l'upload, cf. §6.4).

### 6.3 `src/app/api/content/route.ts`

`POST` uniquement. Orchestre validation → écriture → `revalidateTag`. Pas de logique
métier propre : elle assemble `validate.ts` et `store.ts`.

### 6.4 `src/app/api/upload/route.ts`

Reçoit une image, la stocke en blob public sous `images/<hash>.<ext>`, renvoie son URL.

Le nom de fichier est **calculé côté serveur** à partir du hash du binaire, jamais
dérivé d'une valeur fournie par le client. Contrôles : type MIME dans
`{webp, jpeg, png}`, taille ≤ 2 Mo. Le redimensionnement côté navigateur existant
(`src/admin/image.ts`, `fileToImageData`) est conservé — il réduit le poids avant envoi —
mais son résultat est désormais envoyé comme fichier au lieu d'être stocké en base64.

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

| Variable | Emplacement | Rôle |
|---|---|---|
| `BLOB_READ_WRITE_TOKEN` | Provisionnée automatiquement par Vercel à la création du store Blob | Accès lecture/écriture au Blob. Jamais exposée au navigateur. |

Développement local : `vercel env pull .env.local` après création du store, sinon les
routes échouent avec un message explicite (§10).

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
| `BLOB_READ_WRITE_TOKEN` absent | Lecture : repli sur `defaultContent`, le site reste debout. Écriture : 500 avec message explicite (« stockage non configuré »). |
| Blob inexistant (premier lancement) | `readContent()` renvoie les defaults en version 0, sans erreur. |
| JSON du blob corrompu | Repli sur `defaultContent` + log serveur. Le site ne tombe jamais à cause du contenu. |
| Conflit de version | `409`, message « contenu modifié entre-temps ». Le brouillon en cours reste à l'écran. |
| Payload invalide | `400` avec le motif précis. |
| Échec réseau à l'enregistrement | Message d'erreur, brouillon conservé en mémoire, aucune perte tant que l'onglet reste ouvert. |

Principe invariant : **une erreur de contenu ne doit jamais rendre le site indisponible.**

## 11. Tests

Tests unitaires (vitest, déjà configuré) sur les fonctions pures :

- `validate` : rejet des clés manquantes, dépassement de taille, présence de `data:`
  résiduel ; acceptation d'un payload conforme.
- Enveloppe : incrémentation de version, détection de conflit, repli defaults quand le
  blob est absent ou corrompu.
- Nommage des images : déterminisme du hash, extension dérivée du MIME validé.
- `store.ts` et les routes API : testés avec le client Blob simulé.

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
