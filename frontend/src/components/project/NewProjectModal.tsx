"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Project } from "@/lib/types";

const INSTRUMENTS = ["voice", "guitar", "piano"] as const;

interface NewProjectModalProps {
  onClose: () => void;
}

export function NewProjectModal({ onClose }: NewProjectModalProps) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [instruments, setInstruments] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleInstrument(inst: string) {
    setInstruments((prev) =>
      prev.includes(inst) ? prev.filter((i) => i !== inst) : [...prev, inst]
    );
  }

  async function handleSave() {
    setError(null);
    try {
      setSaving(true);
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      const payload: Omit<Project, "id" | "created_at" | "updated_at"> = {
        user_id: user!.id,
        title,
        artist: artist || null,
        instruments,
        instructions: instructions || null,
      };
      const { error } = await supabase.from("projects").insert(payload);
      if (error) {
        setError("Failed to create project.");
      } else {
        onClose();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-surface border border-border p-6 flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">New project</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <X className="size-5" />
          </button>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Song title"
          />
        </div>

        {/* Artist */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Artist
          </label>
          <input
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist name"
          />
        </div>

        {/* Instruments */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Instruments
          </label>
          <div className="flex gap-2">
            {INSTRUMENTS.map((inst) => (
              <button
                key={inst}
                onClick={() => toggleInstrument(inst)}
                className={`rounded-full px-3 py-1 text-sm font-medium capitalize transition-colors cursor-pointer ${
                  instruments.includes(inst)
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {inst}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Instructions
          </label>
          <textarea
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="What do you want to work on?"
          />
        </div>

        {/* Error */}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Creating…" : "Create project"}
          </button>
        </div>

      </div>
    </div>
  );
}
