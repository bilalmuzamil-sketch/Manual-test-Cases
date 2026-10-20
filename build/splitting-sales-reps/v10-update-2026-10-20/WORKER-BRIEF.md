# Worker brief: bring the Splitting Sales Representatives suite up to PRD v10 (20 Oct 2026)

QA lead, 20 Oct 2026: update all 120 cases of the Splitting Sales Representatives suite to PRD v10 ("2. Yes if you are referring to
the testing suite of Sales representative"), and create cases for the 6 v10 rules that have none ("3. Yes"). You EDIT THE AUTHORING
FILES and run the build. You do NOT write to TestRail, Jira, Slack or Google, and you do not commit or push.

## Inputs (all in `build/splitting-sales-reps/`)

- Case library: `authoring/ssr_lib.py` (sources, quote lookup, rendering, checks), `authoring/cases_*.py` (the cases),
  `authoring/build.py` (the gates; it must end with 0 PROBLEM lines). The id map `testrail-id-map.csv` gives each key its C-id.
- PRD now: `prd-v10-2026-10-20/CONFLUENCE-919928833-v10-2026-10-20.md` (Confluence 919928833 **version 10**, 19 Oct 2026, Chris
  Ward). What changed from v8: `prd-v10-2026-10-20/REQUIREMENT-DIFF-v8-to-v10.md` and `TEXT-DIFF-v8-to-v10.diff` (read both in
  full). Which cases quote a changed rule: `prd-v10-2026-10-20/CASES-AND-V10-CHANGES.json`.
- Chris Ward's 38 answers (19 Oct 2026): `design-recheck-2026-10-20/chris-answers.json`. Gaps and the existing cases v10 or the
  answers changed: `design-recheck-2026-10-20/GAPS.md` §4 and §4b (read in full).
- Jira stories SV-11265 to SV-11272 were refreshed by Chris on 19 Oct to match v9. Re-read SV-11266 to SV-11272 IN FULL with the
  Atlassian tools (read only, cloudId 19fdd96d-a135-46c4-83e7-d2cc218a4e63; getJiraIssue) and note any sentence that differs from
  PRD v10 (the PRD wins; Chris's answer 37). Story 1 (SV-11265) was re-read on 20 Oct: its acceptance criteria still say "44px".
- Rules (read): `build/rules/RULES-61-96.md` 113, 114, 117 (all amendments, incl. ninth, tenth, eleventh, twelfth), 41, 116;
  `build/skills/IDEAL-TEST-CASE-STANDARD.md`.

## What to do

1. `ssr_lib.py`: read the PRD from the v10 file (it is markdown: strip `**` and `\\` before matching "S1-R1:" lines) and set
   PRD_NAME to version 10 (19 Oct 2026, Chris Ward). Every PRD quote then comes from v10 automatically. Where a case quotes one of
   Chris's answers, add that document to DOCS so it gets its own "From:" line: "Chris Ward's answers to the Splitting Sales
   Representatives question sheet (19 Oct 2026)".
2. For every case: re-check the WHOLE case against v10 (Rule 41). Where v10 or an answer changed what the tester should see, change
   the plain results (and steps or preconditions only where needed) so they follow the v10 sentence, word for word in the quote.
   Known examples: C666030 / C665935 part sale label "Sales representative" (S2-N2, answer 7); C665959 / C665954 "(Inactive)" on
   customer fields (S4-N2); C665966 rounding (S5-R7); C665957 / C665958 Deactivate window wording and reactivation (S4-R20, S4-R21);
   column order Status, Sales Type, Location (S5-R19, S5-R23); Adjustments share (S5-R6); S5-R15a; S7-R1 / S7-R4; S8-E1 saved links;
   S4-R23 file name; S4-E1; S4-R3; S2-R17; S5-R8; S8-R4 / S8-R9. Design cases whose note says a point is "on the product owner's
   question sheet" now quote the answer instead. Keep every case's layout; titles stay unless the check changed.
3. Add 6 new cases (in the right story section, same layout, keys that do not clash): S1-E3 and S7-R6 (a staff member who no longer
   exists or belongs to another organization reads "Unassigned" on the card and in the log entry; v10's context note says only a data
   repair causes it and "Developers check these cases; manual QA cannot set them up", so mark AUTOMATION: HOLD with that plain reason);
   S2-E6 (two screens, the later save wins: two browser windows); S4-R3 (New Customer opened from a part sale by a user who can create
   part sales but not customers lists the representatives); S4-R20 (reactivating does not put them back); S8-R4 and S8-R9 (another
   export with no rows still downloads a file with headings and no rows, both reports).
4. Run `python3 authoring/build.py` until it prints no PROBLEM line, and `python3 authoring/apply3.py` (dry run only, no --apply) to
   list the cases whose fields now differ. Do not run anything with --apply.
5. Write `v10-update-2026-10-20/REPORT.md`: per changed case (C-id, key) what changed in plain words and why (v10 code / answer);
   the 6 new cases (key, title, section, source); the story re-read result; the build output; reading coverage.

Never invent behaviour: every expected result follows from a quoted v10 sentence or a quoted answer. Never take behaviour from the
design (except the look where the PRD is silent, Rule 126) or from a build.
