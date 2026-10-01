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

## How did we ("I") miss them?
Not a gap within our assigned scope, with one fair self-criticism:
1. **SV-9867 (deposit audit log) was never in our assignment.** It is a standalone customer bug Task,
   NOT under epic SV-9667 and NOT in the Part Sales Update v1 PRD (867434569) we were given. We were
   pointed at that one PRD; SV-9867 is a different ticket.
2. **SV-10261 (portal deposit) we DID cover — as the PRD framed it.** Our S8 cases C154628 and C154635
   cover S8-R8..R11: "Collect in Portal is offered only when the portal says yes, disabled with the
   portal's reason when it declines" and "Until the portal accepts part sales, the portal requirements
   are unreachable but the rest of the story is live." At authoring time the PRD explicitly DEFERRED
   the portal path (S8 open question: "written when the portal work itself is built, not before; owner
   engineering, on SV-10261"). SV-10261 has since shipped (TESTING QA), making the portal checkout
   testable in depth — which is what Mudassir added. That is NEW testable surface, not a hole in our
   original work.
3. **The fair self-criticism:** we scoped tightly to the single PRD and did not surface, in our
   outstanding register, that (a) when SV-10261 ships the portal-deposit cases should be deepened and
   (b) SV-9867 deposit-audit-log is adjacent and unowned. A more proactive handoff would have flagged
   both (Rules 66/36). Recorded now.

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
