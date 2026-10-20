# Worker brief: draft the release copies of the mixed Fast-follow cases (20 Oct 2026)

The QA lead approved (20 Oct 2026, "1. Yes") 16 release copies of cases now in the Fast-follow folder. You DRAFT them. You do NOT
write to TestRail, Jira, Slack or any external system, do not commit or push, and write only your own output file.

## Inputs (all in `build/wo-board-tech-view/`)

- Originals (unchanged bodies, with their original `section_id`): `fast-follow-2026-10-20/before/wo-cases-2026-10-20.json`.
  Read only your cases from it, by script, but read each of your cases in full.
- What each copy keeps and leaves out: `fast-follow-2026-10-20/COPIES-PROPOSAL.md` (approved). Follow it exactly.
- PRD now: `prd-v68-2026-10-19/CONFLUENCE-845185030-v68-2026-10-19.md` (Confluence 845185030, version 68). Every quote stays
  word for word as it is in the original (they were checked against v68 on 19 Oct 2026).
- Why: Chris Ward (product owner), Slack, 20 Oct 2026, https://shopview.slack.com/archives/C0C41RV3T3L/p1792455057423139 —
  SV-11522 and SV-11524 (the new lead-change message with Undo, the one-click lead technician dialog without an Unassigned row,
  the "Assign lead technician" menu wording) are fast-follows, worked on after the release.
- Rules (read them): `build/rules/RULES-61-96.md` Rules 113 (quotes verbatim, never changed), 114 (runnable by a manual tester),
  117 with its amendments (case shape; title rules), 41 (re-check the whole case).

## What each copy is

1. Same preconditions as the original (drop a record only if no remaining step uses it; keep the setup-file link if there is one).
2. Steps: the original's steps without the ones the proposal leaves out. Where the original reaches a lead change through the
   lead technician dialog (More actions > Reassign / Assign lead technician), use a drag of the card or row, or the work order
   page's Lead Technician field, as the proposal says. One action per step, renumbered.
3. Expected results: one "Step N:" result per step. Keep every result the copy still checks, word for word where possible. At a
   lead change, do NOT state any message wording, Undo button, close time or "no message" (that is the fast-follow part): say only
   what else the step shows (the card moves, the question opens, the lead reads X…). Where the original's result for a reorder
   says no message appears (C97008's reordering), keep it: that is not part of SV-11522/SV-11524.
4. Remove the "Known problem (SV-11522 … SV-11524 …)" paragraph. Keep any other known-problem paragraph only if it still applies.
5. Quotes: keep only the quotes that back a result the copy still has, unchanged; remove quotes that back only removed results
   (e.g. S4-R5, S4-R16, S4-R32, S3-R14, S4-R13 if nothing left uses them). Keep the case's own layout.
6. Add one plain paragraph right after the expected results:
   "Release copy of C<original id> (in the Fast-follow folder). It leaves out <what> , which waits on SV-11522 / SV-11524: Chris Ward
   (product owner) made these fast-follows for after the release (Slack, 20 Oct 2026, https://shopview.slack.com/archives/C0C41RV3T3L/p1792455057423139)."
7. Build line: "Not yet checked against a build in this wording." (replace any "Last checked …" line).
8. AUTOMATION line: exactly one, last: "AUTOMATION: READY".
9. Title: what the copy tests, in the screen's own words, easy for a lay tester, ending with " (release)", at most 80 characters
   in total, no semicolons. It must differ from the original's title. A design case (title starts "Design: ") keeps "Design: " at
   the start.

## Output

Write `fast-follow-2026-10-20/copies-<GROUP>.json` as {"<original id>": {"section_id": <the original's section_id>, "title": ...,
"custom_preconds": ..., "custom_steps": ..., "custom_expected": ..., "refs": <the original's refs>, "why": ["plain list of what was
left out or changed"]}} with the full HTML of every field. Before you finish, check by script: every quoted text after a
requirement code is in the v68 file verbatim; no "Lead technician updated", "assigned to", "Undo", "moved to Unassigned",
"Assign lead technician", "Reassign lead technician" dialog step or "seconds" remains outside a quote (unless it is about something
else, say so); one "Step N:" result per step; title ≤ 80 and ends " (release)"; one AUTOMATION line, last. Final message: one line
per copy (original C-id, new title, steps before → after) and the check results.
