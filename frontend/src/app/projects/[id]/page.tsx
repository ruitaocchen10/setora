import { Mic } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProjectRightPanel } from "@/components/project/ProjectRightPanel";
import { mockProjects, mockSessions } from "@/lib/mock/data";

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
  const project = mockProjects.find((p) => p.id === id) ?? mockProjects[0];
  const sessions = mockSessions.filter((s) => s.projectId === project.id);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="shrink-0 px-6 py-3 border-b border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="min-w-0">
              <span className="font-semibold text-foreground">
                {project.title}
              </span>
              <span className="ml-2 text-sm text-muted-foreground">
                {project.artist}
              </span>
            </div>
            <div className="flex gap-1.5 shrink-0">
              {project.instruments.map((inst) => (
                <span
                  key={inst}
                  className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary capitalize"
                >
                  {inst}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0 text-sm text-muted-foreground">
            <span>{project.sessionCount} sessions</span>
            <span>Last: {formatDate(project.lastPracticed)}</span>
          </div>
        </div>

        {/* Content area */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Center */}
          <div className="flex-1 overflow-y-auto p-8">
            {/* New session CTA */}
            <button className="w-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-10 mb-8 hover:border-primary/40 hover:bg-surface/50 transition-colors">
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
                <div>
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-start gap-4 py-4 border-b border-border last:border-0"
                    >
                      <div className="shrink-0 w-16">
                        <p className="text-sm font-medium text-foreground">
                          {formatDate(session.date)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {session.durationMin} min
                        </p>
                      </div>
                      <p className="flex-1 text-sm text-muted-foreground line-clamp-2">
                        {session.feedbackPreview}
                      </p>
                      <a
                        href={`/projects/${project.id}/sessions/${session.id}`}
                        className="shrink-0 text-sm text-primary hover:underline"
                      >
                        View →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <ProjectRightPanel projectId={project.id} />
        </div>
      </main>
    </div>
  );
}
