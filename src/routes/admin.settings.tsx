import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminGetAllSettings, adminUpdateSetting } from "@/lib/admin.functions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

type Hero = { name: string; tagline: string; intro: string; avatar: string | null; cta_label: string; cta_url: string };
type About = { headline: string; bio: string; image: string | null; skills: string };
type Contact = { email: string; phone: string; location: string };
type Social = { github: string; twitter: string; linkedin: string; instagram: string; facebook: string; youtube: string };

const defaults = {
  hero: { name: "", tagline: "", intro: "", avatar: null, cta_label: "", cta_url: "" } as Hero,
  about: { headline: "", bio: "", image: null, skills: "" } as About,
  contact: { email: "", phone: "", location: "" } as Contact,
  social: { github: "", twitter: "", linkedin: "", instagram: "", facebook: "", youtube: "" } as Social,
};

function SettingsPage() {
  const qc = useQueryClient();
  const getAll = useServerFn(adminGetAllSettings);
  const update = useServerFn(adminUpdateSetting);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => getAll(),
  });

  const saveMut = useMutation({
    mutationFn: (args: { key: string; value: unknown }) => update({ data: args }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const hero = { ...defaults.hero, ...((data?.hero as object | undefined) ?? {}) } as Hero;
  const about = { ...defaults.about, ...((data?.about as object | undefined) ?? {}) } as About;
  const contact = { ...defaults.contact, ...((data?.contact as object | undefined) ?? {}) } as Contact;
  const social = { ...defaults.social, ...((data?.social as object | undefined) ?? {}) } as Social;

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold">Site settings</h1>
        <p className="text-sm text-muted-foreground">Edit content shown across the public site.</p>
      </div>

      <Tabs defaultValue="hero">
        <TabsList>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <HeroEditor initial={hero} onSave={(v) => saveMut.mutate({ key: "hero", value: v })} saving={saveMut.isPending} />
        </TabsContent>
        <TabsContent value="about">
          <AboutEditor initial={about} onSave={(v) => saveMut.mutate({ key: "about", value: v })} saving={saveMut.isPending} />
        </TabsContent>
        <TabsContent value="contact">
          <ContactEditor initial={contact} onSave={(v) => saveMut.mutate({ key: "contact", value: v })} saving={saveMut.isPending} />
        </TabsContent>
        <TabsContent value="social">
          <SocialEditor initial={social} onSave={(v) => saveMut.mutate({ key: "social", value: v })} saving={saveMut.isPending} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SaveBar({ saving }: { saving: boolean }) {
  return <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

function HeroEditor({ initial, onSave, saving }: { initial: Hero; onSave: (v: Hero) => void; saving: boolean }) {
  const [v, setV] = useState(initial);
  useEffect(() => setV(initial), [initial]);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(v); }} className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Hero section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name"><Input value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} /></Field>
            <Field label="Tagline"><Input value={v.tagline} onChange={(e) => setV({ ...v, tagline: e.target.value })} /></Field>
          </div>
          <Field label="Intro"><Textarea rows={3} value={v.intro} onChange={(e) => setV({ ...v, intro: e.target.value })} /></Field>
          <ImageUploader label="Avatar" value={v.avatar} onChange={(u) => setV({ ...v, avatar: u })} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="CTA label"><Input value={v.cta_label} onChange={(e) => setV({ ...v, cta_label: e.target.value })} /></Field>
            <Field label="CTA URL"><Input value={v.cta_url} onChange={(e) => setV({ ...v, cta_url: e.target.value })} /></Field>
          </div>
        </CardContent>
      </Card>
      <SaveBar saving={saving} />
    </form>
  );
}

function AboutEditor({ initial, onSave, saving }: { initial: About; onSave: (v: About) => void; saving: boolean }) {
  const [v, setV] = useState(initial);
  useEffect(() => setV(initial), [initial]);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(v); }} className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">About section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Headline"><Input value={v.headline} onChange={(e) => setV({ ...v, headline: e.target.value })} /></Field>
          <Field label="Bio"><Textarea rows={5} value={v.bio} onChange={(e) => setV({ ...v, bio: e.target.value })} /></Field>
          <ImageUploader label="About image" value={v.image} onChange={(u) => setV({ ...v, image: u })} />
          <Field label="Skills (comma separated)">
            <Input value={v.skills} onChange={(e) => setV({ ...v, skills: e.target.value })} placeholder="React, TypeScript, Design" />
          </Field>
        </CardContent>
      </Card>
      <SaveBar saving={saving} />
    </form>
  );
}

function ContactEditor({ initial, onSave, saving }: { initial: Contact; onSave: (v: Contact) => void; saving: boolean }) {
  const [v, setV] = useState(initial);
  useEffect(() => setV(initial), [initial]);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(v); }} className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Contact info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Email"><Input type="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} /></Field>
          <Field label="Phone"><Input value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} /></Field>
          <Field label="Location"><Input value={v.location} onChange={(e) => setV({ ...v, location: e.target.value })} /></Field>
        </CardContent>
      </Card>
      <SaveBar saving={saving} />
    </form>
  );
}

function SocialEditor({ initial, onSave, saving }: { initial: Social; onSave: (v: Social) => void; saving: boolean }) {
  const [v, setV] = useState(initial);
  useEffect(() => setV(initial), [initial]);
  const fields: (keyof Social)[] = ["github", "twitter", "linkedin", "instagram", "facebook", "youtube"];
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(v); }} className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Social links</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <Field key={f} label={f.charAt(0).toUpperCase() + f.slice(1)}>
              <Input placeholder="https://…" value={v[f]} onChange={(e) => setV({ ...v, [f]: e.target.value })} />
            </Field>
          ))}
        </CardContent>
      </Card>
      <SaveBar saving={saving} />
    </form>
  );
}
