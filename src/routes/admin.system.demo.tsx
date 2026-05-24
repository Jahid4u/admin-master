import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importDemoContent, clearDemoContent } from "@/lib/import-demo.functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2, FolderKanban, FileText, Mail, Newspaper } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/system/demo")({
  component: DemoPage,
});

function DemoPage() {
  const qc = useQueryClient();
  const importFn = useServerFn(importDemoContent);
  const clearFn = useServerFn(clearDemoContent);

  const importMut = useMutation({
    mutationFn: () => importFn(),
    onSuccess: (r) => {
      toast.success(
        `Imported ${r.projectsInserted} projects, ${r.postsInserted} posts, ${r.subscribersInserted} subscribers, ${r.messagesInserted} messages`
      );
      qc.invalidateQueries();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Import failed"),
  });

  const clearMut = useMutation({
    mutationFn: () => clearFn(),
    onSuccess: () => {
      toast.success("Demo content removed");
      qc.invalidateQueries();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Clear failed"),
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Demo data</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Seed your site with sample content so you can test every feature end-to-end.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Import demo content</CardTitle>
          <CardDescription>
            Safe to run multiple times — items with existing slugs/emails are skipped, nothing is overwritten.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <Stat icon={FolderKanban} label="Projects" value="4" />
            <Stat icon={FileText} label="Blog posts" value="3" />
            <Stat icon={Newspaper} label="Subscribers" value="6" />
            <Stat icon={Mail} label="Inbox messages" value="4" />
          </div>
          <p className="text-xs text-muted-foreground">
            Each project & post includes full SEO metadata (meta title, description, OG image).
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button onClick={() => importMut.mutate()} disabled={importMut.isPending}>
              <Download className="size-4 mr-1.5" />
              {importMut.isPending ? "Importing…" : "Import demo"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Remove all demo content from projects, posts, subscribers and inbox?"))
                  clearMut.mutate();
              }}
              disabled={clearMut.isPending}
            >
              <Trash2 className="size-4 mr-1.5" />
              {clearMut.isPending ? "Removing…" : "Clear demo"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
      <div className="size-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="size-4" />
      </div>
      <div>
        <div className="text-lg font-semibold leading-none">{value}</div>
        <div className="text-[11px] text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}
