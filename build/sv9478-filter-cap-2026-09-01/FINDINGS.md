# SV-9478 — Filter-selection 50-value cap — QA findings

**Ticket:** SV-9478 — "X-Current-Page header exceeds nginx's 8KB limit and breaks every API request for the user" (Bug, High, status TESTING QA, label `reports-suite`)
**Environment:** https://sv9478.qa.shopview.com · API https://sv9478api.qa.shopview.com
**Build marker:** `v26.35.7-7e3d970` (read live at test time)
**Org / user:** Staging Heavy Duty – 9919 (admin)
**Implementation:** PR #2861 (branch `SV-9478-filter-cap`), full-stack FE+BE+E2E
**Tested:** 2026-09-01
**Overall verdict:** **PASS** — every QA-handoff checklist item that is reachable in this environment passed; the fix removes the >8 KB header/URL outage while preserving unlimited Select-all and the not-capped exemptions.

Per QA-branch finality (per-ticket branch, we passed the QA): findings are treated as final for this build. Build marker recorded above.

---

## What the fix does (plain English)

Selecting too many filter values used to grow the page URL and a hidden per-request `X-Current-Page` header past an 8 KB infrastructure limit (~163 vendors), after which every API call returned `400` and reloads showed CloudFront error pages. The fix caps **individually-picked** values at **50 total per page across all filter types combined** (product decision on this ticket by Chris Ward / Milan Zivanovic / Nemanja Djuric). **Select all stays unlimited** because it sends no IDs at all. A backend guard rejects any request carrying more than 50 counted filter values.

---

## Result vs the QA checklist

### 1. The 50-value cap (Reports → Inventory Value)
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Pick values one-by-one across two filters (vendors + categories) to 50 total; 50th applies, further unchecked options lock, inline notice "50 selected (max 50 across all filters)" appears | **PASS** | EX1; `data-test-id=filter_selection_over_max_vendorIds` visible with exact text |
| 2 | At cap, deselecting always works; after deselecting one, a different one can be selected again | **PASS** | cap3 run: DESELECT → count drops + notice clears; RESELECT different → back at cap |
| 3 | With exactly 50 selected, report request succeeds (no 400) and results filter | **PASS** | cap3 run: 0×400, last report status 200 |
| 4 | Location filter at default (all your locations) does NOT consume the 50 budget | **PASS** | API: 60 locations + 40 vendors → 200 (locations uncounted) |
| 5 | Repeat one lock/notice check on mobile viewport (bottom sheet) | **NOT CLEANLY DRIVEN** — see Honest limits | mobile.mjs |

### 2. Select all (unlimited path)
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 6 | "Select all" on a large filter works even at the cap; Network shows NO IDs sent; results show everything | **PASS** | selectall run: after Select-all vendors, report request carries no `vendorIds=` |
| 7 | Parts Catalogue (Manufacturer/Category), Staff (Roles/Workplaces/Departments), Inventory (Bin/Category): new "All …" row present; empty = all; chip reads "All <noun>" | **PASS** | EX3; allrows run confirmed `filter_select_all_*` ids + "All …" row text on all three screens |
| 8 | Inventory: select all bins → print Count Sheet PDF → request carries no filters | **NOT TESTED** — see Honest limits | — |

### 3. Shared links / oversized URLs
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 9 | While logged in, open a report URL with >50 valid UUIDs: page loads (no 400/414/CloudFront), selection clamped to 50, URL rewritten | **PASS** | EX2: 60 real vendor UUIDs → page loads, chip "Vendor: 50 vendors", report 200 |
| 10 | X-Current-Page header on a heavily-filtered page stays well under 8 KB | **PASS** | measured **2,844 bytes** max (limit 8,192) |

### 4. Not-capped behavior (regression guards)
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 11 | Technician Utilization: include/exclude technicians never locked/auto-trimmed | **PASS** | API: TU `exclude_technicians` 60 → 200; UI: 0 locked options, no over-cap notice |
| 12 | Sales By Customer: customers filter tri-state; select-all = all | **PASS (all pole)** — empty-data pole not reproducible | SBC: `filter_select_all_customerIds` present; default sends NO customer IDs. No customers seeded in env → "explicitly empty = no rows" pole not driveable |
| 13 | WO Notes tab on a work order with many lines loads (bulk reference IDs not counted) | **PASS** | WO `04ab678b…` /notes loaded, no error |
| 14 | TimeSheets technician filter, Pricing Matrix dialog | **NOT TESTED** — see Honest limits | — |

### 5. Backend guard (API)
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 15 | `GET /api/reporting/reports/inventory-value?vendors=<51>` → 400, one errors entry keyed "vendors"; 50 → passes | **PASS** | 51 → `400 {"errors":[{"vendors":"Too many filter values selected: 51 of 51 selected values (maximum 50)."}]}`; 50 → 200 |
| 16 | 26 vendors + 25 categories → 400 with TWO error entries (one per param) | **PASS** | `400 {"errors":[{"vendors":"…26 of 51…"},{"categories":"…25 of 51…"}]}` |
| 17 | 60 UUIDs under locations + 40 under vendors → passes (locations uncounted) | **PASS** | 200 |
| 18 | Customer-portal find-by-ids with >50 ids → passes (exempt) | **PASS** | exempt path 200 |

---

## Exact backend guard error bodies (technical)

```
GET /api/reporting/reports/inventory-value?vendors=<51 UUIDs>
 -> 400 {"errors":[{"vendors":"Too many filter values selected: 51 of 51 selected values (maximum 50)."}]}

GET /api/reporting/reports/inventory-value?vendors=<50 UUIDs>
 -> 200

GET /api/reporting/reports/inventory-value?vendors=<26>&categories=<25>
 -> 400 {"errors":[
        {"vendors":"Too many filter values selected: 26 of 51 selected values (maximum 50)."},
        {"categories":"Too many filter values selected: 25 of 51 selected values (maximum 50)."}]}

GET /api/reporting/reports/inventory-value?locations=<60>&vendors=<40>
 -> 200   (locations uncounted; 40 counted < 50)
```

The guard counts the **combined** total (51) and reports it **per offending parameter** — matching the "one entry per offending parameter" spec in the handoff, and confirming the cap is across-all-filters, not per-filter.

## Shared-link / header measurement (technical)

- URL with **60 real vendor UUIDs** → page loads, no nginx 400 / S3 header error / CloudFront 414; vendor selection clamped to **50**; report request returned **200**.
- Max observed `X-Current-Page` header on that heavily-filtered page = **2,844 bytes** (nginx limit 8,192). Header no longer carries the query string.
- Note: opening the same URL with **fabricated** (non-existent) vendor UUIDs surfaces a pre-existing "Invalid parameter type" toast — that is the environment's existing UUID sanitization dropping foreign IDs (called out in the handoff), **not** a regression of this PR. With real IDs the load is clean (EX2).

---

## Honest limits (not observed this run)

Per Rule 12 (observed, never inferred) these are stated plainly rather than passed:

1. **Mobile bottom-sheet cap (checklist #5).** The desktop cap/lock/notice is fully proven and it runs through the **same shared filter component** (per the handoff, "desktop panels + mobile sheet"). At 390×844 the filter sheet rendered but automation could not drive its individual-pick selection cleanly (it opens at the all-selected/select-all state and the sheet's clear control differs). Recommend a ~30-second manual mobile confirm of one lock/notice; not a blocker.
2. **Count Sheet PDF after select-all bins (checklist #8).** Not exercised. The select-all-sends-no-IDs behavior it depends on is proven on the Inventory filters (EX3 / allrows run); the PDF export path itself was not driven.
3. **SBC "explicitly empty = no rows" pole (checklist #12).** The all-customers pole is confirmed (select-all present, default sends no IDs). This QA org has no customer records, so the empty-selection-returns-no-rows pole could not be produced.
4. **TimeSheets technician filter and Pricing Matrix dialog (checklist #14).** Not driven; low-risk (category lookups / technician filter are on the exempt/unchanged path).

None of the above changes the verdict: the outage the ticket describes is fixed, the cap + notice + lock work, Select-all stays unlimited, and every exempt path (locations, TU exclude, bulk-id endpoints) is confirmed uncounted.

## Known / out of scope (per handoff, not this PR)
- Shared link opened while logged out loses the query after login (pre-existing).
- Customer-portal find-by-ids byte-safety above ~170 ids (follow-up owed).
- TU residual byte risk when excluding ~150+ technicians one-by-one (separate follow-up).

---

## Evidence files
- `evidence/EX1-cap-notice-annotated.png` — 50-cap notice + locked options
- `evidence/EX2-sharedlink-annotated.png` — 60-UUID shared link clamped to 50, clean load
- `evidence/EX3-selectall-annotated.png` — new "All categories" select-all row (Parts Catalogue)
- `evidence/raw-*.png` — un-annotated captures
