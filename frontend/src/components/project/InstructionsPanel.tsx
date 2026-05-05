"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface InstructionsPanelProps {
  projectId: string;
  initialInstructions: string | null;
}

interface EditModalProps {
  value: string;
  onSave: (value: string) => void;
  onClose: () => void;
}

function EditModal({ value: initial, onSave, onClose }: EditModalProps) {
  const [value, setValue] = useState(initial);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-md rounded-2xl bg-surface border border-border p-6 flex flex-col gap-5">
        <h2 className="text-base font-semibold text-foreground">Instructions</h2>
        <textarea
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add tone, rules, or goals to guide your AI coach…"
          rows={6}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed"
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(value)}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export function InstructionsPanel({ projectId, initialInstructions }: InstructionsPanelProps) {
  const [instructions, setInstructions] = useState(initialInstructions ?? "");
  const [editing, setEditing] = useState(false);

  async function handleSave(value: string) {
    setEditing(false);
    const trimmed = value.trim();
    setInstructions(trimmed);
    const supabase = createSupabaseBrowserClient();
    await supabase
      .from("projects")
      .update({ instructions: trimmed || null, updated_at: new Date().toISOString() })
      .eq("id", projectId);
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-surface px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground mb-2">Instructions</p>
            {instructions ? (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{instructions}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No instructions yet.</p>
            )}
          </div>
          <button
            onClick={() => setEditing(true)}
            className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer mt-0.5"
            aria-label="Edit instructions"
          >
            <Pencil className="size-3.5" />
          </button>
        </div>
      </div>

      {editing && (
        <EditModal
          value={instructions}
          onSave={handleSave}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}
