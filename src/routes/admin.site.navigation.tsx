import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminGetAllSettings, adminUpdateSetting } from "@/lib/admin.functions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { Field } from "@/components/admin/SiteSectionEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

export const Route = createFileRoute("/admin/site/navigation")({ component: NavPage });

type NavLink = { label: string; url: string; visible?: boolean };

type Nav = {
  brand_enabled: boolean;
  brand_name: string;
  brand_location: string;

  avatar_enabled: boolean;
  avatar_url: string | null;

  links: NavLink[];

  theme_toggle_enabled: boolean;

  cta_enabled: boolean;
  cta_label: string;
  cta_url: string;

  time_enabled: boolean;
  time_label: string;
  time_timezone: string;
  time_hour12: boolean;
  time_show_seconds: boolean;

  // legacy (kept so old saved data doesn't break)
  logo_text?: string;
};

const defaults: Nav = {
  brand_enabled: true,
  brand_name: "JAHID HASAN",
  brand_location: "DHAKA, BANGLADESH",

  avatar_enabled: true,
  avatar_url: null,

  links: [
    { label: "Home", url: "/", visible: true },
    { label: "Work", url: "/work", visible: true },
    { label: "Blog", url: "/blog", visible: true },
    { label: "About", url: "/about", visible: true },
    { label: "Contact", url: "/contact", visible: true },
  ],

  theme_toggle_enabled: true,

  cta_enabled: true,
  cta_label: "Connect",
  cta_url: "/contact",

  time_enabled: true,
  time_label: "LOCAL TIME (GMT+6)",
  time_timezone: "Asia/Dhaka",
  time_hour12: false,
  time_show_seconds: true,
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

const TZ_PRESETS: { value: string; label: string }[] = [
  { value: "Asia/Dhaka", label: "Dhaka (GMT+6)" },
  { value: "Asia/Kolkata", label: "Kolkata (GMT+5:30)" },
  { value: "Asia/Karachi", label: "Karachi (GMT+5)" },
  { value: "Asia/Dubai", label: "Dubai (GMT+4)" },
  { value: "Asia/Singapore", label: "Singapore (GMT+8)" },
  { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
  { value: "Australia/Sydney", label: "Sydney (GMT+10/11)" },
  { value: "Europe/London", label: "London (GMT+0/1)" },
  { value: "Europe/Berlin", label: "Berlin (GMT+1/2)" },
  { value: "Europe/Istanbul", label: "Istanbul (GMT+3)" },
  { value: "America/New_York", label: "New York (GMT-5/-4)" },
  { value: "America/Chicago", label: "Chicago (GMT-6/-5)" },
  { value: "America/Denver", label: "Denver (GMT-7/-6)" },
  { value: "America/Los_Angeles", label: "Los Angeles (GMT-8/-7)" },
  { value: "America/Sao_Paulo", label: "São Paulo (GMT-3)" },
  { value: "UTC", label: "UTC" },
];

function NavPage() {
  const qc = useQueryClient();
  const getAll = useServerFn(adminGetAllSettings);
  const update = useServerFn(adminUpdateSetting);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => getAll(),
  });

  const initial = { ...defaults, ...((data?.navigation as object | undefined) ?? {}) } as Nav;
  const [v, setV] = useState<Nav>(initial);

  useEffect(() => {
    setV(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)]);

  const set = (patch: Partial<Nav>) => setV({ ...v, ...patch });

  const setLink = (i: number, patch: Partial<NavLink>) => {
    const next = [...v.links];
    next[i] = { ...next[i], ...patch };
    set({ links: next });
  };
  const moveLink = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= v.links.length) return;
    const next = [...v.links];
    [next[i], next[j]] = [next[j], next[i]];
    set({ links: next });
  };
  const removeLink = (i: number) => set({ links: v.links.filter((_, j) => j !== i) });
  const addLink = () => set({ links: [...v.links, { label: "", url: "", visible: true }] });

  const saveMut = useMutation({
    mutationFn: () => update({ data: { key: "navigation", value: v } }),
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
        title="Header / Navigation"
        description="Edit every element of the site header — brand, avatar, nav links, theme toggle, CTA and the local time display."
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
            title="Brand (left side)"
            description="The name and location shown on the far left of the header."
            toggle={
              <Switch
                className={switchCls}
                checked={v.brand_enabled !== false}
                onCheckedChange={(c) => set({ brand_enabled: c })}
              />
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name">
                <Input
                  value={v.brand_name}
                  onChange={(e) => set({ brand_name: e.target.value })}
                  placeholder="JAHID HASAN"
                />
              </Field>
              <Field label="Location / subtitle">
                <Input
                  value={v.brand_location}
                  onChange={(e) => set({ brand_location: e.target.value })}
                  placeholder="DHAKA, BANGLADESH"
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            title="Profile avatar"
            description="The round avatar image inside the header pill."
            toggle={
              <Switch
                className={switchCls}
                checked={v.avatar_enabled !== false}
                onCheckedChange={(c) => set({ avatar_enabled: c })}
              />
            }
          >
            <ImageUploader
              label="Avatar image"
              value={v.avatar_url}
              onChange={(u) => set({ avatar_url: u })}
            />
          </SectionCard>

          <SectionCard
            title="Navigation links"
            description="The main menu items in the header pill. Toggle, edit, reorder or remove each link."
            toggle={
              <Button type="button" size="sm" variant="outline" onClick={addLink}>
                <Plus className="size-4 mr-1" /> Add link
              </Button>
            }
          >
            {v.links.length === 0 && (
              <p className="text-xs text-muted-foreground">No links yet.</p>
            )}
            <div className="space-y-3">
              {v.links.map((l, i) => (
                <div key={i} className="rounded-md border border-border p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-muted-foreground">
                      Link {i + 1}
                    </div>
                    <div className="flex items-center gap-1">
                      <Switch
                        className={switchCls}
                        checked={l.visible !== false}
                        onCheckedChange={(c) => setLink(i, { visible: c })}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => moveLink(i, -1)}
                        disabled={i === 0}
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => moveLink(i, 1)}
                        disabled={i === v.links.length - 1}
                      >
                        <ArrowDown className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeLink(i)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Label">
                      <Input
                        value={l.label}
                        onChange={(e) => setLink(i, { label: e.target.value })}
                        placeholder="Home"
                      />
                    </Field>
                    <Field label="URL">
                      <Input
                        value={l.url}
                        onChange={(e) => setLink(i, { url: e.target.value })}
                        placeholder="/"
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Theme toggle button"
            description="The sun/moon button that switches dark and light mode."
            toggle={
              <Switch
                className={switchCls}
                checked={v.theme_toggle_enabled !== false}
                onCheckedChange={(c) => set({ theme_toggle_enabled: c })}
              />
            }
          >
            <p className="text-xs text-muted-foreground">
              When off, the dark/light toggle button is hidden from the header.
            </p>
          </SectionCard>

          <SectionCard
            title="CTA button"
            description="The Connect-style button on the right of the header pill."
            toggle={
              <Switch
                className={switchCls}
                checked={v.cta_enabled !== false}
                onCheckedChange={(c) => set({ cta_enabled: c })}
              />
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Button label">
                <Input
                  value={v.cta_label}
                  onChange={(e) => set({ cta_label: e.target.value })}
                  placeholder="Connect"
                />
              </Field>
              <Field label="Button URL">
                <Input
                  value={v.cta_url}
                  onChange={(e) => set({ cta_url: e.target.value })}
                  placeholder="/contact"
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            title="Local time (right side)"
            description="The live clock and caption shown on the far right of the header."
            toggle={
              <Switch
                className={switchCls}
                checked={v.time_enabled !== false}
                onCheckedChange={(c) => set({ time_enabled: c })}
              />
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Caption">
                <Input
                  value={v.time_label}
                  onChange={(e) => set({ time_label: e.target.value })}
                  placeholder="LOCAL TIME (GMT+6)"
                />
              </Field>
              <Field label="Timezone preset">
                <Select
                  value={TZ_PRESETS.some((t) => t.value === v.time_timezone) ? v.time_timezone : "__custom"}
                  onValueChange={(val) => {
                    if (val !== "__custom") set({ time_timezone: val });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pick a timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TZ_PRESETS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="__custom">Custom…</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Timezone (IANA)">
                <Input
                  value={v.time_timezone}
                  onChange={(e) => set({ time_timezone: e.target.value })}
                  placeholder="Asia/Dhaka"
                />
              </Field>
              <Field label="Time format">
                <Select
                  value={v.time_hour12 ? "12" : "24"}
                  onValueChange={(val) => set({ time_hour12: val === "12" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24-hour (14:30)</SelectItem>
                    <SelectItem value="12">12-hour (2:30 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="sm:col-span-2 flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <div className="text-sm font-medium">Show seconds</div>
                  <div className="text-xs text-muted-foreground">Include seconds in the clock (e.g. 14:30:45).</div>
                </div>
                <Switch
                  className={switchCls}
                  checked={v.time_show_seconds !== false}
                  onCheckedChange={(c) => set({ time_show_seconds: c })}
                />
              </div>
            </div>
          </SectionCard>
        </div>
      )}
    </form>
  );
}
