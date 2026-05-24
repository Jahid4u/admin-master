import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { adminGetSmtp, adminSaveSmtp, adminSendTestEmail } from "@/lib/smtp.functions";
import { PageHeader } from "@/components/admin/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Send, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/system/smtp")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  component: SmtpPage,
});

type Form = {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  from_email: string;
  from_name: string;
};

function SmtpPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["smtp-settings"],
    queryFn: () => adminGetSmtp(),
  });

  const [form, setForm] = useState<Form>({
    enabled: false,
    host: "",
    port: 587,
    secure: false,
    username: "",
    password: "",
    from_email: "",
    from_name: "",
  });
  const [testEmail, setTestEmail] = useState("");

  useEffect(() => {
    if (data) {
      setForm({
        enabled: !!data.enabled,
        host: data.host ?? "",
        port: data.port ?? 587,
        secure: !!data.secure,
        username: data.username ?? "",
        password: data.password ?? "",
        from_email: data.from_email ?? "",
        from_name: data.from_name ?? "",
      });
    }
  }, [data]);

  const saveMut = useMutation({
    mutationFn: () => adminSaveSmtp({ data: form }),
    onSuccess: () => {
      toast.success("SMTP settings saved");
      qc.invalidateQueries({ queryKey: ["smtp-settings"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to save"),
  });

  const testMut = useMutation({
    mutationFn: () => adminSendTestEmail({ data: { to: testEmail } }),
    onSuccess: () => toast.success("Test email sent"),
    onError: (e: any) => toast.error(e?.message ?? "Test failed", { duration: 9000 }),
  });

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  // map port -> secure for the select shown in the screenshot
  const portValue = String(form.port);
  const onPortChange = (v: string) => {
    const p = parseInt(v, 10);
    set("port", p);
    set("secure", p === 465);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="SMTP Settings" description="Configure email delivery" />

      <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-4 flex gap-3 text-[13px] text-yellow-200/90">
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
        <div>
          Heads up: the serverless runtime cannot open raw SMTP/TCP connections.
          Credentials are stored securely, but for actual delivery use an HTTP-based
          relay (Brevo, Resend, SendGrid). The Send Test button will tell you if
          your provider works from this runtime.
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <header className="px-5 py-4 border-b border-border">
          <h2 className="text-[15px] font-semibold">SMTP Configuration</h2>
        </header>
        <div className="p-5 space-y-5">
          <div className="flex items-center gap-3">
            <Switch
              checked={form.enabled}
              onCheckedChange={(v) => set("enabled", v)}
              className="border border-border data-[state=unchecked]:bg-muted"
            />
            <Label className="text-[13px] font-medium">Enable Custom SMTP</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium">SMTP Host</Label>
              <Input
                placeholder="smtp.gmail.com"
                value={form.host}
                onChange={(e) => set("host", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium">Port</Label>
              <Select value={portValue} onValueChange={onPortChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 (None)</SelectItem>
                  <SelectItem value="465">465 (SSL)</SelectItem>
                  <SelectItem value="587">587 (TLS)</SelectItem>
                  <SelectItem value="2525">2525 (Alt)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium">Username</Label>
              <Input
                placeholder="your@email.com"
                value={form.username}
                onChange={(e) => set("username", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium">Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium">From Email</Label>
              <Input
                placeholder="noreply@yourdomain.com"
                value={form.from_email}
                onChange={(e) => set("from_email", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium">From Name</Label>
              <Input
                placeholder="Your Company"
                value={form.from_name}
                onChange={(e) => set("from_name", e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={() => saveMut.mutate()}
            disabled={saveMut.isPending || isLoading}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {saveMut.isPending ? "Saving…" : "Save SMTP Settings"}
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <header className="px-5 py-4 border-b border-border">
          <h2 className="text-[15px] font-semibold">Send Test Email</h2>
        </header>
        <div className="p-5 space-y-3">
          <Label className="text-[12px] font-medium">Test Email Address</Label>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="ronifb37@gmail.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => testMut.mutate()}
              disabled={!testEmail || testMut.isPending}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              {testMut.isPending ? "Sending…" : "Send Test"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
