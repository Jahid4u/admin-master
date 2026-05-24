export type Project = {
  id: string;
  slug: string;
  title: string;
  cat: string;
  year: string;
  role: string;
  client: string;
  timeline: string;
  image: string;
  cover: string;
  gallery: string[];
  desc: string;
  overview: string;
  challenge: string;
  solution: string;
  tags: string[];
  tech: string[];
  results: { label: string; value: string }[];
  liveUrl?: string;
  repoUrl?: string;
};

export const projects: Project[] = [
  {
    id: "01",
    slug: "wp-quick-forms",
    title: "WP Quick Forms",
    cat: "Plugin Development",
    year: "2024",
    role: "Plugin Engineer",
    client: "Independent Release",
    timeline: "8 weeks",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000",
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
    desc: "A lightweight WordPress plugin for custom forms. Features conditional logic, SMTP integration, and a focus on performance without bloat.",
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
    liveUrl: "https://example.com/wp-quick-forms",
    repoUrl: "https://github.com/example/wp-quick-forms",
  },
  {
    id: "02",
    slug: "fintrack",
    title: "FinTrack",
    cat: "Web Dashboard",
    year: "2024",
    role: "Product Designer & Dev",
    client: "FinTrack Labs",
    timeline: "12 weeks",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015",
    cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2400",
    gallery: [
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2001",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2002",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2003",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2004",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=2005",
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2006",
    ],
    desc: "Comprehensive financial dashboard designed for high-density data. Includes real-time tracking, budget planning, and interactive charts.",
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
    liveUrl: "https://example.com/fintrack",
  },
  {
    id: "03",
    slug: "zenfit-studio",
    title: "ZenFit Studio",
    cat: "Brand Identity",
    year: "2023",
    role: "Brand & Visual Designer",
    client: "ZenFit Studio",
    timeline: "6 weeks",
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2000",
    cover: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2400",
    gallery: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2001",
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2002",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2003",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2004",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2005",
    ],
    desc: "Complete visual identity and design system. Developed a modular set of 30+ social assets and marketing collateral.",
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
    liveUrl: "https://example.com/zenfit",
  },
  {
    id: "04",
    slug: "edupulse",
    title: "EduPulse",
    cat: "Conversion Landing Page",
    year: "2024",
    role: "UX & Frontend",
    client: "EduPulse Inc.",
    timeline: "4 weeks",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000",
    cover: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2400",
    gallery: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2001",
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=2002",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2003",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2004",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2005",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2006",
    ],
    desc: "Strategic landing page design focused on conversion optimization. Achieved a 42% lift in user engagement through UX research.",
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
    liveUrl: "https://example.com/edupulse",
  },
];

export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const getNextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return projects[0];
  return projects[(i + 1) % projects.length];
};
export const getPreviousProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return projects[projects.length - 1];
  return projects[(i - 1 + projects.length) % projects.length];
};
