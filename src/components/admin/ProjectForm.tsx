import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { adminUpsertProject } from "@/lib/admin.functions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "./ImageUploader";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

type ResultItem = { label: string; value: string };

export type ProjectFormValues = {
  slug: string;
  title: string;
  category: string;
  year: string;
  client: string;
  timeline: string;
  role: string;
  overview: string;
  challenge: string;
  solution: string;
  cover: string | null;
  gallery: string[];
  tags: string[];
  tech: string[];
  results: ResultItem[];
  live_url: string;
  repo_url: string;
  sort_order: number;
  published: boolean;
  meta_title: string;
  meta_description: string;
  og_image: string | null;
};

export const emptyProject: ProjectFormValues = {
  slug: "", title: "", category: "", year: "", client: "", timeline: "", role: "",
  overview: "", challenge: "", solution: "", cover: null, gallery: [], tags: [],
  tech: [], results: [], live_url: "", repo_url: "", sort_order: 0, published: true,
  meta_title: "", meta_description: "", og_image: null,
};

export function ProjectForm({ id, initial }: { id?: string; initial: ProjectFormValues }) {
  const [v, setV] = useState<ProjectFormValues>(initial);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const upsert = useServerFn(adminUpsertProject);

  const mut = useMutation({
    mutationFn: () => upsert({
      data: {
        id,
        values: {
          ...v,
          category: v.category || null,
          year: v.year || null,
          client: v.client || null,
          timeline: v.timeline || null,
          role: v.role || null,
          overview: v.overview || null,
          challenge: v.challenge || null,
          solution: v.solution || null,
          cover: v.cover || null,
          live_url: v.live_url || null,
          repo_url: v.repo_url || null,
          meta_title: v.meta_title || null,
          meta_description: v.meta_description || null,
          og_image: v.og_image || null,
        },
      },
    }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      navigate({ to: "/admin/projects" });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  function set<K extends keyof ProjectFormValues>(k: K, val: ProjectFormValues[K]) {
    setV((s) => ({ ...s, [k]: val }));
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}
      className="space-y-6 max-w-3xl"
    >
      <Card>
        <CardHeader><CardTitle className="text-base">Basics</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Field label="Title *"><Input required value={v.title} onChange={(e) => set("title", e.target.value)} /></Field>
          <Field label="Slug *" hint="lowercase, dashes only">
            <Input required value={v.slug} pattern="[a-z0-9\-]+" onChange={(e) => set("slug", e.target.value)} />
          </Field>
          <Field label="Category"><Input value={v.category} onChange={(e) => set("category", e.target.value)} /></Field>
          <Field label="Year"><Input value={v.year} onChange={(e) => set("year", e.target.value)} /></Field>
          <Field label="Client"><Input value={v.client} onChange={(e) => set("client", e.target.value)} /></Field>
          <Field label="Timeline"><Input value={v.timeline} onChange={(e) => set("timeline", e.target.value)} /></Field>
          <Field label="Role"><Input value={v.role} onChange={(e) => set("role", e.target.value)} /></Field>
          <Field label="Sort order"><Input type="number" value={v.sort_order} onChange={(e) => set("sort_order", Number(e.target.value) || 0)} /></Field>
          <Field label="Live URL"><Input value={v.live_url} onChange={(e) => set("live_url", e.target.value)} /></Field>
          <Field label="Repo URL"><Input value={v.repo_url} onChange={(e) => set("repo_url", e.target.value)} /></Field>
          <div className="flex items-center gap-3 sm:col-span-2">
            <Switch id="pub" checked={v.published} onCheckedChange={(c) => set("published", c)} />
            <Label htmlFor="pub">Published</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Cover & gallery</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <ImageUploader label="Cover image" value={v.cover} onChange={(u) => set("cover", u)} />
          <div className="space-y-2">
            <div className="text-sm font-medium">Gallery</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {v.gallery.map((src, i) => (
                <div key={i} className="relative group rounded overflow-hidden border bg-muted">
                  <img src={src} alt="" className="w-full h-28 object-cover" />
                  <button type="button" onClick={() => set("gallery", v.gallery.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
            <ImageUploader label="Add to gallery" value={null} onChange={(u) => { if (u) set("gallery", [...v.gallery, u]); }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Story</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Overview"><Textarea rows={3} value={v.overview} onChange={(e) => set("overview", e.target.value)} /></Field>
          <Field label="Challenge"><Textarea rows={3} value={v.challenge} onChange={(e) => set("challenge", e.target.value)} /></Field>
          <Field label="Solution"><Textarea rows={3} value={v.solution} onChange={(e) => set("solution", e.target.value)} /></Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Tags, tech & results</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <TagInput label="Tags" values={v.tags} onChange={(t) => set("tags", t)} />
          <TagInput label="Tech" values={v.tech} onChange={(t) => set("tech", t)} />
          <div className="space-y-2">
            <div className="text-sm font-medium">Results</div>
            {v.results.map((r, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input placeholder="Label" value={r.label}
                  onChange={(e) => set("results", v.results.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))} />
                <Input placeholder="Value" value={r.value}
                  onChange={(e) => set("results", v.results.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x))} />
                <Button type="button" size="icon" variant="ghost"
                  onClick={() => set("results", v.results.filter((_, idx) => idx !== i))}>
                  <X className="size-4" />
                </Button>
              </div>
            ))}
            <Button type="button" size="sm" variant="outline"
              onClick={() => set("results", [...v.results, { label: "", value: "" }])}>
              <Plus className="size-4 mr-1" />Add result
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">SEO</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Meta title" hint="Defaults to project title if blank. ~60 chars.">
            <Input maxLength={200} value={v.meta_title} onChange={(e) => set("meta_title", e.target.value)} />
          </Field>
          <Field label="Meta description" hint="~155 chars for best Google snippet.">
            <Textarea rows={2} maxLength={500} value={v.meta_description} onChange={(e) => set("meta_description", e.target.value)} />
          </Field>
          <ImageUploader label="Share image (Open Graph)" value={v.og_image} onChange={(u) => set("og_image", u)} />
        </CardContent>
      </Card>



      <div className="flex gap-2">
        <Button type="submit" disabled={mut.isPending}>{mut.isPending ? "Saving…" : "Save project"}</Button>
        <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin/projects" })}>Cancel</Button>
      </div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function TagInput({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  function add() {
    const t = draft.trim();
    if (!t) return;
    onChange([...values, t]);
    setDraft("");
  }
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground px-2.5 py-1 text-xs">
            {t}
            <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))}>
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Type and press Enter" />
        <Button type="button" size="sm" variant="outline" onClick={add}>Add</Button>
      </div>
    </div>
  );
}
