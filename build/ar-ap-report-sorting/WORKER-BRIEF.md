# Worker brief: write the A/R and A/P Report Sorting, Export and Location Filter suite (22 Oct 2026)

QA lead, 22 Oct 2026: "We have a new Testing suite called "A/R and A/P Report Sorting, Export and Location Filter" ... Please create
the test cases for now ... the test cases for DESIGN should from now onward include everything learning from the mistakes, in the past
we have missed alot for the design cases and did not create cases which were obvious in design. So now and going forward we MUST not
repeat the mistakes." Design access and the tech plan are not available yet; a full pass follows when they arrive.

You DRAFT the whole suite as authoring files and run the gates. You do NOT write to TestRail, Jira, Slack or Google; no commits.
Work only inside `build/ar-ap-report-sorting/`.

## Facts

- Epic SV-11315 (25 tickets; saved `sources/JIRA-EPIC-SV-11315-2026-10-22.json`). Stories: SV-11531 (Story 1) … SV-11539 (Story 9).
  Origin tickets SV-7192, SV-10798. Out of scope (PRD "Other improvements"): SV-11441 to SV-11447. Developer verify tasks SV-11595 to SV-11600.
- PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, **version 5 (21 Oct 2026, Chris Ward)**. PO and
  design authority: **Chris Ward**. Fetch it yourself (Atlassian getConfluenceContent, markdown, detail full; cloudId
  19fdd96d-a135-46c4-83e7-d2cc218a4e63) and save it to `sources/CONFLUENCE-947650561-v5-2026-10-22.md`. Read it in full (Rule 119).
- Read in full (read only) every story SV-11531 to SV-11539 (getJiraIssue, view full: description and acceptance criteria), the origin
  tickets SV-7192 and SV-10798, and SV-11595 to SV-11600; note any sentence that differs from the PRD (the PRD wins, but list it).
- Design: https://claude.ai/artifact/BRYCdjKwGRSgGPC9xxkgF4 — not readable from here. Tech plan: not available. Do not try to guess
  what the design shows.
- TestRail sections already created (group 90418), in `sections.json`: S1…S9 (one per story), DATA "Totals and counts — exact amounts",
  REL "Release day and what must not change", DESIGN "Design — how it looks".
- Environment (for examples only): staging, Admin, locations "Staging Heavy Duty - 9919" and "Staging Lethbridge - 4310"; reports under
  Reports > Finance. Example records are written "For example: …", never as if they exist.

## Rules to read first, in full

`build/LESSONS-REGISTER.md` (all rows); `build/rules/RULES-61-96.md` Rules 113, 114, 116, 117 (all twelve amendments: two-audience
preconditions with {placeholders} and a "For example:" second line, one action per step, one "Step N:" result per step, "Exact quotes
from the source (for reproducibility)" with a "From:" line per document, build line, "References from Design" block, AUTOMATION line
last, design titles start "Design: "), 122, 126, 130; Rule 96 and `build/skills/17-REGRESSION-IMPACT-V1-TO-V2.md` (this is an upgrade
of six existing reports: what the PRD does not change must not change); `build/skills/21-DESIGN-DRIVE-PROTOCOL.md` §4b, §6b, §6c;
`build/skills/IDEAL-TEST-CASE-STANDARD.md`.

## How to build it

Copy the pattern of the Splitting Sales Representatives library (`build/splitting-sales-reps/authoring/ssr_lib.py`, `common.py`,
`cases_*.py`, `build.py`, `render_setup.py`): a `C(...)` case list, quotes pulled by requirement code from the saved PRD and checked word
for word, rendering to TestRail HTML, and a build that prints PROBLEM lines (title ≤ 80, no semicolons, steps = results, placeholders
defined, quotes verbatim, every PRD code covered or listed as not testable with the reason, one AUTOMATION line last). Name it
`authoring/ar_lib.py` etc. Keys like S1-01, DATA-01, REL-01, D-01.

## What the suite must cover

1. **Every PRD requirement, negative case, edge case, the error handling paragraph and every row of the User Feedback Summary** (Stories
   1 to 9), on every report the sentence names (six reports: A/R Summary, A/R Detail, A/R Collection, A/P Summary, A/P Detail, A/P
   Unpaid Invoices). Where a rule names several reports, cover each report (one case may cover several reports only if the steps stay
   short; otherwise one case per report). Sorting: every column of every report (S2-R1), first click / second / third, blanks, ties,
   name order rules S1-R2 to S1-R4 with names that prove them ("10 Trucking" / "2 Trucking", "A-1 Towing" / "a1 towing", "Émile's").
2. **Exact numbers (Rule 116):** Totals row equals the rows left by every filter combination (S5-R18), on screen, PDF and CSV; Summary
   rows at chosen locations (S5-R8); Past due on Summaries keeps full balances (S5-R17); credits always kept (S5-R16); the A/R Summary
   Totals change for overpaid invoices; paging never repeats or skips (S1-R8); export limits by count (S3-R9, S3-N1, S3-N2: exactly
   2,000 / 2,001 and 50,000 / 50,001; mark AUTOMATION: HOLD with a plain reason where a manual tester cannot reach the row count).
3. **Release day and what must not change (Rule 96):** every line of "What changes for existing users", "Out of Scope" (as must-not-change
   checks where testable) and the unchanged statements (permissions, organization-wide numbers, money display, column names other than
   Location, the top-right location switcher).
4. **Permissions:** every permission the PRD names (Reports → Page Access; Invoicing & Payments → View with Work Orders → View or Part
   Sales → View; Vendor Order Management → View or Create & Edit; Customers → View; View and Manage AP/AR Data; See Financial Data does
   not hide amounts), with the custom roles named in the preconditions.
5. **Design — how it looks, from the PRD's own look sentences now** (the design file comes later): every look rule in the PRD (native
   filter row and chip order, chip labels and icons, chevron button and tooltip position, pinned group rows, pinned bold headline column,
   link style in light and dark theme, info icon placement and tooltips, title row on one line at 1440 px, every column visible at
   1440 px with the wrapping rules, Totals row style, progress bar, empty and error states, PDF heading on one line, "91 And Over"),
   one "looks as described" case per screen and state for all six reports, at 1440 and 1536 px, light and dark theme, no overlap.
   Titles start "Design: ". Apply every row of the lessons register (L-01 to L-04: look not only words; list every menu, dialog,
   tooltip, toast and empty state with its rows and buttons; letter case compared by hand). Mark each with
   `AUTOMATION: HOLD - not yet build-verified (no build yet)` unless something else applies.
6. **Every message** in the PRD quoted word for word in a case, with the exact trigger.

## Output

- `authoring/` files and a passing `python3 authoring/build.py` (no PROBLEM line), writing `authoring/proposals.json` (one entry per case
  with section key, title, refs, the three HTML fields).
- `AR-AP-SETUP-FILE.md` (Rule 117 ninth amendment: slots, accounts and custom roles, data recipes per case, placeholder values,
  traceability, open questions), generated by `authoring/render_setup.py`.
- `TICKET-LEDGER.json` (a row per ticket of the epic: NEW-CASES with the case keys / COVERED / NO-CASE with the reason) and
  `TICKET-SWEEP.json` (project, epic, stories, prd_page 947650561, prd_version_handled 5).
- `PO-QUESTIONS-DRAFT.md`: every point the PRD does not settle (ambiguous, contradicting, or not testable as written), one plain question
  each with options, for Chris Ward. Do not send anything.
- `REPORT.md`: counts per section, the PRD-code coverage table, what is held and why, the Jira-vs-PRD differences, reading coverage.
