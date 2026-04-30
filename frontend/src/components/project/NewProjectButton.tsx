"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { NewProjectModal } from "@/components/project/NewProjectModal";

interface NewProjectButtonProps {
  variant?: "card" | "button";
}

export function NewProjectButton({ variant = "button" }: NewProjectButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {variant === "card" ? (
        <button
          onClick={() => setShowModal(true)}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Plus className="size-5" />
          <span className="text-sm font-medium">New project</span>
        </button>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <Plus className="size-4" />
          New project
        </button>
      )}

      {showModal && <NewProjectModal onClose={() => setShowModal(false)} />}
    </>
  );
}
