# Worker brief: full pass of the A/R and A/P suite against PRD v9 and Chris Ward's 16 answers (26 Oct 2026)

QA lead, 26 Oct 2026: Chris Ward answered all 16 questions; the QA lead chose **"Full pass"**. You DRAFT only: edit the authoring
files and run the gates. No writes to TestRail, Jira, Slack or Google; no commits. Work only inside `build/ar-ap-report-sorting/`.
Write outputs early and often (a container restart has happened before; files on disk survive).

## Sources (read in full, Rule 119)

- PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, **version 9** (23 Oct 2026 15:26 UTC):
  `sources/CONFLUENCE-947650561-v9-2026-10-26.md` (pandoc from HTML; raw `.html` beside it). Our cases quote **version 5**
  (`sources/CONFLUENCE-947650561-v5-2026-10-22.md`). Script diff of the requirement lines: `sources/PRD-DIFF-v5-to-v9.json` —
  15 changed (S1-R2, S1-R4, S1-R6, S1-R8, S2-R1, S2-R2, S2-R4, S2-R7, S3-R5, S3-R8, S5-R13, S7-R3, S7-R5, S8-R1, S8-R3), 4 new
  (S2-R4a Title Case headings, S3-R8b CSV headings, S5-R18a Summary vs Detail totals, S5-R18b fresh figures on reload), none removed.
  Also diff the non-requirement text yourself (What changes for existing users, User Feedback Summary, Terminology, Out of Scope,
  Key Decisions, Change Log rows of 23 Oct) — the script compared requirement lines only.
- Chris Ward's answers 1–16, verbatim: `questions-2026-10-22/chris-answers-2026-10-26.json`. Note: row 17's text (question 12)
  repeats question 14's subject; PRD v9 S5-R13 settles question 12 ("Search vendors", box only above 8 vendors). Where an answer and
  PRD v9 both speak, quote PRD v9 (it carries the answer); quote the answer only where PRD v9 is silent.
- Tech plan (21 Oct): `sources/Tech-Plan-AR-AP-2026-10-22-upload.md` — PRD v9 S1-R2 now overrides the plan's punctuation order
  (answer 16): cases follow the PRD; note where the build is expected to differ (Rule 61 wording only if a ticket exists; none known).
- Design canvas (already driven): `design-2026-10-22/`. Chris: design pictures for 13, 14, 15 "will be corrected"; the PRD wins.
- Jira stories SV-11531 … SV-11539 — answer 10: the PRD wins; stories will be brought in line.

## Rules to read first, in full

`build/LESSONS-REGISTER.md` (L-01…L-09); `build/rules/RULES-61-96.md` Rules 113, 114, 116, 117 (all amendments), 122, 130, 134,
135, 136; `build/skills/IDEAL-TEST-CASE-STANDARD.md`. Previous passes on this suite for the pattern:
`tech-plan-pass-2026-10-22/` (PASS-REPORT per-part record, make_pass_report.py), `rule136-2026-10-22/`.

## What to do

1. Point the library at PRD v9 (`authoring/ar_lib.py`: PRD file, PRD name/version/date "version 9 (23 Oct 2026, Chris Ward)", read
   date 26 Oct 2026; Chris Ward's answers as a quotable document with its own "From:" line, as the Splitting Sales Representatives
   library does with `AQ(n)`). The quote parser must take each requirement line itself (never a Change Log row — lesson of 22 Oct).
2. **Every one of the 355 cases** (Rule 122 full pass, Rule 134): check it against PRD v9 and the answers; verdict CONFIRMED / CHANGE /
   RETIRE / NEW. A case that changes is rewritten top to bottom (title, preconditions, steps, results, quotes and From lines, design
   references, notes, marker, setup recipe). Pay special attention to: Title Case headings on the A/R reports everywhere a heading
   is named (steps, results, preconditions, design cases) — "Open Balance", "Due Date", "Past Due", "Transaction Type", "Customer Full
   Name"; scrolling instead of pages (S1-R8); first click on ID / No. (answer 2); ties stay in document order both ways (answer 3);
   same-day rows by document number whatever the time (S1-R6, S2-R4); accent tie example (S1-R4); punctuation order example (S1-R2);
   the Locations line order and "All locations" (S3-R5); CSV filter rows above the headings and their order (S3-R8); CSV headings and
   "Aging Bucket" (S3-R8b); switch-location prompt buttons, order, × (S7-R3, S7-R5); vendor search box only above 8 vendors (S5-R13).
3. **New cases** for S2-R4a, S3-R8b, S5-R18a, S5-R18b where no case covers them (Rule 116 for the totals: exact amounts, both sides
   computed, with Past due Any and with a filter), in the right sections; keys continue each section's numbering.
4. **The 10 held cases** — rewrite and RELEASE (remove the hold marker, normal marker) where the answer makes them valid:
   S2-35 C715322 (q6 yes), DATA-14 C715463 and DATA-15 C715464 (q9, now S5-R18a), S1-16 C715573 (q16 plain character order),
   D-81 C715563 (q4: Title Case is what the PRD now says — rewrite it as a normal design case or fold it into the heading cases;
   say which). PROPOSE FOR DELETION (do not delete; the coordinator asks the QA lead): D-76 C715558, D-77 C715559, D-78 C715560,
   D-79 C715561, D-80 C715562 — the design versions that lost (answers 11–15). Check that each one's PRD-side twin exists and is
   correct.
5. Update `DESIGN-DIVERGENCE-REGISTER.json` rows for questions 4 and 11–15 with the outcome (Chris's ruling, date).
6. Run `python3 authoring/build.py` (0 PROBLEM lines), regenerate the setup file and outputs (`render_setup.py`, `render_outputs.py`).

## Output (in `v9-pass-2026-10-26/`)

`PASS-REPORT.md`: reading coverage; per case verdict and, for every changed case, each part CHANGED/CONFIRMED (generate it by script
from the before/after authoring output, as `tech-plan-pass-2026-10-22/make_pass_report.py` does); counts; new cases with section and
source; released cases; the deletion proposal with reasons; anything you could not settle (a new PO question only if PRD v9 and the
answers truly leave it open — skill 07 §6 first). Final message: counts (confirmed / changed / new / released / proposed for deletion),
gate output, open points.
