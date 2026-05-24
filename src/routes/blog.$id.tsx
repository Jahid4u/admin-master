import { createFileRoute } from "@tanstack/react-router";
import { BlogPost } from "@/PortfolioApp";
import { useTheme } from "@/lib/theme-context";

export const Route = createFileRoute("/blog/$id")({ component: Page });

function Page() {
  const { theme } = useTheme();
  return <BlogPost theme={theme} />;
}
