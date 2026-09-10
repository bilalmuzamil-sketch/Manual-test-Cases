# Invoice suites — reconciliation against the updated sources (2026-09-10)

Trigger: QA lead handed over the updated Invoice-Design-Selection sources (new epic **SV-9892** + 5 stories
**SV-9893–9897**, engineering story **SV-9872**, spec page **845447188 Revision 5**). Scope chosen by the
QA lead: **all four invoice suites.** Full source re-verification where a source moved (Rule 101); for a
source that has NOT moved since its last check, the last-done date is stated and a re-run is offered, not
auto-run (Rule 80).

## Suite 1 — Invoice Design Selection (54 cases C53518–C53571, section 7800) — RE-VERIFIED THIS PASS
Source moved **Rev 3 → Rev 5** and the epic/stories now exist. Full re-verification done:
`build/invoice-design-selection/source-verify-2026-09-10/CHANGE-ANALYSIS-Rev5.md`. All 54 re-pointed to
epic SV-9892 + per-story keys + spec Rev 5; case-specific corrections applied (C53570 Authorizer per Q14;
Story-4 cutoff + Q6-open notes; C53541 Q19; dialog Q10; portal Q9; FO-4 sixth-doc Q21; S3-E2 void Q18).
Markers stay "Not available on Build" — no dated QA build yet (target v26.38.0 not created).

## Suite 2 — Invoice UI Refresh main (119 cases, group 6559, epic SV-8218) — ITS OWN SPEC HAS MOVED
- **Epic SV-8218 is now Done — the refresh released in v26.36.0 on 2026-09-09.** (Finality changed: the
  Modern design is now in production; Rule 49/60 "not final" no longer applies to the shipped refresh.)
- **Spec 755990532 moved on 2026-09-09** (lastModified ~13h before this pass), AFTER our last verification
  (authored v38 → re-verified v45 on **2026-08-31**). Change-log entries dated 2026-09-09:
  - **Story 12 print-only economy set (SV-9870, the 45%-more-paper regression):** new **S12-R14**,
    **S12-R10** rewritten (drops the identification line on later pages; allows a work line to split across
    a page), **S12-R8** (charge-row dividers screen-only), **S12-R9** (job title 15px in print),
    **S12-R12** (printed content width 682px), **S12-R5b** (disclaimer exempt from the sub-10px ink floor,
    stays 9px), **S12-R4** rewritten (preview and PDF no longer wrap line-for-line — QA no longer tests wrap
    parity), **G-R7** updated.
  - **S1-R2a** widened 152px → 210px, pinned to sheet centre (absolute from the Design Document).
- **⇒ This suite is behind its own spec by real requirement changes** (independent of Design Selection).
  A full re-verification (Rule 101, every case) is warranted. It is a large pass (119 cases) and was NOT
  auto-run — **offered to the QA lead** (Rule 80/81), last-done v45 / 2026-08-31.
- **Design-Selection cross-cutting impact:** none requiring a case change today. These cases test the
  **Modern** design, which is the org-wide **default** under Design Selection, so a default org sees exactly
  what they assert. Legacy rendering is Suite 1's responsibility (Story 5). **Watch item:** Q15/**SV-9832**
  (Stripe fee / net-received / cross-border breakdown) — the PM wants it fixed and shown on **Modern and
  Legacy**; if/when that fix ships, this suite's Financial-Summary cases must be re-checked.

## Suite 3 — Inline Add and Edit Parts (section 6597, epic incl. SV-9316, spec 782761986) — CURRENT
- Spec **782761986** re-checked live **2026-09-09**: **not moved since v16** (Last Updated 2026-09-04). The
  suite was fully source-verified + re-stamped to v16 on 2026-09-09 (117 spec-derived cases).
- **Design-Selection cross-cutting impact:** none. Inline add/edit parts is a work-order line-editing
  feature, not a document-design surface. (The Authorizer case C45275, corrected earlier today, is
  Modern-consistent with S5-E1/Q14.) **No case change required.**
- Full re-run of its own spec not warranted (unchanged since last check 2026-09-09) — offered per Rule 80.

## Suite 4 — Printer Friendly WO (44 cases, spec 519176194) — CURRENT
- Spec **519176194** re-checked live **2026-09-09**: last-modified 2026-09-07, **no substantive change**.
  All 44 re-verified + re-stamped 2026-09-09.
- **Design-Selection cross-cutting impact:** none requiring a case change. Printer-Friendly WO is its own
  print feature; the Design-Selection "every surface honours the design" requirement (Story 5) is Suite 1's.
  No case change required.
- Full re-run of its own spec not warranted (unchanged since last check) — offered per Rule 80.

## Cross-suite outstanding (Rule 98/99)
1. **Main refresh (Suite 2) is behind its own moved spec** (Story 12 print-economy + S1-R2a, 2026-09-09) —
   decision needed: run the full 119-case re-verification now? (last-done v45 / 2026-08-31.)
2. **Design Selection Q6 (High)** — Story-4 back-catalogue flip awaits Product; 10 Story-4 cases provisional.
3. **SV-9832 fee breakdown** — once fixed on Modern, re-check Suite 2 Financial-Summary cases.
4. **Cutoff timestamp** — SV-9872 says 09:14:35 UTC; spec (authoritative) says 09:13:36 UTC.
