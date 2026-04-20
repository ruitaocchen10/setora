"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Paperclip,
  Plus,
  Music,
  X,
} from "lucide-react";

const mockTracks = [
  { id: "t1", name: "Blackbird — Beatles (Original)", source: "YouTube" },
  { id: "t2", name: "Blackbird — Tommy Emmanuel", source: "YouTube" },
];

interface SectionProps {
  label: string;
  action: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ label, action, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
      >
        <span>{label}</span>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {action}
          {open ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </div>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

export function ProjectRightPanel({ projectId: _ }: { projectId: string }) {
  const [tracks, setTracks] = useState(mockTracks);

  return (
    <div className="w-72 shrink-0 border-l border-border overflow-y-auto p-4">
      <Section label="Instructions" action={<Paperclip className="size-3.5" />}>
        <textarea
          placeholder="Add tone, rules, or goals to guide your AI coach…"
          className="w-full text-sm text-foreground bg-transparent resize-none placeholder:text-muted-foreground focus:outline-none min-h-[80px] leading-relaxed"
        />
      </Section>

      <div className="border-t border-border my-1" />

      <Section
        label="Reference Tracks"
        action={<Plus className="size-3.5" />}
      >
        <div>
          {tracks.map((track, i) => (
            <div
              key={track.id}
              className={`flex items-center gap-2 py-2 ${i < tracks.length - 1 ? "border-b border-border" : ""}`}
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
      </Section>
    </div>
  );
}
