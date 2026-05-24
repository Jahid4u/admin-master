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

export const Route = createFileRoute("/admin/site/footer")({ component: FooterPage });

type Footer = {
  newsletter_enabled: boolean;
  newsletter_title: string;
  newsletter_desc: string;
  newsletter_placeholder: string;
  newsletter_button: string;
  big_name_enabled: boolean;
  big_name: string;
  copyright: string;
  privacy_enabled: boolean;
  privacy_label: string;
  privacy_url: string;
  terms_enabled: boolean;
  terms_label: string;
  terms_url: string;
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
  privacy_url: "/privacy",
  terms_enabled: true,
  terms_label: "TERMS OF SERVICE",
  terms_url: "/terms",
  tagline: "",
};

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

const switchCls = "border border-border data-[state=unchecked]:bg-muted";

function FooterPage() {
  const qc = useQueryClient();
  const getAll = useServerFn(adminGetAllSettings);
  const update = useServerFn(adminUpdateSetting);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => getAll(),
  });

  const initial = { ...defaults, ...((data?.footer as object | undefined) ?? {}) } as Footer;
  const [v, setV] = useState<Footer>(initial);

  useEffect(() => {
    setV(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)]);

  const set = (patch: Partial<Footer>) => setV({ ...v, ...patch });

  const saveMut = useMutation({
    mutationFn: () => update({ data: { key: "footer", value: v } }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      qc.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveMut.mutate();
      }}
      className="max-w-2xl"
    >
      <PageHeader
        title="Footer"
        description="Edit every element of the site footer — newsletter, big name display, copyright and bottom links."
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
          <SectionCard
            title="Newsletter block"
            description="Shown at the very top of the footer on every page."
            toggle={
              <Switch
                className={switchCls}
                checked={v.newsletter_enabled !== false}
                onCheckedChange={(c) => set({ newsletter_enabled: c })}
              />
            }
          >
            <Field label="Title">
              <Input value={v.newsletter_title} onChange={(e) => set({ newsletter_title: e.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea rows={2} value={v.newsletter_desc} onChange={(e) => set({ newsletter_desc: e.target.value })} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email placeholder">
                <Input value={v.newsletter_placeholder} onChange={(e) => set({ newsletter_placeholder: e.target.value })} />
              </Field>
              <Field label="Button label">
                <Input value={v.newsletter_button} onChange={(e) => set({ newsletter_button: e.target.value })} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            title="Big name display"
            description="The huge animated name shown in the footer."
            toggle={
              <Switch
                className={switchCls}
                checked={v.big_name_enabled !== false}
                onCheckedChange={(c) => set({ big_name_enabled: c })}
              />
            }
          >
            <Field label="Display text">
              <Input value={v.big_name} onChange={(e) => set({ big_name: e.target.value })} placeholder="JAHID HASAN" />
            </Field>
          </SectionCard>

          <SectionCard title="Copyright">
            <Field label="Copyright line">
              <Input
                value={v.copyright}
                onChange={(e) => set({ copyright: e.target.value })}
                placeholder="© 2026 Your name. All rights reserved."
              />
            </Field>
          </SectionCard>

          <SectionCard title="Bottom links" description="Links shown next to the copyright line.">
            <div className="space-y-3 pb-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Privacy policy</div>
                <Switch
                  className={switchCls}
                  checked={v.privacy_enabled !== false}
                  onCheckedChange={(c) => set({ privacy_enabled: c })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Label">
                  <Input value={v.privacy_label} onChange={(e) => set({ privacy_label: e.target.value })} />
                </Field>
                <Field label="Link URL">
                  <Input
                    value={v.privacy_url}
                    onChange={(e) => set({ privacy_url: e.target.value })}
                    placeholder="/privacy"
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Terms of service</div>
                <Switch
                  className={switchCls}
                  checked={v.terms_enabled !== false}
                  onCheckedChange={(c) => set({ terms_enabled: c })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Label">
                  <Input value={v.terms_label} onChange={(e) => set({ terms_label: e.target.value })} />
                </Field>
                <Field label="Link URL">
                  <Input
                    value={v.terms_url}
                    onChange={(e) => set({ terms_url: e.target.value })}
                    placeholder="/terms"
                  />
                </Field>
              </div>
            </div>
          </SectionCard>
        </div>
      )}
    </form>
  );
}
