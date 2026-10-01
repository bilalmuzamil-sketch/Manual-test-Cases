# Epic → coverage gap map (first pass, 2026-10-01)

**Signal = whether any of our TestRail cases cite the Jira key.** This is an INDICATOR, not a verdict:
a story can be covered by behaviour without citing its key (proven on MR). STORY candidates below are
being verified against actual case content before any are called a true gap. OBSOLETE excluded (QA lead).

## SV-9667 Founder Mode Batch #1 — 55 children, 26 cited by our cases
- **STORY**: 28 total · 24 cited · **3 NOT cited (candidates):**
    - SV-10398 [Open] Per-fee QBO account mapping: map individual fees to distinct Products/Se
    - SV-10403 [Open] Parts Alphabetical Sort - Story 4 - Fixed Rules, List Rules Without A Ca
    - SV-9729 [Open] Inspection Reports In Portal - Story 1 - Auto-posted inspection reports 
- **BUG**: 8 total · 0 cited · **8 NOT cited (candidates):**
    - SV-10274 [Ready to Fix] Work Order Notes UI Extends Horizontally When Multiple Images Are Attach
    - SV-10323 [Ready to Fix] Note attachment update checks the uploader's organization instead of the
    - SV-10380 [Ready to Fix] Inventory Value report ignores negative bins and overstates net inventor
    - SV-10386 [Open] categories-list endpoint has no authorization check
    - SV-10387 [Open] Fixed Rules tab shows fixed prices without two decimals ($4.5, $1.4)
    - SV-10445 [Open] Fixed Rules tab omits fixed rules whose part has no category
    - SV-10688 [Open] Part sale ⋮ menu shows Set Status with an empty submenu to view-only use
    - SV-9226 [TESTING QA] Part Sale Overview Total Does Not Include Tax
- QA/DEV verify-tasks (NOT our authoring scope): 15 (15 not cited) — tracked, not gaps
- OBSOLETE (no cases needed): SV-10263, SV-5554

## SV-10647 Part Lifecycle
- 0 Jira children (stories are PRD-only; TestRail folder 20439 = 62 cases). No epic-child gap.

## SV-10043 WO Board & Tech View — 14 children, 10 cited by our cases
- **STORY**: 11 total · 10 cited · **0 NOT cited (candidates):**
- **BUG**: 1 total · 0 cited · **1 NOT cited (candidates):**
    - SV-9769 [Ready to Fix] WO line row shows Labor "Unassigned" but the Edit Line dialog shows tech
- QA/DEV verify-tasks (NOT our authoring scope): 2 (2 not cited) — tracked, not gaps
- OBSOLETE (no cases needed): SV-10053

## SV-3780 Maintenance Reminders — 20 children, 12 cited by our cases
- **STORY**: 20 total · 12 cited · **8 NOT cited (candidates):**
    - SV-10567 [Open] Enter a mileage or engine hours reading
    - SV-10568 [Open] Estimate readings and grade confidence
    - SV-10569 [Open] Resolve each service's due date
    - SV-10572 [Open] Maintenance panel on a work order
    - SV-10573 [Open] Add a service to a work order
    - SV-10574 [Open] Complete a service and reset its cycle
    - SV-10575 [Open] Automatic customer reminder email
    - SV-10577 [Open] Work order origin reporting
- **BUG**: 0 total · 0 cited · **0 NOT cited (candidates):**
- QA/DEV verify-tasks (NOT our authoring scope): 0 (0 not cited) — tracked, not gaps

## SV-8181 Digital Inspection V2 — 40 children, 16 cited by our cases
- **STORY**: 25 total · 16 cited · **8 NOT cited (candidates):**
    - SV-8347 [Open] Improvement - Enable deleting incomplete inspection (Not started status)
    - SV-9112 [In Progress] DVI V2 - ShopCoach line generation — the brief
    - SV-9881 [Open] DVI V2 - Seed the five starter templates from the shops' current forms
    - SV-9882 [Open] DVI V2 - Convert reference files the viewer cannot render
    - SV-9884 [Open] DVI V2 - Preview mode in the template builder
    - SV-9885 [Open] DVI V2 - Unify the measurement row scope vocabulary
    - SV-9886 [Open] DVI V2 - Mobile design for the asset Inspections tab
    - SV-9887 [Open] DVI V2 - Success and error message copy across the epic
- **BUG**: 12 total · 0 cited · **12 NOT cited (candidates):**
    - SV-10257 [Open] Digital inspection progress is lost/reset when navigating back, causing 
    - SV-7671 [Done] Inspection status and progress update incorrectly after discarding chang
    - SV-7681 [Board Backlog] Instructions field with no spaces causes horizontal scrollbar and breaks
    - SV-7692 [Board Backlog] Clicking the name of a published template does not open the editor — onl
    - SV-7773 [Open] Mobile: "Add Section" button has no label and only increments sections o
    - SV-7774 [Open] Mobile: No back navigation option when adding field types in inspection 
    - SV-7775 [Ready to Fix] Mobile: "View PDF" button is non-functional and "Download PDF" button op
    - SV-8128 [Ready to Fix] Techs can complete inspection lines even when inspections are incomplete
    - SV-8144 [Open] Make Digital Inspections PDF report title generic for all inspection typ
    - SV-8145 [Done] Digital Inspections mobile view does not display inspection item Instruc
    - SV-8543 [Open] Mobile inspection filler — large empty band below footer (Next / Review 
    - SV-9043 [Open] Inspection Templates: New Template button disappears from the right-hand
- QA/DEV verify-tasks (NOT our authoring scope): 2 (2 not cited) — tracked, not gaps
- OBSOLETE (no cases needed): SV-9108

## SV-490 Dashboard — 26 children, 12 cited by our cases
- **STORY**: 25 total · 12 cited · **0 NOT cited (candidates):**
- **BUG**: 1 total · 0 cited · **0 NOT cited (candidates):**
- QA/DEV verify-tasks (NOT our authoring scope): 0 (0 not cited) — tracked, not gaps
- OBSOLETE (no cases needed): SV-9341, SV-9342, SV-9343, SV-9344, SV-9345, SV-9346, SV-9347, SV-9348, SV-9349, SV-9350, SV-9351, SV-9352, SV-9451, SV-9699

---

# VERIFIED verdicts (behaviour-checked against case content, 2026-10-01)

Each candidate story's Jira behaviour was checked against our actual case bodies (not key-citation).

## Dashboard (SV-490) — ✅ CLEAN. 0 gaps (14 obsolete excluded).
## WO Board & Tech View (SV-10043) — ✅ CLEAN. All 11 live stories covered; only 1 unrelated WO-line bug (SV-9769) + 2 QA verify-tasks.
## Part Lifecycle (SV-10647) — no Jira children (PRD-only). 62 cases.

## Founder Mode (SV-9667) — no current in-scope gap
- SV-10398 Per-fee QBO account mapping → **OUT OF SCOPE** (a QuickBooks settings feature; not a Batch-1 sub-feature).
- SV-9729 Inspection Reports in Portal → **OUT OF SCOPE** (separate Customer-Portal/inspection feature).
- SV-10403 Fixed Rules "list rules without a category" → **DEFERRED / FUTURE** (our C154744 correctly tests the current deferred behaviour; when SV-10403 ships, C154744 must be rewritten + cases added).
- SV-9867 (deposit audit log), SV-10261 (portal deposit) → covered by Mudassir's QA-Additions folder (20481).

## Maintenance Reminders (SV-3780) — REAL GAPS
- COVERED: SV-10568 (estimate/confidence), SV-10569 (resolve due date).
- PARTIAL (missing aspects): SV-10567 (reading **plausibility** rule untested), SV-10573 (add service to an **existing** WO untested), SV-10574 (**Mark-complete flow** / reset-from-work-done-date / completed-elsewhere untested).
- 🔴 GAP: **SV-10572 Maintenance panel on a work order** (untested); **SV-10577 Work order origin reporting** on the WO + Work Orders list (untested).
- DEFERRED: SV-10575 automatic customer reminder email — spec defers this release (correctly untested).

## Digital Inspection V2 (SV-8181) — ONE real gap + one real sub-gap
- COVERED: SV-9112 (ShopCoach brief), SV-9881 (seed 5 templates), SV-9884 (preview mode), SV-9886 (mobile design — requirements already asserted on phone).
- PARTIAL: SV-9882 (**conversion**: render-in-place after server-side conversion / download-original / corrupt fallback untested — only the pre-conversion fallback is tested); SV-9885 & SV-9887 (copy/vocabulary consolidation — triggering conditions already covered; largely UX-writing, likely not standalone manual cases).
- 🔴 GAP: **SV-8347 Delete/reopen an incomplete inspection** (permission-gated) — fully uncovered.

# TRUE, in-scope, non-deferred gaps worth new cases
1. MR SV-10572 — Maintenance panel on a work order (GAP)
2. MR SV-10577 — Work order origin reporting on WO + Work Orders list (GAP)
3. MR SV-10567 — reading plausibility ("questioned when implausible, never refused") (PARTIAL)
4. MR SV-10573 — add a service to an existing work order (PARTIAL)
5. MR SV-10574 — Mark-complete flow + reset-from-date-done + completed-elsewhere (PARTIAL)
6. DI V2 SV-8347 — delete/reopen an incomplete inspection, permission-gated (GAP)
7. DI V2 SV-9882 — reference-file conversion render-in-place / download-original / corrupt fallback (PARTIAL)

# Not new cases (recorded, no action)
- Deferred/future: MR SV-10575 (spec-deferred email); FM SV-10403 (ships later → then rewrite C154744).
- Out-of-scope separate features: FM SV-10398 (QBO settings), FM SV-9729 (Inspection Reports in Portal).
- Copy/UX-writing only: DI V2 SV-9885, SV-9887 (conditions already covered).
- Bugs (defects, separate from story coverage): FM 8, DI V2 12, WO Board 1 — a defect-regression-case decision, not story coverage; list retained in the first-pass section above.
