"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "duplicate" | "error" | "invalid";

const statusMessages: Partial<Record<Status, { text: string; className: string }>> = {
  duplicate: { text: "You're already on the list.", className: "text-muted-foreground" },
  error:     { text: "Something went wrong. Please try again.", className: "text-destructive" },
  invalid:   { text: "Please enter a valid email address.", className: "text-destructive" },
};

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    if (status === "invalid") setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("invalid");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      setStatus(res.ok ? "success" : res.status === 409 ? "duplicate" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <p className="font-medium text-accent">You&apos;re on the list.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We&apos;ll reach out when Setora is ready.
        </p>
      </div>
    );
  }

  const msg = statusMessages[status];

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <input
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="your@email.com"
          disabled={status === "loading"}
          className="flex-1 rounded-full bg-surface border border-border px-5 py-3.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-shadow"
        />
        <Button type="submit" variant="primary" size="lg" disabled={status === "loading"}>
          {status === "loading" ? "Joining…" : "Join the waitlist"}
        </Button>
      </form>
      {msg && (
        <p className={cn("mt-3 text-sm text-center", msg.className)}>{msg.text}</p>
      )}
    </div>
  );
}
