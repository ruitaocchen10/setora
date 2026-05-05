"use client";

import { useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface InstructionsPanelProps {
  projectId: string;
  initialInstructions: string | null;
}

export function InstructionsPanel({ projectId, initialInstructions }: InstructionsPanelProps) {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState(initialInstructions ?? "");
  const savedValue = useRef(initialInstructions ?? "");

  async function handleBlur() {
    if (value === savedValue.current) return;
    const supabase = createSupabaseBrowserClient();
    await supabase
      .from("projects")
      .update({ instructions: value || null, updated_at: new Date().toISOString() })
      .eq("id", projectId);
    savedValue.current = value;
  }

  return (
    <div className="rounded-lg border border-border bg-surface">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors cursor-pointer"
      >
        <span>Instructions</span>
        {open ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
      </button>
      <div
        className="grid transition-all duration-200 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-3">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={handleBlur}
              placeholder="Add tone, rules, or goals to guide your AI coach…"
              className="w-full text-sm text-foreground bg-transparent resize-none placeholder:text-muted-foreground focus:outline-none min-h-[80px] leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
