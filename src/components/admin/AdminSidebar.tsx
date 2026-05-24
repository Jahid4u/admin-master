import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  User,
  Info,
  Mail,
  Share2,
  Database,
  LogOut,
  Search,
  Navigation,
  PanelBottom,
  Briefcase,
  Newspaper,
  Sparkles,
  Shield,
  ScrollText,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const groups = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", url: "/admin", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Content",
    items: [
      { title: "Projects", url: "/admin/projects", icon: FolderKanban },
      { title: "Blog posts", url: "/admin/blog", icon: FileText },
    ],
  },
  {
    label: "Home page",
    items: [
      { title: "Hero section", url: "/admin/site/hero", icon: User },
      { title: "Services", url: "/admin/site/services", icon: Sparkles },
      { title: "About section", url: "/admin/site/about", icon: Info },
    ],
  },
  {
    label: "Other pages",
    items: [
      { title: "Work header", url: "/admin/site/work_header", icon: Briefcase },
      { title: "Blog header", url: "/admin/site/blog_header", icon: Newspaper },
      { title: "Privacy policy", url: "/admin/site/privacy", icon: Shield },
      { title: "Terms of service", url: "/admin/site/terms", icon: ScrollText },
    ],
  },
  {
    label: "Global",
    items: [
      { title: "Navigation", url: "/admin/site/navigation", icon: Navigation },
      { title: "Footer", url: "/admin/site/footer", icon: PanelBottom },
      { title: "Contact info", url: "/admin/site/contact", icon: Mail },
      { title: "Social links", url: "/admin/site/social", icon: Share2 },
      { title: "SEO & meta", url: "/admin/site/seo", icon: Search },
    ],
  },
  {
    label: "System",
    items: [{ title: "Demo data", url: "/admin/system/demo", icon: Database }],
  },
] as const;

export function AdminSidebar({ email }: { email?: string | null }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/login" });
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url, (item as { exact?: boolean }).exact)}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        {!collapsed && email && (
          <div className="px-2 py-1 text-xs text-muted-foreground truncate">{email}</div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut}>
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Sign out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
