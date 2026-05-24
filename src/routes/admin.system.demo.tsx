import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importDemoContent } from "@/lib/import-demo.functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/system/demo")({
  component: DemoPage,
});

function DemoPage() {
  const qc = useQueryClient();
  const importFn = useServerFn(importDemoContent);

  const importMut = useMutation({
    mutationFn: () => importFn(),
    onSuccess: (r) => {
      toast.success(`Imported ${r.projectsInserted} projects, ${r.postsInserted} posts`);
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Import failed"),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Demo data</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Seed your portfolio with sample projects and blog posts so you can see how everything looks.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Import demo content</CardTitle>
          <CardDescription>
            Safe to run multiple times — items with existing slugs are skipped, nothing is overwritten.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Adds sample projects and posts to your database.
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
