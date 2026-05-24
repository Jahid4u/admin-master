import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { BlogHighlights } from "@/PortfolioApp";
import { useTheme } from "@/lib/theme-context";

export const Route = createFileRoute("/blog")({
  component: Page,
  head: () => ({ meta: [{ title: "Blog — JAHID." }, { name: "description", content: "Essays on design, code, and craft." }] }),
});

function Page() {
  const { theme } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // If on a child route (/blog/:id), render outlet; otherwise show listing
  if (pathname !== "/blog") return <Outlet />;
  return <BlogHighlights theme={theme} />;
}
