import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/PortfolioApp";
import { useTheme } from "@/lib/theme-context";
import { loadPageSeo, buildHeadMeta } from "@/lib/page-seo";

export const Route = createFileRoute("/")({
  component: Page,
  loader: async () => ({ seo: await loadPageSeo("home") }),
  head: ({ loaderData }) =>
    buildHeadMeta(loaderData?.seo, {
      title: "JAHID. — Design engineer in Dhaka",
      description: "Portfolio of Jahid Hasan — design engineer building modern web experiences.",
      url: "/",
    }),
});

function Page() {
  const { theme } = useTheme();
  return <HomePage theme={theme} />;
}
