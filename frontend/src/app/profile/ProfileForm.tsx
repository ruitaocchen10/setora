"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Profile } from "@/lib/types";

const ABILITY_TRAITS = [
  "I can read sheet music",
  "I can play / sing by ear",
  "I can improvise",
  "I've performed for an audience",
  "I practice with a metronome",
  "I've had formal lessons",
  "I can play in multiple keys",
  "I record and listen back to myself",
] as const;

const PREDEFINED_GOALS = [
  "Improve tone consistency",
  "Build technical speed",
  "Nail a specific section",
  "Perform with confidence",
  "Improve timing and rhythm",
  "Expand my repertoire",
  "Learn music theory",
  "Develop expression and dynamics",
] as const;

const INSTRUMENTS = ["voice", "guitar", "piano"] as const;

// ── Edit Modal ────────────────────────────────────────────────────────────────

interface EditModalProps {
  profile: Profile;
  onSave: (updated: Partial<Profile>) => void;
  onClose: () => void;
}

function EditModal({ profile, onSave, onClose }: EditModalProps) {
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [abilities, setAbilities] = useState<string[]>(profile.skill_level);
  const [instruments, setInstruments] = useState<string[]>(profile.instruments);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    profile.goals.filter((g) => (PREDEFINED_GOALS as readonly string[]).includes(g)),
  );
  const [customGoals, setCustomGoals] = useState<string[]>(
    profile.goals.filter((g) => !(PREDEFINED_GOALS as readonly string[]).includes(g)),
  );
  const [customGoalInput, setCustomGoalInput] = useState("");
  const [profileMd, setProfileMd] = useState(profile.profile_md ?? "");
  const [saving, setSaving] = useState(false);

  function toggleAbility(trait: string) {
    setAbilities((prev) =>
      prev.includes(trait) ? prev.filter((t) => t !== trait) : [...prev, trait],
    );
  }

  function toggleInstrument(inst: string) {
    setInstruments((prev) =>
      prev.includes(inst) ? prev.filter((i) => i !== inst) : [...prev, inst],
    );
  }

  function toggleGoal(goal: string) {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  }

  function addCustomGoal() {
    const trimmed = customGoalInput.trim();
    if (!trimmed || customGoals.includes(trimmed) || selectedGoals.includes(trimmed)) return;
    setCustomGoals((prev) => [...prev, trimmed]);
    setCustomGoalInput("");
  }

  function removeCustomGoal(goal: string) {
    setCustomGoals((prev) => prev.filter((g) => g !== goal));
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createSupabaseBrowserClient();
    const updates = {
      full_name: fullName || null,
      skill_level: abilities,
      instruments,
      goals: [...selectedGoals, ...customGoals],
      profile_md: profileMd || null,
      updated_at: new Date().toISOString(),
    };
    await supabase.from("user_profile").update(updates).eq("id", profile.id);
    setSaving(false);
    onSave({
      ...updates,
      full_name: updates.full_name ?? null,
    });
    onClose();
  }

  const pillBase =
    "rounded-full px-3 py-1 text-sm font-medium transition-colors cursor-pointer";
  const pillActive = "bg-primary text-primary-foreground";
  const pillInactive =
    "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-white/5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-surface border border-border p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Edit profile
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Name
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Ability traits */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            About you — choose all that apply
          </label>
          <div className="flex gap-2 flex-wrap">
            {ABILITY_TRAITS.map((trait) => (
              <button
                key={trait}
                onClick={() => toggleAbility(trait)}
                className={`${pillBase} ${abilities.includes(trait) ? pillActive : pillInactive}`}
              >
                {trait}
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
                className={`${pillBase} capitalize ${instruments.includes(inst) ? pillActive : pillInactive}`}
              >
                {inst}
              </button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Goals
          </label>
          <div className="flex gap-2 flex-wrap">
            {PREDEFINED_GOALS.map((goal) => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`${pillBase} ${selectedGoals.includes(goal) ? pillActive : pillInactive}`}
              >
                {goal}
              </button>
            ))}
          </div>
          {customGoals.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {customGoals.map((goal) => (
                <span
                  key={goal}
                  className="flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-sm text-primary"
                >
                  {goal}
                  <button
                    onClick={() => removeCustomGoal(goal)}
                    className="cursor-pointer hover:opacity-70 transition-opacity"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={customGoalInput}
              onChange={(e) => setCustomGoalInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomGoal()}
              placeholder="Add a custom goal…"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={addCustomGoal}
              disabled={!customGoalInput.trim()}
              className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
            >
              Add
            </button>
          </div>
        </div>

        {/* Notes for AI */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Notes for AI coach
          </label>
          <textarea
            rows={3}
            value={profileMd}
            onChange={(e) => setProfileMd(e.target.value)}
            placeholder="e.g. I tend to rush in fast passages. I've been playing for 3 years."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Profile View ──────────────────────────────────────────────────────────────

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}

export default function ProfileForm({
  profile: initial,
}: {
  profile: Profile;
}) {
  const [profile, setProfile] = useState(initial);
  const [editing, setEditing] = useState(false);

  const initials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  function handleSave(updated: Partial<Profile>) {
    setProfile((prev) => ({ ...prev, ...updated }));
  }

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your instrument, goals, and coaching preferences.
          </p>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
        >
          Edit profile
        </button>
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-6 items-start">
        {/* Left: identity card */}
        <div className="w-80 shrink-0 rounded-xl border border-border bg-surface p-6 flex flex-col items-center gap-4">
          <div className="size-56 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-semibold">
            {initials}
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">
              {profile.full_name ?? "—"}
            </p>
          </div>
        </div>

        {/* Right: details card */}
        <div className="flex-1 rounded-xl border border-border bg-surface p-6 flex flex-col gap-6">
          <p className="text-medium font-bold text-foreground">About</p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <DetailRow
              label="Abilities"
              value={
                profile.skill_level.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skill_level.map((trait) => (
                      <span
                        key={trait}
                        className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )
              }
            />
            <DetailRow
              label="Instruments"
              value={
                profile.instruments.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.instruments.map((inst) => (
                      <span
                        key={inst}
                        className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary capitalize"
                      >
                        {inst}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )
              }
            />
          </div>

          {profile.goals.length > 0 && (
            <DetailRow
              label="Goals"
              value={
                <ul className="flex flex-col gap-1">
                  {profile.goals.map((g, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 rounded-full bg-primary/50 shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
              }
            />
          )}

          {profile.profile_md && (
            <DetailRow
              label="Notes for AI coach"
              value={
                <p className="text-muted-foreground leading-relaxed">
                  {profile.profile_md}
                </p>
              }
            />
          )}
        </div>
      </div>

      {editing && (
        <EditModal
          profile={profile}
          onSave={handleSave}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}
