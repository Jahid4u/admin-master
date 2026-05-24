import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Service — JAHID." },
      { name: "description", content: "The terms governing the use of this site and engagement with Jahid Hasan." },
    ],
  }),
});

function TermsPage() {
  return (
    <div className="min-h-screen px-6 md:px-12 lg:px-24 pt-28 md:pt-36 pb-32 text-foreground">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft size={14} /> Back home
        </Link>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5">
          <FileText size={12} className="text-primary" />
          <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
            Legal
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-sm font-mono text-muted-foreground mb-12">
          Last updated: May 24, 2026
        </p>

        <div className="prose prose-invert max-w-none space-y-10 text-base leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing this website or engaging me for work, you agree to
              these terms. If you do not agree, please discontinue use of the
              site and services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
              2. Intellectual Property
            </h2>
            <p>
              All content displayed on this site — including case studies,
              writing, imagery, and source code samples — is the property of
              Jahid Hasan unless otherwise credited. Do not reproduce or
              republish without written permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
              3. Project Engagements
            </h2>
            <p>
              Client work is governed by a separate signed agreement covering
              scope, timeline, deliverables, payment, and ownership. These
              terms supplement, and do not replace, any such agreement.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
              4. Limitation of Liability
            </h2>
            <p>
              The site and its content are provided "as is" without warranty
              of any kind. I am not liable for any indirect, incidental, or
              consequential damages arising from your use of the site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
              5. Changes
            </h2>
            <p>
              These terms may be updated from time to time. Continued use of
              the site after changes constitutes acceptance of the revised
              terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
              6. Contact
            </h2>
            <p>
              Questions about these terms? Email{" "}
              <a
                href="mailto:jahidmail2020@gmail.com"
                className="text-primary hover:underline"
              >
                jahidmail2020@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
