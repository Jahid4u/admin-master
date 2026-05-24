import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, SiteSectionEditor } from "@/components/admin/SiteSectionEditor";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/site/services")({ component: ServicesPage });

type Service = { title: string; description: string; icon: string };
type Services = { headline: string; subtitle: string; items: Service[] };
const defaults: Services = { headline: "", subtitle: "", items: [] };

function ServicesPage() {
  return (
    <SiteSectionEditor<Services>
      title="Services / Skills"
      description="The list of what you offer, shown on the home page."
      settingKey={"services" as never}
      defaults={defaults}
      render={(v, set) => (
        <>
          <Field label="Section headline">
            <Input value={v.headline} onChange={(e) => set({ ...v, headline: e.target.value })} />
          </Field>
          <Field label="Section subtitle">
            <Textarea rows={2} value={v.subtitle} onChange={(e) => set({ ...v, subtitle: e.target.value })} />
          </Field>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Items</span>
              <Button type="button" size="sm" variant="outline" onClick={() => set({ ...v, items: [...v.items, { title: "", description: "", icon: "" }] })}>
                <Plus className="size-4 mr-1" /> Add item
              </Button>
            </div>
            {v.items.map((it, i) => (
              <div key={i} className="border rounded-md p-3 space-y-2">
                <div className="flex gap-2">
                  <Input placeholder="Title" value={it.title} onChange={(e) => {
                    const next = [...v.items]; next[i] = { ...it, title: e.target.value }; set({ ...v, items: next });
                  }} />
                  <Input placeholder="Icon (e.g. 🎨 or lucide name)" value={it.icon} onChange={(e) => {
                    const next = [...v.items]; next[i] = { ...it, icon: e.target.value }; set({ ...v, items: next });
                  }} />
                  <Button type="button" size="icon" variant="ghost" onClick={() => set({ ...v, items: v.items.filter((_, j) => j !== i) })}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <Textarea rows={2} placeholder="Short description" value={it.description} onChange={(e) => {
                  const next = [...v.items]; next[i] = { ...it, description: e.target.value }; set({ ...v, items: next });
                }} />
              </div>
            ))}
            {v.items.length === 0 && <p className="text-xs text-muted-foreground">No services yet.</p>}
          </div>
        </>
      )}
    />
  );
}
