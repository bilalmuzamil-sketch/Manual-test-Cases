# Worker brief: 8 density cases become Tech View only, in the standard layout (20 Oct 2026)

QA lead, 20 Oct 2026, on the 8 cases that test density in both Tech View and Board View: "I will go with your recommendation"
(remove the Board View parts so they test Tech View only, as PRD v71 says). You DRAFT. No writes to TestRail, Jira, Slack or Google;
no commits; write only inside `build/wo-board-tech-view/density-tech-view-only-2026-10-20/`.

## Cases (full bodies already saved here as `C<id>-before.json`; read each in full)

C96987, C96988 (Automated), C96989 (Automated), C96990, C96991, C96992 (Automated), C590110 (design), C590128 (design).

## Sources (read in full what you rely on)

- PRD v71: `../prd-v71-2026-10-20/CONFLUENCE-845185030-v71-2026-10-20.md`. What changed v68→v71: `../prd-v71-2026-10-20/PRD-DIFF-v68-to-v71.diff`
  (read all 52 lines). Key: S3-R11, S6-R1, S6-R3, S6-E1 (Board View has no Density control in this release; Density is Tech View only;
  Board View cards keep their current spacing; Card size is a fast follow, SV-11581), and "Fields to display" is now "Column Selection".
- Rules: `build/rules/RULES-61-96.md` Rules 113, 114, 117 (all amendments; ninth to twelfth are the current layout), 41, 61, 126;
  `build/skills/IDEAL-TEST-CASE-STANDARD.md`.
- Layout to copy exactly: `../c97022-standard-2026-10-20/build.py` and `../standard-and-v71-2026-10-20/build.py` (their render(): setup-file
  link, "Preconditions" with {placeholders} and a "For example:" second line, the Blocked line last; one action per step; one "Step N:"
  result per step; "Exact quotes from the source (for reproducibility)" with a "From:" line per document, PRD version 71 (20 Oct 2026,
  Chris Ward), read 20 Oct 2026, epic SV-10043, story SV-10049 (Story 6, Density in Tech View and Board View) and any other story used;
  "Not yet checked against a build in this wording."; for the two design cases a "References from Design" block (keep their existing
  design link, boards, attached picture names and the design's own quoted words, unchanged); AUTOMATION line last, the same value the case
  has now unless it is not one of READY / READY - EXPECT FAIL (SV-x) / HOLD - reason).
- Setup file to match: `../v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md` (its shared procedures P-SIGNIN, P-TECH, P-CUSTOMER,
  P-WO, P-START; read sections 1 to 4 and one case recipe such as SETUP-C682445).

## What each case becomes

1. Keep what the case tests, for Tech View only. Remove every Board View density step and result. Where a step used Board View only to
   reach something that also exists in Tech View, do it in Tech View. Do not add new behaviour.
2. Where the case's point was "density applies to Board View cards" (C96992) or "one choice shared by both views" (C96989), it now checks
   what v71 says instead: Board View has no density button and its cards keep their spacing (S6-E1, S3-R11), Density belongs to Tech View
   only (S6-R3). Keep the rest of the case (saved per user across logout, browsers, locations, S6-R7) where it was tested.
3. Preserve every other check the case had (Rule 41: re-check the whole case against v71; quotes from v71, word for word; a quote whose
   code text changed in v71 takes the v71 text). Keep the case's existing example names (ZZAUTOTEST F1 Density …, Esther Howard, …) as
   "For example:" lines. Keep Chris Ward's answer 27 for C96990 as its own "From:" document (question sheet
   1gBGmNB4B1bRrD2ZJvBn1tuvbfxFPjcsKddz_I5H3CvU, answered 15 Oct 2026) if the case still relies on it.
4. Titles: keep unless the change makes them wrong; then plain words, at most 80 characters, no semicolons; design cases keep "Design: ".
5. Old "Setup" blocks, "Needs:" lines, build names and "Dev-layer test" notes leave the preconditions; a dev-layer note may stay as one
   plain sentence after the results.

## Output

- `proposals.json`: {"<id>": {"title", "refs", "custom_preconds", "custom_steps", "custom_expected", "why": [plain list of what changed]}}.
- `recipes.md`: one setup-file recipe per case in the setup file's own format (SETUP-C<id>), using its shared procedures.
- Check by script before you finish: every quote verbatim in v71 (or the answer); steps count = "Step N:" results; placeholders used are
  defined in the preconditions; one AUTOMATION line, last; titles ≤ 80; no "Board View" density step left; no "Fields to display" outside
  quotes. Final message: one line per case (C-id, title, steps before → after, AUTOMATION line) and the check results.
