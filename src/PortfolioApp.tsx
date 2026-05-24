/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useParams } from '@/lib/router-compat';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { projects as sharedProjects } from '@/lib/projects-data';

export const blogPosts = [
  {
    id: "wordpress-themes",
    title: "Building Full WordPress Themes from Scratch",
    desc: "A comprehensive guide to transitioning from basic usage to building custom interactive themes.",
    date: "Mar 15, 2025",
    cat: "Web Dev",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    content: `Creating a WordPress theme from scratch might seem daunting, but it's the best way to understand the underlying mechanics of the CMS. Start by setting up a local development environment. I recommend using Local by Flywheel.

Once you have your local site up, navigate to the \`wp-content/themes\` directory and create a new folder for your theme. 

The two essential files you need are \`style.css\` and \`index.php\`. 

In your \`style.css\`, add the theme header comments. This is how WordPress recognizes your theme in the dashboard. Here is a basic example:

\`\`\`css
/*
Theme Name: My Custom Theme
Author: Jahid Hasan
Description: A custom minimal theme.
Version: 1.0
*/
\`\`\`

Next, you'll need \`functions.php\` to enqueue your scripts and styles. This file is the powerhouse of your theme, where you can define custom features, register menus, and add theme support like post thumbnails and title tags.

We will cover the template hierarchy in the next part. Understanding how WordPress selects which PHP file to render is crucial. The hierarchy starts from specific templates like \`single-post.php\` and falls back to more general ones like \`index.php\`.`
  },
  {
    id: "font-systems",
    title: "The Designer's Guide to Font Systems",
    desc: "How to effectively pair typefaces and build robust typographic scales for digital products.",
    date: "Mar 28, 2025",
    cat: "Design",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
    content: `Typography is more than just choosing a nice font; it's about establishing a system that ensures consistency, readability, and hierarchy across your digital product.

A good font system usually relies on a primary and a secondary typeface. The primary typeface is often used for headings and display purposes, while the secondary, high-legibility font is chosen for body copy.

### Understanding Contrast

When pairing fonts, look for contrast. You don't want two fonts that look too similar. A common and effective combination is pairing a Serif for headings with a Sans-Serif for body text, or vice-versa. 

For example, pairing Playfair Display (Serif) with Inter (Sans-Serif) creates a sleek, modern look with a touch of editorial elegance.

### Building the Scale

Once you have your typefaces, you need to establish a typographic scale. A scale dictates the sizing of your text elements (H1, H2, H3, p, small, etc.) using a mathematical ratio. A common ratio is 1.2 or 1.25. 

Using CSS variables, you can define your scale like this:

\`\`\`css
:root {
  --text-base: 16px;
  --text-sm: 14px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 30px;
}
\`\`\`

By sticking to this system, you ensure vertical rhythm and visual harmony throughout your application.`
  },
  {
    id: "framer-motion",
    title: "Mastering Framer Motion Animations",
    desc: "Learn how to orchestrate complex, physically-based animations in React applications.",
    date: "Apr 02, 2025",
    cat: "Animation",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    content: `Framer Motion is a production-ready motion library for React that makes creating complex, fluid animations incredibly straightforward. It's built on the physics of springs rather than time-based easing curves, resulting in animations that feel more natural and responsive.

### The motion Component

The core of Framer Motion is the \`motion\` component. It acts as a standard HTML or SVG element but is supercharged with animation capabilities.

\`\`\`jsx
import { motion } from 'framer-motion';

export const MyComponent = () => (
  <motion.div animate={{ x: 100 }} />
)
\`\`\`

### Variants for Orchestration

When you need to coordinate animations across multiple elements, Variants are your best friend. They allow you to define animation states externally and propagate those states through the DOM tree.

\`\`\`jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const List = () => (
  <motion.ul variants={container} initial="hidden" animate="show">
    <motion.li variants={item} />
    <motion.li variants={item} />
  </motion.ul>
)
\`\`\`

This pattern is incredibly powerful for page transitions, list entrances, and complex UI micro-interactions. Remember not to overuse animations; they should guide the user's attention, not distract it.`
  },
  {
    id: "tailwind-secrets",
    title: "Advanced Tailwind CSS Architecture",
    desc: "Structuring large-scale projects and writing maintainable utility classes with Tailwind.",
    date: "Apr 12, 2025",
    cat: "CSS",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    content: `Tailwind CSS is amazing for rapid prototyping, but in large codebases, long class strings can become a maintenance nightmare if not handled correctly.
    
### Component Extraction

While Tailwind is a utility-first framework, you shouldn't be afraid to extract components. The key is knowing *when*. Extract a component when the markup and styling are inherently tied together and repeated frequently.

For example, a primary button should almost always be a React component:

\`\`\`jsx
const Button = ({ children, variant = 'primary' }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
  };
  
  return (
    <button className={\`\${baseClasses} \${variants[variant]}\`}>
      {children}
    </button>
  );
};
\`\`\`

### Using clsx and tailwind-merge

When building flexible components, you often need to merge default classes with custom classes passed via props. Just concatenating strings can lead to specificity battles.

Using a combination of \`clsx\` (for conditional classes) and \`tailwind-merge\` (for resolving Tailwind conflicts) is the modern standard for this problem.`
  }
];

export const BlogPost = ({ theme }: { theme: 'dark' | 'light' }) => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className={`min-h-[70vh] flex items-center justify-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-blue-500 hover:underline inline-flex items-center gap-2">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className={`pt-32 pb-24 md:pt-40 md:pb-32 px-4 md:px-8 lg:px-16 min-h-screen transition-colors duration-700 `}>
      <div className="max-w-[1280px] mx-auto">
        <Link 
          to="/blog" 
          className={`inline-flex items-center gap-3 text-[11px] font-mono font-bold uppercase tracking-widest mb-12 md:mb-16 transition-colors ${theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black'} group`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${theme === 'dark' ? 'border-zinc-800 bg-zinc-900 group-hover:bg-white group-hover:text-black' : 'border-zinc-200 bg-white group-hover:bg-black group-hover:text-white'}`}>
             <ArrowRight className="w-4 h-4 rotate-180" />
          </div>
          Back to Journal
        </Link>
          
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(auto,340px)] gap-16 xl:gap-24 items-start">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col min-w-0"
          >
            {/* Post Header */}
            <header className="mb-10 md:mb-14">
              <div className={`flex flex-wrap items-center gap-4 text-[11px] font-mono font-bold uppercase tracking-[0.2em] mb-8 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                 <span className={`px-4 py-1.5 rounded-full border ${theme === 'dark' ? 'border-zinc-800 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-black'}`}>
                    {post.cat}
                 </span>
                 <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                 <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
                 <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
              </div>
              
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight leading-[1.15] mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                {post.title}
              </h1>

              <div className="h-[2px] w-20 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 mb-8" />
              
              <p className={`text-lg md:text-xl leading-relaxed font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {post.desc}
              </p>
            </header>

            {/* Post Hero Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-12 md:mb-16"
            >
              <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-br from-blue-500/30 via-transparent to-violet-500/30 blur-xl opacity-60 pointer-events-none" />
              <div className={`relative w-full aspect-[4/3] md:aspect-[16/9] rounded-[2rem] overflow-hidden ${theme === 'dark' ? 'bg-[#0a0a0a] border border-white/5' : 'bg-white border border-black/5'} shadow-xl`}>
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[2rem] pointer-events-none" />
              </div>
            </motion.div>

            {/* Post Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`prose prose-lg max-w-none w-full ${theme === 'dark' ? 'prose-invert prose-p:text-zinc-300 prose-headings:text-white prose-a:text-blue-400' : 'prose-p:text-zinc-700 prose-headings:text-black prose-a:text-blue-600'} prose-headings:font-display prose-headings:tracking-tight prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6 prose-p:leading-[1.8] prose-p:mb-8 prose-blockquote:border-l-2 prose-blockquote:border-blue-500 prose-blockquote:not-italic prose-blockquote:font-medium prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-[1.5rem] prose-pre:p-6 md:prose-pre:p-8 prose-pre:my-10 md:prose-pre:my-12 prose-img:rounded-[2rem] prose-img:border prose-img:border-black/5 dark:prose-img:border-white/5 prose-img:my-12 md:prose-img:my-14 prose-img:shadow-2xl`}
            >
              <div className="markdown-body">
                <ReactMarkdown>{post.content || ''}</ReactMarkdown>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Sidebar */}
          <aside className="w-full self-start lg:sticky lg:top-32 animate-fade-in">
            <div className="flex flex-col gap-8">
             {/* Author Info */}
             <div className={`relative w-full p-8 md:p-10 rounded-[2.5rem] border overflow-hidden ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-black/5 shadow-xl shadow-black/5'}`}>
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/10 blur-2xl pointer-events-none" />
                <div className="relative flex items-center gap-5 mb-8">
                  <div className="relative shrink-0">
                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 opacity-70 blur-[2px]" />
                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200" alt="Jahid Hasan" className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 ${theme === 'dark' ? 'border-[#0a0a0a]' : 'border-white'}`} />
                  </div>
                  <div>
                    <h4 className={`text-lg md:text-xl font-bold font-display tracking-tight mb-1 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Jahid Hasan</h4>
                    <p className={`text-[13px] md:text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Design Engineer</p>
                  </div>
                </div>
                <p className={`relative text-[15px] leading-relaxed mb-8 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Founder, designer, and developer. I share insights on crafting modern digital experiences, building brands, and pushing pixel boundaries.
                </p>
                <a href="#" className={`relative inline-flex items-center justify-center w-full py-4 rounded-full text-[14px] font-bold transition-transform hover:scale-105 active:scale-95 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                  Follow on Twitter
                </a>
             </div>
             
             {/* Share */}
             <div className={`w-full p-8 md:p-10 rounded-[2.5rem] border flex flex-col gap-6 ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                <span className={`text-[11px] font-mono font-bold uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Share this article</span>
                <div className="flex gap-3">
                   <button className={`flex-1 h-14 rounded-full flex items-center justify-center border transition-all hover:-translate-y-1 ${theme === 'dark' ? 'bg-[#151515] border-white/5 hover:border-white/20' : 'bg-zinc-50 border-black/5 hover:border-black/10 hover:shadow-md'}`} aria-label="Share on Twitter"><Twitter className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} /></button>
                   <button className={`flex-1 h-14 rounded-full flex items-center justify-center border transition-all hover:-translate-y-1 ${theme === 'dark' ? 'bg-[#151515] border-white/5 hover:border-white/20' : 'bg-zinc-50 border-black/5 hover:border-black/10 hover:shadow-md'}`} aria-label="Share on LinkedIn"><Linkedin className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-600' : 'text-blue-700'}`} /></button>
                   <button className={`flex-1 h-14 rounded-full flex items-center justify-center border transition-all hover:-translate-y-1 ${theme === 'dark' ? 'bg-[#151515] border-white/5 hover:border-white/20' : 'bg-zinc-50 border-black/5 hover:border-black/10 hover:shadow-md'}`} aria-label="Copy Link"><ExternalLink className={`w-5 h-5 ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`} /></button>
                </div>
             </div>
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-24 md:mt-32 pt-16 border-t border-black/5 dark:border-white/5"
        >
          <div className="flex items-center gap-4 mb-12">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <h3 className={`text-2xl md:text-3xl font-bold font-display ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Keep Reading</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map((relatedPost, idx) => (
               <motion.div
                 key={idx}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                 className="flex flex-col h-full"
               >
                 <Link 
                   to={`/blog/${relatedPost.id}`}
                   className={`group cursor-pointer flex flex-col h-full rounded-[2.5rem] p-5 md:p-6 transition-all duration-500 border ${
                     theme === 'dark' 
                       ? 'bg-[#0a0a0a] border-white/5 hover:bg-[#121212] hover:border-white/10' 
                       : 'bg-white border-black/5 hover:border-black/10 hover:shadow-xl hover:shadow-black/5'
                   }`}
                 >
                   <div className="relative overflow-hidden rounded-[2rem] w-full aspect-[4/3] shrink-0 mb-6 bg-zinc-100 dark:bg-zinc-900">
                     <img src={relatedPost.image} alt={relatedPost.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                   </div>
                   <div className="flex flex-col flex-1 px-2">
                     <div className={`text-[11px] font-mono font-bold uppercase tracking-widest mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                        {relatedPost.cat}
                     </div>
                     <h4 className={`text-xl font-bold font-display tracking-tight leading-[1.25] mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-white group-hover:text-blue-400' : 'text-black group-hover:text-blue-600'}`}>
                        {relatedPost.title}
                     </h4>
                     <p className={`text-[15px] leading-relaxed line-clamp-2 mt-auto ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {relatedPost.desc}
                     </p>
                   </div>
                 </Link>
               </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </article>
  );
};
import { 
  Github, 
  Linkedin, 
  Twitter, 
  ExternalLink, 
  Code, 
  Palette, 
  Layers, 
  Zap,
  Menu,
  X,
  Star,
  MessageSquare,
  TrendingUp,
  Target,
  Rocket,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  ChevronRight,
  Facebook,
  Instagram,
  Dribbble,
  Home,
  Quote,
  Mail,
  User,
  Briefcase,
  FileText,
  Image as ImageIcon,
  Users,
  Clock,
  Command,
  Sun,
  Moon,
  MapPin,
  CornerDownLeft,
  Check,
  Copy,
  Globe,
  Phone,
  MessageCircle,
  Search,
  Calendar,
  ArrowDownUp,
  ChevronDown,
  Send
} from 'lucide-react';

export const MouseGlow = ({ theme }: { theme: 'dark' | 'light' }) => {
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  
  const springX = useSpring(mouseX, { stiffness: 130, damping: 22, mass: 1 });
  const springY = useSpring(mouseY, { stiffness: 130, damping: 22, mass: 1 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId = 0;
    let nextX = -9999;
    let nextY = -9999;
    let pendingTarget: HTMLElement | null = null;
    let lastHoverCheck = 0;
    let lastHover = false;

    const HOVER_SELECTOR = 'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="pointer"]';

    const flush = () => {
      rafId = 0;
      mouseX.set(nextX);
      mouseY.set(nextY);

      const now = performance.now();
      if (pendingTarget && now - lastHoverCheck > 80) {
        lastHoverCheck = now;
        const next = !!pendingTarget.closest(HOVER_SELECTOR);
        if (next !== lastHover) {
          lastHover = next;
          setIsHovering(next);
        }
      }
    };

    const onMove = (e: MouseEvent) => {
      nextX = e.clientX;
      nextY = e.clientY;
      pendingTarget = e.target as HTMLElement;
      if (!rafId) rafId = requestAnimationFrame(flush);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed z-[50] hidden md:block rounded-full"
      style={{
        left: springX,
        top: springY,
        width: isHovering ? 500 : 350,
        height: isHovering ? 500 : 350,
        x: '-50%',
        y: '-50%',
        background: theme === 'dark' 
          ? 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 70%)'
          : 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.04) 40%, transparent 70%)',
        transition: 'width 0.5s ease-out, height 0.5s ease-out',
      }}
    />
  );
};

const Magnetic = ({ children, strength = 0.5 }: { children: React.ReactNode, strength?: number, key?: any }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const x = (clientX - centerX) * strength;
    const y = (clientY - centerY) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="flex items-center justify-center pointer-events-auto"
    >
      {children}
    </motion.div>
  );
};

export const Navbar = ({ theme, toggleTheme }: { theme: 'dark' | 'light', toggleTheme: () => void }) => {
  const location = useLocation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState("");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  const activeTab = location.pathname === '/' ? 'Home' : 
                   location.pathname.includes('work') ? 'Work' : 
                   location.pathname.includes('blog') ? 'Blog' : 
                   location.pathname.includes('about') ? 'About' : 
                   location.pathname.includes('contact') ? 'Contact' : 'Home';

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });

    // 3D Tilt calculation
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const setTime = () => {
      const dhakaTime = new Date().toLocaleTimeString('en-US', { 
        timeZone: 'Asia/Dhaka', 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      setCurrentTime(dhakaTime);
    };
    setTime();
    const timer = setInterval(setTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={12} strokeWidth={2.5} /> },
    { name: 'Work', path: '/work', icon: <Briefcase size={12} strokeWidth={2.5} /> },
    { name: 'Blog', path: '/blog', icon: <FileText size={12} strokeWidth={2.5} /> },
    { name: 'About', path: '/about', icon: <User size={12} strokeWidth={2.5} /> },
    { name: 'Contact', path: '/contact', icon: <Mail size={12} strokeWidth={2.5} /> }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 sm:pt-6 lg:pt-8 px-3 sm:px-6 pointer-events-none perspective-1000">
        
        {/* Floating Screen Left */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute left-8 top-11 flex-col gap-1 pointer-events-auto hidden lg:flex"
        >
           <span className={`text-[9px] font-bold uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Jahid Hasan</span>
           <span className={`text-[8px] font-medium uppercase tracking-[0.2em] flex items-center gap-1 ${theme === 'dark' ? 'text-white/40' : 'text-zinc-500'}`}>
             Dhaka, Bangladesh
           </span>
        </motion.div>

        {/* Floating Screen Right */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute right-8 top-11 flex-col items-end gap-1 pointer-events-auto hidden lg:flex"
        >
           <span className={`text-[10px] font-bold uppercase tracking-[0.3em] font-mono ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{currentTime || "00:00:00"}</span>
           <span className={`text-[8px] font-medium uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-white/50' : 'text-zinc-500'}`}>LOCAL TIME (GMT+6)</span>
        </motion.div>

        <motion.div 
          ref={navRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{ rotateX: tilt.x, rotateY: tilt.y }}
          layout
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundColor: theme === 'dark' 
              ? (scrollProgress > 10 ? 'rgba(12, 12, 12, 0.8)' : 'rgba(12, 12, 12, 0.5)')
              : (scrollProgress > 10 ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.4)'),
            borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)'
          }}
          className="relative flex items-center gap-1 p-1 rounded-full border backdrop-blur-3xl shadow-[0_48px_96px_-16px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(0,0,0,0.4)] pointer-events-auto group overflow-visible transition-all duration-700"
        >
          {/* Scroll Progress Line */}
          <div className={`absolute top-0 left-6 right-6 h-[1.5px] overflow-hidden rounded-full ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-500/10'}`}>
            <motion.div 
              style={{ width: `${scrollProgress}%` }}
              className="h-full bg-blue-400 shadow-[0_0_20px_rgba(96,165,250,1)]"
            />
          </div>

          {/* Sweeping Background Color Effect (Premium Smooth) */}
          <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
            {/* Base soft wide glow */}
            <motion.div 
               animate={{ left: ['-100%', '200%'] }}
               transition={{ 
                 duration: 25, 
                 repeat: Infinity,
                 repeatDelay: 5,
                 ease: [0.4, 0, 0.2, 1]
               }}
               className={`absolute inset-y-0 w-[35%] bg-gradient-to-r from-transparent ${theme === 'dark' ? 'via-blue-500/40' : 'via-blue-400/25'} to-transparent skew-x-[-30deg] blur-2xl`}
            />
            {/* Slightly brighter inner core for depth */}
            <motion.div 
               animate={{ left: ['-100%', '200%'] }}
               transition={{ 
                 duration: 25, 
                 repeat: Infinity,
                 repeatDelay: 5,
                 ease: [0.4, 0, 0.2, 1]
               }}
               className={`absolute inset-y-0 w-[15%] bg-gradient-to-r from-transparent ${theme === 'dark' ? 'via-cyan-400/50' : 'via-blue-500/35'} to-transparent skew-x-[-30deg] blur-xl`}
            />
          </div>

          {/* Profile Avatar */}
          <div className="flex items-center pl-1.5 pr-1.5 sm:pl-2 sm:pr-2">
             <motion.div 
               whileHover={{ scale: 1.05 }}
               className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-white/20 shadow-xl cursor-pointer"
             >
                <img 
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2574" 
                  alt="Profile" 
                  className="w-full h-full object-cover transition-all duration-500"
                />
             </motion.div>
          </div>

          {/* Section Divider */}
          <div className={`hidden sm:block w-[1px] h-5 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`} />

          {/* Navigation Items */}
          <div className="flex items-center px-1">
            {navItems.map((item, index) => (
              <React.Fragment key={item.name}>
                <Magnetic strength={0.15}>
                <Link
                  to={item.path}
                  aria-label={item.name}
                  className={`px-2.5 sm:px-3 lg:px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-2 group/item ${
                    activeTab === item.name 
                      ? (theme === 'dark' ? 'text-white' : 'text-black') 
                      : 'text-slate-500 hover:text-blue-500'
                  }`}
                >
                  <div className="relative">
                    <span className={`transition-all duration-500 ${activeTab === item.name ? 'text-blue-400 scale-110 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'group-hover/item:scale-110 group-hover/item:text-blue-400'}`}>{item.icon}</span>
                    {item.name === 'Contact' && (
                       <span className={`absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-500 rounded-full border animate-pulse ${theme === 'dark' ? 'border-[#050505]' : 'border-white'}`} />
                    )}
                  </div>
                  <span className="hidden lg:inline">{item.name}</span>
                  
                  {activeTab === item.name && (
                    <>
                      <motion.div 
                        layoutId="active-nav-pill" 
                        className={`absolute inset-0 rounded-full -z-10 border transition-colors ${
                          theme === 'dark' 
                            ? 'bg-white/[0.08] shadow-[0_12px_24px_-10px_rgba(59,130,246,0.3),inset_0_1px_1px_rgba(255,255,255,0.08)] border-white/20' 
                            : 'bg-black/[0.05] shadow-[0_12px_24px_-10px_rgba(59,130,246,0.2),inset_0_1px_1px_rgba(0,0,0,0.05)] border-black/10'
                        }`}
                        transition={{ 
                          type: "spring", 
                          stiffness: 350, 
                          damping: 25,
                          mass: 0.8
                        }}
                      />
                      <motion.div 
                        layoutId="active-nav-dot"
                        className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_rgba(59,130,246,1)]"
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 20
                        }}
                      />
                    </>
                  )}
                </Link>
                </Magnetic>
                {/* Item Divider */}
                {index < navItems.length - 1 && (
                  <div className={`w-[1px] h-3 mx-0.5 sm:mx-1 rounded-full ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Section Divider */}
          <div className={`w-[1px] h-5 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`} />

          {/* Theme Toggle (Simplified) - Moved after Menu */}
          <div className="flex items-center px-2 sm:px-3 group/logo cursor-pointer">
             <motion.button 
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle theme"
                className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-lg transition-all duration-500 relative overflow-hidden ${
                  theme === 'dark' 
                    ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                    : 'bg-black text-white shadow-[0_0_15px_rgba(0,0,0,0.3)]'
                }`}
             >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ y: 20, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.3, ease: "anticipate" }}
                  >
                    {theme === 'dark' ? <Sun size={14} strokeWidth={3} /> : <Moon size={14} strokeWidth={3} />}
                  </motion.div>
                </AnimatePresence>
                <div className={`absolute inset-0 border-2 rounded-lg opacity-0 group-hover/logo:opacity-100 transition-opacity ${theme === 'dark' ? 'border-black/10' : 'border-white/10'}`} />
             </motion.button>
          </div>

          {/* Section Divider */}
          <div className={`hidden sm:block w-[1px] h-5 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`} />

          {/* Connect Action (Right Side) — hidden on small screens, Contact icon in nav serves as CTA */}
          <div className={`hidden sm:flex pl-3 pr-1 items-center gap-3`}>
               <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className={`h-9 px-5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full transition-all duration-300 flex items-center gap-2 group/btn relative overflow-hidden ${
                 theme === 'dark' ? 'bg-white text-black hover:bg-white' : 'bg-black text-white hover:bg-black'
               }`}
             >
               <Link to="/contact" className="absolute inset-0 z-20"></Link>
               <div className="absolute inset-0 bg-blue-500 translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
               <span className={`relative z-10 flex items-center gap-2 group-hover/btn:text-white transition-colors duration-500`}>
                 Connect <ArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
               </span>
             </motion.button>
          </div>
        </motion.div>
      </nav>
    </>
  );
};

const Hero = ({ theme }: { theme: 'dark' | 'light' }) => {
  return (
    <section 
      className={`min-h-screen relative w-full flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32 pb-24 overflow-hidden transition-colors duration-1000 ${
        theme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'
      }`}

      id="home"
    >
      {/* Background Micro-Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] dark:opacity-[0.04]">
        <div 
          className={`absolute inset-0 ${
            theme === 'dark' 
              ? 'bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]' 
              : 'bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)]'
          } bg-[size:32px_32px]`} 
        />
      </div>

      {/* Exquisite soft light flares (absolutely clean background) */}
      <div className={`absolute w-[50rem] h-[50rem] max-w-full rounded-full blur-[160px] pointer-events-none opacity-30 mix-blend-screen transition-all duration-1000 ${
        theme === 'dark' ? 'bg-zinc-800/20' : 'bg-blue-100/40'
      }`} style={{ top: '25%', left: '75%', transform: 'translate(-50%, -50%)' }} />

      <div className="max-w-[1300px] w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Typographic Narrative */}
        <div className="lg:col-span-7 flex flex-col items-start gap-8">
          
          {/* Pristine Modern Tag */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-[9px] font-mono tracking-[0.25em] uppercase select-none ${
              theme === 'dark' 
                ? 'bg-zinc-950/80 border-zinc-900 text-zinc-400' 
                : 'bg-white border-zinc-200 text-zinc-500 shadow-xs'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            Apifel DIGI • SYSTEM DESIGN STUDIO
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            <h1 className={`text-5xl sm:text-7xl md:text-8xl font-sans font-extralight tracking-tight leading-[1.05] uppercase ${
              theme === 'dark' ? 'text-white' : 'text-zinc-950'
            }`}>
              Aesthetic <br />
              <span className={`font-semibold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-850'}`}>Intelligence</span> <br />
              <span className="font-mono text-zinc-500 lowercase font-light text-4xl sm:text-6xl md:text-7xl block mt-2">[&amp; flawless systems]</span>_
            </h1>

            <p className={`text-sm sm:text-base leading-[1.7] max-w-xl font-light tracking-normal ${
              theme === 'dark' ? 'text-zinc-400 font-extralight' : 'text-zinc-500 font-normal'
            }`}>
              We design and engineer high-end digital products that command attention. Led by <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Jahid Hasan</span>, Apifel DIGI synthesizes modern minimalist design rules with clean, uncompromising React architectures.
            </p>
          </motion.div>

          {/* Core Action Triggers */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-4 items-center"
          >
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative group/btn rounded-full font-bold uppercase tracking-[0.25em] text-[10px] px-8 py-4.5 border transition-all ${
                theme === 'dark' 
                  ? 'bg-white text-black border-white hover:bg-transparent hover:text-white' 
                  : 'bg-zinc-950 text-white border-zinc-950 hover:bg-transparent hover:text-black'
              }`}
            >
              <a href="#work" className="absolute inset-0 z-20" />
              <span className="relative z-10 flex items-center gap-2">
                Explore Work <ArrowUpRight size={13} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </span>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-8 py-4.5 rounded-full font-bold uppercase tracking-[0.25em] text-[10px] border transition-all ${
                theme === 'dark' 
                  ? 'bg-zinc-950/20 text-zinc-300 border-zinc-900 hover:bg-zinc-900/60' 
                  : 'bg-white text-zinc-650 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <a href="#about" className="absolute inset-0 z-20" />
              Read Narrative
            </motion.button>
          </motion.div>

          {/* Quick numbers bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="grid grid-cols-3 gap-8 pt-6 border-t w-full max-w-xl text-left"
            style={{ borderColor: theme === 'dark' ? 'rgba(63, 63, 70, 0.2)' : 'rgba(212, 212, 216, 0.4)' }}
          >
            <div>
              <span className={`text-[10px] font-mono tracking-widest ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>01 / SCOPE</span>
              <span className={`text-sm font-semibold mt-1 block uppercase ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>Fullstack</span>
            </div>
            <div>
              <span className={`text-[10px] font-mono tracking-widest ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>02 / STANDARDS</span>
              <span className={`text-sm font-semibold mt-1 block uppercase ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>W3C Clean</span>
            </div>
            <div>
              <span className={`text-[10px] font-mono tracking-widest ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>03 / FOCUS</span>
              <span className={`text-sm font-semibold mt-1 block uppercase ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>Aesthetics</span>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Premium Visual Exhibition Cards */}
        <div className="lg:col-span-5 relative flex flex-col gap-6">
          
          {/* Main Exhibition Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`p-6 rounded-3xl border relative overflow-hidden group/card ${
              theme === 'dark' 
                ? 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800' 
                : 'bg-white border-zinc-200 shadow-sm hover:shadow-md'
            } transition-all duration-500`}
          >
            {/* Visual design element inside card */}
            <div className="h-44 rounded-2xl w-full relative overflow-hidden mb-6 bg-zinc-900/10 dark:bg-zinc-950 flex items-center justify-center border border-zinc-500/10">
              {/* Decorative Schematic Vectors */}
              <svg className="w-full h-full absolute inset-0 pointer-events-none opacity-20 dark:opacity-40">
                <circle cx="50%" cy="50%" r="50" fill="none" stroke={theme === 'dark' ? '#3b82f6' : '#2563eb'} strokeWidth="1" strokeDasharray="4 4" />
                <rect x="25%" y="25%" width="50%" height="50%" fill="none" stroke={theme === 'dark' ? '#334155' : '#cbd5e1'} strokeWidth="0.5" />
                <line x1="0" y1="0" x2="100%" y2="100%" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} strokeWidth="0.5" />
                <line x1="100%" y1="0" x2="0" y2="100%" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} strokeWidth="0.5" />
              </svg>
              
              <div className="relative text-center flex flex-col items-center gap-2">
                <Palette size={20} className={theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'} />
                <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-semibold ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>AESTHETIC SCHEMATIC</span>
                <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-widest font-bold">compliance: 100%</span>
              </div>
            </div>

            <div className="flex items-center justify-between pointer-events-none mb-2">
              <span className={`text-[10px] font-mono tracking-widest uppercase ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>01 / DESIGN EXHIBIT</span>
              <span className={`text-[9px] font-mono uppercase ${theme === 'dark' ? 'text-zinc-650' : 'text-zinc-400'}`}>ESTABLISHED 2026</span>
            </div>

            <h3 className={`text-lg font-semibold uppercase ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>
              Golden Ratio Layout Rules
            </h3>
            <p className={`text-xs mt-2 leading-[1.65] ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Grid alignments structured on dynamic aspect coordinates. Seamless layout proportions tailored specifically for pristine aesthetics.
            </p>
          </motion.div>

          {/* Under Cards: Performance grid and Location tag */}
          <div className="grid grid-cols-2 gap-4">
            {/* Metric Box 1 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`p-5 rounded-2xl border text-left ${
                theme === 'dark' ? 'bg-[#0a0a0c]/80 border-zinc-900 hover:border-zinc-850' : 'bg-white border-zinc-200 shadow-xs'
              } transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-mono uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>LCP SPEED</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className={`text-base font-mono font-semibold mt-2.5 block ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-850'}`}>0.12S</span>
              <span className="text-[8px] font-mono mt-1 block opacity-50 uppercase tracking-wider">LATEST CRITERIA</span>
            </motion.div>

            {/* Metric Box 2 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`p-5 rounded-2xl border text-left ${
                theme === 'dark' ? 'bg-[#0a0a0c]/80 border-zinc-900 hover:border-zinc-850' : 'bg-white border-zinc-200 shadow-xs'
              } transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-mono uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>W3C SEO</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className={`text-base font-mono font-semibold mt-2.5 block ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-850'}`}>100/100</span>
              <span className="text-[8px] font-mono mt-1 block opacity-50 uppercase tracking-wider">PERFECT SCORE</span>
            </motion.div>
          </div>

          {/* Aesthetic location and time tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.4 }}
            className={`p-4 rounded-xl border flex items-center justify-between ${
              theme === 'dark' ? 'bg-zinc-950/40 border-zinc-900' : 'bg-[#f4f4f5] border-zinc-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin size={11} className="text-blue-500" />
              <span className={`text-[9px] font-mono tracking-wider ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>LOCATED: DHAKA, BD</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={11} className="text-zinc-500" />
              <span id="utc-clock" className={`text-[9px] font-mono tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>UTC +6:00</span>
            </div>
          </motion.div>

        </div>

      </div>

      {/* Classic Horizontal Swiss Footer Bar */}
      <div className="absolute bottom-6 left-0 right-0 px-6 md:px-12 lg:px-24 hidden md:block select-none opacity-80">
        <div className={`w-full h-[1px] ${theme === 'dark' ? 'bg-zinc-900/60' : 'bg-zinc-200/50'} mb-3`} />
        <div className="flex justify-between items-center text-[8.5px] font-mono tracking-[0.3em] opacity-40 uppercase font-bold">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Palette size={11} className="opacity-75" /> Aesthetic Systematization</span>
            <div className={`w-3 h-[1px] ${theme === 'dark' ? 'bg-zinc-850' : 'bg-zinc-350'}`} />
            <span className="flex items-center gap-1.5"><Code size={11} className="opacity-75" /> Pristine Technical Engineering</span>
          </div>
          <span>© 2026 APiFEL DIGI. All rights reserved.</span>
        </div>
      </div>
    </section>
  );
};

export const About = ({ theme }: { theme: 'dark' | 'light' }) => {
  return (
    <section className={`py-24 md:py-32 px-4 md:px-8 lg:px-16 transition-colors duration-700 min-h-screen ${theme === 'dark' ? 'text-white' : 'text-black'}`} id="about">
      <div className="max-w-[1280px] mx-auto w-full flex flex-col gap-6">
        
        {/* Top Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* Main Intro Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`col-span-1 md:col-span-2 lg:col-span-2 row-span-2 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border flex flex-col justify-between transition-all duration-500 ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5 hover:border-white/10' : 'bg-white border-black/5 hover:shadow-xl hover:border-black/10'}`}
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 text-xs font-bold uppercase tracking-wider text-blue-500 border-blue-500/20 bg-blue-500/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Available for work
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 font-display leading-[1.1] md:leading-[1.1]">
                Crafting digital experiences with <span className="text-blue-500 italic">purpose</span>.
              </h2>
              <p className={`text-[16px] md:text-[18px] leading-[1.7] max-w-lg ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                I'm Jahid Hasan, founder of Apifel DIGI. I design brands and build websites — combining strong visual thinking with solid development skills to help creators stand out.
              </p>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <a href="#contact" className={`px-8 py-4 rounded-full font-bold text-sm transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                Hire Me Now <ArrowRight className="w-4 h-4 ml-1" />
              </a>
              <div className="flex gap-2">
                {[
                  { icon: <Twitter className="w-4 h-4" />, url: "#" },
                  { icon: <Linkedin className="w-4 h-4" />, url: "#" },
                  { icon: <Instagram className="w-4 h-4" />, url: "#" },
                ].map((social, i) => (
                  <a key={i} href={social.url} className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${theme === 'dark' ? 'border-white/10 hover:bg-white/10' : 'border-black/10 hover:bg-black/5'}`}>
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Profile Image Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`col-span-1 lg:col-span-1 row-span-2 relative rounded-[2rem] md:rounded-[3rem] overflow-hidden min-h-[300px] md:min-h-full border group ${theme === 'dark' ? 'border-white/5' : 'border-black/5 shadow-lg'}`}
          >
            <img 
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800" 
              alt="Jahid Hasan" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 grayscale-[0.2] group-hover:grayscale-0" 
            />
            <div className={`absolute inset-0 bg-gradient-to-t opacity-60 ${theme === 'dark' ? 'from-black to-transparent' : 'from-black/50 to-transparent'}`}></div>
            <div className="absolute bottom-6 left-6 right-6">
               <h3 className="text-white text-2xl font-bold font-display">Jahid Hasan</h3>
               <p className="text-white/80 text-sm font-medium">Graphic Designer & Dev</p>
            </div>
          </motion.div>

          {/* Location & CV Stack */}
          <div className="col-span-1 md:col-span-3 lg:col-span-1 flex flex-row lg:flex-col gap-4 md:gap-6">
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className={`flex-1 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border flex flex-col justify-center items-center text-center transition-all ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5 hover:border-white/10' : 'bg-white border-black/5 hover:shadow-xl'}`}
             >
               <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                 <Globe className="w-6 h-6" />
               </div>
               <p className="font-bold text-[15px] leading-tight">Based in Dhaka,<br/>Bangladesh</p>
             </motion.div>
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className={`flex-1 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border flex flex-col justify-center items-center text-center cursor-pointer group transition-all duration-500 relative overflow-hidden ${theme === 'dark' ? 'bg-blue-600 border-blue-500 hover:bg-blue-500' : 'bg-blue-500 border-blue-600 hover:bg-blue-600 shadow-lg'}`}
             >
               <ArrowRight className="w-10 h-10 mb-4 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
               <p className="font-bold text-white text-[15px]">Download CV</p>
             </motion.div>
          </div>
        </div>

        {/* Second Row Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
          
          {/* Work Experience */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`col-span-1 lg:col-span-2 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}
          >
            <h3 className="text-2xl font-bold font-display mb-10 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Work Experience
            </h3>
            <div className="flex flex-col gap-10 relative">
              <div className={`absolute left-[5px] top-2 bottom-2 w-[2px] rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`}></div>
              {[
                 {
                   company: "Apifel DIGI",
                   period: "2021 - Present",
                   role: "Founder — Graphic Designer & Web Developer",
                 },
                 {
                   company: "FreshMind Agency",
                   period: "2019 - 2021",
                   role: "Senior Graphic Designer & Web Developer",
                 },
                 {
                   company: "StreamFlow Media",
                   period: "2018 - 2019",
                   role: "Graphic Designer",
                 },
                 {
                   company: "Freelance",
                   period: "2016 - 2018",
                   role: "Freelance Designer & WordPress Developer",
                 }
              ].map((exp, i) => (
                <div key={i} className="pl-8 relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 group">
                  <div className={`absolute left-0 top-2 w-[12px] h-[12px] rounded-full border-[3px] transition-colors ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/20 group-hover:border-blue-500' : 'bg-white border-black/20 group-hover:border-blue-500'}`}></div>
                  <div>
                    <h4 className="text-[19px] font-bold tracking-tight mb-1">{exp.company}</h4>
                    <div className={`text-[14px] font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{exp.role}</div>
                  </div>
                  <div className={`text-[12px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full whitespace-nowrap self-start sm:self-auto ${theme === 'dark' ? 'bg-white/5 text-zinc-300' : 'bg-black/5 text-zinc-600'}`}>
                    {exp.period}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Education & Languages */}
          <div className="col-span-1 flex flex-col gap-4 md:gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`flex-1 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}
            >
              <h3 className="text-2xl font-bold font-display mb-8">Studies</h3>
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="text-[16px] font-bold mb-1">Visual Communication</h4>
                  <p className={`text-[13px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Diploma — Graphic Design & Visual Arts (2014 - 2016)</p>
                </div>
                <div className={`w-full h-[1px] ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}></div>
                <div>
                  <h4 className="text-[16px] font-bold mb-1">Web Development</h4>
                  <p className={`text-[13px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Full-Stack Web Development, WordPress (2016 - Present)</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border flex flex-col justify-center ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}
            >
              <h3 className="text-[15px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Languages</h3>
              <div className="flex flex-wrap gap-2">
                 <span className={`px-4 py-2 rounded-full text-[13px] font-bold tracking-wide ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/5 text-black'}`}>English</span>
                 <span className={`px-4 py-2 rounded-full text-[13px] font-bold tracking-wide ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/5 text-black'}`}>Bengali</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Technical Skills Marquee / Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-4 md:mt-0 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-black/5 shadow-sm'}`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <h3 className="text-2xl font-bold font-display flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Technical Arsenal
            </h3>
            <p className={`text-[15px] max-w-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>The tools and technologies I use to bring ideas to life.</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
             {[
                { icon: "Ps", name: "Photoshop" },
                { icon: "Ai", name: "Illustrator" },
                { icon: "Fg", name: "Figma" },
                { icon: "Wp", name: "WordPress" },
                { icon: "{ }", name: "HTML/CSS" },
                { icon: "Php", name: "PHP" },
             ].map((skill, i) => (
               <div key={i} className={`flex flex-col items-center justify-center p-6 rounded-[1.5rem] border transition-all hover:-translate-y-1 ${theme === 'dark' ? 'bg-[#151515] border-white/5 hover:border-white/20' : 'bg-zinc-50 border-black/5 hover:border-black/10 hover:shadow-md'}`}>
                 <div className="text-2xl font-bold font-mono text-blue-500 mb-3">{skill.icon}</div>
                 <div className="text-[13px] font-bold tracking-wide">{skill.name}</div>
               </div>
             ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

const ProjectCard = ({ project, theme, idx }: { project: any, theme: 'dark' | 'light', idx: number }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  
  const isEven = idx % 2 === 0;

  return (
    <motion.div
      ref={container}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-4 md:gap-5 group cursor-pointer"
    >
      <Link to={`/work/${project.slug}`} className="contents">
      {/* Image Container */}
      <div className={`relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 group-hover:shadow-[0_30px_60px_-15px_rgba(59,130,246,0.25)] group-hover:-translate-y-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${theme === 'dark' ? 'shadow-white/5 border border-white/5 group-hover:border-blue-500/30' : 'shadow-black/5 border border-black/5 group-hover:border-blue-500/30'}`}>
        <motion.div style={{ y }} className="absolute inset-0 scale-[1.1]">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] origin-center" 
          />
        </motion.div>
        
        {/* Subtle overlay instead of heavy backdrop */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
        
        {/* Clean Floating Badge for 'View' */}
        <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
           <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shadow-2xl ${theme === 'dark' ? 'bg-white text-black hover:scale-105' : 'bg-black text-white hover:scale-105'} transition-transform duration-300`}>
              <ArrowUpRight className="w-5 h-5 lg:w-6 lg:h-6" />
           </div>
        </div>
      </div>

      <div className={`flex flex-col items-start px-2 mt-3`}>
        <div className={`flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-3 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>
          <span>{project.cat}</span>
        </div>

        <h3 className={`text-2xl md:text-2xl lg:text-3xl font-bold font-display tracking-tight mb-3 ${theme === 'dark' ? 'text-white' : 'text-black'} group-hover:text-blue-500 transition-colors duration-500 leading-tight md:leading-tight`}>
          {project.title}
        </h3>
        
        <p className={`text-sm md:text-base leading-[1.6] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'} max-w-[95%] line-clamp-2`}>
          {project.desc}
        </p>
      </div>
      </Link>
    </motion.div>
  );
};

export const DetailedProjects = ({ theme }: { theme: 'dark' | 'light' }) => {
  const projects = sharedProjects;

  return (
    <section className={`pt-20 md:pt-28 pb-32 md:pb-32 px-6 md:px-12 lg:px-20 transition-colors duration-700 relative overflow-hidden `} id="work">
      <div className="max-w-[1000px] mx-auto relative z-10">
        
        {/* Minimal Section Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-16">
          <div className={`inline-flex items-center justify-center gap-3 px-5 py-2.5 rounded-full mb-8 transition-colors duration-700 ${theme === 'dark' ? 'bg-white/5 border border-white/10 text-zinc-300' : 'bg-black/5 border border-black/10 text-zinc-600'} text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em]`}>
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
             </span>
             Selected Works
          </div>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Projects that blend <span className="italic font-display text-blue-500">form</span> and <span className="italic font-display text-blue-500">function</span>.
          </h2>
          <p className={`text-base md:text-lg max-w-2xl leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
             A curated selection of my latest work, spanning web development, custom applications, and digital experiences designed to be simple, unique, and attractive.
          </p>
        </div>

        {/* Project List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-10 lg:gap-x-12 md:gap-y-14 lg:gap-y-16">
          {projects.map((project, idx: number) => (
            <ProjectCard key={project.id} project={project} theme={theme} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};



export const BlogHighlights = ({ theme }: { theme: 'dark' | 'light' }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className={`py-32 md:py-40 px-4 md:px-8 lg:px-16 transition-colors duration-700 relative overflow-hidden `} id="blog">
      {/* Decorative gradient blur */}
      <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] opacity-10 pointer-events-none ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'}`} />

      <div className="max-w-[1280px] mx-auto relative z-10 flex flex-col items-center">
        <div className={`inline-flex items-center justify-center gap-3 px-4 py-2 rounded-full mb-6 transition-colors duration-700 ${theme === 'dark' ? 'bg-white/5 border border-white/10 text-blue-500' : 'bg-blue-500/10 border border-blue-500/20 text-blue-600'} text-[12px] font-bold uppercase tracking-wider`}>
           Our Blog
        </div>
        <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight leading-[1.1] mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          Insights & <span className="text-blue-500">Ideas</span>
        </h2>
        <p className={`text-lg md:text-xl font-medium max-w-2xl leading-relaxed text-center mb-12 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Stay updated with the latest trends, tips, and insights from our team of digital experts.
        </p>

        {/* Inputs / Filters row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full mb-10 max-w-4xl">
           <div className="relative w-full md:w-96">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
             <input type="text" placeholder="Search blogs..." className={`w-full pl-10 pr-4 py-3 rounded-full outline-none font-medium text-sm transition-all border ${theme === 'dark' ? 'bg-[#151515] border-white/10 text-white placeholder-zinc-500 focus:border-blue-500 focus:bg-[#1a1a1a]' : 'bg-transparent border-black/10 text-black placeholder-zinc-400 focus:border-blue-500'}`} />
           </div>
           
           <div className={`flex items-center justify-between w-full md:w-auto gap-2 px-5 py-3 rounded-full border cursor-pointer text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-[#151515] border-white/10 text-zinc-300 hover:bg-[#1a1a1a]' : 'bg-transparent border-black/10 text-zinc-700 hover:bg-black/5'}`}>
              <div className="flex items-center gap-2">
                <ArrowDownUp className="w-4 h-4" />
                <span>Newest</span>
              </div>
              <ChevronDown className="w-4 h-4 ml-6" />
           </div>

           <div className={`flex items-center gap-2 px-5 py-3 rounded-full border cursor-pointer text-sm font-medium transition-colors  ${theme === 'dark' ? 'bg-[#151515] border-white/10 text-zinc-300 hover:bg-[#1a1a1a]' : 'bg-transparent border-black/10 text-zinc-700 hover:bg-black/5'}`}>
              <Calendar className="w-4 h-4" />
              <span>From date</span>
           </div>

           <div className={`flex items-center gap-2 px-5 py-3 rounded-full border cursor-pointer text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-[#151515] border-white/10 text-zinc-300 hover:bg-[#1a1a1a]' : 'bg-transparent border-black/10 text-zinc-700 hover:bg-black/5'}`}>
              <Calendar className="w-4 h-4" />
              <span>To date</span>
           </div>
        </div>

        {/* Categories Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-4xl mb-16">
          {['All', 'Design', 'Strategy', 'Engineering', 'Technology', 'Development', 'Digital Marketing', 'Branding'].map((cat, i) => (
            <button key={cat} className={`px-5 py-2.5 rounded-full text-[13px] font-bold tracking-wide transition-all border ${i === 0 ? 'bg-blue-600 border-blue-600 text-white' : (theme === 'dark' ? 'bg-transparent border-white/20 text-zinc-300 hover:border-white/50' : 'bg-transparent border-black/20 text-zinc-700 hover:border-black/50')}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-24 md:mb-32">
           <AnimatePresence mode="popLayout">
             {blogPosts.map((post, idx) => {
               return (
               <motion.div 
                 key={post.id}
                 layout
                 initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                 animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                 exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                 transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                 onMouseEnter={() => setHoveredIdx(idx)}
                 onMouseLeave={() => setHoveredIdx(null)}
                 className="flex flex-col h-full col-span-1"
               >
               <Link 
                 to={`/blog/${post.id}`}
                 className={`group cursor-pointer flex flex-col h-full rounded-[1.5rem] p-4 transition-all duration-300 border ${
                   theme === 'dark' 
                     ? 'bg-[#0a0a0a] border-white/5 hover:bg-[#121212] hover:border-white/10' 
                     : 'bg-white border-black/5 hover:border-black/10 hover:shadow-xl hover:shadow-black/5'
                 }`}
               >
                 <div className={`relative overflow-hidden rounded-[1rem] w-full aspect-[16/10] bg-zinc-100 dark:bg-[#151515] shrink-0 mb-5`}>
                   <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   <div className={`absolute top-4 left-4 inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide backdrop-blur-md ${theme === 'dark' ? 'bg-black/50 text-white' : 'bg-white/90 text-black shadow-sm'}`}>
                      {post.cat}
                   </div>
                 </div>

                 <div className={`flex flex-col flex-1 px-1`}>
                   <h3 className={`text-[20px] font-bold font-display tracking-tight leading-[1.3] transition-colors duration-300 mb-3 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {post.title}
                   </h3>
                   
                   <p className={`text-[15px] leading-relaxed line-clamp-2 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'} mb-6`}>
                      {post.desc}
                   </p>
                 
                   <div className="mt-auto flex flex-col gap-4">
                     <div className={`flex items-center justify-between text-[13px] pb-4 border-b ${theme === 'dark' ? 'text-zinc-400 border-white/5' : 'text-zinc-500 border-black/5'}`}>
                       <div className="flex items-center gap-2">
                         <User className="w-4 h-4" />
                         <span>Apifel Team</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <Calendar className="w-4 h-4" />
                         <span>{post.date}</span>
                       </div>
                     </div>
                     <div className={`flex items-center justify-between text-[13px] font-medium ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}>
                       <div className="flex items-center gap-2">
                         <Clock className="w-4 h-4" />
                         <span>{post.readTime}</span>
                       </div>
                       <div className={`flex items-center gap-1 font-bold group-hover:text-blue-500 transition-colors`}>
                         Read More <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                       </div>
                     </div>
                   </div>
                 </div>
               </Link>
             </motion.div>
           )})}
           </AnimatePresence>
        </div>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-center gap-2 mb-24 md:mb-32">
          <button className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${theme === 'dark' ? 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/5' : 'border-black/10 text-zinc-500 hover:text-black hover:bg-black/5'}`}><ChevronDown className="w-4 h-4 rotate-90" /></button>
          <button className={`w-10 h-10 flex items-center justify-center rounded-full font-bold bg-blue-600 text-white`}>1</button>
          <button className={`w-10 h-10 flex items-center justify-center rounded-full border font-bold transition-colors ${theme === 'dark' ? 'border-white/10 text-zinc-400 hover:bg-white/5' : 'border-black/10 text-zinc-500 hover:bg-black/5'}`}>2</button>
          <button className={`w-10 h-10 flex items-center justify-center rounded-full border font-bold transition-colors ${theme === 'dark' ? 'border-white/10 text-zinc-400 hover:bg-white/5' : 'border-black/10 text-zinc-500 hover:bg-black/5'}`}>3</button>
          <button className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${theme === 'dark' ? 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/5' : 'border-black/10 text-zinc-500 hover:text-black hover:bg-black/5'}`}><ChevronDown className="w-4 h-4 -rotate-90" /></button>
        </div>
        
      </div>
    </section>
  );
};

export const Contact = ({ theme }: { theme: 'dark' | 'light' }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsSubmitted(true);
    }
  };

  return (
    <section 
      className={`min-h-screen py-24 flex flex-col items-center justify-center relative ${theme === 'dark' ? 'text-white' : 'text-black'} transition-colors duration-700`} 
      id="contact"
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 px-4">
          <div className="flex items-center gap-3 mb-6">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              <Mail className="w-4 h-4" />
            </div>
            <span className={`font-mono text-xs uppercase tracking-[0.2em] font-bold ${theme === 'dark' ? 'text-blue-500' : 'text-blue-600'}`}>Contact</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tight mb-4">
            Get In Touch
          </h2>
          <p className={`text-lg md:text-xl font-medium max-w-xl ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Have a project in mind or want to explore a collaboration? Let's talk.
          </p>
        </div>

        {/* Two Columns Container */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 w-full mb-12">
          
          {/* Left Column - Contact Info */}
          <div className="w-full lg:w-[45%] flex flex-col justify-between">
            <div>
               <h3 className="text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] font-display font-medium tracking-tight mb-8">
                 Let's start a <br/> <span className="text-blue-500 italic">conversation</span>
               </h3>
               
               <div className="flex flex-col gap-10 mt-16 md:mt-24">
                 <div className="group flex gap-6 items-start">
                    <div className={`mt-1 flex-shrink-0 w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 ${theme === 'dark' ? 'bg-[#111] border-white/10 text-white group-hover:bg-blue-500 group-hover:border-blue-500' : 'bg-white border-black/10 text-black group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'}`}>
                      <Mail className="w-5 h-5 transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex flex-col justify-center min-h-[3.5rem]">
                      <h5 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Email</h5>
                      <a href="mailto:jahidmail2020@gmail.com" className="text-xl font-medium hover:text-blue-500 transition-colors">jahidmail2020@gmail.com</a>
                    </div>
                 </div>

                 <div className="group flex gap-6 items-start">
                    <div className={`mt-1 flex-shrink-0 w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 ${theme === 'dark' ? 'bg-[#111] border-white/10 text-white group-hover:bg-blue-500 group-hover:border-blue-500' : 'bg-white border-black/10 text-black group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'}`}>
                      <Phone className="w-5 h-5 transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex flex-col justify-center min-h-[3.5rem]">
                      <h5 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Phone</h5>
                      <a href="tel:+8801234567890" className="text-xl font-medium hover:text-blue-500 transition-colors">+880 1234 567890</a>
                    </div>
                 </div>

                 <div className="group flex gap-6 items-start">
                    <div className={`mt-1 flex-shrink-0 w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 ${theme === 'dark' ? 'bg-[#111] border-white/10 text-white group-hover:bg-blue-500 group-hover:border-blue-500' : 'bg-white border-black/10 text-black group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'}`}>
                      <MapPin className="w-5 h-5 transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex flex-col justify-center min-h-[3.5rem]">
                      <h5 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Location</h5>
                      <span className="text-xl font-medium">Dhaka, Bangladesh</span>
                    </div>
                 </div>
               </div>
            </div>

            <div className={`w-full h-[1px] my-12 max-w-[200px] ${theme === 'dark' ? 'bg-gradient-to-r from-white/10 to-transparent' : 'bg-gradient-to-r from-black/10 to-transparent'}`}></div>

            <div className="flex items-center gap-4">
              <a href="#" className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 hover:-translate-y-1 ${theme === 'dark' ? 'border-white/10 text-zinc-400 hover:bg-white hover:text-black hover:border-white' : 'border-black/10 text-zinc-500 hover:bg-black hover:text-white hover:border-black'}`}>
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 hover:-translate-y-1 ${theme === 'dark' ? 'border-white/10 text-zinc-400 hover:bg-white hover:text-black hover:border-white' : 'border-black/10 text-zinc-500 hover:bg-black hover:text-white hover:border-black'}`}>
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 hover:-translate-y-1 ${theme === 'dark' ? 'border-white/10 text-zinc-400 hover:bg-white hover:text-black hover:border-white' : 'border-black/10 text-zinc-500 hover:bg-black hover:text-white hover:border-black'}`}>
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Column - Form Container */}
          <div className="w-full lg:w-[55%]">
            {!isSubmitted ? (
               <div className={`p-8 sm:p-12 lg:p-16 rounded-[2.5rem] relative overflow-hidden ${theme === 'dark' ? 'bg-[#111] shadow-2xl' : 'bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/[0.03]'}`}>
                 {/* Decorative background element */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                 
                 <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10 w-full mt-4">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex flex-col gap-2.5 w-full">
                        <label className={`text-[11px] font-bold uppercase tracking-[0.2em] pl-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Name</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder="John Doe"
                          className={`w-full rounded-2xl px-5 py-4 text-base outline-none transition-all duration-300 ${theme === 'dark' ? 'bg-[#151515] border border-white/10 hover:border-white/20 focus:border-blue-500 focus:bg-[#1a1a1a] text-white placeholder:text-zinc-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]' : 'bg-zinc-50/50 border border-black/10 hover:border-black/20 focus:border-blue-600 focus:bg-white text-black placeholder:text-zinc-400 focus:shadow-[0_0_40px_-10px_rgba(37,99,235,0.15)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]'}`}
                        />
                      </div>
                      <div className="flex flex-col gap-2.5 w-full">
                        <label className={`text-[11px] font-bold uppercase tracking-[0.2em] pl-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Email</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="john@example.com"
                          className={`w-full rounded-2xl px-5 py-4 text-base outline-none transition-all duration-300 ${theme === 'dark' ? 'bg-[#151515] border border-white/10 hover:border-white/20 focus:border-blue-500 focus:bg-[#1a1a1a] text-white placeholder:text-zinc-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]' : 'bg-zinc-50/50 border border-black/10 hover:border-black/20 focus:border-blue-600 focus:bg-white text-black placeholder:text-zinc-400 focus:shadow-[0_0_40px_-10px_rgba(37,99,235,0.15)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]'}`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2.5 w-full">
                      <label className={`text-[11px] font-bold uppercase tracking-[0.2em] pl-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Subject</label>
                      <input 
                        type="text" 
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        placeholder="Web Design Project"
                        className={`w-full rounded-2xl px-5 py-4 text-base outline-none transition-all duration-300 ${theme === 'dark' ? 'bg-[#151515] border border-white/10 hover:border-white/20 focus:border-blue-500 focus:bg-[#1a1a1a] text-white placeholder:text-zinc-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]' : 'bg-zinc-50/50 border border-black/10 hover:border-black/20 focus:border-blue-600 focus:bg-white text-black placeholder:text-zinc-400 focus:shadow-[0_0_40px_-10px_rgba(37,99,235,0.15)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]'}`}
                      />
                    </div>
                    <div className="flex flex-col gap-2.5 w-full">
                      <label className={`text-[11px] font-bold uppercase tracking-[0.2em] pl-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Message</label>
                      <textarea 
                        required
                        rows={4}
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        placeholder="Tell me about your project..."
                        className={`w-full rounded-2xl px-5 py-5 text-base outline-none transition-all duration-300 resize-none ${theme === 'dark' ? 'bg-[#151515] border border-white/10 hover:border-white/20 focus:border-blue-500 focus:bg-[#1a1a1a] text-white placeholder:text-zinc-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]' : 'bg-zinc-50/50 border border-black/10 hover:border-black/20 focus:border-blue-600 focus:bg-white text-black placeholder:text-zinc-400 focus:shadow-[0_0_40px_-10px_rgba(37,99,235,0.15)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]'}`}
                      />
                    </div>
                    <div className="mt-4 flex flex-col items-center gap-6">
                       <button 
                         type="submit" 
                         className="group relative w-full flex items-center justify-end p-2 rounded-full overflow-hidden bg-blue-600 text-white transition-all duration-300 hover:bg-blue-500 focus:ring-4 focus:ring-blue-500/20 active:scale-95 shadow-[0_10px_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_50px_-10px_rgba(37,99,235,0.6)]"
                       >
                         <span className="absolute left-1/2 -translate-x-1/2 text-[15px] font-bold uppercase tracking-[0.1em]">Send Message</span>
                         <span className="w-12 h-12 shrink-0 rounded-full bg-white/20 flex items-center justify-center transition-colors duration-500 group-hover:bg-white group-hover:text-blue-600 relative z-10 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                           <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500 group-hover:translate-x-0.5" />
                         </span>
                       </button>
                    </div>
                 </form>
               </div>
            ) : (
              <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className={`flex flex-col items-center justify-center text-center h-full min-h-[500px] rounded-[2.5rem] ${theme === 'dark' ? 'bg-[#111111] shadow-2xl border border-white/5' : 'bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5'}`}
              >
                 <div className="w-24 h-24 mb-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/10">
                   <Check className="w-10 h-10" />
                 </div>
                 <h3 className={`text-4xl md:text-5xl font-display font-medium tracking-tight mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Message Sent</h3>
                 <p className={`text-xl max-w-sm ml-auto mr-auto font-light leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                   Thanks <span className="text-blue-500 font-medium">{formData.name.split(' ')[0]}</span>. I will get back to you within 24 hours.
                 </p>
                 <button onClick={() => setIsSubmitted(false)} className={`mt-12 font-bold tracking-widest text-[11px] uppercase underline underline-offset-8 transition-colors ${theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}>
                   Send another message
                 </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className={`mt-16 w-full h-[350px] md:h-[450px] rounded-[2rem] overflow-hidden border filter transition-all duration-700 ${theme === 'dark' ? 'border-white/5 shadow-2xl grayscale-[0.8] hover:grayscale-0' : 'border-black/5 shadow-xl grayscale-[0.3] hover:grayscale-0'}`}>
          <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14611.3963402434!2d90.39572979207865!3d23.71711200427387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8e99e28cfa3%3A0xc3dc15904fc498a4!2sKeraniganj%20Upazila!5e0!3m2!1sen!2sbd!4v1716654271830!5m2!1sen!2sbd" 
             width="100%" 
             height="100%" 
             style={{border:0}} 
             allowFullScreen 
             loading="lazy" 
             referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

export const Footer = ({ theme }: { theme: 'dark' | 'light' }) => {
  const isDark = theme === 'dark';
  const [isRevealed, setIsRevealed] = useState(false);
  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => getSiteSettings(),
    staleTime: 60_000,
  });
  const footerSettings = (settings?.footer ?? {}) as {
    newsletter_enabled?: boolean;
    newsletter_title?: string;
    newsletter_desc?: string;
  };
  const newsletterEnabled = footerSettings.newsletter_enabled !== false;
  const newsletterTitle = footerSettings.newsletter_title || 'Stay in the Loop';
  const newsletterDesc =
    footerSettings.newsletter_desc ||
    'Get the latest insights, trends, and updates delivered to your inbox.';

  useEffect(() => {
    // Fallback timer to ensure overflow-visible is set even if viewport observers are delayed
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Staggered letters intro variant definitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.15,
      },
    },
  };

  const letterVariants = {
    hidden: { 
      y: "115%",
      opacity: 0,
      scaleY: 1.25,
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scaleY: 1,
      transition: { 
        duration: 0.85, 
        ease: [0.16, 1, 0.3, 1] as const
      } 
    }
  };

  return (
    <footer id="portfolio-footer" className={`relative pt-16 pb-12 px-6 md:px-12 lg:px-24 border-t transition-colors duration-500 overflow-x-hidden overflow-y-visible ${isDark ? 'border-white/5 text-zinc-100' : 'border-black/5 text-zinc-950'}`}>
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-10">

        {/* Newsletter — admin-toggleable, shown at the top of the footer only */}
        {newsletterEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`w-full max-w-5xl mx-auto rounded-[2rem] p-10 md:p-14 lg:p-16 relative overflow-hidden flex flex-col items-center gap-8 ${isDark ? 'bg-[#0a0a0a] border border-white/5' : 'bg-black'} shadow-2xl`}
          >
            <div className="flex-1 max-w-2xl z-10 text-center">
              <h3 className="text-3xl md:text-4xl font-bold font-display tracking-tight mb-4 text-white">
                {newsletterTitle}
              </h3>
              <p className="text-[17px] text-zinc-400">{newsletterDesc}</p>
            </div>
            <form className="w-full max-w-xl z-10 flex flex-col sm:flex-row gap-3 pt-2" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full px-6 py-4 rounded-xl outline-none font-medium transition-all border ${isDark ? 'bg-[#151515] border-white/5 text-white placeholder-zinc-500 focus:border-blue-500' : 'bg-white border-black/5 text-black placeholder-zinc-400 focus:border-blue-500'}`}
                />
              </div>
              <button type="submit" className="px-8 py-4 flex items-center justify-center gap-2 rounded-xl text-[15px] font-bold transition-all hover:bg-blue-700 active:scale-95 shrink-0 bg-blue-600 text-white">
                <Send className="w-4 h-4" /> Subscribe
              </button>
            </form>
          </motion.div>
        )}

        {/* Massive Name Typography with stagger-reveal kinetic typography mask & bouncy individual interactions */}
        <div className={`w-full relative py-8 select-none ${isRevealed ? 'overflow-visible' : 'overflow-hidden'}`}>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            onViewportEnter={() => {
              // Smoothly lift the overflow restriction once the reveal intro completes
              setTimeout(() => {
                setIsRevealed(true);
              }, 1200);
            }}
            viewport={{ once: true, margin: "-80px" }}
            className={`text-[11.5vw] sm:text-[12vw] lg:text-[12.5vw] leading-[0.85] font-black font-display uppercase tracking-[-0.04em] w-full text-center whitespace-nowrap transition-colors ${isDark ? 'text-white' : 'text-zinc-950'} flex justify-center items-center ${isRevealed ? 'overflow-visible' : 'overflow-hidden'}`}
          >
            {"JAHID HASAN".split("").map((char, index) => (
              <span key={index} className={`inline-block py-6 -my-6 ${isRevealed ? 'overflow-visible' : 'overflow-hidden'}`}>
                <motion.span
                  variants={letterVariants}
                  className="inline-block transition-colors duration-300 cursor-default"
                  whileHover={{ 
                    y: -14, 
                    scale: 1.08, 
                    color: '#3b82f6',
                    textShadow: isDark 
                      ? '0 0 25px rgba(59, 130, 246, 0.45)' 
                      : '0 0 20px rgba(59, 130, 246, 0.25)',
                    transition: { type: 'spring', stiffness: 450, damping: 14 }
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Dynamic sweeping Separator Line */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={{ originX: 0 }}
          className={`w-full border-t ${isDark ? 'border-white/10' : 'border-black/10'}`} 
        />

        {/* Bottom copyright & link bar with micro-interactive animations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 w-full text-[13px] md:text-[14px] font-display font-normal tracking-[0.02em] normal-case"
        >
          {/* Left copyright with hover pulse */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${isDark ? 'text-zinc-400' : 'text-zinc-500'} cursor-default select-none transition-colors duration-300`}
          >
            © {new Date().getFullYear()} JAHID HASAN. CRAFTED WITH SOUL.
          </motion.div>

          {/* Right items: Links & Magnetic Up button */}
          <div className="flex items-center gap-6 sm:gap-8 flex-wrap justify-center md:justify-end">
            <div className={`flex items-center gap-6 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
               <Link to="/privacy" className={`relative py-1 transition-colors duration-300 ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'} group`}>
                 PRIVACY POLICY
                 <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#3b82f6] transition-all duration-300 group-hover:w-full`} />
               </Link>
               <Link to="/terms" className={`relative py-1 transition-colors duration-300 ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'} group`}>
                 TERMS OF SERVICE
                 <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#3b82f6] transition-all duration-300 group-hover:w-full`} />
               </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </footer>
  );
};

const MinimalContactForm = ({ theme }: { theme: 'dark' | 'light' }) => {
  return (
    <section className={`py-24 md:py-32 px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center border-t relative overflow-hidden ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent ${theme === 'dark' ? 'via-white/10' : 'via-black/10'} to-transparent`} />
        <div className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-500/5'}`} />
      </div>


      <div className="max-w-4xl w-full text-center relative z-10 flex flex-col items-center">
        <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black font-display uppercase tracking-tighter leading-[0.9] mb-12 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          Have an idea? <br/>
          <span className={`${theme === 'dark' ? 'text-zinc-700' : 'text-zinc-300'}`}>Let's connect.</span>
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-20 w-full mt-4">
           <a href="mailto:hello@jahid.com" className={`text-base sm:text-xl md:text-2xl font-mono break-all ${theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black'} transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-current after:origin-right hover:after:origin-left hover:after:scale-x-0 after:transition-transform after:duration-300`}>
             hello@jahid.com
           </a>
           <div className={`hidden md:block w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-zinc-700' : 'bg-zinc-300'}`}></div>
           <a href="tel:+880123456789" className={`text-base sm:text-xl md:text-2xl font-mono ${theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black'} transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-current after:origin-right hover:after:origin-left hover:after:scale-x-0 after:transition-transform after:duration-300`}>
             +880 123 456 789
           </a>
        </div>

        <div className={`w-full max-w-2xl text-left p-6 sm:p-10 md:p-14 rounded-2xl sm:rounded-[2rem] border shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-zinc-900 border-white/5 shadow-black/50' : 'bg-white border-black/5 shadow-zinc-200/50'}`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <form className="flex flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-3 group">
                <label className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-colors group-focus-within:text-blue-500 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className={`w-full bg-transparent border-b outline-none pb-4 text-sm font-medium transition-colors ${theme === 'dark' ? 'border-white/10 text-white placeholder-white/20 focus:border-blue-500' : 'border-black/10 text-black placeholder-black/20 focus:border-blue-600'}`}
                />
              </div>
              <div className="flex flex-col gap-3 group">
                <label className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-colors group-focus-within:text-blue-500 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Email</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className={`w-full bg-transparent border-b outline-none pb-4 text-sm font-medium transition-colors ${theme === 'dark' ? 'border-white/10 text-white placeholder-white/20 focus:border-blue-500' : 'border-black/10 text-black placeholder-black/20 focus:border-blue-600'}`}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 group">
              <label className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-colors group-focus-within:text-blue-500 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Subject</label>
              <input 
                type="text" 
                placeholder="What is this regarding?" 
                className={`w-full bg-transparent border-b outline-none pb-4 text-sm font-medium transition-colors ${theme === 'dark' ? 'border-white/10 text-white placeholder-white/20 focus:border-blue-500' : 'border-black/10 text-black placeholder-black/20 focus:border-blue-600'}`}
              />
            </div>
            <div className="flex flex-col gap-3 group">
              <label className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-colors group-focus-within:text-blue-500 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Message</label>
              <textarea 
                placeholder="Tell me about your project..." 
                rows={4}
                className={`w-full bg-transparent border-b outline-none pb-4 text-sm font-medium resize-none transition-colors ${theme === 'dark' ? 'border-white/10 text-white placeholder-white/20 focus:border-blue-500' : 'border-black/10 text-black placeholder-black/20 focus:border-blue-600'}`}
              ></textarea>
            </div>
            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-8">
                {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                   <a href="#" key={social} className={`text-[11px] font-mono font-bold uppercase tracking-[0.1em] ${theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'} transition-colors`}>{social}</a>
                ))}
              </div>
              <button className={`px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] ${theme === 'dark' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'} transition-transform hover:scale-105 active:scale-95`}>
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const MinimalHero = ({ theme }: { theme: 'dark' | 'light' }) => {
  const isDark = theme === 'dark';
  const ease = [0.16, 1, 0.3, 1] as const;

  const bg = isDark ? 'bg-[#050505]' : 'bg-[#fafaf7]';
  const text = isDark ? 'text-white' : 'text-black';
  const textHover = isDark ? 'hover:text-white' : 'hover:text-black';
  const muted = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const dim = isDark ? 'text-zinc-500' : 'text-zinc-500';
  const accent = isDark ? 'text-blue-500' : 'text-blue-600';
  const cardBg = isDark ? 'bg-[#080808]' : 'bg-white';
  const cardHover = isDark ? 'hover:bg-zinc-900/40' : 'hover:bg-black/[0.03]';
  const border = isDark ? 'border-zinc-800/60' : 'border-black/[0.08]';
  const divider = isDark ? 'border-zinc-800/50' : 'border-black/[0.08]';
  const statsShell = isDark ? 'bg-zinc-800/30' : 'bg-black/[0.06]';
  const gridLines = isDark
    ? 'bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]'
    : 'bg-[linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)]';
  const blob1 = isDark ? 'bg-blue-600/15' : 'bg-blue-500/15';
  const blob2 = isDark ? 'bg-indigo-600/12' : 'bg-indigo-500/12';

  return (
    <section className={`relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden ${bg} ${text} transition-colors duration-500`}>
      {/* Atmospheric background */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-30%] left-[-25%] w-[55%] h-[55%] ${blob1} blur-[160px] rounded-full`} />
        <div className={`absolute inset-0 ${gridLines} bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)]`} />
      </div>

      <div className="relative z-10 max-w-6xl w-full px-6 py-24 md:py-28 flex flex-col items-center text-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${isDark ? 'bg-zinc-900/40' : 'bg-white/70'} border ${border} backdrop-blur-xl mb-10`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
          </span>
          <span className={`h-3.5 w-px ${isDark ? 'bg-zinc-700' : 'bg-black/20'}`} />
          <span className={`text-[10px] font-mono uppercase tracking-[0.28em] ${muted}`}>
            Available for collaboration
          </span>
        </motion.div>

        {/* Identity */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
          className={`${accent} font-bold tracking-[0.35em] uppercase text-[10px] mb-5`}
        >
          Jahid Hasan
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.25 }}
          className="font-display font-black tracking-[-0.02em] leading-[1.05] text-[2.25rem] sm:text-[3.25rem] md:text-[4.5rem] lg:text-[5.5rem] mb-8"
        >
          <span className="block">High-End Digital</span>
          <span
            className="block italic font-light text-transparent bg-clip-text pb-[0.15em] pr-[0.1em]"
            style={{
              backgroundImage: isDark
                ? 'linear-gradient(to bottom, #ffffff 0%, #d4d4d8 55%, #52525b 100%)'
                : 'linear-gradient(to bottom, #0a0a0a 0%, #27272a 50%, #71717a 100%)',
              fontFamily: 'Georgia, serif',
            }}
          >
            Craft &amp; Engineering.
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.4 }}
          className={`max-w-lg text-sm md:text-base leading-relaxed mb-10 font-light ${muted}`}
        >
          Multidisciplinary <span className={isDark ? 'text-zinc-100' : 'text-black'}>Graphic Designer</span> &amp;{' '}
          <span className={isDark ? 'text-zinc-100' : 'text-black'}>Web Developer</span> based in Dhaka.
          Shaping premium digital identities for over six years.
        </motion.p>

        {/* Stats dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.55 }}
          className={`w-full max-w-2xl grid grid-cols-3 gap-0.5 ${statsShell} border ${border} rounded-2xl overflow-hidden mb-14 backdrop-blur-sm`}
        >
          {[
            { value: '06+', label: 'Years Exp' },
            { value: '120+', label: 'Projects' },
            { value: 'Dhaka', label: 'Location' },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`group flex flex-col items-center justify-center py-7 px-4 ${cardBg} ${cardHover} transition-colors duration-500 ${i === 1 ? `border-x ${divider}` : ''}`}
            >
              <span className="text-xl md:text-2xl font-display font-bold mb-1 transition-transform duration-500 group-hover:scale-110">
                {s.value}
              </span>
              <span className={`text-[10px] uppercase tracking-[0.2em] font-medium ${dim}`}>{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          <Link to="/work" className="group relative">
            <span className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-30 group-hover:opacity-80 transition duration-700" />
            <span
              className={`relative inline-flex items-center gap-3 px-9 py-4 rounded-full font-semibold transition-all duration-300 group-hover:-translate-y-0.5 ${
                isDark ? 'bg-white text-black' : 'bg-black text-white'
              }`}
            >
              <span className="text-sm">View Projects</span>
              <span className="inline-block transition-transform duration-300 group-hover:rotate-45">→</span>
            </span>
          </Link>

          <Link to="/contact" className={`group flex items-center gap-3 ${dim} ${textHover} transition-colors`}>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em]">Start a Conversation</span>
            <span className={`block w-8 h-px ${isDark ? 'bg-zinc-700' : 'bg-black/30'} transition-all duration-500 group-hover:w-14 group-hover:bg-blue-500`} />
          </Link>
        </motion.div>
      </div>

    </section>
  );
};


const MinimalWork = ({ theme }: { theme: 'dark' | 'light' }) => {
  const isDark = theme === 'dark';
  const works = sharedProjects.slice(0, 4).map((p) => ({
    name: p.title,
    role: `${p.cat}`,
    year: p.year,
    image: p.image,
    tag: p.id,
    slug: p.slug,
  }));
  const hairline = isDark ? 'bg-white/10' : 'bg-black/10';

  return (
    <section className={`px-6 md:px-12 lg:px-20 py-20 md:py-24 `}>
      <div className="max-w-[1180px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-5">
              <span className={`h-px w-10 ${hairline}`} />
              <span className={`text-[10px] font-mono uppercase tracking-[0.35em] ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Selected Work — 2023 / 2024
              </span>
            </div>
            <h2 className={`font-display font-medium tracking-[-0.04em] leading-[1.02] text-3xl md:text-4xl lg:text-[2.75rem] ${isDark ? 'text-white' : 'text-black'}`}>
              Work made with{' '}
              <span className="italic font-light" style={{ fontFamily: 'Georgia, serif' }}>care</span>
              <span className="text-blue-500">.</span>
            </h2>
          </div>
          <Link
            to="/work"
            className={`group flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] font-medium border rounded-full px-5 py-3 transition-all ${
              isDark
                ? 'border-white/15 text-zinc-300 hover:bg-white hover:text-black hover:border-white'
                : 'border-black/15 text-zinc-700 hover:bg-black hover:text-white hover:border-black'
            }`}
          >
            View Archive
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
          {works.map((work, i) => {
            return (
              <Link to={`/work/${work.slug}`} key={i} className="group flex flex-col">
                <div className={`relative w-full aspect-[16/11] overflow-hidden rounded-xl mb-3 border ${isDark ? 'border-white/5 bg-zinc-900' : 'border-black/5 bg-zinc-100'}`}>
                  <img
                    src={work.image}
                    alt={work.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04] grayscale-[0.15] group-hover:grayscale-0"
                  />
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDark ? 'bg-black/15' : 'bg-black/8'}`} />
                  <div className="absolute bottom-4 right-4 flex items-center justify-center w-11 h-11 rounded-full bg-white/95 backdrop-blur text-black opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-xl">
                    <span className="text-base">↗</span>
                  </div>
                </div>
                <div className="flex justify-between items-baseline px-1 gap-4">
                  <h3 className={`text-base lg:text-lg font-display font-medium tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                    {work.name}
                  </h3>
                  <span className={`text-[10px] font-mono uppercase tracking-[0.25em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'} whitespace-nowrap`}>
                    {work.year}
                  </span>
                </div>
                <div className={`px-1 mt-0.5 text-[10px] font-mono uppercase tracking-[0.2em] ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  {work.role}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const MinimalBlog = ({ theme }: { theme: 'dark' | 'light' }) => {
  const isDark = theme === 'dark';
  const hairline = isDark ? 'bg-white/10' : 'bg-black/10';
  const posts = blogPosts.slice(0, 3);

  return (
    <section className={`px-6 md:px-12 lg:px-20 py-20 md:py-24 `}>
      <div className="max-w-[1180px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-5">
              <span className={`h-px w-10 ${hairline}`} />
              <span className={`text-[10px] font-mono uppercase tracking-[0.35em] ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Journal — Notes & Essays
              </span>
            </div>
            <h2 className={`font-display font-medium tracking-[-0.04em] leading-[1.02] text-3xl md:text-4xl lg:text-[2.75rem] ${isDark ? 'text-white' : 'text-black'}`}>
              Writing on{' '}
              <span className="italic font-light" style={{ fontFamily: 'Georgia, serif' }}>craft</span>
              <span className="text-blue-500">.</span>
            </h2>
          </div>
          <Link
            to="/blog"
            className={`group flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] font-medium border rounded-full px-5 py-3 transition-all ${
              isDark
                ? 'border-white/15 text-zinc-300 hover:bg-white hover:text-black hover:border-white'
                : 'border-black/15 text-zinc-700 hover:bg-black hover:text-white hover:border-black'
            }`}
          >
            All Writing
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {/* Compact 3-up: small thumbnail cards in a tight row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className={`group relative flex flex-col rounded-xl overflow-hidden border transition-all ${
                isDark
                  ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
                  : 'border-black/10 bg-white hover:border-black/30 hover:shadow-lg'
              }`}
            >
              <div className="relative overflow-hidden aspect-[16/10]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/60' : 'from-black/40'} via-transparent to-transparent`} />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-black text-[9px] font-mono uppercase tracking-[0.25em]">
                  {post.cat}
                </span>
              </div>

              <div className="flex flex-col gap-2 p-4">
                <h3 className={`font-display font-medium tracking-[-0.01em] leading-snug text-base md:text-[17px] line-clamp-2 transition-colors ${
                  isDark ? 'text-white group-hover:text-blue-300' : 'text-black group-hover:text-blue-600'
                }`}>
                  {post.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const MarqueeStrip = ({ theme }: { theme: 'dark' | 'light' }) => {
  const items = ['Web Development', 'UI/UX Design', 'Brand Systems', 'Framer Motion', 'Next.js', 'WordPress', 'Tailwind CSS', 'Design Engineering'];
  const row = [...items, ...items, ...items];
  return (
    <section className={`relative py-10 md:py-14 border-y overflow-hidden ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`}>
      <div className="flex animate-marquee whitespace-nowrap will-change-transform">
        {row.map((item, i) => (
          <div key={i} className="flex items-center gap-10 px-8">
            <span className={`text-3xl md:text-5xl font-black font-display uppercase tracking-tighter ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`}>
              {item}
            </span>
            <span className="text-blue-500 text-2xl md:text-4xl">✦</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export const HomePage = ({ theme }: { theme: 'dark' | 'light' }) => {
  return (
    <>
      <MinimalHero theme={theme} />
      <MinimalWork theme={theme} />
      <MinimalBlog theme={theme} />
      <MinimalContactForm theme={theme} />
    </>
  );
};


export const ScrollToTop = ({ theme }: { theme: 'dark' | 'light' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-[100] w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 backdrop-blur-md group ${
            theme === 'dark' 
              ? 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/10 hover:border-white/20' 
              : 'bg-white/80 text-zinc-500 hover:text-black border border-black/10 hover:border-black/20'
          }`}
          aria-label="Scroll to top"
        >
          {/* Scroll Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="48" 
              className={`fill-none stroke-[2] ${theme === 'dark' ? 'stroke-white/5' : 'stroke-black/5'}`} 
            />
            <motion.circle 
              cx="50" 
              cy="50" 
              r="48" 
              style={{ pathLength }}
              className={`fill-none stroke-[2] ${theme === 'dark' ? 'stroke-blue-500' : 'stroke-blue-500'}`} 
              strokeLinecap="round"
            />
          </svg>
          <ArrowUp size={18} strokeWidth={2.5} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
