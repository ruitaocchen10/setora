"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface SessionItem {
  id: string;
  created_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function SessionList({ initialSessions }: { initialSessions: SessionItem[] }) {
  const [sessions, setSessions] = useState(initialSessions);

  async function handleDelete(sessionId: string) {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from("sessions")
      .delete()
      .eq("id", sessionId);
    if (!error) {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    }
  }

  if (sessions.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
        Past Sessions
      </p>
      <div className="flex flex-col gap-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="group flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
          >
            <Link
              href={`/sessions/${session.id}`}
              className="flex-1 text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              {formatDate(session.created_at)}
            </Link>
            <button
              onClick={() => handleDelete(session.id)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-white/5 transition-all cursor-pointer"
              aria-label="Delete session"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
