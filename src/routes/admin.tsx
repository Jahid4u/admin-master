import { createFileRoute, Outlet, useNavigate, useRouterState, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronRight, LogOut, ExternalLink, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin" }] }),
  component: AdminLayout,
});

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  projects: "Projects",
  blog: "Blog posts",
  new: "New",
  site: "Site",
  hero: "Hero section",
  services: "Services",
  about: "About",
  contact: "Contact",
  social: "Social links",
  navigation: "Navigation",
  footer: "Footer",
  seo: "SEO & meta",
  work_header: "Work header",
  blog_header: "Blog header",
  privacy: "Privacy",
  terms: "Terms",
  system: "System",
  demo: "Demo data",
  settings: "Settings",
};

function humanize(seg: string) {
  return SEGMENT_LABELS[seg] ?? seg.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
    else if (!isAdmin) navigate({ to: "/" });
  }, [user, isAdmin, loading, navigate]);

  const crumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((seg, i) => ({
      label: humanize(seg),
      href: "/" + parts.slice(0, i + 1).join("/"),
    }));
  }, [pathname]);

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/login" });
  }

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  const initial = (user.email?.[0] ?? "A").toUpperCase();

  return (
    <div className="min-h-[100dvh] flex w-full bg-muted/30">
      <AdminSidebar
        email={user.email}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 shrink-0 bg-background border-b border-border flex items-center px-4 md:px-6 gap-3">
          {/* Mobile sidebar */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="md:hidden w-9 h-9 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"
                aria-label="Open menu"
              >
                <Menu className="w-4 h-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[260px]">
              <AdminSidebar email={user.email} />
            </SheetContent>
          </Sheet>

          {/* Breadcrumbs */}
          <nav className="flex items-center text-[13px] min-w-0 flex-1 overflow-hidden">
            {crumbs.map((c, i) => (
              <div key={c.href} className="flex items-center min-w-0">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-muted-foreground/70 shrink-0" />}
                {i === crumbs.length - 1 ? (
                  <span className="text-foreground font-medium truncate">{c.label}</span>
                ) : (
                  <Link to={c.href} className="text-muted-foreground hover:text-foreground truncate">
                    {c.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[12.5px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View site
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-8 h-8 rounded-full bg-primary/10 text-primary text-[12.5px] font-semibold flex items-center justify-center hover:bg-primary/15 transition-colors">
                {initial}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="text-[13px] font-medium">Signed in</div>
                  <div className="text-[11.5px] text-muted-foreground truncate">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[13px]">
                    <ExternalLink className="w-3.5 h-3.5" /> View public site
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-[13px]">
                  <LogOut className="w-3.5 h-3.5 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}
