# VCM — Publication du contenu depuis l'admin · Design Spec

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
`src/content/imported.json`, commiter, redéployer (voir le panneau « Comment publier
pour tout le monde ? » dans `src/admin/editors/ImportExport.tsx:167`). Cette étape n'a
jamais été effectuée : `src/content/imported.json` contient `{}` (3 octets) en local
comme sur GitHub. Les visiteurs ne voient donc que le contenu par défaut de
`src/data/*.ts`.

**Objectif :** rendre les modifications de textes **et d'images** visibles par tous les
visiteurs, sur tous les appareils, sans intervention manuelle dans le code.

## 2. Contraintes retenues

- **Aucune base de données**, conformément à la contrainte fondatrice du projet
  (`2026-06-08-vcm-site-premium-design.md`, §2). Le contenu reste du JSON versionné
  dans le dépôt.
- **Hébergement Vercel**, dépôt `TMKlua/vcm` (public), branche par défaut `main`,
  déploiement automatique au push.
- **Le système de fichiers est en lecture seule au runtime** sur Vercel : écrire
  directement dans un fichier du projet depuis une route API est impossible. La
  persistance passe donc par un commit sur le dépôt.
- **L'authentification admin reste côté client**, sur décision explicite de
  l'utilisateur, après exposition du risque (voir §8).

## 3. Approche retenue

Automatiser la publication manuelle : l'admin envoie son brouillon à une route API qui
commite `src/content/imported.json` et les nouvelles images sur `main` via l'API GitHub.
Vercel détecte le push et redéploie.

Approches écartées :

- **Vercel Blob** — publication instantanée sans rebuild, mais sort le contenu du dépôt
  versionné.
- **Base de données Postgres** — disproportionné pour un document JSON unique, et
  contraire à la contrainte §2.

## 4. Architecture

### 4.1 Ce qui ne change pas

La chaîne de lecture reste strictement identique :

```
src/data/*.ts (defaults) → src/content/imported.json → localStorage
                        deepMerge, ordre de précédence inchangé
```

`ContentContext`, `deepMerge`, `useAdminDraft` et toutes les vues publiques ne sont pas
modifiés. Le `localStorage` conserve son rôle actuel : **brouillon local**.

Parmi les 11 éditeurs, un seul est touché : `ImportExport.tsx`, dont la constante
`REQUIRED_KEYS` et le prédicat `isValidContent` sont déplacés vers `src/publish/validate.ts`
puis ré-importés, afin que le client et le serveur partagent la même règle de validation
(source unique de vérité). Aucun changement de comportement pour ce module. Le texte
« Comment publier pour tout le monde ? » y est réécrit pour décrire le nouveau flux
automatique au lieu de la procédure manuelle.

### 4.2 Ce qui est ajouté

Un bouton « Publier en ligne » dans l'en-tête de `/admin`, distinct d'« Enregistrer ».

| Action | Portée | Effet |
|---|---|---|
| **Enregistrer** | `localStorage` | Instantané, visible par l'administrateur seul. Brouillon. |
| **Publier en ligne** | Dépôt GitHub | Commit + rebuild Vercel (~1-2 min), visible par tous. |

La séparation est délibérée : elle permet de travailler par étapes sans déclencher un
build à chaque frappe.

**Ce qui est publié :** le brouillon courant (`draft`), pas le dernier état enregistré.
« Publier » enregistre d'abord localement puis envoie, de sorte que ce qui part en ligne
est exactement ce que l'administrateur voit à l'écran.

**Après publication, le `localStorage` n'est pas vidé.** Son contenu est alors identique
à ce qui vient d'être publié, l'affichage est donc cohérent. La couche locale garde
toutefois la priorité sur `imported.json` : si une publication est faite plus tard depuis
un autre poste, cet administrateur devra utiliser « Réinitialiser » pour revoir la version
en ligne. C'est acceptable pour un club à un seul éditeur, et documenté dans le README.

### 4.3 Flux de publication

```
Admin (navigateur)                 /api/publish (serveur Vercel)
      │
      │ POST { content }
      ├──────────────────────────▶ 1. Valider la structure et la taille
      │                            2. Extraire les images `data:image/…`
      │                            3. Créer un blob git par image nouvelle
      │                            4. Réécrire les data URLs en chemins
      │                            5. Sérialiser imported.json
      │                            6. Créer UN commit atomique sur main
      │ ◀──────────────────────────   { commitSha, imagesAdded }
      │
      ▼                                        │
  « Publié ✓ — en ligne dans ~2 min »          ▼
                                     Vercel rebuild → tous les visiteurs
```

## 5. Modules

### 5.1 `src/publish/extract-images.ts` (pur, testable)

Parcourt récursivement l'arbre de contenu et isole les images inline.

```ts
interface ExtractedImage {
  /** Nom de fichier déterministe : <sha256(payload) tronqué>.<ext> */
  filename: string;
  /** Chemin public final, ex. "/images/uploads/a3f9c2d1.webp" */
  publicPath: string;
  /** Payload binaire décodé, prêt à devenir un blob git. */
  bytes: Uint8Array;
}

interface ExtractResult {
  /** Copie du contenu où chaque data URL est remplacée par son publicPath. */
  content: SiteContent;
  /** Une entrée par image distincte rencontrée (dédupliquée par hash). */
  images: ExtractedImage[];
}

function extractImages(content: SiteContent): ExtractResult;
```

Le nom de fichier dérive du **hash du contenu binaire**, jamais d'une entrée
utilisateur : republier la même image ne crée pas de doublon et le dépôt ne gonfle pas.

### 5.2 `src/publish/validate.ts` (pur, testable)

```ts
type ValidationResult =
  | { ok: true; content: SiteContent }
  | { ok: false; error: string };

function validatePayload(raw: unknown): ValidationResult;
```

Contrôles : présence des 10 clés de `REQUIRED_KEYS` (la constante est extraite de
`ImportExport.tsx` vers ce module et réutilisée des deux côtés, source unique de vérité),
taille du payload sérialisé ≤ 8 Mo, nombre d'images ≤ 60, taille par image ≤ 2 Mo, type
MIME dans `{webp, jpeg, png}`.

### 5.3 `src/publish/github.ts`

Client minimal de l'API Git Data, isolé derrière une interface pour permettre le test
par simulation.

```ts
interface GitHubClient {
  getRef(branch: string): Promise<{ sha: string }>;
  createBlob(bytes: Uint8Array): Promise<{ sha: string }>;
  createTree(baseTreeSha: string, entries: TreeEntry[]): Promise<{ sha: string }>;
  createCommit(message: string, treeSha: string, parentSha: string): Promise<{ sha: string }>;
  updateRef(branch: string, commitSha: string): Promise<void>;
}
```

Séquence blobs → tree → commit → updateRef, afin d'obtenir **un seul commit** pour le
JSON et toutes les images. L'API Contents (un commit par fichier) est écartée : elle
déclencherait autant de builds que de fichiers.

### 5.4 `src/app/api/publish/route.ts`

Route POST. Orchestre validation → extraction → commit. Ne contient pas de logique
métier testable en propre : elle assemble les trois modules ci-dessus.

### 5.5 `src/admin/PublishButton.tsx`

Bouton + états (`idle` / `publishing` / `success` / `error`), message de résultat avec le
SHA du commit et le délai attendu.

## 6. Chemins d'écriture (confinement)

La route ne peut écrire qu'à deux emplacements, **codés en dur** :

- `src/content/imported.json`
- `public/images/uploads/<hash>.<ext>`

Aucun chemin n'est dérivé d'une valeur fournie par le client. Le nom de fichier des
images provient d'un hash calculé côté serveur. Le pire cas d'un abus est donc du
contenu indésirable sur le site, jamais l'écriture de code exécutable.

## 7. Configuration

| Variable | Emplacement | Rôle |
|---|---|---|
| `GITHUB_TOKEN` | Variables d'environnement Vercel (Production) | PAT *fine-grained*, limité au seul dépôt `TMKlua/vcm`, permission `Contents: read & write`. Jamais exposé au navigateur. |
| `GITHUB_REPO` | idem, valeur `TMKlua/vcm` | Cible du commit. |
| `GITHUB_BRANCH` | idem, valeur `main` | Branche de publication. |

## 8. Risque de sécurité accepté

Le mot de passe admin est une constante du bundle JavaScript public
(`src/admin/config.ts:15`), dans un dépôt lui-même public. L'utilisateur a choisi
explicitement de conserver ce fonctionnement après exposition du risque.

**Conséquence :** toute personne lisant le bundle peut appeler `/api/publish` et modifier
le contenu du site ou déclencher des builds.

**Atténuations mises en place** (sans changer la décision) :

- La route exige le même mot de passe dans un en-tête : le niveau de protection est
  identique à l'existant, pas inférieur.
- Confinement strict des chemins d'écriture (§6).
- Validation de structure et plafonds de taille (§5.2).
- La lecture du token est centralisée pour qu'un basculement ultérieur vers un secret
  serveur (`ADMIN_PASSWORD` en variable d'environnement) soit un changement d'une seule
  ligne.

Ce risque est documenté dans le `README.md`.

## 9. Gestion d'erreurs

| Cas | Comportement |
|---|---|
| `GITHUB_TOKEN` absent ou invalide | 500 + message explicite (« publication non configurée »), aucun crash. |
| Le ref `main` a bougé entre lecture et écriture | Relecture du ref et **une** nouvelle tentative, puis échec explicite. |
| Payload invalide | 400 avec le motif précis du rejet. |
| Échec réseau GitHub | Message d'erreur, **le brouillon `localStorage` reste intact**. |

Principe invariant : **aucun échec de publication n'efface le travail local**.

## 10. Tests

Tests unitaires (vitest, déjà configuré) sur les modules purs :

- `extract-images` : détection des data URLs à toute profondeur, déduplication par hash,
  déterminisme du nom de fichier, réécriture correcte des chemins, contenu sans image
  laissé inchangé.
- `validate` : rejet des clés manquantes, dépassements de taille, types MIME non
  autorisés ; acceptation d'un payload conforme.
- `github` : séquence d'appels correcte via client simulé, comportement de retry sur
  conflit de ref.

Les tests existants (`merge.test.ts`, `data.test.ts`, `validation.test.ts`) doivent rester
verts.

## 11. Workflow de développement

Le dossier local était un ZIP téléchargé, sans historique git : ré-uploader le dossier
aurait écrasé le `imported.json` publié par un `{}` obsolète. Le dossier a été converti en
clone du dépôt (`git init` + `git reset origin/main`, sans modification des fichiers ;
copie locale vérifiée identique à `main`).

**Règle :** faire `git pull` avant toute session de développement, pour récupérer les
publications faites depuis `/admin`.

## 12. Hors périmètre

- Historique/restauration de versions de contenu depuis l'admin (l'historique git le
  fournit déjà côté dépôt).
- Comptes utilisateurs distincts et traçabilité par éditeur.
- Prévisualisation d'un brouillon par une autre personne avant publication.
- Suppression automatique des images devenues orphelines dans `public/images/uploads/`.
