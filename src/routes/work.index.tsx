import { createFileRoute } from "@tanstack/react-router";
import { DetailedProjects } from "@/PortfolioApp";
import { useTheme } from "@/lib/theme-context";
import { loadPageSeo, buildHeadMeta } from "@/lib/page-seo";

export const Route = createFileRoute("/work/")({
  component: Page,
  loader: async () => ({ seo: await loadPageSeo("work") }),
  head: ({ loaderData }) =>
    buildHeadMeta(loaderData?.seo, {
      title: "Work — JAHID.",
      description: "Selected projects across web development, brand systems, and UI design.",
      url: "/work",
    }),
});

function Page() {
  const { theme } = useTheme();
  return <DetailedProjects theme={theme} />;
}
