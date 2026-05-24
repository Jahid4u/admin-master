import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListProjects, adminDeleteProject } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/projects/")({
  component: ProjectsList,
});

function ProjectsList() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListProjects);
  const delFn = useServerFn(adminDeleteProject);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: () => listFn(),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground">Showcase pieces displayed on /work.</p>
        </div>
        <Button asChild><Link to="/admin/projects/new"><Plus className="size-4 mr-1" />New project</Link></Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !data || data.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          No projects yet. Create one or use “Import demo” on the dashboard.
        </Card>
      ) : (
        <div className="border rounded-md divide-y">
          {data.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3">
              <div className="size-12 rounded bg-muted overflow-hidden shrink-0">
                {p.cover && <img src={p.cover} alt="" className="size-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{p.title}</span>
                  {!p.published && <Badge variant="secondary">Draft</Badge>}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  /{p.slug} · {p.category || "—"} · {p.year || "—"}
                </div>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link to="/admin/projects/$id" params={{ id: p.id }}>
                  <Pencil className="size-4" />
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="size-4" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                    <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => delMut.mutate(p.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
