export type Instrument = "voice" | "guitar" | "piano";

export interface Project {
  id: string;
  title: string;
  artist: string;
  instruments: Instrument[];
  lastPracticed: string;
  sessionCount: number;
  currentFocus: string;
}

export interface Session {
  id: string;
  projectId: string;
  projectTitle: string;
  date: string;
  durationMin: number;
  feedbackPreview: string;
}

export interface Stats {
  practiceStreakDays: number;
  sessionsThisWeek: number;
  minutesThisWeek: number;
  totalProjects: number;
}

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Blackbird",
    artist: "The Beatles",
    instruments: ["guitar", "voice"],
    lastPracticed: "2026-04-19",
    sessionCount: 12,
    currentFocus: "Fingerpicking consistency in the bridge",
  },
  {
    id: "2",
    title: "Clair de Lune",
    artist: "Claude Debussy",
    instruments: ["piano"],
    lastPracticed: "2026-04-18",
    sessionCount: 7,
    currentFocus: "Dynamics in the opening arpeggios",
  },
  {
    id: "3",
    title: "Fast Car",
    artist: "Tracy Chapman",
    instruments: ["guitar", "voice"],
    lastPracticed: "2026-04-16",
    sessionCount: 5,
    currentFocus: "Strumming rhythm stays consistent at tempo",
  },
  {
    id: "4",
    title: "Hallelujah",
    artist: "Leonard Cohen",
    instruments: ["voice", "guitar"],
    lastPracticed: "2026-04-14",
    sessionCount: 9,
    currentFocus: "Breath control on sustained notes",
  },
  {
    id: "5",
    title: "Comptine d'un autre été",
    artist: "Yann Tiersen",
    instruments: ["piano"],
    lastPracticed: "2026-04-10",
    sessionCount: 3,
    currentFocus: "Right hand melody clarity over left hand pattern",
  },
];

export const mockSessions: Session[] = [
  {
    id: "s1",
    projectId: "1",
    projectTitle: "Blackbird",
    date: "2026-04-19",
    durationMin: 24,
    feedbackPreview:
      "Your thumb independence improved noticeably — the bass line held steady while the melody moved. Next: try the verse at full tempo without stopping.",
  },
  {
    id: "s2",
    projectId: "2",
    projectTitle: "Clair de Lune",
    date: "2026-04-18",
    durationMin: 18,
    feedbackPreview:
      "The pp passages in bars 5–8 were much more controlled than last session. The crescendo into bar 15 still rushes slightly — slow it down by 10%.",
  },
  {
    id: "s3",
    projectId: "3",
    projectTitle: "Fast Car",
    date: "2026-04-16",
    durationMin: 31,
    feedbackPreview:
      "Chord transitions are clean at 90 BPM. The stumble between G and Cadd9 is the one thing to drill — 5 minutes of just that change will fix it.",
  },
];

export const mockStats: Stats = {
  practiceStreakDays: 6,
  sessionsThisWeek: 4,
  minutesThisWeek: 73,
  totalProjects: 5,
};

export const mockUser = {
  name: "Ruitao",
  email: "ruitaocchen@gmail.com",
};

export interface ChatMessage {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: string;
}

export const mockChatMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "ai",
    content:
      "Great session today. Your thumb independence in the bridge section improved noticeably — you're no longer rushing the bass note before the melody. Focus drill for next time: play bars 9–12 at 60 BPM, thumb only, 5 minutes.",
    timestamp: "2026-04-19T14:32:00Z",
  },
  {
    id: "m2",
    role: "user",
    content: "Should I also work on the transition into the final verse?",
    timestamp: "2026-04-19T14:33:00Z",
  },
  {
    id: "m3",
    role: "ai",
    content:
      "Not yet — keep the bridge consistent first. Once bars 9–12 are clean at 80 BPM, the verse transition will feel easier since the fingering pattern is similar.",
    timestamp: "2026-04-19T14:33:30Z",
  },
  {
    id: "m4",
    role: "ai",
    content:
      "Ready when you are. Hit record and play through the bridge when you feel warmed up.",
    timestamp: "2026-04-19T14:34:00Z",
  },
];
