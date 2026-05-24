import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Field, SiteSectionEditor } from "@/components/admin/SiteSectionEditor";

export const Route = createFileRoute("/admin/site/hero")({
  component: HeroPage,
});

type Hero = {
  name: string;
  tagline: string;
  intro: string;
  avatar: string | null;
  cta_label: string;
  cta_url: string;
};

const defaults: Hero = { name: "", tagline: "", intro: "", avatar: null, cta_label: "", cta_url: "" };

function HeroPage() {
  return (
    <SiteSectionEditor<Hero>
      title="Hero section"
      description="The first section visitors see on your homepage — name, tagline, intro and call-to-action."
      settingKey="hero"
      defaults={defaults}
      render={(v, set) => (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name">
              <Input value={v.name} onChange={(e) => set({ ...v, name: e.target.value })} />
            </Field>
            <Field label="Tagline">
              <Input value={v.tagline} onChange={(e) => set({ ...v, tagline: e.target.value })} />
            </Field>
          </div>
          <Field label="Intro">
            <Textarea rows={3} value={v.intro} onChange={(e) => set({ ...v, intro: e.target.value })} />
          </Field>
          <ImageUploader label="Avatar" value={v.avatar} onChange={(u) => set({ ...v, avatar: u })} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="CTA label">
              <Input value={v.cta_label} onChange={(e) => set({ ...v, cta_label: e.target.value })} />
            </Field>
            <Field label="CTA URL">
              <Input value={v.cta_url} onChange={(e) => set({ ...v, cta_url: e.target.value })} />
            </Field>
          </div>
        </>
      )}
    />
  );
}
