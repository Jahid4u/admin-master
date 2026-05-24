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

export const Route = createFileRoute("/admin/site/terms")({ component: TermsAdminPage });

type Section = { heading: string; body: string; enabled?: boolean };

type Terms = {
  back_enabled: boolean;
  back_label: string;

  badge_enabled: boolean;
  badge_text: string;

  title_enabled: boolean;
  title_text: string;

  updated_enabled: boolean;
  updated_text: string;

  sections: Section[];
};

const defaults: Terms = {
  back_enabled: true,
  back_label: "Back home",

  badge_enabled: true,
  badge_text: "Legal",

  title_enabled: true,
  title_text: "Terms of Service",

  updated_enabled: true,
  updated_text: "Last updated: May 24, 2026",

  sections: [
    { heading: "1. Acceptance of Terms", body: "By accessing this website or engaging me for work, you agree to these terms. If you do not agree, please discontinue use of the site and services.", enabled: true },
    { heading: "2. Intellectual Property", body: "All content displayed on this site — including case studies, writing, imagery, and source code samples — is the property of Jahid Hasan unless otherwise credited. Do not reproduce or republish without written permission.", enabled: true },
    { heading: "3. Project Engagements", body: "Client work is governed by a separate signed agreement covering scope, timeline, deliverables, payment, and ownership. These terms supplement, and do not replace, any such agreement.", enabled: true },
    { heading: "4. Limitation of Liability", body: "The site and its content are provided \"as is\" without warranty of any kind. I am not liable for any indirect, incidental, or consequential damages arising from your use of the site.", enabled: true },
    { heading: "5. Changes", body: "These terms may be updated from time to time. Continued use of the site after changes constitutes acceptance of the revised terms.", enabled: true },
    { heading: "6. Contact", body: "Questions about these terms? Email jahidmail2020@gmail.com.", enabled: true },
  ],
};

const switchCls = "border border-border data-[state=unchecked]:bg-muted";

function SectionCard({
  title, description, toggle, children,
}: { title: string; description?: string; toggle?: ReactNode; children: ReactNode }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">{title}</div>
            {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
          </div>
          {toggle}
        </div>
        <div className="space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
}

function TermsAdminPage() {
  const qc = useQueryClient();
  const getAll = useServerFn(adminGetAllSettings);
  const update = useServerFn(adminUpdateSetting);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => getAll(),
  });

  const initial = { ...defaults, ...((data?.terms_page as object | undefined) ?? {}) } as Terms;
  const [v, setV] = useState<Terms>(initial);

  useEffect(() => {
    setV(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)]);

  const set = (patch: Partial<Terms>) => setV({ ...v, ...patch });

  const saveMut = useMutation({
    mutationFn: () => update({ data: { key: "terms_page", value: v } }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      qc.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const patchSection = (i: number, patch: Partial<Section>) => {
    const next = [...v.sections]; next[i] = { ...next[i], ...patch };
    set({ sections: next });
  };
  const removeSection = (i: number) => set({ sections: v.sections.filter((_, idx) => idx !== i) });

  return (
    <form onSubmit={(e) => { e.preventDefault(); saveMut.mutate(); }} className="max-w-2xl">
      <PageHeader
        title="Terms of service"
        description="Edit every block of the /terms page in its own container."
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
            title="Back home link"
            description="The arrow link at the top left of the page."
            toggle={<Switch className={switchCls} checked={v.back_enabled !== false} onCheckedChange={(c) => set({ back_enabled: c })} />}
          >
            <Field label="Label"><Input value={v.back_label} onChange={(e) => set({ back_label: e.target.value })} /></Field>
          </SectionCard>

          <SectionCard
            title="Legal badge"
            description="Small pill with the document icon above the title."
            toggle={<Switch className={switchCls} checked={v.badge_enabled !== false} onCheckedChange={(c) => set({ badge_enabled: c })} />}
          >
            <Field label="Badge text"><Input value={v.badge_text} onChange={(e) => set({ badge_text: e.target.value })} /></Field>
          </SectionCard>

          <SectionCard
            title="Page title"
            toggle={<Switch className={switchCls} checked={v.title_enabled !== false} onCheckedChange={(c) => set({ title_enabled: c })} />}
          >
            <Field label="Title"><Input value={v.title_text} onChange={(e) => set({ title_text: e.target.value })} /></Field>
          </SectionCard>

          <SectionCard
            title="Last updated line"
            toggle={<Switch className={switchCls} checked={v.updated_enabled !== false} onCheckedChange={(c) => set({ updated_enabled: c })} />}
          >
            <Field label="Text"><Input value={v.updated_text} onChange={(e) => set({ updated_text: e.target.value })} placeholder="Last updated: May 24, 2026" /></Field>
          </SectionCard>

          <SectionCard
            title="Sections"
            description="Each numbered terms section with its heading and body. Add, remove, or toggle individually."
          >
            {v.sections.map((s, i) => (
              <Card key={i} className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Section {i + 1}</div>
                    <div className="flex items-center gap-2">
                      <Switch className={switchCls} checked={s.enabled !== false} onCheckedChange={(c) => patchSection(i, { enabled: c })} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeSection(i)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <Field label="Heading"><Input value={s.heading} onChange={(e) => patchSection(i, { heading: e.target.value })} /></Field>
                  <Field label="Body"><Textarea rows={4} value={s.body} onChange={(e) => patchSection(i, { body: e.target.value })} /></Field>
                </CardContent>
              </Card>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => set({ sections: [...v.sections, { heading: "", body: "", enabled: true }] })}><Plus className="w-4 h-4 mr-1" />Add section</Button>
          </SectionCard>
        </div>
      )}
    </form>
  );
}
