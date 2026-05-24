## Goal

Rebuild the **Header / Nav** admin page (`/admin/site/navigation`) so every visible element of the live header is editable — each option in its **own card container**, all inside the existing header admin page (no new sidebar items). Then wire the Navbar in `src/PortfolioApp.tsx` to read these settings.

Reference: the uploaded header image shows brand text + location (left), avatar + nav pills + theme toggle + Connect CTA (center pill), and clock + "LOCAL TIME (GMT+6)" (right).

## Cards on `/admin/site/navigation`

Each rendered as its own `Card` (same `SectionCard` pattern as the footer page). Switches always visible; off-state styled with visible border so it can be toggled back on.

1. **Brand (left side)** — toggle on/off
   - Name text (e.g. `JAHID HASAN`)
   - Location/subtitle text (e.g. `DHAKA, BANGLADESH`)

2. **Profile avatar** — toggle on/off
   - `ImageUploader` for avatar image

3. **Navigation links** — list editor
   - Add / remove / reorder rows
   - Per link: Label, URL, Visible switch
   - (Icon stays auto-mapped by label to keep scope minimal)

4. **Theme toggle button** — on/off switch (hide the sun/moon button in the navbar when off)

5. **CTA button (Connect)** — toggle on/off
   - Label, URL

6. **Local time (right side)** — toggle on/off
   - Caption text (e.g. `LOCAL TIME (GMT+6)`)
   - Timezone (e.g. `Asia/Dhaka`)

No other admin sidebar entries are added. Every field is always rendered regardless of the corresponding switch state.

## Wire-up in `src/PortfolioApp.tsx` (Navbar only)

- Extend the `navigation` settings type with the new fields: `brand_enabled`, `brand_name`, `brand_location`, `avatar_enabled`, `avatar_url`, `theme_toggle_enabled`, `cta_enabled`, `time_enabled`, `time_label`, `time_timezone`, and per-link `visible` flag.
- Replace hardcoded strings/avatar URL in `Navbar` with values from settings (fallbacks to current defaults so nothing breaks on first load).
- Conditionally render the left brand block, avatar, theme toggle, CTA, and right-side time block based on their `*_enabled` flags. Hide individual nav items whose `visible === false`.
- Use the timezone setting in the `toLocaleTimeString` call.

## Out of scope

- No changes to the sidebar (`AdminSidebar.tsx`).
- No changes to Footer admin or other admin pages.
- No business logic / DB schema changes — reuses the existing `adminGetAllSettings` / `adminUpdateSetting` flow under the `navigation` key.
