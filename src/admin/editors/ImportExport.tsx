"use client";

import { useRef, useState } from "react";
import { Download, Upload, RotateCcw } from "lucide-react";
import { isValidContent } from "@/content/validate";
import { useAdminDraft } from "../useAdminDraft";
import { Button, Card, SectionTitle } from "../ui";

export default function ImportExport({
  onToast,
}: {
  onToast: (message: string, type?: "success" | "error") => void;
}) {
  const { draft, saveObject, resetAll } = useAdminDraft();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  function handleExport() {
    if (!draft) return;
    const json = JSON.stringify(draft, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Date string computed here (in the event handler), never at module scope.
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    const a = document.createElement("a");
    a.href = url;
    a.download = `vcm-contenu-${yyyy}-${mm}-${dd}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    onToast("Contenu exporté.");
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!isValidContent(parsed)) {
          throw new Error(
            "Le fichier ne contient pas toutes les sections attendues.",
          );
        }
        // Atomically load the imported object into the draft AND publish it,
        // so we never save a stale closure copy of the previous draft.
        const result = await saveObject(parsed);
        if (result.ok) {
          onToast("Contenu importé et publié pour tout le monde.");
        } else {
          setImportError(result.error);
          onToast(result.error, "error");
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Fichier JSON invalide.";
        setImportError(msg);
        onToast("Import impossible.", "error");
      }
    };
    reader.onerror = () => {
      setImportError("Impossible de lire le fichier.");
      onToast("Import impossible.", "error");
    };
    reader.readAsText(file);

    // Reset so re-selecting the same file fires the change event again.
    e.target.value = "";
  }

  function handleReset() {
    const ok = window.confirm(
      "Charger le contenu d'usine dans l'éditeur ? Rien ne change en ligne tant que vous n'avez pas cliqué sur « Publier ».",
    );
    if (ok) {
      resetAll();
      onToast("Contenu d'usine chargé - cliquez sur « Publier » pour l'appliquer.");
    }
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Import / Export"
        description="Sauvegardez, transférez ou réinitialisez le contenu du site."
      />

      <Card className="space-y-4">
        <h3 className="font-display text-sm uppercase tracking-wide text-white">
          Exporter
        </h3>
        <p className="text-sm text-white/60">
          Télécharge l&apos;intégralité du contenu actuel au format JSON
          (<code className="rounded bg-white/10 px-1">vcm-contenu-AAAA-MM-JJ.json</code>).
        </p>
        <Button variant="primary" onClick={handleExport}>
          <Download className="h-4 w-4" /> Exporter le contenu
        </Button>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-display text-sm uppercase tracking-wide text-white">
          Importer
        </h3>
        <p className="text-sm text-white/60">
          Importez un fichier JSON précédemment exporté. Le contenu est validé,
          chargé puis enregistré immédiatement.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFile}
          className="hidden"
        />
        <Button variant="secondary" onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4" /> Choisir un fichier .json
        </Button>
        {importError && (
          <p role="alert" className="text-sm text-rose-400">
            {importError}
          </p>
        )}
      </Card>

      <Card className="space-y-4 border-rose-500/20">
        <h3 className="font-display text-sm uppercase tracking-wide text-white">
          Réinitialiser
        </h3>
        <p className="text-sm text-white/60">
          Charge le contenu d&apos;usine dans l&apos;éditeur. Rien n&apos;est
          modifié en ligne tant que vous n&apos;avez pas publié.
        </p>
        <Button variant="danger" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" /> Charger le contenu par défaut
        </Button>
      </Card>

      <Card className="space-y-2 bg-[#0a0418]/60">
        <h3 className="font-display text-sm uppercase tracking-wide text-white">
          Comment ça marche&nbsp;?
        </h3>
        <p className="text-sm text-white/60">
          Le bouton <strong className="text-white/80">Publier</strong> enregistre
          le contenu sur le serveur du site. Les modifications sont visibles{" "}
          <strong className="text-white/80">
            immédiatement, par tous les visiteurs, sur tous les appareils
          </strong>{" "}
          — aucun redéploiement nécessaire.
        </p>
        <p className="text-sm text-white/60">
          Pensez à <strong className="text-white/80">exporter</strong> le contenu
          de temps en temps : c&apos;est votre seule sauvegarde en cas de fausse
          manœuvre.
        </p>
      </Card>
    </div>
  );
}
