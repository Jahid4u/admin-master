import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

// ---------- Public reads (used by frontend) ----------

export const listPublishedProjects = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  }
);

export const getPublishedProjectBySlug = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(200) }).parse(data)
  )
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  }
);

export const getPublishedPostBySlug = createServerFn({ method: "POST" })
  .inputValidator((data: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(200) }).parse(data)
  )
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

export const getSiteSettings = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("key, value");
    if (error) throw new Error(error.message);
    const map: Record<string, Json> = {};
    for (const row of data ?? []) map[row.key] = row.value as Json;
    return map;
  }
);


