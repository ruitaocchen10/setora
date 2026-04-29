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
      <main className="flex-1 overflow-y-auto p-10">
        <div className="max-w-lg">
          <h1 className="text-3xl font-semibold text-foreground mb-8">Profile</h1>
          <ProfileForm profile={data as Profile} />
        </div>
      </main>
    </div>
  );
}
