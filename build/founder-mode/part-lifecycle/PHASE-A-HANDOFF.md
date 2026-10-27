# Parts Lifecycle full pass — Phase A handoff (27 Oct 2026)

Phase A built the authoring library in `authoring/` and wrote Stories 1-5 (73 cases). Phases B (Stories 6-10), C (Stories 11-13,
SV-10380, SV-11756) and D (design look) add their cases to the same library and must pass the same gates. Draft only: no TestRail,
Jira, Slack or Google writes and no commits in any phase; `authoring/apply.py` is the coordinator's, run only on the QA lead's go-ahead.

## 1 · Files

| File | What it is | Who edits it |
|---|---|---|
| `authoring/pllib.py` | Source parsers (PRD v33, tech plan, Jira, PO answers, canvas notes), the case model `C()`, rendering, per-case checks | nobody without a reason; any change re-run by every phase |
| `authoring/common.py` | Shared plain precondition bullets and step strings (`ADMIN`, `START`, `MENU`, `SHARED()`, `note()` …) | add shared strings freely; never change one Phase A uses without re-running build |
| `authoring/cases_s1.py` … `cases_s5.py` | Phase A's cases (`WRITTEN = True`) | Phase A |
| `authoring/cases_s6.py` … `cases_s10.py` | Phase B stubs: each docstring lists the live cases to rewrite (key, C-id, 14 Oct title) | Phase B |
| `authoring/cases_s11.py` … `cases_s13.py`, `cases_iv.py` | Phase C stubs (`cases_iv.py`: section 54274, SV-10380; SV-11756 decided here) | Phase C |
| `authoring/cases_design.py`, `authoring/design_refs.py` | Phase D stub (section DESIGN) and the DREFS map that adds design references to any case | Phase D |
| `authoring/requirement_map.py` | `NO_MANUAL` (code → reason), `NO_MANUAL_UFS` (feedback row → reason), `OTHER_STORY` (code → section that covers it) | each phase adds its own rows |
| `authoring/build.py` | All gates; writes `authoring/proposals.json` and `REQUIREMENT-MAP.json` | nobody without a reason |
| `authoring/gate_selftest.py`, `plants.py` | Proves every gate FAILS on a planted fault and that running the gates changes no file (L-19) | add a plant for any new gate |
| `authoring/ledger.py` | Writes `TICKET-LEDGER.json` and `TICKET-SWEEP.json`; set the `OUTCOME` row of your tickets, re-run | B and C |
| `authoring/render_setup.py` | Writes `PARTS-LIFECYCLE-SETUP-FILE.md` (the one setup file for Claude sessions) | run after writing |
| `authoring/render_outputs.py` | Writes `full-pass-2026-10-27/PASS-REPORT-<PHASE>.md` (Rule 134 per-case, per-part record + 3 old/new samples) | run with your phase and sections |
| `authoring/make_id_map.py` | One-off that wrote `testrail-id-map.csv` (refuses to overwrite) | **do not re-run** |
| `authoring/apply.py` | The TestRail write (plan only without `--apply`) | coordinator only |
| `testrail-id-map.csv` | key, case_id, section_id, title (14 Oct), link — all 274 live cases that stay | append-only, by apply.py |
| `REQUIREMENT-MAP.json` | all 311 v33 codes: COVERED (keys, C-ids) / NO MANUAL CASE (reason) / OTHER STORY / PENDING (planned keys) | written by build.py |
| `TICKET-LEDGER.json`, `TICKET-SWEEP.json` | Rule 129 ledger (24 tickets) and sweep config | written by ledger.py |
| `DESIGN-DIVERGENCE-REGISTER.json` | Rule 130 register (6 carried rows, all PO-RULED; 0 open) in `spec_to_design_check.py` format | Phase D adds rows |
| `full-pass-2026-10-27/QUESTIONS.json` | open questions Q1-Q7 (Q5 answered by v33) with held keys | append Q8 onward |
| `full-pass-2026-10-27/PRD-DIFF-v29-v33.md` | code and non-code diff, and the live cases quoting the 4 changed codes | read first |
| `sources/jira-2026-10-27/` | every ticket and comment under the epic, read 27 Oct (`ALL-TICKETS-2026-10-27.md`, `EPIC-CHILDREN-2026-10-27.json`) | read in full (Rule 119) |

## 2 · Keys, C-ids and sections

- **Every live case keeps its C-id.** `testrail-id-map.csv` gives each of the 274 remaining live cases a key: section prefix + two
  digits in C-id order (`S6-01` … `S13-44`, `IV-01` … `IV-11`). Write your case with exactly that key and the coordinator UPDATES the
  C-id in place. The build fails if a mapped key of a written section has no case ("no case is lost").
- **New requirement → new key**, the next free number in the section (`S6-09`, `S7-27` …). No row in the map = a new case.
- **Rule 136 split → `<key>b`, `<key>c` …** with `part_of="<original key>"`, in the same section; the original keeps its C-id as part 1.
  Split only when every part checks a different behaviour and starts from its own preconditions; never when steps need each other.
- **Never map to the 12 deleted cases** (`pllib.DELETED`: C425659, C425758, C425639, C425759, C154761, C425602, C425622, C425629,
  C425701, C425723, C425755, C425776). A requirement only they covered is now NO MANUAL CASE or removed from the PRD: S9-E9 and S10-R25a
  (public API) are PENDING with no planned key and almost certainly belong in `NO_MANUAL`; S5-R14 / S9-E12 / the dashboard figure are
  no longer in the PRD.
- **Sections** (`pllib.SECTIONS`): `S1`…`S13` from `section-map.json` (20468 … 20480), `IV` = 54274, `DESIGN` = None (the coordinator
  creates "Design — how it looks" under Part Lifecycle 20439; keys `D-01` …).
- Each case module sets `WRITTEN = True` when its story is done (and `SECTION = "IV"` / `"DESIGN"` for those two). Only then does the
  build enforce that story's code coverage and feedback messages; until then its codes are PENDING with planned keys.

## 3 · How to add a case

```python
from pllib import C, PO_HOLD, HOLD, DESIGN_HOLD
from common import *

C("S6-01", "S6", "Searching not tracked lists the untracked parts",           # key, section, title (<= 80, no ";")
  [ADMIN, "Have an active untracked part, part A, and an active tracked part, part B.",   # preconditions: plain bullets
   SHARED("parts A and B"), START],
  [TYPE_SHARED, "Replace the search text with not tracked."],                 # steps: ONE UI action each
  [["Parts A and B are listed."],                                             # one list of bullets per step
   ["Part A is listed.", "Part B is listed only if its number, description or tags match the words."]],
  ["S6-R1", "S6-R2"],                                                         # quotes (see section 4)
  design=dict(boards=["5.4"], words=[note("Typing \"not tracked\" in the Inventory search")]),
  claude=["Example values: part A = ZZAUTOTEST-PL-S6-01-A ..."])               # setup-file lines only (Claude sessions)
```

Optional arguments: `note=` (a short tester note shown after the results), `marker=` (default `MARKER`; `PO_HOLD("Q8", "why")`,
`DESIGN_HOLD`, `HOLD("reason")`), `stories=[n, …]` (From-line stories; default from the quoted codes), `part_of=`.

**The QA lead's pattern, as the gates enforce it** (Rule 117 fourteenth + fifteenth amendments, Rules 135-138; read them):
- Preconditions start with `Sign in` / `Use` / `Have` / `Create` / `Make sure` / `Start` / `Give` / `Write down` / `Delete` / `Open` /
  `Set` / `Turn` / `Import` / `Add` / `Keep`. Records are named plainly — part A, part B, work order 1, location B, bin location A,
  category A, date A, description 1 — and every named record is used in a step or result, or its bullet gives a reason with "so …".
  A record the steps change is "Create … for this test" (or "made for this test", or "from before this release"); a shared setting is a
  "Make sure …" bullet; the starting screen is a "Start on …" bullet. No {placeholders}, no "for example", no Scenario line, no
  setup-file link, no ZZAUTOTEST, no Blocked line, no who-to-ask, no case key / C-id / requirement code, no API / HTTP / request words.
- Steps: one action each ("Click …", "Type … in the Search box.", "Pick … in the Category filter.", "Hover over …", "Wait 5 seconds
  without refreshing the page."). Two-click navigation is two steps, or goes into the "Start on …" precondition. No read-only step
  ("Look at", "Read", "Find", "Check", "Note", "Write down"): fold what to see into the previous step's result.
- Results: bullets that start a sentence, one observable fact each, in the screen's words, numbers with the arithmetic shown. Do not
  start a bullet with "Step N:" (render adds it). Never "native", "as described", "looks right", "the same style", "as designed",
  "as before", "as expected". Every "does not appear / not listed / nothing happens" result needs a control the tester can see (another
  record that must appear, a message, a count): the readiness check lists every such line for reading (54 in Phase A, all read).
- A behaviour a manual tester cannot set up or reach (a request sent outside the screens, the public API, a server error, a console
  command) is NOT a case: add the code to `requirement_map.NO_MANUAL` with the reason (and its feedback row to `NO_MANUAL_UFS`).
- Every User Feedback Summary message of a written story must appear word for word in some step or result (`UFS_STORY` in pllib maps
  rows 1-49 to stories), unless the row is in `NO_MANUAL_UFS`.

## 4 · Quotes (Rule 113: verbatim, never edited; From lines are automatic)

- A PRD code string — `"S6-R1"` — quotes that requirement line of v33 (parsed from the line itself; the Change Log is cut off first).
- A NAMED key: `FO-1`…`FO-10` (Feature Overview, core), `ACC-1`…`ACC-7` (Accounting), `FF-1`, `FF-2` (Form factor), `OOS-n` (Out of
  scope), `GOAL-n`, `KD-1`…`KD-19` (Key Decisions), `TERM-1`…`TERM-6`, `ASSUME-n`, `CN-S<story>-<n>` (context notes, e.g. `CN-S4-1`,
  `CN-S13-3` = the "Please try to resolve this." note under the feedback table), `UFS-01`…`UFS-49` (feedback rows, "Trigger | Message
  | Behavior"). List them with `python3 -c "import pllib as L; print(sorted(L.NAMED))"`.
- A tuple `(doc, label, text)` with doc `PRD`, `TECH` (tech plan), `JIRA` (a ticket or comment, label e.g. "SV-10814, Chris Ward, 23 Oct
  2026") or `PO` (Chris Ward's answer files). The text is checked verbatim against that document (whitespace and `**` ignored).
- The block renders "Exact quotes from the source (for reproducibility)" with one `From:` line per document (PRD first, carrying the
  epic and the stories), then the build line, then "References from Design", then the AUTOMATION line last.
- Design words go only in `design=dict(words=[...])` (checked verbatim against the canvas notes, use `common.note("<start>")`), never
  in `q`. `design=dict(boards=["4.1", "5.7"])` names boards by number; their PNGs are attached by default; `note=` replaces the "no
  board draws this" sentence. Phase D's `design_refs.DREFS` adds boards/pictures/words to any case by key.

## 5 · Gates — run before you finish

```
cd build/founder-mode/part-lifecycle/authoring
python3 build.py                 # must end "PROBLEM lines: 0"
python3 gate_selftest.py         # must end "gate self-test problems: 0"
cd /home/user/Manual-test-Cases/build
python3 testing-tools/tester_readiness_check.py founder-mode/part-lifecycle --sample 5   # exit 0; READ the sample and every READ-CONTROL line
cd founder-mode/part-lifecycle/authoring
python3 ledger.py && python3 render_setup.py && python3 render_outputs.py --phase B --sections S6,S7,S8,S9,S10 --samples S6-01,S8-02,S9-01
```
build.py gates: per case (title, steps = result groups, one action per step, no read step, Blocked line, old layout, vague words,
key/C-id/code in tester text, not-manual wording, jargon, precondition starters, quotes verbatim, design words/boards/pictures, marker);
identity (keys unique and in section, no mapped case lost, no deleted case, split parts in their section); coverage (written stories'
codes); feedback messages; rendered layout; relevance; independence. The heuristics check words, not meaning (L-13): read your cases.

## 6 · What each phase still owns

- **Phase B (S6-S10).** New codes S6-R1a (tracking words in the vendor Return and Credit pickers), S9-R21 ("Not Tracked" in the part
  lookups), S9-R22 (untracked keeps "In Stock"). Changed codes: S7-R6c (a linked entry with no category now takes the dialog's
  category; rewrite S7 case quoting it, C425673), S9-N3a (access stays as today; C425746, C573685, C573686), S10-R22a (only the changed
  pair; C425772, C425773). Probably NO MANUAL: S9-E9, S10-R25a (public API), S10-N3/S10-N4 if only reachable outside the screens; the
  server-error feedback rows 27, 29. Jira 23 Oct comments on SV-10819, SV-10820, SV-10822, SV-10823 are PO answers already in v31+.
  Questions Q4 (import tracking) and Q5 (answered by v33) are yours. Phase A cases already quote some S10 codes (S10-R3, R4, R8, R11,
  R12, R12a, R13, R13a, R14, R16, R17, R22, R22a, R24, R26, N2): your S10 cases still need their own coverage of Story 10.
- **Phase C (S11-S13, IV, SV-11756).** New codes S11-R8, S11-R9 (Part Library detail table "Not Tracked" / "Inactive" tag),
  S13-N1a (look-alike rename refused, message "{existing part number} already exists at {location}."), S13-N1b (core rename refused:
  reachable only outside the screens, so expect NO MANUAL). Changed: S12-R14b (uses the most recent delivery's cost; C573674).
  SV-10380: Chris Ward's 23 Oct comment confirms the footer Margin % stays the true aggregate (can exceed 100% or go below 0; a single
  negative row shows the dash) — a PO answer that needs a case. SV-11756: the merge tool is a console command (no manual case; Chris
  26 Oct: ships separately) — record it. Questions Q1 (core's own Part History page; S13-03, S13-13 are held on it too), Q3, Q7.
- **Phase D (design).** Drive the whole design (Rules 120, 124, 126, 133); write `cases_design.py` (section DESIGN, keys D-01 …,
  titles "Design: …"), add `DREFS`, add divergence rows with held design-version cases and questions (Rule 130). The 13 Oct copy is the
  working copy (`sources/design-2026-10-13-artifact/`), unchanged 27 Oct. Phase A's cases already name boards; DREFS may add pictures.

## 7 · Phase A facts the other phases can reuse

- Screen words used (from the boards): "Inventory" title; "Active" / "Inactive" tabs; the three-dot actions button (⋮) left of
  "New Inventory Part"; menu "Cycle count", "Deactivate parts" / "Activate parts", "Export"; dark bar with a round count badge,
  "selected", "Deactivate" / "Activate", X; "N records selected." under the table (design + tech plan D24, PRD silent); Cycle count
  toolbar: printer icon, Save, Cancel, "Count changes available"; Count column; "Edit Inventory Part" / "New Inventory Part";
  "Part Status" Active / Inactive; "Inventory Tracking" heading with an info icon; "Track quantities and cost of goods"; Inventory
  section with "Bin Location", "Quantity", "Default", "Add Bin Location"; "Delete Part", "Cancel", "Save"; the clock icon (Part
  History) at the left of a row; avatar → Light / Dark; Reports → Inventory Value (Location filter, as-of date, Search, Qty, Unit Cost,
  Total Cost, Totals); Settings → Data Import → Inventory; Bin Locations under Settings (the PRD says Administration: Q6).
- Cores: a core has no row of its own anywhere (S5-E3); Phase A observes a core's status and tracking through the global search
  result "Core for <description>" (cases S2-19, S2-19b, S5-08, S5-09), which question Q1(b) asks the PO to confirm.
- Held in Phase A: S5-01 (C154770) on Q2, S5-18 (C573677) on Q1.
