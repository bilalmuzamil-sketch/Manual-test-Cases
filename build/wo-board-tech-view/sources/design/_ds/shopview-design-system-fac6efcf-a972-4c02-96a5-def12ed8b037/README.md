# Shopview Design System

Shopview is **shop management software for heavy-duty shops** — the people who
service semi-trucks, tractors, trailers, fleet vehicles and industrial
equipment. It runs the whole shop: work orders, schedule, customers,
parts/inventory, timesheets, finance and reporting.

This is the source of truth for the product's look, feel and language.

---

## If you are not a designer, read only this part

You want a screen. Here is the whole process.

**1. Copy a template.** `Template - List View.html` for anything that is a list
or a table. `Template - Detail View.html` for anything that is one record.
These are complete, working screens — not fragments. In the Design System tab
they show up under **Patterns**, named "Template · …".

If the screen needs **several views of the same records** — a list, a grouping,
a board — copy the **Work Orders page** instead. It is the only place the Board
and By Lead Tech views exist, and they are not components you can import.

**2. Change the three marked blocks.** Each template has comments saying
`1. YOUR DATA`, `2. YOUR COLUMNS`, `3. YOUR SCREEN`. Change those. Leave the
rest alone.

**3. Never write a colour or a size.** If you are typing `#257CFF` or
`padding: 12px`, you have gone off the path. Everything is already styled.

**4. If something you need doesn't exist, ask — don't approximate.** Open the
console and type `SV.inventory()` to see everything available, and
`SV.missing('date picker')` to get the exact sentence to send. A component
that looks 90% right is worse than no component, because it ships and then
everyone copies it.

That's it. The rest of this file is reference.

---

## Asking Claude for a screen

The thing that makes the difference is asking for the **component map first**:

> Design a Part Returns list screen for Shopview. Before drawing anything,
> give me the component map — every element and which `SV` component provides
> it — and flag anything the system doesn't have.

You will get back a short list. Read it, correct anything wrong, then say go.
This is faster than reviewing a finished screen, and it is where invented
components get caught.

---

## How the system is put together

```
colors_and_type.css    THE token file. Colours, type, spacing, radii, shadows,
                       header geometry. The only file that may define --sv-*.
components.css         The component layer. Every `sv-*` class. Defines no
                       tokens and redefines no :root variable.
components/tokens.js   SV_T — token accessors for React, so components never
                       type a var() string by hand.
components/
  sv-components.jsx    The React components. No hex, no font name, no themed
                       value anywhere in the file.
index.js               THE entry point. Publishes everything on `SV`, plus
                       SV.inventory(), SV.GAPS and SV.missing().
work-orders.jsx        The Work Orders product layer — the screen chrome, the
                       table, the crew avatars, the cell renderers. Sorts last
                       in the bundle, so everything it needs already exists.
Template - *.html      Two complete starting screens. Begin here.
preview/               Spec cards — the rendered documentation for each
                       component. These are pictures, not code to copy.
assets/                Logos and the Lucide icon set.
fonts/                 Inter, three optical sizes.
ui_kits/shopview-app/  The original demo app. Superseded by the templates;
                       kept so older artboards keep rendering.
```

### Loading it

```html
<link rel="stylesheet" href="colors_and_type.css">
<link rel="stylesheet" href="components.css">
<script src="lucide-icons.js"></script>
<script src="theme-toggle.js"></script>
<script type="text/babel" src="components/tokens.js"></script>
<script type="text/babel" src="components/sv-components.jsx"></script>
<script type="text/babel" src="index.js"></script>
```

Order matters. `index.js` logs an error if a core component is missing.

### After anything is pushed, make one edit in the app

`_ds_bundle.js` is generated, and it regenerates **only when someone edits a
file inside Claude Design**. Pushing files into the project does not rebuild it,
and neither does opening the Design System tab. Until that edit happens, the
bundle still serves the previous version of every source — silently, with no
warning anywhere.

So the workflow is: push whatever batch of changes, then open the project and
make one small edit — any file, even a space. That rebuild is what makes the
changes real for every consuming project.

To check whether the bundle is current, compare the `sourceHashes` entry in the
bundle header with the file's own hash (sha256, first 12 hex characters). If
they differ, the bundle predates the file. A consuming project's `_ds/` copy is
a snapshot on top of that, so it is at best as fresh as the last rebuild.

### Plain HTML works too

Every React component renders the same `sv-*` classes the stylesheet defines,
so a static artboard with no JavaScript gets identical pixels:

```html
<button class="sv-btn sv-btn--primary">New Work Order</button>
<span class="sv-badge sv-badge--warning">Authorization Required</span>
```

---

## Content fundamentals

Shopview copy is **direct, short and verb-first**. It reads like a
professional tool for busy shop managers — no marketing, no friendliness
performance.

- **Functional, not friendly.** The product is a system of record; copy gets
  out of the way.
- **Imperative verbs** on primary actions: *New Work Order*, *New Line*,
  *Authorize*, *Decline*, *Complete*, *Add Part*, *New Inventory Part*. Never
  *OK*, *Submit*, *Click here*, or a bare *New*. Prefer *Delete Part* over
  *Delete*.
- **Domain language over generic UI language.** *Work Order*, *Line*, *Part*,
  *Bin Location*, *Service Advisor*, *Lead Technician*, *IBS#*, *VIN*,
  *Licence plate*, *Eng. Hr.*, *Milage* — not "item", "entry", "task".
- **Title Case** for product nouns, buttons and tabs. **Sentence case** for
  helper text, errors and guidelines.
- **No emoji. No first-person plural.** The product never calls itself "we";
  users are addressed obliquely (*My Work Orders*).
- Buttons trigger actions; links navigate. Never conflate them.
- One primary button per view. Never two side by side.
- Labels are always visible. Placeholders are examples, not label substitutes.
- Semantic colour always pairs with text or an icon — colour alone never
  carries state.
- Error messages explain what is wrong **and** how to fix it.

### Status vocabularies

Two of them, and they are not interchangeable.

**Work order** (authorization flow) — Draft, Imported, Estimate, Requested,
Authorization Required, Awaiting, Review, Authorized, Approved, In Progress,
Declined, Completed.

**Finance** (payment flow) — Estimate, Invoiced, Awaiting, Partially Paid,
Overdue, Unpaid, Paid.

```jsx
<StatusBadge status="Authorization Required" vocabulary="workOrder" />
<StatusBadge status="Partially Paid"        vocabulary="finance" />
```

---

## Visual foundations

### Colour

A blue-led utilitarian system: one action blue, a cool slate-grey ladder for
structure, four semantic tones for status. Teal, cyan, violet and pink are
reserved for categorical data (`--sv-cat-*`), never decoration.

- **Primary** `#257CFF` — buttons, active tabs, links. Pantone 2727 C.
- **Neutrals** 11 steps, `#FCFCFD` (grey-25) → `#121926` (grey-900).
- **Success** `#16B364` · **Warning** `#F79009` · **Danger** `#F04438` ·
  **Info** `#257CFF`.

**Read semantic tokens, not these hexes.** `--sv-accent`, `--sv-surface`,
`--sv-text-primary`, `--sv-border-default`, `--sv-success-fill` and their
siblings are redefined under `[data-theme="dark"]`, so a component built on
them themes for free. Raw palette steps (`--sv-grey-500`, `--sv-primary-500`)
are light-only — using one is a bug that only appears in dark mode.

Rules: never grey for interactive elements except disabled. Body text never
lighter than grey-500. Badges are tinted pills with a darker text, not solid
chips.

#### Aliases — pick the canonical one

| Use | Not |
|---|---|
| `--sv-danger-*` | `--sv-error-*` |
| `--sv-border-default` | `--sv-border` |
| `--sv-text-*` | `--sv-fg-*` |
| `--sv-surface` / `--sv-surface-canvas` | `--sv-bg-surface` / `--sv-bg-app` |
| `--sv-scrim` | `--sv-overlay` |
| `--sv-accent` | `--sv-brand-blue` (does not theme) |

`--sv-text-inverse` and `--sv-text-on-accent` are identical in light and
**different in dark**. Not interchangeable.

### Type

**Inter** throughout. `Inter` is the 18pt cut (UI, body); `Inter Display` is
the 28pt cut for large headlines.

| Step | Size / line-height / weight |
|---|---|
| H1 | 30 / 38 / 600, tracking −0.01em |
| H2 | 24 / 32 / 600 |
| H3 | 20 / 28 / 500 |
| H4 | 16 / 24 / 600 |
| Body | 14 / 20 / 400 (medium 500, semibold 600) |
| Body 2 | 12 / 16 / 500, tracking 0.01em |
| Dense | 13 / 18 — table body, toast timestamps (`--sv-dense-*`) |
| Micro | 11 / 14 — badges, kbd chips, uppercase eyebrows (`--sv-micro-*`) |
| Caption | 10 / 14 / 600, tracking 0.015em |

`Dense`, `Micro`, the bold weight `--sv-body-bold-weight` (700) and the two
tracking tokens (`--sv-tracking-wide` 0.02em, `--sv-tracking-wider` 0.04em) are
**additions, not part of the Figma scale.** The component specs use those
values and the numbered scale has no step for them, so they are named for the
job they do rather than by number — that way the numbered scale stays exactly
as Figma defines it. Add more steps here when a spec needs one; never inline a
literal in `components.css`.

Minimum text size 12px. Body must meet 4.5:1 contrast.

### Spacing, radii, elevation

Spacing tokens are **indexed, not px**: `--sv-space-4` is **16px** (index × 4).
Scale: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32.

Radii: `xs` 4 · `sm` 6 · `md` 8 · `lg` 12 · `xl` 16 · `pill` 9999.
Buttons, inputs, menus, tables and alerts are `md`. Cards, modals and toasts
are `lg`. Badges and avatars are `pill`.

Elevation: use `--sv-elev-0..3-bg/-shadow/-border`. The older
`--sv-shadow-xs/sm/md/lg` do **not** theme and should not be used on anything
raised. Focus is always `--sv-focus-ring` — 4px blue glow, always visible.

### Layout

Fixed 64px header + optional 300px side panel + scrolling content. The header
reads `--sv-header-height`, `--sv-header-padding` (asymmetric: `12px 20px 12px
28px`), `--sv-header-gap`, `--sv-header-logo-size`, `--sv-header-control-height`
and `--sv-header-control-radius`. Change the token, never the component.

A 48px bar is `--sv-header-v2-*` — a **different component**, not a drift.

### Motion

Hover is a colour shift plus a lift (elev-1 → elev-2), never a scale. Press is
a darker fill and no shadow, never a shrink. Transitions are 120–160ms
ease-out; floating-label movement is `160ms cubic-bezier(.2,.8,.2,1)`. No
bounce, no spring, no entrance animation on route change.

### Imagery

No illustrations, no background patterns, no gradients, no photography, no
frosted glass. Modal scrim is `--sv-scrim`, unblurred. Disabled elements drop
to ~40% opacity.

---

## Iconography

Outlined line icons, 1.5–2px stroke, rounded joins, at 16 / 20 / 24 / 32px.
**Lucide** (87 glyphs, listed in `lucide-icons.js`) stands in for Shopview's
internal library — the style matches 1:1. Use `<SV.Icon name="wrench" />` or
`svIcon('wrench', 20)`.

Never emoji. Never a unicode glyph as an icon. SVG with `currentColor`, never
an icon font.

---

## Known gaps

`SV.GAPS` is the live list; it is also what `SV.missing()` reads. Currently no
date picker (calendar grid), file upload control, pagination, stepper/wizard,
combobox/typeahead, charting component, or loading/skeleton states.
Illustrated empty states are a deliberate omission — Shopview empty states are
text only. Mobile layouts are not defined; the product is desktop-first.

---

## Known debt

Honest list, so nobody mistakes any of it for the standard:

- `ui_kits/shopview-app/` and the older root `.jsx` files predate the component
  layer. Colours are tokenised but type and geometry are still literal
  (`fontSize: 14`, `fontWeight: 500`). Migrate to `SV` components when you
  touch one; do not copy their patterns into new work.
- `cards.jsx` is a standalone self-mounting page (print business cards), not a
  component library. It hijacks `#root` if loaded alongside anything else.
- `colors_and_type.css` declares `--sv-border-strong` and the four
  `--sv-*-fill` tokens **twice**. The later, Tier-2 declaration wins — the
  fills resolve to the `-50` steps, not `-100`. Reading only the top of the
  file gives the wrong value.
- `--sv-warning-200` is referenced by `global-search.jsx` but never defined.
- `_adherence.oxlintrc.json` knows 284 tokens; `_ds_manifest.json` knows 455.
  The lint cannot enforce the 171 it has not been told about.
- `filter-bar-sa.jsx` and `filter-chip-sa.jsx` still call `window.svIcon()` at
  module scope and therefore abort inside the generated bundle. Harmless today —
  `filter-bar.jsx` and `filter-chip.jsx` sort after them and win — but it is a
  silent failure, and it is the same bug that once cost the bundle its entire
  filter layer. Never evaluate another file's global at the top level of a file.
- The Board and By Lead Tech views live in the Work Orders page as Claude Design
  canvas markup plus a ~1000-line class component, not in this system. That is a
  deliberate choice — it keeps them editable in the app — but it means a change
  to those views does not propagate anywhere.

---

## Sources

Derived from the official ShopView Design System Figma file
(`https://www.figma.com/design/4v5M4z7Xj1Uw6qxrM61ktB/ShopView-Design-System`) —
28 pages across Foundations and Components. The Dara playground screens in that
file are exploratory and **not** canonical; the component pages are.
