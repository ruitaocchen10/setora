"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface ProjectMenuProps {
  projectId: string;
}

export function ProjectMenu({ projectId }: ProjectMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleDelete() {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    setOpen(false);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);
    if (!error) {
      router.push("/projects");
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
        aria-label="Project menu"
      >
        <MoreVertical className="size-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-border bg-surface shadow-lg z-10 py-1">
          <button
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Pencil className="size-3.5 text-muted-foreground" />
            Edit project info
          </button>
          <div className="my-1 border-t border-border" />
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            Delete project
          </button>
        </div>
      )}
    </div>
  );
}
