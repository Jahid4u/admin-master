import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Field, SiteSectionEditor } from "@/components/admin/SiteSectionEditor";

export const Route = createFileRoute("/admin/site/footer")({ component: FooterPage });

type Footer = {
  // Newsletter
  newsletter_enabled: boolean;
  newsletter_title: string;
  newsletter_desc: string;
  newsletter_placeholder: string;
  newsletter_button: string;
  // Big display name
  big_name_enabled: boolean;
  big_name: string;
  // Copyright
  copyright: string;
  // Bottom links
  privacy_enabled: boolean;
  privacy_label: string;
  terms_enabled: boolean;
  terms_label: string;
  // Legacy
  tagline: string;
};

const defaults: Footer = {
  newsletter_enabled: true,
  newsletter_title: "Stay in the Loop",
  newsletter_desc: "Get the latest insights, trends, and updates delivered to your inbox.",
  newsletter_placeholder: "Enter your email",
  newsletter_button: "Subscribe",
  big_name_enabled: true,
  big_name: "JAHID HASAN",
  copyright: "© 2026 JAHID HASAN. CRAFTED WITH SOUL.",
  privacy_enabled: true,
  privacy_label: "PRIVACY POLICY",
  terms_enabled: true,
  terms_label: "TERMS OF SERVICE",
  tagline: "",
};

function Section({ title, description, children, toggle }: {
  title: string;
  description?: string;
  toggle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t pt-5 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          {description && (
            <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
          )}
        </div>
        {toggle}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FooterPage() {
  return (
    <SiteSectionEditor<Footer>
      title="Footer"
      description="Edit every element of the site footer — newsletter, big name display, copyright and bottom links."
      settingKey="footer"
      defaults={defaults}
      render={(v, set) => (
        <>
          <Section
            title="Newsletter block"
            description="Shown at the very top of the footer on every page."
            toggle={
              <Switch
                checked={v.newsletter_enabled !== false}
                onCheckedChange={(checked) => set({ ...v, newsletter_enabled: checked })}
              />
            }
          >
            <Field label="Title">
              <Input value={v.newsletter_title} onChange={(e) => set({ ...v, newsletter_title: e.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea rows={2} value={v.newsletter_desc} onChange={(e) => set({ ...v, newsletter_desc: e.target.value })} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email placeholder">
                <Input value={v.newsletter_placeholder} onChange={(e) => set({ ...v, newsletter_placeholder: e.target.value })} />
              </Field>
              <Field label="Button label">
                <Input value={v.newsletter_button} onChange={(e) => set({ ...v, newsletter_button: e.target.value })} />
              </Field>
            </div>
          </Section>

          <Section
            title="Big name display"
            description="The huge animated name shown in the footer."
            toggle={
              <Switch
                checked={v.big_name_enabled !== false}
                onCheckedChange={(checked) => set({ ...v, big_name_enabled: checked })}
              />
            }
          >
            <Field label="Display text">
              <Input
                value={v.big_name}
                onChange={(e) => set({ ...v, big_name: e.target.value })}
                placeholder="JAHID HASAN"
              />
            </Field>
          </Section>

          <Section title="Copyright">
            <Field label="Copyright line">
              <Input
                value={v.copyright}
                onChange={(e) => set({ ...v, copyright: e.target.value })}
                placeholder="© 2026 Your name. All rights reserved."
              />
            </Field>
          </Section>

          <Section title="Bottom links" description="Links shown next to the copyright line.">
            <div className="flex items-center justify-between gap-4">
              <Field label="Privacy policy label">
                <Input
                  value={v.privacy_label}
                  onChange={(e) => set({ ...v, privacy_label: e.target.value })}
                />
              </Field>
              <div className="pt-6">
                <Switch
                  checked={v.privacy_enabled !== false}
                  onCheckedChange={(checked) => set({ ...v, privacy_enabled: checked })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Field label="Terms of service label">
                <Input
                  value={v.terms_label}
                  onChange={(e) => set({ ...v, terms_label: e.target.value })}
                />
              </Field>
              <div className="pt-6">
                <Switch
                  checked={v.terms_enabled !== false}
                  onCheckedChange={(checked) => set({ ...v, terms_enabled: checked })}
                />
              </div>
            </div>
          </Section>
        </>
      )}
    />
  );
}
