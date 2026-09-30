# WO Board & Tech View — Rule 117 reformat + tech-plan coverage (2026-09-30)

## Reformat (Rule 117)
All **127 cases** (folder 13204, sections 13236–13248, all `created_by = 3`, no foreign) reformatted
in place from live TestRail content. These were already the highest-quality suite in the estate —
build-grounded (real Work Orders QA build, real eligibility rules), build-glossary steps, runnable
Expected observations, verbatim quotes. The Rule-117 deltas applied:
- **Concise titles** — every over-length title shortened; all now ≤ ~80 chars (verified live).
- **Explicit seeding** — a standard "Seed / setup" step was prepended to every case's preconditions
  (ensure the location has ≥3 eligible lead technicians — Clockable, Active, not Office/Time-Clock —
  and several work orders across leads with some Unassigned, created via Work Orders > New; analytics
  and counts cases get their own tailored seed line). The existing detailed preconditions, steps,
  runnable results and verbatim quotes were preserved unchanged.

Scripts: `wob_lib.py`, `wob_v2.py` (all 127).

## Tech-plan coverage pass (Rule 115) — Board View & Tech View Display Options Technical Implementation Plan

### ADD (confirmed, testable, not covered by the PRD cases) — new folder 20449
- **C154648 — Imported view (clarification A3, confirmed 2026-09-24):** while Imported is selected the
  board displays are unavailable, and Imported is disabled as a Status-filter option in Tech/Board View.
- **C154649 — Below the desktop breakpoint (V-2 interim, Phase 13):** the new displays are withheld and
  today's mobile List is kept until the phone/tablet design exists.
- **C154650 — Tenant scoping (NFR-006 + inbound-technician-id org check):** new board/tech queries are
  scoped by organization + workplace; a reassignment with an out-of-org technician id is refused
  (server-side → HOLD, with the manual two-org observation).

### CONFIRM (already covered by the reformatted PRD cases)
Most NFRs are performance/architecture (developer/automated): NFR-001/004/005/012/013 (request budget,
lazy/virtualised rendering, relational order storage, debounced writes, fixtures/p95) — no manual case.
Observable ones already covered: NFR-008 (atomic lead change + status lock every path) → C96962/C96963/
C96965/C96966; NFR-009 (Back restores scroll) → C96916; NFR-010/011 (in-flight cancel, optimistic +
rollback + immediate counts) → C96921/C96959/C96968; NFR-007 (N-open loads on dialog open) → C96974.

### 🔴 DIVERGE — flagged for the QA lead / PO, NOT silently changed (Rules 56/58/113/115)
Three tech-plan clarifications post-date the PRD and CONFLICT with cases that currently quote the PRD.
The Expected quote is only changed when the SOURCE changes (Rule 113); a Confluence-comment answer with
the PRD not yet updated is a decision to surface, not to apply silently. Added to the OUTSTANDING
register:
1. **"N open" count — statuses.** PRD S4-R15 (and cases **C96974**, **C97032**) count THREE statuses
   (Approved, In Progress, Ready for Review). The tech plan's MF-3 clarification (Product, 2026-09-24)
   says **plus Complete** = four, "ignoring page filters (PRD S4-R15 not yet updated)." **Which governs?**
2. **Reordering locked (Invoiced/Paid) work orders.** The plan CHANGED the rule to "match the work order
   page" (Invoiced/Paid reorder within their current lead or within Unassigned, but cannot move to
   another technician or to/from Unassigned; Complete moves freely; Section 3.23). The S9 drag cases
   (**C97009**, **C97012**) enforce PRD status restrictions on every drag — **do they need updating to
   this nuanced rule?**
3. **"Assigned to me" on board displays (A1/A2).** Product direction is "all groups/columns stay
   visible but become secondary; groups with my work become primary," which the plan says **conflicts
   with S2-R9 / S3-N1 / S1-E1 as written** and is still with UX. Cases **C96937**, **C96951**, **C96922**
   currently HIDE the Unassigned group under Assigned-to-me (the PRD rule). **Hold until UX rules.**

## Result
- **130 cases** in folder 13204 (127 reformatted + 3 tech-plan ADDs). All titles ≤ ~80; every case
  carries an explicit seed step, build-glossary steps, runnable Expected + verbatim quotes.
- 3 DIVERGE items raised for the QA lead — cases left on the PRD wording pending a ruling.
