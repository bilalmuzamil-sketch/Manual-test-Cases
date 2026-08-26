# REGRESSION IMPACT MATRIX — Global Search V1 → V2 (skill 17)

Date: 2026-08-26 · V1 spec: Global Search PRD (page 576978945) · **V2 spec: v1.2 (Confluence version 12)**
V1 project slug: build/global-search/ · V2 case set: 110 cases (ours), group 6720
**Code baseline (FACT):** ShopView/shopview @ `55767168…` (`develop`; Global Search FE+BE byte-identical
to `main d9ce0e5`). Read read-only 2026-08-26 (handoff: GLOBALSEARCHV1BASELINEINVARIANTS.md).

**Rule (skill 17):** Invariants = V1 baseline − (changed ∪ removed ∪ replaced). Documents establish
intent; code establishes fact; a code-vs-document conflict is a **PO decision item**, never a silent
invariant. The regression suite protects only the invariants (things V2 does NOT change).

## A · INVARIANTS → regression cases (V2 SILENT or PRESERVES; must still hold)
| V1 behaviour (INV) | Code fact (file:line) | V2 says | Collateral | Regression case |
|---|---|---|---|---|
| WO results gated by Work Orders access (INV-72) | FetchDataQueryHandler.php:42-67 | PRESERVES RBAC (§9) | HIGH (C-1 routing map) | GSREG-PERM-01 |
| Part-Sales-only role: no Part/Vendor, keeps Part Sale (INV-73) | :47-53; routingService.ts:84-85 | PRESERVES (§9) | HIGH | GSREG-PERM-02 |
| Catalog Part gated by Catalog & Inventory (INV-72/73) | :47-53 | PRESERVES (§9) | MED | GSREG-PERM-03 |
| Vendor gated by Vendor & Order Mgmt (INV-72) | :42-67 | PRESERVES (§9) | MED | GSREG-PERM-04 |
| Customer + Asset gated by Customers (INV-72) | :42-67 | PRESERVES (§9) | MED | GSREG-PERM-05 |
| Time Clock role → empty results (INV-71) | FetchDataController.php:50-51 | SILENT (dangerous) | HIGH | GSREG-PERM-06 + PO-REG-2 |
| Unknown type defaults to hidden (INV-74) | routingService.ts:78-99 | PRESERVES fail-safe | HIGH | GSREG-PERM-07 |
| Recents hide no-longer-permitted (INV-64) | useGlobalSearch.ts:21-29 | PRESERVES (§9) | LOW | GSREG-PERM-08 |
| Org isolation on every fetch (INV-80) | FetchDataQueryHandler.php:127-335 | PRESERVES (§9) | HIGH | GSREG-SCOPE-01 |
| WO/Part Sale workplace-scoped; rest org-wide (INV-81) | :130 | SILENT | MED | GSREG-SCOPE-02 |
| Location switch refetches (INV-82) | useGlobalSearch.ts:286-299 | SILENT | MED | GSREG-SCOPE-03 |
| Selecting each type opens correct record (INV-46) | GlobalSearch.vue:208-235 | PRESERVES; new routes added (§5) | MED | GSREG-NAV-01 |
| Already-on-record → no re-nav (INV-47) | GlobalSearch.vue:223-234 | SILENT | LOW | GSREG-NAV-02 |
| Vehicles shown as "Assets" (INV-20) | GlobalSearch.vue:60 | PRESERVES ("Assets" §4) | LOW | GSREG-LABEL-01 |
| ⌘K / Ctrl+K opens search (INV-40) | GlobalSearch.vue:243-254 | PRESERVES (§5.1) | LOW | GSREG-KEY-01 |
| De-dup: one record shown once (INV-16) | useGlobalSearch.ts:182-184 | SILENT | LOW | GSREG-DEDUP-01 |
| No feature flag (INV-90) | (absence) | CONFIRMS (§2/§10) | LOW | GSREG-FLAG-01 |
| No default workplace → graceful/no fetch (INV-34) | GlobalSearch.vue:131-137 | SILENT | LOW | GSREG-FETCH-01 |
| Usage analytics event on select (INV-48) | GlobalSearch.vue:211-217 | SILENT vs new telemetry §6.4 | MED | GSREG-ANALYTICS-01 + PO-REG-4 |
| Minimum 2 chars to match (INV-10) | useGlobalSearch.ts:69-71 | SILENT | LOW | GSREG-MINCHAR-01 + PO-REG-3 |

## B · CHANGED / REPLACED by V2 → NOT invariants (already covered by the V2 functional suite)
| V1 behaviour (INV) | V2 disposition | Where handled in V2 suite |
|---|---|---|
| 6 result types (INV-01) | CHANGED → 9 entities | GS-CON-01/PO-01/VI-01, tabs |
| WO indexed incl. "status" (INV-02) | **CHANGED at v12** — "status" dropped from WO indexed fields (§4) | matrix note + PO-REG-6 |
| Part = catalog, not inventory (INV-06) | CHANGED → inventory + stock badge (§5.3) | GS-ENT-04 |
| Prefix+substring, whitespace-strip (INV-11/12) | REPLACED by fuzzy matching (§7) | GS-FUZ-01..11 |
| No fuzzy matching (INV-13) | REMOVED (fuzzy added) | GS-FUZ-* |
| 3 per type cap (INV-14) | CHANGED → up to 5 (§5.2) | GS-GRP-02 |
| 350 ms debounce (INV-31) | CHANGED → 150 ms (§8) | (V2 functional) |
| Fetch once, client-side filter (INV-30) | CHANGED → server-side per-query (§8) | GS-API-* |
| WO newest-first; others unordered (INV-18) | REPLACED by ranking (§6) | GS-RANK-* |
| Data-driven group order (INV-19) | CHANGED → fixed order (§6.2) | GS-GRP-05/08 |
| Focus clears query (INV-49) | CHANGED → persists/restores query (§5.2) | GS-PERS-* |
| History in-memory, 5, session-only (INV-60/61/62) | CHANGED → persisted 30 days, grouped (§5.2/§8) | GS-REC-*/GS-RECAPI-01 |
| Invoices never a result type (INV-07) | CHANGED → Vendor Invoices added (§4) | GS-VI-01 |
| Customer haystack → "Contact/info match" (INV-17) | CHANGED → "Contact match" + Contacts entity (§4) | GS-ENT-07, GS-CON-01 |

## TALLY
Baseline invariants examined: 33 (INV-01…INV-91, deduped to the load-bearing set).
→ INVARIANTS kept (regression cases): **20**  ·  CHANGED/REPLACED/REMOVED: **14** (covered by V2 suite).
PO decision items: **6** (see PO-DECISION-REGISTER.md).  Retire/rewrite of separate V1 cases: **0** —
the V1 case bodies were already reconciled into the V2 suite (2026-08-25); no orphan V1 suite remains.

## HONEST LIMIT
Undocumented, untested, code-invisible behaviours cannot be fully enumerated. This baseline rests on the
V1 code handoff (fact) + the V2 PRD (intent) + our reconciled V2 cases. It does not claim to have found
every V1 behaviour. What protects us is this written, PO-reviewable invariant list plus the dated PO
questions below — not an assumption that "the rest is fine".

## OUTSTANDING — what I need from you
| What is missing | Who owes it | What it blocks | Since |
|---|---|---|---|
| Answers to PO-REG-1..6 (PO-DECISION-REGISTER.md) | Branko / PO | firming 5 flagged regression cases + the C-1 collateral risk | 2026-08-26 |
| Go-ahead to push the regression suite to TestRail (new section + run) | QA lead | putting the 20 cases live for execution | 2026-08-26 |
| A QA build of GS V2 | — | build-verifying all 20 (Rule 85) | 2026-08-26 |
