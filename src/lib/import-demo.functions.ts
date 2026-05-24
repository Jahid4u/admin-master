import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Hardcoded demo seed (mirrors the original static data so this file is
// self-contained even if src/lib/projects-data.ts changes later).
const DEMO_PROJECTS = [
  {
    slug: "wp-quick-forms",
    title: "WP Quick Forms",
    category: "Plugin Development",
    year: "2024",
    role: "Plugin Engineer",
    client: "Independent Release",
    timeline: "8 weeks",
    cover: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2400",
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2001",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2002",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2003",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=2004",
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2005",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2006",
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2007",
    ],
    overview:
      "WP Quick Forms is a zero-bloat WordPress plugin that lets creators ship production-ready forms in minutes. Built with a hand-rolled query layer, it stays fast even on shared hosting.",
    challenge:
      "Most form plugins ship megabytes of legacy code, hurt page speed, and lock essential features behind paywalls. Small site owners needed something fast, accessible, and honest.",
    solution:
      "A modular PHP core (under 80KB), a clean React-based builder for the admin, conditional logic without bloated dependencies, and first-class SMTP plus webhook integrations.",
    tags: ["WordPress", "PHP", "UI/UX"],
    tech: ["PHP 8", "WordPress", "React", "Tailwind", "MySQL", "SMTP"],
    results: [
      { label: "Bundle Size", value: "78KB" },
      { label: "Active Installs", value: "2,400+" },
      { label: "Avg. Rating", value: "4.9 / 5" },
    ],
    live_url: "https://example.com/wp-quick-forms",
    repo_url: "https://github.com/example/wp-quick-forms",
    sort_order: 1,
    published: true,
  },
  {
    slug: "fintrack",
    title: "FinTrack",
    category: "Web Dashboard",
    year: "2024",
    role: "Product Designer & Dev",
    client: "FinTrack Labs",
    timeline: "12 weeks",
    cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2400",
    gallery: [
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2001",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2002",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2003",
    ],
    overview:
      "FinTrack helps growing finance teams turn noisy bank feeds into clear, actionable dashboards — built for desktop power users who live in numbers.",
    challenge:
      "Existing dashboards either oversimplified the data or buried users in raw tables. Teams needed density without chaos and visuals that scale.",
    solution:
      "A typographic-first layout, hand-tuned D3 charts, a real-time WebSocket layer, and an interaction model designed for keyboard-only navigation.",
    tags: ["Next.js", "Tailwind", "D3.js"],
    tech: ["Next.js", "TypeScript", "Tailwind", "D3.js", "Postgres", "WebSocket"],
    results: [
      { label: "Time to Insight", value: "-64%" },
      { label: "Daily Active Use", value: "92%" },
      { label: "NPS", value: "71" },
    ],
    live_url: "https://example.com/fintrack",
    repo_url: null,
    sort_order: 2,
    published: true,
  },
  {
    slug: "zenfit-studio",
    title: "ZenFit Studio",
    category: "Brand Identity",
    year: "2023",
    role: "Brand & Visual Designer",
    client: "ZenFit Studio",
    timeline: "6 weeks",
    cover: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2400",
    gallery: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2001",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2002",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2003",
    ],
    overview:
      "A calming, premium identity for a boutique yoga studio — built on a modular grid and a soft, earthy palette that scales from app icons to outdoor signage.",
    challenge:
      "The wellness category is crowded and visually generic. ZenFit needed an identity that felt premium, ownable, and quiet — without slipping into cliché.",
    solution:
      "A custom wordmark, a 12-token color system, a modular asset library of 30+ templates, and motion guidelines for short-form video.",
    tags: ["Branding", "Figma", "Social"],
    tech: ["Figma", "Illustrator", "After Effects", "Notion"],
    results: [
      { label: "Brand Recall", value: "+58%" },
      { label: "Assets Shipped", value: "32" },
      { label: "Member Growth", value: "+27%" },
    ],
    live_url: "https://example.com/zenfit",
    repo_url: null,
    sort_order: 3,
    published: true,
  },
  {
    slug: "edupulse",
    title: "EduPulse",
    category: "Conversion Landing Page",
    year: "2024",
    role: "UX & Frontend",
    client: "EduPulse Inc.",
    timeline: "4 weeks",
    cover: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2400",
    gallery: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2001",
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=2002",
    ],
    overview:
      "A research-led rebuild of EduPulse's primary signup funnel — focused on clarity, social proof, and a frictionless first interaction.",
    challenge:
      "The existing page tried to say too much, hid the CTA below the fold, and lacked credibility signals. Conversion was flat for 9 months.",
    solution:
      "A hierarchy reset around one clear promise, inline social proof, a single primary CTA, and a progressive disclosure pattern for secondary information.",
    tags: ["Strategy", "CRO", "Web Design"],
    tech: ["React", "Framer Motion", "Tailwind", "Plausible"],
    results: [
      { label: "Engagement", value: "+42%" },
      { label: "Signup Conv.", value: "+31%" },
      { label: "Bounce Rate", value: "-18%" },
    ],
    live_url: "https://example.com/edupulse",
    repo_url: null,
    sort_order: 4,
    published: true,
  },
];

const DEMO_POSTS = [
  {
    slug: "wordpress-themes",
    title: "Building Full WordPress Themes from Scratch",
    description: "A comprehensive guide to transitioning from basic usage to building custom interactive themes.",
    category: "Web Dev",
    read_time: "5 min read",
    cover_image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    content: "Creating a WordPress theme from scratch might seem daunting, but it's the best way to understand the underlying mechanics of the CMS. Start by setting up a local development environment.\n\nOnce you have your local site up, navigate to the `wp-content/themes` directory and create a new folder for your theme. The two essential files you need are `style.css` and `index.php`.",
    published: true,
  },
  {
    slug: "font-systems",
    title: "The Designer's Guide to Font Systems",
    description: "How to effectively pair typefaces and build robust typographic scales for digital products.",
    category: "Design",
    read_time: "8 min read",
    cover_image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
    content: "Typography is more than just choosing a nice font; it's about establishing a system that ensures consistency, readability, and hierarchy across your digital product.\n\nA good font system usually relies on a primary and a secondary typeface.",
    published: true,
  },
  {
    slug: "framer-motion",
    title: "Mastering Framer Motion Animations",
    description: "Learn how to orchestrate complex, physically-based animations in React applications.",
    category: "Animation",
    read_time: "12 min read",
    cover_image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    content: "Framer Motion is a production-ready motion library for React that makes creating complex, fluid animations incredibly straightforward.",
    published: true,
  },
];

export const importDemoContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Admin role check
    const { data: roleRow, error: rErr } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (rErr) throw new Error(rErr.message);
    if (!roleRow) throw new Error("Forbidden: admin role required");

    let projectsInserted = 0;
    let postsInserted = 0;

    for (const p of DEMO_PROJECTS) {
      const { data: existing } = await supabaseAdmin
        .from("projects")
        .select("id")
        .eq("slug", p.slug)
        .maybeSingle();
      if (existing) continue;
      const { error } = await supabaseAdmin.from("projects").insert(p as never);
      if (!error) projectsInserted++;
    }

    for (const post of DEMO_POSTS) {
      const { data: existing } = await supabaseAdmin
        .from("blog_posts")
        .select("id")
        .eq("slug", post.slug)
        .maybeSingle();
      if (existing) continue;
      const { error } = await supabaseAdmin.from("blog_posts").insert(post as never);
      if (!error) postsInserted++;
    }

    return { projectsInserted, postsInserted };
  });
