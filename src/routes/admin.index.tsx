import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { importDemoContent } from "@/lib/import-demo.functions";
import { adminListProjects, adminListPosts } from "@/lib/admin.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FolderKanban, FileText } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const qc = useQueryClient();
  const listP = useServerFn(adminListProjects);
  const listB = useServerFn(adminListPosts);
  const importFn = useServerFn(importDemoContent);

  const projects = useQuery({ queryKey: ["admin", "projects"], queryFn: () => listP() });
  const posts = useQuery({ queryKey: ["admin", "posts"], queryFn: () => listB() });

  const importMut = useMutation({
    mutationFn: () => importFn(),
    onSuccess: (r) => {
      toast.success(`Imported ${r.projectsInserted} projects, ${r.postsInserted} posts`);
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Import failed"),
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage your portfolio content.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><FolderKanban className="size-4" /> Projects</CardTitle>
            <Button asChild size="sm" variant="outline"><Link to="/admin/projects">Manage</Link></Button>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{projects.data?.length ?? "—"}</div>
            <p className="text-xs text-muted-foreground mt-1">total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><FileText className="size-4" /> Blog posts</CardTitle>
            <Button asChild size="sm" variant="outline"><Link to="/admin/blog">Manage</Link></Button>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{posts.data?.length ?? "—"}</div>
            <p className="text-xs text-muted-foreground mt-1">total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Demo content</CardTitle>
        </CardHeader>
        <CardContent className="flex items-start justify-between gap-4">
          <p className="text-sm text-muted-foreground max-w-md">
            Seed the database with sample projects and blog posts so you can see how things look. Safe to run multiple times — existing slugs are skipped.
          </p>
          <Button onClick={() => importMut.mutate()} disabled={importMut.isPending}>
            <Download className="size-4 mr-1" />
            {importMut.isPending ? "Importing…" : "Import demo"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
