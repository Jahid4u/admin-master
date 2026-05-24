import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSiteSettings } from "@/lib/content.functions";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Service — JAHID." },
      { name: "description", content: "The terms governing the use of this site and engagement with Jahid Hasan." },
    ],
  }),
});

type Section = { heading: string; body: string; enabled?: boolean };
type TermsSettings = {
  back_enabled?: boolean; back_label?: string;
  badge_enabled?: boolean; badge_text?: string;
  title_enabled?: boolean; title_text?: string;
  updated_enabled?: boolean; updated_text?: string;
  sections?: Section[];
};

function renderBody(text: string) {
  const parts = text.split(/(\b[\w.+-]+@[\w-]+\.[\w.-]+\b|https?:\/\/[^\s]+)/g);
  return parts.map((p, i) => {
    if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(p)) {
      return <a key={i} href={`mailto:${p}`} className="text-primary hover:underline">{p}</a>;
    }
    if (/^https?:\/\//.test(p)) {
      return <a key={i} href={p} className="text-primary hover:underline" target="_blank" rel="noreferrer">{p}</a>;
    }
    return <span key={i}>{p}</span>;
  });
}

function TermsPage() {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
    staleTime: 60_000,
  });
  const t = (settings?.terms_page ?? {}) as TermsSettings;
  const sections = (t.sections ?? []).filter((s) => s.enabled !== false);

  return (
    <div className="min-h-screen px-6 md:px-12 lg:px-24 pt-28 md:pt-36 pb-32 text-foreground">
      <div className="max-w-3xl mx-auto">
        {t.back_enabled !== false && (
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft size={14} /> {t.back_label || "Back home"}
          </Link>
        )}

        {t.badge_enabled !== false && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5">
            <FileText size={12} className="text-primary" />
            <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
              {t.badge_text || "Legal"}
            </span>
          </div>
        )}

        {t.title_enabled !== false && (
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">
            {t.title_text || "Terms of Service"}
          </h1>
        )}
        {t.updated_enabled !== false && (
          <p className="text-sm font-mono text-muted-foreground mb-12">
            {t.updated_text || "Last updated: May 24, 2026"}
          </p>
        )}

        <div className="prose prose-invert max-w-none space-y-10 text-base leading-relaxed text-muted-foreground">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                {s.heading}
              </h2>
              <p className="whitespace-pre-line">{renderBody(s.body)}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
