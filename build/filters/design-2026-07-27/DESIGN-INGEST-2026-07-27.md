# Filters — Design Ingest + Coverage Assessment (2026-07-27)

**Task:** ingest the design inputs the user provided (a design-system ZIP + 4 Figma
node links) and assess whether we now have enough build-accurate design detail to
author the **Parts filters**, **Reports filters**, and **page-search component**
cases. **NO case authoring in this pass — capture + assess only.**

Inputs:
1. ZIP: `faa72f85-Shopview_Design_System_1.zip`
2. Figma (file `DR4gEODShYgJqkozs3mF5q`): node **11817-27678** (main Filters),
   **11884-16885** (Parts filters), **11903-10573** (Reports filters),
   **11829-8908** (page-search component).

---

## 1. What the ZIP actually is

`faa72f85-Shopview_Design_System_1.zip` = the ShopView **design-system reference
package** (a Claude-Code "skill" bundle + coded prototype + design tokens + asset
library). **293 files.** It is the SAME class of artifact PROJECT-STATE already
records as "design-system zip = reference prototype / reference aid only, NOT
authoritative frames." It is NOT a set of exported Parts/Reports filter PNG frames.

Full contents by group:
- **Design tokens / CSS:** `colors_and_type.css` (+ `design-md/colors_and_type.css`)
  — the `--sv-*` colour ramp, typography scale.
- **Fonts:** `fonts/` — 50+ Inter TTFs (not filter-relevant).
- **Coded WO filter-bar prototype (React/JSX):** `filter-bar.jsx`,
  `filter-chip.jsx`, `filter-dropdown.jsx`, `mobile-filters.jsx`, `Filters.html`
  (+ duplicates under `design-md/`) — this is the **Work Orders list filter bar**
  (Status / Customer / Lead Technician / Service Advisor / Asset chips, Clear
  filters, mobile). Top nav in the code = `["Work Orders","Schedule","Customers",
  "Parts","Reports"]` — those are just the app nav labels, NOT Parts/Reports filter
  designs.
- **Page-search / Global-Search component (screenshots):** `uploads/search
  results.png`, `uploads/recent searches.png`, `uploads/Persisting search
  dropdown.png`, `uploads/Quick Actions on Hover.png` — the ⌘K spotlight palette
  (entity tabs **All / Work Orders / Customers / Assets / Parts / Vendors / Part
  Sales**, recent-searches grouped **Today / Yesterday / Past week / Past 30 days**,
  placeholder **"Search or ask a question"**, keyboard footer **Navigate / Select /
  Close esc**, hover quick-actions **Add new line / New work order / Add part / Add
  contact / Add to work order**, match highlighting). This is node 11829-8908.
- **Design-system component library / previews:** `ui_kits/shopview-app/*.jsx`,
  `preview/*.html`, `design-md/*.jsx` (variation-a/b, tweaks-panel), `_ds_manifest.json`
  (lists pages: Filters, Global Search, Badges, Buttons, Colors, Controls, Header,
  Icons, Inputs, Logo, Menus, Modals, Notifications, Radius, Effects, Spacing, Table,
  Tabs, Tooltip, Typography). No Parts/Reports filter page in the manifest.
- **Marketing / brand assets (NOT filter-relevant):** logos, business cards,
  marketing email HTML, XCMG/MHPD logos, theme-toggle, maintenance page.
- **Misc UI screenshots (`uploads/Screenshot 2026-*.png`)** — general app shell
  reference, not Parts/Reports filter frames.

**Filter-relevant assets copied into** `build/filters/design-2026-07-27/design-system/`:
- `page-search/` — the 4 page-search screenshots.
- `wo-filter-bar-prototype/` — the WO filter-bar JSX/HTML/CSS + `_ds_manifest.json`
  + the filter icon SVGs.
(No fonts/marketing/secrets copied.)

**Bottom line on the ZIP:** it adds the **page-search component** design and a coded
version of the **already-covered WO filter bar**. It contains **NO Parts-page or
Reports-page filter frames.**

---

## 2. Figma access check

**Figma MCP is NOT available this session.** ToolSearch for
`figma get_design_context / get_screenshot / get_metadata` returned **no matching
tools** (only GitHub MCP + built-ins are present). The 4 node links therefore
**could not be rendered here**, and per the task I did NOT WebFetch the figma.com
URLs (that only returns the app shell, not the design).

**BUT re-export is NOT needed — all 4 nodes are already captured in the project:**

| Figma node | What it is | Already captured? |
|---|---|---|
| 11817-27678 | main Filters (WO page) | ✅ covered by the 18 final WO frames in `design-screens/wo20_*` + documented design-notes §A/§B; 79 cases already authored |
| **11884-16885** | **Parts filters** | ✅ **already captured** — this is design-notes **§A.5 "Parts Exploarations"** = the **9 `parts20_*` PNGs** in `build/filters/design-screens/`, each with exact chips + columns documented (§B.5) |
| **11903-10573** | **Reports filters** | ✅ **already captured** — design-notes **§A.6 "Reports Exploarations"** = the **22 `reports21_*` PNGs** (+1 PDF-sourced JE tab = 23) in `design-screens/`, chips + titles documented (§B.6) |
| 11829-8908 | page-search component | ✅ captured this pass via the ZIP screenshots (also = the Global Search ⌘K palette) |

So the Parts (node 11884-16885) and Reports (node 11903-10573) frames the user
pointed at are the SAME sections already exported and documented on 2026-07-17. We
already hold their exact per-page **filter chip sets** and **column names**.

---

## 3. Per-area coverage assessment (for AUTHORING)

### A. Main Filters (Work Orders page) — node 11817-27678
**CAPTURED + ALREADY AUTHORED.** 79 cases live in TestRail (C29557–C29635). The new
ZIP's coded prototype only reinforces existing wording. **Nothing needed.**

### B. Parts filters — node 11884-16885
**DESIGN CAPTURED (chip sets + columns pinned); BEHAVIOR/REQUIREMENTS still need
Branko's PRD.** From design-notes §B.5 the exact per-page filter chips are known:
- Inventory: **Bin Location / Category / Supply / Vendor**
- Part Sales: **Status / Customer / Created by / Date**
- Catalog: **Manufacturer / Category**
- Returns: **Vendor / Category / Part Type** (Part Type menu = Core / Non Core / Clear selection)
- Credits: **Vendor / Date / Processed by**
- Purchase Orders: **Vendor / Status / Date / Ordered by**
- Vendor Invoices: **Vendor / Invoice date / Date received / Received by**
- Vendors: **Vendor / State/Province**

What the design does NOT pin (needs the PRD, Standing Rule 1): the option lists
behind each chip, and whether the WO-page behaviours (multi-select, search-within-a-
chip, Clear filters / Clear selection, collapse/expand, per-user persistence, URL
shareable state, real-time apply, mobile bottom-sheet) apply **identically** to each
Parts page, plus any page-specific specials (new filter types Location / Transaction
Type / Invoice Status / Type / User / Date / Mention that Branko flagged).

### C. Reports filters — node 11903-10573
**DESIGN CAPTURED (per-report chips + titles pinned via §B.6); BEHAVIOR/REQUIREMENTS
still need Branko's PRD** — same gate as Parts. Note: several Reports frames use a
**placeholder Timesheet-Activities table** as sample body (a Figma fill-in, not the
real report columns), so on those frames only the TITLE / TABS / FILTER CHIPS are
design-authoritative; the real report columns + the behaviour contract come from the
PRD.

### D. Page-search component — node 11829-8908
**CAPTURED** (ZIP screenshots + Global Search coverage). **Scope caveat:** this is
the ⌘K global-search / spotlight palette, which is the **Global Search project**
(86 cases already authored there), not the Work-Order Filters feature. Before
authoring page-search cases under Filters, **confirm with the user whether page
search belongs to the Filters project or is already owned by Global Search** (avoid
duplicate cases across projects).

---

## 4. Bottom line — can we author now?

| Area | Design | Behaviour spec | Author now? |
|---|---|---|---|
| Main Filters (WO) | ✅ have | ✅ have | already done (79 cases) |
| Parts filters | ✅ have (chips+columns) | ❌ **Branko PRD needed** | **NOT yet** (Rule 1) |
| Reports filters | ✅ have (chips+titles) | ❌ **Branko PRD needed** | **NOT yet** (Rule 1) |
| Page search | ✅ have | ✅ (Global Search spec) | scope confirm first (belongs to Global Search) |

**The blocker was never the design — it is Branko's updated PRD.** We already hold
the Parts + Reports designs (chips + columns per page). We do **NOT** need the user
to export the 4 Figma frames as PNGs. What is still missing to author *build-accurate*
Parts/Reports cases is the **requirements/behaviour**: which behaviours apply per
page, the option lists, the new filter types, and page-specific rules. Per Standing
Rule 1 we do not invent behaviour, so authoring stays gated on the PRD.

If the user wants to move without the PRD, we could author **design-only** Parts/
Reports cases (chip-presence + on-screen labels per page) with heavy "VIU-confirm"
notes for every behaviour — but the PRD is the honest gate for the requirements
layer, and per Standing Rule 11 we would ASK which process to run first.

**What's still needed (recap):**
1. **Branko's updated PRD** for Parts + Reports (behaviour, option lists, new filter
   types, per-page specials) — the real gate. (Requested 2026-07-17, still awaited.)
2. **Page-search scope decision** — confirm Filters-vs-Global-Search ownership before
   authoring node 11829-8908 cases.
3. (Not blocking) Figma MCP is down — irrelevant, since all 4 designs are already in
   hand; no PNG re-export required.
