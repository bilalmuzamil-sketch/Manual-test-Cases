# Design-case checklist — Technician Toggle (skill 21 §6d, Rule 133), 2 Nov 2026

Every line ticked with the design case(s) in `DESIGN-CASE-PLAN.md` that cover it, or the register row that closes it
(`build/technician-toggle/DESIGN-DIVERGENCE-REGISTER.json`). Cases are drafts for round 2 (the case worker writes them into the suite);
nothing is in TestRail yet. ☑ = done in this pass · ◐ = done here, waiting on something outside this pass (named).

## §6d lines

1. ☑ **Every screen and every state the design draws has a "Design: … " case with its picture.** 25 figures, 6 boards. Before pictures are
   attached as the comparison for "nothing else moved". Map (figure → case):
   p1 fig 1 → DC-01, DC-32 · p1 fig 2 → DC-01, DC-02, DC-03, DC-04, DC-05, DC-06, DC-32 · p2 fig 1 → DC-07 · p2 fig 2 → DC-07, DC-08,
   DC-16, DC-17 · p2 fig 3 → DC-09 · p2 fig 4 → DC-13 · p2 fig 5 → DC-13, DC-16 · p2 fig 6 → DC-14 · p2 fig 7 → DC-04, DC-15 · p3 fig 1 →
   DC-10, DV-01 · p3 fig 2 → DC-11, DC-12 · p4 fig 1 → DC-18 · p4 fig 2 → DC-18 · p5 fig 1 → DC-19 · p5 fig 2 → DC-19, DC-29 · p5 fig 3 →
   DC-20 · p5 fig 4 → DC-03, DC-17, DC-20 · p5 fig 5 → DC-21 · p5 fig 6 → DC-21 · p5 fig 7 → DC-22 · p5 fig 8 → DC-22, DC-31 · p6 fig 1 →
   DC-23 · p6 fig 2 → DC-23, DC-24 · p6 fig 3 → DC-25 · p6 fig 4 → DC-25, DC-26, DC-27, DC-28, DV-02. Every board and every figure is
   attached to at least one case. States the design draws: rest, open window, toggle off / grayed / on, hover tooltip (2), unsaved change,
   saved list, warning open, dropdown open (filter, lead, Add Technician), search with no match (2). Not drawn by any board: dark theme,
   phone, density, loading, error, empty (light theme at 1440 only; Story 1, 2, 4 are "Desktop only by rule"; Story 3 keeps today's
   mobile behaviour and adds no control, so no phone case).
2. ☑ **Every menu, dialog, tooltip, toast, prompt and empty state listed by hand, row by row against the PRD.** New / Edit Staff Member
   (fields, toggle row order, buttons) · Time Clock tooltip · role tooltip · Turn Off Technician warning (title, text, Cancel then Save, X)
   · Technician filter (search, rows, divider, Clear selection, "No results") · Reassign lead technician (title, subtitle, search,
   Unassigned row, rows with "0 open", message, Cancel, Reassign) · Lead Technician dropdown (rows, order, check) · Add Technician list ·
   notice. Recorded in `DESIGN-VISUAL-INVENTORY.md` §1–§5 and `SPEC-TO-DESIGN-2026-11-02.json` (65 PRD rows: 27 SHOWN, 3 DIFFERENT,
   14 NOT SHOWN, 21 NO SCREEN). No toast exists in the design or the PRD. Empty states: none drawn (TT-N12), covered from PRD words (DC-29,
   DC-30) with the library rule raised (TT-D04).
3. ☑ **Every label compared letter for letter, capitals included (L-04).** Time Clock, Sales Representative, Technician, Billable, New,
   Turn Off Technician, Cancel, Save, Reassign lead technician, No technicians match “…”, Lead Technician, Add Technician, Assigned to me,
   Deactivate Account, New Staff Member, Edit Staff Member, Active, Deactivated, Unassigned, both tooltips, the notice: all match PRD v17.
   One differs: S3-R7a "Lead technician" vs the screen's "Lead Technician" (TT-D07, settled by "as it does today"). The tool's case
   check (`spec_to_design_check.py`) found the same one row (CASE-DIFFERS) and nothing else.
4. ◐ **Every design behaviour that differs from the PRD has a held design-version case and a SENT question.** Behaviour/look differences:
   TT-D01 (Time Clock back on in New Staff Member) → DV-01, question 1; TT-D02 (grayed chip in Edit Line) → DV-02, question 2. TT-D04
   (library one-sentence rule) and TT-D06 (Save & Add Next) → questions 3 and 4, no held case (the design gives no alternative words or
   behaviour to write). **Waiting on the QA lead to send the 4 questions** (no Google or Slack writes from this pass); unsent count 4.
5. ☑ **Both directions checked.** Design → cases: text inventory (2,598 texts, 715 rows, 0 unclassified) and visual inventory (69 rows,
   0 unclassified). PRD → design: `spec_to_design_check.py` over the 6 boards plus the screenshot transcription (10 rows, all closed, exit 0)
   and the hand table `SPEC-TO-DESIGN-2026-11-02.json`.
6. ☑ **Sizes, spacing, colours, icons, column order, widths at 1440 and 1536 px, no overlap, no truncation; library always/never
   sentences.** Column order DC-02, toggle order DC-07/DC-13, pill place and look DC-03/DC-17, Yes/No colours DC-04, grayed track DC-08,
   tooltip look and place DC-10/DC-11, warning colours and button order DC-18, board column look DC-19, name order DC-19/DC-20/DC-23/DC-25,
   widths DC-05 and DC-16 (1440 and 1536; the pictures exist at 1440 only). Library sentences L-1 … L-10 classified (L-1 → DC-08, L-2 →
   TT-D04).
7. ☑ **Every PRD look sentence has a design case, drawn or not.** S1-R1 DC-07/DC-13/DC-16 · S1-R2 DC-17/DC-32 · S1-R4 DC-08/DC-10 ·
   S1-N1 DC-11/DC-12 · S2-R2/S2-R4 DC-18 · S3-R4 DC-22/DC-31 · S3-R7 DC-24 · S3-R7a DC-28 · S3-R8 DC-26/DC-27 · S3-R10 DC-29/DC-30 ·
   S4-R1 DC-02/DC-04/DC-06 · S4-R3 DC-03/DC-05 · S4-R4/S4-R5 DC-01 · S4-N2 DC-32. Not written as manual design cases, with the reason:
   S4-R4 notice with the list-load error (a tester cannot make the list fail, L-14: listed for the developers' checks) and S2-R4's
   loading state (too brief to judge by eye; the PRD worker's behaviour case covers "cannot be clicked again").
8. ☑ **Written down.** Register `build/technician-toggle/DESIGN-DIVERGENCE-REGISTER.json` (15 differences TT-D01 … TT-D15, 19 not-shown
   rows TT-N01 … TT-N19, 10 tool rows), proof files (`DESIGN-READING-RECORD.md`, the two inventories, `SPEC-TO-DESIGN-2026-11-02.json`),
   this checklist. Nothing committed: this pass makes no commits (brief); the coordinator commits.

## Lessons register rows applied (Rule 133)

| Row | Applied how |
|---|---|
| L-01 | One look case per screen and state (line 1); visual inventory beside the text inventory; library rules in scope (L-1 … L-10); unsent questions counted (4, not yet sendable from here); no ruling stretched |
| L-02 | Checked both ways; every difference closed in the register (SETTLED-BY-PRD needs a named PRD sentence; none filed as "KNOWN"); PRD and ticket versions used: PRD v17 and the 17 tickets saved on 2 Nov |
| L-03 | No Jira write in this pass |
| L-04 | Letter case compared by hand and by the tool (line 3) |
| L-05 | This checklist |
| L-06 | Not a rewrite pass (drafts only); the case worker rewrites any touched case top to bottom (Rule 134) |
| L-07 | No commit from this pass; the coordinator runs `scan_secrets.py --staged` on its own before committing. Note: the design's `tokens.json`/`tokens.css` are public colour tokens; no copy of the package was left under /tmp (scratch files removed) |
| L-08 | One action per step in every draft (checked by reading each step; the staff list is reached by "In the Settings menu, click Staff." from a "Start on the Settings page." precondition) |
| L-09 | Independent checks are separate cases (pill look DC-03 vs DC-17; Office User DC-11 vs Time Clock User DC-12); steps that need each other stay together (DC-14 → DC-15 are separate cases, each with its own setup) |
| L-10 | Preconditions say what is needed, no "ask your QA lead", no hold for things the tester obtains |
| L-11 | Every precondition record is used in the steps or results (staff members A, B, C named and used) |
| L-12 | No background jobs started |
| L-13 | The drafts were run through `tester_readiness_check.py` (converted copy in scratch): 0 hard problems; the 20 "does not / never" results were read and each has a visible control (the neighbouring names, the message shown, the unchanged buttons) |
| L-14 | Cases a manual tester cannot set up (list-load error, loading state) are not written as manual cases (line 7) |
| L-15 | "Not in the list" results come with a control: A followed directly by B (DC-19, DC-20, DC-23, DC-25), the no-match message (DC-21, DC-22) |
| L-16 | No vague look words in tester text (tool check 0); every look is stated as what is seen, compared with a named picture at 100% zoom |
| L-17 | The QA lead's model case C665915 layout followed; no "mark this test Blocked" line |
| L-18 | Not applicable (no TestRail write) |
| L-19 | Not applicable (no checking tool changed) |
