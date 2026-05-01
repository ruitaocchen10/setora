import { notFound } from "next/navigation";
import { UserSidebar } from "@/components/layout/UserSidebar";
import { SessionChat } from "@/components/session/SessionChat";
import { createSupabaseSessionClient } from "@/lib/supabase/server";
import type { Message } from "@/lib/types";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseSessionClient();

  const [{ data: session }, { data: messagesData }] = await Promise.all([
    supabase
      .from("sessions")
      .select("*, projects(id, title)")
      .eq("id", id)
      .single(),
    supabase
      .from("messages")
      .select("*")
      .eq("session_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (!session) notFound();

  const project = session.projects as { id: string; title: string };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <UserSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <SessionChat
          sessionId={session.id}
          projectId={project.id}
          projectTitle={project.title}
          sessionDate={session.created_at}
          initialMessages={(messagesData ?? []) as Message[]}
        />
      </main>
    </div>
  );
}
