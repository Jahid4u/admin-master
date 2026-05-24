import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Field, SiteSectionEditor } from "@/components/admin/SiteSectionEditor";

export const Route = createFileRoute("/admin/site/footer")({ component: FooterPage });

type Footer = {
  tagline: string;
  copyright: string;
  newsletter_enabled: boolean;
  newsletter_title: string;
  newsletter_desc: string;
};
const defaults: Footer = {
  tagline: "",
  copyright: "",
  newsletter_enabled: true,
  newsletter_title: "Stay in the Loop",
  newsletter_desc: "Get the latest insights, trends, and updates delivered to your inbox.",
};

function FooterPage() {
  return (
    <SiteSectionEditor<Footer>
      title="Footer"
      description="Tagline, copyright line and the newsletter block at the top of every footer."
      settingKey="footer"
      defaults={defaults}
      render={(v, set) => (
        <>
          <Field label="Tagline">
            <Textarea rows={2} value={v.tagline} onChange={(e) => set({ ...v, tagline: e.target.value })} />
          </Field>
          <Field label="Copyright line">
            <Input value={v.copyright} onChange={(e) => set({ ...v, copyright: e.target.value })} placeholder="© 2026 Your name. All rights reserved." />
          </Field>

          <div className="border-t pt-5 mt-2">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <div className="text-sm font-medium">Newsletter block</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Shown at the very top of the footer on every page.
                </div>
              </div>
              <Switch
                checked={v.newsletter_enabled !== false}
                onCheckedChange={(checked) => set({ ...v, newsletter_enabled: checked })}
              />
            </div>

            {v.newsletter_enabled !== false && (
              <div className="space-y-4">
                <Field label="Newsletter title">
                  <Input value={v.newsletter_title} onChange={(e) => set({ ...v, newsletter_title: e.target.value })} />
                </Field>
                <Field label="Newsletter description">
                  <Textarea rows={2} value={v.newsletter_desc} onChange={(e) => set({ ...v, newsletter_desc: e.target.value })} />
                </Field>
              </div>
            )}
          </div>
        </>
      )}
    />
  );
}
