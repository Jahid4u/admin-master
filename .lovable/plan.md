## Goal

Apnar upload kora `Pixel_Perfect_UI` project ke ei workspace e import korbo, ar admin panel er management options gulo ekta page er bhitor tabs hisebe na rekhe **alada alada route/page** hisebe banabo — jate proti ekta section porishkar, focused ar manage korte easy hoy.

## Current problem

Ekhon `/admin/settings` page e Hero, About, Contact, Social — sob ekta page e tabs er bhitor cramped. Ar dashboard e Demo import o mishano. Eta "ektar bhitor besi option" pattern.

## Plan

### 1. Project import
- Upload kora zip er sob file (routes, components, lib, hooks, integrations, styles) current workspace e copy korbo.
- `package.json` dependencies merge + install korbo.
- Lovable Cloud (Supabase) enable korbo karon admin auth, projects, posts, settings sob database driven.

### 2. Admin sidebar restructure
Notun sidebar groups:

```text
OVERVIEW
  • Dashboard

CONTENT
  • Projects
  • Blog posts

SITE CONTENT          ← agee "Settings" tab silo, ekhon alada page
  • Hero section
  • About section
  • Contact info
  • Social links

SYSTEM
  • Demo data         ← dashboard theke alada
  • Account / Sign out
```

### 3. Routes split (alada alada page)

Notun route files:

| Route | Purpose |
|---|---|
| `/admin` | Dashboard — sudhu stats + recent activity |
| `/admin/projects` | Projects list (already alada) |
| `/admin/projects/new`, `/admin/projects/$id` | already alada |
| `/admin/blog` | Posts list |
| `/admin/blog/new`, `/admin/blog/$id` | already alada |
| `/admin/site/hero` | **NEW** — sudhu Hero editor |
| `/admin/site/about` | **NEW** — sudhu About editor |
| `/admin/site/contact` | **NEW** — sudhu Contact editor |
| `/admin/site/social` | **NEW** — sudhu Social links editor |
| `/admin/system/demo` | **NEW** — Demo import, alada page |
| `/admin/settings` | redirect → `/admin/site/hero` (backward compat) |

Each Site Content page ekta nijer card, nijer form, nijer save button niye — kono tab nai, kono mishano nai.

### 4. Dashboard cleanup
- Demo import card sorabo `/admin/system/demo` te.
- Dashboard e thakbe: Projects count, Posts count, last updated info, quick links — pure overview.

### 5. Each editor page structure (consistent pattern)
```text
<h1>Section name</h1>
<p>Short description — kothay public site e show hobe</p>
<Card> form with only that section's fields </Card>
<SaveBar />
```

### Technical notes
- Existing `adminGetAllSettings` / `adminUpdateSetting` server functions reuse korbo — sudhu UI split hocche, backend same.
- Existing editor components (`HeroEditor`, `AboutEditor` etc.) `admin.settings.tsx` theke bair kore `src/components/admin/site/` te alada file e neyo hobe, then proti notun route file ektai editor render korbe.
- TanStack Router file-based naming: `admin.site.hero.tsx`, `admin.site.about.tsx`, etc.

### Out of scope
- Projects/Blog er internal form gulo already alada page e ache — oi gulo touch korbo na.
- Public site er design change nai.
