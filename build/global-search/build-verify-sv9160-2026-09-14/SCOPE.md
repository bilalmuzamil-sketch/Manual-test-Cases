# Global Search build-verify — SCOPE & ACCESS (holding for source-verify) — 2026-09-14

- Branch: **sv9160.qa.shopview.com**, build **v26.36.4-7869ff2** (login proven; Ctrl+K opens the
  Global Search palette: "Search customers, work orders, parts…"). Cookie: `/tmp/qa-cookies/sv9160-sso.txt`.
- Main folder: **6720 "Global Search — Enhancement (Aug 2026)"** (parent 49), 24 child folders.
- QA lead: **wait for the dedicated source-verify session to finish, THEN build-verify** (2026-09-14).

## EXCLUDED (per the QA lead's screenshot — do NOT build-verify):
- 6767 Global Search - Out of V1 Scope (not tested this release) — 1
- 6769 Global Search V2 - V1 Regression Suite — 62
- 6774 Quick Actions on Hover (v1) — 8
- 8056 Global Search V2 - V1 Regression (derived from V1 automated tests) — 1

## IN SCOPE (build-verify the rest; ~90 ours, 0 foreign):
6721 Palette Open, Close and Keyboard (10) · 6722 Scope Tabs (12) · 6723 Grouped Results and Counts (9) ·
6724 Per-Entity Result Shape (9) · 6725 Fuzzy Matching (11) · 6726 Ranking and Prioritization (8) ·
6727 Empty and First-Time State (2) · 6728 Recent Activity Default State (5) · 6729 Persisting Query (3) ·
6730 No-Results State (2) · 6732 In-Page Work Orders List Search (2) · 6733 Error State (1) ·
6734 Permissions and Role-Based Scoping (6) · 6737 Page-Search Cutover v2 (2) · 6738 Mobile Global Search v2 (6) ·
6739 Purchase Orders Entity v2 (1) · 6740 Vendor Invoices Entity v2 (1).
Empty (skip): 6731 Hover Quick-Actions, 6736 Contacts Entity v2, 6768 Search Telemetry.
