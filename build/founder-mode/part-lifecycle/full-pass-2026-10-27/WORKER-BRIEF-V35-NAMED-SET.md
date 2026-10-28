# Worker brief: Parts Lifecycle named-set update to PRD v35 (28 Oct 2026)

QA lead, 28 Oct 2026: "Named set" (Rule 122 amendment: he chose a named set, not a full pass). You update the case
library only. **You do NOT write to TestRail, Jira, Slack or any Google file. You do NOT commit.** The coordinator
reviews your work, runs `authoring/apply.py`, reads back and commits.

## Read first, in full (Rule 119; state your reading coverage at the end)
1. `full-pass-2026-10-27/WORKER-BRIEF.md` — the 27 Oct full-pass brief: target case pattern, C-id keeping, gates,
   and the TOKEN DISCIPLINE CHARTER (Rule 95), which binds you. Everything there still applies unless this file says otherwise.
2. The new page: `sources/CONFLUENCE-829227015-2026-10-28.md` (Confluence 829227015, **version 35**, edited
   27 Oct 2026 by Chris Ward). Read its Change Log rows for 2026-10-27 (v34 and v35) first, then every changed
   requirement in full.
3. Chris's answers to Doc questions 13-27 (27 Oct 2026). Read the question Doc with the Drive tool
   (ToolSearch "select:mcp__Google_Drive__read_file_content", fileId `1pkAPGqWVTdtYorNN4SVNl9HkHxuuB9czro_y2DbUeEM`,
   includeComments true). Save the section from "New questions, 27 October 2026" to the end, word for word, as
   `full-pass-2026-10-27/ANSWERS-13-27-2026-10-27.md` (read only; never edit the Doc).
4. `full-pass-2026-10-27/QUESTIONS.json` (our ids Q1-Q16 = Doc 13-27; `held` lists the cases held on each).
5. The library: `authoring/pllib.py`, `pc_common.py`, `common.py`, the `cases_*.py` modules you touch, `build.py`,
   `gate_selftest.py`; and `/home/user/Manual-test-Cases/build/rules/RULES-61-96.md` Rules 113, 114, 117 (14th and
   15th amendments), 130, 134-138.

## The named set (all of it; nothing outside it changes)
A. **21 cases whose quoted page sentence is no longer word-for-word in v35.** Re-copy the quote verbatim from v35,
   then rewrite each case top to bottom (Rule 134) so steps and results match the new sentence:
   D-49, S10-01, S10-19, S10-22, S10-29, S11-02, S11-18, S12-03, S12-06, S12-10, S13-03b, S13-45, S2-19, S5-05,
   S5-16, S5-17, S5-17b, S5-18, S9-28, S9-41, S9-42.
B. **10 cases held on the answered questions.** Release each one (standard marker), rewritten to the answer and the
   v35 text: S5-18, S13-03b, S10-22, S10-29 (Q1/Doc 13); S5-01 (Q2/Doc 14); S12-06 (Q3/Doc 15); S7-25 (Q4/Doc 16);
   D-49 (Q8/Doc 19); D-33 (Q10/Doc 21); S7-17 (Q12/Doc 23).
   - Doc 14 says no screen can make a part with no bin location; only a developer's direct request can. If S5-01 then
     cannot be set up by a manual tester, do NOT leave it as a manual case: record it in a file
     `full-pass-2026-10-27/NO-MANUAL-PROPOSAL.json` with the reason, and keep its body unchanged. The coordinator asks the QA lead.
   - Doc 13: a core's Part History page has no on-screen link. If the tester cannot find the address from the screen,
     treat the affected case the same way (proposal file, body unchanged).
C. **New cases for the new requirements** (new keys in the right story module; each one runnable by hand, in the pattern):
   S9-R18a (global search never lists a core), S11-E5 (Delete in "Edit Library Part" updates only after a reload),
   S7-N11 (the import adds tracked parts; the "name" column is the description), S12-R11a (only the messages it names
   are reachable on screen; the others are not a manual case), S13-R19e (received work order and part sale lines keep
   their number; a part request not yet received takes the new number), S10-R11a (the close X acts as Cancel; Esc and
   clicking outside do not close the confirmation). Check first whether an existing case already covers a code, and
   extend that case instead of duplicating it.
D. **Other answers that change wording in cases already in the set, or in any case that says the old thing:**
   - Doc 17: the path is Settings → Parts → Bin Locations, and Roles & Permissions is under Settings. Search the library
     for every "Administration → Bin Locations" / "Administration → Roles" in tester text and correct it (each such
     case joins the set and is rewritten top to bottom).
   - Doc 18: the Inventory list badge counts only bins above zero ("5 Available" for +5 and -2). Check the cases about it.
   - Doc 22 / v35 S9-N3a: the S9-N3 access error is reached only by typing the Create Return page address, with a role
     that has Vendor Order Management → View only and none of the other settings that give part search access.
   - Doc 27: a role change logs the user out on their next action with "Session expired, please log in again."; for
     S8-N1 to S8-N3 the role must lack Part Library & Inventory Create & Edit, Vendor Order Management Create & Edit,
     Part Sales Delete, Settings Parts and See financial data. Check the S8 cases' role preconditions.
   List every extra case you add to the set in your report, with the reason.

## Rules for each case you touch
- The "From:" line of the page quote reads version 35, edited 27 Oct 2026, read 28 Oct 2026. A PO answer quoted as a
  source has its own "From:" line (Doc link, question number, 27 Oct 2026, Chris Ward).
- Keep the C-id (update in place). Splits only under Rule 136.
- Cases NOT in the set are not touched at all, not even their version stamp.
- Design references: keep or correct the "References from Design" block; Doc 20 confirms board 7.2's note is out of date.

## Gates before you finish
`python3 authoring/build.py` (PROBLEM lines: 0), `python3 authoring/gate_selftest.py` (0),
`python3 /home/user/Manual-test-Cases/build/testing-tools/tester_readiness_check.py /home/user/Manual-test-Cases/build/founder-mode/part-lifecycle --sample 5`
(hard problems 0; read the sample and every "does not / never" line in a case you touched), and a script proving every page
quote in the cases you touched is word-for-word in v35. Then `python3 authoring/apply.py` (dry run, no --apply) and
report its plan (UPDATE n / ADD n / held n).

## Final message (under 300 words)
The set you changed (keys, with C-ids where they exist), new keys, any NO-MANUAL proposals with reasons, the gate
results, the dry-run plan, and your reading coverage.
