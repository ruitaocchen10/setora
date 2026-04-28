import { Plus } from "lucide-react";
import { UserSidebar } from "@/components/layout/UserSidebar";
import { Card, CardContent } from "@/components/ui/Card";
import { mockSessions, mockProjects, mockUser } from "@/lib/mock/data";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export default function Home() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <UserSidebar />

      <main className="flex-1 overflow-y-auto p-10">
        {/* Greeting */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-foreground">
            {getGreeting()}, {mockUser.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{today}</p>
        </div>

        {/* Recent Sessions */}
        <section>
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent Sessions
          </p>
          <div className="grid grid-cols-4 gap-4">
            {mockSessions.map((session) => {
              const project = mockProjects.find((p) => p.id === session.projectId);
              return (
                <Card key={session.id} className="flex flex-col gap-4 p-5">
                  {/* Title + date */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {session.projectTitle}
                      </p>
                      {project && (
                        <p className="mt-0.5 text-sm text-muted-foreground truncate">
                          {project.artist}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(session.date)}
                    </span>
                  </div>

                  {/* Instrument pills */}
                  {project && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.instruments.map((inst) => (
                        <span
                          key={inst}
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary capitalize"
                        >
                          {inst}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Feedback preview */}
                  <CardContent className="p-0 text-sm italic leading-relaxed line-clamp-2">
                    "{session.feedbackPreview}"
                  </CardContent>

                  {/* Continue link */}
                  <a
                    href={`/projects/${session.projectId}`}
                    className="mt-auto text-sm text-primary cursor-pointer hover:underline"
                  >
                    Continue →
                  </a>
                </Card>
              );
            })}

            {/* New Project CTA — 4th card */}
            <button className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer">
              <Plus className="size-5" />
              <span className="text-sm font-medium">New project</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
