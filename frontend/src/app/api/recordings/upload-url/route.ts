import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import path from "path";
import {
  createSupabaseSessionClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  const sessionClient = await createSupabaseSessionClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const { session_id, file_name, content_type } = body ?? {};
  if (!session_id || !file_name || !content_type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const ext = path.extname(file_name) || ".webm";
  const s3_key = `recordings/${user.id}/${session_id}/${randomUUID()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: s3_key,
    ContentType: content_type,
  });

  const upload_url = await getSignedUrl(s3, command, { expiresIn: 300 });

  const supabase = createSupabaseServerClient();
  const { data: recording, error } = await supabase
    .from("recordings")
    .insert({ session_id, s3_key, status: "pending" })
    .select("id")
    .single();

  if (error || !recording) {
    return NextResponse.json({ error: "Failed to create recording" }, { status: 500 });
  }

  return NextResponse.json({
    upload_url,
    s3_key,
    recording_id: recording.id,
  });
}
