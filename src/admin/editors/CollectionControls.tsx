"use client";

import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Button } from "../ui";

/** Per-item header row: title + up/down reorder + delete-with-confirm. */
export function ItemControls({
  index,
  count,
  label,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  index: number;
  count: number;
  label: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  function handleRemove() {
    if (window.confirm(`Supprimer « ${label} » ? Cette action est définitive.`)) {
      onRemove();
    }
  }
  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        aria-label="Monter"
        disabled={index === 0}
        onClick={onMoveUp}
        className="!px-2"
      >
        <ChevronUp className="h-4 w-4" aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        aria-label="Descendre"
        disabled={index === count - 1}
        onClick={onMoveDown}
        className="!px-2"
      >
        <ChevronDown className="h-4 w-4" aria-hidden />
      </Button>
      <Button
        type="button"
        variant="danger"
        aria-label={`Supprimer ${label}`}
        onClick={handleRemove}
        className="!px-2"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  );
}

/** Empty-state hint for a collection. */
export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-white/15 px-4 py-6 text-center text-sm text-white/40">
      {children}
    </p>
  );
}
