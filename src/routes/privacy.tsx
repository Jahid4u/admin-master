import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — JAHID." },
      { name: "description", content: "How Jahid Hasan collects, uses, and protects your data." },
    ],
  }),
});

function PrivacyPage() {
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
          <Shield size={12} className="text-primary" />
          <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
            Legal
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm font-mono text-muted-foreground mb-12">
          Last updated: May 24, 2026
        </p>

        <div className="prose prose-invert max-w-none space-y-10 text-base leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
              1. Information We Collect
            </h2>
            <p>
              When you contact me through the website or email, I collect the
              information you choose to share — typically your name, email
              address, and the contents of your message. No tracking cookies or
              analytics scripts are used to profile you personally.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
              2. How We Use It
            </h2>
            <p>
              Your information is used solely to respond to your inquiry,
              discuss potential collaboration, and deliver the work we agree
              upon. I do not sell, rent, or share your data with third parties
              for marketing.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
              3. Data Retention
            </h2>
            <p>
              Project communications are kept for as long as our working
              relationship is active and for a reasonable period afterwards for
              reference. You can request deletion at any time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
              4. Security
            </h2>
            <p>
              Reasonable technical measures are in place to protect your data,
              but no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
              5. Contact
            </h2>
            <p>
              For any privacy-related questions, reach out at{" "}
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
