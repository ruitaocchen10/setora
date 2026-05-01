"use client";

import { Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function NewSessionButton({ projectId }: { projectId: string }) {
  const router = useRouter();

  async function handleClick() {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: session } = await supabase
      .from("sessions")
      .insert({ project_id: projectId, user_id: user.id })
      .select("id")
      .single();

    if (session) {
      router.push(`/sessions/${session.id}`);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="w-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-10 mb-8 hover:border-primary/40 hover:bg-surface/50 transition-colors cursor-pointer"
    >
      <Mic className="size-8 text-muted-foreground" />
      <div className="text-center">
        <p className="text-base font-medium text-foreground">Start a new session</p>
        <p className="text-sm text-muted-foreground mt-0.5">Record or upload to get AI feedback</p>
      </div>
    </button>
  );
}
