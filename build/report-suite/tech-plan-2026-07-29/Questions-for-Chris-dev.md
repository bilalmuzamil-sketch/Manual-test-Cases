# Report Suite — Questions for Chris / dev (from the engineering plan read) — 2026-07-30

> DRAFT — not sent yet. Plain-language product questions only. Source: the engineering
> implementation plan the team shared (dated 2026-07-21) read against the six specs, the
> kickoff video, and Chris's earlier answers.

---

## Question 1 — The location dropdown when someone only has one location

**What happens now**

In your kickoff video you said that a person who can only see one location should not see
the location dropdown at all — it simply disappears for them, and the report just shows
their one location.

The engineering build plan (written a week before the video) says the opposite: the
dropdown still shows for a one-location person.

**The question**

Should the dropdown be hidden for a one-location person (as you said in the video), or
always shown?

**Options**

- **A)** Hidden for a one-location person (the video's way — this is what our tests expect today).
- **B)** Always shown, even with just one location (the engineering plan's way).

**Your answer:** ____________________

---

## Question 2 — Two slightly different "too big to download" messages

**What happens now**

When a download would be too big, the user sees a message. The specs currently carry TWO
slightly different messages for this:

- Sales By Customer says: "This **export** is too large to **generate**. Narrow the date
  range or filters, then try again."
- Inventory Value (and the engineering plan, for the whole suite) says: "This **report**
  is too large to **export**. Narrow the date range or filters, then try again."

**The question**

Should every report show the same one message, and if so which one?

**Options**

- **A)** One message everywhere: "This report is too large to export. Narrow the date range
  or filters, then try again."
- **B)** One message everywhere: "This export is too large to generate. Narrow the date range
  or filters, then try again."
- **C)** Keep both as written per report.

**Your answer:** ____________________

---

## Question 3 — The download size limit is missing from three spec pages

**What happens now**

You set a size limit for downloads (10,000 rows) — if a report's filtered data is bigger
than that, no file is made and the user is asked to narrow the filters. The Sales By
Customer, Sales By Representative, and Inventory Value pages say this. The **Parts
Velocity**, **Technician Utilization**, and **Work In Progress** pages do not mention it,
although the engineering plan applies the same limit to their downloads too.

**The question**

Does the same download size limit apply to Parts Velocity, Technician Utilization, and
Work In Progress (so we test it there too, and the spec pages get a line about it)?

**Options**

- **A)** Yes — the same limit applies to all six reports (we have prepared tests for this).
- **B)** No — those three reports have no download limit.

**Your answer:** ____________________

---

## QA-only (internal, not for Chris)

- Q1 = TECH-PLAN-DELTAS.md conflict C1. Affected cases (stay video-authoritative,
  newest-wins): SBR-LOC-04 C30216, TU-LOC-05 C30446, IV-LOC-04 C30577, PV-FILT-13 C30340
  (links: https://shopview.testrail.io/index.php?/cases/view/<id>). If Chris answers B, those
  4 cases flip back to the pre-video wording (backups in video-promotion-backup-2026-07-28/).
- Q2 = conflict C2. Affected: SBC-EXP-14 C30172 (SBC spec string) vs IV-EXP-07 C30593 +
  new PV-EXP-11 / TU-EXP-09 (plan/IV string). Whichever answer, only the message wording in
  the expected lines changes.
- Q3 = conflict C3. New cases riding on answer A: PV-EXP-11, TU-EXP-09 (new, no C-ID yet).
  WIP's per-tab export was NOT given a cap case (the plan's own scope list is ambiguous on
  WIP) — probe at VIU.
- The SBR staff-dialog Escape question (plan decision #9) is NOT re-asked here — it is already
  in PO-Questions-Chris-ReportSuite-2026-07-27 (SBR Esc vs Golden-Rule), still awaiting his
  answer; the plan independently confirms the conflict is real.
- Permission-model Q2 (mixed vs normal reports access) is also NOT re-asked here — it lives in
  chris-answers-2026-07-28/Q2-permission-discrepancy-for-Chris-dev.md, now updated with the
  tech-plan citations.
