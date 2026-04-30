export type SkillLevel = "beginner" | "intermediate" | "competent" | "advanced";
export type ExtractionStatus = "pending" | "processing" | "ready" | "failed";
export type RecordingStatus = "pending" | "processing" | "ready" | "failed";
export type MessageRole = "user" | "assistant";

export interface Profile {
  id: string;
  full_name: string | null;
  skill_level: SkillLevel | null;
  instruments: string[];
  goals: string[];
  profile_md: string | null;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  artist: string | null;
  instruments: string[];
  instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithSessions extends Project {
  sessions: Pick<Session, "created_at">[];
}

export interface Session {
  id: string;
  project_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ReferenceTrack {
  id: string;
  project_id: string;
  song_name: string | null;
  artist: string | null;
  source_url: string | null;
  s3_key: string | null;
  extraction_status: ExtractionStatus;
  created_at: string;
}

export interface Recording {
  id: string;
  session_id: string;
  s3_key: string;
  duration_seconds: number | null;
  status: RecordingStatus;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  role: MessageRole;
  content: string;
  recording_id: string | null;
  feedback_data: Record<string, unknown> | null;
  created_at: string;
}
