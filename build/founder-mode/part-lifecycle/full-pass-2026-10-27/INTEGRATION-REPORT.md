# Parts Lifecycle full pass — integration report (27 Oct 2026)

Integration step after Phases A, B, C and D. Draft only: nothing was written to TestRail, Jira, Slack or Google, and nothing was
committed. Every file changed is under `build/founder-mode/part-lifecycle/`. Read in full before merging: `WORKER-BRIEF.md` (with the
token charter), `PHASE-A-HANDOFF.md`, `PHASE-B-REQUESTS.json`, `PHASE-C-REQUESTS.json` and `PHASE-D-REQUESTS.json`, plus every library
file the merge touched (`pllib.py`, `build.py`, `ledger.py`, `apply.py`, `requirement_map.py`, `pc_common.py`, `common.py`,
`plants.py`, `gate_selftest.py`, `render_setup.py`, `render_outputs.py`, `QUESTIONS.json`, `DESIGN-DIVERGENCE-REGISTER.json`, and the
head of each case module).

## 1 · What was merged

| Request | Where it went | Duplicate removed |
|---|---|---|
| Phase B "No manual case" rows: S7-N6, S9-E9, S10-N3, S10-N4, S10-R25a; feedback rows 6, 7, 29, 38, 39 | `authoring/requirement_map.py` (reasons word for word) | `cases_s6.B_NO_MANUAL()` and its calls in `cases_s7.py`, `cases_s9.py`, `cases_s10.py` |
| Phase C "No manual case" rows: S11-E3, S13-R19d, S13-N1b, S13-N8; feedback rows 15, 17, 18, 19, 27, 47, 48, 49 | `authoring/requirement_map.py` | `pc_common.py` section 1 |
| "part request" is the screen's own phrase (bare "request" still refused) | `pllib.JARGON` | `pc_common.py` section 2; new gate plant `jargon` in `plants.py` / `gate_selftest.py` |
| Inventory Value From line names bug SV-10380 instead of an empty ", " | `pllib.quotes_block` (`pllib.IV_BUG`) | `pc_common.py` section 3 |
| Stray trailing "*" on context-note quotes | `pllib` context-note parser (strips the Markdown italics at both ends) | — |
| `design_block()` wording | `pllib.source_sentence()`: only held design cases (DESIGN_HOLD, or a PO hold on Q8/Q9/Q10) say "…except where this held design case follows the design."; the other design cases say "…come from the quotes above where the PRD speaks, and from the board pictures where it is silent about the look."; story cases unchanged | — |
| `build.py` BrokenPipe when piped | `signal.signal(SIGPIPE, SIG_DFL)` | — |
| Ledger outcomes SV-10819 … SV-10826, SV-10380, SV-11756 | `authoring/ledger.py` OUTCOME; IV cases now listed per section incl. the new IV-08b, IV-12, IV-13; SV-11756 = NO-CASE "No case: ships separately, Chris Ward 26 Oct 2026" + Phase C's reason | no PENDING-PHASE row left |
| Questions DQ-01..03, Q-B1, Q-B2, Q-C1..C3 + new Q16 | `QUESTIONS.json` as Q8..Q16 (`was` keeps the old id); Q1, Q3, Q4, Q5, Q7 carry their phase updates (`integration_27oct`) | old ids renamed in every case marker / note, ledger note and docstring (0 left in the library, setup file, ledger, pass reports) |
| Phase D register rows (68 PRD-word rows + DV-01..DV-03) | `DESIGN-DIVERGENCE-REGISTER.json` (DQ ids → Q8..Q10) | — |
| DESIGN section key | **Read from a file, never created by a script:** the coordinator creates "Design — how it looks" under Part Lifecycle 20439, writes its id into `section-map.json` as `"DESIGN"`, re-runs `build.py`; `pllib.SECTIONS["DESIGN"]` reads it (None until then) and `apply.py --apply` skips the 49 design adds while it is None | — |

`apply.py` plan output was extended (per section, new section, moves, deletes, read-back locks, held cases); its write logic is unchanged.

### Wording that changed in cases (meaning unchanged)
- **Markers:** S7-17 (C425681) "question Q-B2" → "question Q12"; D-33 "question DQ-03" → "question Q10".
- **Design notes (References from Design, not tester text):** D-11, D-12, D-24, D-25, D-49 "DQ-01" → "Q8"; D-42 "DQ-02" → "Q9"; D-33 "DQ-03" → "Q10".
- **Design sentence:** 47 not-held design cases get the new sentence above; D-33 and D-49 keep the held sentence.
- **Quotes:** the trailing "*" is gone from context-note quotes in 45 cases (the quote now equals the PRD text exactly).
- Proven by script: comparing `proposals.json` before and after, these are the only differences in all 364 cases. Tester text (title,
  preconditions, steps, results) is byte-identical.

## 2 · Final counts per section

| Section | TestRail id | Existing rewritten (keeps C-id) | Split parts (new) | New behaviour (new) | Held | No manual case (PRD codes) |
|---|---|---|---|---|---|---|
| S1 | 20468 | 13 | 2 | 1 | 0 | 0 |
| S2 | 20469 | 20 | 4 | 0 | 0 | 1 (S2-N3) |
| S3 | 20470 | 4 | 3 | 0 | 0 | 0 |
| S4 | 20471 | 7 | 0 | 0 | 0 | 2 (S4-N1, S4-N2) |
| S5 | 20472 | 18 | 1 | 0 | 2 (S5-01, S5-18) | 2 (S5-N1, S5-E1a) |
| S6 | 20473 | 8 | 0 | 2 | 0 | 0 |
| S7 | 20474 | 26 | 2 | 0 | 2 (S7-17, S7-25) | 1 (S7-N6) |
| S8 | 20475 | 14 | 2 | 0 | 0 | 0 |
| S9 | 20476 | 42 | 0 | 6 | 0 | 1 (S9-E9) |
| S10 | 20477 | 35 | 1 | 0 | 2 (S10-22, S10-29) | 3 (S10-N3, S10-N4, S10-R25a) |
| S11 | 20478 | 18 | 3 | 2 | 0 | 1 (S11-E3) |
| S12 | 20479 | 14 | 0 | 0 | 1 (S12-06) | 0 |
| S13 | 20480 | 44 | 6 | 3 | 1 (S13-03b) | 3 (S13-R19d, S13-N1b, S13-N8) |
| IV (SV-10380) | 54274 | 11 | 1 | 2 | 0 | — |
| DESIGN "Design — how it looks" | not created yet | 0 | 0 | 49 | 2 (D-33, D-49) | — |
| **Total** | | **274** | **25** | **65** | **10** | **14** |

364 cases. The 12 "Retire OR retest" cases are not mapped to any key (build gate). 36 cases run over 12 steps and are kept whole
(their steps need each other, Rule 136).

## 3 · Coverage (PRD v33, 311 codes)

- **297 COVERED** by at least one case, **14 NO MANUAL CASE** (listed above, each with its reason in `requirement_map.py` and
  `REQUIREMENT-MAP.json`), **0 PENDING**, 0 OTHER STORY left open (S5-N2 is covered in S8).
- New in v30-v33: S1-E1, S6-R1a, S9-R21, S9-R22, S11-R8, S11-R9, S13-N1a covered; S5-E1a, S13-N1b no manual case.
- User Feedback Summary: 40 messages used word for word; 16 rows no manual case (2, 3, 6, 7, 15, 17, 18, 19, 27, 29, 35, 38, 39, 47, 48, 49).
- Quotes: 1,057 quotes in 364 cases (PRD 958, Jira 56, tech plan 20, PO 23). `full-pass-2026-10-27/verbatim_v33_check.py`: every PRD
  quote is a verbatim substring of the v33 file (body above the Change Log, Markdown marks only removed), 0 with a "*", 0 not verbatim;
  every Jira / tech plan / PO quote verbatim in its document (build gate).

## 4 · Questions (`full-pass-2026-10-27/QUESTIONS.json`; none sent yet)

| # | Was | Status | Plain words | Held cases |
|---|---|---|---|---|
| Q1 | — | OPEN | How does a user open a core's own Part History page, and does the top-bar search list a core ("Core for …")? | S5-18, S13-03b, S10-22, S10-29 (S13-03, S13-13 no longer held) |
| Q2 | — | OPEN | How does a part end up with no bin location at all, so turning tracking on can be tested? | S5-01 |
| Q3 | — | OPEN | Does an open Edit Library Part window enable Delete without a reload when the last part using it is deleted elsewhere? | S12-06 |
| Q4 | — | OPEN | Is a part the import adds tracked or untracked, and is the template's "name" column the description? | S7-25 |
| Q5 | — | ANSWERED by PRD v33 | Vendor return permissions (now S9-N3a: today's access stays); remaining gap moved to Q11 | — |
| Q6 | — | OPEN | Bin Locations: under Settings (screen) or Administration (PRD)? | — |
| Q7 | — | OPEN | Inventory Value bug: bins +5 and −2, is the badge "5 Available" or "3 Available"? (IV-05 follows the ticket: 5) | — |
| Q8 | DQ-01 | OPEN | The design draws a close X on every status confirmation; the PRD lists none. Keep it (acting as Cancel) or not? | D-49 |
| Q9 | DQ-02 | OPEN | Design board 7.2's note says a Part Library entry can be deleted on its page; the PRD says Delete is only in the Edit Library Part window. Confirm the note is out of date? | — |
| Q10 | DQ-03 | OPEN | A long Part History entry: wrap onto more lines (design) or cut off with "..." (tech plan)? | D-33 |
| Q11 | Q-B1 | OPEN | Which roles can open Parts → Returns and start a vendor return today (S9-N3a says "today's access" without naming it)? | — (S9-28, S9-41, S9-42 depend) |
| Q12 | Q-B2 | OPEN | Renaming a part to a look-alike of another part at the SAME location: Story 7's message or S13-N1a's? | S7-17 |
| Q13 | Q-C1 | OPEN | Which screen action, if any, shows the other Part Library refusals (not found variants, missing category, source not Vendor)? | — (feedback rows 47-49 no manual case) |
| Q14 | Q-C2 | OPEN | A special-order result from two vendors: does the Cost field fill with the most recent delivery's cost? | — (S12-14 depends) |
| Q15 | Q-C3 | OPEN | After a rename, what number does a part line already on an open work order show? | — (no case asserts either) |
| Q16 | new | OPEN | A page opened before the user's role lost "Part Library & Inventory → Delete": does it keep its old controls until reloaded (so the refusal can be seen on screen)? | — (S8-04 C154783, S8-13 C425654, S8-14 C425655 depend; written for answer A) |

Held cases in the suite: 10 (S5-01, S5-18, S7-17, S7-25, S10-22, S10-29, S12-06, S13-03b, D-33, D-49), exactly the cases whose
marker names an open question or DESIGN_HOLD.

## 5 · Gates (all run 27 Oct 2026 after the merge)

| Gate | Result |
|---|---|
| `authoring/build.py` | `PROBLEM lines: 0` (364 cases, 311 codes: 297 covered, 14 no manual case; relevance 1,359 named records; independence 170 changing cases) |
| `authoring/gate_selftest.py` | `gate self-test problems: 0` (16 plants incl. the new `jargon` plant, readiness plant, no file changed) |
| `authoring/ledger.py` | 24 rows: NEW-CASES 4, COVERED 10, NO-CASE 10 |
| `authoring/render_setup.py` | setup file, 364 recipes |
| `authoring/render_outputs.py` | Phase A, B, C pass records re-rendered with the same sections and samples (rewritten 274, split 25, new 16; the 49 design cases are new and recorded in `design/DESIGN-DRIVE-PROOF.md`) |
| `testing-tools/ticket_sweep.py` | exit 0: 24 tickets, 0 unhandled, PRD v33 handled. Live Jira re-check 27 Oct: no ticket under the epic or its stories updated after the saved read |
| `testing-tools/spec_to_design_check.py` (Phase D inputs: board transcription + board 2.6 file) | exit 0, 0 PRD-word rows open; DV-01..DV-03 stay QUESTION-READY until Q8-Q10 are sent |
| `testing-tools/tester_readiness_check.py … --sample 8` | exit 0, hard problems 0; 165 "does not / never" results listed — all read |
| `full-pass-2026-10-27/verbatim_v33_check.py` | 958 PRD quotes, 0 not verbatim, 0 with "*" |

Sample read in full (seed random): D-04, D-05, S7-14, S9-11, S10-01, S7-19, S10-13, S7-05 — each is runnable from its preconditions,
one action per step, a result for every step. The 165 "does not" lines were read; nearly all have a visible control in the same step
or the next. Worth the coordinator's second look (no change made, the wording is the phases'): S5-14 step 9 "For today part A is not
listed." (the control is the step before, as Phase D noted); S1-10 "the list's usual empty result … write its wording in the result
comment" (the PRD names no wording); S9-21, S9-22, S9-23 "Part A is not added." (the control is the warning in the same step);
S11-05 "Nothing is added or missing for either user."; IV-03 has two allowed outcomes.

## 6 · Apply plan (`python3 authoring/apply.py`, no `--apply`)

```
UPDATE 274 live cases | ADD 90 new cases
  S1  20468 UPDATE 13 | ADD 3 (splits 2, new 1)    S8  20475 UPDATE 14 | ADD 2 (splits 2)
  S2  20469 UPDATE 20 | ADD 4 (splits 4)           S9  20476 UPDATE 42 | ADD 6 (new 6)
  S3  20470 UPDATE  4 | ADD 3 (splits 3)           S10 20477 UPDATE 35 | ADD 1 (splits 1)   held 2
  S4  20471 UPDATE  7 | ADD 0                      S11 20478 UPDATE 18 | ADD 5 (splits 3, new 2)
  S5  20472 UPDATE 18 | ADD 1 (splits 1)  held 2   S12 20479 UPDATE 14 | ADD 0              held 1
  S6  20473 UPDATE  8 | ADD 2 (new 2)              S13 20480 UPDATE 44 | ADD 9 (splits 6, new 3) held 1
  S7  20474 UPDATE 26 | ADD 2 (splits 2)  held 2   IV  54274 UPDATE 11 | ADD 3 (splits 1, new 2)
  DESIGN (not created yet)  ADD 49 (new 49), held 2
new section "Design — how it looks" under 20439: NOT CREATED YET (id read from section-map.json "DESIGN")
cases that would MOVE section: 0 | DELETE: 0 | updates with no 14 Oct read-back: 0 | C-ids updated by two keys: 0
held cases (written, not added to a run): 10
```
It deletes nothing and moves nothing. Each UPDATE is locked against the 14 Oct read-back (skips any case changed since, Rule 123), and
`--apply` refuses unless build.py has 0 PROBLEM lines and the readiness check passes (Rule 138).

## 7 · Not settled

- The 9 questions Q8-Q16 (and the open Q1-Q4, Q6, Q7) are not sent. Rule 131 / 132: add them at the bottom of the existing Part
  Lifecycle question sheet in a new colour and to `build/PO-QUESTIONS-OPEN.md` (outside this folder; not edited here). Until Q8-Q10 are
  sent, DV-01..DV-03 stay open in the register.
- Q16 holds no case: S8-04, S8-13 and S8-14 are written for answer A. Whether to hold them until the PO answers is the QA lead's call.
- The DESIGN section id must be created and written into `section-map.json` before the 49 design cases can be added.
- Tech plan quote labels "§1 Clarifications, Q9 …" (S12-06) and "Q11 …" (S11-14) use the tech plan's own numbering, which now looks
  like our Q9 / Q11. Quotes are verbatim and were not changed; a reader should not confuse them.
- `PROJECT-STATE.md` and `PHASE-A-HANDOFF.md` still describe the pre-integration state (e.g. `SECTIONS["DESIGN"] = None`, Q8 "onward");
  left for the coordinator's state update.
- Phase D's own working files (`design/QUESTIONS-DESIGN.json`, `design/DESIGN-DIVERGENCE-ROWS.json`, `DESIGN-DRIVE-PROOF.md`) keep the
  old DQ ids as history; `QUESTIONS.json` `was` maps them.
