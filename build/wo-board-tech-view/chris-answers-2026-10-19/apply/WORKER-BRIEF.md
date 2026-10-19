# Worker brief: bring WO Board cases up to PRD v68 (19 Oct 2026)

The QA lead approved correcting these cases on 19 Oct 2026. You DRAFT the corrected fields. You do NOT write to TestRail, Jira,
Slack or any external system, you do not commit or push, and you write only your own output file.

## Inputs (all in `build/wo-board-tech-view/`)

- Cases (current bodies): `prd-v68-2026-10-19/wo-cases-2026-10-19-evening.json` (JSON list; fields id, title, custom_preconds,
  custom_steps, custom_expected; HTML). Read only your cases from it, by script.
- PRD now: `prd-v68-2026-10-19/CONFLUENCE-845185030-v68-2026-10-19.md` (Confluence 845185030, version 68, 19 Oct 2026 19:44 UTC,
  Chris Ward). This is THE source. Search it by requirement code; read every requirement your case quotes or touches in full.
- What changed: `prd-v68-2026-10-19/PRD-DIFF-v66-to-v68.diff` and `sv11522-11524-2026-10-19/PRD-DIFF-v64-to-v66.diff` (read both in full).
- Chris Ward's answers (19 Oct 2026): `chris-answers-2026-10-19/answers.json`. Where answer 5 and v68 S4-R16 differ, v68 wins.
- Plan: `chris-answers-2026-10-19/PLAN.md` (why each case is on the list).
- Rules to apply (read them): `build/rules/RULES-61-96.md` Rule 113 (the expected result is the source's own words, quoted
  verbatim, changed only when the source changes), Rule 41 (touch a case, re-verify the WHOLE case), Rule 114 (runnable by a manual
  tester), and Rule 117 with its amendments (the case shape). `build/skills/IDEAL-TEST-CASE-STANDARD.md`.

## What to do for each case

1. Read the whole case (preconditions, steps, expected).
2. Compare EVERY quoted sentence in it with v68. A quote whose sentence changed or vanished in v68 is replaced by v68's sentence,
   copied character for character (same curly quotes and apostrophes as the PRD file). A quote still in v68 word for word stays.
   Update every version reference (66, 64, …) to 68 and the read date to 19 Oct 2026 where it names the PRD.
3. Change the plain expected results (and steps, only where the behaviour to check changed) so they say what the tester now SEES
   under v68: e.g. the lead-change toast "{work order} assigned to {technician}" with Undo instead of "Lead technician updated";
   "{work order} moved to Unassigned" instead of "Lead technician removed"; 5 seconds with Undo / 2.6 seconds without instead of
   8 seconds; "Assignment undone" after Undo; "Invoiced · can’t be reassigned" / "Paid · can’t be reassigned" tooltips and drag
   note; "You don’t have permission to assign technicians" note; the "lead technician dialog" (Assign or Reassign); S9-R14 wording;
   S11-R9; S4-R31; S4-E4; S3-R20e "Unassigned". Use the case's own placeholders and examples. Every plain result must follow from
   a quoted v68 sentence: never invent behaviour, never take behaviour from the build, never from the design.
4. Where a case adds a check (e.g. C682424 gains the "lead technician set to" message when the new lead was already on one of the
   work order's lines), add the minimum steps and the matching "Step N:" results, keeping numbering one result per step.
5. KEEP THE CASE'S CURRENT LAYOUT. Do not convert an older layout to a newer one (no new Source/From restructuring, no new setup
   link) unless the case already uses it. Keep its preconditions unless they must change for the new check. Keep the AUTOMATION
   line exactly as it is unless the case's EXPECT FAIL ticket no longer applies (say so in "why"; do not change it yourself).
6. If the case had "Last checked against build … on …" and its expected behaviour changed, replace that sentence with
   "Not yet checked against a build in this wording." If nothing in its expected behaviour changed, keep it.
7. If v68 has no quotable sentence for something the case must say, do not invent one: leave that part unchanged and list it in
   "questions".
8. If, after reading, the case needs NO change (the script that listed it was wrong), say so: {"no_change": true, "why": [...]}.

## Output

Write `chris-answers-2026-10-19/apply/proposals-<GROUP>.json` as {"<case id>": {"title": ..., "custom_preconds": ...,
"custom_steps": ..., "custom_expected": ..., "why": ["plain-words list of every change"], "questions": [...]}}, including only
the fields you changed (plus why/questions), with the full new HTML for each changed field. TestRail HTML conventions: keep the
case's existing tags and structure. Before you finish, check by script that every text inside “…” after a requirement code in your
new custom_expected exists verbatim in the v68 file, and that no old words remain outside a quote ("Lead technician updated",
"Lead technician removed", "8 seconds", "can’t be changed once a work order is Invoiced or Paid", "no new toast",
"Reassign dialog") unless v68 still uses them. Final message: one line per case (C-id, what changed), the questions, and the
check results.
