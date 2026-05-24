import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Home,
  Info,
  Briefcase,
  Newspaper,
  Mail,
  Shield,
  PanelBottom,
  Navigation,
  Search,
  Share2,
  Database,
  Server,
  LogOut,
  ChevronRight,
  ChevronsLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Item = { title: string; url: string; icon: typeof Home; exact?: boolean };
type Group = { label: string; items: Item[]; collapsible?: boolean };

const groups: Group[] = [
  {
    label: "Workspace",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard, exact: true },
      { title: "Inbox", url: "/admin/inbox", icon: Mail },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Projects", url: "/admin/projects", icon: FolderKanban },
      { title: "Blog posts", url: "/admin/blog", icon: FileText },
    ],
  },
  {
    label: "Pages",
    collapsible: true,
    items: [
      { title: "Home", url: "/admin/site/home", icon: Home },
      { title: "About", url: "/admin/site/about", icon: Info },
      { title: "Work", url: "/admin/site/work", icon: Briefcase },
      { title: "Blog", url: "/admin/site/blog", icon: Newspaper },
      { title: "Contact info", url: "/admin/site/contact", icon: Mail },
      { title: "Privacy policy", url: "/admin/site/privacy", icon: Shield },
      { title: "Terms of service", url: "/admin/site/terms", icon: Shield },
    ],
  },
  {
    label: "Global",
    items: [
      { title: "Header / Nav", url: "/admin/site/navigation", icon: Navigation },
      { title: "Footer", url: "/admin/site/footer", icon: PanelBottom },
      { title: "Social links", url: "/admin/site/social", icon: Share2 },
      { title: "SEO & meta", url: "/admin/site/seo", icon: Search },
    ],
  },
  {
    label: "System",
    items: [{ title: "Demo data", url: "/admin/system/demo", icon: Database }],
  },
];

export function AdminSidebar({
  email,
  onToggleCollapse,
  collapsed,
}: {
  email?: string | null;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Pages: true,
  });

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/login" });
  }

  if (collapsed) {
    return (
      <aside className="hidden md:flex w-[64px] shrink-0 flex-col border-r border-border bg-card">
        <div className="h-14 flex items-center justify-center border-b border-border">
          <button
            onClick={onToggleCollapse}
            className="w-9 h-9 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 flex flex-col items-center gap-1">
          {groups.flatMap((g) =>
            g.items.map((item) => (
              <Link
                key={item.url}
                to={item.url}
                className={cn(
                  "w-10 h-10 rounded-md flex items-center justify-center transition-colors",
                  isActive(item.url, item.exact)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title={item.title}
              >
                <item.icon className="w-[18px] h-[18px]" />
              </Link>
            ))
          )}
        </nav>
        <div className="p-2 border-t border-border flex justify-center">
          <button
            onClick={signOut}
            className="w-10 h-10 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Sign out"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden md:flex w-[248px] shrink-0 flex-col border-r border-border bg-card">
      <div className="h-14 px-4 flex items-center justify-between border-b border-border">
        <Link to="/admin" className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-[13px]">
            J
          </div>
          <div className="text-[13px] font-semibold tracking-tight truncate">
            Admin console
          </div>
        </Link>
        <button
          onClick={onToggleCollapse}
          className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"
          aria-label="Collapse sidebar"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map((g) => {
          const isOpen = g.collapsible ? openGroups[g.label] ?? false : true;
          return (
            <div key={g.label}>
              <button
                type="button"
                onClick={() =>
                  g.collapsible &&
                  setOpenGroups((s) => ({ ...s, [g.label]: !isOpen }))
                }
                className={cn(
                  "w-full flex items-center justify-between px-2 mb-1.5",
                  g.collapsible && "cursor-pointer hover:opacity-80"
                )}
              >
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {g.label}
                </span>
                {g.collapsible && (
                  <ChevronRight
                    className={cn(
                      "w-3.5 h-3.5 text-muted-foreground transition-transform",
                      isOpen && "rotate-90"
                    )}
                  />
                )}
              </button>
              {isOpen && (
                <div className="space-y-0.5">
                  {g.items.map((item) => {
                    const active = isActive(item.url, item.exact);
                    return (
                      <Link
                        key={item.url}
                        to={item.url}
                        className={cn(
                          "group relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors",
                          active
                            ? "bg-muted text-foreground font-medium"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r bg-primary" />
                        )}
                        <item.icon
                          className={cn(
                            "w-[15px] h-[15px] shrink-0",
                            active ? "text-primary" : ""
                          )}
                        />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        {email && (
          <div className="px-2 pb-2 text-[11px] text-muted-foreground truncate">
            {email}
          </div>
        )}
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="w-[15px] h-[15px]" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
