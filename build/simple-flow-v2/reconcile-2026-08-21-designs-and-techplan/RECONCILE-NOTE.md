# Simple Flow V2 — reconciliation owed (new designs + tech plan, 2026-08-21)

**Received 2026-08-21, after the 61-case SFv2 suite was authored.** The QA lead supplied updated designs
(Purchase Orders Page, Work orders and settings setup) and the **Simple Flow V2 Technical Implementation
Plan**, with the instruction: **"if the previously given design conflicts with this one then this one wins."**

## Status: SNAPSHOTTED, RECONCILIATION QUEUED (not yet run)
Inputs are committed here so nothing is lost. A bounded reconciliation is owed:
1. **Tech plan (now supplied)** clears the old MISSING tech-plan flag (register SFV2-4 / DD D4). Rule 30:
   informs, never overrules — diff it for edge cases/API contracts our spec-sourced cases may have missed.
2. **New designs win over the old ones on conflict** (Rule 32, latest-wins). Our 61 SFv2 cases are almost
   all sourced from the spec v21 acceptance criteria (Rule 57 — the build/design supplies appearance, not
   expected behaviour), so the design change is expected to affect few cases. The reconciliation is a
   design-diff: for each case that rests on a design detail (labels, layout, control placement — chiefly
   the Purchase Order pages / bulk receive, Story 14, and the bulk bar priority), confirm the new design
   agrees; where it differs, the new design wins and the case is updated + re-stamped (Rule 41 whole-case).
3. Re-run the coverage matrix + a targeted RUA over any changed cases; regenerate the import if any changed.

**Why queued, not done now:** the QA lead flagged a very tight remaining budget and asked above all that
existing work not be lost if we run out. Digital Inspections V2 was mid-authoring when these arrived;
finishing one project cleanly and preserving these inputs beats leaving two half-done. This note + the
committed sources make the reconciliation a clean resume.
