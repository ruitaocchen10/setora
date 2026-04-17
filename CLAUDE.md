# Setora — Project Context for Claude

## What is Setora?

Setora is an AI-powered music practice assistant. Users create song-based projects, record performances, and receive structured AI coaching feedback tailored to their instrument, skill level, and goals.

Core philosophy: **feedback should feel like a thoughtful human collaborator, not an evaluator** — specific, encouraging, prioritized, actionable. One priority issue per session, always paired with a drill.

---

## Quick Start

```bash
cd frontend
npm run dev        # Dev server at localhost:3000 (PWA disabled in dev)
npm run build      # Production build (generates service worker)
npm start          # Serve production build
```

**Directory layout:**

```
setora/
├── frontend/      # Next.js PWA (this is where you work)
│   ├── src/app/   # App Router pages and layouts
│   └── public/    # Static assets + generated SW files
└── docs/          # Architecture documentation
```

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS, `next-pwa` — deployed to Vercel
- **Backend:** FastAPI (Python) — handles all AI/audio processing; Next.js API routes handle CRUD
- **Queue:** Redis + ARQ or Celery for async audio jobs (client never waits synchronously)
- **DB/Auth:** Supabase (Postgres + auth + realtime)
- **Audio storage:** AWS S3
- **AI models:** Claude (LLM coaching + profile updater agents)

### PWA notes

- `--webpack` flag required in dev and build — `next-pwa` is incompatible with Next.js 16 Turbopack
- Service worker disabled in dev; test PWA with `npm run build && npm start`
- Test microphone access on iOS Safari early

---

## Key Constraints

- **Reference track import:** YouTube URL → server-side audio extraction. YouTube ToS is a legal gray area; needs a cleaner solution before public launch.
- **Analysis:** Distinguishes expression from error (jazz bends, blues notes are not mistakes). Prefer relative improvement over absolute scores.
- **Async everywhere:** All AI pipeline work is queued. UI pattern: submit → loading state → notify when done.
