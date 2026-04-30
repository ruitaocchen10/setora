"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { SearchInput } from "@/components/ui/SearchInput";
import { NewProjectModal } from "@/components/project/NewProjectModal";
import { ProjectWithSessions } from "@/lib/types";

interface ProjectsGridProps {
  projects: ProjectWithSessions[];
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = projects.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.artist ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search projects…"
      />

      {filtered.length === 0 && query ? (
        <p className="text-sm text-muted-foreground">No projects match "{query}".</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((project) => {
            const lastPracticed = project.sessions?.[0]?.created_at ?? null;
            return (
              <Card key={project.id} className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {project.title}
                    </p>
                    {project.artist && (
                      <p className="mt-0.5 text-sm text-muted-foreground truncate">
                        {project.artist}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {lastPracticed ? formatDate(lastPracticed) : "No sessions yet"}
                  </span>
                </div>

                {project.instruments && project.instruments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.instruments.map((inst) => (
                      <span
                        key={inst}
                        className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary capitalize"
                      >
                        {inst}
                      </span>
                    ))}
                  </div>
                )}

                {project.instructions && (
                  <CardContent className="p-0 text-sm italic leading-relaxed line-clamp-2">
                    "{project.instructions}"
                  </CardContent>
                )}

                <a
                  href={`/projects/${project.id}`}
                  className="mt-auto text-sm text-primary cursor-pointer hover:underline"
                >
                  Continue →
                </a>
              </Card>
            );
          })}

          <button
            onClick={() => setShowModal(true)}
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer min-h-[160px]"
          >
            <Plus className="size-5" />
            <span className="text-sm font-medium">New project</span>
          </button>
        </div>
      )}

      {showModal && <NewProjectModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
