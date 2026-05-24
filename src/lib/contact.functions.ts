import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const submitSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  subject: z.string().trim().max(300).optional().nullable(),
  message: z.string().trim().min(1).max(5000),
  source: z.enum(["home", "contact"]).default("contact"),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => submitSchema.parse(d))
  .handler(async ({ data }) => {
    const { error, data: inserted } = await supabaseAdmin
      .from("contact_submissions")
      .insert({
        name: data.name,
        email: data.email,
        subject: data.subject || null,
        message: data.message,
        source: data.source,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id, ok: true };
  });
