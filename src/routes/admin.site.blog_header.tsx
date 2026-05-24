import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, SiteSectionEditor } from "@/components/admin/SiteSectionEditor";

export const Route = createFileRoute("/admin/site/blog_header")({ component: BlogHeaderPage });

type BlogHeader = { eyebrow: string; headline: string; subtitle: string };
const defaults: BlogHeader = { eyebrow: "", headline: "", subtitle: "" };

function BlogHeaderPage() {
  return (
    <SiteSectionEditor<BlogHeader>
      title="Blog page header"
      description="The headline and subtitle shown at the top of the /blog page."
      settingKey={"blog_header" as never}
      defaults={defaults}
      render={(v, set) => (
        <>
          <Field label="Eyebrow">
            <Input value={v.eyebrow} onChange={(e) => set({ ...v, eyebrow: e.target.value })} placeholder="Journal" />
          </Field>
          <Field label="Headline">
            <Input value={v.headline} onChange={(e) => set({ ...v, headline: e.target.value })} />
          </Field>
          <Field label="Subtitle">
            <Textarea rows={3} value={v.subtitle} onChange={(e) => set({ ...v, subtitle: e.target.value })} />
          </Field>
        </>
      )}
    />
  );
}
