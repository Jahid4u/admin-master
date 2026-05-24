import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

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
    ],
    overview:
      "WP Quick Forms is a zero-bloat WordPress plugin that lets creators ship production-ready forms in minutes.",
    challenge:
      "Most form plugins ship megabytes of legacy code, hurt page speed, and lock essential features behind paywalls.",
    solution:
      "A modular PHP core (under 80KB), a clean React-based builder, conditional logic, and SMTP plus webhook integrations.",
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
    meta_title: "WP Quick Forms — Lightweight WordPress Forms Plugin",
    meta_description: "Build production-ready WordPress forms in minutes with a 78KB modular plugin, conditional logic and SMTP delivery.",
    og_image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",
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
    ],
    overview:
      "FinTrack helps growing finance teams turn noisy bank feeds into clear, actionable dashboards.",
    challenge:
      "Existing dashboards either oversimplified the data or buried users in raw tables.",
    solution:
      "A typographic-first layout, hand-tuned D3 charts, a real-time WebSocket layer and keyboard-only navigation.",
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
    meta_title: "FinTrack — Real-time Finance Dashboards",
    meta_description: "Turn noisy bank feeds into dense, actionable finance dashboards with real-time WebSocket data and D3 charts.",
    og_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
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
    ],
    overview:
      "A calming, premium identity for a boutique yoga studio — built on a modular grid and a soft, earthy palette.",
    challenge: "The wellness category is crowded and visually generic.",
    solution: "A custom wordmark, a 12-token color system, 30+ asset templates and motion guidelines.",
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
    meta_title: "ZenFit Studio — Boutique Wellness Brand Identity",
    meta_description: "A calm, premium identity system for a boutique yoga studio with a 12-token palette and modular asset library.",
    og_image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=1200",
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
    ],
    overview: "A research-led rebuild of EduPulse's primary signup funnel.",
    challenge: "Flat conversion for 9 months despite heavy traffic.",
    solution: "Hierarchy reset, inline social proof, one primary CTA, progressive disclosure.",
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
    meta_title: "EduPulse — Conversion-Optimized Landing Page Case Study",
    meta_description: "How a research-led signup funnel rebuild grew EduPulse conversion by 31% in four weeks.",
    og_image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200",
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
    content: "Creating a WordPress theme from scratch might seem daunting, but it's the best way to understand the underlying mechanics of the CMS.\n\nStart by setting up a local development environment, then create `style.css` and `index.php` in your theme folder.",
    published: true,
    meta_title: "Building WordPress Themes from Scratch — Full Guide",
    meta_description: "Step-by-step guide to building a custom interactive WordPress theme from a blank folder.",
    og_image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",
  },
  {
    slug: "font-systems",
    title: "The Designer's Guide to Font Systems",
    description: "How to effectively pair typefaces and build robust typographic scales for digital products.",
    category: "Design",
    read_time: "8 min read",
    cover_image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
    content: "Typography is more than just choosing a nice font; it's about establishing a system that ensures consistency, readability and hierarchy.\n\nA good font system usually relies on a primary and a secondary typeface, plus a defined scale.",
    published: true,
    meta_title: "Designer's Guide to Font Systems & Typographic Scales",
    meta_description: "How to pair typefaces and build robust typographic scales that scale across an entire product.",
    og_image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200",
  },
  {
    slug: "framer-motion",
    title: "Mastering Framer Motion Animations",
    description: "Learn how to orchestrate complex, physically-based animations in React applications.",
    category: "Animation",
    read_time: "12 min read",
    cover_image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    content: "Framer Motion is a production-ready motion library for React that makes creating complex, fluid animations straightforward.\n\nMaster variants, gestures and layout animations to ship delightful interactions.",
    published: true,
    meta_title: "Mastering Framer Motion — React Animation Guide",
    meta_description: "Orchestrate complex, physics-based animations in React with Framer Motion variants, gestures and layout transitions.",
    og_image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
  },
];

const DEMO_SUBSCRIBERS = [
  { email: "alex.morgan@example.com", source: "footer", is_active: true },
  { email: "priya.shah@example.com", source: "footer", is_active: true },
  { email: "tomoko.ito@example.com", source: "footer", is_active: true },
  { email: "luis.fernandez@example.com", source: "footer", is_active: true },
  { email: "sara.johnson@example.com", source: "footer", is_active: false, unsubscribed_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { email: "kenji.takahashi@example.com", source: "footer", is_active: true },
];

const DEMO_MESSAGES = [
  {
    name: "Maya Patel",
    email: "maya.patel@brightlabs.io",
    subject: "Landing page redesign — Q3 engagement",
    message: "Hi Jahid, we're a 12-person SaaS team prepping for a Q3 product launch. Loved the FinTrack case study. Could we book a 30-min intro call next week to scope a landing page redesign?",
    source: "contact",
    is_read: false,
    is_replied: false,
  },
  {
    name: "Daniel Reyes",
    email: "daniel@reyes-studio.com",
    subject: "Brand identity collaboration",
    message: "We're a boutique skincare brand re-launching this autumn. Your ZenFit work is exactly the direction we want. Timeline is ~6 weeks. Budget: $8–12k. Available?",
    source: "home",
    is_read: true,
    is_replied: false,
  },
  {
    name: "Aiko Tanaka",
    email: "aiko@nomadcoffee.jp",
    subject: "Quick question about WP Quick Forms",
    message: "Hello — I run a small coffee shop site on WordPress. Does WP Quick Forms support Stripe-based donations out of the box, or do I need an extension?",
    source: "contact",
    is_read: false,
    is_replied: false,
  },
  {
    name: "Owen Walker",
    email: "owen@walkerventures.com",
    subject: "Speaking opportunity — DesignOps Summit",
    message: "Hi! I'm curating the DesignOps Summit lineup for October. Would love to invite you for a 25-min talk on design systems for solo founders. Travel + honorarium covered.",
    source: "contact",
    is_read: true,
    is_replied: true,
  },
];

async function ensureAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const importDemoContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.userId);

    let projectsInserted = 0;
    let postsInserted = 0;
    let subscribersInserted = 0;
    let messagesInserted = 0;

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

    for (const s of DEMO_SUBSCRIBERS) {
      const { data: existing } = await supabaseAdmin
        .from("newsletter_subscribers")
        .select("id")
        .eq("email", s.email)
        .maybeSingle();
      if (existing) continue;
      const { error } = await supabaseAdmin.from("newsletter_subscribers").insert(s as never);
      if (!error) subscribersInserted++;
    }

    for (const m of DEMO_MESSAGES) {
      const { data: existing } = await supabaseAdmin
        .from("contact_submissions")
        .select("id")
        .eq("email", m.email)
        .eq("subject", m.subject)
        .maybeSingle();
      if (existing) continue;
      const { error } = await supabaseAdmin.from("contact_submissions").insert(m as never);
      if (!error) messagesInserted++;
    }

    return { projectsInserted, postsInserted, subscribersInserted, messagesInserted };
  });

export const clearDemoContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.userId);

    const projectSlugs = DEMO_PROJECTS.map((p) => p.slug);
    const postSlugs = DEMO_POSTS.map((p) => p.slug);
    const subEmails = DEMO_SUBSCRIBERS.map((s) => s.email);
    const msgEmails = DEMO_MESSAGES.map((m) => m.email);

    await supabaseAdmin.from("projects").delete().in("slug", projectSlugs);
    await supabaseAdmin.from("blog_posts").delete().in("slug", postSlugs);
    await supabaseAdmin.from("newsletter_subscribers").delete().in("email", subEmails);
    await supabaseAdmin.from("contact_submissions").delete().in("email", msgEmails);

    return { ok: true };
  });
