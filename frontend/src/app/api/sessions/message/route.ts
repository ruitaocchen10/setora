import { NextResponse } from "next/server";
import {
  createSupabaseSessionClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export async function POST(request: Request) {
  const sessionClient = await createSupabaseSessionClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const { session_id, content, recording_id, audio_filename } = body ?? {};
  if (!session_id || (!content && !recording_id)) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  await supabase.from("messages").insert({
    session_id,
    role: "user",
    content: content ?? "",
    ...(recording_id ? { recording_id } : {}),
    ...(audio_filename ? { feedback_data: { audio_filename } } : {}),
  });

  const [{ data: session }, { data: messages }, { data: profile }] =
    await Promise.all([
      supabase
        .from("sessions")
        .select("project_id, projects(title, artist, instruments, instructions)")
        .eq("id", session_id)
        .single(),
      supabase
        .from("messages")
        .select("role, content, feedback_data")
        .eq("session_id", session_id)
        .order("created_at", { ascending: true }),
      supabase
        .from("user_profile")
        .select("skill_level, goals, profile_md")
        .eq("id", user.id)
        .single(),
    ]);

  const fastapiMessages = (messages ?? []).map((m) => ({
    role: m.role,
    content:
      (m.feedback_data as { audio_filename?: string } | null)?.audio_filename
        ? (m.content ? `${m.content}\n` : "") +
          `[User submitted a recording: ${(m.feedback_data as { audio_filename: string }).audio_filename}]`
        : m.content,
  }));

  const fastapiRes = await fetch(
    `${process.env.FASTAPI_INTERNAL_URL}/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-service-secret": process.env.FASTAPI_SERVICE_SECRET!,
      },
      body: JSON.stringify({
        session_id,
        messages: fastapiMessages,
        project: session?.projects,
        user_profile: profile ?? {},
      }),
    }
  );

  if (!fastapiRes.ok || !fastapiRes.body) {
    const detail = await fastapiRes.text().catch(() => "no body");
    console.error("FastAPI error", fastapiRes.status, detail);
    return NextResponse.json({ error: "LLM error", detail }, { status: 502 });
  }

  return new Response(fastapiRes.body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
