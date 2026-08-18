# TASK B — the "2026-08-05 screenshot" search + all images read (2026-08-17)

**Worker:** SOURCE-INGEST (TestRail user id 3) · read-only · **no case changed.**

## 🔴 Headline: there is NO 2026-08-05 screenshot in the uploads

The QA lead said (point 12): *"Consider the newest as the authority. The date is 26-8-05 I have
attached the screenshot as well."* **That specific screenshot was NOT found.**

- **Uploads directory `/root/.claude/uploads/dd1d42ba-2c47-5229-9b17-b8f94e3eb99a/`** contains exactly
  **two files** — the design ZIP (`139cc195-Shopview_Design_System_2.zip`) and one spreadsheet
  (`2092b96d-POQuestionsBrankoFiltersTechPlan_20260730_3.xlsx`). **No standalone 2026-08-05 image.**
- **No sibling uploads directory exists** (`/root/.claude/uploads/` holds only this one session folder).
- **Inside the ZIP's `uploads/` and `screenshots/`** the dated screenshots are 2026-04-30 (×10),
  2026-05-11, 2026-05-25 (×4), **2026-08-11 (×2), 2026-08-13 (×2), 2026-08-14 (×1)** — **none is 08-05.**

**⇒ ACTION FOR THE COORDINATOR:** ask the QA lead to **re-attach the 2026-08-05 screenshot** — it did
not come through with this ZIP. Until it arrives we cannot say what source/state it governs, so
**Point 12 below is recorded as the general rule + an OUTSTANDING flag**, not applied to a specific case.

## Every image read (dated / Filters-relevant), what it shows, and any conflict

| Image (in ZIP) | What it shows | Source/date | Conflict with our suite? |
|---|---|---|---|
| `uploads/Screenshot 2026-08-14 at 12.23.19.png` | **Asset on site** single-select panel: `Yes` (checkmark) · `No` · `Clear selection` | 8/14 · current v21 desktop | **No — CONFIRMS** the Asset-on-site single-select design + labels |
| `uploads/Screenshot 2026-08-13 at 15.28.13.png` | Work Orders table, tabs `All`(sel)/`Work Orders`, cols On Site / Status / Number | 8/13 · current | **No — CONFIRMS** tab + column model |
| `uploads/Screenshot 2026-08-13 at 15.26.21.png` | Global Search results dropdown: entity-type icon rows grouped `PAST WEEK` / `PAST 30 DAYS`, ↓↑ keyboard buttons | 8/13 · page-search/Global Search | **No — CONFIRMS** recent-search grouping (Global Search overlap) |
| `uploads/Screenshot 2026-08-11 at 17.37.05.png` | ExpandingSearch states: `Search` (default), `Search` (hover), `Type to search` (input), `In progress` (typed + clear) | 8/11 · DS component frame | **No — CONFIRMS** table-search labels |
| `uploads/Screenshot 2026-08-11 at 17.52.00.png` | Header: `Search` + `⌘K`, running time clock `01:12:35`, `Heavy Duty` | 8/11 · current | **No — CONFIRMS** header search + clock |
| `uploads/Mobile.png` | **OLD mobile model** — tabs incl. **`My Work Orders`**; chips `All Filters` / `Customer` / `Lead…`; cards with `Asset On Site` toggle | undated exploration | **⚠️ SUPERSEDED** — contradicts v21 & our cases, but is the OLD design (see below). Our cases already follow v21, so this is a stale-artefact caution, NOT a case conflict |
| `uploads/Persisting search dropdown.png` | Global Search palette: tabs All/Work Orders/Customers/Assets/Parts/Vendors/Part Sales; `Work orders (12)`, `Customers (2)`; footer `Navigate / Select / Close esc` | page-search | **No — CONFIRMS** page-search palette (Global Search overlap) |
| `screenshots/filters-current.jpg` | **Blank** (background only — no content) | — | None — empty image, nothing to read |

Other ZIP screenshots (`btn-dark`, `notif-dark`, `schedule-dark`, `tt-dark`, `logo-check*`, `icons-check`,
`modal-split*`, `ref-*`, `mask-test`, older `Screenshot 2026-04-30/05-11/05-25*`, `recent searches.png`,
`search results.png`, `Quick Actions on Hover.png`, `Add New Inventory Part Modal.png`) are
design-system component/logo/icon checks or Global-Search/inventory frames — **none is a 2026-08-05
Filters source and none conflicts with a current Filters case.**

## The ONE thing to flag (not a case conflict, a stale-artefact caution)

`uploads/Mobile.png` and `mobile-filters.jsx` inside this same ZIP show the **OLD** mobile filter model
(combined "All Filters" drawer + "My Work Orders" tab + Customer/Lead chips). **v21 removed all of that**,
and **our current cases already follow v21**, so nothing needs changing. The risk is only that a future
pass could wrongly "pin" mobile labels from these stale frames. Recorded fully in `DESIGN-NOTES.md`
("Internal staleness").

## OUTSTANDING — what the coordinator needs
| # | What is missing | Who owes it | What it blocks | Action |
|---|---|---|---|---|
| 1 | The **2026-08-05 screenshot** the QA lead said he attached | QA lead | We cannot say what "newest authority" source/case it governs (Point 12) | **Ask the QA lead to re-attach the 2026-08-05 screenshot** |
