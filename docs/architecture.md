# Setora — Architecture

## Overview

Setora is an AI-powered music practice assistant. Users create song-based projects, record performances or sessions, and receive structured coaching feedback from an AI pipeline that simulates a teacher-student dynamic. All heavy processing is async — the client never waits synchronously for audio analysis.

---

## Tech Stack

### Frontend

- **Framework:** Next.js (App Router)
- **PWA:** `next-pwa` + Workbox (service worker disabled in dev; test PWA against `next build && next start`)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

### Backend / API

- **User-facing CRUD:** Next.js API routes (projects, sessions, feedback retrieval)
- **AI pipeline service:** FastAPI (Python) — handles all audio processing and AI work
- **Job queue:** Redis + ARQ or Celery for async audio processing jobs

### Infrastructure

- **MVP:** Supabase (PostgreSQL, auth, realtime)
- **Audio storage:** AWS S3
- **Scale path:** Full AWS managed services (RDS, SQS, ECS) as needed

---

## System Layers

1. **Client** — Next.js PWA (mobile + web)
2. **API Gateway** — Auth, routing, rate limiting (Next.js middleware or Nginx)
3. **Core services** — User, Project, Recording, Reference ingestion, Feedback, Progress
4. **AI pipeline** — Source separation → Pitch/timing analysis → LLM coaching agent → Profile updater agent
5. **Data layer** — Postgres, object storage, memory store

---

## AI Pipeline

Sequential steps triggered on each recording submission:

1. **Source separation** — Run Demucs on the raw recording to isolate vocal and instrument tracks
2. **Pitch + timing analysis** — Per-track metrics compared against the reference track (instrument-aware)
3. **LLM coaching agent** — Receives analysis data + user profile + project context + session caption note; outputs structured feedback
4. **Profile updater agent** — Runs asynchronously post-session; writes delta updates to the user's `.md` profile

### Feedback schema (LLM output)

```json
{
  "priority_issue": "string",
  "explanation": "string",
  "drill": "string",
  "session_note": "string"
}
```

---

## Data Stores

| Store         | Purpose                                              |
| ------------- | ---------------------------------------------------- |
| User DB       | Profiles, instruments, goals, preferences            |
| Project DB    | Songs, sessions, recordings, caption notes, feedback |
| Audio storage | Raw recordings and reference tracks (object store)   |
| Memory store  | Per-user `.md` profile files passed as AI context    |

---

## Key Async Flow

```
Client submits recording
  → API queues job (Redis)
  → Client shows loading state
  → FastAPI worker processes job (Demucs → analysis → LLM)
  → Realtime notification to client when complete
  → Client fetches and displays feedback
```

---

## Scale Path

- **Auth & DB:** Supabase → AWS RDS
- **Job queue:** ARQ/Celery on Redis → AWS SQS + ECS workers
- **API service:** Single FastAPI instance → ECS/Fargate with auto-scaling
