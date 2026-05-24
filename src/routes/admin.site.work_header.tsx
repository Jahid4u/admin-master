import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, SiteSectionEditor } from "@/components/admin/SiteSectionEditor";

export const Route = createFileRoute("/admin/site/work_header")({ component: WorkHeaderPage });

type WorkHeader = { eyebrow: string; headline: string; subtitle: string };
const defaults: WorkHeader = { eyebrow: "", headline: "", subtitle: "" };

function WorkHeaderPage() {
  return (
    <SiteSectionEditor<WorkHeader>
      title="Work page header"
      description="The headline and subtitle shown at the top of the /work page."
      settingKey={"work_header" as never}
      defaults={defaults}
      render={(v, set) => (
        <>
          <Field label="Eyebrow">
            <Input value={v.eyebrow} onChange={(e) => set({ ...v, eyebrow: e.target.value })} placeholder="Selected projects" />
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
