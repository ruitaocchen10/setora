"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Music, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ReferenceTrack } from "@/lib/types";

type TrackItem = Pick<ReferenceTrack, "id" | "song_name" | "artist" | "source_url">;

interface ReferenceTracksPanelProps {
  projectId: string;
  initialTracks: TrackItem[];
}

export function ReferenceTracksPanel({ projectId: _projectId, initialTracks }: ReferenceTracksPanelProps) {
  const [open, setOpen] = useState(true);
  const [tracks, setTracks] = useState(initialTracks);

  async function handleDelete(trackId: string) {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from("reference_tracks")
      .delete()
      .eq("id", trackId);
    if (!error) {
      setTracks((prev) => prev.filter((t) => t.id !== trackId));
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors cursor-pointer"
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
                  <p className="text-sm text-foreground truncate">
                    {track.song_name ?? "Untitled track"}
                  </p>
                  {track.artist && (
                    <p className="text-xs text-muted-foreground">{track.artist}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(track.id)}
                  className="shrink-0 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
