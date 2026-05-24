import { createFileRoute } from "@tanstack/react-router";
import { BlogPost } from "@/PortfolioApp";
import { useTheme } from "@/lib/theme-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog/$id")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("blog_posts")
      .select("title,description,cover_image,meta_title,meta_description,og_image")
      .eq("slug", params.id)
      .eq("published", true)
      .maybeSingle();
    return { post: data };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.post;
    const title = p?.meta_title || p?.title || "Blog post";
    const desc = p?.meta_description || p?.description || "";
    const image = p?.og_image || p?.cover_image || undefined;
    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/blog/${params.id}` },
    ];
    if (image) {
      meta.push({ property: "og:image", content: image });
      meta.push({ name: "twitter:image", content: image });
    }
    return {
      meta,
      links: [{ rel: "canonical", href: `/blog/${params.id}` }],
    };
  },
  component: Page,
});

function Page() {
  const { theme } = useTheme();
  return <BlogPost theme={theme} />;
}
