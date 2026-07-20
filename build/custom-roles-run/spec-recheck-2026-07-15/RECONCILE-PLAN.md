# Custom Roles spec-recheck — case-reconciliation execution plan

> Written 2026-07-20 (files in this pass are named `2026-07-15` because the container
> clock reads Jul 15; treat them as THIS pass's artifacts). Six reconciliation agents
> hit the session usage limit (reset 10:10 UTC) before writing anything — relaunch
> them with the prompt template below. NO TestRail writes in this pass: output is a
> PROPOSED-corrections sheet for Bilal & Vlad to approve first.

## Inputs (all committed on branch claude/slack-session-0sxnd9)

1. **Current spec (ground truth):** `build/custom-roles-spec-update/current-spec-2026-07-15.md`
   (Confluence 565116952, live export; last page edit 7/14 "Updated Office Role definition").
2. **Spec diff vs 09-Jul:** `build/custom-roles-spec-update/spec-diff-2026-07-15.md`
   (headline: Office loses WO+PS, gains Invoicing V/E/D w/ hard-coded Create-Invoice block;
   "View History Logs"→"View Part History"; retro-edited 6/28 row: PS invoice reversal = Part
   Sales → Delete).
3. **Ticket rulings (last-update-wins):** `build/custom-roles-run/sv7388-done-tickets/ticket-behavior-map.md`
   (206 rows + authoritative cheat-sheet) + per-ticket `SV-*.md` files in the same folder
   for full quotes.
4. **Open defects register:** `build/custom-roles-run/sv7388-open-tickets-2026-07-15.md`
   (57 not-Done tickets — cases keep asserting SPEC behavior; these explain current build
   failures, cite them as "known open defect" instead of rewriting the case).
5. **Case source (current TestRail wording):** `build/custom-roles-run/cases-2026-07-13/C*.json`
   (269 files; filename = TestRail C-ID; fields: case_id, section_id, title, custom_preconds,
   custom_steps, custom_expected, viu_status, evidence).

## Contradiction rule

LAST-UPDATE-WINS everywhere: newest timestamp is authoritative across (a) Sasha comment vs
Sasha comment, (b) spec section vs spec section (use change-log dating), (c) Sasha comment vs
spec (a 7/14 spec edit beats a 7/13 comment; a 7/13 comment beats a 7/7 spec row). Resolved
examples: cores OK/Not-OK = WO→View (7/7); story history = WOL View ≡ WO View (7/7); audit
logs (WO+line) = WO→C&E; WO-invoice reversal = WO→Delete, PART-SALE invoice reversal =
Part Sales→Delete (retro-edited 6/28 row, newer than SV-8084/8088); Notes model = SV-8003
Sasha 7/8 (View CRUD: create+edit anyone's+delete own; Delete CRUD: delete others');
Send to Portal = Full View (not Customer Portal); Send to Terminal = Invoicing C&E +
Customer Portal ON; Time Clock BE enforcement NOT required (SV-7958 Sasha 7/14) — FE-only OK.

## Open items that must be flagged OPEN-QUESTION, not rewritten

- Office deposits/payments/credits without Invoicing C&E (SV-7993 comment 73184 unanswered;
  spec Q2 blank; 7/14 matrix gives Office Invoicing V/E/D + hard-coded no-Create-Invoice).
- Office WOL=V while WO=— (violates "WOL View inherits WO View" — flag to PO).
- Reset to Template requirements missing (spec Q11 blank).

## Agent groups (6)

| Group | Sections | Cases | Focus |
|---|---|---|---|
| G1 | 3528 Roles List, 3529 Create, 3530 Edit, 3531 Delete, 3532 Permission Summary, 3533 Cascade | 66 | role-editor UI, Office/Time-Clock not-editable, cascade/gates/modals |
| G2 | 3534 Work Orders, 3535 WO Lines, 3536 Schedule | 32 | WO/WOL/Schedule perms, notes, cores, story/audit, sub-settings |
| G3 | 3537 Customers, 3538 Parts Dept, 3539 Invoicing, 3540 Timesheets | 43 | customer notes/sensitive fields, parts areas, invoicing gates, timesheets |
| G4 | 3541 Page Toggles, 3542 Settings, 3543 View Mode, 3544 SFD, 3545 AP/AR | 57 | toggles, Integrations, Tech View, SFD scoping, AP/AR |
| G5 | 3546 View History Logs, 3547 Staff Page, 3548 Per-Role, 3549 Migration, 3550 Staff Record, 3551 QuickBooks Reloc, 3552 Strings, 3553 Cross-Perm | 56 | View Part History relabel, role matrices (Office 7/14!, SM WO Delete, Sales Rep), migration, QB=Integrations |
| G6 | 4091 Time-Clock API | 15 | SV-7958 FE-only ruling → re-scope C29457–C29460 |

## Output contract (per agent)

Write `build/custom-roles-run/spec-recheck-2026-07-15/findings-G<n>.json`: JSON array, one
object PER REVIEWED CASE:

```json
{
 "case_id": 26307,
 "section_id": 3528,
 "title": "...",
 "verdict": "OK | UPDATE | OPEN-QUESTION | OBSOLETE-CANDIDATE",
 "fields_affected": ["steps","expected"],
 "current_excerpt": "the specific current text that is wrong (plain text)",
 "proposed_text": "full replacement text for each affected field, build-accurate layman wording, keep <ol>/<li>/<p> HTML shape of the source field",
 "reason": "one-sentence why",
 "citation": "spec §1a View (7/7 change) / SV-8003 Sasha 2026-07-08 / ...",
 "confidence": "high|medium|low"
}
```

`proposed_text` may be an object keyed by field (`{"custom_steps": "...", "custom_expected": "..."}`)
when multiple fields change. OK-verdict rows need only case_id/section_id/title/verdict.
Titles/preconds/steps/expected must stay layman + build-accurate (Standing Rule 9); do not
invent UI labels — reuse labels already in the case or in the spec.

## After all 6 agents

Merge findings → generate `CustomRoles_SpecRecheck_Proposed-Corrections_<date>.xlsx` (+ .md/.csv)
with tabs per verdict + Summary; columns: C-ID, TestRail link, Section, Title, Field(s),
Current, Proposed, Reason, Citation, Confidence. Commit + push. NO TestRail writes.
