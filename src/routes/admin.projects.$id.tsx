import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { adminGetProject } from "@/lib/admin.functions";
import { ProjectForm, emptyProject, type ProjectFormValues } from "@/components/admin/ProjectForm";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/admin/projects/$id")({
  component: EditProject,
});

type ResultItem = { label: string; value: string };

function toForm(row: Record<string, unknown>): ProjectFormValues {
  const r = row as Record<string, unknown>;
  return {
    ...emptyProject,
    slug: (r.slug as string) ?? "",
    title: (r.title as string) ?? "",
    category: (r.category as string) ?? "",
    year: (r.year as string) ?? "",
    client: (r.client as string) ?? "",
    timeline: (r.timeline as string) ?? "",
    role: (r.role as string) ?? "",
    overview: (r.overview as string) ?? "",
    challenge: (r.challenge as string) ?? "",
    solution: (r.solution as string) ?? "",
    cover: (r.cover as string) ?? null,
    gallery: (r.gallery as string[]) ?? [],
    tags: (r.tags as string[]) ?? [],
    tech: (r.tech as string[]) ?? [],
    results: (r.results as ResultItem[]) ?? [],
    live_url: (r.live_url as string) ?? "",
    repo_url: (r.repo_url as string) ?? "",
    sort_order: (r.sort_order as number) ?? 0,
    published: (r.published as boolean) ?? true,
    meta_title: (r.meta_title as string) ?? "",
    meta_description: (r.meta_description as string) ?? "",
    og_image: (r.og_image as string) ?? null,
  };
}

function EditProject() {
  const { id } = Route.useParams();
  const getFn = useServerFn(adminGetProject);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "project", id],
    queryFn: () => getFn({ data: { id } }),
  });

  return (
    <div className="space-y-4">
      <Link to="/admin/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" /> Back to projects
      </Link>
      <h1 className="text-2xl font-semibold">Edit project</h1>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !data ? (
        <p className="text-sm text-muted-foreground">Not found.</p>
      ) : (
        <ProjectForm id={id} initial={toForm(data as Record<string, unknown>)} />
      )}
    </div>
  );
}
