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

const DEMO_ABOUT_PAGE = {
  hero_enabled: true,
  badge_enabled: true,
  badge_text: "Available for work",
  headline_pre: "Crafting digital experiences with",
  headline_italic: "purpose",
  headline_suffix: ".",
  bio: "I'm Jahid Hasan, founder of Apifel DIGI. I design brands and build websites — combining strong visual thinking with solid development skills to help creators stand out.",
  cta_enabled: true,
  cta_label: "Hire Me Now",
  cta_url: "#contact",
  socials_enabled: true,
  socials: [
    { label: "Twitter", url: "https://twitter.com/jahid", enabled: true },
    { label: "LinkedIn", url: "https://linkedin.com/in/jahid", enabled: true },
    { label: "Instagram", url: "https://instagram.com/jahid", enabled: true },
  ],
  profile_enabled: true,
  profile_image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800",
  profile_name: "Jahid Hasan",
  profile_role: "Graphic Designer & Dev",
  location_enabled: true,
  location_line1: "Based in Dhaka,",
  location_line2: "Bangladesh",
  cv_enabled: true,
  cv_label: "Download CV",
  cv_url: "#",
  experience_enabled: true,
  experience_title: "Work Experience",
  experiences: [
    { company: "Apifel DIGI", period: "2021 - Present", role: "Founder — Graphic Designer & Web Developer", enabled: true },
    { company: "FreshMind Agency", period: "2019 - 2021", role: "Senior Graphic Designer & Web Developer", enabled: true },
    { company: "StreamFlow Media", period: "2018 - 2019", role: "Graphic Designer", enabled: true },
    { company: "Freelance", period: "2016 - 2018", role: "Freelance Designer & WordPress Developer", enabled: true },
  ],
  studies_enabled: true,
  studies_title: "Studies",
  studies: [
    { title: "Visual Communication", detail: "Diploma — Graphic Design & Visual Arts (2014 - 2016)", enabled: true },
    { title: "Web Development", detail: "Full-Stack Web Development, WordPress (2016 - Present)", enabled: true },
  ],
  languages_enabled: true,
  languages_title: "Languages",
  languages: [
    { name: "English", enabled: true },
    { name: "Bengali", enabled: true },
  ],
  tech_enabled: true,
  tech_title: "Technical Arsenal",
  tech_description: "The tools and technologies I use to bring ideas to life.",
  tech_items: [
    { icon: "Ps", name: "Photoshop", enabled: true },
    { icon: "Ai", name: "Illustrator", enabled: true },
    { icon: "Fg", name: "Figma", enabled: true },
    { icon: "Wp", name: "WordPress", enabled: true },
    { icon: "{ }", name: "HTML/CSS", enabled: true },
    { icon: "Php", name: "PHP", enabled: true },
  ],
};

const DEMO_PAGE_SEO = {
  home: {
    title: "Jahid Hasan — Design Engineer & WordPress Developer",
    description: "Portfolio of Jahid Hasan — design engineer crafting brands, websites and WordPress products from Dhaka.",
  },
  about: {
    title: "About Jahid Hasan — Design Engineer in Dhaka",
    description: "Founder of Apifel DIGI. I design brands and ship production-ready websites with strong visual and engineering craft.",
  },
  work: {
    title: "Selected Work — Jahid Hasan",
    description: "A curated selection of brand, product and WordPress work shipped over the last 8 years.",
  },
  blog: {
    title: "Notes on design, code and shipping — Jahid Hasan",
    description: "Essays and tutorials on WordPress theming, design systems and Framer Motion.",
  },
  contact: {
    title: "Contact Jahid Hasan — Start a project",
    description: "Tell me about your project. Replies usually within 24 hours on business days.",
  },
  privacy: {
    title: "Privacy Policy — Jahid Hasan",
    description: "How this site collects, uses and protects your data.",
  },
  terms: {
    title: "Terms of Service — Jahid Hasan",
    description: "The terms that govern your use of this website and any services offered.",
  },
};

const DEMO_SETTINGS: Array<{ key: string; value: unknown }> = [
  { key: "about_page", value: DEMO_ABOUT_PAGE },
  { key: "page_seo", value: DEMO_PAGE_SEO },
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
    let settingsInserted = 0;

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

    for (const setting of DEMO_SETTINGS) {
      const { data: existing } = await supabaseAdmin
        .from("site_settings")
        .select("key")
        .eq("key", setting.key)
        .maybeSingle();
      if (existing) continue;
      const { error } = await supabaseAdmin
        .from("site_settings")
        .insert({ key: setting.key, value: setting.value } as never);
      if (!error) settingsInserted++;
    }

    return { projectsInserted, postsInserted, subscribersInserted, messagesInserted, settingsInserted };
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
