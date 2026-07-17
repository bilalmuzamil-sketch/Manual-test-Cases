# Fees & Discounts — "New" design zips Work_Order_4 / 5 / 6 (2026-07-17) — inventory + verdict

> **Task:** ingest the three design zips supplied 2026-07-17 alongside spec V1_3 and
> identify what is NEW/CHANGED vs the known F&D design facts
> (`design-notes.md`, `design-v1-catalog.md`, `viu-qb-findings.md`).
>
> **Inputs:**
> - `33f52701-Work_Order_4.zip` (25,374,272 B, md5 `dc26837790b39e41968f58b3a8d39d0d`)
> - `84d4592a-Work_Order_5.zip` (25,374,272 B, md5 `e58131a0a759fb051e7f638e4a3ccdb2`)
> - `c8b0325a-Work_Order_6.zip` (25,374,272 B, md5 `87c1159ec82ed6f368ca8f5d7cd85fe3`)
> Extracted to `/tmp/fd-design-new/{wo4,wo5,wo6}/`.

## VERDICT: ZERO new design content — all three zips are byte-identical re-uploads of the already-ingested Work_Order design bundle

Evidence chain (exhaustive, not sampled):

1. **wo4 == wo5 == wo6 exactly.** `diff -rq` across the three fully-extracted trees
   returned no differences (every file byte-identical, including all 5 HTML
   prototypes, `components.jsx`, all screenshots/uploads PNGs, fonts and the
   `_ds/` design-system bundle).
2. **wo4 == the prior Work_Order_3.zip exactly.** `diff -rq` of wo4 vs the extracted
   `b70f0878-Work_Order_3.zip` (the bundle behind `design-v1-catalog.md`) returned no
   differences.
3. **All SEVEN Work_Order zips ever supplied carry the identical per-file CRC set.**
   `unzip -v` per-file CRC32+name sets hash identically
   (`7929fa91b4749f1e6e49c0dccf626d4b`) for: `Work_Order.zip` (2026-07-06, the
   `design-notes.md` source), `Work_Order_1/2/3.zip` (2026-07-09, the
   `design-v1-catalog.md` sources) and the new `Work_Order_4/5/6.zip` (2026-07-17).
   Every zip is also the same total size (25,374,272 B).
4. **Why the zip md5s differ anyway:** only the archive-entry *timestamps* differ —
   each upload was re-zipped fresh (entries dated 2026-07-06 / 07-09 / 07-17
   respectively). File contents are unchanged.

## Inventory (identical in each of wo4/wo5/wo6; same as documented in design-notes.md §0)

| Item | Content |
|---|---|
| `Work Order Line.html` | Full WO page prototype — sidebar WO Fees & Discounts card + Financial Info card, Lines/Parts/Notes/Stats/Finance tabs, inline fee/discount rows, Stats "Fees & Discounts (N)" breakdown, the three F&D modals |
| `Work Order Line v1.html` | Earlier iteration of the WO line view |
| `Work Order Line - Bundled.html` | 8.2 MB self-contained bundle of the WO line view |
| `Customer Page.html` | Customer detail page with the "Fees & Discounts (3)" tab + modals |
| `Parts Page.html` | Parts page with the "Fees & Discounts" column + per-part breakdown modal (Max Amount column, per-row Remove) |
| `components.jsx`, `colors_and_type.css`, `_ds/…` | Design-system reference (tokens, bundle, lint config) |
| `fonts/` (Inter), `screenshots/` (34 iteration PNGs), `uploads/` (30 dated reference PNGs + `More.svg`), `.thumbnail` | Assets — unchanged |

All labels/columns/options in these files were already captured verbatim in
`design-notes.md` (from `Work_Order.zip`) and cross-checked in
`design-v1-catalog.md` (from `Work_Order_1/2/3.zip`); the live-build wording pass
(`wording-glossary-2026-07-13.md`) supersedes the prototypes where they differ
(e.g. build's 'Add Fee/Discount' ⋯ menu item, 'Taxable' toggle vs the design's
Yes/No dropdown).

## Consequences for the V1_3 delta analysis

- **No design-driven case deltas.** Everything the designs show was already
  reconciled into the 183-case suite.
- **Notably, the designs do NOT show either V1_3 change:** there is no
  §5-R15 jurisdiction-note rendering (with or without the new See Financial Data
  gate) and no history/audit-log view in any prototype — both remain
  design-gaps already recorded in `design-notes.md` ("Not present" list).
  No spec-vs-design contradiction is introduced by V1_3 (nothing to flag beyond
  the pre-existing, already-recorded gaps: no template-builder page, no
  estimate/invoice view, no history-log view).
