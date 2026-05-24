import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/PortfolioApp";
import { useTheme } from "@/lib/theme-context";
import { loadPageSeo, buildHeadMeta } from "@/lib/page-seo";

export const Route = createFileRoute("/about")({
  component: Page,
  loader: async () => ({ seo: await loadPageSeo("about") }),
  head: ({ loaderData }) =>
    buildHeadMeta(loaderData?.seo, {
      title: "About — JAHID.",
      description: "About Jahid Hasan, a design engineer based in Dhaka.",
      url: "/about",
    }),
});

function Page() {
  const { theme } = useTheme();
  return <About theme={theme} />;
}
