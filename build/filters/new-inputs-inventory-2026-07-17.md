# Filters project — new design-input inventory (2026-07-17)

Inventory + high-level cataloging ONLY (no deep design-capture pass yet; no repo
writes). Inputs: 1 zip + 9 PDFs, all uploaded 2026-07-17 13:03 to
`/root/.claude/uploads/dd1d42ba-2c47-5229-9b17-b8f94e3eb99a/`.
Reconciliation baseline: `build/filters/design-notes.md` (§A inventory, §D
completeness/ruling, §Z final-set map) + `build/filters/design-screens/` (58 PNGs).

---

## 1. Shopview_Design_System.zip (`04a6ca45-…`, 16 MB, 281 files → /tmp/design-system/)

**What it is:** a **Claude Code Agent-Skill package** (has `SKILL.md` front-matter
"Shopview Design System") wrapping the full ShopView design system, PLUS an
**interactive coded prototype of the Filters feature itself**. NOT a Figma export;
no new Figma frames.

Structure (top-level):
- `SKILL.md` + `README.md` — skill manifest + full system reference (says it is
  derived from Figma file `ShopView Design System.fig`, 28 pages of Foundations +
  Components).
- `colors_and_type.css` (in `design-md/`) — all design tokens as CSS variables.
- `fonts/` (18 MB) — Inter TTFs (18/24/28pt, all weights).
- `assets/`, `design-md/assets/` — 126 SVGs: logos + the Filters chip icons
  (icon-status, icon-customer, icon-technician, icon-advisor, icon-asset,
  icon-filter-toggle, icon-search, icon-columns).
- `preview/` — 28 standalone HTML token/component cards (buttons, badges, inputs,
  tables, tabs, modals, menus, colors, type, spacing… incl. `global-search.html`).
- `ui_kits/shopview-app/` — working React/JSX demo app (components.jsx,
  chrome.jsx, screens.jsx: WO list / WO detail / Schedule).
- **Filters-specific prototype code (root + `design-md/`):** `Filters.html`,
  `filter-bar.jsx` ("full toolbar context with table backdrop, plus interactive
  demo"), `filter-chip.jsx`, `filter-dropdown.jsx`, `mobile-filters.jsx`,
  `variation-a.jsx` / `variation-b.jsx`, `tweaks-panel.jsx`,
  `screenshots/filters-current.jpg`.
- `uploads/` (5.8 MB) — designer's working screenshots/SVGs (incl. some Global
  Search images: "Persisting search dropdown.png", "recent searches.png" — this
  pack serves the whole app, not just Filters).
- Brand one-offs: AI Agent Icon, Alberta Diesel Day email, Business Cards,
  Maintenance pages; `_ds_manifest.json` + `_ds_bundle.js` + `design-canvas.jsx`
  (canvas tooling).

**Purpose (apparent):** Branko's "Claude design" = a design-system skill pack so
AI tooling can produce ShopView-styled surfaces, bundled with a live coded
prototype of the new filter bar. **Detail noted:** `filter-bar.jsx` hardcodes the
9 statuses ending in **"Reported"**, while the Figma dropdown/spec list ends in
**"Imported"** — prototype transcription slip to flag, not to codify.

---

## 2. The 9 PDFs — page counts + content + reconciliation verdicts

All 9 are single-page Figma exports (frames or whole section canvases).

| # | PDF | Pages / size (pts) | Content | Figma node(s) | Verdict |
|---|-----|--------------------|---------|---------------|---------|
| 1 | `a4b3614b-Mobile_1.pdf` | 1 / 402x874 | Mobile WO list, OLDER iteration: tabs "Estimates / Work Orders / Completed / **By Status**", toggles "**My work orders**" + "**Asset here?**", sort icon; cards without chips row | **12141:19858** (page-level "Mobile", older iteration) | **SUPERSEDED-content-reshared** (first render we have — never captured before) |
| 2 | `461a7093-Customer_v1.pdf` | 1 / 284x514 | "Search customer" popover, rows with **leading checkboxes** (vs the 20.4 final's plain rows), Clear selection footer | **11842:14069** ("Customer v1", page-level) | **SUPERSEDED-content-reshared** (first render; a DISTINCT checkbox variant of the Customer dropdown) |
| 3 | `503edaad-Customer_v1_selected.pdf` | 1 / 284x580 | Same popover with 3 token chips + clear-all, selected rows show **checked checkboxes** (20.4 final uses right-side ✓ instead) | **11842:16879** ("Customer v1 selected", page-level) | **SUPERSEDED-content-reshared** (first render; conflicts with 20.4 selected-dropdown pattern) |
| 4 | `0a656feb-Work_Order_Explorations_14.4.2026.pdf` | 1 / 8184x6236 (13.4 MB) | The ENTIRE superseded WO-14.4 section canvas: 9 desktop frames (Steps 1–6 + 3 "WO - Separate Cards") + 7 popovers/menus + 3 label strips ("V1 without title / V2 with title / V3 Optional") — chip bar above toolbar, My-Work-Orders + Asset-On-Site as TOGGLE chips | Section **11824:3241** (all 19 children per §A.2) | **SUPERSEDED-content-reshared** (first renders we have — no API renders existed) |
| 5 | `641a6291-Work_Order_Explorations_20.4.2026.pdf` | 1 / 8184x8348 | The ENTIRE 20.4 section canvas: 5 desktop frames + 13 mobile frames (= the 18 final WO frames) + the 7 desktop dropdown popovers + 2 label strips | Section **11854:23562** (all 27 children per §A.1) | **DUPLICATE-of-captured** — every frame already committed (18 final via ZIP/API + 7 popovers & 2 strips retained as API renders). No new frames. |
| 6 | `5aec5b0c-Mobile.pdf` | 1 / 402x874 | Mobile WO list in a **chips-SELECTED state**: Status + Customer chips blue/active; toolbar Search + New Work Order (NO sort icon) — a state NOT among the 2 final Mobile frames (both show all-grey chips + sort icon) | **11884:15901** (page-level "Mobile", superseded; best match by size/name — only page-level mobile never rendered besides #1) | **SUPERSEDED-content-reshared** (first render; shows a mobile "chips applied" state absent from the final set) |
| 7 | `79d40dc1-Sorting_Work_In_Progress.pdf` | 1 / 2132x5272 | The 4 Sorting WIP steps: sort (↑↓) toolbar icon → menu "Status / WO Number" → sort-rule popover ("Status / Ascending ⌄ / ✕", "+ Add Sort", "Delete sort") + a **sort chip in the filter bar** → two stacked sort rules (Status + WO Number) | Section **11985:9685** (4 Step frames per §A.3) | **SUPERSEDED-content-reshared** (first renders; was excluded as a separate/WIP feature) |
| 8 | `1c9fbf5e-Reports_Exploarations_21.4.2026.pdf` | 1 / 11071x11084 | The ENTIRE Reports section canvas: the 23 report frames + 7 label strips — **INCLUDING the QB Unexported "Journal Entries (4)" tab frame that was NOT in the final ZIP** | Section **11903:10573**; the new frame = **11982:8998** | **NEW-content (1 frame)** — 22/23 duplicate of captured; **11982:8998 Journal Entries tab body is NEW**: filter chips **User ⌄ / Date ⌄ / Type ⌄**, columns Date / Type / No. / **User** / Error / Export Manually / Mark As Exported; 4 rows, Types "Work Order Reverse" / "Manual Adjustment", per-row blue Export + outline Mark As Exported. Closes the one known capture gap. |
| 9 | `3eca87ba-Parts_Exploarations_20.4.2026.pdf` | 1 / 3788x6574 | The ENTIRE Parts section canvas: 8 screens (Part Sales, Purchase Orders, Inventory, Vendor Invoices, Catalog, Vendors, Returns, Credits) + the Part-type Core/Non-Core dropdown | Section **11884:16885** (9 children per §A.5) | **DUPLICATE-of-captured** (9/9 already committed from the ZIP) |

**Tally: 2 pure duplicates (WO-20.4, Parts) · 1 with new content (Reports → JE
tab 11982:8998) · 6 superseded-content re-shares (Mobile_1, Mobile, Customer v1,
Customer v1 selected, WO-14.4, Sorting)** — wait, 5 superseded PDFs + 1 zip; PDF
count: 2 duplicate + 1 new-content + 5 superseded-reshared + 1 zip (not a frame
source) = 9 PDFs ✓ (Mobile_1, Customer_v1, Customer_v1_selected, WO-14.4,
Mobile, Sorting = 6 superseded → 2+1+6 = 9 ✓).

---

## 3. ⚑ SUPERSEDED-FRAMES FLAG (raise with the user/Branko)

**6 of the 9 PDFs re-share exactly the content the designer ruled OUT of the
final set on 2026-07-17** (the "ZIP = final" authoritative ruling in
design-notes §D): the WO-14.4 exploration section, the Sorting WIP section, the
older/alternate page-level Mobile frames (12141:19858 / 11884:15901), and the
"Customer v1 / Customer v1 selected" page-level dropdown variants
(11842:14069 / 11842:16879). Their deliberate re-share as individual exports
suggests the design scope may be being **REVISED or EXPANDED vs the "ZIP =
final" ruling** — or they were bulk-exported for completeness. This changes the
design baseline only if confirmed.

## 4. Clarifications to ask the user (now that all 9 are in)

1. **Does this batch supersede the "ZIP = final" ruling?** Which of the re-shared
   superseded sets are now IN scope: (a) Sorting (a separate feature — would need
   new cases: sort menu, sort chip, Add/Delete sort, multi-sort), (b) the WO-14.4
   exploration (older iteration), (c) the older/alternate Mobile frames,
   (d) the "Customer v1" checkbox-variant dropdowns? Or is the batch just a
   convenience re-export and the ZIP ruling stands?
2. **Conflicting variants need a pick if in scope:** Customer v1 (leading
   checkboxes) vs the 20.4 dropdown (plain rows + right-side ✓); Mobile_1's
   "By Status" tab + "My work orders"/"Asset here?" toggles vs the final tab row
   + chip bar.
3. **QB Journal Entries tab (11982:8998) is now captured** — confirm it is part
   of the final design (it was excluded from the ZIP); if yes, its User/Date/Type
   chips join the coverage matrix.
4. **The design-system zip:** confirm its role — reference/styling aid (skill
   pack + coded Filters prototype) vs authoritative design source. Note the
   prototype's status list says "Reported" where Figma says "Imported".
5. Canonical Confluence spec URL for Filters is still TO CONFIRM (pre-existing
   open item).

## 5. Working artifacts (all in /tmp, nothing written to the repo)

- Zip extracted: `/tmp/design-system/`
- PDF renders: `/tmp/pdf-renders/` (150dpi for the 4 small frames; 12–50dpi
  overviews for the 5 canvases; 72dpi crop of the Reports QB row proving the
  Journal-Entries frame).
