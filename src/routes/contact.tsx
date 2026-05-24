import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/PortfolioApp";
import { useTheme } from "@/lib/theme-context";
import { loadPageSeo, buildHeadMeta } from "@/lib/page-seo";

export const Route = createFileRoute("/contact")({
  component: Page,
  loader: async () => ({ seo: await loadPageSeo("contact") }),
  head: ({ loaderData }) =>
    buildHeadMeta(loaderData?.seo, {
      title: "Contact — JAHID.",
      description: "Get in touch to start a project.",
      url: "/contact",
    }),
});

function Page() {
  const { theme } = useTheme();
  return <Contact theme={theme} />;
}
