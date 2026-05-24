## Goal

1. **Newsletter section** ke Blog page theke shoriye **Footer er top e** boshabo, ar admin panel theke **on/off** kora jabe (with editable title/description).
2. Admin panel er **UI ekdom professional vabe** redesign korbo — ekhon sidebar e 11+ group ache, dekhte cluttered. Notun design e clean grouping, proper header, breadcrumbs, ar refined typography thakbe.

---

## Part 1 — Newsletter → Footer (with toggle)

### Public site changes
- **Remove** newsletter block (lines ~1475–1503) from Blog section in `src/PortfolioApp.tsx`.
- **Footer component** (line 1705) e top e notun newsletter block add korbo — same design (rounded-2xl dark card, email input + Subscribe button), bortoman footer er typography er sathe match korbe.
- Footer e `getSiteSettings` call kore `footer` setting load korbo (TanStack Query, already used pattern). `footer.newsletter_enabled === false` hole block render hobe na.

### Admin changes
- `src/routes/admin.site.footer.tsx` e ekta **Switch** add korbo: "Show newsletter section". Plus existing `newsletter_title` / `newsletter_desc` fields already ache.
- Footer setting shape e notun field: `newsletter_enabled: boolean` (default `true`).

No DB migration lagbe na — `site_settings.value` ekta JSON, just notun key add korlei hobe.

---

## Part 2 — Admin panel professional redesign

### Current problem
Sidebar e 11 ta group, oneker `label` duplicate items (e.g. About section + About content, Projects 2x), icons mishmash, header just "Admin" — flat ar amateurish.

### New structure

**Sidebar — 4 clean groups only:**

```text
WORKSPACE
  ▸ Dashboard

CONTENT
  ▸ Projects
  ▸ Blog posts

PAGES                ← collapsible accordion items
  ▸ Home
  ▸ About
  ▸ Work
  ▸ Blog
  ▸ Contact
  ▸ Legal

GLOBAL
  ▸ Header / Nav
  ▸ Footer
  ▸ SEO & meta
  ▸ Social links
  ▸ Demo data
```

Proti "Pages" item click korle ekta page editor khulbe jeta tabs hisebe oi page er sub-sections show korbe (e.g. Home → Hero / Services / About tabs). Eta sidebar bloat sorabe but sob option e accessible thakbe.

### New layout chrome
- **Topbar**: logo + workspace name (left), breadcrumb (center), theme toggle + user avatar dropdown (sign-out menu) (right). Height 56px, subtle border.
- **Sidebar**: 240px, refined spacing, group labels uppercase `text-[11px] tracking-wider text-muted-foreground`, items with 8px icon gap, active state = soft `bg-muted` + left accent bar (2px primary).
- **Main content**: max-width container, consistent page header pattern:
  ```text
  <PageHeader>
    Title (text-2xl semibold)
    Description (text-sm muted)
    [Actions] (right-aligned: Save / New buttons)
  </PageHeader>
  ```
- **Forms**: each section in `Card` with proper `CardHeader/Content/Footer`, sticky save bar at bottom on long forms, toast on save (already exists).
- **Empty states**: notun component for "No projects yet" type screens with icon + CTA.

### Components to add/change
- `src/components/admin/AdminSidebar.tsx` — full rewrite with 4 groups + Pages accordion (use existing shadcn `Collapsible`).
- `src/components/admin/AdminTopbar.tsx` — **NEW**: breadcrumb + user menu.
- `src/components/admin/PageHeader.tsx` — **NEW**: reusable title/description/actions row.
- `src/routes/admin.tsx` — use new Topbar instead of inline header.
- `src/routes/admin.pages.$page.tsx` — **NEW** tabbed editor route for each page (Home/About/Work/Blog/Contact/Legal) that internally renders existing `SiteSectionEditor` instances in tabs.
- Old `admin.site.*.tsx` routes redirect to corresponding `admin.pages.*` tab (backward compat).
- `SiteSectionEditor` e wrapper styling improve — remove duplicate card title.

### Color/typography polish
- Admin uses semantic tokens only (`bg-background`, `border-border`, `text-foreground`, `text-muted-foreground`) — already mostly correct, just verify no hardcoded colors.
- Font: keep existing system, but headings get `tracking-tight font-semibold`.

---

## Out of scope
- No database migration.
- Public site design beyond the newsletter move stays untouched.
- Existing Projects/Blog list & form pages keep their current structure (only wrapped in new PageHeader).

Approve korle implement kora shuru korbo.