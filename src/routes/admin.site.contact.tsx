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

export const Route = createFileRoute("/admin/site/contact")({ component: ContactAdminPage });

type Social = { label: string; url: string; enabled?: boolean };

type Contact = {
  eyebrow_enabled: boolean;
  eyebrow_text: string;

  headline_enabled: boolean;
  headline_text: string;
  headline_description: string;

  side_headline_enabled: boolean;
  side_headline_pre: string;
  side_headline_italic: string;

  email_enabled: boolean;
  email_label: string;
  email_value: string;

  phone_enabled: boolean;
  phone_label: string;
  phone_value: string;

  location_enabled: boolean;
  location_label: string;
  location_value: string;

  socials_enabled: boolean;
  socials: Social[];

  form_enabled: boolean;
  form_send_label: string;
  form_name_label: string;
  form_name_placeholder: string;
  form_email_label: string;
  form_email_placeholder: string;
  form_subject_label: string;
  form_subject_placeholder: string;
  form_message_label: string;
  form_message_placeholder: string;
  form_success_title: string;
  form_success_message: string;

  map_enabled: boolean;
  map_embed_url: string;
};

const defaults: Contact = {
  eyebrow_enabled: true,
  eyebrow_text: "Contact",

  headline_enabled: true,
  headline_text: "Get In Touch",
  headline_description: "Have a project in mind or want to explore a collaboration? Let's talk.",

  side_headline_enabled: true,
  side_headline_pre: "Let's start a",
  side_headline_italic: "conversation",

  email_enabled: true,
  email_label: "Email",
  email_value: "jahidmail2020@gmail.com",

  phone_enabled: true,
  phone_label: "Phone",
  phone_value: "+880 1234 567890",

  location_enabled: true,
  location_label: "Location",
  location_value: "Dhaka, Bangladesh",

  socials_enabled: true,
  socials: [
    { label: "LinkedIn", url: "#", enabled: true },
    { label: "Twitter", url: "#", enabled: true },
    { label: "GitHub", url: "#", enabled: true },
  ],

  form_enabled: true,
  form_send_label: "Send Message",
  form_name_label: "Name",
  form_name_placeholder: "John Doe",
  form_email_label: "Email",
  form_email_placeholder: "john@example.com",
  form_subject_label: "Subject",
  form_subject_placeholder: "Web Design Project",
  form_message_label: "Message",
  form_message_placeholder: "Tell me about your project...",
  form_success_title: "Message Sent",
  form_success_message: "Thanks. I will get back to you within 24 hours.",

  map_enabled: true,
  map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14611.3963402434!2d90.39572979207865!3d23.71711200427387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8e99e28cfa3%3A0xc3dc15904fc498a4!2sKeraniganj%20Upazila!5e0!3m2!1sen!2sbd!4v1716654271830!5m2!1sen!2sbd",
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

function ContactAdminPage() {
  const qc = useQueryClient();
  const getAll = useServerFn(adminGetAllSettings);
  const update = useServerFn(adminUpdateSetting);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => getAll(),
  });

  const initial = { ...defaults, ...((data?.contact_page as object | undefined) ?? {}) } as Contact;
  const [v, setV] = useState<Contact>(initial);

  useEffect(() => {
    setV(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)]);

  const set = (patch: Partial<Contact>) => setV({ ...v, ...patch });

  const saveMut = useMutation({
    mutationFn: () => update({ data: { key: "contact_page", value: v } }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      qc.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const patchSocial = (i: number, patch: Partial<Social>) => {
    const next = [...v.socials]; next[i] = { ...next[i], ...patch };
    set({ socials: next });
  };
  const removeSocial = (i: number) => set({ socials: v.socials.filter((_, idx) => idx !== i) });

  return (
    <form onSubmit={(e) => { e.preventDefault(); saveMut.mutate(); }} className="max-w-2xl">
      <PageHeader
        title="Contact page"
        description="Edit every block of the /contact page in its own container."
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
          {/* EYEBROW */}
          <SectionCard
            title="Eyebrow"
            description="Small label with the mail icon above the headline."
            toggle={<Switch className={switchCls} checked={v.eyebrow_enabled !== false} onCheckedChange={(c) => set({ eyebrow_enabled: c })} />}
          >
            <Field label="Eyebrow text"><Input value={v.eyebrow_text} onChange={(e) => set({ eyebrow_text: e.target.value })} /></Field>
          </SectionCard>

          {/* HEADLINE */}
          <SectionCard
            title="Headline"
            description="The big page title and short description."
            toggle={<Switch className={switchCls} checked={v.headline_enabled !== false} onCheckedChange={(c) => set({ headline_enabled: c })} />}
          >
            <Field label="Headline"><Input value={v.headline_text} onChange={(e) => set({ headline_text: e.target.value })} /></Field>
            <Field label="Description"><Textarea rows={2} value={v.headline_description} onChange={(e) => set({ headline_description: e.target.value })} /></Field>
          </SectionCard>

          {/* SIDE HEADLINE */}
          <SectionCard
            title="Left column headline"
            description="The “Let's start a conversation” heading above the contact details."
            toggle={<Switch className={switchCls} checked={v.side_headline_enabled !== false} onCheckedChange={(c) => set({ side_headline_enabled: c })} />}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Plain part"><Input value={v.side_headline_pre} onChange={(e) => set({ side_headline_pre: e.target.value })} /></Field>
              <Field label="Italic accent"><Input value={v.side_headline_italic} onChange={(e) => set({ side_headline_italic: e.target.value })} /></Field>
            </div>
          </SectionCard>

          {/* EMAIL */}
          <SectionCard
            title="Email card"
            toggle={<Switch className={switchCls} checked={v.email_enabled !== false} onCheckedChange={(c) => set({ email_enabled: c })} />}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Label"><Input value={v.email_label} onChange={(e) => set({ email_label: e.target.value })} /></Field>
              <Field label="Email address"><Input value={v.email_value} onChange={(e) => set({ email_value: e.target.value })} /></Field>
            </div>
          </SectionCard>

          {/* PHONE */}
          <SectionCard
            title="Phone card"
            toggle={<Switch className={switchCls} checked={v.phone_enabled !== false} onCheckedChange={(c) => set({ phone_enabled: c })} />}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Label"><Input value={v.phone_label} onChange={(e) => set({ phone_label: e.target.value })} /></Field>
              <Field label="Phone number"><Input value={v.phone_value} onChange={(e) => set({ phone_value: e.target.value })} /></Field>
            </div>
          </SectionCard>

          {/* LOCATION */}
          <SectionCard
            title="Location card"
            toggle={<Switch className={switchCls} checked={v.location_enabled !== false} onCheckedChange={(c) => set({ location_enabled: c })} />}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Label"><Input value={v.location_label} onChange={(e) => set({ location_label: e.target.value })} /></Field>
              <Field label="Location"><Input value={v.location_value} onChange={(e) => set({ location_value: e.target.value })} /></Field>
            </div>
          </SectionCard>

          {/* SOCIALS */}
          <SectionCard
            title="Social icons"
            description="LinkedIn / Twitter / GitHub row below the contact details."
            toggle={<Switch className={switchCls} checked={v.socials_enabled !== false} onCheckedChange={(c) => set({ socials_enabled: c })} />}
          >
            {v.socials.map((s, i) => (
              <div key={i} className="grid sm:grid-cols-[1fr_1.5fr_auto_auto] gap-2 items-end">
                <Field label="Label"><Input value={s.label} onChange={(e) => patchSocial(i, { label: e.target.value })} /></Field>
                <Field label="URL"><Input value={s.url} onChange={(e) => patchSocial(i, { url: e.target.value })} /></Field>
                <Switch className={switchCls} checked={s.enabled !== false} onCheckedChange={(c) => patchSocial(i, { enabled: c })} />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeSocial(i)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => set({ socials: [...v.socials, { label: "", url: "#", enabled: true }] })}><Plus className="w-4 h-4 mr-1" />Add social</Button>
          </SectionCard>

          {/* FORM */}
          <SectionCard
            title="Contact form"
            description="Field labels, placeholders, button text and success message."
            toggle={<Switch className={switchCls} checked={v.form_enabled !== false} onCheckedChange={(c) => set({ form_enabled: c })} />}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name — label"><Input value={v.form_name_label} onChange={(e) => set({ form_name_label: e.target.value })} /></Field>
              <Field label="Name — placeholder"><Input value={v.form_name_placeholder} onChange={(e) => set({ form_name_placeholder: e.target.value })} /></Field>
              <Field label="Email — label"><Input value={v.form_email_label} onChange={(e) => set({ form_email_label: e.target.value })} /></Field>
              <Field label="Email — placeholder"><Input value={v.form_email_placeholder} onChange={(e) => set({ form_email_placeholder: e.target.value })} /></Field>
              <Field label="Subject — label"><Input value={v.form_subject_label} onChange={(e) => set({ form_subject_label: e.target.value })} /></Field>
              <Field label="Subject — placeholder"><Input value={v.form_subject_placeholder} onChange={(e) => set({ form_subject_placeholder: e.target.value })} /></Field>
              <Field label="Message — label"><Input value={v.form_message_label} onChange={(e) => set({ form_message_label: e.target.value })} /></Field>
              <Field label="Message — placeholder"><Input value={v.form_message_placeholder} onChange={(e) => set({ form_message_placeholder: e.target.value })} /></Field>
            </div>
            <Field label="Send button label"><Input value={v.form_send_label} onChange={(e) => set({ form_send_label: e.target.value })} /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Success title"><Input value={v.form_success_title} onChange={(e) => set({ form_success_title: e.target.value })} /></Field>
              <Field label="Success message"><Input value={v.form_success_message} onChange={(e) => set({ form_success_message: e.target.value })} /></Field>
            </div>
          </SectionCard>

          {/* MAP */}
          <SectionCard
            title="Google Map"
            description="Paste any Google Maps embed URL (the src of the iframe shown on google.com/maps Share → Embed a map)."
            toggle={<Switch className={switchCls} checked={v.map_enabled !== false} onCheckedChange={(c) => set({ map_enabled: c })} />}
          >
            <Field label="Embed URL"><Textarea rows={4} value={v.map_embed_url} onChange={(e) => set({ map_embed_url: e.target.value })} /></Field>
          </SectionCard>
        </div>
      )}
    </form>
  );
}
