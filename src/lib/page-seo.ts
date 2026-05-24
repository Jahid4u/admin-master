import { getSiteSettings } from "@/lib/content.functions";

export type PageSeoKey =
  | "home" | "about" | "work" | "blog" | "contact" | "privacy" | "terms";

type Meta = { title?: string; description?: string; og_image?: string | null };

export async function loadPageSeo(key: PageSeoKey) {
  try {
    const settings = (await getSiteSettings()) as Record<string, unknown>;
    const all = (settings.page_seo as Record<string, Meta> | undefined) ?? {};
    return (all[key] ?? {}) as Meta;
  } catch {
    return {} as Meta;
  }
}

export function buildHeadMeta(
  override: Meta | undefined,
  fallback: { title: string; description: string; url: string; image?: string | null }
) {
  const title = override?.title?.trim() || fallback.title;
  const description = override?.description?.trim() || fallback.description;
  const image = override?.og_image || fallback.image || undefined;
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: fallback.url },
    { property: "og:type", content: "website" },
  ];
  if (image) {
    meta.push({ property: "og:image", content: image });
    meta.push({ name: "twitter:image", content: image });
  }
  return {
    meta,
    links: [{ rel: "canonical", href: fallback.url }],
  };
}
