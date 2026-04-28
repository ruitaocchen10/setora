"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      router.push("/app");
    }

    setLoading(false);
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary opacity-[0.08] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm bg-surface border border-border rounded-lg p-8">
        <p className="text-primary text-sm font-semibold tracking-tight mb-6">
          setora
        </p>
        <h1 className="text-xl font-bold text-foreground">Choose a new password</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          Pick something strong you haven&apos;t used before.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="password"
            type="password"
            label="New password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <Input
            id="confirmPassword"
            type="password"
            label="Confirm new password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            error={
              confirmPassword && confirmPassword !== password
                ? "Passwords don't match."
                : undefined
            }
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? "Updating…" : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
