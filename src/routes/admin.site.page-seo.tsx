import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Field, SiteSectionEditor } from "@/components/admin/SiteSectionEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PageMeta = { title: string; description: string; og_image: string | null };
type PageSeo = {
  home: PageMeta;
  about: PageMeta;
  work: PageMeta;
  blog: PageMeta;
  contact: PageMeta;
  privacy: PageMeta;
  terms: PageMeta;
};

const empty: PageMeta = { title: "", description: "", og_image: null };
const defaults: PageSeo = {
  home: empty, about: empty, work: empty, blog: empty,
  contact: empty, privacy: empty, terms: empty,
};

const PAGES: { key: keyof PageSeo; label: string; path: string }[] = [
  { key: "home", label: "Home", path: "/" },
  { key: "about", label: "About", path: "/about" },
  { key: "work", label: "Work", path: "/work" },
  { key: "blog", label: "Blog", path: "/blog" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "privacy", label: "Privacy Policy", path: "/privacy" },
  { key: "terms", label: "Terms of Service", path: "/terms" },
];

export const Route = createFileRoute("/admin/site/page-seo")({ component: PageSeoPage });

function PageSeoPage() {
  return (
    <SiteSectionEditor<PageSeo>
      title="Per-page SEO"
      description="Override meta title, description, and share image for each public page. Leave blank to use defaults."
      settingKey={"page_seo" as never}
      defaults={defaults}
      render={(v, set) => (
        <div className="space-y-5 -mx-2">
          {PAGES.map(({ key, label, path }) => {
            const m = (v[key] ?? empty) as PageMeta;
            const update = (patch: Partial<PageMeta>) =>
              set({ ...v, [key]: { ...m, ...patch } });
            return (
              <Card key={key} className="shadow-none border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {label}
                    <span className="text-[11px] text-muted-foreground font-normal">{path}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field label="Meta title">
                    <Input
                      value={m.title}
                      placeholder="e.g. About — JAHID."
                      onChange={(e) => update({ title: e.target.value })}
                    />
                  </Field>
                  <Field label="Meta description">
                    <Textarea
                      rows={2}
                      value={m.description}
                      placeholder="Short summary shown in search results (≤160 chars)."
                      onChange={(e) => update({ description: e.target.value })}
                    />
                  </Field>
                  <ImageUploader
                    label="Share image (Open Graph)"
                    value={m.og_image}
                    onChange={(u) => update({ og_image: u })}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    />
  );
}
