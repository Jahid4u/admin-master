import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, SiteSectionEditor } from "@/components/admin/SiteSectionEditor";

export const Route = createFileRoute("/admin/site/footer")({ component: FooterPage });

type Footer = { tagline: string; copyright: string; newsletter_title: string; newsletter_desc: string };
const defaults: Footer = { tagline: "", copyright: "", newsletter_title: "", newsletter_desc: "" };

function FooterPage() {
  return (
    <SiteSectionEditor<Footer>
      title="Footer"
      description="Tagline, copyright line and newsletter section shown at the bottom of every page."
      settingKey={"footer" as never}
      defaults={defaults}
      render={(v, set) => (
        <>
          <Field label="Tagline">
            <Textarea rows={2} value={v.tagline} onChange={(e) => set({ ...v, tagline: e.target.value })} />
          </Field>
          <Field label="Copyright line">
            <Input value={v.copyright} onChange={(e) => set({ ...v, copyright: e.target.value })} placeholder="© 2026 Your name. All rights reserved." />
          </Field>
          <Field label="Newsletter title">
            <Input value={v.newsletter_title} onChange={(e) => set({ ...v, newsletter_title: e.target.value })} />
          </Field>
          <Field label="Newsletter description">
            <Textarea rows={2} value={v.newsletter_desc} onChange={(e) => set({ ...v, newsletter_desc: e.target.value })} />
          </Field>
        </>
      )}
    />
  );
}
