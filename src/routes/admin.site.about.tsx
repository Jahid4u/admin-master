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
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/site/about")({ component: AboutAdminPage });

type Item = { label?: string; url?: string; enabled?: boolean };
type Experience = { company: string; period: string; role: string; enabled?: boolean };
type Study = { title: string; detail: string; enabled?: boolean };
type Lang = { name: string; enabled?: boolean };
type Tech = { icon: string; name: string; enabled?: boolean };

type About = {
  hero_enabled: boolean;
  badge_enabled: boolean;
  badge_text: string;
  headline_pre: string;
  headline_italic: string;
  headline_suffix: string;
  bio: string;
  cta_enabled: boolean;
  cta_label: string;
  cta_url: string;
  socials_enabled: boolean;
  socials: Item[];

  profile_enabled: boolean;
  profile_image: string | null;
  profile_name: string;
  profile_role: string;

  location_enabled: boolean;
  location_line1: string;
  location_line2: string;

  cv_enabled: boolean;
  cv_label: string;
  cv_url: string;

  experience_enabled: boolean;
  experience_title: string;
  experiences: Experience[];

  studies_enabled: boolean;
  studies_title: string;
  studies: Study[];

  languages_enabled: boolean;
  languages_title: string;
  languages: Lang[];

  tech_enabled: boolean;
  tech_title: string;
  tech_description: string;
  tech_items: Tech[];
};

const defaults: About = {
  hero_enabled: true,
  badge_enabled: true,
  badge_text: "Available for work",
  headline_pre: "Crafting digital experiences with",
  headline_italic: "purpose",
  headline_suffix: ".",
  bio: "I'm Jahid Hasan, founder of Apifel DIGI. I design brands and build websites — combining strong visual thinking with solid development skills to help creators stand out.",
  cta_enabled: true,
  cta_label: "Hire Me Now",
  cta_url: "#contact",
  socials_enabled: true,
  socials: [
    { label: "Twitter", url: "#", enabled: true },
    { label: "LinkedIn", url: "#", enabled: true },
    { label: "Instagram", url: "#", enabled: true },
  ],

  profile_enabled: true,
  profile_image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800",
  profile_name: "Jahid Hasan",
  profile_role: "Graphic Designer & Dev",

  location_enabled: true,
  location_line1: "Based in Dhaka,",
  location_line2: "Bangladesh",

  cv_enabled: true,
  cv_label: "Download CV",
  cv_url: "#",

  experience_enabled: true,
  experience_title: "Work Experience",
  experiences: [
    { company: "Apifel DIGI", period: "2021 - Present", role: "Founder — Graphic Designer & Web Developer", enabled: true },
    { company: "FreshMind Agency", period: "2019 - 2021", role: "Senior Graphic Designer & Web Developer", enabled: true },
    { company: "StreamFlow Media", period: "2018 - 2019", role: "Graphic Designer", enabled: true },
    { company: "Freelance", period: "2016 - 2018", role: "Freelance Designer & WordPress Developer", enabled: true },
  ],

  studies_enabled: true,
  studies_title: "Studies",
  studies: [
    { title: "Visual Communication", detail: "Diploma — Graphic Design & Visual Arts (2014 - 2016)", enabled: true },
    { title: "Web Development", detail: "Full-Stack Web Development, WordPress (2016 - Present)", enabled: true },
  ],

  languages_enabled: true,
  languages_title: "Languages",
  languages: [
    { name: "English", enabled: true },
    { name: "Bengali", enabled: true },
  ],

  tech_enabled: true,
  tech_title: "Technical Arsenal",
  tech_description: "The tools and technologies I use to bring ideas to life.",
  tech_items: [
    { icon: "Ps", name: "Photoshop", enabled: true },
    { icon: "Ai", name: "Illustrator", enabled: true },
    { icon: "Fg", name: "Figma", enabled: true },
    { icon: "Wp", name: "WordPress", enabled: true },
    { icon: "{ }", name: "HTML/CSS", enabled: true },
    { icon: "Php", name: "PHP", enabled: true },
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

function AboutAdminPage() {
  const qc = useQueryClient();
  const getAll = useServerFn(adminGetAllSettings);
  const update = useServerFn(adminUpdateSetting);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => getAll(),
  });

  const initial = { ...defaults, ...((data?.about_page as object | undefined) ?? {}) } as About;
  const [v, setV] = useState<About>(initial);

  useEffect(() => {
    setV(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)]);

  const set = (patch: Partial<About>) => setV({ ...v, ...patch });

  const saveMut = useMutation({
    mutationFn: () => update({ data: { key: "about_page", value: v } }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      qc.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  // List helpers
  const patchList = <T,>(list: T[], i: number, patch: Partial<T>): T[] => {
    const next = [...list]; next[i] = { ...next[i], ...patch }; return next;
  };
  const removeAt = <T,>(list: T[], i: number): T[] => list.filter((_, idx) => idx !== i);

  return (
    <form onSubmit={(e) => { e.preventDefault(); saveMut.mutate(); }} className="max-w-2xl">
      <PageHeader
        title="About page"
        description="Edit every block of the /about page in its own container."
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
          {/* HERO CARD */}
          <SectionCard
            title="Hero card"
            description="Big intro card — badge, headline, bio."
            toggle={<Switch className={switchCls} checked={v.hero_enabled !== false} onCheckedChange={(c) => set({ hero_enabled: c })} />}
          >
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div className="text-xs font-medium">Status badge</div>
              <Switch className={switchCls} checked={v.badge_enabled !== false} onCheckedChange={(c) => set({ badge_enabled: c })} />
            </div>
            <Field label="Badge text"><Input value={v.badge_text} onChange={(e) => set({ badge_text: e.target.value })} /></Field>
            <Field label="Headline (before italic)"><Input value={v.headline_pre} onChange={(e) => set({ headline_pre: e.target.value })} /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Italic accent word"><Input value={v.headline_italic} onChange={(e) => set({ headline_italic: e.target.value })} /></Field>
              <Field label="Trailing punctuation"><Input value={v.headline_suffix} onChange={(e) => set({ headline_suffix: e.target.value })} /></Field>
            </div>
            <Field label="Bio"><Textarea rows={4} value={v.bio} onChange={(e) => set({ bio: e.target.value })} /></Field>
          </SectionCard>

          {/* CTA */}
          <SectionCard
            title="Hero CTA button"
            toggle={<Switch className={switchCls} checked={v.cta_enabled !== false} onCheckedChange={(c) => set({ cta_enabled: c })} />}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Label"><Input value={v.cta_label} onChange={(e) => set({ cta_label: e.target.value })} /></Field>
              <Field label="URL"><Input value={v.cta_url} onChange={(e) => set({ cta_url: e.target.value })} /></Field>
            </div>
          </SectionCard>

          {/* SOCIALS */}
          <SectionCard
            title="Hero social icons"
            description="Twitter/LinkedIn/Instagram row next to the CTA."
            toggle={<Switch className={switchCls} checked={v.socials_enabled !== false} onCheckedChange={(c) => set({ socials_enabled: c })} />}
          >
            {v.socials.map((s, i) => (
              <div key={i} className="grid sm:grid-cols-[1fr_1.5fr_auto_auto] gap-2 items-end">
                <Field label="Label"><Input value={s.label || ""} onChange={(e) => set({ socials: patchList(v.socials, i, { label: e.target.value }) })} /></Field>
                <Field label="URL"><Input value={s.url || ""} onChange={(e) => set({ socials: patchList(v.socials, i, { url: e.target.value }) })} /></Field>
                <Switch className={switchCls} checked={s.enabled !== false} onCheckedChange={(c) => set({ socials: patchList(v.socials, i, { enabled: c }) })} />
                <Button type="button" variant="ghost" size="icon" onClick={() => set({ socials: removeAt(v.socials, i) })}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => set({ socials: [...v.socials, { label: "", url: "#", enabled: true }] })}><Plus className="w-4 h-4 mr-1" />Add social</Button>
          </SectionCard>

          {/* PROFILE */}
          <SectionCard
            title="Profile image card"
            toggle={<Switch className={switchCls} checked={v.profile_enabled !== false} onCheckedChange={(c) => set({ profile_enabled: c })} />}
          >
            <ImageUploader label="Profile image" value={v.profile_image} onChange={(u) => set({ profile_image: u })} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name"><Input value={v.profile_name} onChange={(e) => set({ profile_name: e.target.value })} /></Field>
              <Field label="Role"><Input value={v.profile_role} onChange={(e) => set({ profile_role: e.target.value })} /></Field>
            </div>
          </SectionCard>

          {/* LOCATION */}
          <SectionCard
            title="Location card"
            toggle={<Switch className={switchCls} checked={v.location_enabled !== false} onCheckedChange={(c) => set({ location_enabled: c })} />}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Line 1"><Input value={v.location_line1} onChange={(e) => set({ location_line1: e.target.value })} /></Field>
              <Field label="Line 2"><Input value={v.location_line2} onChange={(e) => set({ location_line2: e.target.value })} /></Field>
            </div>
          </SectionCard>

          {/* CV */}
          <SectionCard
            title="Download CV card"
            toggle={<Switch className={switchCls} checked={v.cv_enabled !== false} onCheckedChange={(c) => set({ cv_enabled: c })} />}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Label"><Input value={v.cv_label} onChange={(e) => set({ cv_label: e.target.value })} /></Field>
              <Field label="URL"><Input value={v.cv_url} onChange={(e) => set({ cv_url: e.target.value })} /></Field>
            </div>
          </SectionCard>

          {/* EXPERIENCE */}
          <SectionCard
            title="Work experience"
            toggle={<Switch className={switchCls} checked={v.experience_enabled !== false} onCheckedChange={(c) => set({ experience_enabled: c })} />}
          >
            <Field label="Section title"><Input value={v.experience_title} onChange={(e) => set({ experience_title: e.target.value })} /></Field>
            {v.experiences.map((ex, i) => (
              <div key={i} className="rounded-md border border-border p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold">#{i + 1}</span>
                  <div className="flex items-center gap-2">
                    <Switch className={switchCls} checked={ex.enabled !== false} onCheckedChange={(c) => set({ experiences: patchList(v.experiences, i, { enabled: c }) })} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => set({ experiences: removeAt(v.experiences, i) })}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  <Input placeholder="Company" value={ex.company} onChange={(e) => set({ experiences: patchList(v.experiences, i, { company: e.target.value }) })} />
                  <Input placeholder="Period" value={ex.period} onChange={(e) => set({ experiences: patchList(v.experiences, i, { period: e.target.value }) })} />
                </div>
                <Input placeholder="Role" value={ex.role} onChange={(e) => set({ experiences: patchList(v.experiences, i, { role: e.target.value }) })} />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => set({ experiences: [...v.experiences, { company: "", period: "", role: "", enabled: true }] })}><Plus className="w-4 h-4 mr-1" />Add experience</Button>
          </SectionCard>

          {/* STUDIES */}
          <SectionCard
            title="Studies"
            toggle={<Switch className={switchCls} checked={v.studies_enabled !== false} onCheckedChange={(c) => set({ studies_enabled: c })} />}
          >
            <Field label="Section title"><Input value={v.studies_title} onChange={(e) => set({ studies_title: e.target.value })} /></Field>
            {v.studies.map((st, i) => (
              <div key={i} className="rounded-md border border-border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">#{i + 1}</span>
                  <div className="flex items-center gap-2">
                    <Switch className={switchCls} checked={st.enabled !== false} onCheckedChange={(c) => set({ studies: patchList(v.studies, i, { enabled: c }) })} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => set({ studies: removeAt(v.studies, i) })}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <Input placeholder="Title" value={st.title} onChange={(e) => set({ studies: patchList(v.studies, i, { title: e.target.value }) })} />
                <Input placeholder="Detail" value={st.detail} onChange={(e) => set({ studies: patchList(v.studies, i, { detail: e.target.value }) })} />
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => set({ studies: [...v.studies, { title: "", detail: "", enabled: true }] })}><Plus className="w-4 h-4 mr-1" />Add study</Button>
          </SectionCard>

          {/* LANGUAGES */}
          <SectionCard
            title="Languages"
            toggle={<Switch className={switchCls} checked={v.languages_enabled !== false} onCheckedChange={(c) => set({ languages_enabled: c })} />}
          >
            <Field label="Section title"><Input value={v.languages_title} onChange={(e) => set({ languages_title: e.target.value })} /></Field>
            {v.languages.map((l, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input placeholder="Language" value={l.name} onChange={(e) => set({ languages: patchList(v.languages, i, { name: e.target.value }) })} />
                <Switch className={switchCls} checked={l.enabled !== false} onCheckedChange={(c) => set({ languages: patchList(v.languages, i, { enabled: c }) })} />
                <Button type="button" variant="ghost" size="icon" onClick={() => set({ languages: removeAt(v.languages, i) })}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => set({ languages: [...v.languages, { name: "", enabled: true }] })}><Plus className="w-4 h-4 mr-1" />Add language</Button>
          </SectionCard>

          {/* TECHNICAL ARSENAL */}
          <SectionCard
            title="Technical arsenal"
            toggle={<Switch className={switchCls} checked={v.tech_enabled !== false} onCheckedChange={(c) => set({ tech_enabled: c })} />}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title"><Input value={v.tech_title} onChange={(e) => set({ tech_title: e.target.value })} /></Field>
              <Field label="Description"><Input value={v.tech_description} onChange={(e) => set({ tech_description: e.target.value })} /></Field>
            </div>
            {v.tech_items.map((t, i) => (
              <div key={i} className="grid grid-cols-[80px_1fr_auto_auto] gap-2 items-center">
                <Input placeholder="Ps" value={t.icon} onChange={(e) => set({ tech_items: patchList(v.tech_items, i, { icon: e.target.value }) })} />
                <Input placeholder="Photoshop" value={t.name} onChange={(e) => set({ tech_items: patchList(v.tech_items, i, { name: e.target.value }) })} />
                <Switch className={switchCls} checked={t.enabled !== false} onCheckedChange={(c) => set({ tech_items: patchList(v.tech_items, i, { enabled: c }) })} />
                <Button type="button" variant="ghost" size="icon" onClick={() => set({ tech_items: removeAt(v.tech_items, i) })}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => set({ tech_items: [...v.tech_items, { icon: "", name: "", enabled: true }] })}><Plus className="w-4 h-4 mr-1" />Add tool</Button>
          </SectionCard>
        </div>
      )}
    </form>
  );
}
