import { notFound } from "next/navigation";
import { Mic } from "lucide-react";
import { UserSidebar } from "@/components/layout/UserSidebar";
import { InstructionsPanel } from "@/components/project/InstructionsPanel";
import { ReferenceTracksPanel } from "@/components/project/ReferenceTracksPanel";
import { ProjectMenu } from "@/components/project/ProjectMenu";
import { createSupabaseSessionClient } from "@/lib/supabase/server";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseSessionClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, sessions(id, created_at), reference_tracks(id, song_name, artist, source_url)")
    .eq("id", id)
    .single();

  if (!project) notFound();

  const sessions = (project.sessions ?? []) as { id: string; created_at: string }[];
  const referenceTracks = (project.reference_tracks ?? []) as {
    id: string;
    song_name: string | null;
    artist: string | null;
    source_url: string | null;
  }[];

  return (
    <div className="flex h-screen bg-background text-foreground">
      <UserSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Content area */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Center */}
          <div className="flex-1 overflow-y-auto p-8">
            {/* Project header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-semibold text-foreground">
                  {project.title}
                </h1>
                <ProjectMenu projectId={project.id} />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {project.instruments.map((inst: string) => (
                  <span
                    key={inst}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary capitalize"
                  >
                    {inst}
                  </span>
                ))}
              </div>
            </div>

            {/* New session CTA */}
            <button className="w-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-10 mb-8 hover:border-primary/40 hover:bg-surface/50 transition-colors cursor-pointer">
              <Mic className="size-8 text-muted-foreground" />
              <div className="text-center">
                <p className="text-base font-medium text-foreground">
                  Start a new session
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Record or upload to get AI feedback
                </p>
              </div>
            </button>

            {/* Past sessions */}
            {sessions.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                  Past Sessions
                </p>
                <div className="flex flex-col gap-3">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-lg border border-border bg-surface px-4 py-3"
                    >
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(session.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="w-108 shrink-0 overflow-y-auto p-12 flex flex-col gap-8">
            <InstructionsPanel
              projectId={project.id}
              initialInstructions={project.instructions}
            />
            <ReferenceTracksPanel
              projectId={project.id}
              initialTracks={referenceTracks}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
