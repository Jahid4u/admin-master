import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/PortfolioApp";
import { useTheme } from "@/lib/theme-context";

export const Route = createFileRoute("/about")({
  component: Page,
  head: () => ({ meta: [{ title: "About — JAHID." }, { name: "description", content: "About Jahid Hasan, a design engineer based in Dhaka." }] }),
});

function Page() {
  const { theme } = useTheme();
  return <About theme={theme} />;
}
