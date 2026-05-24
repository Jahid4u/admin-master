import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { BlogHighlights } from "@/PortfolioApp";
import { useTheme } from "@/lib/theme-context";
import { loadPageSeo, buildHeadMeta } from "@/lib/page-seo";

export const Route = createFileRoute("/blog")({
  component: Page,
  loader: async () => ({ seo: await loadPageSeo("blog") }),
  head: ({ loaderData }) =>
    buildHeadMeta(loaderData?.seo, {
      title: "Blog — JAHID.",
      description: "Essays on design, code, and craft.",
      url: "/blog",
    }),
});

function Page() {
  const { theme } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/blog") return <Outlet />;
  return <BlogHighlights theme={theme} />;
}
