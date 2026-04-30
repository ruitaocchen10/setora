import { UserSidebar } from "@/components/layout/UserSidebar";
import { Card, CardContent } from "@/components/ui/Card";
import { NewProjectButton } from "@/components/project/NewProjectButton";
import { createSupabaseSessionClient } from "@/lib/supabase/server";

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

export default async function Home() {
  const supabase = await createSupabaseSessionClient();

  const [{ data: profile }, { data: authData }, { data: projectsData }] =
    await Promise.all([
      supabase.from("user_profile").select("full_name").single(),
      supabase.auth.getUser(),
      supabase
        .from("projects")
        .select("*, sessions(created_at)")
        .order("created_at", { referencedTable: "sessions", ascending: false }),
    ]);

  const name =
    profile?.full_name ??
    authData.user?.user_metadata?.full_name ??
    authData.user?.email ??
    "there";

  const projects = (projectsData ?? [])
    .sort((a, b) => {
      const aDate = (a.sessions as { created_at: string }[])?.[0]?.created_at ?? "";
      const bDate = (b.sessions as { created_at: string }[])?.[0]?.created_at ?? "";
      return bDate.localeCompare(aDate);
    })
    .slice(0, 3);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <UserSidebar />

      <main className="flex flex-col flex-1 overflow-y-auto p-10">
        {/* Greeting */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-foreground">
            {getGreeting()}, {name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{today}</p>
        </div>

        {/* Recent Sessions */}
        {projects.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                Start your first project
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Pick a song, set your goals, and get coaching after every practice session.
              </p>
            </div>
            <NewProjectButton variant="button" />
          </div>
        ) : (
        <section>
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent Sessions
          </p>
          <div className="grid grid-cols-4 gap-4">
            {projects.map((project) => {
              const sessions = project.sessions as { created_at: string }[];
              const lastPracticed = sessions?.[0]?.created_at ?? null;
              return (
                <Card key={project.id} className="flex flex-col gap-4 p-5">
                  {/* Title + date */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {project.title}
                      </p>
                      {project.artist && (
                        <p className="mt-0.5 text-sm text-muted-foreground truncate">
                          {project.artist}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {lastPracticed ? formatDate(lastPracticed) : "No sessions yet"}
                    </span>
                  </div>

                  {/* Instrument pills */}
                  {project.instruments?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {(project.instruments as string[]).map((inst) => (
                        <span
                          key={inst}
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary capitalize"
                        >
                          {inst}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Instructions preview */}
                  {project.instructions && (
                    <CardContent className="p-0 text-sm italic leading-relaxed line-clamp-2">
                      "{project.instructions}"
                    </CardContent>
                  )}

                  {/* Continue link */}
                  <a
                    href={`/projects/${project.id}`}
                    className="mt-auto text-sm text-primary cursor-pointer hover:underline"
                  >
                    Continue →
                  </a>
                </Card>
              );
            })}

            {/* New Project CTA */}
            <NewProjectButton variant="card" />
          </div>
        </section>
        )}
      </main>
    </div>
  );
}
