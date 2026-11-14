# Tiered Pricing — authoring guide (for the authors of the next batches)

Phase 1 (14 Nov 2026) built this library and wrote Stories 1-4. This guide is the whole API: add `cases_<name>.py` files and your own
`verdicts_<batch>.py`, `po_questions_<batch>.py` and `register_rows_<batch>.json`; never edit `tp_lib.py`, `build.py`, `verdicts.py`,
`po_questions.py` or `make_register.py` at the same time as another author (they merge your files automatically).

Run: `python3 build.py` (must end `PROBLEM lines: 0`), then `python3 make_register.py` if you added register rows, then from the repo root
`python3 build/testing-tools/tester_readiness_check.py build/tiered-pricing --sample 15` (0 hard problems; read the sample and every
READ-CONTROL line in full, Rule 138). Nothing here writes to TestRail.

## 1 · The format this suite uses (QA lead, 14 Nov 2026 — Rule 117 sixteenth amendment answer: NO)

- Title in plain words, at most 80 characters, no semicolons; design cases start `Design: ` and live in section `DESIGN`.
- Preconditions: short plain bullets in setup order, each starting `Sign in`, `Use `, `Have `, `Make sure`, `Before `, `Note `, `Open `,
  `Keep ` or `Start `. Only what the steps need; every record made fresh for the case ("Have a new tier for this test, tier A, …");
  no `{placeholders}`, no `For example:` line, no Scenario line, no "mark this test Blocked" line. Example values inline in brackets
  ("(for example $48.00)") are fine.
- Steps: numbered, ONE UI action each (`build.py` refuses "X and Y", "from its three-dot menu", two sentences with verbs).
- Expected Result: one result list per step (`Step N:` + bullets), a blank line, then ONLY the AUTOMATION line. No quotes, no `From:`
  lines, no References from Design in the text.
- AUTOMATION line: default `MARKER` ("AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026"); `HOLD("<plain reason>")`
  for a held case; held on a PO question: pass `held_on="Qn"` (the marker is set for you).
- References field (refs) is built for you from the sources you cite: `SV-11694 (Story 2 S2-R3 S2-R15), SV-11695 (Story 3 S3-R18)`.
- Design pictures: list board ids in `pics=[...]` ("2.24"; production screenshots "today:10.1"). View each picture before you assign it
  (images in `design-2026-11-14/images/` and `images/today/`). A case with no board gives `nopic="reason"`.

## 2 · Writing a case

```python
from tp_lib import C, R, B, S, QP, QD, QL, QT, QJ, HOLD
from common import *          # ADMIN, ADMIN_CUST, ADMIN_WO, DESK, W1440, STAGING, TIERS, MATRICES, CATEGORIES, EDIT, SAVE, RELOAD,
                              # tier(lab, extra, archived), matrix(lab, extra), category(lab, extra), customer(lab, extra),
                              # open_tier(lab), open_matrix(lab), STRESS_SP, STRESS_NO, STRESS_SPECIAL
C("S6-01", "S6", "The Matrices list shows each matrix's status and categories",
  [ADMIN, matrix("A", ", pricing a new category made for this test, category A"), DESK],
  [MATRICES],
  [R(S("S6-R1", "<a verbatim sentence or phrase of S6-R1>"), "Matrix A shows an Active badge.", "Its Categories column names category A.")],
  pics=["6.2"])
```

- `C(key, section, title, pre, steps, res, pics=None, nopic=None, marker=None, held_on=None, note="", flags=())`
  - key: `S<n>-NN` in section `S<n>`; `D-NNN` in `DESIGN`; `INV-NN` (the invariant's own number) in `INV`; `RPT-NN` in `RPT`.
    Key ranges for design cases: phase 1 `D-01…D-99`; batch A `D-100…D-399`; batch B `D-400…D-699`.
  - `res`: one list per step. Build bullets with `R(source_or_list, "text", "text", …)` (all bullets on the same source) and join with
    `+`; or `B("text", src1, src2)` for one bullet.
  - flags: `"numbers"` (Rule 116: show the arithmetic with = × ÷ or "a + b"), `"stress"`, `"movement"`, `"design-version"`.
- Every bullet must carry at least one source; `build.py` proves each quote word for word in the saved source:

| Source helper | Use it for | Checked against |
|---|---|---|
| `S("S2-R3")` or `S("S2-R3", "verbatim sentence or phrase")` | a PRD requirement row (`RPT-S1-R3` for the reports PRD, `TP-PERM-4`, `TP-S2-EH1`) | the row text in `requirements.json` (itself verbatim from the PRD) |
| `QP("verbatim text", "S2-R3")` | PRD text outside a requirement line (User Feedback Summary, Terminology, Key Decisions), tied to the row it serves | the whole PRD v37 (Change Log excluded) or reports PRD v21 |
| `QD("verbatim words", "2.24", "S2-R6")` | the design's own words on a named board, where the PRD is silent | that board's rendered text, attributes, canvas note and file |
| `QL("2.24", "S2-R6")` | a visual attribute the design draws with no words (colour, icon, order, position) | the board exists; the case must attach that picture |
| `QT("verbatim plan text", "TPX-14", doc="TP1")` | a tech-plan statement (informs, never overrules the PRD), tied to its `TPX` row | the tech plan file (`TP1` or `TP2`) |
| `QJ("verbatim text", "SV-11694", "S2-R3")` | a saved Jira ticket copy | `sources/jira/*.md` and `sources/jira/linked/*.md` |

- Precedence (QA lead, 14 Nov 2026): PRD > PO answers > design for the look where the PRD is silent > tech plan. Never the build.
- A "does not / never / no …" bullet needs a positive bullet (a visible control) in the same step result.
- A closed list ("only", "exactly", "no other", "nothing else") needs a source sentence that itself closes the list.
- Rule 137: every labelled record in the preconditions (tier A, matrix A, customer A, category A, work order 1, Part Sale 1, client A) must
  appear in a step or result, be needed by another record, or say why with " so …"; a "Have a …" record says "for this test" (or is
  named as pre-release staging data).
- Organisation-wide changes (renaming Default, saving the General Matrix, tier counts) are put back in the last steps or written as
  "Make sure …" preconditions; tier numbers are read relative to what the list shows first.

## 3 · Holding a case on a PO question

Add the question to your own `po_questions_<batch>.py`:

```python
QUESTIONS = {"Q20": "Plain-words question with the PRD sentence and the design board it compares."}
CANDIDATE = {"Q20"}          # not sent; skill 07 §6.0 checks a-h run on the merged sheet before anything is sent
```

Then `C(..., held_on="Q20")`. A non-design held case goes to the folder "Waiting on Matt Barge's answers" automatically; a design-version
case (Rule 130: the design's version of a screen the PRD words differently) stays in `DESIGN` with `flags=["design-version"]` and its
marker "AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO". Every candidate question must hold at least one case.
Existing: Q1 (reopened paid work order — Story 10, batch B), Q2 (category move timing — held S3-17, S3-18), Q4 (download header order —
reports, batch B), Q5-Q19 (phase 1 design candidates). Use Q20-Q39 in batch A and Q40-Q59 in batch B.

## 4 · Divergence register rows

Add a JSON list in `register_rows_<batch>.json` (same shape as `DESIGN-DIVERGENCE-REGISTER.json` rows: `id`, `direction`, `where`, `prd`,
`design`, `outcome`, `closed_by`, `cases`, `question`, `held_case`, `in_scope: true`). To close a phase-1 LATER-BATCH row, give your row
`"replaces": "<old id>"`. Outcomes: `NO-DIFFERENCE`, `CLOSED` (with `closed_by`: the PRD sentence or precedence), `PO-CANDIDATE` (with
`question` and a held `held_case`). Then run `make_register.py`. Batch A ids `TPD-A1xx…`, batch B `TPD-B4xx…`.

## 5 · Verdicts and checklist registries

In `verdicts_<batch>.py` (merged by `verdicts.py`; a key defined twice is an error):

```python
IN_SCOPE_STORIES = {5, 6, 7}                     # your stories: from now on every row of them must have a verdict
NOT_TESTABLE = {"TP-S5-EH1": "reason a manual tester cannot set it up (list for the developers)"}
HELD = {"TPX-01": "Q1"}                          # a row whose only check waits on a question
PARTIAL = {"TP-S9-R12": "what is checked, what is left and where"}
UNUSED_BOARDS = {"6.1": "Today board; screenshot attached as today:6.1"}
STRESS = {"matrix name on the Matrices list": "D-120"}          # §6d line 9, one per surface that shows a typed name
MOVEMENT = {"Matrices list Status filter (6.5 vs 6.7)": "D-130"}  # §6d line 10, before-and-after with a screenshot
NUMBERS = {"N14 Matrices list Categories +N": "S6-07"}          # Rule 116, from NUMBERS-AND-HAZARDS.md
```

The reports PRD rows (`RPT-…`) are in scope once you add `"RPT"`-section cases and list them; `build.py` counts a row as covered only
by a case in its own story section (or WAIT, DESIGN, INV), so a phase-1 case that touches a later story's row does not cover it.

## 6 · Where things are

- Sources: `sources/CONFLUENCE-938213378-v37-read-2026-11-14.md` (PRD), `sources/CONFLUENCE-968687617-v21-read-2026-11-14.md` (reports
  PRD), both tech plans and `sources/notes/`, `sources/jira/` (54 tickets) and `sources/jira/linked/` (11 linked tickets, read 14 Nov 2026).
- Requirements: `requirements.json` (382 PRD rows, 39 tech-plan rows, 3 ticket rows), `REQUIREMENTS-MAP.md`, `INVARIANTS.md`,
  `NUMBERS-AND-HAZARDS.md`, `PO-QUESTIONS-DRAFT.md`.
- Design: `design-2026-11-14/DESIGN-DRIVE-PROOF.md` (§6 hand list of every dialog/menu/tooltip/toast; §6b movements; §6c stress;
  §7b inconsistencies; §8 behaviours), `render/canvas-notes.txt` (every board's note), `inventory/`, `images/`, `images/today/`.
  The design package has no Inter italic font: check "Uses previous tier" as gray italic, never by letter shape; judge from our PNGs,
  not the viewer's PDF export.
- Folders: `sections.json` (planned; not created in TestRail).

## 7 · Consolidation changes (14 Nov 2026) — what the library now does for you

- **Admin sign-in line (Rule 137):** any "Sign in as an Admin whose role has …" line is rewritten by `tp_lib.C()` to exactly the permissions the
  case uses (`perms.py`, from the PRD Permissions table TP-PERM-1…12 and S16-R4/R5/R8, S9-R15); build.py fails a line that differs. Write any
  Admin constant you like; the case gets the right list. Permission tests ("Sign in as a user whose role … but not …") are left as written,
  and build.py fails an Admin line that has a permission another precondition says the user must not have.
- **Quick Add steps (Rule 135):** "Add a part to line 1 with category A and cost 100.00." (and the other work-order variants in `expand.py`)
  is split into one action per step with board 10.6's labels (Add Part, Description, Qty, Category, Cost, Save); your results go on the final
  "Click Save." step and board 10.6 is attached. A work order the step adds to gets "with one labor line (line 1)" if its precondition gave it
  no line. build.py fails any other open-fill-save step unless it is a flow no source draws (KEEP_WHOLE: Part Sale add row, Tech View, part
  request modal, special-order Source, returns, credits, invoicing, records made from a picker); those are listed in `kept-whole-steps.json`.
- **Full-height pictures:** `full:9.30` attaches `page-09-board-30-…-full-height.png`; any board with a full-height file gets it added beside
  the normal picture automatically (9.28-9.35, 9.37, 10.6, 10.7, 10.9, 12.9, 14.8).
- **Invariant source `QI("verbatim text", "INV-78", doc="TP1")`:** for an INVARIANTS.md row the PRD is silent on; checked word for word in the
  named source (TP1, TP2, PRD, RPT, JIRA). The case still needs one PRD-sourced bullet. INV-78 uses it; INV-76 stays unwritten (no screen named).
- **PERM refs:** a Permissions-table row now shows as `PERM-n` in the References field.
- **Window sizes:** DESK and W1440 now say why ("so every column of the page shows", "so the screen matches the design pictures' size");
  build.py fails an exact window size on a behaviour case that does not say why.
