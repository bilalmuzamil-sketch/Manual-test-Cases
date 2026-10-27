# What/Why full pass — Phase A handoff (27 Oct 2026)

Phase A built the authoring library in `authoring/` (copied from Parts Lifecycle's of the same day, every gate kept) and wrote Stories
1-4: **45 cases** = 37 live cases rewritten top to bottom (C-ids kept) + 2 splits + 6 new. Phase D part 2 (the design worker) adds the
"Design — how it looks" cases to the same library, in `authoring/cases_design.py` ONLY, and must pass the same gates. Draft only: no
TestRail, Jira, Slack or Google writes and no commits in any phase; `authoring/apply.py` is the coordinator's, run only on the QA lead's
go-ahead.

## 1 · Files

| File | What it is | Who edits it |
|---|---|---|
| `authoring/wwlib.py` | Source parsers (PRD v15, PO answers, Jira, tech plan, the 7 board files + canvas notes), the case model `C()`, the PRD's line-text rule `joined()` (Rule 116), rendering, per-case checks | nobody without a reason; any change re-run by every phase |
| `authoring/common.py` | Shared precondition bullets and step strings (`ADMIN`, `START_LINES`, `START_EXPORT`, `NEW_LINE`, `REPORT` …) and `words(stem, start, end)` / `note(start)` for verbatim design words | add shared strings freely; never change one Phase A uses without re-running build |
| `authoring/cases_s1.py` … `cases_s4.py` | Phase A's cases (`WRITTEN = True`) | Phase A |
| `authoring/cases_design.py` | **Phase D stub** (`WRITTEN = False`, `SECTION = "DESIGN"`, an example shape in its docstring) | **Phase D part 2 only** |
| `authoring/design_refs.py` | `DREFS = {}`: case key → `{"boards", "pictures", "words", "note"}` ADDED to any case's own design references (Phase A cases too) | Phase D |
| `authoring/requirement_map.py` | `NO_MANUAL` (none), `PART_MANUAL` (5 honest notes), `NOT_SCREEN_WORDS`, `OTHER_STORY` | anyone, with a reason |
| `authoring/build.py` | All gates; writes `authoring/proposals.json` and `REQUIREMENT-MAP.json` | nobody without a reason |
| `authoring/gate_selftest.py`, `plants.py` | Proves each of 21 gates and the readiness check FAIL on a planted fault and that running them changes no file (L-19; `full-pass-2026-10-27/design/` is excluded from the no-change check because Phase D writes there) | add a plant for any new gate |
| `authoring/ledger.py` | Writes `TICKET-LEDGER.json` (11 tickets) and `TICKET-SWEEP.json` (PRD v15 handled) | re-run after any change |
| `authoring/render_setup.py` | Writes `WHAT-WHY-SETUP-FILE.md` (the one setup file for Claude sessions; replaces the 37 per-case Google Docs of 13 Oct) | run after writing |
| `authoring/render_outputs.py` | Writes `full-pass-2026-10-27/PASS-REPORT-<PHASE>.md` (Rule 134 per-case, per-part record + 3 old/new samples) | run with your phase and sections |
| `authoring/make_id_map.py` | One-off that wrote `testrail-id-map.csv` (refuses to overwrite) | **do not re-run** |
| `authoring/apply.py` | The TestRail write (plan only without `--apply`; edit lock on the latest read-back; Rule 138 guard; idempotent picture upload from `design/images`, `design/renders`) | coordinator only |
| `testrail-id-map.csv` | key, case_id, section_id, title (13 Oct), link — all 37 live cases (all created by us) | append-only, by apply.py |
| `REQUIREMENT-MAP.json` | all 41 v15 codes: COVERED (keys, C-ids); 0 NO MANUAL; 5 PART_MANUAL notes | written by build.py |
| `DESIGN-DIVERGENCE-REGISTER.json` | Rule 130 register: 3 carried rows, all PO-RULED / closed | **coordinator merges Phase D's `design/DESIGN-DIVERGENCE-ROWS.json` (12 rows; DV-04 QUESTION-READY)** |
| `full-pass-2026-10-27/QUESTIONS.json` | Q1-Q8 answered 14 Oct; new **Q9-Q11** (open, nothing held) | coordinator appends Phase D's DQ-01..DQ-03 as Q12-Q14 |
| `full-pass-2026-10-27/PRD-DIFF-v13-v15.md` | code and non-code diff; 12 changed codes (11 named by the v14 Change Log + S1-R7), 1 new (S3-E4), non-code text identical | read first |
| `sources/` | `CONFLUENCE-845348896-v15-2026-10-27.md` (PRD v15), `jira-2026-10-27/` (all 11 tickets + comments, raw JSON, sweep input), `po-answers-2026-10-14/` (Chris Ward's 8 answers, verbatim), tech plan, design 27 Oct copy | read in full (Rule 119) |

## 2 · Keys, C-ids and sections

- **Every live case keeps its C-id.** `testrail-id-map.csv`: S1-01 … S1-08 (20461), S2-01 … S2-04 (20462), S3-01 … S3-18 (20463),
  S4-01 … S4-07 (20464), in C-id order. The build fails if a mapped key of a written section has no case.
- **New in Phase A (no C-id yet):** splits S1-03b (of S1-03 C154709), S1-04b (of S1-04 C154710); new S3-19, S3-20, S3-21, S3-22, S3-23,
  S4-08.
- **Design section:** `DESIGN`, keys `D-01` … (Phase D's plan numbers them D-01 to D-17; keep them), titles start "Design: ".
  `wwlib.SECTIONS["DESIGN"]` is None until the coordinator creates "Design — how it looks" under What/Why 20437 and writes its id into
  `section-map.json` as "DESIGN"; `apply.py` skips design cases until then. Set `WRITTEN = True` in `cases_design.py` when done; build
  then enforces your section.
- No case is retired (`wwlib.DELETED = {}`).

## 3 · How Phase D adds a design case (cases_design.py)

```python
from wwlib import C, DESIGN_HOLD, PO_HOLD, HOLD
from common import *

C("D-01", "DESIGN", "Design: New Line opens with the Title box ready and its grey prompt",      # <= 80 chars, no ";"
  [ADMIN, "Have an open work order, work order 1, that is not invoiced, so you can add a line to it.",
   "Use a desktop browser window at full screen.", START_LINES],
  [NEW_LINE],                                                                                     # one UI action per step
  [["The New Line window opens over work order 1.", "The first box ... (board 1.2)."]],          # one bullet list per step
  ["S1-R1", "S1-R3", "S1-R5"],                                                                    # PRD codes / NAMED keys / (doc, label, text)
  design=dict(boards=["Main"], words=[words("Main", "The only two things that change", "depending on state.")]))
```

- **Boards are file stems**, not numbers: `DialogBefore` (1.1), `Main` (1.2), `QuickBooks` (1.3), `EditBefore` (1.4), `EditAfter` (1.5),
  `EdgeCases` (2.1), `Truncation` (2.2) — `wwlib.BOARD_NO`. References from Design prints "board 1.2 "New Line - after"".
- **Pictures attach themselves:** `wwlib.design_of()` attaches each named board's render from `full-pass-2026-10-27/design/renders/`
  (`board-1.2-new-line-after.png` …) when the case names no pictures. Name other pictures with `pictures=[...]`; each must exist in
  `design/images/`, `design/renders/` or `sources/design-2026-10-27-artifact/png/`. `apply.py` uploads from the same folders.
- **Design words** must be verbatim in a board's visible text or a canvas note: use `common.words(stem, start, end)` or
  `common.note(start)`. Never put design words in `q`.
- **Quotes:** a PRD code (`"S1-R3"`), a NAMED key (`FO-1`…`FO-6`, `OOS-1`…`OOS-6`, `KD-1`…`KD-11`, `ASSUME-1`…`ASSUME-5`, `PRE-S1-1`,
  `PRE-S3-1`…`PRE-S3-4`, `CN-S3-1`, `CN-S3-2`, `CN-S4-1`, `FF-1` (Form Factor), `SURF-1`…`SURF-7` (Surfaces rows); list with
  `python3 -c "import wwlib as L; print(sorted(L.NAMED))"`), or a tuple `("TECH" | "JIRA" | "PO" | "PRD", label, verbatim text)`
  checked against the saved document (whitespace, `**` and backticks ignored). A PO answer is never quoted alone: the PRD v14+ carries
  every answer, so quote the PRD line too.
- **Held design-version case (Rule 130):** `marker=DESIGN_HOLD` (or `PO_HOLD("Q12", "why")`), the design's words under References from
  Design, and add the question id to `wwlib.DESIGN_QUESTIONS` (a tuple, currently empty) so the References sentence says the case
  follows the design. Your D-15 (imported invoice line in the report, DV-04 / DQ-01) is the one held case planned.
- **Your D-16 / D-17 (ShopCoach):** Phase A settled the path from the sources: the developer's test plan (SV-10131, 8 Oct: "Work order →
  Lines → ShopCoach Line Builder → Build Lines") and SV-11850's steps both use the **ShopCoach Line Builder box on the Lines tab**, so
  Phase A's S2 cases start there (`cases_s2.DESCRIBE`, `BUILD`), not at New Line → AI SHOPCOACH LINE BUILDER. Every case whose steps
  click Build Lines takes `marker=cases_s2.SV11850` (`AUTOMATION: READY - EXPECT FAIL (SV-11850)`) and `note=cases_s2.FAIL_NOTE` (the
  symptom and the three outcomes, Rule 61; the build fails an EXPECT FAIL case without them). Import them:
  `from cases_s2 import SV11850, FAIL_NOTE, DESCRIBE, BUILD, ASSET`.
- **Gates that will catch you** (same as Phase A's): title ≤ 80, no ";", "Design: " prefix; one result group per step; one UI action per
  step; no read-only step ("Look at", "Read", "Find", "Check", "Note", "Write down", "Compare" — fold into the previous result; "Take a
  screenshot" is an action and is fine); no {placeholder}, "for example", Scenario, setup-file link, ZZAUTOTEST, "QA lead", Blocked line;
  no vague look word (native, as described, looks right, the same style, as designed, as before, as expected); no case key / C-id /
  requirement code / technical word (API, byte(s), UTF-8, JSON …) in tester text; precondition starters (Sign in / Use / Have / Create /
  Make sure / Open / Give / Keep / Start / Set / Turn / Import / Log in / Add / Write down / Delete / Make / Download / Narrow);
  relevance (every "work order 1", "line 1", "invoice A", "canned line A", "file A", "user B", "tab 2" … a precondition names is used
  later, or its bullet says why with "so …"); independence (a case whose steps click Save & Close / Create Invoice / Reverse / Upload
  describes its work orders, lines, invoices and files as made for this test). Every "does not appear" result needs a visible control.

## 4 · Gates — run before you finish

```
cd build/founder-mode/what-why/authoring
python3 build.py                 # must end "PROBLEM lines: 0"
python3 gate_selftest.py         # must end "gate self-test problems: 0"
cd /home/user/Manual-test-Cases/build
python3 testing-tools/tester_readiness_check.py founder-mode/what-why --sample 5   # exit 0; READ the sample and every READ-CONTROL line
cd founder-mode/what-why/authoring
python3 ledger.py && python3 render_setup.py && python3 render_outputs.py --phase D --sections DESIGN --samples D-01,D-05,D-11
```
(`render_outputs.py` samples old vs new only for mapped keys; for the all-new DESIGN section pass `--samples` with any mapped key, or
skip the samples part.)

## 5 · What Phase A decided that Phase D and the coordinator need

- **Board example values in Story 3 (coordinator's note, 27 Oct):** S3-01, S3-04, S3-11, S3-12 use the PRD/board example line ("Replace
  tie rod" / "excessive play" / "Both outer ends worn, replaced and aligned"); S3-06 now types board 2.1's two examples letter for letter
  (hyphen card, semicolon card); S3-05, S3-13, S3-14 cite board 2.2 (its own long example is illustrative; the cases use computable
  inputs: 5,000 digits → 4,000 characters; "Replace tie rods" + 3,000 é → 2,009 characters / 3,999 bytes, a cut that would fall inside a
  letter). Boards cited per case: 1.2 → S1-01, S1-02, S1-03, S1-03b, S1-04, S1-08; 1.5 → S1-04b, S1-05, S1-06, S1-07; 1.3 → S2-04, S3-01,
  S3-03, S3-04, S3-08, S3-09, S3-16, S3-17, S3-23; 2.1 → S3-02, S3-06, S3-11, S3-12, S3-15, S3-19 … S3-22; 2.2 → S3-05, S3-13, S3-14.
  Boards 1.1 and 1.4 (Before) are cited by no Phase A case: Phase D's D-01, D-02, D-04 use them as the control.
- **SV-11850 (Rule 61):** an OPEN ticket backs the marker, so S2-01 (C154711), S2-02 (C154712), S2-03 (C549079) carry
  `AUTOMATION: READY - EXPECT FAIL (SV-11850)`; the symptom says it was seen on staging and that whether sv10130 has the same fault is not
  known (outcome 3 catches a pass there). S2-04 (C549080) only needs a ShopCoach line in its preconditions: plain HOLD marker + a note.
  `refs` of the three EXPECT FAIL cases include SV-11850.
- **Divergences ruled by Chris (coordinator's note):** Require Tech Story default (answer 8 / S3-R6a) — cases test both states with
  "Make sure Require Tech Story is on/off"; "Tech story missing." (answer 6 / S3-R6) — S3-12 creates it by saving the line once from Edit
  Line. Both follow the PRD.
- **S1-R6 (answer 7, QA lead "Not now" to the bug):** S1-03 and the new S1-03b keep the PRD's expectation (message under Title whenever
  in error, including on leaving it empty); no EXPECT FAIL. The developer's 19 Oct note says the build now does this.
- **Rule 65 / 71:** C154707 … C154725 were listed by Vladimir Tomovic (SV-10130 … SV-10133, 7 Oct) as "automation planned"; all are
  rewritten. Tell Vlad when the write runs.
- **Old setup docs:** the 37 per-case Google Docs of 13 Oct (`update-2026-10-13/docs/LIST.tsv`, `doc-ids-0.jsonl`) are no longer linked
  from any case once apply.py runs; trashing them is the coordinator's (as for Parts Lifecycle's 274).
- **Run:** all 37 live cases are in Nightly run 538 (13 Oct record); the 8 new cases join the open Nightly run, union only (Rule 34).

## 6 · Coordinator checklist (in order)

1. Phase D part 2 writes `cases_design.py`; re-run every gate (§4).
2. Merge Phase D's `design/DESIGN-DIVERGENCE-ROWS.json` into `DESIGN-DIVERGENCE-REGISTER.json`; merge `design/QUESTIONS-DESIGN.json`
   (DQ-01..DQ-03) into `full-pass-2026-10-27/QUESTIONS.json` as Q12-Q14 after Phase A's Q9-Q11.
3. With the QA lead's go-ahead: add Q9-Q14 at the bottom of the What/Why question sheet (Google Doc 1QcT7FRZci6AhYcI33HUac-Oob03-gCnCOKn2NFHMLjA)
   in a new colour (Rule 131); list them in `build/PO-QUESTIONS-OPEN.md` (Rule 132).
4. Create the TestRail section "Design — how it looks" under 20437; write its id into `section-map.json` as "DESIGN"; re-run build.py.
5. `python3 authoring/apply.py` (plan) → QA lead's go-ahead → `--apply` (Rule 138 guard inside); then runs union only; tell Vlad (Rule 65).

## 7 · Screen labels no source confirms (for the build verification session)

From the design or the developers' notes and used as written, still to be seen on the build: "Click the clear button (x) at the right
end of the Title field" (S1-02); "Close the Edit Line / New Line window without saving" (S1-05, S1-08); "Click the add button of the
first suggested line" (S2-02); "Complete line 1 without typing a tech story", "Change work order 1's status to Complete", "Close the New
Customer Payment window" (S3-04, S3-17); the tech story field when Require Tech Story is off (S3-20, S3-21); "Click invoice A's
three-dot menu", "Reverse", "Reverse in the confirmation" (S3-17); "Download" in the Export Report dialog (every report case);
"Download template", "Upload file A", "Switch the list to List view", "Pick Imported in the Status filter" (Story 4, S3-15); "QB
Unexported" in the Reports left menu and its Customers tab (S3-14, S3-15); the average cost column's name in the report (S3-07).
Observed on other suites (facts only, Rule 118): Settings → Work Orders tab → Require Tech Story; Settings → Data Import → Invoices;
Reports → Export Reports → "Export Report" dialog → Report Name; Reports → QB Unexported.
