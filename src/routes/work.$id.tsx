import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Github,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  getNextProject,
  getPreviousProject,
  getProjectBySlug,
  projects,
  type Project,
} from "@/lib/projects-data";

export const Route = createFileRoute("/work/$id")({
  loader: ({ params }) => {
    const project = getProjectBySlug(params.id);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) return { meta: [{ title: "Project — JAHID." }] };
    const title = `${p.title} — JAHID.`;
    const desc = p.overview;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: p.cover },
        { name: "twitter:image", content: p.cover },
      ],
    };
  },
  component: WorkDetailPage,
  notFoundComponent: () => <NotFound />,
  errorComponent: ({ reset }) => {
    const router = useRouter();
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center bg-background text-foreground">
        <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-blue-500">Something broke</p>
        <h1 className="text-3xl font-display font-bold">Could not load this project.</h1>
        <button
          onClick={() => { reset(); router.invalidate(); }}
          className="mt-4 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
        >
          Retry
        </button>
      </div>
    );
  },
});

/* ─── Small reusable bits ──────────────────────────────────────────────── */

function SectionBadge({ icon: Icon, label }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string }) {
  return (
    <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5">
      <Icon size={12} className="text-blue-500" />
      <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
    </div>
  );
}

function MetaCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4 backdrop-blur transition-colors hover:border-blue-500/50">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-blue-500">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
        <p className={`mt-1 truncate text-sm font-semibold ${href ? "text-blue-500" : "text-foreground"}`}>{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────── */

function WorkDetailPage() {
  const { project } = Route.useLoaderData();
  const next = getNextProject(project.slug);
  const prev = getPreviousProject(project.slug);
  const gallery = project.gallery ?? [];

  return (
    <main className="min-h-screen text-foreground">
      {/* ─── SECTION 01 · HERO (photo cover) ────────────────────── */}
      <section className="relative border-b border-border">
        <div className="relative mx-auto max-w-[1180px] px-5 md:px-10 pt-24 pb-20 md:pb-24">
          {/* Top utility bar */}
          <div className="flex items-center justify-between pb-6">
            <Link
              to="/work"
              className="group inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
              All Projects
            </Link>
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
              <span className="text-blue-500">{String(project.id).padStart(2, "0")}</span>
              <span className="mx-2 text-border">/</span>
              Case Study
            </p>
          </div>

          {/* Photo cover with overlay content */}
          <figure className="relative overflow-hidden rounded-3xl border border-border bg-muted">
            <div className="aspect-[16/10] md:aspect-[21/9] w-full">
              <img
                src={project.cover}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            </div>
            {/* gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/20" />

            {/* Overlay content */}
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 lg:p-14">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_12px_2px_rgba(59,130,246,0.6)]" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-white/80">
                    {project.cat}
                  </span>
                </div>
                <h1 className="mt-4 font-display font-bold tracking-[-0.03em] leading-[0.95] text-white text-5xl md:text-7xl lg:text-[80px]">
                  {project.title}
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 md:text-base md:leading-8">
                  {project.overview}
                </p>
              </div>
            </div>
          </figure>

          {/* Meta cards row */}
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Client", value: project.client, accent: false },
              { label: "Year", value: project.year, accent: false },
              { label: "Duration", value: project.timeline, accent: false },
              { label: "Role", value: project.role, accent: true },
            ].map((m) => (
              <div
                key={m.label}
                className={`hover-lift rounded-2xl border bg-card p-5 ${
                  m.accent
                    ? "border-blue-500/40 hover:border-blue-500/70"
                    : "border-border hover:border-foreground/30"
                }`}
              >
                <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-muted-foreground">
                  {m.label}
                </p>
                <p
                  className={`mt-2 font-display text-base font-semibold ${
                    m.accent ? "text-blue-500" : "text-foreground"
                  }`}
                >
                  {m.value}
                </p>
              </div>
            ))}
          </div>

          {/* Tag pills + quick links */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((t: string) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-card/50 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-5">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group link-underline inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-foreground hover:text-blue-500"
                >
                  Live
                  <ExternalLink size={12} className="icon-nudge-r" />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group link-underline inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-foreground hover:text-blue-500"
                >
                  Code
                  <Github size={12} className="icon-nudge-r" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>



      {/* ─── SECTION 02 · CHALLENGE + SOLUTION ─────────────────── */}
      <section className="mx-auto max-w-[920px] px-5 py-20 md:px-8 md:py-28 text-center">
        <SectionBadge icon={Sparkles} label="02 — Process" />

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-5 text-left">

          {[
            { num: "01", label: "Challenge", body: project.challenge },
            { num: "02", label: "Solution", body: project.solution },
          ].map((item) => (
            <article
              key={item.label}
              className="group relative flex flex-col gap-5 rounded-2xl border border-border/60 bg-card/40 p-7 transition-all duration-500 hover:border-foreground/30 hover:bg-card/70"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-[11px] font-mono uppercase tracking-[0.28em] text-foreground/60">
                  {item.label}
                </span>
                <span className="font-display text-xs font-light text-muted-foreground/40">
                  {item.num}
                </span>
              </div>
              <p className="text-[14px] leading-[1.75] text-foreground/85">{item.body}</p>
              <div className="mt-auto h-px w-8 bg-foreground/20 transition-all duration-500 group-hover:w-16 group-hover:bg-blue-500/60" />
            </article>
          ))}
        </div>
      </section>



      {/* ─── SECTION 03 · TECH STACK ───────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-5 md:px-10 pb-16 md:pb-24 text-center">
        <SectionBadge icon={Layers} label="03 — Tech Stack" />
        <h2 className="font-display text-3xl font-bold md:text-4xl">Built with intent.</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
          Every dependency earns its place. Lean, modern, and chosen for the long haul.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {project.tech.map((t: string) => (
            <span
              key={t}
              className="rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-500"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ─── SECTION 04 · SHOWCASE GALLERY ─────────────────────── */}
      {gallery.length > 0 && (
        <section className="mx-auto max-w-[1180px] px-5 md:px-10 pb-16 md:pb-24 text-center">
          <SectionBadge icon={ImageIcon} label="04 — Gallery" />
          <h2 className="font-display text-3xl font-bold md:text-4xl">Project Showcase</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            A closer look at the surfaces, flows, and moments that make it work.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5 text-left">
            {/* First image - large, spans 2 cols */}
            <figure className="md:col-span-2 group relative overflow-hidden rounded-xl border border-border bg-muted">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={gallery[0]}
                  alt={`${project.title} – frame 1`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-background/80 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-foreground backdrop-blur">
                01 / Hero View
              </figcaption>
            </figure>
            {gallery.slice(1).map((src: string, i: number) => (
              <figure
                key={src}
                className="group relative overflow-hidden rounded-xl border border-border bg-muted md:h-full"
              >
                <div className="aspect-[16/10] overflow-hidden md:h-full">
                  <img
                    src={src}
                    alt={`${project.title} – frame ${i + 2}`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-background/80 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-foreground backdrop-blur">
                  {String(i + 2).padStart(2, "0")} / Detail
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ─── SECTION 05 · KEY RESULTS ───────────────────────────── */}
      {project.results.length > 0 && (
        <section className="mx-auto max-w-[1180px] px-5 md:px-10 pb-16 md:pb-24 text-center">
          <SectionBadge icon={Zap} label="05 — Impact" />
          <h2 className="font-display text-3xl font-bold md:text-4xl">Measured outcomes.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            Numbers from 90 days post-launch — what changed for {project.client}.
          </p>

          <div className="mx-auto mt-10 grid max-w-[920px] grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 text-left">
            {project.results.slice(0, 3).map((r: { label: string; value: string }, i: number) => (
              <div
                key={r.label}
                className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-6 md:p-7 transition-all duration-500 hover:-translate-y-0.5 hover:border-blue-500/50 hover:bg-card"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70">
                  0{i + 1}
                </span>
                <span className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-[40px] md:leading-none">
                  {r.value}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/65">
                  {r.label}
                </span>
                <div className="mt-1 h-px w-6 bg-foreground/20 transition-all duration-500 group-hover:w-12 group-hover:bg-blue-500/70" />
              </div>
            ))}
          </div>
        </section>
      )}





      {/* ─── SECTION 07 · PREV / NEXT (full-bleed diagonal) ─── */}
      <section className="relative mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Previous */}
        <Link
          to="/work/$id"
          params={{ id: prev.slug }}
          className="group relative isolate flex h-[120px] md:h-[160px] items-center overflow-hidden md:[clip-path:polygon(0_0,100%_0,calc(100%-50px)_100%,0_100%)]"
        >
          <img
            src={prev.cover}
            alt={prev.title}
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40 grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-60 group-hover:grayscale-0"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />

          <div className="relative w-full pl-5 pr-10 md:pl-10 md:pr-16">
            <div className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.28em] text-blue-500">
              <ArrowLeft size={10} className="transition-transform duration-500 group-hover:-translate-x-1.5" />
              Previous
            </div>
            <h3 className="mt-1.5 font-display text-lg md:text-2xl font-bold tracking-tight leading-tight text-white transition-transform duration-500 group-hover:-translate-x-1">
              {prev.title}
            </h3>
            <p className="mt-1 text-[9px] font-mono uppercase tracking-[0.24em] text-white/55">
              {prev.cat}
            </p>
          </div>
        </Link>

        {/* Next */}
        <Link
          to="/work/$id"
          params={{ id: next.slug }}
          className="group relative isolate flex h-[120px] md:h-[160px] items-center justify-end overflow-hidden border-t border-border md:border-t-0 md:-ml-12 md:[clip-path:polygon(50px_0,100%_0,100%_100%,0_100%)]"
        >
          <img
            src={next.cover}
            alt={next.title}
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40 grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-60 group-hover:grayscale-0"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-l from-black/85 via-black/55 to-transparent" />

          <div className="relative w-full pr-5 pl-10 md:pr-10 md:pl-20 text-right">
            <div className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.28em] text-blue-500">
              Next
              <ArrowRight size={10} className="transition-transform duration-500 group-hover:translate-x-1.5" />
            </div>
            <h3 className="mt-1.5 font-display text-lg md:text-2xl font-bold tracking-tight leading-tight text-white transition-transform duration-500 group-hover:translate-x-1">
              {next.title}
            </h3>
            <p className="mt-1 text-[9px] font-mono uppercase tracking-[0.24em] text-white/55">
              {next.cat}
            </p>
          </div>
        </Link>
      </section>




    </main>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-6 text-center bg-background text-foreground">
      <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-blue-500">404</p>
      <h1 className="text-4xl md:text-5xl font-display font-bold">Project not found.</h1>
      <Link to="/work" className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
        <ArrowLeft size={14} /> Back to all works
      </Link>
    </div>
  );
}

void projects;
void (null as Project | null);
