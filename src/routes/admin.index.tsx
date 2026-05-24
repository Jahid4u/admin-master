import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminListProjects, adminListPosts } from "@/lib/admin.functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  FileText,
  User,
  Info,
  Mail,
  Share2,
  Database,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const sections = [
  { label: "Hero section", to: "/admin/site/hero", icon: User, desc: "Name, tagline, intro, CTA" },
  { label: "About section", to: "/admin/site/about", icon: Info, desc: "Bio, photo, skills" },
  { label: "Contact info", to: "/admin/site/contact", icon: Mail, desc: "Email, phone, location" },
  { label: "Social links", to: "/admin/site/social", icon: Share2, desc: "Profile URLs" },
] as const;

function AdminDashboard() {
  const listP = useServerFn(adminListProjects);
  const listB = useServerFn(adminListPosts);

  const projects = useQuery({ queryKey: ["admin", "projects"], queryFn: () => listP() });
  const posts = useQuery({ queryKey: ["admin", "posts"], queryFn: () => listB() });

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your portfolio content.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base flex items-center gap-2">
              <FolderKanban className="size-4" /> Projects
            </CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/projects">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{projects.data?.length ?? "—"}</div>
            <p className="text-xs text-muted-foreground mt-1">total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="size-4" /> Blog posts
            </CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/blog">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{posts.data?.length ?? "—"}</div>
            <p className="text-xs text-muted-foreground mt-1">total</p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Site content</h2>
          <p className="text-sm text-muted-foreground">Each section has its own page — edit one thing at a time.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {sections.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group rounded-lg border bg-card p-4 hover:bg-accent transition-colors flex items-start gap-3"
            >
              <s.icon className="size-5 mt-0.5 text-muted-foreground group-hover:text-foreground" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium flex items-center justify-between">
                  {s.label}
                  <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="size-4" /> System
          </CardTitle>
          <CardDescription>Utilities for setting up and maintaining your site.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/system/demo">Open demo data</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
