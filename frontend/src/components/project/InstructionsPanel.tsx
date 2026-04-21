"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Paperclip } from "lucide-react";

export function InstructionsPanel() {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-lg border border-border bg-surface">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
      >
        <span>Instructions</span>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Paperclip className="size-4" />
          {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>
      <div
        className="grid transition-all duration-200 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-3">
            <textarea
              placeholder="Add tone, rules, or goals to guide your AI coach…"
              className="w-full text-sm text-foreground bg-transparent resize-none placeholder:text-muted-foreground focus:outline-none min-h-[80px] leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
