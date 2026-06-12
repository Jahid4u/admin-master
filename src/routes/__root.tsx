import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { ThemeProvider, useTheme } from "@/lib/theme-context";
import { Navbar, Footer, MouseGlow, ScrollToTop } from "@/PortfolioApp";
import { CodeRain } from "@/components/CodeRain";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020202] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-white font-display">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-white">Page not found</h2>
        <p className="mt-2 text-sm text-zinc-400">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black hover:scale-105 transition-transform"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020202] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-white">This page didn't load</h1>
        <p className="mt-2 text-sm text-zinc-400">Something went wrong.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "JAHID. | Portfolio" },
      { name: "description", content: "Jahid Hasan — Graphic Designer & Web Developer based in Dhaka, Bangladesh." },
      { property: "og:title", content: "JAHID. | Portfolio" },
      { property: "og:description", content: "Premium digital portfolio of Jahid Hasan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;600;800&family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function PageShell() {
  const { theme, toggleTheme } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Bare shell for admin / auth routes (no portfolio chrome)
  const isBare =
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/signup";

  if (isBare) {
    return (
      <div className="min-h-[100dvh] bg-background text-foreground">
        <Outlet />
      </div>
    );
  }

  return (
    <div className={`min-h-[100dvh] transition-colors duration-700 relative overflow-x-clip bg-transparent ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
      <CodeRain theme={theme} />
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            theme === 'dark'
              ? 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.55) 85%)'
              : 'radial-gradient(ellipse at center, transparent 0%, rgba(255,255,255,0.65) 85%)',
        }}
      />
      <MouseGlow theme={theme} />
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.035] mix-blend-overlay">
        <div className="absolute inset-0 glass-noise" />
      </div>

      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="relative z-[2]">
        <Outlet />
      </main>
      <Footer theme={theme} />
      <ScrollToTop theme={theme} />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PageShell />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
