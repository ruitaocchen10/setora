"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Music, X } from "lucide-react";

const initialTracks = [
  { id: "t1", name: "Blackbird — Beatles (Original)", source: "YouTube" },
  { id: "t2", name: "Blackbird — Tommy Emmanuel", source: "YouTube" },
];

export function ReferenceTracksPanel() {
  const [open, setOpen] = useState(true);
  const [tracks, setTracks] = useState(initialTracks);

  return (
    <div className="rounded-lg border border-border bg-surface">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
      >
        <span>Reference Tracks</span>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Plus className="size-4" />
          {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>
      <div
        className="grid transition-all duration-200 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-3 pb-3 flex flex-col gap-2">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-2.5 rounded-md bg-muted/40 px-3 py-2.5"
              >
                <Music className="size-3.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{track.name}</p>
                  <p className="text-xs text-muted-foreground">{track.source}</p>
                </div>
                <button
                  onClick={() => setTracks(tracks.filter((t) => t.id !== track.id))}
                  className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
