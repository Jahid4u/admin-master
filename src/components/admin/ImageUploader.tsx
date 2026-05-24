import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Link as LinkIcon, X } from "lucide-react";
import { toast } from "sonner";

export function ImageUploader({
  value,
  onChange,
  label = "Image",
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
      {value ? (
        <div className="relative group rounded-md overflow-hidden border bg-muted">
          <img src={value} alt="" className="max-h-48 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-background/80 backdrop-blur rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
            aria-label="Remove"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-2">
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer hover:bg-muted/50 transition text-center text-sm">
            <Upload className="size-5 mb-1" />
            <span>{uploading ? "Uploading…" : "Upload file"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </label>
          <div className="flex flex-col gap-2 border rounded-md p-3">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <LinkIcon className="size-4" /> Paste URL
            </div>
            <Input
              placeholder="https://…"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={!urlInput.trim()}
              onClick={() => { onChange(urlInput.trim()); setUrlInput(""); }}
            >
              Use URL
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
