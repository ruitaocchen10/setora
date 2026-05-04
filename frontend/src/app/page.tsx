import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { WaitlistForm } from "@/components/landing/WaitlistForm";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const features = [
  {
    glyph: "✦",
    title: "Built around you",
    body: "Setora learns your instrument, your goals, and how you play. Every session is tailored to where you actually are.",
  },
  {
    glyph: "♩",
    title: "A teacher, not an evaluator",
    body: "Feedback that sounds like a thoughtful collaborator who's heard you play and knows exactly what to say next.",
  },
  {
    glyph: "◎",
    title: "Everything great artists know",
    body: "Setora draws on deep musical knowledge: technique, theory, expression, genre. The guidance you get is the kind that actually makes you better.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground">
      {/* Full-page atmospheric glow — sits behind everything including the nav */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -5%, oklch(60% 0.28 285 / 0.20), transparent)",
        }}
      />

      {/* Nav */}
      <div className="relative z-10 flex justify-center pt-5 px-6 shrink-0">
        <nav
          className="flex items-center justify-between w-full max-w-2xl px-5 py-3 rounded-2xl"
          style={{
            background: "oklch(11% 0.02 255 / 0.55)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow:
              "0 0 0 1px oklch(100% 0 0 / 0.08), 0 4px 24px oklch(0% 0 0 / 0.35), inset 0 1px 0 oklch(100% 0 0 / 0.06)",
          }}
        >
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Setora logo"
              width={602}
              height={602}
              className="size-6 -translate-y-0.5"
            />
            <span className="text-xl font-extrabold tracking-tight">
              Setora
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="opacity-40 cursor-not-allowed"
          >
            Sign in
          </Button>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center px-4 py-20 text-center">
        <div className="relative z-10 max-w-6xl">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.1] text-foreground">
            Practice like
            <br /> you have
            <br />{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, oklch(93% 0 0) 30%, oklch(72% 0.28 285) 50%, oklch(93% 0 0) 70%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 3s linear infinite",
              }}
            >
              a real teacher.
            </span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Setora learns how you play and coaches you like a teacher who
            actually knows you.
          </p>
          <div className="mt-8">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* Demo video */}
      <section className="px-4 pb-16">
        <div className="relative max-w-6xl mx-auto group">
          {/* Violet underglow */}
          <div
            className="pointer-events-none absolute inset-x-1/4 top-4 h-32 blur-3xl -z-10"
            style={{ background: "oklch(60% 0.28 285 / 0.15)" }}
          />
          {/* Underglow hover intensifier */}
          <div
            className="pointer-events-none absolute inset-x-1/4 top-4 h-32 blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "oklch(60% 0.28 285 / 0.22)" }}
          />

          {/* Video container — swap the placeholder div for an <iframe> or <video> when ready */}
          <div
            className="video-placeholder w-full aspect-video rounded-2xl flex items-center justify-center"
            style={{ background: "oklch(14% 0.02 255 / 0.85)" }}
          >
            <div className="flex flex-col items-center gap-5">
              {/* Play button with halo */}
              <div className="relative flex items-center justify-center">
                <div className="absolute size-20 rounded-full border border-primary/20 animate-pulse-ring" />
                <div
                  className="size-16 rounded-full flex items-center justify-center border border-white/10 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "oklch(60% 0.28 285 / 0.12)" }}
                >
                  <Play className="size-6 text-primary fill-primary ml-0.5" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-foreground">
                  Watch Setora in action
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Demo coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pt-20 pb-40">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-20 text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            <span className="block mb-4">Private-lesson quality.</span>
            <span className="text-primary">Self-taught freedom.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f) => (
              <Card key={f.title} className="flex flex-col gap-4">
                <span className="text-3xl text-primary leading-none">
                  {f.glyph}
                </span>
                <h3 className="text-xl font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {f.body}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground">© 2026 Setora</p>
      </footer>
    </div>
  );
}
