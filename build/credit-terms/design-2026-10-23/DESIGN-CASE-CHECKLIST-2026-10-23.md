# Credit terms: design-case checklist (skill 21 §6d, Rule 133), 23 Oct 2026

Design: canvas "Default Credit Terms" (https://claude.ai/artifact/2erYxWz2ffDNcoXzEfu6wf), read 23 Oct 2026. Spec: PRD "Credit terms", Confluence
963346440, version 3. Cases: `build/credit-terms/authoring/cases_design.py` (section DESIGN, "Design — how it looks"); pictures and design words
per case: `build/credit-terms/authoring/design_refs.py` (DREFS). Gate run: `python3 build/credit-terms/authoring/build.py` gives 0 PROBLEM lines
(344 cases, 53 design cases, 170 DREFS entries).

## Case key map (plan id → case key)

DL-01 … DL-49 in DESIGN-CASE-PLAN.md are case keys **D-01 … D-49** (same number). The held design-version cases DV-01 … DV-04 are **D-50 … D-53**
(DV-01 = D-50, DV-02 = D-51, DV-03 = D-52, DV-04 = D-53). Section G of the plan maps every figure to its DL id, and so to its D key.

## The eight lines

| # | Line | Status | Ticked by |
|---|---|---|---|
| 1 | Every screen and every state the design draws has a "Design: …" case with the picture attached | **DONE** | All 62 pictures (37 drawn, 16 build captures, 9 "today" captures) are attached to at least one design case (script check: 62 of 62, none missing). Page and table D-01, D-04, D-05, D-06, D-09, D-10, D-51 · tooltips D-02, D-50 · toast D-03 · row menus D-07, D-35, D-45, D-46, D-47, D-48, D-49 · page menu D-08 · confirmations D-11, D-12, D-19 · New/Edit Credit Term D-13, D-14, D-15, D-16, D-52, D-53 · Move Customers D-17, D-18, D-37 · log D-20, D-21, D-38 · customers D-22, D-23, D-24, D-26, D-27, D-28, D-39, D-40, D-41 · vendors D-29, D-30, D-31, D-42 · due dates D-32, D-33, D-43, D-44 · over credit D-25, D-34, D-36. States the design does not draw (no dark theme, no phone, no 1536 px board, no loading or failure states except the log error) are not design cases: the 1536 px check is the last step of every design case; the undrawn PRD states are register rows CT-N01 … CT-N15 and are covered by the PRD behaviour cases. |
| 2 | Every menu, dialog, tooltip, toast, prompt and empty state is listed with its title, rows, options and buttons, in order, and compared with the PRD | **DONE** | DESIGN-VISUAL-INVENTORY.md §2 and §4, SPEC-TO-DESIGN-2026-10-23.json `by_hand` (52 rows). Each design case lists the rows and buttons in order: row menus D-07, D-35, D-45, D-46, D-47, D-48, D-49 · page menu D-08 · dialogs D-11, D-12, D-13, D-16, D-17, D-19, D-20, D-25 · dropdowns D-23, D-28, D-30, D-31, D-37, D-41 · tooltips D-02, D-24, D-40, D-50 · toast D-03 · empty states D-10, D-21, D-51 · error D-38. Differences found: CT-D01, CT-D02, CT-D06. |
| 3 | Every label is compared letter for letter, capitals included (L-04) | **DONE** | DESIGN-TEXT-INVENTORY (exact case, 962 texts, 0 unclassified). Every label in the design cases is quoted with its own capitals. Letter-case differences: "Over Limit" vs the PRD's "Over limit" (CT-D07, settled: the PRD keeps today's badge, D-36); "Set Limits To $0 And Move" on the button (D-19) vs the PRD's own display form "Set Limits to $0 and Move" (register rows S4-R16 and S4-R21). |
| 4 | Every design behaviour that differs from the PRD has a held design-version case and a SENT PO question (Rule 130) | **OPEN** | Held cases exist: D-50 (question 1, CT-D01), D-51 (question 2, CT-D02), D-52 (question 3, CT-D03), D-53 (question 4, CT-D04), each marked `AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO (design question N)`. Look differences without a behaviour change (CT-D05) are shown in the 7 look cases named in question 5. **Open because questions 1 to 5 (NEW-QUESTIONS.py) are drafted but not sent; the QA lead sends them.** The line closes the day they are sent. |
| 5 | Both directions: design → cases and PRD → design | **DONE** | Design → cases: text inventory (962 rows) and visual inventory (70 rows), 0 unclassified. PRD → design: spec_to_design_check.py exit 0 (21 rows, each with an outcome) and the by-hand list (52 rows). 117 PRD cases carry References from Design for the screen or state the design draws. |
| 6 | Sizes, spacing, colours, icons, column order, widths at 1440 and 1536 px, no overlap, no truncation, library "always/never" sentences | **DONE** | Every design case starts at 1440 px with the pictures beside the screen and ends with a 1536 px step ("nothing overlaps, nothing is cut off"). Icons and colours: D-01, D-02, D-06, D-07, D-12, D-15, D-46. Column order and widths: D-01, D-09. Truncation: D-05 (31-character name), D-26, D-33. Library sentences L1–L19 in DESIGN-VISUAL-INVENTORY.md §7 map to D cases (for example the menu "as wide as its items", D-07; tooltip position, D-02 and D-35). Reflow at 1280 and 1536 px: 0 overlaps (render/reflow-*.png). Where the drawn and the build pictures differ (CT-D05) the case names the picture to compare with for now and marks the attribute as depending on design question 5: D-01, D-11, D-12, D-13, D-16, D-17, D-19. |
| 7 | Every PRD look sentence has a design case | **DONE** | SPEC-TO-DESIGN-2026-10-23.json: each SHOWN row maps to a D case and quotes the PRD sentence in that case; PRD look sentences the design does not draw (CT-N rows) are covered by the PRD cases. Every design case quotes at least one PRD sentence (gate: quotes verbatim in PRD v3). |
| 8 | The result is written down and committed beside the register | **DONE (commit OPEN)** | DESIGN-DIVERGENCE-REGISTER.json (CT-D01 … CT-D10, CT-N01 … CT-N15), DESIGN-CASE-PLAN.md, the text and visual inventories, this checklist. Not committed: this worker may not commit; the coordinator commits. |

## Lessons register rows applied (Rule 126)

| Row | Applied how |
|---|---|
| L-01 (look, not only words) | 53 look cases with 75 picture attachments; visual inventory beside the text inventory; library sentences in scope. |
| L-02 (both directions, menus and dialogs row by row) | Line 2 and line 5 above; every differing behaviour has a held case (D-50 … D-53). |
| L-03 (Jira media nodes) | Not applicable: no Jira write in this pass. |
| L-04 (letter case) | Line 3 above. |
| L-05 (obvious design cases) | Every picture attached (line 1). |
| L-06 (whole case rewritten) | Every design case written new, top to bottom. |
| L-07 (secret scan result) | Not applicable: nothing committed by this worker; the coordinator runs the scanner before committing. |
| L-08 (one action per step) | Gate `two_actions` passes for all 53; each step has one "Step N:" result. |
| L-09 (split and fold) | Read-only steps folded into the previous action's result (the gate's fold); each case checks one screen or state. |
