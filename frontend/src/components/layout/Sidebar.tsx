"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  FolderOpen,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Home", icon: Home, href: "/app" },
  { label: "Projects", icon: FolderOpen, href: "/projects" },
  { label: "Profile", icon: User, href: "/profile" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

interface RecentProject {
  id: string;
  title: string;
  artist: string | null;
}

interface SidebarProps {
  user: { name: string | null; email: string | null };
  recentProjects: RecentProject[];
}

export function Sidebar({ user, recentProjects }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const initials = user.name ? user.name.charAt(0).toUpperCase() : "?";

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-60"
      } m-3 flex flex-col bg-surface rounded-xl border border-border transition-all duration-200 ease-in-out shrink-0`}
    >
      {/* Top: Logo + toggle */}
      <div className={`flex items-center py-5 px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="" width={602} height={602} className="size-6" />
            <span className="text-lg font-semibold text-foreground tracking-tight">
              Setora
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </div>

      {/* Nav links */}
      <nav className="py-3 overflow-hidden">
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center py-2.5 mx-2 rounded-full transition-colors cursor-pointer
                ${collapsed ? "justify-center px-3" : "gap-3 px-3"}
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }
              `}
            >
              {collapsed ? (
                <Icon className="size-5" />
              ) : (
                <>
                  <Icon className="size-4 shrink-0" />
                  <span className="text-sm font-medium whitespace-nowrap">{label}</span>
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Recents */}
      <div className="flex-1 overflow-hidden">
        {!collapsed && (
          <p className="px-5 pt-4 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Recent
          </p>
        )}
        <div className="py-1">
          {recentProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              title={collapsed ? (project.artist ? `${project.title} — ${project.artist}` : project.title) : undefined}
              className={`flex items-center py-2 mx-2 rounded-full transition-colors cursor-pointer text-muted-foreground hover:text-foreground hover:bg-white/5
                ${collapsed ? "justify-center px-3" : "px-3"}
              `}
            >
              {collapsed ? (
                <span className="size-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
              ) : (
                <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  {project.title}
                  {project.artist && (
                    <span className="text-muted-foreground/60"> — {project.artist}</span>
                  )}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom: User info */}
      <div
        className={`p-4 flex items-center gap-3 ${
          collapsed ? "flex-col" : ""
        }`}
      >
        <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
          {initials}
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">
              {user.name ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email ?? "—"}
            </p>
          </div>
        )}
        <button
          onClick={handleSignOut}
          title="Sign out"
          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-white/5 transition-colors cursor-pointer shrink-0"
          aria-label="Sign out"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </aside>
  );
}
