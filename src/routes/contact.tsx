import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/PortfolioApp";
import { useTheme } from "@/lib/theme-context";

export const Route = createFileRoute("/contact")({
  component: Page,
  head: () => ({ meta: [{ title: "Contact — JAHID." }, { name: "description", content: "Get in touch to start a project." }] }),
});

function Page() {
  const { theme } = useTheme();
  return <Contact theme={theme} />;
}
