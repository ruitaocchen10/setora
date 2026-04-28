import { NextResponse } from "next/server";
import { createSupabaseSessionClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createSupabaseSessionClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const next = searchParams.get("next") ?? "/app";
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=invalid_link`);
}
