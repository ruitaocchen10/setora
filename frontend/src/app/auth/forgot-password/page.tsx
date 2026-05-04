"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const supabase = createSupabaseBrowserClient();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        window.location.origin + "/auth/callback?next=/auth/reset-password",
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }

    setLoading(false);
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary opacity-[0.08] blur-[120px]" />
      </div>

      <Link
        href="/auth/login"
        className="relative mb-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to sign in
      </Link>

      <div className="relative w-full max-w-sm bg-surface border border-border rounded-lg p-8">
        {sent ? (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Check your email</h2>
              <p className="text-sm text-muted-foreground mt-1">
                We sent a password reset link to{" "}
                <span className="text-foreground font-medium">{email}</span>.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Didn&apos;t get it? Check your spam folder.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-6">
              <Image src="/logo-violet-transparent.png" alt="Setora logo" width={602} height={602} className="size-6 -translate-y-0.5" />
              <span className="text-xl font-extrabold tracking-tight text-primary">Setora</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Reset your password</h1>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
                {loading ? "Sending…" : "Send reset link"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
