"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface SessionItem {
  id: string;
  name: string | null;
  created_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface RenameModalProps {
  currentName: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

function RenameModal({ currentName, onSave, onClose }: RenameModalProps) {
  const [value, setValue] = useState(currentName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSave(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-sm rounded-2xl bg-surface border border-border p-6 flex flex-col gap-5">
        <h2 className="text-base font-semibold text-foreground">
          Rename session
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
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
              type="submit"
              disabled={!value.trim()}
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface SessionCardProps {
  session: SessionItem;
  label: string;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

function SessionCard({ session, label, onDelete, onRename }: SessionCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSaveRename(name: string) {
    setRenaming(false);
    const supabase = createSupabaseBrowserClient();
    await supabase.from("sessions").update({ name }).eq("id", session.id);
    onRename(session.id, name);
  }

  return (
    <>
      <div className="group flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-4">
        <Link
          href={`/sessions/${session.id}`}
          className="flex-1 min-w-0 cursor-pointer"
        >
          <p className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">
            {session.name ?? label}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDate(session.created_at)}
          </p>
        </Link>

        <div ref={menuRef} className="relative shrink-0 ml-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Session menu"
          >
            <MoreVertical className="size-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-border bg-surface shadow-lg z-10 py-1">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setRenaming(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Pencil className="size-3.5 text-muted-foreground" />
                Rename
              </button>
              <div className="my-1 border-t border-border" />
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(session.id);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {renaming && (
        <RenameModal
          currentName={session.name ?? label}
          onSave={handleSaveRename}
          onClose={() => setRenaming(false)}
        />
      )}
    </>
  );
}

export function SessionList({
  initialSessions,
}: {
  initialSessions: SessionItem[];
}) {
  const [sessions, setSessions] = useState(initialSessions);

  const total = sessions.length;

  async function handleDelete(sessionId: string) {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from("sessions")
      .delete()
      .eq("id", sessionId);
    if (!error) setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  }

  function handleRename(sessionId: string, name: string) {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, name } : s)),
    );
  }

  if (sessions.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
        Past Sessions
      </p>
      <div className="flex flex-col gap-2">
        {sessions.map((session, i) => (
          <SessionCard
            key={session.id}
            session={session}
            label={`Session ${total - i}`}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        ))}
      </div>
    </div>
  );
}
