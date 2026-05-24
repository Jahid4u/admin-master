import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminGetAllSettings, adminUpdateSetting } from "@/lib/admin.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { Field } from "@/components/admin/SiteSectionEditor";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/site/home")({ component: HomePage });

type Stat = { value: string; label: string; enabled?: boolean };
type Social = { label: string; url: string; enabled?: boolean };

type Home = {
  // Hero
  hero_enabled: boolean;
  status_enabled: boolean;
  status_text: string;
  kicker: string;
  headline_line1: string;
  headline_line2: string;
  tagline: string;
  stats_enabled: boolean;
  stats: Stat[];
  cta_primary_enabled: boolean;
  cta_primary_label: string;
  cta_primary_url: string;
  cta_secondary_enabled: boolean;
  cta_secondary_label: string;
  cta_secondary_url: string;

  // Work section header (on home)
  work_enabled: boolean;
  work_eyebrow: string;
  work_headline_pre: string;
  work_headline_italic: string;
  work_button_label: string;
  work_button_url: string;

  // Blog section header (on home)
  blog_enabled: boolean;
  blog_eyebrow: string;
  blog_headline_pre: string;
  blog_headline_italic: string;
  blog_button_label: string;
  blog_button_url: string;

  // Contact section
  contact_enabled: boolean;
  contact_headline_line1: string;
  contact_headline_line2: string;
  contact_email: string;
  contact_phone: string;
  contact_socials: Social[];
  contact_send_label: string;
  contact_name_placeholder: string;
  contact_email_placeholder: string;
  contact_subject_placeholder: string;
  contact_message_placeholder: string;
};

const defaults: Home = {
  hero_enabled: true,
  status_enabled: true,
  status_text: "Available for collaboration",
  kicker: "Jahid Hasan",
  headline_line1: "High-End Digital",
  headline_line2: "Craft & Engineering.",
  tagline:
    "Multidisciplinary Graphic Designer & Web Developer based in Dhaka. Shaping premium digital identities for over six years.",
  stats_enabled: true,
  stats: [
    { value: "06+", label: "Years Exp", enabled: true },
    { value: "120+", label: "Projects", enabled: true },
    { value: "Dhaka", label: "Location", enabled: true },
  ],
  cta_primary_enabled: true,
  cta_primary_label: "View Projects",
  cta_primary_url: "/work",
  cta_secondary_enabled: true,
  cta_secondary_label: "Start a Conversation",
  cta_secondary_url: "/contact",

  work_enabled: true,
  work_eyebrow: "Selected Work — 2023 / 2024",
  work_headline_pre: "Work made with",
  work_headline_italic: "care",
  work_button_label: "View Archive",
  work_button_url: "/work",

  blog_enabled: true,
  blog_eyebrow: "Journal — Notes & Essays",
  blog_headline_pre: "Writing on",
  blog_headline_italic: "craft",
  blog_button_label: "All Writing",
  blog_button_url: "/blog",

  contact_enabled: true,
  contact_headline_line1: "Have an idea?",
  contact_headline_line2: "Let's connect.",
  contact_email: "hello@jahid.com",
  contact_phone: "+880 123 456 789",
  contact_socials: [
    { label: "Twitter", url: "#", enabled: true },
    { label: "LinkedIn", url: "#", enabled: true },
    { label: "GitHub", url: "#", enabled: true },
  ],
  contact_send_label: "Send Message",
  contact_name_placeholder: "John Doe",
  contact_email_placeholder: "john@example.com",
  contact_subject_placeholder: "What is this regarding?",
  contact_message_placeholder: "Tell me about your project...",
};

const switchCls = "border border-border data-[state=unchecked]:bg-muted";

function SectionCard({
  title,
  description,
  toggle,
  children,
}: {
  title: string;
  description?: string;
  toggle?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">{title}</div>
            {description && (
              <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
            )}
          </div>
          {toggle}
        </div>
        <div className="space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
}

function HomePage() {
  const qc = useQueryClient();
  const getAll = useServerFn(adminGetAllSettings);
  const update = useServerFn(adminUpdateSetting);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => getAll(),
  });

  const initial = { ...defaults, ...((data?.home as object | undefined) ?? {}) } as Home;
  const [v, setV] = useState<Home>(initial);

  useEffect(() => {
    setV(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)]);

  const set = (patch: Partial<Home>) => setV({ ...v, ...patch });

  const saveMut = useMutation({
    mutationFn: () => update({ data: { key: "home", value: v } }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      qc.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const updateStat = (i: number, patch: Partial<Stat>) => {
    const next = [...v.stats];
    next[i] = { ...next[i], ...patch };
    set({ stats: next });
  };
  const updateSocial = (i: number, patch: Partial<Social>) => {
    const next = [...v.contact_socials];
    next[i] = { ...next[i], ...patch };
    set({ contact_socials: next });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveMut.mutate();
      }}
      className="max-w-2xl"
    >
      <PageHeader
        title="Home page"
        description="Edit every section of the home page — hero, work block, blog block and contact."
        actions={
          <Button type="submit" disabled={saveMut.isPending || isLoading} size="sm">
            {saveMut.isPending ? "Saving…" : "Save changes"}
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-6">
          {/* HERO */}
          <SectionCard
            title="Hero"
            description="The first thing visitors see — badge, name, big headline, tagline."
            toggle={
              <Switch
                className={switchCls}
                checked={v.hero_enabled !== false}
                onCheckedChange={(c) => set({ hero_enabled: c })}
              />
            }
          >
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div className="text-xs font-medium">Status badge</div>
              <Switch
                className={switchCls}
                checked={v.status_enabled !== false}
                onCheckedChange={(c) => set({ status_enabled: c })}
              />
            </div>
            <Field label="Status text">
              <Input value={v.status_text} onChange={(e) => set({ status_text: e.target.value })} />
            </Field>
            <Field label="Kicker (small name above headline)">
              <Input value={v.kicker} onChange={(e) => set({ kicker: e.target.value })} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Headline — first line">
                <Input value={v.headline_line1} onChange={(e) => set({ headline_line1: e.target.value })} />
              </Field>
              <Field label="Headline — second line (italic)">
                <Input value={v.headline_line2} onChange={(e) => set({ headline_line2: e.target.value })} />
              </Field>
            </div>
            <Field label="Tagline">
              <Textarea rows={3} value={v.tagline} onChange={(e) => set({ tagline: e.target.value })} />
            </Field>
          </SectionCard>

          {/* STATS */}
          <SectionCard
            title="Stats row"
            description="Three numbers shown below the tagline."
            toggle={
              <Switch
                className={switchCls}
                checked={v.stats_enabled !== false}
                onCheckedChange={(c) => set({ stats_enabled: c })}
              />
            }
          >
            {v.stats.map((s, i) => (
              <div key={i} className="rounded-md border border-border p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium">Stat {i + 1}</div>
                  <Switch
                    className={switchCls}
                    checked={s.enabled !== false}
                    onCheckedChange={(c) => updateStat(i, { enabled: c })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Value">
                    <Input value={s.value} onChange={(e) => updateStat(i, { value: e.target.value })} />
                  </Field>
                  <Field label="Label">
                    <Input value={s.label} onChange={(e) => updateStat(i, { label: e.target.value })} />
                  </Field>
                </div>
              </div>
            ))}
          </SectionCard>

          {/* CTAs */}
          <SectionCard title="Call-to-action buttons" description="The two buttons at the bottom of the hero.">
            <div className="rounded-md border border-border p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium">Primary button</div>
                <Switch
                  className={switchCls}
                  checked={v.cta_primary_enabled !== false}
                  onCheckedChange={(c) => set({ cta_primary_enabled: c })}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Label">
                  <Input value={v.cta_primary_label} onChange={(e) => set({ cta_primary_label: e.target.value })} />
                </Field>
                <Field label="URL">
                  <Input value={v.cta_primary_url} onChange={(e) => set({ cta_primary_url: e.target.value })} />
                </Field>
              </div>
            </div>
            <div className="rounded-md border border-border p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium">Secondary link</div>
                <Switch
                  className={switchCls}
                  checked={v.cta_secondary_enabled !== false}
                  onCheckedChange={(c) => set({ cta_secondary_enabled: c })}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Label">
                  <Input value={v.cta_secondary_label} onChange={(e) => set({ cta_secondary_label: e.target.value })} />
                </Field>
                <Field label="URL">
                  <Input value={v.cta_secondary_url} onChange={(e) => set({ cta_secondary_url: e.target.value })} />
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* WORK section header */}
          <SectionCard
            title="Work section (on home)"
            description="The selected-work block shown on the home page."
            toggle={
              <Switch
                className={switchCls}
                checked={v.work_enabled !== false}
                onCheckedChange={(c) => set({ work_enabled: c })}
              />
            }
          >
            <Field label="Eyebrow">
              <Input value={v.work_eyebrow} onChange={(e) => set({ work_eyebrow: e.target.value })} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Headline (regular part)">
                <Input value={v.work_headline_pre} onChange={(e) => set({ work_headline_pre: e.target.value })} />
              </Field>
              <Field label="Headline (italic word)">
                <Input value={v.work_headline_italic} onChange={(e) => set({ work_headline_italic: e.target.value })} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Button label">
                <Input value={v.work_button_label} onChange={(e) => set({ work_button_label: e.target.value })} />
              </Field>
              <Field label="Button URL">
                <Input value={v.work_button_url} onChange={(e) => set({ work_button_url: e.target.value })} />
              </Field>
            </div>
          </SectionCard>

          {/* BLOG section header */}
          <SectionCard
            title="Blog section (on home)"
            description="The writing/journal block shown on the home page."
            toggle={
              <Switch
                className={switchCls}
                checked={v.blog_enabled !== false}
                onCheckedChange={(c) => set({ blog_enabled: c })}
              />
            }
          >
            <Field label="Eyebrow">
              <Input value={v.blog_eyebrow} onChange={(e) => set({ blog_eyebrow: e.target.value })} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Headline (regular part)">
                <Input value={v.blog_headline_pre} onChange={(e) => set({ blog_headline_pre: e.target.value })} />
              </Field>
              <Field label="Headline (italic word)">
                <Input value={v.blog_headline_italic} onChange={(e) => set({ blog_headline_italic: e.target.value })} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Button label">
                <Input value={v.blog_button_label} onChange={(e) => set({ blog_button_label: e.target.value })} />
              </Field>
              <Field label="Button URL">
                <Input value={v.blog_button_url} onChange={(e) => set({ blog_button_url: e.target.value })} />
              </Field>
            </div>
          </SectionCard>

          {/* CONTACT */}
          <SectionCard
            title="Contact section"
            description="The contact form block at the bottom of the home page."
            toggle={
              <Switch
                className={switchCls}
                checked={v.contact_enabled !== false}
                onCheckedChange={(c) => set({ contact_enabled: c })}
              />
            }
          >
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Headline — first line">
                <Input value={v.contact_headline_line1} onChange={(e) => set({ contact_headline_line1: e.target.value })} />
              </Field>
              <Field label="Headline — second line (muted)">
                <Input value={v.contact_headline_line2} onChange={(e) => set({ contact_headline_line2: e.target.value })} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Email">
                <Input value={v.contact_email} onChange={(e) => set({ contact_email: e.target.value })} />
              </Field>
              <Field label="Phone">
                <Input value={v.contact_phone} onChange={(e) => set({ contact_phone: e.target.value })} />
              </Field>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium">Social links</div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    set({ contact_socials: [...v.contact_socials, { label: "", url: "", enabled: true }] })
                  }
                >
                  <Plus className="size-4 mr-1" /> Add
                </Button>
              </div>
              {v.contact_socials.map((s, i) => (
                <div key={i} className="rounded-md border border-border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-medium text-muted-foreground">Link {i + 1}</div>
                    <div className="flex items-center gap-2">
                      <Switch
                        className={switchCls}
                        checked={s.enabled !== false}
                        onCheckedChange={(c) => updateSocial(i, { enabled: c })}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => set({ contact_socials: v.contact_socials.filter((_, j) => j !== i) })}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Label"
                      value={s.label}
                      onChange={(e) => updateSocial(i, { label: e.target.value })}
                    />
                    <Input
                      placeholder="URL"
                      value={s.url}
                      onChange={(e) => updateSocial(i, { url: e.target.value })}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Field label="Send button label">
              <Input value={v.contact_send_label} onChange={(e) => set({ contact_send_label: e.target.value })} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Name placeholder">
                <Input value={v.contact_name_placeholder} onChange={(e) => set({ contact_name_placeholder: e.target.value })} />
              </Field>
              <Field label="Email placeholder">
                <Input value={v.contact_email_placeholder} onChange={(e) => set({ contact_email_placeholder: e.target.value })} />
              </Field>
              <Field label="Subject placeholder">
                <Input value={v.contact_subject_placeholder} onChange={(e) => set({ contact_subject_placeholder: e.target.value })} />
              </Field>
              <Field label="Message placeholder">
                <Input value={v.contact_message_placeholder} onChange={(e) => set({ contact_message_placeholder: e.target.value })} />
              </Field>
            </div>
          </SectionCard>
        </div>
      )}
    </form>
  );
}
