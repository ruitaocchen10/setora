# Setora — UI Wireframes

Screens to cover:
1. Onboarding
2. Home / Project List
3. Project Detail
4. Recording Screen
5. Feedback Screen
6. Profile / Settings

---

## 1. Onboarding

Multi-step flow centered on the page. Fixed-width card (~480px) centered horizontally and vertically. Progress dots at the top of the card. Back link top-left on all steps except welcome.

---

### 1a. Welcome

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                        [ logo ]                             │
│                                                             │
│                         Setora                              │
│               Your music practice companion                 │
│                                                             │
│                  ┌──────────────────────┐                   │
│                  │      Get started     │                   │
│                  └──────────────────────┘                   │
│                                                             │
│               Already have an account? Sign in              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 1b. Instruments  `● ○ ○ ○`

```
┌─────────────────────────────────────────────────────────────┐
│                      ● ○ ○ ○                                │
│                                                             │
│  What do you play?                                          │
│  Select all that apply.                                     │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Voice     │  │   Guitar    │  │    Piano    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│                  ┌──────────────────────┐                   │
│                  │       Continue       │                   │
│                  └──────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

Notes:
- Tiles toggle selection (highlighted border + checkmark)
- "Other…" opens an inline text input
- Continue disabled until at least one tile selected

---

### 1c. Skill level  `● ● ○ ○`

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                  ● ● ○ ○                            │
│                                                             │
│  How would you describe your playing?                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ○  Just starting out                               │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ○  I can play songs start to finish with some      │    │
│  │     stumbling                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ○  I play confidently — working on polishing       │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ○  Advanced — pushing my limits                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│                  ┌──────────────────────┐                   │
│                  │       Continue       │                   │
│                  └──────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

Notes:
- Single select; full row tappable
- Continue disabled until one option selected

---

### 1d. Goals  `● ● ● ○`

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                  ● ● ● ○                            │
│                                                             │
│  What are you working toward?                               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  □  Perform a song for someone                      │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  □  Play for my own enjoyment                       │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  □  Play with others or join a band                 │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  □  Improve a specific skill                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Anything else?                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│                  ┌──────────────────────┐                   │
│                  │        Finish        │                   │
│                  └──────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

Notes:
- Multi-select checkboxes; free text optional
- Finish always enabled (goals can be skipped)

---

### 1e. All set  `● ● ● ●`

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                           ✓                                 │
│                                                             │
│                   You're all set, [Name]!                   │
│                                                             │
│             Start by adding your first song project.        │
│                                                             │
│                  ┌──────────────────────┐                   │
│                  │   Create a project   │                   │
│                  └──────────────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Home / Project List

Persistent left sidebar for navigation. Main content area shows project cards in a grid.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌─────────────┐  ┌────────────────────────────────────────────────────┐    │
│  │             │  │  My Projects                  + New Project        │    │
│  │  [ logo ]   │  │                                                    │    │
│  │             │  │  ┌──────────────────┐  ┌──────────────────┐        │    │
│  │  ─────────  │  │  │                  │  │                  │        │    │
│  │             │  │  │  Blackbird       │  │  Gravity         │        │    │
│  │  Projects   │  │  │  Beatles         │  │  John Mayer      │        │    │
│  │             │  │  │                  │  │                  │        │    │
│  │  Profile    │  │  │  Guitar          │  │  Guitar + Voice  │        │    │
│  │             │  │  │  Last: 2 days ago│  │  Last: 1 week ago│        │    │
│  │  Settings   │  │  └──────────────────┘  └──────────────────┘        │    │
│  │             │  │                                                    │    │
│  │             │  │  ┌──────────────────┐  ┌──────────────────┐        │    │
│  │             │  │  │                  │  │                  │        │    │
│  │             │  │  │  Clair de Lune   │  │  + New Project   │        │    │
│  │             │  │  │  Debussy         │  │                  │        │    │
│  │             │  │  │                  │  │                  │        │    │
│  │             │  │  │  Piano           │  │                  │        │    │
│  │             │  │  │  Last: yesterday │  │                  │        │    │
│  │             │  │  └──────────────────┘  └──────────────────┘        │    │
│  │             │  │                                                    │    │
│  └─────────────┘  └────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

Notes:
- "New Project" button top-right of content area, and also as a ghost card in the grid
- Project card shows: song name, artist, instrument(s), last practiced date
- Clicking a card navigates to Project Detail
- No progress scores shown on cards (per decision to avoid numeric scoring early on)
- Empty state (no projects yet): full-width prompt to create first project

---

### 2b. New Project Modal

Opens as a centered modal over the project list (not a new page).

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  (dimmed project list behind)                                                │
│                                                                              │
│              ┌──────────────────────────────────────────┐                   │
│              │  New Project                          ✕  │                   │
│              │                                          │                   │
│              │  Song name                               │                   │
│              │  ┌────────────────────────────────────┐  │                   │
│              │  │                                    │  │                   │
│              │  └────────────────────────────────────┘  │                   │
│              │                                          │                   │
│              │  Artist  (optional)                      │                   │
│              │  ┌────────────────────────────────────┐  │                   │
│              │  │                                    │  │                   │
│              │  └────────────────────────────────────┘  │                   │
│              │                                          │                   │
│              │  Instrument                              │                   │
│              │  ┌────────────────────────────────────┐  │                   │
│              │  │  Voice                           ▾  │  │                   │
│              │  └────────────────────────────────────┘  │                   │
│              │                                          │                   │
│              │  Reference track  (optional)             │                   │
│              │  ┌────────────────────────────────────┐  │                   │
│              │  │  Paste YouTube URL                 │  │                   │
│              │  └────────────────────────────────────┘  │                   │
│              │                                          │                   │
│              │  ┌────────────────────────────────────┐  │                   │
│              │  │         Create Project             │  │                   │
│              │  └────────────────────────────────────┘  │                   │
│              └──────────────────────────────────────────┘                   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

Notes:
- Instrument dropdown limited to MVP options: Voice, Guitar, Piano
- Reference track URL is optional — user can add it later from Project Detail
- Key, tempo, and focus area are post-creation fields set inside the project (not required to get started)
- Create button disabled until song name and instrument are filled

---

## 3. Project Detail

Same sidebar as Home. Main content split into a project info panel (left) and session history (right).

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌─────────────┐  ┌────────────────────────────────────────────────────┐    │
│  │             │  │  ← My Projects                                     │    │
│  │  [ logo ]   │  │                                                    │    │
│  │             │  │  Blackbird                              ··· (edit) │    │
│  │  ─────────  │  │  The Beatles · Guitar                              │    │
│  │             │  │  ────────────────────────────────────────────────  │    │
│  │  Projects   │  │                                                    │    │
│  │             │  │  ┌─────────────────────┐  ┌────────────────────┐   │    │
│  │  Profile    │  │  │  Project info       │  │  Sessions          │   │    │
│  │             │  │  │                     │  │                    │   │    │
│  │  Settings   │  │  │  Key      A minor   │  │  ┌──────────────┐  │   │    │
│  │             │  │  │  Tempo    120 bpm   │  │  │ Apr 15       │  │   │    │
│  │             │  │  │  Focus    Intro     │  │  │ "went faster  │  │   │    │
│  │             │  │  │           riff      │  │  │  than usual" │  │   │    │
│  │             │  │  │                     │  │  │              │  │   │    │
│  │             │  │  │  Reference track    │  │  │  Feedback ›  │  │   │    │
│  │             │  │  │  [ YouTube link ]   │  │  └──────────────┘  │   │    │
│  │             │  │  │                     │  │  ┌──────────────┐  │   │    │
│  │             │  │  │                     │  │  │ Apr 12       │  │   │    │
│  │             │  │  │                     │  │  │ "first take" │  │   │    │
│  │             │  │  │                     │  │  │              │  │   │    │
│  │             │  │  │                     │  │  │  Feedback ›  │  │   │    │
│  │             │  │  │                     │  │  └──────────────┘  │   │    │
│  │             │  │  │                     │  │                    │   │    │
│  │             │  │  │                     │  │  ┌──────────────┐  │   │    │
│  │             │  │  │                     │  │  │ + New session│  │   │    │
│  │             │  │  │                     │  │  └──────────────┘  │   │    │
│  │             │  │  └─────────────────────┘  └────────────────────┘   │    │
│  └─────────────┘  └────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

Notes:
- Project info panel: key, tempo, focus area, reference track — all editable inline
- Sessions list ordered newest first; each card shows date, caption note, and a "Feedback ›" link
- "Feedback ›" navigates to the Feedback screen for that session
- If feedback is still processing, show a loading state instead of "Feedback ›"
- "New session" button at the bottom of the session list navigates to the Recording screen
- `···` menu top-right for edit project name / delete project

---

## 4. Recording Screen

Three sequential states: Soundcheck → Recording → Review & Submit.

---

### 4a. Soundcheck

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌─────────────┐  ┌────────────────────────────────────────────────────┐    │
│  │             │  │  ← Blackbird                                       │    │
│  │  [ logo ]   │  │                                                    │    │
│  │             │  │  New Session                                       │    │
│  │  ─────────  │  │  ────────────────────────────────────────────────  │    │
│  │             │  │                                                    │    │
│  │  Projects   │  │           Let's check your audio first.           │    │
│  │             │  │                                                    │    │
│  │  Profile    │  │   Signal level                                     │    │
│  │             │  │   ████████████░░░░░░░░  Good                       │    │
│  │  Settings   │  │                                                    │    │
│  │             │  │   Background noise                                 │    │
│  │             │  │   ███░░░░░░░░░░░░░░░░  Quiet ✓                     │    │
│  │             │  │                                                    │    │
│  │             │  │   Microphone                                       │    │
│  │             │  │   ██████████████░░░░░  Detected ✓                  │    │
│  │             │  │                                                    │    │
│  │             │  │                                                    │    │
│  │             │  │           ┌──────────────────────┐                 │    │
│  │             │  │           │   Looks good, record │                 │    │
│  │             │  │           └──────────────────────┘                 │    │
│  │             │  │                                                    │    │
│  │             │  │           Skip soundcheck                          │    │
│  └─────────────┘  └────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

Notes:
- Checks run automatically on page load (no manual trigger)
- "Looks good, record" enabled once signal and mic pass; background noise is advisory only
- "Skip soundcheck" always available

---

### 4b. Recording

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌─────────────┐  ┌────────────────────────────────────────────────────┐    │
│  │             │  │  ← Blackbird                                       │    │
│  │  [ logo ]   │  │                                                    │    │
│  │             │  │  Recording…  0:32                                  │    │
│  │  ─────────  │  │  ────────────────────────────────────────────────  │    │
│  │             │  │                                                    │    │
│  │  Projects   │  │   ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿    │    │
│  │             │  │   (live waveform)                                  │    │
│  │  Profile    │  │                                                    │    │
│  │             │  │                                                    │    │
│  │  Settings   │  │                    ┌───┐                           │    │
│  │             │  │                    │ ■ │  Stop                     │    │
│  │             │  │                    └───┘                           │    │
│  │             │  │                                                    │    │
│  └─────────────┘  └────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

Notes:
- Live waveform scrolls as audio comes in
- Timer counts up
- Only action available is Stop — no pause

---

### 4c. Review & Submit

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌─────────────┐  ┌────────────────────────────────────────────────────┐    │
│  │             │  │  ← Blackbird                                       │    │
│  │  [ logo ]   │  │                                                    │    │
│  │             │  │  Review your take                                  │    │
│  │  ─────────  │  │  ────────────────────────────────────────────────  │    │
│  │             │  │                                                    │    │
│  │  Projects   │  │   ▶  ──────────────────────────────────  0:47      │    │
│  │             │  │      (playback scrubber)                           │    │
│  │  Profile    │  │                                                    │    │
│  │             │  │   Add a note  (optional)                           │    │
│  │  Settings   │  │   ┌────────────────────────────────────────────┐   │    │
│  │             │  │   │  e.g. "went faster than usual, missed the  │   │    │
│  │             │  │   │        bridge chord"                       │   │    │
│  │             │  │   └────────────────────────────────────────────┘   │    │
│  │             │  │                                                    │    │
│  │             │  │   ┌──────────────────────┐                         │    │
│  │             │  │   │   Submit for feedback│                         │    │
│  │             │  │   └──────────────────────┘                         │    │
│  │             │  │                                                    │    │
│  │             │  │   Re-record                                        │    │
│  │             │  │                                                    │    │
│  └─────────────┘  └────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

Notes:
- Playback lets user listen before submitting
- Caption note is optional but prompted with examples
- "Submit for feedback" queues the async AI pipeline and returns user to Project Detail
- "Re-record" discards the take and returns to Soundcheck

---

## 5. Feedback Screen

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌─────────────┐  ┌────────────────────────────────────────────────────┐    │
│  │             │  │  ← Blackbird                                       │    │
│  │  [ logo ]   │  │                                                    │    │
│  │             │  │  Session · Apr 15                                  │    │
│  │  ─────────  │  │  "went faster than usual, missed the bridge chord" │    │
│  │             │  │  ────────────────────────────────────────────────  │    │
│  │  Projects   │  │                                                    │    │
│  │             │  │  Focus for this session                            │    │
│  │  Profile    │  │  ┌──────────────────────────────────────────────┐  │    │
│  │             │  │  │  Your chord transitions are slowing you down  │  │    │
│  │  Settings   │  │  │  in the bridge — specifically the Am → F      │  │    │
│  │             │  │  │  change. Everything else is sounding solid.   │  │    │
│  │             │  │  └──────────────────────────────────────────────┘  │    │
│  │             │  │                                                    │    │
│  │             │  │  Try this drill                                    │    │
│  │             │  │  ┌──────────────────────────────────────────────┐  │    │
│  │             │  │  │  Isolate just the Am → F transition. Play it  │  │    │
│  │             │  │  │  slowly (60 bpm) 10 times, then speed up 5   │  │    │
│  │             │  │  │  bpm at a time until you're at tempo.        │  │    │
│  │             │  │  └──────────────────────────────────────────────┘  │    │
│  │             │  │                                                    │    │
│  │             │  │  Session note                                      │    │
│  │             │  │  ┌──────────────────────────────────────────────┐  │    │
│  │             │  │  │  Good energy in this take — the intro riff   │  │    │
│  │             │  │  │  is noticeably cleaner than last time.       │  │    │
│  │             │  │  └──────────────────────────────────────────────┘  │    │
│  │             │  │                                                    │    │
│  │             │  │  ┌──────────────────────┐                          │    │
│  │             │  │  │    Record again      │                          │    │
│  │             │  │  └──────────────────────┘                          │    │
│  └─────────────┘  └────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

Notes:
- Three distinct sections map directly to the feedback schema: priority issue + explanation, drill, session note
- No numeric scores anywhere
- "Record again" goes straight to Recording screen for the same project
- If feedback is still processing, show a spinner with "Analyzing your recording…" in place of content

---

## 6. Profile / Settings

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ┌─────────────┐  ┌────────────────────────────────────────────────────┐    │
│  │             │  │  Profile                                           │    │
│  │  [ logo ]   │  │  ────────────────────────────────────────────────  │    │
│  │             │  │                                                    │    │
│  │  ─────────  │  │  Name                                              │    │
│  │             │  │  ┌────────────────────────────────────────────┐   │    │
│  │  Projects   │  │  │  Alex                                      │   │    │
│  │             │  │  └────────────────────────────────────────────┘   │    │
│  │  Profile    │  │                                                    │    │
│  │  ▶          │  │  Instruments                                       │    │
│  │  Settings   │  │  ┌──────────┐  ┌──────────┐                        │    │
│  │             │  │  │ Guitar ✓ │  │ + Add    │                        │    │
│  │             │  │  └──────────┘  └──────────┘                        │    │
│  │             │  │                                                    │    │
│  │             │  │  Skill level                                       │    │
│  │             │  │  ┌────────────────────────────────────────────┐   │    │
│  │             │  │  │  I can play songs start to finish with  ▾  │   │    │
│  │             │  │  │  some stumbling                            │   │    │
│  │             │  │  └────────────────────────────────────────────┘   │    │
│  │             │  │                                                    │    │
│  │             │  │  Goals                                             │    │
│  │             │  │  ┌────────────────────────────────────────────┐   │    │
│  │             │  │  │  Perform a song for someone             ✓  │   │    │
│  │             │  │  │  Play for enjoyment                     ✓  │   │    │
│  │             │  │  └────────────────────────────────────────────┘   │    │
│  │             │  │                                                    │    │
│  │             │  │  ────────────────────────────────────────────────  │    │
│  │             │  │                                                    │    │
│  │             │  │  Account                           Sign out        │    │
│  │             │  │  ruitaocchen@gmail.com                             │    │
│  │             │  │                                                    │    │
│  └─────────────┘  └────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

Notes:
- All fields editable inline; save on blur or with an explicit Save button
- Adding a new instrument triggers a baseline session prompt (post-MVP)
- Goals and skill level use the same options as onboarding
- Account section at the bottom for sign out; no separate settings page needed for MVP
