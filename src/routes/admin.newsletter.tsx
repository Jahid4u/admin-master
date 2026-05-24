import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  adminListSubscribers,
  adminUpdateSubscriber,
  adminDeleteSubscriber,
} from "@/lib/newsletter.functions";
import { PageHeader } from "@/components/admin/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Search, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/newsletter")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  component: NewsletterPage,
});

function NewsletterPage() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: () => adminListSubscribers(),
  });

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "unsubscribed">("all");

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filter === "active" && !r.is_active) return false;
      if (filter === "unsubscribed" && r.is_active) return false;
      if (q && !r.email.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [rows, q, filter]);

  const toggleMut = useMutation({
    mutationFn: (v: { id: string; is_active: boolean }) =>
      adminUpdateSubscriber({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminDeleteSubscriber({ data: { id } }),
    onSuccess: () => {
      toast.success("Subscriber deleted");
      qc.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  function exportCsv() {
    const header = "email,source,is_active,created_at,unsubscribed_at\n";
    const body = filtered
      .map(
        (r) =>
          `${r.email},${r.source},${r.is_active},${r.created_at},${r.unsubscribed_at ?? ""}`
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const activeCount = rows.filter((r) => r.is_active).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Newsletter"
        description={`${activeCount} active · ${rows.length} total subscribers`}
      />

      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <header className="px-5 py-4 border-b border-border flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by email"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1.5">
            {(["all", "active", "unsubscribed"] as const).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>
          <Button variant="outline" onClick={exportCsv} className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Email</th>
                <th className="text-left px-5 py-3 font-medium">Source</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Subscribed</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    No subscribers yet.
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium">{r.email}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.source}</td>
                  <td className="px-5 py-3">
                    {r.is_active ? (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-zinc-500/10 text-zinc-400 border-zinc-500/20">
                        Unsubscribed
                      </Badge>
                    )}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          toggleMut.mutate({ id: r.id, is_active: !r.is_active })
                        }
                        title={r.is_active ? "Unsubscribe" : "Re-activate"}
                      >
                        {r.is_active ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm(`Delete ${r.email}?`)) deleteMut.mutate(r.id);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
