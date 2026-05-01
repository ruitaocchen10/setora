import { createSupabaseSessionClient } from "@/lib/supabase/server";
import { Sidebar } from "./Sidebar";

export async function UserSidebar() {
  const supabase = await createSupabaseSessionClient();

  const [{ data: { user } }, { data: projectsData }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("projects")
      .select("id, title, artist, sessions(created_at)")
      .order("created_at", { ascending: false }),
  ]);

  const name = user?.user_metadata?.full_name ?? user?.email ?? null;
  const email = user?.email ?? null;

  const recentProjects = (projectsData ?? [])
    .sort((a, b) => {
      const aDate = (a.sessions as { created_at: string }[])?.[0]?.created_at ?? "";
      const bDate = (b.sessions as { created_at: string }[])?.[0]?.created_at ?? "";
      return bDate.localeCompare(aDate);
    })
    .slice(0, 3)
    .map((p) => ({ id: p.id, title: p.title, artist: p.artist }));

  return <Sidebar user={{ name, email }} recentProjects={recentProjects} />;
}
