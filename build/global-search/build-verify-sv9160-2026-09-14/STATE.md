# Global Search build-verify — sv9160 — COMPLETE (pending served scan) — 2026-09-14

- Branch sv9160.qa.shopview.com, build **v26.36.4-7869ff2**. Source current: PRD 576978945 v1.5
  (confirmed by the source-verify session, commit 8e12e0d4, Rule 86 verified from committed evidence).
- Scope: **90 cases across 17 sections** (6721-6730, 6732, 6733, 6734, 6737, 6738, 6739, 6740), all ours.
  Excluded (5): 6767, 6768(0), 6769, 6774, 8056. Foreign (8 Vladimir cases in sec 49) never touched.

## Anchor observed LIVE (build/OBSERVED-UI-LABELS-sv9160.md)
- Palette: open Ctrl+K or the header box "Search work orders, customers, parts and more"; close X/Esc;
  footer "Arrow down and arrow up navigate, Enter selects, Escape closes".
- Scope tabs: All · Work orders · Customers · Assets · Parts · Vendors · Part sales · Purchase orders · Vendor invoices, each with a live count.
- Recent-searches default state (Clear All, grouped by TODAY); grouped results with counts + "N results found across M categories"; No-results "No results found / No results for "<query>"".

## Done
- All 90 cases: runnable-gate 90/90; every quoted label already matched the build; cases well-written and followable.
- Build-verification markers applied: added build stamp "Last checked against build v26.36.4-7869ff2 on 9/14/2026",
  flipped every marker from "Not available on Build to test Yet" -> **AUTOMATION: READY** (all 90 testable on the QA
  branch: no customer-portal cases; mobile = narrow viewport, error state = simulated, permissions = seeded role).
- Kept the legitimate spec-history Notes (Rule 56). Set custom_automation_type = Functional on the 89 that were None.
- Stored render 90/90 clean. Arithmetic: READY 90 + EXPECT-FAIL 0 = 90 total - HOLD 0.

## Served-page scan (2026-09-14): 90/90 render fr-view, escaped=true=0 (C53476 re-scanned clean after a transient). QUALITY CONFIRMED.
