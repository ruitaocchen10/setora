"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Profile, SkillLevel } from "@/lib/types";

const INSTRUMENTS = ["voice", "guitar", "piano"] as const;
const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "competent", label: "Competent" },
  { value: "advanced", label: "Advanced" },
];

interface ProfileFormProps {
  profile: Profile;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [skillLevel, setSkillLevel] = useState<SkillLevel | "">(profile.skill_level ?? "");
  const [instruments, setInstruments] = useState<string[]>(profile.instruments);
  const [goals, setGoals] = useState(profile.goals.join("\n"));
  const [profileMd, setProfileMd] = useState(profile.profile_md ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  function toggleInstrument(instrument: string) {
    setInstruments((prev) =>
      prev.includes(instrument)
        ? prev.filter((i) => i !== instrument)
        : [...prev, instrument]
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from("user_profile")
      .update({
        full_name: fullName || null,
        skill_level: skillLevel || null,
        instruments,
        goals: goals.split("\n").map((g) => g.trim()).filter(Boolean),
        profile_md: profileMd || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    setSaving(false);
    setMessage(error ? { text: "Failed to save.", ok: false } : { text: "Saved.", ok: true });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Name
        </label>
        <input
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your name"
        />
      </div>

      {/* Skill level */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Skill level
        </label>
        <div className="flex gap-2 flex-wrap">
          {SKILL_LEVELS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSkillLevel(skillLevel === value ? "" : value)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors cursor-pointer ${
                skillLevel === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Instruments */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Instruments
        </label>
        <div className="flex gap-2">
          {INSTRUMENTS.map((inst) => (
            <button
              key={inst}
              onClick={() => toggleInstrument(inst)}
              className={`rounded-full px-3 py-1 text-sm font-medium capitalize transition-colors cursor-pointer ${
                instruments.includes(inst)
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {inst}
            </button>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Goals
        </label>
        <p className="text-xs text-muted-foreground">One goal per line</p>
        <textarea
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          rows={4}
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          placeholder={"Improve tone consistency\nNail the bridge section"}
        />
      </div>

      {/* Profile notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Notes for AI coach
        </label>
        <p className="text-xs text-muted-foreground">
          Anything you want the AI to keep in mind about your playing
        </p>
        <textarea
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          rows={4}
          value={profileMd}
          onChange={(e) => setProfileMd(e.target.value)}
          placeholder="e.g. I tend to rush in fast passages. I've been playing for 3 years."
        />
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {message && (
          <p className={`text-sm ${message.ok ? "text-accent" : "text-destructive"}`}>{message.text}</p>
        )}
      </div>
    </div>
  );
}
