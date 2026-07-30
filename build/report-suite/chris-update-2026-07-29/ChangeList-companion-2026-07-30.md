# Report Suite — Companion-Video Change List (2026-07-30)

**STATUS: EXECUTED 2026-07-30 — the §A queue was pushed under the user's same-day
authorization ("do update the test cases if you learn that the video is warranting for
that"): 7/7 update_case HTTP 200 + re-GET MATCH, 0 failures, R359 untouched, live count
under group 4281 = 465 == id-map. Audit: `reconciliation-2026-07-28/
testrail-execution-log-2026-07-28.md` § "COMPANION-VIDEO PUSH 2026-07-30" (ops 173–179);
machine result `testrail-execution-result-companion-2026-07-30.json`.**

- **Source:** Chris Ward PRD companion video 2026-07-30 (Loom
  https://www.loom.com/share/e4a3ad01912048c0bba88f1a02677004; transcript
  `companion-video-transcript-2026-07-30.md`; analysis `companion-video-deltas-2026-07-30.md`).
  Video = authoritative product intent, newest-wins (user standing ruling 2026-07-28).
- **Baseline:** 465 active cases (id-map 465/465). **Tally UNCHANGED: 465 active** — 0 adds,
  0 deletes, 0 retires.
- **Backups:** `backup/companion-2026-07-30/` (verbatim pre-edit bodies + MANIFEST.md).
  Apply script: `apply_companion_2026-07-30.py`.
- **Scope guard:** only FIRM video-warranted changes are pushed. Soft/pending items (C15
  Rep-label scope; C20 snapshot-indicator soft ruling) are NOT pushed — routed to the Chris
  question sheet (Q5) and SPEC-WATCH.

## A. Push queue — 7 update_case (no add, no delete)

| # | Case | C-id | Link | Point | Change (one line) |
|---|---|---|---|---|---|
| 1 | SBC-NAV-01 | C30096 | https://shopview.testrail.io/index.php?/cases/view/30096 | C4 FIRM | Entry sits in the Performance group, BELOW the four named anchors (Sales, Technician Efficiency, Advisor Analysis, Shop Efficiency) — new info; the SBC spec names no nav group. Title re-worded. |
| 2 | TU-NAV-01 | C30392 | https://shopview.testrail.io/index.php?/cases/view/30392 | C4 FIRM | The four anchor items are now NAMED in the below-placement expectation (was "previously existing report links"). |
| 3 | SBR-NAV-01 | C30195 | https://shopview.testrail.io/index.php?/cases/view/30195 | C4 FIRM | "At the BOTTOM of the group" re-based to below-the-named-anchors; SBR need not be literally last (four new reports added in one block, no set order). Title re-worded. |
| 4 | WIP-TAB-01 | C30451 | https://shopview.testrail.io/index.php?/cases/view/30451 | C4 FIRM | Below-the-named-anchors placement added to the Performance-group expectation. |
| 5 | PV-NAV-01 | C30322 | https://shopview.testrail.io/index.php?/cases/view/30322 | C2b FIRM | "(the only Parts report in this release)" dropped — Inventory Value also lives under Parts; order of the two inside the section not fixed (PV S1-R1 vs IV S1-R1 inconsistency settled by the video, flagged to SPEC-WATCH). |
| 6 | SBR-WO-06 | C30315 | https://shopview.testrail.io/index.php?/cases/view/30315 | C17 FIRM | Customer-record row label → "Sales Representative" (full word; supersedes spec S19-R7 verbatim '"Sales Rep" row' — Rule 25 citation in the case notes). Title trimmed 130→74. |
| 7 | SBR-WO-02 | C30311 | https://shopview.testrail.io/index.php?/cases/view/30311 | C14 | Tester-aid precondition: the toggle is reached via Settings → Staff → edit the staff member (path verbatim from the video; exact toggle label to confirm live). Title trimmed 124→64. |

All 7 carry the companion-video anchor in refs (Rule 20: ticket + spec anchor + driving
source), titles ≤80, layman wording (Rules 7/9), design-pinned ≠ VIU-Verified (Rule 12 — all
stay VIU-Pending; live VIU pending the QA branch).

## B. NOT pushed

- **13 notes-only annotations** (local metadata; notes are not a pushed field): IV-NAV-01,
  TU-LINK-01, SBC-TYPE-02, SBC-TREE-11, SBC-CUST-02, SBC-EXP-05, SBR-VIS-01, PV-VIS-01,
  TU-VIS-01, WIP-VIS-01, IV-VIS-01, SBR-WO-01, IV-DATE-05.
- **C15 Rep-label scope** → question **Q5** appended to
  `PO-Questions-Chris-ReportSuite-TechPlan_2026-07-30.md/.xlsx` (unsent; noted added
  2026-07-30 after the companion video). No small "Sales Rep" label flipped.
- **C20 snapshot-indicator soft ruling** → CONFIRMS current IV S5-R5/R6 + ratified PV/WIP
  label removal; no case change; SPEC-WATCH note only.
- **New cases: 0** (candidate gaps already covered — customer-card label = SBR-WO-06 edit;
  P/S prefixes = SBC-TYPE-02/SBC-TREE-11/SBR-TREE-09 confirmations).

## C. Rule-28 mini-audit (touched population = 20)

- 7 edited: **USEFUL 7/7 KEEP** (each asserts a distinct observable behavior whose failure is
  a reportable bug — nav placement, label, filter-arrangement path) · **SENSE 7/7 SENSIBLE**
  (cold-read: steps executable in order, expected follows, no contradiction, every named
  control sourced from the video/spec) · **GENUINE+LAYMAN 7/7** (refs = ticket + spec anchor +
  video anchor; plain numbered wording, no jargon).
- 13 notes-only: tester-facing text unchanged — verdicts unchanged from the 2026-07-28 audit
  (all KEEP/SENSIBLE).
- No merge/cut recommendations arise from this pass.

## D. Deliverables regenerated

Unified import + 6 splits regenerated over 465 (header byte-identical vs the established
imports; hygiene clean: 0 VIU words, 0 flag words, 0 internal-id leaks, 29 API cases all in
API sections, no dup titles, no missing fields). id-map 465 rows, C-ids re-merged 465/465
(0 blanks).

---

## EXECUTION LOG

Executed 2026-07-30 09:37Z. 7/7 update_case: SBC-NAV-01 C30096, TU-NAV-01 C30392,
SBR-NAV-01 C30195, WIP-TAB-01 C30451, PV-NAV-01 C30322, SBR-WO-06 C30315, SBR-WO-02 C30311 —
all HTTP 200 + re-GET verified MATCH (title/preconds/steps/expected/refs). 0 adds, 0 deletes,
0 section writes, no run writes (R359 untouched). Live count under group 4281 = 465 == id-map.
Pre-op live snapshots: `pre-push-snapshot/C<cid>_<iid>.pre-companion-push-2026-07-30.json`.
Per-op audit table: `../reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md`
§ "COMPANION-VIDEO PUSH 2026-07-30" (ops 173–179).
