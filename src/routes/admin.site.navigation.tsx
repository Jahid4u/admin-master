import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, SiteSectionEditor } from "@/components/admin/SiteSectionEditor";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/site/navigation")({ component: NavPage });

type NavLink = { label: string; url: string };
type Nav = { logo_text: string; cta_label: string; cta_url: string; links: NavLink[] };
const defaults: Nav = { logo_text: "", cta_label: "", cta_url: "", links: [] };

function NavPage() {
  return (
    <SiteSectionEditor<Nav>
      title="Navigation"
      description="Logo text, header links and the call-to-action button shown in the top nav."
      settingKey={"navigation" as never}
      defaults={defaults}
      render={(v, set) => (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Logo text">
              <Input value={v.logo_text} onChange={(e) => set({ ...v, logo_text: e.target.value })} />
            </Field>
            <Field label="CTA label">
              <Input value={v.cta_label} onChange={(e) => set({ ...v, cta_label: e.target.value })} />
            </Field>
            <Field label="CTA URL">
              <Input value={v.cta_url} onChange={(e) => set({ ...v, cta_url: e.target.value })} />
            </Field>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Nav links</span>
              <Button type="button" size="sm" variant="outline" onClick={() => set({ ...v, links: [...v.links, { label: "", url: "" }] })}>
                <Plus className="size-4 mr-1" /> Add link
              </Button>
            </div>
            {v.links.map((l, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Input placeholder="Label" value={l.label} onChange={(e) => {
                  const next = [...v.links]; next[i] = { ...l, label: e.target.value }; set({ ...v, links: next });
                }} />
                <Input placeholder="/url" value={l.url} onChange={(e) => {
                  const next = [...v.links]; next[i] = { ...l, url: e.target.value }; set({ ...v, links: next });
                }} />
                <Button type="button" size="icon" variant="ghost" onClick={() => set({ ...v, links: v.links.filter((_, j) => j !== i) })}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            {v.links.length === 0 && <p className="text-xs text-muted-foreground">No links yet.</p>}
          </div>
        </>
      )}
    />
  );
}
