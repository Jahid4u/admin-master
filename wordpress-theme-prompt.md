# Build "JAHID." — A Production WordPress Theme (Detailed Prompt)

You are to recreate an existing React/TanStack Start portfolio as a **production-ready, hand-coded WordPress classic theme** named `jahid-theme`. No page builders. No Elementor. No theme frameworks. The output must be a single theme folder that runs on a stock WordPress install with zero extra plugins required (SMTP, SEO, CPT, custom tables — all built in).

Treat every section below as a hard requirement. When something is ambiguous, follow the closest existing WordPress core convention.

---

## 1. Project overview

- **Name:** JAHID. — personal portfolio of a senior product designer / developer
- **Tone:** Editorial, minimal, dark-first, glassmorphic, slightly futuristic. Apple-like restraint, Awwwards-grade polish
- **Tech baseline:** WordPress 6.5+, PHP 8.1+, MySQL 5.7+ / MariaDB 10.3+
- **No external dependencies** at runtime beyond what ships in `/assets/` (fonts are loaded from Google Fonts via `wp_enqueue_style`)
- **Mobile-first**, fully responsive, accessible (WCAG 2.1 AA), translation-ready (`text-domain: jahid`)

---

## 2. Design system (1:1 with source)

### 2.1 Color tokens

Use CSS custom properties in `:root` for light, `.dark` for dark. Theme toggle adds/removes `.dark` on `<html>` and persists in `localStorage` (`jahid-theme`). Fallback to `prefers-color-scheme`.

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --primary: oklch(0.208 0.042 265.755);
  --primary-foreground: oklch(0.984 0.003 247.858);
  --muted: oklch(0.968 0.007 247.896);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.968 0.007 247.896);
  --border: oklch(0.929 0.013 255.508);
  --ring: oklch(0.704 0.04 256.788);

  --brand-primary:   #3b82f6;
  --brand-secondary: #1d4ed8;
  --brand-accent:    #60a5fa;
}

.dark {
  --background: oklch(0.05 0 0);
  --foreground: oklch(0.984 0.003 247.858);
  --primary:    oklch(0.929 0.013 255.508);
  --primary-foreground: oklch(0.208 0.042 265.755);
  --muted:      oklch(0.18 0.02 260);
  --muted-foreground: oklch(0.704 0.04 256.788);
  --accent:     oklch(0.18 0.02 260);
  --border:     oklch(1 0 0 / 10%);
  --ring:       oklch(0.551 0.027 264.364);
}
```

### 2.2 Typography

Load from Google Fonts:
- **Sans (body):** Inter 400/500/600/700
- **Display (large headings):** Space Grotesk 400/600/700
- **Heading (UI):** Outfit 400/600/800
- **Mono:** JetBrains Mono 400
- **Serif (accents/quotes):** Cormorant Garamond 400/500/600 + italic

Fluid scale (use `clamp()`):
- h1: `clamp(2.5rem, 5vw, 5rem)`
- h2: `clamp(2rem, 3.5vw, 3.5rem)`
- h3: `clamp(1.5rem, 2.5vw, 2.25rem)`
- body: `1rem` / line-height `1.6`
- small: `0.875rem`

### 2.3 Radius / shadows / glass

- Card radius: `40px` (`.glass-card`)
- Default radius: `0.625rem`
- Pill radius: `9999px` (nav)
- **Glass card:** `background: rgba(255,255,255,0.02); backdrop-filter: blur(48px); border: 1px solid rgba(255,255,255,0.05); border-radius: 40px;`
- **Glass nav:** `background: rgba(255,255,255,0.03); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.05); border-radius: 9999px; padding: 6px 16px;`
- **Glow blue:** `box-shadow: 0 0 40px rgba(59,130,246,0.1), 0 0 80px rgba(59,130,246,0.05);`

### 2.4 Motion

- Standard easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Reveal easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Durations: hover `220–320ms`, reveal `600ms`, marquee `40s linear infinite`
- Implement scroll reveal with `IntersectionObserver` toggling `.is-visible` on `.reveal-up` elements. No GSAP required.
- Respect `prefers-reduced-motion: reduce` (kill all animations).

### 2.5 Breakpoints (Tailwind-style, but author plain CSS)

`sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`

---

## 3. Information architecture

| URL              | Template               | Purpose                                                |
|------------------|------------------------|--------------------------------------------------------|
| `/`              | `front-page.php`       | Hero, Featured Work, About teaser, Latest Blog, CTA    |
| `/about`         | `page-about.php`       | Bio, skills, timeline, tools, social                   |
| `/work`          | `archive-project.php`  | All projects (grid + filter by tech taxonomy)          |
| `/work/{slug}`   | `single-project.php`   | Project case study                                     |
| `/blog`          | `home.php`             | Blog index                                             |
| `/blog/{slug}`   | `single.php`           | Blog post                                              |
| `/contact`       | `page-contact.php`     | Contact form + details                                 |
| `/privacy`       | `page.php`             | Privacy policy                                         |
| `/terms`         | `page.php`             | Terms of service                                       |
| `/404`           | `404.php`              | Custom not-found                                       |

The four legal/static pages (about, contact, privacy, terms) are seeded by the demo importer as real WP Pages with the matching template selected.

---

## 4. Data model

### 4.1 Custom Post Type: `project`

Register with `register_post_type('project', …)`:
- `public: true`, `has_archive: 'work'`, `rewrite: ['slug' => 'work']`
- Supports: `title, editor, thumbnail, excerpt, revisions`
- Menu icon: `dashicons-portfolio`, position 5
- `show_in_rest: true`

Meta fields (all via `register_post_meta` with `show_in_rest: true`, typed, sanitized):

| Key              | Type   | Purpose                       |
|------------------|--------|-------------------------------|
| `project_year`   | string | "2025"                        |
| `project_client` | string | Client name                   |
| `project_role`   | string | "Design + Engineering"        |
| `project_live`   | string | Live URL                      |
| `project_repo`   | string | Repo URL                      |
| `project_overview`  | string (rich) | Long intro            |
| `project_challenge` | string (rich) | What was hard         |
| `project_solution`  | string (rich) | What you built        |
| `project_results`   | string (rich) | Outcomes              |
| `project_gallery`   | array of attachment IDs | Gallery       |
| `seo_title`         | string |                                |
| `seo_description`   | string |                                |
| `og_image`          | int    | Attachment ID                  |

Taxonomy: `project_tech` (hierarchical: false, public: true, REST enabled). Used for filtering on `/work`.

### 4.2 Blog posts

Standard `post` + extra meta:
- `reading_time` (int, computed on save via `save_post`)
- `seo_title`, `seo_description`, `og_image`

### 4.3 Custom database tables

Created via `dbDelta()` on theme activation; version-tracked in `option('jahid_db_version')`:

```sql
CREATE TABLE {$wpdb->prefix}jahid_contacts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  subject VARCHAR(200) NULL,
  message TEXT NOT NULL,
  ip VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  status ENUM('new','read','archived','spam') DEFAULT 'new',
  created_at DATETIME NOT NULL,
  INDEX (status), INDEX (created_at)
);

CREATE TABLE {$wpdb->prefix}jahid_newsletter (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  status ENUM('pending','active','unsubscribed','bounced') DEFAULT 'pending',
  confirmed_at DATETIME NULL,
  unsubscribe_token CHAR(64) NOT NULL,
  created_at DATETIME NOT NULL,
  INDEX (status)
);
```

Use `$wpdb->prepare()` on every read/write. Never interpolate user input.

---

## 5. Admin panel — "Portfolio" top-level menu

Add a top-level admin menu (`add_menu_page`) titled **Portfolio** (`dashicons-art`, position 3, capability `manage_options`). Mirror the React app's admin sidebar exactly. All forms use `wp_nonce_field` + `check_admin_referer`. Settings persisted via the Settings API (`register_setting` / `get_option`).

### 5.1 Workspace
- **Inbox** — paginated `WP_List_Table` of `jahid_contacts`. Row actions: View, Mark read, Archive, Spam, Delete. Detail view shows full message + reply-via-mailto link. Filter by status, search by email.
- **Newsletter** — list of subscribers, status badge, "Export CSV" button (streams CSV with `Content-Disposition`), bulk unsubscribe.
- **Media Library** — wrapper over native WP media with tag/folder support (custom taxonomy `media_folder` attached to `attachment`).

### 5.2 Content
- **Projects** — link to the standard `edit.php?post_type=project` screen, restyled with theme CSS injected via `admin_enqueue_scripts`.
- **Blog Posts** — link to `edit.php`.

### 5.3 Pages (structured per-page settings)
Each is a dedicated admin page editing structured content via Settings API. Store under `option('jahid_pages_{key}')`.
- Home (hero headline, sub, CTAs, featured project IDs, marquee items)
- About (bio_md, skills[], timeline[], tools[])
- Work (intro, default filter)
- Blog (intro, posts per page)
- Contact (intro, email, location, social[])
- Privacy (rich text)
- Terms (rich text)

### 5.4 Global
- **Header** — nav items (label + url + external?), logo text/image
- **Footer** — 1–4 columns of links, social handles, copyright string
- **SEO defaults** — site title format, default description, default OG image, twitter handle, robots meta
- **Per-page SEO** — title/description/og_image override for each of the 7 pages above. Stored in `option('jahid_page_seo')` as keyed array.

### 5.5 System
- **SMTP** — host, port, encryption (none/ssl/tls), username, password (stored encrypted via `openssl_encrypt` with `AUTH_KEY` salt), from_email, from_name, **Send test email** button.
- **Demo Data** — two buttons: **Import demo** (idempotent), **Clear demo**. Shows last-run timestamp + counts.
- **Theme Options** — primary color override, font swaps, toggle dark-mode default.

---

## 6. Frontend features

- **AJAX contact form**: `wp_ajax_nopriv_jahid_contact` + `wp_ajax_jahid_contact`. Honeypot field `hp_website` must be empty. Rate limit: 3 submissions per minute per IP via `set_transient`. Validates with `is_email`, `sanitize_text_field`, `wp_kses_post`. Inserts into `jahid_contacts` and triggers two emails (admin notification + user auto-reply).
- **AJAX newsletter signup**: double opt-in. On signup, insert with `status=pending` + token, send confirm email. `/?jahid_newsletter_confirm={token}` activates. `/?jahid_newsletter_unsubscribe={token}` removes.
- **Scroll reveal** on cards (`.reveal-up`).
- **Marquee** for tech stack (CSS keyframes, pause on hover).
- **Parallax hero** (CSS `transform: translateY(scrollY * 0.3)` via `requestAnimationFrame`).
- **Reading progress bar** on single posts (fixed top, width = scroll percentage).
- **Related**: 3 related projects on single-project (same taxonomy term), 3 related posts on single.
- **Theme toggle** in header — sun/moon icon, rotates on hover.
- **Command-K palette** (optional, JS only) — quick nav for sections.

---

## 7. SEO

- Per-page meta resolved in `wp_head` action by a helper `jahid_render_seo_tags()`:
  1. If singular `project` / `post` → use post meta `seo_title`/`seo_description`/`og_image`
  2. Else if known page key (`home`/`about`/`work`/`blog`/`contact`/`privacy`/`terms`) → read from `option('jahid_page_seo')[$key]`
  3. Fallback to SEO defaults
- Emit: `<title>`, `meta description`, canonical, `og:title`, `og:description`, `og:image`, `og:type`, `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`.
- **JSON-LD**:
  - Home → `Person` schema
  - Single post → `Article`
  - Single project → `CreativeWork`
- Use WP core sitemap (`wp-sitemap.xml`) and ensure CPT `project` is included.
- Editable `robots.txt` via admin (writes virtual robots via `robots_txt` filter).

---

## 8. Email system

- All `wp_mail()` calls route through SMTP. Hook `phpmailer_init`:
  ```php
  add_action('phpmailer_init', function($phpmailer){
    $opts = get_option('jahid_smtp');
    $phpmailer->isSMTP();
    $phpmailer->Host = $opts['host'];
    $phpmailer->Port = (int) $opts['port'];
    $phpmailer->SMTPAuth = true;
    $phpmailer->Username = $opts['user'];
    $phpmailer->Password = jahid_decrypt($opts['pass']);
    $phpmailer->SMTPSecure = $opts['encryption']; // '', 'ssl', 'tls'
    $phpmailer->From = $opts['from_email'];
    $phpmailer->FromName = $opts['from_name'];
  });
  ```
- Templates in `/inc/email/templates/*.php`, both HTML + plain-text:
  - `contact-admin.php` (to site admin)
  - `contact-autoreply.php` (to submitter)
  - `newsletter-confirm.php`
  - `newsletter-welcome.php`
- Use `add_filter('wp_mail_content_type', fn() => 'text/html')` per-send and reset after.

---

## 9. Demo data

- JSON files under `/inc/demo/`:
  - `pages.json` — content for the 7 pages
  - `projects.json` — 6 projects with all meta
  - `posts.json` — 4 blog posts
  - `nav.json` — header/footer menus
  - `images/` — sample cover & gallery images
- **Import** (`/inc/demo/import.php`):
  - Upsert by slug — match existing posts/pages, update meta, never duplicate.
  - Copy `images/*` into WP media (skip if already present by SHA-1 stored in `_jahid_demo_hash`).
  - Tag every imported item with post meta `_jahid_demo = 1`.
  - Idempotent: running twice is a no-op on the second run.
- **Clear** (`/inc/demo/clear.php`):
  - Delete only items where `_jahid_demo = 1`.
  - Remove demo media (by hash match).
  - Never touch user-created content.

---

## 10. File structure

```text
jahid-theme/
├── style.css                  (theme header only; real styles in /assets/css/)
├── functions.php              (loads /inc/* in correct order)
├── front-page.php
├── home.php                   (blog index)
├── index.php                  (fallback)
├── page.php
├── single.php
├── archive.php
├── archive-project.php
├── single-project.php
├── page-about.php
├── page-contact.php
├── header.php
├── footer.php
├── sidebar.php
├── searchform.php
├── 404.php
├── /inc/
│   ├── setup.php              (after_setup_theme, theme supports, menus, image sizes)
│   ├── enqueue.php            (wp_enqueue_scripts + admin_enqueue_scripts)
│   ├── cpt.php                (project + project_tech)
│   ├── meta.php               (register_post_meta + meta boxes)
│   ├── tables.php             (dbDelta, activation hook)
│   ├── seo.php                (jahid_render_seo_tags + JSON-LD)
│   ├── smtp.php               (phpmailer_init + decrypt helper)
│   ├── crypto.php             (openssl wrappers)
│   ├── helpers.php            (reading time, sanitize, rate limit)
│   ├── /admin/
│   │   ├── menu.php           (top-level + subpages)
│   │   ├── inbox.php          (WP_List_Table)
│   │   ├── newsletter.php
│   │   ├── media-folders.php
│   │   ├── pages-home.php
│   │   ├── pages-about.php
│   │   ├── pages-work.php
│   │   ├── pages-blog.php
│   │   ├── pages-contact.php
│   │   ├── pages-privacy.php
│   │   ├── pages-terms.php
│   │   ├── global-header.php
│   │   ├── global-footer.php
│   │   ├── global-seo.php
│   │   ├── global-page-seo.php
│   │   ├── system-smtp.php
│   │   ├── system-demo.php
│   │   └── system-theme.php
│   ├── /ajax/
│   │   ├── contact.php
│   │   └── newsletter.php
│   ├── /email/
│   │   ├── mailer.php
│   │   └── templates/
│   │       ├── contact-admin.php
│   │       ├── contact-autoreply.php
│   │       ├── newsletter-confirm.php
│   │       └── newsletter-welcome.php
│   └── /demo/
│       ├── import.php
│       ├── clear.php
│       ├── pages.json
│       ├── projects.json
│       ├── posts.json
│       ├── nav.json
│       └── images/
├── /templates/parts/
│   ├── hero.php
│   ├── featured-work.php
│   ├── about-teaser.php
│   ├── latest-blog.php
│   ├── cta.php
│   ├── project-card.php
│   ├── post-card.php
│   ├── tech-marquee.php
│   ├── reading-progress.php
│   └── theme-toggle.php
├── /assets/
│   ├── css/
│   │   ├── theme.css          (tokens + base)
│   │   ├── components.css     (cards, nav, forms)
│   │   └── admin.css
│   ├── js/
│   │   ├── theme.js           (dark toggle)
│   │   ├── reveal.js          (IntersectionObserver)
│   │   ├── parallax.js
│   │   ├── contact.js         (AJAX)
│   │   ├── newsletter.js      (AJAX)
│   │   └── admin.js
│   ├── fonts/                 (optional self-host fallbacks)
│   ├── images/                (theme chrome)
│   └── demo/                  (mirrors /inc/demo/images for dev preview)
├── /languages/
│   └── jahid.pot
└── readme.txt
```

---

## 11. Security

- **Nonces** on every form: `wp_nonce_field('jahid_save_x','jahid_nonce_x')`, verified with `check_admin_referer`.
- **Capability checks** (`current_user_can('manage_options')`) at the top of every admin handler.
- **Sanitize on input** (`sanitize_text_field`, `sanitize_email`, `wp_kses_post`, `esc_url_raw`, `absint`).
- **Escape on output** (`esc_html`, `esc_attr`, `esc_url`, `wp_kses_post`).
- **Prepared statements**: every `$wpdb->query` uses `$wpdb->prepare`.
- **Honeypot + rate limit** on public AJAX endpoints. Reject if honeypot non-empty or transient exists.
- **Encrypted secrets**: SMTP password stored via `openssl_encrypt('AES-256-CBC', AUTH_KEY)`.
- **Disable XML-RPC** and remove WP version from generator meta.
- **Headers** sent via `send_headers` action: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: interest-cohort=()`.

---

## 12. Performance

- Asset versioning with `filemtime()` in `wp_enqueue_*`.
- Defer non-critical JS (`script_loader_tag` filter adding `defer`).
- Preload primary font: `<link rel="preload" as="font" type="font/woff2" crossorigin>`.
- Native lazy-loading on images (`loading="lazy" decoding="async"`).
- Register `add_image_size('jahid_card', 800, 600, true)` and `add_image_size('jahid_hero', 1920, 1080, true)`.
- Output `srcset` via `wp_get_attachment_image`.
- Cache expensive queries with `wp_cache_get` / `wp_cache_set` (group `jahid`).
- Target Lighthouse ≥ 95 on Performance, Accessibility, Best Practices, SEO.

---

## 13. i18n

- All strings wrapped in `__()`, `_e()`, `_n()`, `_x()` with text-domain `jahid`.
- Load with `load_theme_textdomain('jahid', get_template_directory() . '/languages')`.
- Generate `languages/jahid.pot` (a placeholder file is acceptable).

---

## 14. Acceptance checklist

Implementation is not done until ALL of these are true:

1. Activating the theme on a clean WP install creates the `project` CPT, `project_tech` taxonomy, both custom tables, and the **Portfolio** admin menu — with no PHP notices or warnings.
2. All 11 templates render with no errors when no content exists (empty states).
3. All 7 admin "Pages" screens save and re-render their values correctly.
4. Per-page SEO override is reflected in `<head>` for all 7 pages.
5. Project single page reads `seo_*` post meta and emits JSON-LD `CreativeWork`.
6. AJAX contact form validates, stores in `jahid_contacts`, sends admin notification + auto-reply via configured SMTP, and rate-limits a 4th submission within a minute.
7. AJAX newsletter signup performs double opt-in end-to-end (confirm + unsubscribe links work).
8. SMTP "Send test email" delivers a real email with the configured From address.
9. Demo Import is **idempotent**: running it twice produces no duplicates; image hashes prevent re-uploads.
10. Demo Clear removes only `_jahid_demo=1` content and leaves user content untouched.
11. Dark/light toggle persists via `localStorage` and respects `prefers-color-scheme` on first visit.
12. `prefers-reduced-motion: reduce` disables all animations.
13. All forms include nonces; admin pages enforce `manage_options`.
14. SMTP password is encrypted at rest (not stored as plaintext in `wp_options`).
15. Custom tables created via `dbDelta`; version stored in `jahid_db_version`; deactivation does NOT drop tables (data preservation).
16. Site loads with no console errors and no mixed-content warnings on HTTPS.
17. Lighthouse mobile scores ≥ 95 / 95 / 95 / 100 on the homepage.
18. Translation works: switching site language to a locale with a `.mo` file in `/languages/` translates UI strings.
19. Theme passes Theme Check plugin with no errors (warnings about screenshots are OK).
20. No external HTTP calls at runtime except Google Fonts.

---

## 15. Deliverable

A single folder `jahid-theme/` matching the structure in §10, ready to zip and upload via **Appearance → Themes → Add New → Upload Theme**. Include a short `readme.txt` covering install, activation, demo import, and SMTP setup.

Build it.
