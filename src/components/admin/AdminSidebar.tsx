import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, FolderKanban, FileText, Settings, LogOut } from "lucide-react";
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

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Projects", url: "/admin/projects", icon: FolderKanban },
  { title: "Blog", url: "/admin/blog", icon: FileText },
  { title: "Site Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ email }: { email?: string | null }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const isActive = (url: string) =>
    url === "/admin" ? pathname === "/admin" : pathname.startsWith(url);

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/login" });
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
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
