# Fees & Discounts V1 — Design Bundle Catalog (v1 closeout)

> **Sources:** three uploaded zips —
> `66b74d92-Work_Order_1.zip`, `aaa295ff-Work_Order_2.zip`, `b70f0878-Work_Order_3.zip`.
> Unzipped to `/tmp/fd-design-v1/{1,2,3}/`.

## Key fact: the three "bundles" are byte-identical
`diff -rq` across bundles 1↔2 and 1↔3 returns **no differences** (rc=0). All HTML,
`components.jsx`, the design-system folder, fonts, screenshots, and uploads have
identical md5s. So this is **one design bundle delivered three times**, not three
distinct design revisions. Treat it as a single "Work Order" design bundle.

## What's in the bundle (the design-relevant files)
Everything else is the shared ShopView design system (`_ds/…`), Inter font TTFs,
and a `colors_and_type.css` — boilerplate, not F&D-specific.

The **F&D design artifacts** are:

| File | What it shows |
|---|---|
| `Work Order Line.html` | Current WO line design incl. inline fee/discount rows |
| `Work Order Line v1.html` | Earlier iteration of the WO line |
| `Work Order Line - Bundled.html` | Bundled variant of the WO line |
| `Customer Page.html` | Customer record with default fees/discounts area |
| `Parts Page.html` | Parts sale surface (Story 11 Part Sales) |
| `components.jsx` | React component source backing the mockups |

### Screenshots (design intent / evidence) — `screenshots/`
Notable F&D ones (confirm the design intent that our findings compare against):
- `stats-table.png`, `stats-v2.png` — **Statistics tab F&D layout**: shows a
  **per-adjustment table** (each fee/discount its own row with %/Amount), NOT the
  aggregate roll-up the live build shows. **This is the design that PO Q1's answer
  ("B — it regressed in the spec") refers to** — the per-row layout was in the
  design and should be restored. Directly supports **BUG-FD-2 / FDBUG-6 /
  FD-STATS-001** being a defect, not a deviation.
- `01-show-more.png`, `01-show-more-state.png`, `02-show-more.png`,
  `02-show-more-state.png`, `before-expand.png` — **"Show more / show less"
  collapse** for multiple line-level adjustments. **This is the design PO Q5's
  answer ("B — fixed in the design with a show-more, not defined in the spec")
  refers to.** Supports **BUG-FD-5 / FD-INLINE-003** being a defect.
- `fees-lines.png`, `fees-equal.png`, `fees-spacing.png`, `preview.png`,
  `preview-bottom.png` — inline line-table fee/discount rows + estimate/invoice
  preview layout.
- `wo-sidebar-cards.png`, `wo-sidebar-check.png`, `wo-line-new.png`,
  `wo-line-stats.png`, `wo-asset-card.png` — the "WO Fees & Discounts" sidebar
  card + line-table stats block.
- `01-final.png` / `02-final.png` / `03-verify.png` / `artboard*.png` — final
  artboards.

`uploads/` holds ~30 dated working screenshots (`Screenshot 2026-06-03…06-11`)
plus `More.svg` — iteration history, no new surfaces.

## Diff vs our `design-notes.md`
- **No new screens.** The surfaces in this bundle (WO line + inline rows, WO
  sidebar card, Financial Info, Statistics, Customer page defaults, Parts page,
  estimate/invoice preview) are **already documented** in `design-notes.md`. This
  bundle is the visual source those notes were derived from — nothing here adds a
  screen we haven't already catalogued.
- **Two design decisions the bundle makes explicit** (and that the LIVE BUILD
  regressed, per the PO answer sheet):
  1. **Statistics tab = per-adjustment rows** (`stats-table.png` / `stats-v2.png`).
  2. **Line-level "Show more / Show less" collapse** when a line has ≥2
     adjustments (`*show-more*` + `before-expand.png`).
  Both are confirmed by PO answers Q1=B and Q5=B (see `data-sheet-source.md`) as
  the intended behavior — i.e., the live build deviates from the design and must
  be fixed. No change to `design-notes.md` content is required; add a pointer that
  these two items are design-confirmed defects (see reconciliation file).

## Not present
No new dialog states, no Processing-Fee builder mockup, no QuickBooks-settings
mapping screen in this bundle — consistent with those areas being either
UI-not-built (Processing Fee builder) or settings-side (QB item mapping).
