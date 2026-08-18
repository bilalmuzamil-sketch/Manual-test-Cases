# Filters — Claude Design ingest (QA lead attachment, 2026-08-17) — DESIGN NOTES

**Worker:** SOURCE-INGEST (TestRail user id 3, Bilal Muzamil) · **Pass folder:** `build/filters/design-2026-08-17/`
**Read/ingest only — NO test case was edited and nothing was written to TestRail/Jira.**

## What this is

The QA lead attached a Filters design ZIP: `139cc195-Shopview_Design_System_2.zip` (~24 MB).
It was extracted to the **scratchpad** (`.../scratchpad/filters-design-2026-08-17/`), **NOT the repo** —
the repository is public, so the raw proprietary design binaries/HTML/images are **not committed**.
Only this text notes file is committed.

**This ZIP is the primary "Claude design" the Fabian-review pass could not fetch.** The
`build/filters/fabian-review-2026-08-17/SOURCE-CURRENCY.md` block records source **c2** as
*"Claude design (primary) `claude.ai/design/p/fac6efcf-…?file=Filters.html` — not directly fetchable …
Labels are authored from the spec; anything not pinned by spec is marked 'confirm live'."* This ZIP
**contains `Filters.html` and its `filter-*.jsx` source** — i.e. exactly that design. So it lets us
**confirm the spec-authored labels against the design itself** (Rule 32 duplication raises confidence)
and **pin the labels that were only "confirm live" before**.

## SOURCE-CURRENCY (this ingest)

| Source | Identifier | Date | Verdict |
|---|---|---|---|
| Claude design (this ZIP) | `Shopview_Design_System_2.zip`; Filters sources `filter-bar.jsx`, `filter-bar-sa.jsx`, `filter-chip.jsx`, `filter-dropdown.jsx`, `mobile-filters.jsx`, `design-md/*`, `Filters*.html` | attached 2026-08-17 | **CURRENT for DESKTOP filter model; INTERNALLY MIXED** — see "Internal staleness" below |
| Filters spec (already reconciled) | Confluence page 572030978, **v21** (2026-08-14) | via fabian-review 2026-08-17 | The v21 spec is the newest authoritative product source; this design **agrees** with it on the desktop model |
| Current Filters cases | `build/filters/testrail-id-map.csv` (124 cases), `build/filters/cases/*.json`, `build/filters/fabian-review-2026-08-17/*` | 2026-08-17 | Already reconciled to v21 — this design **confirms** them, does not conflict |

**Bottom line: this design is CONFIRMATORY, not a change trigger.** Our current cases already follow
v21 (the new 3-chip / toggle / per-chip-sheet model). The design pins the label wording that was
previously "confirm live" and adds nothing that contradicts a current case — **except that the ZIP
also contains SUPERSEDED mobile exploration frames that must NOT be used to pin mobile labels** (see
"Internal staleness").

---

## The labels/states the design PINS (verbatim, cited to file)

### Filter bar & chips (`filter-bar.jsx`, `filter-bar-sa.jsx` — the two agree byte-for-byte on labels)
- **Work Orders primary bar = THREE chips, in order: `Status` · `Assigned to me` · `Asset on site`**
  (`filter-bar.jsx` `items[]`). Customer / Lead Technician / Service Advisor are **NOT** rendered as
  Work Orders chips (their arrays exist in the file but are unused) — matches v21 removing Stories 3/4/5.
- **Tabs: `All` · `Work Orders` · `Estimates` · `Completed`** (`WorkOrdersPage`). No "My Work Orders" tab.
- **Status chip is HIDDEN on every tab except `All`** — `hide={tab === "All" ? [] : ["status"]}`.
- **Chip value text:** one value → `Label: value`; multiple → `Label: value, +N` (`valueText()`).
- **Table search** (`ExpandingSearch`): collapsed label `Search`; expanded placeholder `Type to search`;
  a clear (x-circle) button appears once text is typed.
- **Global header search** (`AppHeader`): placeholder `Search customers, work orders, parts...` with a
  `⌘` `K` shortcut hint.
- **Primary action button:** `New Work Order`. **Columns button:** `columns-3` icon (title "Columns").
- **Empty state** (`SVEmptyState`): title `No results for "<query>"` (with a query) or
  `No work orders match these filters` (filters only); body guidance
  *"Try a different search term or remove a filter."* / *"Check the spelling, or search by work order
  number, customer, unit or VIN."* / *"Try removing a filter to widen your results."*; button
  `Clear all filters`.
- **Applied-filters row** (`AppliedFilters`, optional): leading label `Filters`; each pill reads
  `Status:` / `Assigned to me:` / `Asset on site:` + value + remove-X; trailing button `Clear all`.

### Shared-link banner (`filter-bar.jsx` → `SharedLinkBanner`)
- Full-width info banner, link icon, copy **verbatim**:
  `Viewing a shared link - your own saved filters aren't applied`
- Action link **verbatim**: `Back to my view`.
  (Confirms FLT cases for the shared-link banner; exact hyphen/wording pinned.)

### Chip states (`filter-chip.jsx`)
- 28px pill, radius 100. **Default** transparent / grey-700; **Hover** grey-100; **Selected** primary-100
  fill + primary-500 text; **Open** grey-100.
- **Normal chip:** trailing **chevron** always shown; when selected, **hovering swaps the chevron for a
  clear X-circle** — this is the **per-chip clear** (there is no global "Clear filters" button).
- **Toggle chip (`Assigned to me`, `toggle:true`):** **NO chevron, NO clear X**; when on it renders
  **semibold + primary highlight**, no value text. → **Directly pins FLT-ASSIGN-01 (C43841) "toggle chip
  with no arrow that turns on and off" and FLT-ASSIGN-02 (C43842) "highlights the chip with no value and
  no clear X".**

### Dropdown panels (`filter-dropdown.jsx`)
- **Entity/multi-select panel** (`FilterDropdown`): search input placeholder `Search <filter name lowercased>`
  (e.g. `Search customer`); checkbox rows; empty result text `No matches`; footer button `Clear selection`.
- **Status panel** (`StatusDropdown`): **MULTI-select** — checkbox rows toggled via a `Set` (add/delete),
  footer `Clear selection`. *(The code comment says "single-select" but the code is multi-select; the
  behaviour — not the comment — is the pin. This corroborates the multi-status assertion and the
  common-core C29944 scar.)*
- **Asset on site panel** (`SingleSelectDropdown`): **single-select**, a **checkmark on the selected row**,
  no checkboxes, footer `Clear selection`. Options `Yes` / `No`.
  **Corroborated live by the 2026-08-14 screenshot** (Asset on site → Yes ✓ / No / Clear selection).
- **Date range panel** (`DateRangeDropdown`): radio-style single-select presets, in order —
  `Today` · `Yesterday` · `This week` · `This month` · `Last month` · `This quarter` · `This year` ·
  `Custom`. Choosing `Custom` reveals a text input placeholder `MM/DD/YYYY – MM/DD/YYYY`. Footer
  `Clear selection`.
- **No "Select all" button anywhere; no desktop "Apply" button** — desktop panels apply live; only
  `Clear selection` is present.
- Alternate variant `FilterDropdownWithPills`: selected values render as inline pills (with X) inside the
  search box, plus an X-circle clear. (A design option; the plain checkbox variant is what the bar uses.)

### `STATUSES` list pinned (`filter-bar.jsx`)
`Estimate` · `Approved` · `In progress` · `Review` · `Complete` · `Invoiced` · `Paid` · `Declined` · `Imported`
(also confirms the "Work Orders" tab pre-filter set = Estimate/Approved/In progress and "Completed" =
Complete/Invoiced/Paid).

### Page-search / Global Search palette (overlap project — `Persisting search dropdown.png`, 2026-08-13 shots, `global-search.jsx`)
- Palette entity tabs: `All` · `Work Orders` · `Customers` · `Assets` · `Parts` · `Vendors` · `Part Sales`.
- Grouped result headers e.g. `Work orders (12)`, `Customers (2)`; recent-search groups `PAST WEEK`,
  `PAST 30 DAYS`; matched substring highlighted.
- Footer keyboard hints: `↓ ↑ Navigate` · `↵ Select` · `Close esc`.
  *(Relevant to cases-G/H page-search, which carry a Global Search OVERLAP note.)*

---

## ⚠️ Internal staleness inside the ZIP (do NOT pin mobile labels from these)

The ZIP is **internally mixed**: the desktop model is v21-current, but two MOBILE artefacts are the
**OLD, superseded** exploration and contradict both v21 and our current cases:

| Artefact | What it shows (OLD model) | Why it is superseded |
|---|---|---|
| `mobile-filters.jsx` | One combined **"All Filters"** bottom sheet with sections Status / Customer / Lead Technician / Service Advisor / Asset on site + `Apply filters` | v21 **S12** removed the combined drawer — each chip opens **its own** bottom sheet |
| `uploads/Mobile.png` | Tabs incl. **"My Work Orders"**; chips **"All Filters" / "Customer" / "Lead[ Technician]"** | v21 removed the My Work Orders tab (→ Assigned to me toggle) and the Customer/Lead WO chips |

**Our current cases already follow v21** (FLT-MOB-05/etc. = "each filter chip opens its own bottom sheet,
not one combined drawer" + deferred `Apply filters`; "My Work Orders tab is gone"). **So these stale
frames do NOT conflict with our cases — they only risk misleading a future pass.** Per Rule 32/57, the
v21 spec + the desktop Claude design win. The only mobile label these frames still corroborate is the
bottom CTA **`Apply filters`** and the section labels `Status` / `Asset on site`.

---

## Finalization worklist

**Scope note:** this is a LABEL-wording worklist only. Per Standing Rule 69, the touched cases carry
`AUTOMATION: Not available on Build to test Yet` and (per the QA lead's 2026-08-17 ruling, point 7)
**stay that way until a later build-verify sync proves the steps/preconditions run** — finalizing a
label does NOT lift a marker, change a verdict, or create a ticket. No case is changed here.

### A. Labels the design now PINS → a later authorized pass can DROP the residual "confirm live"/"VIU-confirm" on the LABEL
| # | Label / state (now pinned) | Design source | Cases it firms up |
|---|---|---|---|
| 1 | `Assigned to me` toggle chip — no arrow, no clear X, on/off, semibold when on | `filter-chip.jsx` (toggle) | FLT-ASSIGN-01 C43841, FLT-ASSIGN-02 C43842, FLT-ASSIGN-03 C43843, FLT-MOB-05 C29625 |
| 2 | `Asset on site` panel — Yes/No, checkmark on selected, `Clear selection` | `filter-dropdown.jsx` + 2026-08-14 shot | FLT Asset-on-site cases (cases-B) |
| 3 | `Status` panel is MULTI-select checkbox + `Clear selection` | `filter-dropdown.jsx` `StatusDropdown` | FLT Status cases (cases-A) |
| 4 | Per-chip clear = X-circle on hover; **no global "Clear filters" button** | `filter-chip.jsx` + `filter-bar.jsx` | FLT clear cases (cases-C) |
| 5 | Shared-link banner copy `Viewing a shared link - your own saved filters aren't applied` + `Back to my view` | `filter-bar.jsx` `SharedLinkBanner` | FLT shared-link cases (cases-C) |
| 6 | Date presets list + `MM/DD/YYYY – MM/DD/YYYY` + `Clear selection` | `filter-dropdown.jsx` `DateRangeDropdown` | FLT Reports date-range cases (cases-F) |
| 7 | Panel search placeholder `Search <filter name>`; table search `Type to search` / `Search` | `filter-dropdown.jsx` / `filter-bar.jsx` | FLT search-in-panel cases |
| 8 | Empty state `No results for "…"` / `No work orders match these filters` / `Clear all filters` | `filter-bar.jsx` `SVEmptyState` | FLT empty-state cases |
| 9 | Mobile per-chip sheet deferred `Apply filters` (CTA label only) | `mobile-filters.jsx` CTA (label still valid) | FLT-MOB Apply-filters cases (cases-D) |
| 10 | Tabs `All / Work Orders / Estimates / Completed`; Status chip on `All` only | `filter-bar.jsx` | FLT tab cases (cases-C, FLT-TAB-*) |

### B. What the design does NOT cover → these stay "confirm live" (build/behaviour/PO questions)
- **WHICH pages carry a Customer / Lead Technician / Service Advisor / entity filter** — the biggest
  "confirm live" cluster (9× Customer, 7× Service Advisor, 3× Lead Technician). This is the **per-view
  filter list that is PENDING from engineering** (spec S1-R8 / S13-R23) — a design cannot pin it. **STAY.**
- **Persistence behaviour** ("filters saved to your account, not one computer/browser") — a build/behaviour
  question, not a label. **STAY (confirm live once built).**
- **Live pass/fail verdicts** — build verification was deferred this pass. **STAY.**
- **AI "ask a question" scope** (page-search) — out of scope for V1, Global Search project. **STAY.**
- **Mobile per-chip-sheet exact internals beyond `Apply filters`** — the ZIP's mobile frames are the
  stale combined-drawer model; do NOT pin mobile labels from them. **STAY (confirm live on the build).**

## OUTSTANDING — what the coordinator needs
- **Nothing blocking this ingest.** The design confirms the v21-reconciled cases.
- **Per-view filter list still owed by engineering** (spec S1-R8 / S13-R23) — until it lands, item B‑1
  above stays "confirm live". (Already tracked from the fabian-review pass.)
- **A later BUILD-VERIFY sync is still owed** to lift the Rule-69 markers and settle item B‑3 verdicts.
