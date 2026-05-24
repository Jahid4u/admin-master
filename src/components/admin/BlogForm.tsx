import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { adminUpsertPost } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ImageUploader } from "./ImageUploader";
import {
  ImagePlus, Eye, Pencil, Bold, Italic, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link2, Minus,
} from "lucide-react";
import { toast } from "sonner";

export type PostFormValues = {
  slug: string;
  title: string;
  description: string;
  category: string;
  cover_image: string | null;
  content: string;
  read_time: string;
  published: boolean;
  published_at: string; // ISO date (YYYY-MM-DD) for the <input type="date">
};

const todayISO = () => new Date().toISOString().slice(0, 10);

export const emptyPost: PostFormValues = {
  slug: "", title: "", description: "", category: "",
  cover_image: null, content: "", read_time: "", published: true,
  published_at: todayISO(),
};

export function BlogForm({ id, initial }: { id?: string; initial: PostFormValues }) {
  const [v, setV] = useState<PostFormValues>(initial);
  const [inserting, setInserting] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const upsert = useServerFn(adminUpsertPost);

  const mut = useMutation({
    mutationFn: () => {
      // Convert date (YYYY-MM-DD) → ISO datetime at noon UTC for stable display
      const publishedAtISO = v.published_at
        ? new Date(`${v.published_at}T12:00:00Z`).toISOString()
        : null;
      return upsert({
        data: {
          id,
          values: {
            ...v,
            description: v.description || null,
            category: v.category || null,
            cover_image: v.cover_image || null,
            content: v.content || null,
            read_time: v.read_time || null,
            published_at: publishedAtISO,
          },
        },
      });
    },
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      navigate({ to: "/admin/blog" });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  function set<K extends keyof PostFormValues>(k: K, val: PostFormValues[K]) {
    setV((s) => ({ ...s, [k]: val }));
  }

  function insertAtCursor(snippet: string) {
    const el = contentRef.current;
    const current = v.content ?? "";
    if (!el) {
      set("content", current + snippet);
      return;
    }
    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? current.length;
    const next = current.slice(0, start) + snippet + current.slice(end);
    set("content", next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    });
  }

  // Wrap the current selection with `before`/`after`. If nothing selected,
  // inserts `placeholder` between them and selects it so the user can type.
  function wrapSelection(before: string, after: string, placeholder = "text") {
    const el = contentRef.current;
    const current = v.content ?? "";
    if (!el) {
      set("content", current + before + placeholder + after);
      return;
    }
    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? current.length;
    const selected = current.slice(start, end) || placeholder;
    const next = current.slice(0, start) + before + selected + after + current.slice(end);
    set("content", next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  // Prefix every line in the current selection (or the current line) with `prefix`.
  function prefixLines(prefix: string | ((i: number) => string)) {
    const el = contentRef.current;
    const current = v.content ?? "";
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const lineStart = current.lastIndexOf("\n", start - 1) + 1;
    const lineEnd = current.indexOf("\n", end);
    const blockEnd = lineEnd === -1 ? current.length : lineEnd;
    const block = current.slice(lineStart, blockEnd);
    const updated = block
      .split("\n")
      .map((l, i) => (typeof prefix === "string" ? prefix : prefix(i)) + l)
      .join("\n");
    const next = current.slice(0, lineStart) + updated + current.slice(blockEnd);
    set("content", next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(lineStart, lineStart + updated.length);
    });
  }

  function insertLink() {
    const el = contentRef.current;
    const selected = el ? (v.content ?? "").slice(el.selectionStart ?? 0, el.selectionEnd ?? 0) : "";
    const url = window.prompt("Link URL", "https://");
    if (!url) return;
    wrapSelection("[", `](${url})`, selected || "link text");
  }

  async function handleInlineImage(file: File) {
    setInserting(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `posts/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      insertAtCursor(`\n\n![${file.name.replace(/\.[^.]+$/, "")}](${data.publicUrl})\n\n`);
      toast.success("Image inserted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setInserting(false);
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); mut.mutate(); }} className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader><CardTitle className="text-base">Basics</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Title *</Label>
            <Input required value={v.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Slug *</Label>
            <Input required value={v.slug} pattern="[a-z0-9\-]+" onChange={(e) => set("slug", e.target.value)} />
            <p className="text-xs text-muted-foreground">lowercase, dashes only — used in the URL</p>
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Input placeholder="Design, Web Dev, Animation…" value={v.category} onChange={(e) => set("category", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Publish date</Label>
            <Input type="date" value={v.published_at} onChange={(e) => set("published_at", e.target.value)} />
            <p className="text-xs text-muted-foreground">Shown on the post card and detail page.</p>
          </div>
          <div className="space-y-1.5">
            <Label>Read time</Label>
            <Input placeholder="5 min read" value={v.read_time} onChange={(e) => set("read_time", e.target.value)} />
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
            <Switch id="pub" checked={v.published} onCheckedChange={(c) => set("published", c)} />
            <Label htmlFor="pub">Published (visible on /blog)</Label>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Short description</Label>
            <Textarea rows={2} value={v.description} onChange={(e) => set("description", e.target.value)} placeholder="One- or two-line summary shown on the blog card." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Cover image</CardTitle></CardHeader>
        <CardContent>
          <ImageUploader label="Cover image" value={v.cover_image} onChange={(u) => set("cover_image", u)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Tabs defaultValue="write">
            <TabsList>
              <TabsTrigger value="write"><Pencil className="size-3.5 mr-1.5" />Write</TabsTrigger>
              <TabsTrigger value="preview"><Eye className="size-3.5 mr-1.5" />Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="write" className="mt-3 space-y-2">
              <div className="flex flex-wrap items-center gap-1 border rounded-md p-1 bg-muted/40">
                <ToolbarBtn title="Heading 1" onClick={() => prefixLines("# ")}><Heading1 className="size-4" /></ToolbarBtn>
                <ToolbarBtn title="Heading 2" onClick={() => prefixLines("## ")}><Heading2 className="size-4" /></ToolbarBtn>
                <ToolbarBtn title="Heading 3" onClick={() => prefixLines("### ")}><Heading3 className="size-4" /></ToolbarBtn>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <ToolbarBtn title="Bold" onClick={() => wrapSelection("**", "**", "bold text")}><Bold className="size-4" /></ToolbarBtn>
                <ToolbarBtn title="Italic" onClick={() => wrapSelection("*", "*", "italic text")}><Italic className="size-4" /></ToolbarBtn>
                <ToolbarBtn title="Inline code" onClick={() => wrapSelection("`", "`", "code")}><Code className="size-4" /></ToolbarBtn>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <ToolbarBtn title="Bullet list" onClick={() => prefixLines("- ")}><List className="size-4" /></ToolbarBtn>
                <ToolbarBtn title="Numbered list" onClick={() => prefixLines((i) => `${i + 1}. `)}><ListOrdered className="size-4" /></ToolbarBtn>
                <ToolbarBtn title="Quote" onClick={() => prefixLines("> ")}><Quote className="size-4" /></ToolbarBtn>
                <ToolbarBtn title="Code block" onClick={() => wrapSelection("\n```\n", "\n```\n", "your code here")}><span className="text-xs font-mono">{`{}`}</span></ToolbarBtn>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <ToolbarBtn title="Link" onClick={insertLink}><Link2 className="size-4" /></ToolbarBtn>
                <ToolbarBtn title="Divider" onClick={() => insertAtCursor("\n\n---\n\n")}><Minus className="size-4" /></ToolbarBtn>
                <label className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer border rounded-md px-2.5 py-1 hover:bg-background bg-background">
                  <ImagePlus className="size-4" />
                  {inserting ? "Uploading…" : "Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={inserting}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleInlineImage(f);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
              <Textarea
                ref={contentRef}
                rows={20}
                value={v.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder={"Just start writing…\n\nSelect any text and use the toolbar above to make it bold, add a heading, insert a link, and more. Click Preview to see the result."}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Tip: select text first, then click a toolbar button to format it.
              </p>
            </TabsContent>
            <TabsContent value="preview" className="mt-3">
              <div className="prose prose-sm dark:prose-invert max-w-none border rounded-md p-4 min-h-[20rem] bg-background">
                {v.content?.trim() ? (
                  <ReactMarkdown>{v.content}</ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground italic">Nothing to preview yet.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" disabled={mut.isPending}>{mut.isPending ? "Saving…" : "Save post"}</Button>
        <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin/blog" })}>Cancel</Button>
      </div>
    </form>
  );
}
