import { createFileRoute } from "@tanstack/react-router";
import { DetailedProjects } from "@/PortfolioApp";
import { useTheme } from "@/lib/theme-context";

export const Route = createFileRoute("/work/")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Work — JAHID." },
      { name: "description", content: "Selected projects across web development, brand systems, and UI design." },
    ],
  }),
});

function Page() {
  const { theme } = useTheme();
  return <DetailedProjects theme={theme} />;
}
