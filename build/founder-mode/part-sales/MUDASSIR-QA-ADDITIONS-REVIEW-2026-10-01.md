# Review — "Part Sales — QA Additions (Mudassir)" (section 20481), 2026-10-01

**Author:** Mudassir (TestRail user id 6) — these are FOREIGN cases (Rule 38: report, never edit).
**Scope:** 43 cases C154841–C154883 in a sibling folder under Founder Mode (20434), NOT inside our
Part Sales folder (20435). Sub-sections: 20482 S9 Deposit audit log, 20483 S10 Portal deposit,
20484 XC Cross-cutting.

## Are they valid? — YES
Checked each case live and against the real sources:
- **S9 Deposit audit log (SV-9867)** — a customer-reported bug (Carolina Axle Surgeons), status
  TESTING QA: "Deposits Received on Work Orders Are Not Recorded in the Audit Log." 21 cases covering
  the four deposit entries (received/applied/unapplied/reversed) on work orders AND part sales,
  attribution, no-backfill, money-unchanged regressions, and a discrepancy case.
- **S10 Portal deposit (SV-10261)** — a Task **under our epic SV-9667**, status TESTING QA: "Customer
  Portal: allow a deposit to be collected on a part sale." 9 cases covering the allow/refuse verdicts,
  portal checkout, both QuickBooks sync patterns, portal refund, and labelling. Matches the ticket's
  acceptance criteria.
- **XC Cross-cutting** — 13 cases: permission matrix, end-to-end post/pre-cutoff, tablet width,
  cent-level agreement across surfaces, and a "spec discrepancies to raise" case.

**Format audit (all 43):** 43/43 discrete-list preconditions · 43/43 carry verbatim quotes/source in
Expected (he cites SV-10261 ACs, PRD S8-R11/R12, a Chris Ward Jira comment 21 Sep, release notes
879853582, SV-5674) · build-glossary, runnable. **Minor nit only:** 5 titles exceed the ~80-char
Rule-117 guideline (C154846=95, C154847=88, C154852=96, C154857=86, C154868=96). Foreign → report, not
fix.
**Good practice to credit:** C154883 flags two real spec discrepancies (duplicate id S1-R22; deposit
minimum $1.00 in portal release notes vs $0.01 in SV-5674) to raise with Chris Ward — adversarial QA.

## How did we ("I") miss them? — CORRECTED 2026-10-01
**They WERE part of a source provided to us. This is a real coverage gap, not an out-of-scope case.**
(Correction: an earlier version of this doc wrongly said SV-9867 was "not under epic SV-9667." That was
asserted without checking the parent field. Verified via JQL `parent = SV-9667` and getJiraIssue:
**both SV-9867 and SV-10261 are children of epic SV-9667** — the epic we were given as a source.)

1. **The epic SV-9667 was a provided source, and we did not traverse it.** We were handed the epic plus
   one Confluence PRD per feature, and we authored strictly from the individual feature PRD pages.
   SV-9667 has **55 children**; enumerating them (Rule 37 "read epics exhaustively"; Rule 115 "cover
   every provided source") would have surfaced SV-9867 and SV-10261 as testable tickets. We never
   enumerated the child list — that is the miss.
2. **SV-9867 (deposit audit log)** — child of SV-9667, status TESTING QA. Not in the Part Sales PRD
   text, but reachable from the epic. We did not author it at all. **Genuine gap.**
3. **SV-10261 (portal deposit)** — child of SV-9667, status TESTING QA, and named once in our Part
   Sales PRD (the S8 deferral note). We covered S8-R8..R11 only as the PRD framed them (portal gated/
   declining; C154628, C154635) and did NOT pull SV-10261's own acceptance criteria for the shipped
   behaviour. Partial gap.
4. **There are likely MORE uncovered children** (e.g. SV-9226 Part Sale total-tax bug, SV-9729
   Inspection Reports in Portal, SV-10398 per-fee QBO mapping, SV-10403 Fixed Rules Story 4, and
   several bugs) — a full epic-to-coverage map is needed to find every gap, not just the two Mudassir
   covered.

## Follow-on finding on OUR suite (needs attention)
Now that SV-10261 is in TESTING QA (portal no longer blanket-refuses part-sale deposits), our S8
cases **C154628** and **C154635** — which describe the pre-SV-10261 state ("portal declines",
"unreachable") — may be **STALE** and should be re-verified against the build when one is available.
This is the Rule-44 check: a newer foreign case (Mudassir's S10) describing the opposite (portal now
allows) is a flag against our older cases until the build settles which is current.

## Overlap (for the QA lead, so runs don't double-count)
Mudassir's S10 (portal deposit) overlaps our S8 C154628/C154635 in subject but not in content (he
tests the shipped allow-path; we tested the gated/declining path). His S9 deposit-audit-log is new
(our S4 covered the general Part Sale Log, not deposit entries). Complementary, not duplicate.
