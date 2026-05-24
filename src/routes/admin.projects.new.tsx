import { createFileRoute, Link } from "@tanstack/react-router";
import { ProjectForm, emptyProject } from "@/components/admin/ProjectForm";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/admin/projects/new")({
  component: NewProject,
});

function NewProject() {
  return (
    <div className="space-y-4">
      <Link to="/admin/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" /> Back to projects
      </Link>
      <h1 className="text-2xl font-semibold">New project</h1>
      <ProjectForm initial={emptyProject} />
    </div>
  );
}
