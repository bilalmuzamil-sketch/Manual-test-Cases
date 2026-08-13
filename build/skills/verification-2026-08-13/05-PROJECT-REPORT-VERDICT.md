# Cold-run verification verdict — skill `05-PROJECT-REPORT` (with `00-COMMON-CORE`)

**Run 2026-08-13** (relaunch ~07:40 UTC after the ~05:57 predecessor was killed by a usage limit;
its live figures were NOT reused — everything was re-derived at 07:44:58 UTC per the skill's own
§(c)/G1, and the two reads agree on every measure).

**Protocol:** a fresh session using ONLY `00-COMMON-CORE.md` + `05-PROJECT-REPORT.md`. Every reach
outside those two files for something the skill should have said = a cold-start defect, logged here
and then fixed in the skill file (additively, dated). Task: the Rule-67 completion reports for
Filters and Schedule, read-only (TestRail `get_*` only · zero Jira · zero app access).

**Deliverables produced:**
- `build/reports-2026-08-13/Filters_Completion-Report_2026-08-13.md`
- `build/reports-2026-08-13/Schedule_Completion-Report_2026-08-13.md`
- `build/reports-2026-08-13/HOW-THE-NUMBERS-WERE-DERIVED.md` + `derive_live.py` + `live-derivation.json`

---

## VERDICT: **PASSES WITH FIXES APPLIED**

The skill's substance held up cold: the seven-column table was constructible, the marker arithmetic
gated both ways on both projects on the first live read, the paging/URL warnings (§3.3) were exactly
right and prevented the silent-empty-result trap, the ours-vs-foreign split worked mechanically from
`created_by`, and the honesty requirements (a)–(i) forced the two places where an overstated number
would otherwise have been written (steps-walked; "the build now running"). **But a truly cold session
could not have STARTED without reaching outside the two files (D1), and two required columns have no
derivation procedure for the situation this pass was actually in (D2, D5).** All defects below were
fixed in the skill files after the run — additively and dated, superseded wording kept.

---

## COLD-START DEFECT LOG

| # | Defect | How it bit | Fix applied |
|---|---|---|---|
| **D1** | **Neither file says how to authenticate to TestRail or where the credentials live.** §17 gives host, project 1, suite 1, the `&` rule — but not that auth is Basic, nor that creds sit at `/tmp/testrail/creds.json` (or must be requested from the QA lead when `/tmp` is fresh) | The pass could not make its first API call from the files alone; creds were found only by exploring `/tmp`. (Independently hit by the predecessor and by this relaunch) | Already fixed mid-morning by the parallel `08-RECOVER` drill (commit `ce0d2277`, §17 "TestRail CREDENTIALS" bullet — it names both drills). This run's duplicate bullet was removed before commit; theirs stands |
| **D2** | **Column 3 requires splitting by "the build now running", but neither file says how to establish the running build in a report-only pass, nor what to do when it cannot be read** (no session / zero app access). Core §0.4 establishes the marker only "if the pass touches the build" — a report pass does not, yet the column needs it | The reports had to invent a fallback: split by the most recent build named in the cases' own sentence-2 stamps, labelled as not-confirmed-running | `05` column 3 + steps — fallback wording added |
| **D3** | **Column 2's "current spec version pin" requires the live Confluence version, and the skill gives no fallback when the source cannot be fetched** — it delegates source checks to skill `02` (explicitly out of this skill's scope) while core §0.3 demands source currency as the first action of any pass including read-only ones. Contradiction with a read-only/no-Atlassian constraint, unresolved in the files | The reports had to invent the honest treatment: report the pin as recorded + its read date, label currency NOT ESTABLISHED, and put the skill-`02` read in "what is left" | `05` column 2 note — fallback added |
| **D4** | **§17's fact sheet elides the Schedule / Report Suite id-map paths (`build/schedule/…`) and names no import-file paths at all**, while `05` step 4 requires reconciling id-map rows AND import rows | Paths had to be discovered by listing directories (`testrail-import/<project>-v1-testrail-import.csv` appears nowhere in the two files) | `00` §17 — table completed + import paths added |
| **D5** | **Column 4 (steps-walked) has no stated derivation procedure — and core §14.2 actively collapses it into column 3** by defining every sentence-2 stamp as the record of the full runnability walk, while `05` §(a) requires the two numbers be separate and the walked number smaller. Nothing says where a report pass reads the walked figure from | Both reports carry "not independently establishable; ≤ N by the stamp record" instead of a real figure — the conservative treatment, but the skill forced the improvisation | `05` §(a) + column 4 — derivation note added |
| **D6** | **"Local active" (step 4's third count) is undefined** — the retirement convention differs per project (Filters: `viu_status` beginning "Retired"; Schedule: `status`), and neither file states either | First reconciliation run showed a false mismatch (151 ≠ 115) until the Filters body schema was inspected | `00` §17 — one line added |
| **D7** | **Stale claim in core §14.1:** "the existing suites do not carry read-dates … a sweep is owed and it is NOT DONE." Live census (both reads, both projects): Filters 115/115 and Schedule 176/176 DO carry read-dates. (Report Suite not measured this pass) | A cold session obeying §14.1 would have reported a compliance gap that does not exist on these two suites | `00` §14.1 — dated correction appended, superseded wording kept |

**Not logged as defects:** status-id→name mapping (derivable live via `get_statuses`, no outside
reach needed) · the reports' location (`build/reports-2026-08-13/` was a task instruction overriding
the skill's `build/<project>/READINESS-<date>.md` default — an instruction, not a gap) · core §3.3's
"625 sections" (626 live — the number is illustrative and the section's own point is ">250, page it").

## PROTOCOL NOTES (deviations from the skill as written, with reasons)

1. **The "mark the previous readiness file SUPERSEDED" step was NOT performed.** The previous
   position-statements for these projects are other passes' `COMPLETION-REPORT.md`/`FINDINGS.md`
   files, not `READINESS-*.md`; a verification run editing sibling passes' records to plant banners
   seemed worse than noting it here. The two new reports each state they supersede nothing by
   deletion.
2. **Step 9 (outstanding register update) was performed additively** — one dated block referencing
   the two reports, no existing rows rewritten.
3. **Column 7 blockers (§f) were "tested" only to the extent a zero-app, zero-Jira pass can:** each
   was checked against the case's own live text and against core §11.4's walk records; none was
   re-walked. The reports say so per item.

## WHAT WORKED (so the pass/fail is balanced)

- §3.3 (paging + `&`-only URLs) — followed verbatim, zero 400s, zero silent-empty results.
- The marker regex/placement rules (§15) — 291 of 291 our cases parsed to exactly one marker.
- The gates — marker arithmetic closed both ways on both projects; build-split totals gated to the
  suite (74+35+6=115; 151+25+0=176); grading gated to the run counts and the test totals.
- §1.3/§5 — the 5 foreign Filters cases (C43576–C43580, Ahtasham Amjad) fell out mechanically.
- §(c) — deriving live was vindicated twice over: the predecessor's figures happened to still be
  true, but only the re-read could prove that.
- §8/§9 — checkpoint-per-file survived a sibling worker committing to the shared repo mid-pass
  (71c9ecc9 landed between two of this pass's checkpoints; the explicit-SHA push protocol absorbed it).
