import { createSupabaseSessionClient } from "@/lib/supabase/server";
import { Sidebar } from "./Sidebar";

export async function UserSidebar() {
  const supabase = await createSupabaseSessionClient();
  const { data: { user } } = await supabase.auth.getUser();

  const name = user?.user_metadata?.full_name ?? user?.email ?? null;
  const email = user?.email ?? null;

  return <Sidebar user={{ name, email }} />;
}
