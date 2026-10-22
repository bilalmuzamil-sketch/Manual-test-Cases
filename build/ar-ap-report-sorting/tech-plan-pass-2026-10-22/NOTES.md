# Running notes — tech plan pass, 22 Oct 2026

- Started: read WORKER-BRIEF.md; Rules 134, 130, 115, 116, 117 (all amendments), 113, 114, 122, 96 (head), 57 (head), 41, 30;
  LESSONS-REGISTER L-01..L-06; IDEAL-TEST-CASE-STANDARD.md.
- Tech plan read in full: lines 1-130, 130-219, 219-299, 299-378, 378-458, 458-528, 528-647 (all 646 newline-terminated lines + last line), 88,174 bytes, 100%.
  Tech plan dated 2026-10-21, built against PRD v4 (2026-10-20); we hold PRD v5 (21 Oct). Diverge-check needs v4->v5 awareness.
- PRD v5 read in full (447 lines). Questions 1-10 (sheet_rows.py) and 11-15 (design NEW-QUESTIONS.py) read; none answered.
- All case sources read: cases_s1 (15), s2 (39), s3 (27), s4 (21), s5 (34), s6_s9 (41), data (21), rel (10), design (81) = 289.
- Snapshot before any edit: scratchpad/before/{proposals.json, AR-AP-SETUP-FILE.md, authoring_src/}. build.py was 0 PROBLEM before.
- DECISIONS (verdicts):
  * DIVERGE: tech plan section 9 name order is UCA (punctuation below digits, "-" before "#") vs PRD S1-R2 "plain character order" -> Q16 + held S1-16.
  * Minor seeming contradiction, no question: Vendor menu "searchable over 8" (D18) vs PRD S5-R13 "The menu has a search box"; PRD also says
    "exactly as Inventory Value's" -> cases set >8 vendors (S5-29, D-32, D-73, D-77). Reported to QA lead (Rule 30).
  * Tech plan answers PRD-silent points (QA lead ruling 12 Aug 2026: tech design sources a case where nothing contradicts):
    S1-07 released (D4 tie order), S3-17 tick order (D30). Questions 1 and 7 stay open; Chris's answer wins if different.
  * CHANGE list: S1-07, S2-29, S2-31, S2-32, S2-34, S3-17, S4-09..S4-12, S5-16, S5-17, S5-20, S5-21, S5-22, S5-24, S5-26, S5-27, S5-29,
    S5-30, S5-31, S7-02, S7-05, DATA-05, DATA-06, DATA-20, REL-03, D-32, D-73, D-77.
  * NEW: S1-16 (held Q16), S3-28, S3-29 (collapsed Detail exports), S3-30 (CSV formula), S5-35, S5-36 (unknown customer/vendor in link),
    S5-37 (no future as-of), S5-38 (quick ticks), DATA-22 (freshness), REL-11 (old drill-down links), REL-12, REL-13 (shared filter kit).
  * RETIRE: none.
