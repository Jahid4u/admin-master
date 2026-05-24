import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Trash2,
  Search,
  Copy,
  Download,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  File as FileIcon,
  Archive,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/media")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  component: MediaPage,
});

const MAX_BYTES = 100 * 1024 * 1024; // 100MB
const BUCKET = "media";

type MediaItem = {
  name: string;
  id: string;
  size: number;
  mime: string;
  updated_at: string;
  url: string;
};

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
  return `${(b / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function iconFor(mime: string) {
  if (mime.startsWith("image/")) return ImageIcon;
  if (mime.startsWith("video/")) return Video;
  if (mime.startsWith("audio/")) return Music;
  if (mime.includes("pdf") || mime.includes("text") || mime.includes("document")) return FileText;
  if (mime.includes("zip") || mime.includes("rar") || mime.includes("tar")) return Archive;
  return FileIcon;
}

function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "image" | "video" | "audio" | "document" | "other">("all");
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("", { limit: 1000, sortBy: { column: "updated_at", order: "desc" } });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    const mapped: MediaItem[] = (data || [])
      .filter((f) => f.name && !f.name.endsWith("/"))
      .map((f) => {
        const meta: any = f.metadata || {};
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(f.name);
        return {
          name: f.name,
          id: f.id || f.name,
          size: meta.size || 0,
          mime: meta.mimetype || "application/octet-stream",
          updated_at: f.updated_at || f.created_at || "",
          url: pub.publicUrl,
        };
      });
    setItems(mapped);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function uploadFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    if (arr.length === 0) return;
    setUploading(true);
    let ok = 0, fail = 0;
    for (const file of arr) {
      if (file.size > MAX_BYTES) {
        toast.error(`${file.name}: exceeds 100MB`);
        fail++;
        continue;
      }
      const ts = Date.now();
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${ts}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
      if (error) {
        toast.error(`${file.name}: ${error.message}`);
        fail++;
      } else ok++;
    }
    setUploading(false);
    if (ok) toast.success(`Uploaded ${ok} file${ok > 1 ? "s" : ""}`);
    await load();
  }

  async function remove(name: string) {
    if (!confirm(`Delete ${name}?`)) return;
    const { error } = await supabase.storage.from(BUCKET).remove([name]);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setItems((s) => s.filter((i) => i.name !== name));
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    toast.success("URL copied");
  }

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (q && !i.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (filter === "all") return true;
      if (filter === "image") return i.mime.startsWith("image/");
      if (filter === "video") return i.mime.startsWith("video/");
      if (filter === "audio") return i.mime.startsWith("audio/");
      if (filter === "document")
        return i.mime.includes("pdf") || i.mime.includes("text") || i.mime.includes("document") || i.mime.includes("sheet");
      return (
        !i.mime.startsWith("image/") &&
        !i.mime.startsWith("video/") &&
        !i.mime.startsWith("audio/") &&
        !i.mime.includes("pdf") &&
        !i.mime.includes("document")
      );
    });
  }, [items, q, filter]);

  const totalSize = items.reduce((s, i) => s + i.size, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media center"
        description={`${items.length} files · ${formatBytes(totalSize)} · 100MB per file limit · all file types supported`}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
        }}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
        <div className="text-sm mb-3">Drag & drop files here, or click to browse</div>
        <input
          ref={fileInput}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        <Button onClick={() => fileInput.current?.click()} disabled={uploading}>
          {uploading ? "Uploading…" : "Select files"}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search files…"
            className="pl-8"
          />
        </div>
        {(["all", "image", "video", "audio", "document", "other"] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-12 border border-dashed rounded-lg">
          No files
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((i) => {
            const Icon = iconFor(i.mime);
            const isImage = i.mime.startsWith("image/");
            return (
              <div
                key={i.id}
                className="group rounded-lg border border-border overflow-hidden bg-card flex flex-col"
              >
                <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                  {isImage ? (
                    <img src={i.url} alt={i.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <Icon className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <div className="p-2.5 flex flex-col gap-1.5 flex-1">
                  <div className="text-xs font-medium truncate" title={i.name}>
                    {i.name}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{formatBytes(i.size)}</span>
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                      {i.mime.split("/")[0]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 flex-1 px-2 text-[11px]"
                      onClick={() => copyUrl(i.url)}
                    >
                      <Copy className="w-3 h-3 mr-1" /> URL
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2"
                      asChild
                    >
                      <a href={i.url} download={i.name} target="_blank" rel="noreferrer">
                        <Download className="w-3 h-3" />
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-destructive hover:text-destructive"
                      onClick={() => remove(i.name)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
