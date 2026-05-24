import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Field, SiteSectionEditor } from "@/components/admin/SiteSectionEditor";

export const Route = createFileRoute("/admin/site/seo")({ component: SeoPage });

type Seo = {
  site_title: string;
  site_description: string;
  keywords: string;
  og_image: string | null;
  twitter_handle: string;
};
const defaults: Seo = { site_title: "", site_description: "", keywords: "", og_image: null, twitter_handle: "" };

function SeoPage() {
  return (
    <SiteSectionEditor<Seo>
      title="SEO & meta"
      description="Default title, description and share image used across your site."
      settingKey={"seo" as never}
      defaults={defaults}
      render={(v, set) => (
        <>
          <Field label="Site title">
            <Input value={v.site_title} onChange={(e) => set({ ...v, site_title: e.target.value })} />
          </Field>
          <Field label="Meta description">
            <Textarea rows={3} value={v.site_description} onChange={(e) => set({ ...v, site_description: e.target.value })} />
          </Field>
          <Field label="Keywords (comma separated)">
            <Input value={v.keywords} onChange={(e) => set({ ...v, keywords: e.target.value })} />
          </Field>
          <ImageUploader label="Share image (Open Graph)" value={v.og_image} onChange={(u) => set({ ...v, og_image: u })} />
          <Field label="Twitter handle">
            <Input placeholder="@yourname" value={v.twitter_handle} onChange={(e) => set({ ...v, twitter_handle: e.target.value })} />
          </Field>
        </>
      )}
    />
  );
}
