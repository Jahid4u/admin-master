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

export const Route = createFileRoute("/admin/site/blog")({ component: BlogAdminPage });

type BlogSettings = {
  badge_enabled: boolean;
  badge_text: string;
  headline_enabled: boolean;
  headline_pre: string;
  headline_accent: string;
  description_enabled: boolean;
  description: string;
};

const defaults: BlogSettings = {
  badge_enabled: true,
  badge_text: "Our Blog",
  headline_enabled: true,
  headline_pre: "Insights &",
  headline_accent: "Ideas",
  description_enabled: true,
  description:
    "Stay updated with the latest trends, tips, and insights from our team of digital experts.",
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

function BlogAdminPage() {
  const qc = useQueryClient();
  const getAll = useServerFn(adminGetAllSettings);
  const update = useServerFn(adminUpdateSetting);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => getAll(),
  });

  const initial = { ...defaults, ...((data?.blog_page as object | undefined) ?? {}) } as BlogSettings;
  const [v, setV] = useState<BlogSettings>(initial);

  useEffect(() => {
    setV(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)]);

  const set = (patch: Partial<BlogSettings>) => setV({ ...v, ...patch });

  const saveMut = useMutation({
    mutationFn: () => update({ data: { key: "blog_page", value: v } }),
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
        title="Blog page"
        description="Edit every element shown at the top of the /blog page."
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
          {/* BADGE */}
          <SectionCard
            title="Badge"
            description="The small pill above the headline (e.g. OUR BLOG)."
            toggle={
              <Switch
                className={switchCls}
                checked={v.badge_enabled !== false}
                onCheckedChange={(c) => set({ badge_enabled: c })}
              />
            }
          >
            <Field label="Badge text">
              <Input value={v.badge_text} onChange={(e) => set({ badge_text: e.target.value })} />
            </Field>
          </SectionCard>

          {/* HEADLINE */}
          <SectionCard
            title="Headline"
            description="The big title. The accent word is rendered in blue."
            toggle={
              <Switch
                className={switchCls}
                checked={v.headline_enabled !== false}
                onCheckedChange={(c) => set({ headline_enabled: c })}
              />
            }
          >
            <Field label="Headline (plain part)">
              <Input value={v.headline_pre} onChange={(e) => set({ headline_pre: e.target.value })} />
            </Field>
            <Field label="Accent word (blue)">
              <Input value={v.headline_accent} onChange={(e) => set({ headline_accent: e.target.value })} />
            </Field>
          </SectionCard>

          {/* DESCRIPTION */}
          <SectionCard
            title="Description"
            description="The paragraph below the headline."
            toggle={
              <Switch
                className={switchCls}
                checked={v.description_enabled !== false}
                onCheckedChange={(c) => set({ description_enabled: c })}
              />
            }
          >
            <Field label="Description text">
              <Textarea rows={4} value={v.description} onChange={(e) => set({ description: e.target.value })} />
            </Field>
          </SectionCard>
        </div>
      )}
    </form>
  );
}
