# Jahid Portfolio — WordPress Theme

A premium dark/light portfolio WordPress theme that exactly mirrors the Apifel DIGI React portfolio design system.

## Features

- Dark/Light mode toggle with cookie persistence
- Animated floating navbar with scroll progress, 3D tilt, sweep shimmer
- Hero section with metric cards, schematic visuals, stats bar
- Projects (Custom Post Type) with gallery, tech stack, results metrics
- Blog with sidebar, share buttons, related posts
- About page with bento grid layout, timeline, tech stack
- Contact page with AJAX form
- Newsletter subscription
- Full admin panel mirroring the React admin sidebar exactly
- Mouse glow effect
- Scroll-reveal animations
- SEO meta tags per page

## Installation

1. Copy the `jahid-portfolio` folder to `/wp-content/themes/`
2. Activate from **Appearance > Themes**
3. Go to **Portfolio > Dashboard** to configure everything

## Setting Up Pages

Create these pages in **Pages > Add New** with the matching template:

| Page Title      | Template            | Slug             |
|-----------------|---------------------|------------------|
| (Front Page)    | Default             | —                |
| About           | About Page          | `/about`         |
| Contact         | Contact Page        | `/contact`       |
| Privacy Policy  | Privacy Policy      | `/privacy-policy`|
| Terms of Service| Terms of Service    | `/terms-of-service`|

Set front page: **Settings > Reading > Static Page = (Front Page)**  
Set blog page: **Settings > Reading > Posts Page = Blog**

## Admin Menu

Go to **Portfolio** in the admin sidebar for:

- **Dashboard** — stats overview
- **Inbox** — contact form submissions
- **Newsletter** — subscriber management
- **Projects** / **Blog Posts** — content management
- **Home / About / Work / Blog / Contact Info** — page content editors
- **Header/Nav / Footer / Social Links / SEO** — global settings
- **SMTP / Settings** — system config

## Adding Projects

1. Go to **Portfolio > Projects > Add New**
2. Fill in the title, excerpt (used as project description)
3. Fill in the **Project Details** meta box: category, year, client, etc.
4. Add **Cover Image** URL and gallery images in **Project Media**
5. Publish

## Custom Post Type Archive

The Work archive is at `/work` automatically.  
Individual projects are at `/work/{slug}`.
