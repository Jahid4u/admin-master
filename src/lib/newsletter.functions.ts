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

// Public — anyone can subscribe (no auth middleware)
export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; source?: string }) =>
    z
      .object({
        email: z.string().email().max(255),
        source: z.string().max(50).optional(),
      })
      .parse(d)
  )
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    const source = data.source?.trim() || "footer";

    // Upsert: if email exists, reactivate
    const { data: existing } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id, is_active")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      if (!existing.is_active) {
        await supabaseAdmin
          .from("newsletter_subscribers")
          .update({ is_active: true, unsubscribed_at: null })
          .eq("id", existing.id);
      }
      return { ok: true, alreadySubscribed: existing.is_active };
    }

    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .insert({ email, source });
    if (error) throw new Error(error.message);
    return { ok: true, alreadySubscribed: false };
  });

export const adminListSubscribers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpdateSubscriber = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; is_active: boolean }) =>
    z.object({ id: z.string().uuid(), is_active: z.boolean() }).parse(d)
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .update({
        is_active: data.is_active,
        unsubscribed_at: data.is_active ? null : new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteSubscriber = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
