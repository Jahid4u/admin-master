import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Field, SiteSectionEditor } from "@/components/admin/SiteSectionEditor";

export const Route = createFileRoute("/admin/site/social")({
  component: SocialPage,
});

type Social = {
  github: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  youtube: string;
};
const defaults: Social = { github: "", twitter: "", linkedin: "", instagram: "", facebook: "", youtube: "" };
const fields: (keyof Social)[] = ["github", "twitter", "linkedin", "instagram", "facebook", "youtube"];

function SocialPage() {
  return (
    <SiteSectionEditor<Social>
      title="Social links"
      description="Your social profiles. Leave a field blank to hide that icon."
      settingKey="social"
      defaults={defaults}
      render={(v, set) => (
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <Field key={f} label={f.charAt(0).toUpperCase() + f.slice(1)}>
              <Input
                placeholder="https://…"
                value={v[f]}
                onChange={(e) => set({ ...v, [f]: e.target.value })}
              />
            </Field>
          ))}
        </div>
      )}
    />
  );
}
