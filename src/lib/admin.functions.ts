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

// Self-promote to admin if no admin yet (first-signup-becomes-admin)
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { count, error: cErr } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (cErr) throw new Error(cErr.message);
    if ((count ?? 0) === 0) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      if (error) throw new Error(error.message);
      return { promoted: true };
    }
    return { promoted: false };
  });

// ---------- Projects ----------

const projectSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, dashes only"),
  title: z.string().min(1).max(200),
  category: z.string().max(100).optional().nullable(),
  year: z.string().max(20).optional().nullable(),
  client: z.string().max(200).optional().nullable(),
  timeline: z.string().max(100).optional().nullable(),
  role: z.string().max(200).optional().nullable(),
  overview: z.string().max(2000).optional().nullable(),
  challenge: z.string().max(2000).optional().nullable(),
  solution: z.string().max(2000).optional().nullable(),
  cover: z.string().max(2000).optional().nullable(),
  gallery: z.array(z.string().max(2000)).default([]),
  tags: z.array(z.string().max(50)).default([]),
  tech: z.array(z.string().max(50)).default([]),
  results: z.array(z.object({ label: z.string().max(100), value: z.string().max(100) })).default([]),
  live_url: z.string().max(500).optional().nullable(),
  repo_url: z.string().max(500).optional().nullable(),
  sort_order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const adminListProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminGetProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminUpsertProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id?: string; values: unknown }) =>
    z.object({ id: z.string().uuid().optional(), values: projectSchema }).parse(d)
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    if (data.id) {
      const { error } = await supabaseAdmin
        .from("projects")
        .update(data.values)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    } else {
      const { data: ins, error } = await supabaseAdmin
        .from("projects")
        .insert(data.values)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return { id: ins.id };
    }
  });

export const adminDeleteProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Blog posts ----------

const postSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(300),
  description: z.string().max(1000).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  cover_image: z.string().max(2000).optional().nullable(),
  content: z.string().max(100000).optional().nullable(),
  read_time: z.string().max(50).optional().nullable(),
  published: z.boolean().default(true),
  published_at: z.string().datetime().optional().nullable(),
});

export const adminListPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminGetPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { data: row, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminUpsertPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id?: string; values: unknown }) =>
    z.object({ id: z.string().uuid().optional(), values: postSchema }).parse(d)
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { published_at, ...rest } = data.values;
    const payload = {
      ...rest,
      ...(published_at ? { published_at } : {}),
    };
    if (data.id) {
      const { error } = await supabaseAdmin
        .from("blog_posts")
        .update(payload)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    } else {
      const { data: ins, error } = await supabaseAdmin
        .from("blog_posts")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return { id: ins.id };
    }
  });

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Site settings ----------

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

export const adminGetAllSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("key, value");
    if (error) throw new Error(error.message);
    const map: Record<string, Json> = {};
    for (const row of data ?? []) map[row.key] = row.value as Json;
    return map;
  });


export const adminUpdateSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { key: string; value: unknown }) =>
    z.object({
      key: z.string().min(1).max(50).regex(/^[a-z_]+$/),
      value: z.unknown(),
    }).parse(d)
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert({ key: data.key, value: data.value as never }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Contact inbox ----------

export const adminListSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpdateSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; is_read?: boolean; is_replied?: boolean }) =>
    z.object({
      id: z.string().uuid(),
      is_read: z.boolean().optional(),
      is_replied: z.boolean().optional(),
    }).parse(d)
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const patch: { is_read?: boolean; is_replied?: boolean } = {};
    if (typeof data.is_read === "boolean") patch.is_read = data.is_read;
    if (typeof data.is_replied === "boolean") patch.is_replied = data.is_replied;
    if (Object.keys(patch).length === 0) return { ok: true };
    const { error } = await supabaseAdmin
      .from("contact_submissions")
      .update(patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("contact_submissions")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
