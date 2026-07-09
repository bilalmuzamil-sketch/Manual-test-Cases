# Fees & Discounts V1 — TestRail case-update audit log

**Date:** 2026-07-09
**Author:** ShopView QA (Claude)
**Authorization:** User instruction — "Update the test cases in TestRail based on your VIU findings" (apply the safe VIU case-update deviations in-place).
**Source of truth:** `build/fees-discounts/Deviations-and-Questions-for-PO.md` (Part 2 — case-update deviations).
**TestRail:** https://shopview.testrail.io · Project 1 · Suite 1 · API v2 `update_case/{case_id}`.
**Format matched:** each field written as an HTML `<ol><li>…</li></ol>` list (matching the existing F&D cases); leading "N. " numbering stripped per item. Fields written: `custom_steps`, `custom_expected` (no preconditions changed for any case). Every write re-fetched via `get_case` and byte-compared to the intended payload.

## Applied (10 cases) — all HTTP 200, re-fetch HTTP 200, VERIFIED

| fd_id | case_id | Change summary (old → new) | Update | Verify |
|---|---|---|---|---|
| FD-WO-001 | 28424 | Title was "New Fee / Discount"; menu item "Add Work Order Fee / Discount" → dialog title "Add new fee/discount" (WO number as subtitle); menu item "Add Fee/Discount". | 200 | VERIFIED |
| FD-LABOR-001 | 28439 | Subtitle "Applying to: Line 1 Labor — {name}" → "Applying to: {line name}" (no "Line N Labor —" prefix). | 200 | VERIFIED |
| FD-FIN-004 | 28467 | Card title "Work Order Fee / Discount", hover "Edit/Delete" → card title "WO Fees & Discounts", hover "Edit / Remove". | 200 | VERIFIED |
| FD-REMOVE-001 | 28479 | Confirm message 'Remove "{name}" from this work order?' + toast "Discount removed" → message "Are you sure you want to remove this fee?"; toast observed "Fee removed" (kind-variance flagged as open); sidebar card renamed "WO Fees & Discounts"; menu action "Remove". | 200 | VERIFIED |
| FD-TMPL-001 | 28502 | Location Administration → Service, below "Canned Lines" → Administration → Finance (route /administration/adjustment-templates), below "Payment Methods". | 200 | VERIFIED |
| FD-TMPL-003 | 28504 | Button "Add Fee / Discount", toast "Fee added", amount label "Amount", Taxable/auto-apply dropdown+checkbox, no Description → button "Create", toast "Template created", "$ Default Amount", Taxable & Auto-apply toggles, "Description (Optional)" (255-char) field, auto-apply label "Auto-apply to new work orders". Title "New Fee / Discount" kept. | 200 | VERIFIED |
| FD-TMPL-004 | 28505 | Toast "Discount added" + confirm "Add Fee / Discount" → toast "Template created" (generic); confirm "Create". | 200 | VERIFIED |
| FD-TMPL-006 | 28507 | Toast "Fee updated" → "Template updated"; added "Type & Calculation type locked in edit". | 200 | VERIFIED |
| FD-TMPL-008 | 28509 | Warning "…set as a default for 2 customer(s). Their defaults will be removed too." → "…set as a default for 2 customer(s). Deleting it will remove it from them." | 200 | VERIFIED |
| FD-PROC-008 | 28526 | Menu "Delete" only (no Edit) → menu shows "Edit" and "Remove", Edit is inert (rejected for a Processing Fee); removal works. (Kept UI-only: no literal HTTP status in expected, so the case stays out of the API section per Standing Rule 4.) | 200 | VERIFIED |

## HELD — NOT written to TestRail (unchanged)

**Bug-overlapping case-updates** (keep spec expected — real code bugs):
- FD-TMPL-011 (28512) → FDBUG-9 (maxCap:0 no-cap bug)
- FD-HIST-002 (28561) → FDBUG-11 (missing "Type:" line)
- FD-TMPL-010 (28511) → FDBUG-13 (line-scope picker absent)

**PO-question threads** (await product ruling):
- FD-STATS-001 (28459), FD-PERM-002 (28586), FD-WO-013 (28436), FD-CUST-016 (28500),
  FD-VAL-007 (28605), FD-WO-005 (28428), FD-VAL-001 (28599), FD-INLINE-003 (28456),
  FD-CUST-005 (28489). (NOTE-FD-4 has no standalone TestRail case.)

**Deferred by QA (see note below): FD-CUST-003 (28487), FD-CUST-004 (28488), FD-CUST-006 (28490), FD-CUST-007 (28491)** — NOT written. See discrepancy note.

## Discrepancy note — FD-CUST-003/004/006/007

The task's explicit APPLY list named these four, but the source doc
(`Deviations-and-Questions-for-PO.md`) flags them differently and its tie-break rule
("follow the doc — skip PO-question rows") governs:
- Part 1 item #8 (FD-CUST-005 picker ruling) states its PO ruling "**also settles the
  case-update rows FD-CUST-003/004/006/007**" — i.e. they are contingent on an unresolved
  PO decision.
- The Part 2 summary explicitly says FD-CUST-003/004/006 "should **NOT** simply be
  rewritten … blocked on the Part-1 #8 picker ruling."
- FD-CUST-004's proposed expected has **no single final wording** ("Either keep as a build
  gap … OR rewrite to single-add"); FD-CUST-006's is "'No results' (or dev fix the copy)".

Because these depend on an unresolved PO ruling and two lack a concrete final wording,
they were **held** rather than guessed (Standing Rule 1). Recommend applying them after the
PO picker ruling, or on explicit confirmation to use the actual-behaviour wording now.

## Scope confirmation
- Only the 10 cases above were written. No cases created, deleted, or moved between
  sections. No other TestRail objects (runs/results/sections) touched.
- case_ids resolved from `build/fees-discounts/testrail-id-map.csv`; every case_id present.
