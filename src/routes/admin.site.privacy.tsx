import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, SiteSectionEditor } from "@/components/admin/SiteSectionEditor";

export const Route = createFileRoute("/admin/site/privacy")({ component: PrivacyPage });

type Legal = { title: string; updated_at: string; content: string };
const defaults: Legal = { title: "Privacy Policy", updated_at: "", content: "" };

function PrivacyPage() {
  return (
    <SiteSectionEditor<Legal>
      title="Privacy policy"
      description="Page title and full content (Markdown supported) for /privacy."
      settingKey={"privacy" as never}
      defaults={defaults}
      render={(v, set) => (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title">
              <Input value={v.title} onChange={(e) => set({ ...v, title: e.target.value })} />
            </Field>
            <Field label="Last updated">
              <Input value={v.updated_at} onChange={(e) => set({ ...v, updated_at: e.target.value })} placeholder="May 2026" />
            </Field>
          </div>
          <Field label="Content (Markdown)">
            <Textarea rows={18} className="font-mono text-sm" value={v.content} onChange={(e) => set({ ...v, content: e.target.value })} />
          </Field>
        </>
      )}
    />
  );
}
