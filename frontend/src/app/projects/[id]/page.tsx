import { notFound } from "next/navigation";
import { UserSidebar } from "@/components/layout/UserSidebar";
import { InstructionsPanel } from "@/components/project/InstructionsPanel";
import { ReferenceTracksPanel } from "@/components/project/ReferenceTracksPanel";
import { ProjectMenu } from "@/components/project/ProjectMenu";
import { NewSessionButton } from "@/components/session/NewSessionButton";
import { SessionList } from "@/components/session/SessionList";
import { createSupabaseSessionClient } from "@/lib/supabase/server";


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
              <div className="flex items-start justify-between mb-1">
                <h1 className="text-3xl font-semibold text-foreground">
                  {project.title}
                </h1>
                <ProjectMenu projectId={project.id} />
              </div>
              {project.artist && (
                <p className="text-base text-muted-foreground mb-3">{project.artist}</p>
              )}
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
            <NewSessionButton projectId={project.id} />

            {/* Past sessions */}
            <SessionList initialSessions={sessions} />
          </div>

          {/* Right panel */}
          <div className="w-108 shrink-0 overflow-y-auto p-8 flex flex-col gap-8">
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
