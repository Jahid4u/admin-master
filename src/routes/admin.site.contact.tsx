import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Field, SiteSectionEditor } from "@/components/admin/SiteSectionEditor";

export const Route = createFileRoute("/admin/site/contact")({
  component: ContactPage,
});

type Contact = { email: string; phone: string; location: string };
const defaults: Contact = { email: "", phone: "", location: "" };

function ContactPage() {
  return (
    <SiteSectionEditor<Contact>
      title="Contact info"
      description="How visitors can reach you — shown on the contact page and footer."
      settingKey="contact"
      defaults={defaults}
      render={(v, set) => (
        <>
          <Field label="Email">
            <Input type="email" value={v.email} onChange={(e) => set({ ...v, email: e.target.value })} />
          </Field>
          <Field label="Phone">
            <Input value={v.phone} onChange={(e) => set({ ...v, phone: e.target.value })} />
          </Field>
          <Field label="Location">
            <Input value={v.location} onChange={(e) => set({ ...v, location: e.target.value })} />
          </Field>
        </>
      )}
    />
  );
}
