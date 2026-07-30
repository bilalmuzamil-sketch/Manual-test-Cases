# Report Suite — Questions for Chris Ward (from the engineering plan) — 2026-07-30

Plain-language product questions only (no bugs, no test jargon). These came up from the engineering build plan read against the written descriptions, your kickoff video, and your earlier answers — plus one earlier question asked again more clearly.
Please pick an option (or write your own answer) for each.

## Question 1 — The location dropdown when someone only has one location

**What happens now:** In your kickoff video you said that a person who can only see one location should not see the location dropdown at all - it simply disappears for them, and the report just shows their one location. The engineering build plan (written a week before the video) says the opposite: the dropdown still shows for a one-location person.

**The question:** Should the dropdown be hidden for a one-location person (as you said in the video), or always shown?

**Options:**

- A) Hidden for a one-location person (the video's way - this is what our tests expect today).
- B) Always shown, even with just one location (the engineering plan's way).

**Your answer:** ____________________

## Question 2 — Two slightly different "too big to download" messages

**What happens now:** When a download would be too big, the user sees a message. The written descriptions currently carry TWO slightly different messages for this. Sales By Customer says: "This export is too large to generate. Narrow the date range or filters, then try again." Inventory Value (and the engineering plan, for the whole suite) says: "This report is too large to export. Narrow the date range or filters, then try again."

**The question:** Should every report show the same one message, and if so which one?

**Options:**

- A) One message everywhere: "This report is too large to export. Narrow the date range or filters, then try again."
- B) One message everywhere: "This export is too large to generate. Narrow the date range or filters, then try again."
- C) Keep both as written per report.

**Your answer:** ____________________

## Question 3 — The download size limit is missing from three report pages

**What happens now:** You set a size limit for downloads (10,000 rows) - if a report's filtered data is bigger than that, no file is made and the user is asked to narrow the filters. The Sales By Customer, Sales By Representative, and Inventory Value pages say this. The Parts Velocity, Technician Utilization, and Work In Progress pages do not mention it, although the engineering plan applies the same limit to their downloads too.

**The question:** Does the same download size limit apply to Parts Velocity, Technician Utilization, and Work In Progress (so we test it there too, and those pages get a line about it)?

**Options:**

- A) Yes - the same limit applies to all six reports (we have prepared tests for this).
- B) No - those three reports have no download limit.

**Your answer:** ____________________

## Question 4 — Who can open each report - one clean re-ask

**What happens now:** You told us all of these reports should use the normal reports permission - the standard "can this person see reports" setting. But the build, and the engineering plan behind it, deliberately give one report its very own separate permission instead - and the engineering plan itself flags this as a decision it expects YOU to make, not a mistake. So your answer and what is being built do not match, and we cannot lock the "who can open what" tests until this is settled.

**The question:** Which should it be - the normal reports permission for everything, or the separate permission that is built today?

**Options:**

- A) Change it to the normal reports access (what you told us) - engineering adjusts the build.
- B) Keep the separate permission for that report (what is built today).

**Your answer:** ____________________

---

## QA Internal Mapping (QA-only — not for the PO)

TestRail C-ids are from the project's `testrail-id-map.csv` (Standing Rule 8). Links: https://shopview.testrail.io/index.php?/cases/view/<id>

| Q# | Affected internal case IDs (TestRail C-id) | Source refs | What each answer resolves to |
|---|---|---|---|
| 1 | SBR-LOC-04 (C30216); TU-LOC-05 (C30446); IV-LOC-04 (C30577); PV-FILT-13 (C30340) | Source: tech-plan-2026-07-29/Questions-for-Chris-dev.md Q1 = TECH-PLAN-DELTAS conflict C1. Cases stay video-authoritative (newest-wins; video ruled authoritative 2026-07-28) pending his answer. | A -> cases stand as authored (dropdown hidden for a one-location user). B -> flip the 4 cases back to the pre-video wording (backups in video-promotion-backup-2026-07-28/). Verify LIVE at VIU. |
| 2 | SBC-EXP-14 (C30172); IV-EXP-07 (C30593); new PV-EXP-11 / TU-EXP-09 (no C-ID yet) | Source: Questions-for-Chris-dev.md Q2 = conflict C2. SBC spec string ('export ... generate') vs IV spec + tech plan suite-wide string ('report ... export'). | Whichever answer, only the message wording in the expected lines changes (A -> IV/plan string everywhere incl. SBC-EXP-14; B -> SBC string everywhere; C -> both stand per report). |
| 3 | new PV-EXP-11; new TU-EXP-09 (no C-ID yet) | Source: Questions-for-Chris-dev.md Q3 = conflict C3. 10,000-row cap is in the SBC/SBR/IV specs + the tech plan suite-wide; missing from the PV/TU/WIP spec pages. WIP's per-tab export was NOT given a cap case (the plan's own scope list is ambiguous on WIP) - probe at VIU. | A -> push PV-EXP-11/TU-EXP-09 (staged) + the three spec pages get the cap line; probe WIP at VIU. B -> drop the two staged cases; cap tested only where specified. |
| 4 | SBC-PERM-01/02 (C30098/C30099); SBR-PERM-01/02 (C30198/C30199); PV-PERM-01/03 (C30325/C30327); TU-NAV-01/07 (C30392/C30397); WIP-PERM-01/02 (C30526/C30527); IV-PERM-01/02 (C30603/C30604) | SHARPENED re-ask of the permission question (Chris's 2026-07-28 Q2 answer = 'these should be gated by normal reports access' contradicts the shipped mixed model). Full technical mapping: chris-answers-2026-07-28/Q2-permission-discrepancy-for-Chris-dev.md (updated 2026-07-30 with the tech-plan citations). Tech plan §B5.3: every SBC endpoint gates on the NEW dedicated atom ROLE_SALES_BY_CUSTOMER_REPORT::VIEW, NOT ROLE_REPORT_VIEW; the plan flags the SBC bundle placement as a 'product-level decision to surface' (decision #5). Cases KEPT AS AUTHORED per user Ruling 1 until he answers. | A -> dev changes to the single normal-reports permission; revise the permission cases to the unified model + VIU-confirm live. B -> keep the mixed model; cases already match; VIU-confirm the exact per-report permission names live at the QA branch. |

### Not re-asked here (for QA reference)

- The SBR staff-dialog Escape question (tech plan decision #9) is NOT re-asked - it is already in PO-Questions-Chris-ReportSuite-2026-07-27 (Q1, SBR Esc vs Golden-Rule), still awaiting his answer; the plan independently confirms the conflict is real.

Verify the C-ids against `build/report-suite/testrail-id-map.csv` before quoting them onward.
