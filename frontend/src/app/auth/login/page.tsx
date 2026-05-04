"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type View = "sign_in" | "sign_up";

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<View>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const supabase = createSupabaseBrowserClient();

  function switchView(next: View) {
    setView(next);
    setError(null);
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (view === "sign_up" && password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    if (view === "sign_in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push("/app");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/auth/callback",
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setEmailSent(true);
      }
    }

    setLoading(false);
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary opacity-[0.08] blur-[120px]" />
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="relative mb-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to home
      </Link>

      {/* Card */}
      <div className="relative w-full max-w-sm bg-surface border border-border rounded-lg p-8">
        {emailSent ? (
          <EmailSentState email={email} />
        ) : (
          <>
            {/* Wordmark */}
            <div className="flex items-center gap-2 mb-6">
              <Image src="/logo-violet-transparent.png" alt="Setora logo" width={602} height={602} className="size-6 -translate-y-0.5" />
              <span className="text-xl font-extrabold tracking-tight text-primary">Setora</span>
            </div>

            {/* Heading */}
            <h1 className="text-xl font-bold text-foreground">
              {view === "sign_in" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              {view === "sign_in"
                ? "Sign in to continue your practice."
                : "Start your music practice journey."}
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

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  {view === "sign_in" && (
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={view === "sign_in" ? "current-password" : "new-password"}
                  className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {view === "sign_up" && (
                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirm password"
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
              )}

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full mt-2"
                disabled={loading}
              >
                {loading
                  ? "Please wait…"
                  : view === "sign_in"
                  ? "Sign in"
                  : "Create account"}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-5">
              {view === "sign_in" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchView("sign_up")}
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchView("sign_in")}
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function EmailSentState({ email }: { email: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-4">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <Mail className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">Check your email</h2>
        <p className="text-sm text-muted-foreground mt-1">
          We sent a confirmation link to{" "}
          <span className="text-foreground font-medium">{email}</span>.
          Click it to activate your account.
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        Didn&apos;t get it? Check your spam folder.
      </p>
    </div>
  );
}
