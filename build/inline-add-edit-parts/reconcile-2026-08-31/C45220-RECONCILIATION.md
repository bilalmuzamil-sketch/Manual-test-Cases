# C45220 reconciliation (Rule 39) — NO contradiction found

**Date:** 2026-08-31 · **Case:** C45220 "Adding a part to a completed line reopens the line" ·
**Creator:** Vladimir Tomovic (TestRail user 1) · **Automated (atmstatus=3)** · refs: none · in run **R418**.
**Posture:** Rule 38 hands-off (foreign) + Rule 71 (Automated) — NOT edited, only reconciled.

## The earlier "contradicts S1-N1" flag was a FALSE ALARM
The 6597 verification pass flagged C45220 as possibly contradicting **S1-N1** (Add Part hidden on a
Complete / Invoiced / Paid / Declined / Imported **work order**). On reading the case, it does not:

- **S1-N1 is about the WORK ORDER status.** When the *work order* is Complete etc., the Add Part control
  is hidden entirely.
- **C45220 is about a completed LINE inside an Approved work order.** Its own precondition states verbatim:
  *"a Complete work order hides the Add Part control entirely"* — i.e. it **explicitly agrees with S1-N1**
  and deliberately keeps the work order in **Approved** (line 2 Authorized) so the Add Part control is
  present. It then tests that adding a part to a **Complete line** reopens that line.

Different scenario (line status vs work-order status), and consistent with S1-N1. **No contradiction.**

## What it is instead
- **Complementary coverage.** Our suite covers Add Part availability by *work-order* status (S1-N1) and by
  permission; it does not assert what happens when a part is added to an individual **Complete line**. The
  spec (v16) is **silent** on per-line completed-status re-open behaviour.
- **Possible spec-silence item for the PO (Sasha Grosman):** "Should adding a part to a Complete line
  reopen the line?" — Vlad's automated case asserts yes; the PRD does not state it either way. Flagging as
  a question, not authoring a case against an unstated behaviour (Rule 57/58: an ambiguous/unstated source
  is held and asked, never invented).

## Disposition
- **Kept in R418** (QA-lead go-ahead 2026-08-31). It belongs to the group 6597 subtree, so the union-sync
  (Rule 34) includes it naturally; excluding it would only be reverted on the next sync.
- **Not edited** (Rule 38 foreign + Rule 71 Automated). Vlad owns it.
- Flagged to Vlad/PO: the per-line re-open behaviour is a spec-silence question; no change to our suite.
