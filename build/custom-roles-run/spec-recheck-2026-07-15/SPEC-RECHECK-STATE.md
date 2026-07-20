# Custom Roles (SV-7388) — Spec-Recheck STATE (canonical resume doc)

> Vlad's spec-recheck (nightly failures = test-case-vs-spec mismatch). Run on branch
> `claude/slack-session-0sxnd9`. Files dated `2026-07-15` (container clock); real run 2026-07-20.
> **DELIVERABLE COMPLETE — proposal for Bilal & Vlad to agree; NOTHING pushed to TestRail.**

## What was done
1. **Atlassian MCP confirmed live** — read Confluence 565116952 ("Custom Roles and Permissions",
   Owner Sasha Grosman, last edit 7/14) and Jira Epic SV-7388 (In Progress).
2. **Ingested the current spec** → `build/custom-roles-spec-update/current-spec-2026-07-15.md`;
   diffed vs the 09-Jul on-file copy → `spec-diff-2026-07-15.md` (headline: 7/14 Office
   redefinition; "View History Logs"→"View Part History"; PS invoice reversal = Part Sales Delete).
3. **Ingested ALL 203 DONE/OBSOLETE SV-7388 tickets + 2 REF tickets** with FULL comments →
   `sv7388-done-tickets/SV-*.md`; digested into `ticket-behavior-map.md` (206 rows + 20-point
   authoritative rulings cheat-sheet, last-update-wins). Open (not-Done) tickets →
   `sv7388-open-tickets-2026-07-15.md` (57).
4. **Reconciled all 269 local case bodies** (core 3528-3553 + API 4091) vs spec + ticket rulings →
   `findings-G1..G6.json`. **220 OK / 44 UPDATE / 5 OPEN-QUESTION.**
5. **Produced the proposed-corrections deliverable** (`build/custom-roles-run/`):
   `CustomRoles_SpecRecheck_Proposed-Corrections_2026-07-15.xlsx` (+ .md + .csv) — tabs Summary /
   UPDATE / OPEN-QUESTION / OK; columns Case ID + TestRail Link + Section + Area + Title + Verdict
   + Field(s) + Current + Proposed + Reason + Citation + Confidence. Generator:
   `gen_spec_recheck_corrections.py`. Label rename batch: `LABEL-BATCH.md`.

## Headline corrections (highest priority)
- **C26503 Office User** — 7/14 spec redefinition: WO none, Part Sales none, Invoicing V/E/D
  (Create Invoice hard-blocked). + 2 flagged spec-internal open items (Office WOL=V vs WO=none;
  payments-without-create-invoice = SV-7993 open).
- **C26496 Service Manager** — now HAS Work Orders Delete (SV-8297, reverses SV-8093).
- **C26504 Sales Representative** — NOT Reports-only: WO View, WOL View, Customers V/E, Part
  Sales View (SV-8061 verified 7/14).
- **C26488/C26489 View History Logs** — repurposed to "View Part History" (inventory only);
  WO/line audit log now = WO C&E, story history = WOL View (spec 7/7; build fix SV-8202 open).
- **C29457-C29460 Time Clock API** — the 4 "BUG" 403-guards assert a contract the PO DECLINED
  (SV-7958, 2026-07-14: backend leaves these open by design). Flip to accepted behaviour. Very
  likely a chunk of Vlad's nightly failures.
- **C26387/C26388 New WO Add Customer/Add Asset** — buttons ARE shown & work without Customers
  C&E (SV-8002); old expected was inverted.
- **41-case label batch** — "View and Manage AP/AR Data"→"Manage Accounts Payable and Receivable"
  (32) + "View History Logs"→"View Part History" (9). Confirm the LIVE build label first
  (Rule 12): the 2026-07-13 VIU used the old labels, so the build may still show them.

## The 5 OPEN-QUESTIONs (need Bilal/Vlad/PO agreement)
- C26339 — role-name uniqueness: spec says "unique" vs build's soft "similar role" warn.
- C26419 — Return-to-Inventory gate: Catalog & Inventory Edit (OQ3/§1f) vs Vendor & Order Mgmt Edit (§1g).
- C26459 / C26464 — Tech View labor rate: spec §4 hides it vs SV-8107 (closed not-a-bug, visible with SFD ON).
- C29435 — WO-line quantity edit: SV-8136 (needs WOL C&E) vs SV-8055 (Parts-tab edit without WOL C&E).

## How to resume / next steps
1. Bilal + Vlad review `CustomRoles_SpecRecheck_Proposed-Corrections_2026-07-15.xlsx`, decide each
   UPDATE + resolve the 5 OPEN-QUESTIONs (+ ask the PO the flagged spec-internal contradictions).
2. **Live-build label check** for the 41 label-batch cases before touching them (Rule 12).
3. On agreement + fresh one-day TestRail write authorization: apply via get_case→update_case with a
   per-case audit log (filename = C-ID; no id-map). Then regenerate the workbook + Blockers Tracker.
4. Cross-reference Vlad's actual failing nightly IDs against the UPDATE list to confirm coverage.

## Inputs index (all committed)
- Spec: `build/custom-roles-spec-update/current-spec-2026-07-15.md`, `spec-diff-2026-07-15.md`
- Tickets: `sv7388-done-tickets/` (SV-*.md + map-fragment-1..4 + ticket-behavior-map.md), `sv7388-open-tickets-2026-07-15.md`
- Cases: `cases-2026-07-13/C*.json` (269; filename = C-ID)
- Findings: `spec-recheck-2026-07-15/findings-G1..G6.json`, `RECONCILE-PLAN.md`, `LABEL-BATCH.md`
- Deliverable: `CustomRoles_SpecRecheck_Proposed-Corrections_2026-07-15.{xlsx,md,csv}` + `gen_spec_recheck_corrections.py`
