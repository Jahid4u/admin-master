import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

const smtpSchema = z.object({
  enabled: z.boolean().default(false),
  host: z.string().max(255).default(""),
  port: z.number().int().min(1).max(65535).default(587),
  secure: z.boolean().default(false), // true for 465, false for 587/STARTTLS
  username: z.string().max(255).default(""),
  password: z.string().max(500).default(""),
  from_email: z.string().max(255).default(""),
  from_name: z.string().max(255).default(""),
});

export type SmtpSettings = z.infer<typeof smtpSchema>;

export const adminGetSmtp = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "smtp_settings")
      .maybeSingle();
    if (error) throw new Error(error.message);
    const defaults: SmtpSettings = {
      enabled: false,
      host: "",
      port: 587,
      secure: false,
      username: "",
      password: "",
      from_email: "",
      from_name: "",
    };
    return { ...defaults, ...((data?.value as Partial<SmtpSettings>) ?? {}) };
  });

export const adminSaveSmtp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => smtpSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert(
        { key: "smtp_settings", value: data as never },
        { onConflict: "key" }
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminSendTestEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { to: string }) =>
    z.object({ to: z.string().email().max(255) }).parse(d)
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);

    const { data: row, error } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "smtp_settings")
      .maybeSingle();
    if (error) throw new Error(error.message);
    const cfg = (row?.value ?? {}) as Partial<SmtpSettings>;

    if (!cfg.enabled) throw new Error("SMTP is not enabled. Enable it and save settings first.");
    if (!cfg.host || !cfg.username || !cfg.password || !cfg.from_email) {
      throw new Error("Missing required SMTP fields (host, username, password, from email).");
    }

    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: cfg.host,
        port: cfg.port ?? 587,
        secure: !!cfg.secure,
        auth: { user: cfg.username, pass: cfg.password },
      });

      const info = await transporter.sendMail({
        from: cfg.from_name ? `"${cfg.from_name}" <${cfg.from_email}>` : cfg.from_email,
        to: data.to,
        subject: "SMTP Test Email",
        text: "This is a test email sent from your admin panel SMTP configuration. If you received this, your SMTP settings are working correctly.",
        html: `<div style="font-family:Arial,sans-serif;padding:24px"><h2>SMTP Test Successful</h2><p>This is a test email sent from your admin panel SMTP configuration.</p><p style="color:#666;font-size:12px">Sent from ${cfg.host}:${cfg.port}</p></div>`,
      });
      return { ok: true, messageId: info.messageId };
    } catch (err: any) {
      const msg = String(err?.message ?? err);
      // Cloudflare Workers cannot open raw TCP connections.
      if (msg.includes("unenv") || msg.includes("not implemented") || msg.includes("net") || msg.includes("ENOTSUP")) {
        throw new Error(
          "SMTP send failed: the serverless runtime (Cloudflare Workers) does not allow direct SMTP/TCP connections. Your credentials are saved, but for actual sending you need an HTTP-based relay (e.g. Brevo / Resend / SendGrid HTTP API). Underlying error: " + msg
        );
      }
      throw new Error("SMTP send failed: " + msg);
    }
  });
