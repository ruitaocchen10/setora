import { createSupabaseSessionClient } from "@/lib/supabase/server";
import { UserSidebar } from "@/components/layout/UserSidebar";
import ProfileForm from "./ProfileForm";
import { Profile } from "@/lib/types";

export default async function ProfilePage() {
  const supabase = await createSupabaseSessionClient();
  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .single();

  if (error) throw new Error("Failed to load profile");

  return (
    <div className="flex h-screen bg-background text-foreground">
      <UserSidebar />
      <main className="flex-1 overflow-y-auto px-10 pt-16 pb-10">
        <ProfileForm profile={data as Profile} />
      </main>
    </div>
  );
}
