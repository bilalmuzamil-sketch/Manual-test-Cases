# Filters — build-verification 2026-08-19 — SCOPE

**Pass:** live build-verification of the Filters suite against the current staging build, following the
2026-08-17 Fabian app-wide-filter-redesign reconciliation (which authored/repurposed 69 cases and
**deliberately deferred build verification**). This pass opens the app and lifts the Rule-69 deferred
markers where the feature is present. Interim `<br>` write format (TestRail markdown-wrap block still
active — see `build/report-suite/build-verify-2026-08-18/UPDATE-CASE-WRAP-DIAGNOSIS-2026-08-19.md`).

**Worker:** TestRail user id 3 (Bilal Muzamil). **Epic:** SV-8785 · **PO:** Branko Cicovic ·
**TestRail group:** 4110 · **Ahtasham's run:** 352 (UNTOUCHED this pass).

## Build marker (read live at pass start)
- App: `https://app.staging.shopview.com` · API: `https://api.staging.shopview.com`
- `<meta name="app-version" content="v3.8-d0e135e">` · `index.html` last-modified **Wed, 19 Aug 2026
  13:27:07 GMT** · etag `"aa6ea37f82dd0af1b3fe6da5dfd65573"`.
- Session: raw cookie 409 on API (known — raw can 409); `POST /api/quick-login {key:admin}` → 200,
  `my-workplaces` → 200. **Session ALIVE.**
- Same-minor `v3.8-*` is a bug-fix build (Rule 60) → all verdicts PROVISIONAL, layer-1/2 re-checked.

## Source currency (Rule 31)
| Source | Identifier | Version / date | Verdict |
|---|---|---|---|
| Filters spec | Confluence `572030978` | **v21, published 2026-08-14** | CURRENT — confirmed live 2026-08-18 (1 day ago) by the sv9279 pass; **NOT re-fetched this build-verify pass** (Atlassian OTP not in hand; build is this pass's focus). Recorded as a minor currency caveat in the outstanding register. |
| Epic + children | Jira `SV-8785` | 34 children, Open | CURRENT (live 2026-08-18) |
| Designs / tech plan / PO answers | — | ingested | CURRENT for this trigger |

## Suite counts (live, read from TestRail group 4110)
- **Ours (created_by=3): 124** · **foreign: 5** (all created_by=7 Ahtasham, section "Remove Global
  Search Page Filtering" C43576–C43580 — **HANDS-OFF, Rule 38, 0 writes**).
- **Automated (`custom_atmstatus=3`), HELD (Rule 71 — verify live, WRITE NOTHING, log to
  FILTERS-HELD-AUTOMATED.md): 5** — C38877 (Status), C29600 (Active chips), C29614 (Persistence),
  C29618 (URL state), C29623 (Mobile).
- **Writable (ours, non-Automated): 119.**

## Live marker census (pass start)
| Marker | Count |
|---|---|
| `Not available on Build to test Yet` (DEFERRED — Rule 69) | **59** |
| `AUTOMATION: READY` | 40 |
| `AUTOMATION: HOLD` | 18 |
| `AUTOMATION: READY - EXPECT FAIL` | 7 |
| **Total** | **124** |

The **59 DEFERRED** are the primary deliverable — the 2026-08-17 pass marked them "not available"
because the app was not opened; the redesign has since shipped to staging (SV-9279 "Roll the filter
layout out to all other pages" is Ready for QA), so these become runnable and are lifted to READY.

## AREA SURVEY (live, v3.8-d0e135e) — present / absent / partial
Evidence: `tools/wo_survey.mjs`, `pages_survey.mjs`, `entity_survey.mjs` output.

| Filter area | Section(s) | State | Live evidence |
|---|---|---|---|
| **WO toolbar-row chip layout** (no separate bar; right-aligned; always visible) | Filter Bar Layout (4111) | **PRESENT** | chips `filter_chip_status/assigned_to_me/vehicleHere` in the toolbar row with the tabs; no collapse control anywhere |
| **Assigned to me** toggle chip (no arrow, on/off), order Status→Assigned→Asset | Filter Bar Layout | **PRESENT** | `filter_chip_assigned_to_me`, toggles `showMyWorkOrders=0/1`; order confirmed |
| **Status** chip → checkbox list + Clear selection, **All-tab only** | Status Filter (4112) | **PRESENT** | panel options: Estimate/Approved/In progress/Review/Complete/Invoiced/Paid/Declined/Imported + Clear selection; chip absent on Estimates/Work Orders/Completed tabs, present on All |
| **Customer / Lead Technician / Service Advisor** as WO filters | Customer (4113) / Lead Tech (4114) / Advisor (4115) | **REMOVED from WO (as designed)**; entity **panel contract PRESENT elsewhere** | no such chips on WO (confirmed); the Story-16 searchable multi-select panel survives on other pages (Parts category/gridLocation/supply, Reports per-report chips) with a value list + "Clear selection" |
| **Asset on Site** single-select checkmark panel (Yes/No/Clear) | Asset on Site (4116) | **PRESENT** | `filter_chip_vehicleHere` → Yes/No/Clear selection |
| **Active chips + clear per chip / Clear selection** (global Clear filters REMOVED) | Active Chips & Clear (4117) | **PRESENT** | `filter_chip_clear_vehicleHere` (cancel X) + per-panel "Clear selection"; no global Clear-filters button |
| **Collapse / Expand toggle** | Collapse & Expand (4118) | **REMOVED (as designed)** | no hide/collapse/expand control on desktop or phone |
| **Empty state** | Empty State (4119) | **PRESENT** | WO list renders; empty result when filters exclude all |
| **Tab behaviour** (4 tabs; Status All-tab only) | Tab Behaviour (4120) | **PRESENT** | tabs All/Estimates/Work Orders/Completed; Status chip All-tab only |
| **Persistence** (per-user) | Persistence (4121) | **PRESENT** | URL carries filter state; reload retains |
| **URL state / shareable link** | URL State (4122) | **PRESENT** | `?tab=…&filters[n][field]=status&filters[n][value]=…&showMyWorkOrders=…` |
| **Mobile** (per-filter bottom sheets, deferred Apply) | Mobile Filters (4123) | **PRESENT (to verify at 390×844)** | separate mobile boot |
| **API** filter contract | API (4124) | **PRESENT** | `GET /api/work-orders?filters[n][field]=…&filters[n][value]=…&showMyWorkOrders=…`; `GET /api/work-orders/statuses` |
| **Page Search toolbar** (Search toggle) | Page Search (5410) | **PRESENT** | `page_search_toggle` on WO/Parts/Customers/Parts-orders; Global search `select_global_search` (Ctrl+K) present |
| **Parts page filters** | Parts Page (5411) | **PRESENT** | `filter_chip_gridLocation/category/supply` with option lists + Clear selection |
| **Reports page filters** | Reports Page (5412) | **PRESENT** | `filter_chip_range` (date range) + per-report entity chips (e.g. `filter_chip_staffId`) |

**No area is genuinely ABSENT.** The Customer/Lead-Tech/Advisor WO filters and the Collapse toggle are
**deliberately removed by the redesign** — their cases assert that removal (verifiable) and/or the
page-agnostic entity-panel contract (verifiable on Parts/Reports). So there is **no "feature not found"
deferral expected** — every case has a present feature to verify.
