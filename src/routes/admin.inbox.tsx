import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  adminListSubmissions,
  adminUpdateSubmission,
  adminDeleteSubmission,
} from "@/lib/admin.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/PageHeader";
import { toast } from "sonner";
import { Mail, MailOpen, CheckCircle2, Trash2, Search, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/admin/inbox")({ component: InboxPage });

type Submission = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  source: string;
  is_read: boolean;
  is_replied: boolean;
  created_at: string;
};

function InboxPage() {
  const qc = useQueryClient();
  const list = useServerFn(adminListSubmissions);
  const update = useServerFn(adminUpdateSubmission);
  const remove = useServerFn(adminDeleteSubmission);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "submissions"],
    queryFn: () => list(),
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "replied">("all");
  const [q, setQ] = useState("");

  const updateMut = useMutation({
    mutationFn: (vars: { id: string; is_read?: boolean; is_replied?: boolean }) =>
      update({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "submissions"] }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      setSelectedId(null);
      qc.invalidateQueries({ queryKey: ["admin", "submissions"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const rows: Submission[] = (data ?? []) as Submission[];
  const filtered = rows.filter((r) => {
    if (filter === "unread" && r.is_read) return false;
    if (filter === "replied" && !r.is_replied) return false;
    if (q) {
      const s = q.toLowerCase();
      if (
        !r.name.toLowerCase().includes(s) &&
        !r.email.toLowerCase().includes(s) &&
        !(r.subject ?? "").toLowerCase().includes(s) &&
        !r.message.toLowerCase().includes(s)
      )
        return false;
    }
    return true;
  });

  const selected = filtered.find((r) => r.id === selectedId) ?? null;
  const unreadCount = rows.filter((r) => !r.is_read).length;

  return (
    <div>
      <PageHeader
        title="Inbox"
        description={`Messages from your contact forms. ${unreadCount} unread.`}
      />

      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        {/* List */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="p-3 border-b border-border space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9 h-9"
                  placeholder="Search…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <div className="flex gap-1">
                {(["all", "unread", "replied"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-2.5 py-1 text-xs rounded-md capitalize ${
                      filter === f
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {isLoading ? (
                <p className="p-4 text-sm text-muted-foreground">Loading…</p>
              ) : filtered.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground text-center">No messages.</p>
              ) : (
                filtered.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSelectedId(r.id);
                      if (!r.is_read) updateMut.mutate({ id: r.id, is_read: true });
                    }}
                    className={`w-full text-left px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors ${
                      selectedId === r.id ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {!r.is_read && (
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          )}
                          <span className={`text-sm truncate ${!r.is_read ? "font-semibold" : ""}`}>
                            {r.name}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {r.subject || r.message.slice(0, 60)}
                        </div>
                      </div>
                      <div className="text-[10px] text-muted-foreground shrink-0 text-right">
                        <div>{new Date(r.created_at).toLocaleDateString()}</div>
                        <Badge variant="outline" className="mt-1 text-[9px] py-0 px-1.5 capitalize">
                          {r.source}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detail */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            {!selected ? (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-20">
                <Mail className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm">Select a message to read.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
                  <div>
                    <h3 className="text-lg font-semibold">{selected.subject || "(no subject)"}</h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium text-foreground">{selected.name}</span> &lt;
                      <a href={`mailto:${selected.email}`} className="underline">
                        {selected.email}
                      </a>
                      &gt; · {new Date(selected.created_at).toLocaleString()} · from{" "}
                      <Badge variant="outline" className="capitalize">{selected.source}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateMut.mutate({ id: selected.id, is_read: !selected.is_read })
                      }
                    >
                      {selected.is_read ? (
                        <><Mail className="w-4 h-4 mr-1.5" />Unread</>
                      ) : (
                        <><MailOpen className="w-4 h-4 mr-1.5" />Read</>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant={selected.is_replied ? "default" : "outline"}
                      onClick={() =>
                        updateMut.mutate({ id: selected.id, is_replied: !selected.is_replied })
                      }
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      {selected.is_replied ? "Replied" : "Mark replied"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Delete this message?")) delMut.mutate(selected.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {selected.message}
                </div>

                <div className="pt-4 border-t border-border">
                  <a
                    href={`mailto:${selected.email}?subject=${encodeURIComponent(
                      "Re: " + (selected.subject || "Your message")
                    )}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Reply via email
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
