# Filters — Tech-Plan Reconciliation Change List (2026-07-29)

**LOCAL ONLY — nothing pushed to TestRail. The push queue below awaits explicit
authorization.** Driving source: `TechPlan-AppWide-Filter-Redesign.md` (engineering
tech plan, user upload 2026-07-29); classification detail in `TECH-PLAN-DELTAS.md`;
quality gate in `RULE28-AUDIT-2026-07-29.md`. TestRail links:
https://shopview.testrail.io/index.php?/cases/view/<id>.

Suite total: **137** (was 122): 79 in TestRail (C29557–C29635) + 58 with blank
C-ids (43 prior design-level + 15 new this pass).

---

## A. NEW CASES (15 — all blank C-id, need `add_case`; all VIU-Pending)

| Internal ID | C-ID | Title | Tech-plan anchor | Class | What needs doing (plain) |
|---|---|---|---|---|---|
| FLT-TAB-06 | new, no C-ID yet | First visit opens the Estimates tab; your last-used tab is remembered | D10 / §4-3.1 | IMPROVES-CASE | Add to TestRail when authorized; Branko Q5 may flip the default to All |
| FLT-STAT-07 | new, no C-ID yet | Imported works alone: picking it greys out the other filters | G1 | IMPROVES-CASE (+conflict C2) | Add when authorized; Branko Q3 confirms exclusivity |
| FLT-ASSET-07 | new, no C-ID yet | Choosing No shows only work orders whose asset is not on site | G4 / §4-1.6 | IMPROVES-CASE | Add when authorized; regression-watch the brand-new "No" path |
| FLT-URL-05 | new, no C-ID yet | Opening a filtered link never overwrites your saved filters | G7 / §4-3.4 | IMPROVES-CASE (+conflict C1) | Add when authorized; Branko Q2 ratifies runtime-only; capture the real "back to my saved filters" text live |
| FLT-PERS-05 | new, no C-ID yet | Each page and tab remembers its own filters separately | D20 | IMPROVES-CASE | Add when authorized; runnable once Parts/Reports rollout ships |
| FLT-PERS-06 | new, no C-ID yet | Filters saved before the redesign carry over after the update | §4-3.3 | IMPROVES-CASE | Add when authorized; PREPARE a pre-update browser profile BEFORE the build lands (release-critical migration) |
| FLT-RPTS-23 | new, no C-ID yet | Date range filter: results update when both start and end dates are picked | D19 | IMPROVES-CASE | Add when authorized; applies to nearly every report + Parts date columns |
| FLT-PSRCH-01 | new, no C-ID yet | Page toolbar Search expands in place and narrows the list as you type | D18 / S13-R1..R7,R9,R15 | IMPROVES-CASE | Add when authorized (new section "Page Search Toolbar"); confirm the on-screen copy live |
| FLT-PSRCH-02 | new, no C-ID yet | Page search combines with filters and is cleared separately | D18 / S13-R10,R13 | IMPROVES-CASE | Add when authorized; tighten "Clear filters vs search" once spec v1.3 S8-R5 is readable |
| FLT-PSRCH-03 | new, no C-ID yet | The page search text is remembered and restored like filters | D18 / S10-R4/R5,N2 | IMPROVES-CASE | Add when authorized; observe per-tab query scoping live (spec self-conflict C8) |
| FLT-PSRCH-04 | new, no C-ID yet | The search term is part of the shareable page link | D18/G7 / S11-R4/R5,N2 | IMPROVES-CASE | Add when authorized |
| FLT-PSRCH-05 | new, no C-ID yet | On mobile the search expands in the toolbar and buttons make room | D21 / S13-R16..R21 | IMPROVES-CASE | Add when authorized; check the named icon-collapse pages live |
| FLT-PSRCH-06 | new, no C-ID yet | Every list page keeps its own search box (Parts, Reports, detail tabs) | Phase 9.1 / S13-R22, S14-R5/R6 | IMPROVES-CASE | Add when authorized; pull the exact page list from the spec v1.3 export |
| FLT-PSRCH-07 | new, no C-ID yet | The top navigation search no longer filters page lists | Phase 9 / S14-R2/R3 | IMPROVES-CASE | Add when authorized; run only after pages have their own search boxes |
| FLT-API-06 | new, no C-ID yet | Saved-filters service round-trip: save, reload, and per-user isolation | §4-1.3 / G6 | API-CONTRACT | Add when authorized (goes to the "API — Work Orders List Filtering" section) |

## B. EDITED CASES — tester-facing content changed (needs `update_case` when authorized)

| Internal ID | C-ID / link | Change | Anchor | Class | What needs doing (plain) |
|---|---|---|---|---|---|
| FLT-PERS-02 | C29614 · https://shopview.testrail.io/index.php?/cases/view/29614 | Added step 6 (second computer/profile) + expected 3 (filters follow the account, cross-device) + note (server-side, last-write-wins; Report Suite will reuse this layer) | G6 | IMPROVES-CASE | Push the updated steps/expected when authorized; cross-device leg to confirm live |

## C. EDITED CASES — QA-notes/metadata only (NO TestRail content delta; no push needed)

| Internal ID | C-ID (or blank) | Note added | Anchor |
|---|---|---|---|
| FLT-STAT-03 | C29562 | Imported may be mutually exclusive (see FLT-STAT-07; pending Branko Q3) | G1 |
| FLT-CUST-05 | C29570 | Customer = the account/company (grid Customer column), not the contact person — seeding guidance | G3 |
| FLT-TECH-07 | C29581 | Technician list = active+clockable, location-scoped; off-location selections drop on switch | §4-3.2 |
| FLT-ADV-07 | C29588 | activeOnly mechanism; WO-detail + Advisor Analysis dropdowns intentionally keep inactive advisors (not bugs); location-scoped | G5 / §4-0.4 |
| FLT-EMPTY-01 | C29606 | Engineering empty-state copy "No work orders match your filters" — capture live before failing on wording | §4-3.5 |
| FLT-MOB-04 | C29624 | CONFLICT: design "Apply filter" button vs engineering real-time (D15) — pending Branko Q4; verify live before failing | D15 |
| FLT-API-01 | C29631 | Request convention: repeated per-value filter entries; verbatim field names; imported = separate request; no status= param | §4-0.3 / G1 |
| FLT-API-02 | C29632 | OR within a field / AND across fields | §4-0.3 |
| FLT-API-03 | C29633 | Deleted values dropped page-side before the request — check absence from the request too | §2.2 / S10-N1 |
| FLT-API-04 | C29634 | Disallowed field = controlled rejection (fine); HTTP 500 = the bug | §4-1.8 |
| FLT-PARTS-08 | blank | CONFLICT: no Vendors design frame per engineering (frame 11903:10461 = Vendor Invoices); hold against requested design — pending Q6 | §2 conflict 6 / Phase 7.3 |
| FLT-PARTS-11, FLT-PARTS-12 | blank | Rollout rule: design + links + persistence on every Parts page, semantics unchanged; date-range + per-view pointers | Rollout scope rule |
| FLT-RPTS-21, FLT-RPTS-22 | blank | Same rollout rule for reports; date-range-led; per-tab state pointers | Phase 8 |
| FLT-SRCH-01..08 | blank ×8 | OWNERSHIP: spotlight = Global Search v2 per engineering — recommend transfer/retire pending Branko Q6 | G8 / D22 |
| FLT-SRCH-09 | blank | Engineering answer recorded (toolbar search = Filters; spotlight = GS v2; nav search stops filtering lists) — pending Branko ratification | G8 / D22 |

## D. CONFLICTS routed to Branko/dev (NOT baked into cases)

`Questions-for-Branko-dev.md` — Q1 Status chip hidden vs greyed-out →
**RESOLVED-NO-CHANGE (user ruling 2026-07-30: hidden == greyed-out/disabled; the
pushed C29609/C29610 stand correct as pushed; no case change, no TestRail
write)**, Q2 link view runtime-only, Q3 Imported exclusivity, Q4 mobile
per-filter sheet Apply vs real-time, Q5 default tab Estimates, Q6 Parts Vendors design,
Q7 request the spec v1.3 export (drives the follow-up SPEC-RELEVANCE-RECONCILIATION —
Rule-11 ask first).

## E. PUSH QUEUE (awaiting explicit authorization — Standing Rule 6)

- **15 × `add_case`** (section A; FLT-PSRCH-01..07 need a new TestRail section
  "Page Search Toolbar"; FLT-API-06 goes to existing section 4124).
- **1 × `update_case`** (FLT-PERS-02 = C29614).
- 0 deletes. Run(s) untouched. NOTE: the 43 earlier design-level cases
  (Parts/Reports/⌘K) also still await their own authorized add_case — that queue
  predates this pass and stands separately (FLT-SRCH-01..09 within it should be held
  until Branko's Q6/ownership ruling).

## F. Deliverables regenerated this pass

- `testrail-import/filters-v1-testrail-import.csv`/`.xlsx` — 137 rows; header
  byte-identical to the sibling imports (md5-verified); 0 VIU/flag words; 0 dup
  titles/ids; API cases only in "API — Work Orders List Filtering" (6).
- `build/filters/testrail-id-map.csv` — 137 rows; 79 C-ids re-merged, 58 blank.
- `build/filters/PROJECT-STATE.md` — status updated.
