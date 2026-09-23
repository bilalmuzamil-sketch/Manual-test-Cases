---
name: Shopview Design System
description: Shopview is shop management software for heavy-duty service shops (semi-trucks, tractors, trailers, fleet). Invoke this skill whenever the user asks to design, mock, prototype, or extend any Shopview product surface — work orders, schedule, customers, parts/inventory, estimates, invoices, reports — or asks for "Shopview style" anything. Covers the component library, copy tone, color/type tokens, and the screen templates.
---

# Shopview Design System

Everything the system offers is published on one namespace, `SV`, by `index.js`.
There is no second place to look and nothing to reconstruct by hand.

## STOP — do this before you draw anything

Before writing a single line of markup, produce a **component map**: every
element the screen needs, and the `SV` component that provides it.

```
Screen: Part Returns list
  page shell ............ SV.PageShell
  top bar ............... SV.AppHeader        (inside PageShell)
  title actions ......... SV.Button ×2
  summary tiles ......... SV.StatCard ×4
  tab strip ............. SV.Tabs
  the table ............. SV.Table
  status column ......... SV.StatusBadge (vocabulary="workOrder")
  row overflow menu ..... SV.Menu + SV.MenuRow
  confirm delete ........ SV.Modal variant="confirm"
  date filter ........... GAP — no calendar component exists
```

Rules for that map:

1. **Every row must name an `SV` component.** Run `SV.inventory()` to see the
   full list grouped by purpose.
2. **A row you cannot fill is a GAP, not a licence to invent.** Call
   `SV.missing('date picker')` — it returns the exact sentence to put in front
   of the user. Then ask. Do not build a lookalike and move on.
3. **Show the map to the user before building.** It takes ten seconds to read
   and it is where mistakes get caught, rather than after a screen is drawn.

Skipping this step is the single failure this system exists to prevent: a
screen gets built with hand-rolled inputs, badges and headers that look
almost-right and drift a little further from the product every time.

## Loading the system

```html
<link rel="stylesheet" href="colors_and_type.css">   <!-- tokens, the only one -->
<link rel="stylesheet" href="components.css">        <!-- component layer -->

<script src="lucide-icons.js"></script>
<script src="theme-toggle.js"></script>
<script type="text/babel" src="components/tokens.js"></script>
<script type="text/babel" src="components/sv-components.jsx"></script>
<script type="text/babel" src="index.js"></script>
```

Load order matters and is not negotiable. `index.js` prints a console error if
a core component is missing, so a broken load is loud rather than silent.

## Don't start from a blank page

Two ready screens live at the project root, and appear in the Design System tab under **Patterns**, named "Template · …". Copy the closer one and change the
three marked blocks. They are the fastest correct path and they are what a
non-designer should always begin with.

| Building… | Copy |
|---|---|
| Any list / index / table screen | `Template - List View.html` |
| Any record / detail / form screen | `Template - Detail View.html` |
| A screen with several views of the same records | the **Work Orders page** (see below) |

### The Work Orders page is the third starting point

For anything richer than a single table — a screen that shows the same records
as a list, grouped by someone, and as a board — duplicate the **Work Orders
page** in the Work Orders Page project rather than building from a template.

It is the only place the Board and By Lead Tech views exist. They are written
in Claude Design's canvas markup so they stay editable in the app, and they are
**not** components in this system. Do not try to import them and do not rebuild
them from scratch — copy the page and replace the parts you need.

What the page gets from this system is the chrome: `SV.WorkOrdersScreen` frames
it and renders the table for the list view, and whatever the page passes as
`children` for every other view. So a duplicated page already has the header,
tabs, search, filters, density menu, column menu and view switch wired, and
what you change is the views inside it.

## The component surface

Run `SV.inventory()` for the live list. In short:

| Group | Components |
|---|---|
| Layout | `PageShell` `AppHeader` `SidePanel` `Card` `StatCard` |
| Actions | `Button` `SplitButton` `Menu` `MenuRow` `MenuSection` `MenuSep` |
| Forms | `Input` `Select` `Checkbox` `Radio` `Toggle` |
| Data | `Table` `Badge` `StatusBadge` `Tabs` |
| Feedback | `Modal` `Alert` `Toast` `Tooltip` |
| Navigation | `Breadcrumbs` `Tabs` |
| Filtering | `FilterChip` `FilterDropdown` `StatusDropdown` `SingleSelectDropdown` `DateRangeDropdown` `ColumnsDropdown` |
| Search | `GlobalSearchModal` |
| Product | `WorkOrdersScreen` `WorkOrdersHeader` `WorkOrdersFilterBar` `WorkOrderTable` `UserMenu` `TechStack` `StaffAvatar` `ViewSwitch` `LayoutSwitch` `FilterCheckbox` |
| Icons | `Icon` `svIcon` (87 Lucide glyphs) |

### The Work Orders product layer

`work-orders.jsx` holds the pieces the Work Orders screen invented and the
system now owns. They carry product decisions, not just markup:

| | |
|---|---|
| `SV.WorkOrdersScreen` | the page chrome. Renders `SV.WorkOrderTable` for `view="list"` and `children` for every other view. |
| `SV.WorkOrderTable` | renders whatever `COLUMN_DEFS` says, in that order. `rowHeight` drives three densities: 36 / 48 / 64. Pass `rows`; `SV.WO_DEMO_ROWS` is the sample set. |
| `SV.TechStack` | overlapping crew avatars, `+n` past five, name on hover. |
| `SV.StaffAvatar` | photo where one exists, initials otherwise — including when the photo fails to load. |
| `SV.ViewSwitch` | Table · By Lead Tech · Board · Details. **Kanban is called Board** everywhere a user can see it; the prop contract is still `view="tech"` + `layout="columns"`. |
| cell helpers | `SV.authCell` `SV.partsCell` `SV.personCell` `SV.assetCell` `SV.crew` `SV.hoursLabel` — each takes a row, returns a node. |

Adding a column is a data edit in `columns-dropdown.jsx`, not a code edit:
`COLUMN_DEFS` is both the definition list and the column order. `ColumnsDropdown`
takes `allowKeys` to narrow what a view may show, and `hideLocked` to drop the
always-on columns from the menu.

`Approved` is **teal**, not info — approved is not the same kind of state as in
progress, and the blue read as "active".

**Two names have a generic and a product version.** `SV.AppHeader` is the
token-driven bar from `preview/header.html`; `SV.WorkOrdersHeader` is the real
Work Orders bar (six nav items, search, time clock). `SV.Checkbox` takes a
label and an `onChange`; `SV.FilterCheckbox` is the presentational tri-state
box used inside filter dropdowns. Reach for them through `SV`, never through
the bare global — the bare name is whichever file loaded last.

If an icon name does not exist, `Icon` warns in the console instead of
rendering an empty box. Do not ignore that warning; either pick a glyph that
exists or vendor the new one into `lucide-icons.js`.

`Button` variants are `primary | secondary | tertiary | link | danger`.
Only one size is specified (36px); `size="sm"` (32px) is an approved extension
for dense table rows.

### Two status vocabularies — they are not interchangeable

A work order moves through **authorization**; an invoice moves through
**payment**. Pass the right one:

```jsx
<StatusBadge status="Authorization Required" vocabulary="workOrder" />
<StatusBadge status="Partially Paid"        vocabulary="finance" />
```

`SV.WORK_ORDER_STATUS` and `SV.FINANCE_STATUS` are the maps.

## Known gaps — ask, never invent

`SV.GAPS` is the live list. Currently: date picker (calendar grid), file
upload control, pagination, stepper/wizard, combobox/typeahead, charts,
loading and skeleton states, mobile navigation. Empty-state illustrations are
a deliberate omission — Shopview empty states are text only.

## Hard rules

**Tokens.** Never write a hex, an `rgb()`, or a font name. Every colour is a
`var(--sv-*)` token. `colors_and_type.css` is the only file that may define
one; never add a second token file and never redefine a `:root` variable. If a
surface genuinely needs different values, scope them to a wrapper class.

Read **semantic** tokens (`--sv-surface`, `--sv-text-primary`, `--sv-accent`,
`--sv-border-default`, `--sv-success-fill`…) and dark mode works for free.
Raw palette steps (`--sv-grey-500`, `--sv-primary-500`) do **not** flip — using
one is a bug that only shows up in dark mode.

Two aliases exist for the same values: use `--sv-danger-*` not `--sv-error-*`,
`--sv-border-default` not `--sv-border`, `--sv-text-*` not `--sv-fg-*`,
`--sv-scrim` not `--sv-overlay`.

`--sv-text-inverse` and `--sv-text-on-accent` are identical in light and
different in dark. They are not interchangeable.

**Elevation.** `--sv-shadow-*` does not theme; `--sv-elev-0..3-*` does.
Anything raised uses `elev`.

**Never call another file's global at module scope.** The generated bundle
concatenates every source alphabetically, each in its own `try`, so a file can
only use a global that a file sorting *earlier* has set. Calling one too early
throws, the `try` swallows it silently, and every `window.X = X` below that line
never runs — the file vanishes from the bundle while still working fine on a
standalone artboard that loads scripts by hand. This cost the system its whole
filter layer once. Read globals inside a render or behind a getter, never at the
top level.

**Header geometry** comes from `--sv-header-*`. If the bar is the wrong
height, change the token — never the component. A 48px bar is `--sv-header-v2-*`,
a different component, not a drift from this one.

**Copy.** Verb-first buttons (*New Work Order*, *Authorize*, *Add Part*) — never
*OK*, *Submit*, or a bare *New*. Domain language (*Work Order*, *Line*, *Part*,
*Bin Location*, *Service Advisor*, *IBS#*, *VIN*, *Eng. Hr.*) — never "item",
"entry", "task". Title Case for product nouns and actions; sentence case for
helper and error text. One primary button per view. No emoji, no "we", no
exclamation marks. Error messages say what is wrong *and* how to fix it.

**Density.** Shopview screens are text- and data-dense: tables, status badges,
inline metadata, card-grouped context. No hero imagery, no gradients, no
marketing cards, no whitespace-heavy landing-page layouts, no photography.

## Before you deliver

- [ ] Component map was produced and every row named an `SV` component or a stated gap.
- [ ] Started from a `Template - …` file, or can say why not.
- [ ] Zero hex codes, zero `rgb()`, zero font names in the diff.
- [ ] Semantic tokens only — no raw palette step outside `colors_and_type.css`.
- [ ] Rendered and checked in **both** themes (`ShopviewTheme.set('dark')`).
- [ ] Copy is verb-first, domain-specific, Title Case on actions.
- [ ] One primary button per view; status shown as badge + word, never colour alone.
- [ ] Any gap was raised with the user rather than filled in silently.
