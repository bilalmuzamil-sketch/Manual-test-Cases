# Shopview Design System

Shopview is **shop management software built for heavy-duty shops** — the people who service semi-trucks, tractors, trailers, fleet vehicles, and industrial equipment. The product is a web-based operations platform that runs the whole shop: work orders, schedule, customers, parts/inventory, technicians' timesheets, finance (estimates, invoicing, A/R), and reporting.

This design system is the source of truth for the product's look, feel, and language. It's derived directly from the official ShopView Design System Figma file.

## Sources

- **Figma** — `ShopView Design System.fig` (this project's mounted Figma file)
  - URL: `https://www.figma.com/design/4v5M4z7Xj1Uw6qxrM61ktB/ShopView-Design-System`
  - 28 pages across Foundations (Logo, Colors, Typography, Icons, Effects, Spacing), Components (Avatar, Buttons, Checkboxes, Toggles, Inputs, Breadcrumbs, Badges, Headers, Tables, Modals, Tabs, Tooltip, Menus, Notifications, Side-Panel), plus Dara playground work exploring real product screens (Work Order, Schedule, Inventory, Finance).

## Products represented

Shopview appears to ship as a single web application with distinct workspaces:

- **Work Orders** — the hub. Each work order represents a repair job, broken into Lines (each with labor + parts + statuses like *Authorization Required*, *Authorized*, *Completed*). Every line can show/hide financial info (rate/margin/total).
- **Schedule** — a week-view time grid where technicians' hours are blocked against work orders (e.g. "S1-8, ABC Truck Lines").
- **Customers** — customer records (e.g. *PepsiCo Foods Can...*) with contact, phone, IBS#.
- **Parts / Inventory** — parts catalog with bin location, category, supply, quantity.
- **Reports / Finance** — A/R Aging Detail, Canned Lines, Estimates, Invoicing.

## Index — files in this system

Root:
- `README.md` — this file
- `colors_and_type.css` — design tokens (colors, type, radii, shadows, spacing) as CSS variables, plus base element styles
- `SKILL.md` — Agent Skill manifest for using this pack in Claude Code
- `assets/` — logos, icon set references, logo SVG path
- `fonts/` — web fonts (Inter, Nunito; both Google Fonts)
- `preview/` — small sample cards that populate the Design System tab
- `ui_kits/shopview-app/` — the primary product UI kit (React/JSX) with `index.html` demo + component library

## Content Fundamentals

ShopView copy is **direct, short, and verb-first**. It reads like a professional tool for busy shop managers — no marketing fluff, no friendliness performance.

### Tone and voice
- **Functional, not friendly.** The product is a system of record; copy gets out of the way.
- **Imperative verbs** dominate primary actions: *New Work Order*, *New Line*, *Authorize*, *Decline*, *Complete*, *New Inventory Part*. No "Let's…" or "Ready to…".
- **Domain language** is preferred over generic UI language. Say *Work Order*, *Line*, *Part*, *Bin Location*, *Service Advisor*, *Lead Technician*, *IBS#*, *VIN*, *Licence plate*, *Eng. Hr.*, *Milage* — not "item", "entry", "task".
- **Title Case for product-world nouns** (*Work Order*, *Part Returns*, *Canned Lines*, *A/R Aging Detail Report*) and in buttons and tabs (*New Work Order*, *My Work Orders*).
- **Sentence case for helper text and guidelines.** ("Use input fields only when the user must provide information, not for actions.")
- **No emoji** in product UI. (Guideline docs use ✅ ⚠️ ❌ informally to describe semantic color meaning, but the UI itself does not.)
- **First-person plural is avoided.** The product never refers to itself as "we". Users are addressed obliquely ("My Work Orders").
- **Status words are single tokens** — *Paid*, *Partially Paid*, *Unpaid*, *Awaiting*, *Requested*, *Authorized*, *Authorization Required*, *Approved*, *Completed*. They appear as badges.

### Copy examples (from Figma)
- Button labels: "Save", "Add Part", "Update", "New Work Order", "New Line", "New Inventory Part", "Authorize", "Decline", "Complete"
- Vague labels to avoid (per button guidelines): "OK", "New"
- Preferred over generic: "Delete Part" not just "Delete"
- Tabs: *Lines (17)*, *Parts (20)*, *Part Returns*, *Notes (2)*, *Timesheets (2)*, *Statistics*, *Finance*
- Destructive action guideline: dedicated destructive style (red), used for delete/remove/reset.

### Writing rules in short
- Buttons trigger actions; links navigate. Never conflate.
- One primary button per view. Never two primary buttons side by side.
- Every button has states: Default, Hover, Focused, Disabled. Focused must be visible and accessible.
- Always pair semantic colors with text or iconography — color alone never communicates state.
- Error messages explain *what's wrong* and *how to fix it*.
- Labels always visible; placeholders are examples, not substitutes for labels.

## Visual Foundations

### Color

Shopview's palette is **a blue-led utilitarian system**: one strong action blue, a cool slate-grey ladder for structure, and four semantic colors for status. Additional colors (teal, cyan, violet, pink) are reserved for data/visualization contexts — not decoration.

- **Primary**: `#257CFF` (buttons, active tabs, links, logo accent). Pantone 2727 C.
- **Dark primary text**: `#364152` (grey-700 in our scale). Pantone 7546 C.
- **Neutrals (Grey)**: `#F8FAFC → #0F111A` — 11 steps. Used for layout, dividers, backgrounds, text. Grey-25–100 backgrounds, 200–400 containers/inputs, 500–700 text, 800–900 high-contrast/dark mode.
- **Success**: `#36B360` family (fill `#ABF5C4`, text `#108737`).
- **Warning**: `#EC9E00` family (fill `#FFF5E0`, text `#B47A00`).
- **Error**: `#EF4444` family (fill `#FCA397`, text `#B52020`).
- **Info**: `#257CFF` family (fill `#E5EDFF`, text `#0868A7`).

Rules:
- Never use grey for interactive elements except disabled.
- Body text never lighter than Grey-500.
- Badges paint background tint + darker text — they're pills, not solid chips.

### Type

- **Inter** is the single product typeface — body, labels, buttons, inputs, navigation, tables, and headlines. Chosen for tall x-height, open apertures, and clarity at small UI sizes.
- Two optical sizes ship: **Inter 18pt** (aliased as `Inter`) for UI and body text, and **Inter 28pt** (aliased as `Inter Display`) for H1/H2 headlines where the tighter display cut reads better at large sizes.
- Typescale: H1 30/38 (600 or 700), H2 24/32 semibold, H3 20/28 (500 or 700), H4 16/24 semibold, Body 1 14/20 (400/500/600), Body 2 12/16 (500/600, +1% letter-spacing), Caption 10/14 600 (+1.5% letter-spacing).
- Minimum text size: 12px. Body must meet 4.5:1 contrast.

### Spacing

4px base grid. Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192, 224, 256 (rem equivalents 0.25–16rem). Consistent padding inside buttons (8–28px horizontally depending on size). Equal spacing between grouped buttons.

### Corner radii

- **Buttons, inputs, menus, modals, cards**: 8px (md)
- **Badges**: full pill (height/2)
- **Large cards/panels, modals outer**: 12px
- **Page-level showcase cards**: 40px (only in the design system showcase frames)
- **Avatars**: full circle

### Shadows / elevation

- **Small**: `0 1px 2px rgba(16,24,40,0.05)` — resting buttons, inputs.
- **Medium**: `0 4px 8px rgba(11,23,51,0.08), 0 1px 2px rgba(11,23,51,0.05)` — hover elevation, dropdowns.
- **Large**: `0 12px 24px rgba(11,23,51,0.10), 0 4px 8px rgba(11,23,51,0.05)` — modals, popovers, side panels.
- **Focus ring**: 4px `rgba(37,124,255,0.24)` outline around primary-blue 2px border.

### Borders

- **Default container border**: 1px `#E3E8EF` (grey-200).
- **Divider lines**: 1px `#CDD5DF` (grey-300) for strong dividers, `#E3E8EF` for subtle.
- **Input borders**: 1px `#CDD5DF`. Focus: 2px `#257CFF`.
- **Error**: 1px `#EF4444`.
- **Dashed purple** (`#7B61FF` / `#8A38F5`) is used *only* in design-system documentation to delineate component spec regions — never in product.

### Layout and containers

- **Card**: white bg, 8–12px radius, 1px grey-200 border, shadow-sm. Padding 16–24px.
- **Full-width app bar / header**: 56–64px tall, white, 1px grey-200 bottom border, no shadow. Logo left, primary nav middle, search + user menu right.
- **Side panel / sub-sidebar**: 240–280px wide, grey-50 bg, grey-200 right border. Contains card-grouped contextual info (customer, vehicle, status).
- **Page content**: white or grey-25 bg, 24–32px padding.
- **Fixed top bar + fixed side panel + scrollable content** is the dominant shell.

### Imagery, motifs, backgrounds

- **No hand-drawn illustrations or background patterns.** The surface vocabulary is clean: white, grey-25, and subtle tinted cards (warm `#FFFAEB` for help/guidance, cool `#E9F5FF` for tips).
- **No gradients** in product UI. Primary blue is a flat fill.
- **No photography** in the design system; product screens are text-and-data dense.
- **Data visualization** uses success/warning/error semantics for status chips in tables, and additional colors (teal, cyan, violet, pink) for distinct categories.

### Motion

- Hover = **color shift + subtle lift (shadow-sm → shadow-md)**, not scale.
- Active/press = **darker fill + no shadow**, not shrink.
- Focused = **4px outer blue glow + 2px blue border** — always visible, always accessible.
- Transitions are short: 120–160ms ease-out. No bounce, no spring.
- Loading buttons show a small row of pulsing circles in place of the label, preserving width.
- No entrance animations on route changes.

### Transparency and blur

- Overlays behind modals: `rgba(15,17,26,0.5)`, no blur. (Shopview does not use frosted glass.)
- Disabled buttons: reduce to ~40% opacity of their default state.

### Hover / Press / Focus summary

| State     | Background         | Border/Outline       | Text/Icon |
|-----------|--------------------|----------------------|-----------|
| Default   | #257CFF            | —                    | white     |
| Hover     | #1752C0 (primary-700) | —                 | white     |
| Focused   | #257CFF            | 4px #257CFF@24%      | white     |
| Active    | #042260 (primary-800) | —                 | white     |
| Disabled  | #B7D5FF            | —                    | white     |

Secondary buttons invert the treatment: white bg, grey-300 border, grey-700 text; hover → grey-50 bg, grey-400 border.

## Iconography

Shopview uses **outlined line icons** (1.5–2px stroke, rounded joins/caps) at 16px / 20px / 24px / 32px sizes, from a library that matches the **Lucide / Feather / Untitled-UI** style. Specific icons observed in Figma include: `arrow-up`, `arrow-right`, `chevron-down`, `x-close`, `add`, `search`, `settings`, `user`, `copy`, `external-link`, `calendar-today`.

- **Stroke style.** Line/outlined, not filled, not duotone.
- **Stroke width.** Visually 1.5–2px at 24px canvas; scales proportionally.
- **Container/icon ratio.** Icons sit in ~24×24 hit areas; featured icons appear in a 40×40 rounded-square tile (8px radius) with `#E5EDFF` fill and blue stroke.
- **No emoji in product UI.** Guideline docs may use ✅ ⚠️ ❌ to describe semantic meaning, but the UI never ships emoji as an icon.
- **No unicode glyphs as icons.** Arrows, chevrons, close are always proper SVGs.
- **SVG, not icon font.** Each icon ships as an SVG with `currentColor` stroke so it inherits text color.

**In this design system**: the icon symbol used for the Shopview logo mark is copied to `assets/symbol-primary.svg`. For UI iconography, we use **Lucide** via CDN — it matches Shopview's outlined style 1:1 and is widely available. This is a **substitution** we flag: Shopview's internal icon library is not extractable from Figma as a distributable set; Lucide is the closest shape/stroke match and is what the UI kit uses. If you have the real icon sprite, drop it in `assets/icons/` and swap the reference in `ui_kits/shopview-app/` components.

## Known substitutions / caveats

- **Fonts**: Inter ships locally in `fonts/` across three optical sizes (18pt for UI, 24pt available for mid-size, 28pt for display). `colors_and_type.css` loads 18pt for the `Inter` family and 28pt as `Inter Display`. Nunito — which appeared only in a couple of Figma documentation labels — is no longer referenced; Inter covers all product UI.
- **Icons**: Lucide is used as a stand-in for Shopview's internal icon library (matched style).
- **Logo**: official wordmarks + symbols ship in `assets/` — `logo-primary-light.svg`, `logo-primary-dark.png`, `logo-black.svg`, `logo-white.svg`, `symbol-primary.svg`, `symbol-black.svg`, `symbol-white.svg`. Use the SVGs whenever possible; the dark-bg PNG is provided because the source uses raster effects the SVG export couldn't preserve.
- **Dara exploration screens** in Figma are work-in-progress, not canonical; the component pages (Buttons, Inputs, Badges, etc.) are the source of truth.
