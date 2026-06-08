"use client";

import { useRef, useState } from "react";
import { Download, Upload, RotateCcw } from "lucide-react";
import type { SiteContent } from "@/content/types";
import { useAdminDraft } from "../useAdminDraft";
import { Button, Card, SectionTitle } from "../ui";

/** Top-level keys every valid content export must contain. */
const REQUIRED_KEYS: (keyof SiteContent)[] = [
  "club",
  "stats",
  "teams",
  "news",
  "events",
  "partners",
  "gallery",
  "faq",
  "timeline",
  "text",
];

function isValidContent(value: unknown): value is SiteContent {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return REQUIRED_KEYS.every((k) => k in obj);
}

export default function ImportExport({
  onToast,
}: {
  onToast: (message: string, type?: "success" | "error") => void;
}) {
  const { draft, save, loadDraft, resetAll } = useAdminDraft();
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
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!isValidContent(parsed)) {
          throw new Error(
            "Le fichier ne contient pas toutes les sections attendues.",
          );
        }
        loadDraft(parsed);
        const ok = save();
        if (ok) {
          onToast("Contenu importé et enregistré.");
        } else {
          onToast(
            "Importé, mais trop volumineux pour le stockage local — exportez plutôt le contenu.",
            "error",
          );
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
      "Réinitialiser tout le contenu aux valeurs par défaut ? Cette action efface vos modifications locales (ce navigateur).",
    );
    if (ok) resetAll();
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
          Restaure le contenu d&apos;usine et efface toutes les modifications
          locales de ce navigateur.
        </p>
        <Button variant="danger" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" /> Réinitialiser tout (contenu par défaut)
        </Button>
      </Card>

      <Card className="space-y-2 bg-[#0a0418]/60">
        <h3 className="font-display text-sm uppercase tracking-wide text-white">
          Comment publier pour tout le monde&nbsp;?
        </h3>
        <p className="text-sm text-white/60">
          Les modifications faites ici sont enregistrées dans le{" "}
          <strong className="text-white/80">localStorage de ce navigateur</strong>{" "}
          uniquement : elles ne sont visibles que par vous, sur cet appareil.
        </p>
        <p className="text-sm text-white/60">
          Pour publier le contenu pour tous les visiteurs&nbsp;:{" "}
          <strong className="text-white/80">Exportez</strong> le fichier JSON,
          déposez-le dans le projet sous{" "}
          <code className="rounded bg-white/10 px-1">src/content/imported.json</code>{" "}
          puis redéployez le site.
        </p>
      </Card>
    </div>
  );
}
