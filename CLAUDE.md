# Setora — Project Context for Claude

## What is Setora?

Setora is an AI-powered music practice assistant that simulates a
teacher-student learning environment. Users create song-based projects,
record their performances, and receive structured AI-generated coaching
feedback tailored to their instrument, skill level, and goals.

The core product philosophy: **the AI should feel like a thoughtful
human collaborator, not an evaluator.** Feedback should be specific,
encouraging, prioritized, and actionable — like a good music teacher,
not a scoring engine.

---

## Tech Stack

### Frontend

- **Framework:** Next.js (App Router)
- **PWA:** `next-pwa` with Workbox for service worker and manifest generation
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

The app is a Progressive Web App (PWA) to avoid app store friction during
early development while still supporting mobile installation, offline
capability, and a native-feel experience.

Key PWA notes:

- Service worker is disabled in development mode (to preserve hot reloading)
- Test PWA features against `next build && next start`, not `next dev`
- Test microphone access on iOS Safari early — it works but requires care

### Backend / API

- **Framework:** FastAPI (Python) for the AI pipeline service
- **Next.js API routes:** Handle user-facing CRUD (projects, sessions,
  feedback retrieval)
- **FastAPI svc:** Handles all heavy AI / audio processing work
- **Job queue:** Redis + ARQ or Celery for async audio processing jobs

All AI pipeline operations are async — the client never waits
synchronously for audio analysis to complete. Flow: submit → queue job
→ show loading state → notify when done.

### Database & Storage

- **MVP:** Supabase (PostgreSQL, auth, file storage, realtime)
- **Audio storage:** Migrate audio files to AWS S3 as soon as Supabase
  storage becomes a limitation
- **Scale:** Evaluate moving to full AWS managed services (RDS, S3, SQS,
  ECS) as needed

Data stores:

- User DB — profiles, instruments, goals, preferences
- Project DB — songs, sessions, recordings, caption notes, feedback
- Audio storage — raw recordings and reference tracks (object store)
- Memory store — per-user .md profile files for AI context

---

## Architecture Overview

### Layers

1. **Client** — Next.js PWA (mobile + web)
2. **API Gateway** — Auth, routing, rate limiting (Next.js middleware or Nginx)
3. **Core services** — User, Project, Recording, Reference ingestion,
   Feedback, Progress
4. **AI pipeline** — Source separation → Pitch/timing analysis → LLM
   coaching agent → Profile updater agent
5. **Data layer** — Postgres, object storage, memory store

### AI Pipeline (sequential)

1. **Source separation** — Run Demucs on raw recording to isolate vocal
   and instrument tracks
2. **Pitch + timing analysis** — Per-track metrics against the reference
   track (instrument-aware)
3. **LLM coaching agent** — Receives analysis data + user profile +
   project context + session caption note; outputs structured feedback
4. **Profile updater agent** — Runs asynchronously post-session; writes
   delta updates to user .md profile

Feedback schema (LLM output format):

```json
{
  "priority_issue": "string",
  "explanation": "string",
  "drill": "string",
  "session_note": "string"
}
```

---

## Key Product Decisions

### Onboarding

- Users pick all instruments they play + whether they sing; MVP limited
  to voice + a couple instruments
- Instruments can be added/changed in profile at any time; adding a new
  one prompts a baseline test
- Skill level uses behavioral descriptions, not ambiguous labels (e.g.
  "I can play songs start to finish with some stumbling")
- Goals are preset options + free-text field
- Post-MVP: baseline musical test (pitch-matching, range assessment) to
  seed profile with real data

### User Profile / Memory

- Each user has a personal .md profile file passed as context to the LLM
  coaching agent on every session
- Profile updates are incremental (delta writes), not full replacements,
  to bound token costs
- Profile stores distilled insights, not raw session data (e.g. "user
  consistently struggles with tempo in fast passages")

### Project Creation

- Each song is a "project" that tracks progress over time
- **MVP reference track import:** YouTube URL paste; audio extracted
  server-side for analysis only (not stored long-term)
- Note: YouTube ToS is a legal gray area; need a cleaner solution before
  public launch (licensed music API or direct file upload)
- **Project knowledge section:** Key, tempo, style notes,
  instrument/part, current focus area (e.g. "working on just the chorus")

### Recording

- Pre-recording soundcheck: test for signal level, background noise, and
  expected frequency ranges before capturing a take
- Users add a caption/note per recording to give the AI extra context
  (e.g. "went faster than usual")
- Source separation via Demucs runs server-side on submission

### Performance Analysis

- Analysis is instrument-aware: pitch accuracy for voice/melodic
  instruments; timing/groove for rhythmic instruments
- Thresholds are realistic for human-made music; style/genre context from
  the project informs what "accuracy" means
- The system distinguishes expression from error (e.g. jazz bends,
  blues notes)
- Prefer relative improvement over absolute scores; consider not showing
  numeric scores at all in early versions
- AI focuses on one priority issue per session rather than listing all
  problems
- Feedback includes a specific drill or exercise, not just diagnosis
