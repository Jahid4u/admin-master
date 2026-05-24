import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Field, SiteSectionEditor } from "@/components/admin/SiteSectionEditor";

export const Route = createFileRoute("/admin/site/about")({
  component: AboutPage,
});

type About = { headline: string; bio: string; image: string | null; skills: string };
const defaults: About = { headline: "", bio: "", image: null, skills: "" };

function AboutPage() {
  return (
    <SiteSectionEditor<About>
      title="About section"
      description="Your personal story, photo and skills shown on the About page."
      settingKey="about"
      defaults={defaults}
      render={(v, set) => (
        <>
          <Field label="Headline">
            <Input value={v.headline} onChange={(e) => set({ ...v, headline: e.target.value })} />
          </Field>
          <Field label="Bio">
            <Textarea rows={6} value={v.bio} onChange={(e) => set({ ...v, bio: e.target.value })} />
          </Field>
          <ImageUploader label="About image" value={v.image} onChange={(u) => set({ ...v, image: u })} />
          <Field label="Skills (comma separated)">
            <Input
              value={v.skills}
              onChange={(e) => set({ ...v, skills: e.target.value })}
              placeholder="React, TypeScript, Design"
            />
          </Field>
        </>
      )}
    />
  );
}
