import { UserSidebar } from "@/components/layout/UserSidebar";
import { ProjectsGrid } from "@/components/project/ProjectsGrid";
import { NewProjectButton } from "@/components/project/NewProjectButton";
import { createSupabaseSessionClient } from "@/lib/supabase/server";

export default async function Projects() {
  const supabase = await createSupabaseSessionClient();

  const { data: projectsData } = await supabase
    .from("projects")
    .select("*, sessions(created_at)")
    .order("created_at", { referencedTable: "sessions", ascending: false });

  const projects = (projectsData ?? []).sort((a, b) => {
    const aDate = (a.sessions as { created_at: string }[])?.[0]?.created_at ?? "";
    const bDate = (b.sessions as { created_at: string }[])?.[0]?.created_at ?? "";
    return bDate.localeCompare(aDate);
  });

  return (
    <div className="flex h-screen bg-background text-foreground">
      <UserSidebar />

      <main className="flex flex-col flex-1 overflow-y-auto px-10 pt-16 pb-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Projects</h1>
          <NewProjectButton variant="button" />
        </div>
        <ProjectsGrid projects={projects} />
      </main>
    </div>
  );
}
