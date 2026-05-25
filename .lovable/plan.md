## Goal

Replace `wordpress-theme-prompt.md` with a significantly more detailed, build-ready prompt that another AI can use to recreate this entire portfolio as a production WordPress theme — with zero ambiguity on design tokens, data model, admin UX, and feature parity.

## What the new prompt will contain

### 1. Project Overview & Goals
- Exact purpose (personal portfolio for "JAHID."), target audience, tone
- Tech baseline: WordPress 6.5+, PHP 8.1+, MySQL 5.7+/MariaDB 10.3+
- No page builders, no Elementor — hand-coded classic theme with block editor support for posts only

### 2. Design System (1:1 spec)
- **Colors** (light + dark) in HSL with exact values: background, foreground, primary, muted, accent, border, card, popover, destructive — pulled from current `src/styles.css`
- **Typography**: font families, weights, fluid type scale (clamp values), letter-spacing
- **Spacing scale**, **border radius** (2.5rem for cards, 1rem for inputs, etc.)
- **Shadows**, **glassmorphism** recipe (backdrop-filter blur + bg opacity)
- **Motion**: easing curves, durations, scroll-reveal pattern (IntersectionObserver based, no GSAP dependency required)
- Theme toggle stored in `localStorage` + `prefers-color-scheme` fallback
- Responsive breakpoints (sm 640, md 768, lg 1024, xl 1280, 2xl 1536)

### 3. Information Architecture & Routes
Full sitemap with URL, template file, and purpose:
- `/` → `front-page.php` (Hero, Featured Work, About teaser, Latest Blog, CTA)
- `/about` → `page-about.php`
- `/work` → `archive-project.php`
- `/work/{slug}` → `single-project.php`
- `/blog` → `home.php`
- `/blog/{slug}` → `single.php`
- `/contact` → `page-contact.php`
- `/privacy`, `/terms` → `page.php`

### 4. Data Model
- **CPT `project`** with fields: title, slug, excerpt, cover, gallery, year, client, role, tech (taxonomy), live_url, repo_url, overview, challenge, solution, results, seo_title, seo_description, og_image
- **Post (blog)** standard + extra meta: reading_time, seo_title, seo_description, og_image
- **Taxonomies**: `project_tech`, standard `category`/`post_tag`
- **Custom tables**:
  - `wp_jahid_contacts` (id, name, email, subject, message, ip, user_agent, status, created_at)
  - `wp_jahid_newsletter` (id, email, status, confirmed_at, unsubscribe_token, created_at)
  - `wp_jahid_media` (mirrors WP media with tags/folder for admin browser)
- All meta fields registered via `register_post_meta` with `show_in_rest`

### 5. Admin Panel ("Portfolio" top-level menu)
Mirrors the React admin sidebar exactly:
- **Workspace**: Inbox (contacts list/detail, mark read, reply via mailto), Newsletter (subscribers, export CSV), Media Library
- **Content**: Projects, Blog Posts (use native WP screens but restyled)
- **Pages**: Home, About, Work, Blog, Contact, Privacy, Terms — each a settings page editing structured content via Settings API
- **Global**: Header (nav items, logo), Footer (columns, social), SEO defaults, Per-page SEO (the 7 pages above)
- **System**: SMTP (host/port/user/pass/encryption + test send), Demo Data (Import / Clear buttons — idempotent), Theme Options
- Permission: `manage_options` required; nonces on every form

### 6. Frontend Features
- AJAX contact form (`wp_ajax_nopriv_jahid_contact`) with honeypot + rate limit (3/min/IP via transient)
- AJAX newsletter signup with double opt-in email
- Scroll-reveal on cards, marquee for tech stack, parallax hero
- Reading progress bar on single posts
- Related projects / related posts
- Dark/light toggle in header

### 7. SEO Implementation
- Per-page meta via `wp_head` hook reading from settings or post meta
- OpenGraph + Twitter cards
- JSON-LD: `Person` on home, `Article` on posts, `CreativeWork` on projects
- Auto sitemap (use core WP sitemap, extend with CPT)
- `robots.txt` editable from admin

### 8. Email System
- All transactional mail goes through PHPMailer configured by SMTP settings
- Hook `phpmailer_init` to inject creds
- Templates: contact notification (to admin), contact auto-reply, newsletter confirm, newsletter welcome — HTML + plain-text alternative

### 9. Demo Data
- JSON files in `/inc/demo/` with 6 projects, 4 blog posts, page content
- Import = upsert by slug (idempotent), copies sample images from `/assets/demo/` to media library
- Clear = removes only items tagged `_demo` in meta

### 10. File Structure
```text
jahid-theme/
├── style.css                 (theme header)
├── functions.php             (loads /inc/*)
├── front-page.php
├── page.php
├── single.php
├── archive.php
├── single-project.php
├── archive-project.php
├── page-about.php
├── page-contact.php
├── header.php  footer.php  searchform.php  404.php
├── /inc/
│   ├── setup.php             (theme supports, menus)
│   ├── enqueue.php           (assets, fonts)
│   ├── cpt.php               (register project CPT)
│   ├── meta.php              (register_post_meta)
│   ├── tables.php            (dbDelta custom tables)
│   ├── admin/                (one file per admin page)
│   ├── ajax/                 (contact, newsletter handlers)
│   ├── seo.php
│   ├── smtp.php
│   ├── demo/import.php  demo/clear.php  demo/data.json
│   └── helpers.php
├── /assets/
│   ├── css/  js/  fonts/  images/  demo/
└── /templates/parts/         (template parts)
```

### 11. Security & Performance
- Nonces on all forms (`wp_nonce_field` / `check_admin_referer`)
- `sanitize_*` on input, `esc_*` on output, `$wpdb->prepare` on all queries
- Capability checks on every admin action
- Honeypot + transient-based rate limit on public AJAX
- Asset versioning via `filemtime()`, defer non-critical JS, preload fonts, lazy-load images via native `loading="lazy"`
- Translation-ready: text domain `jahid`, `.pot` file in `/languages/`

### 12. Acceptance Checklist
A 20+ item checklist the implementing AI must satisfy before declaring done (Customizer renders, all 7 SEO pages editable, demo import is idempotent, contact form delivers via SMTP, dark mode persists, Lighthouse ≥ 95 on all categories, etc.).

## Deliverable

Overwrite `wordpress-theme-prompt.md` with the above expanded prompt, formatted in clean markdown with code fences for the file tree and a copy of the exact color tokens from `src/styles.css`. No other project files change.