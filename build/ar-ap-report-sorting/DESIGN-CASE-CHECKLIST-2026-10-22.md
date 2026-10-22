# Design-case checklist (skill 21 §6d, Rule 133) — 22 Oct 2026

**The design canvas could not be read in this pass**, so lines that need the design are OPEN, not ticked. The design cases are written from the PRD's own look sentences (the brief) and compare with the native reports the PRD names. When the design arrives the whole design is driven and every case is re-checked (Rules 120, 122). The suite is not reported complete while a line is open.

| # | Checklist line | Status | Cases / where |
|---|---|---|---|
| 1 | Every screen and state the design draws has a "Design: … looks as described" case | PARTLY: every screen and state the PRD names, for all six reports (1440 light, dark, 1536 both, loading/empty/error); the design's own screens OPEN until it is read | D-01, D-02, D-03, D-04, D-05, D-06, D-07, D-08, D-09, D-10, D-11, D-12, D-13, D-14, D-15, D-16, D-17, D-18, D-19, D-20, D-21, D-22, D-23, D-24, D-47, D-48 |
| 2 | Every menu, dialog, tooltip, toast, prompt and empty state listed with its rows and buttons in order, compared with the PRD | DONE from the PRD (Location, Customer, Vendor, Past due and Export menus; switch-location dialog; Collapse/Expand tooltip; info tooltip; Success, Empty export, too-large and failed-export messages; empty and error states); the design's versions OPEN | D-19, D-20, D-21, D-22, D-23, D-24, D-25, D-26, D-27, D-28, D-29, D-30, D-31, D-32, D-33, D-34, D-35, D-36, D-37, D-38, D-39, D-40, D-41, D-42 |
| 3 | Every label compared letter for letter, capitals included (L-04) | DONE in every design case step; the letter-case conflict inside the PRD asked (question 4); every other heading stays as today | all design cases |
| 4 | Every design behaviour that differs from the PRD has a held design-version case and a sent question (Rule 130) | OPEN: needs the design; the divergence register is empty for that reason | DESIGN-DIVERGENCE-REGISTER.json |
| 5 | Both directions checked: design → cases (text and visual inventory) and PRD → design (spec_to_design_check.py) | OPEN: needs the design | — |
| 6 | Sizes, colours, icons, column order, widths at 1440 and 1536 px, no overlap, no truncation | DONE where the PRD states them | D-01, D-03, D-04, D-06, D-07, D-09, D-10, D-12, D-13, D-15, D-16, D-18, D-47, D-48, D-49 |
| 7 | Every PRD look sentence has a design case even without a design file | DONE (S7-R7, S8-R1 to S8-R5, S3-R7, S4-R1, S4-R5, S4-R6, S5-R2, S5-R13, S5-R15, KD reuse rule, Out of Scope phone layout) | 49 design cases |
| 8 | Result written down in the divergence register and the proof file; checklist committed beside them | PARTLY: this file and the register exist; the proof file (DESIGN-COVERAGE) waits for the design | this folder |
