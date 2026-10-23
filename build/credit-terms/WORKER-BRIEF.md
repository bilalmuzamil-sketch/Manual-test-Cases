# Worker brief: draft the Credit terms suite from the PRD (23 Oct 2026)

QA lead, 23 Oct 2026: "now we have another testing suite to create the tests for. NO Technical Plan as yet which I will share with
you once I get it. Name of the new testing suite: Credit terms". Design, PRD, epic and TestRail folder were given. A second worker is
driving the design in parallel (`design-2026-10-23/`); design cases are added after both of you finish. The tech plan comes later
(a full pass then, Rule 134).

You DRAFT the whole suite as authoring files and run the gates. You do NOT write to TestRail, Jira, Slack or Google; no commits.
Work only inside `build/credit-terms/` (except `design-2026-10-23/`, which belongs to the design worker: read it, never write it).

## Facts

- Epic SV-11638. Stories SV-11670 (Story 1) … SV-11681 (Story 12), all Open, created 22 Oct 2026. Saved in full (description,
  Context, Requirements, Acceptance Criteria, UI/UX) in `sources/JIRA-SV-11638-stories-2026-10-23.md`. Their 211 requirement lines
  are word for word the PRD's; read the Context and Acceptance Criteria too (they add nothing the PRD lacks, but say so per story).
- PRD "Credit terms", Confluence 963346440, **version 3 (22 Oct 2026, "Renamed to Credit terms")**, owner and design authority
  **Chris Ward**. Saved: `sources/CONFLUENCE-963346440-v3-2026-10-23.md` (1,056 lines; read EVERY line, Rule 119). Quote from this
  file only. Requirement codes S1-R1 … S12-E3 (211 codes; S11 has no R15). Also quote, where a case needs them: §2 Feature Overview
  and Out of Scope, §4 Key Decisions (including the Permissions paragraph), §5 Terminology, §6 Assumptions, §8 User Feedback Summary
  rows, and each story's Error Handling paragraph.
- Two tables were Confluence "legacy-content" macros; the saved markdown has them converted (S2-R1 row menu table, S12-R3 log
  table). Quote the row's cells as written.
- TestRail sections already created under group 91454 (suite 1), in `sections.json`: S1 … S12 (one per story; S11 is "Release day
  and what must not change"), DATA 91467 "Counts and due dates — exact numbers", DESIGN 91468 "Design — how it looks" (leave
  DESIGN empty; the design pass fills it). If Rule 4 (read it) needs an "API" section for the Public API cases, say so in REPORT.md
  with the cases it would hold; do not invent a section id.
- Today's behaviour (baseline facts, NOT expected results): `build/sv9087-credit-term-2026-08-27/FINDINGS.md`,
  `build/sv8815-customer-credit-2026-08-20/`. Use them for labels and navigation a tester will meet (Customers page, customer card
  "Credit term", Edit Customer "Credit Terms", New Work Order, Create Invoice payment window, Charge Account, vendor screens,
  Settings > Finance > Payment Methods, Roles & Permissions). `build/APP-ACTIONS-PLAYBOOK.md` for recipes (QuickBooks, imports,
  roles). No QA branch for this epic is known yet: examples only, written "For example: …", never as if they exist.
- Project type: V2 / upgrade (credit terms exist today, twelve fixed terms). Rule 96: what the PRD does not change must not change.

## Rules and skills to read first, in full

`build/LESSONS-REGISTER.md` (all rows L-01 to L-09); `build/rules/RULES-01-20.md` Rule 4; `build/rules/RULES-61-96.md` Rules 96,
113, 114, 116, 117 (all twelve amendments), 122, 129, 130, 132, 134, 135, 136; `build/skills/IDEAL-TEST-CASE-STANDARD.md`;
`build/skills/17-REGRESSION-IMPACT-V1-TO-V2.md`; `build/skills/07-PO-QUESTIONS.md` (§6: drop any question our own sources answer).

## How to build it

Copy the newest library pattern, the A/R and A/P suite: `build/ar-ap-report-sorting/authoring/` (`ar_lib.py`, `common.py`,
`cases_*.py`, `build.py`, `render_setup.py`, `render_outputs.py`, `po_questions.py`). It already carries everything learnt up to
22 Oct: quotes pulled by requirement code and checked word for word against the saved PRD (the parser must quote the requirement
line itself, never a Change Log or table row elsewhere — lesson from 22 Oct), "From:" line per document, build line, "References
from Design" hook (leave design refs empty for now; the design pass adds them), one action per step (Rule 135), one "Step N:" result
per step, Rule 136 sizes (split when each part stays runnable, never when steps depend on each other; fold read-only checks into the
previous action's result; untested state into preconditions), placeholders `{Customer-A}`, `{Term-A}`, `{Location-A}`, `{Work-order-1}`
(Rule 117 seventh/eighth amendments), "For example:" second line, the Blocked line, AUTOMATION line last. Name the files
`authoring/ct_lib.py`, `cases_s1.py` …, keys S1-01, S12-04, DATA-01. `build.py` must print PROBLEM lines for: title > 80 chars or a
semicolon, steps ≠ results, undefined placeholder, quote not verbatim, PRD code neither covered nor listed as not testable with the
reason, AUTOMATION line missing or not last, a step with two UI actions.

## What the suite must cover

1. **Every one of the 211 requirement codes**, every Error Handling paragraph and every row of §8 User Feedback Summary (each message
   quoted word for word in a case with its exact trigger), every Key Decision that states testable behaviour, the Permissions
   paragraph (every role default it names: Admin, Parts Manager, Office User have 'Settings → Finance'; Service Manager, Senior Service
   Advisor, Sales Representative hold the customer permissions but not Finance; the others none), and §5 Terminology rules that change
   behaviour ("in use", blank term counts as COD, Counter Sale customer, capitals and spaces).
2. **Row menus (S2-R1 table):** one case per term kind × state: COD (default and not), Due on Receipt, Credit Hold, a standard Net
   term (active, inactive, default), a shop term (unused, in use by a customer / a vendor / only invoices, default, inactive), with
   every item, its order, icon, greyed state and exact hover text, and the {holders} wording (S2-R2: singular/plural, each holder
   type, "40 invoices").
3. **Exact numbers (Rule 116), section DATA:** Customers and Vendors counts (blank term under COD, "NET 30" under Net 30, Counter Sale
   never counted, every customer status counted, counts update after Move/Deactivate); tab counts; "{n} selected" with search + Select
   All/None; toast counts and singular forms; log "{n} customers" equals customers actually moved (S12-E3); due dates computed by hand
   for every S7 example and boundary: Net 1, Net 365, day 1, day 28/29/30/31 across Feb (leap and non-leap), Apr/Jun/Sep/Nov, December
   → January, invoice on the 1st and the last day of a month, DST crossings in March and November (S7-R10), a location in another time
   zone (Edmonton example), a location with no time zone (UTC), the S3-R5 blue line's example date ("today" on the location calendar),
   invoice date changed (S7-R8), vendor invoice from a delivery at another location (S7-R6a), stored dates never rewritten (S7-E2,
   S11-R13/R14), Vendor Bill Export stored date (S7-R11). Show the arithmetic in the result ("Oct 5 + 30 days = Nov 4").
4. **Release day and what must not change (S11 + Rule 96):** every S11 line; every "as today" / "exactly as today" / "unchanged"
   sentence in the PRD (vendor credit limits, New Vendor starts on COD, vendor API, AccountingHub and IBS get the due date only,
   statements / portal / A/R aging show no new term screens, Over Credit wording, Charge Account hidden for COD, payment window on every
   term, part sales show no over-credit confirmation, QuickBooks customer not updated by Edit Customer, imports lenient, Counter Sale
   always COD) as a must-not-change case; Out of Scope items as checks that the thing is NOT there where a tester can see it (no bulk
   term change on the Customers list, AccountingHub Payment Terms list untouched, standard terms not editable). New organizations
   start on Due on Receipt (S11-R12): say in the precondition how a tester gets a new organization, or HOLD with the reason.
5. **Permissions:** for each permission line, a case with a custom role that has exactly the permissions named (Settings → Finance
   only; Finance + Customers Create & Edit without AP/AR; Finance + AP/AR without Create & Edit; all three; none), plus the
   out-of-the-box roles named in the PRD. Server refusals "sent by other means": express as something a human can do (two browser
   sessions, a second user acting meanwhile, an old open window) where the PRD's own trigger allows it; otherwise
   `AUTOMATION: HOLD - <plain reason>` and say which part a manual tester cannot check.
6. **Concurrency and stale windows** (S2-E2, S3-E2, S4-E1, S5-E1, S5 Error Handling, S4 Error Handling): two browser sessions as two
   users — this is runnable by hand.
7. **QuickBooks (S8):** with the QuickBooks Online sandbox connected (playbook), what a tester sees in QuickBooks (term created by
   name, standard vs date-driven, due date matches), QB Unexported report on a refusal, nothing sent on deactivate/edit/delete/release.
8. **Imports and Public API (S10):** contacts import through the UI (blank cell, "net 10"/"NET10", unknown text, deactivated name,
   COD with a limit, update with blank cell, vendors blank → COD); Public API cases need an API key and a request tool — mark them
   `AUTOMATION: READY` only if the steps are fully given; say plainly in the case that the tester sends a request.
9. **Things a tester cannot force** (list load error, log load error, a move failing partway, a server refusing a 32-character name
   when the field stops at 31): keep the case, write the exact expected text, mark `AUTOMATION: HOLD - <reason>` naming what a manual
   tester cannot do.
10. **Story 12 log:** one case per event type with the exact Event and Details text; search; newest first; empty state; no row for
    cancel / refused / no-change actions; deleted term's rows stay; rows not editable; Date and Time on the user's location calendar.

## Output

- `authoring/` files and a passing `python3 authoring/build.py` (0 PROBLEM lines), writing `authoring/proposals.json` (one entry per
  case: section key, title, refs, the three HTML fields, automation marker, held flag).
- `CREDIT-TERMS-SETUP-FILE.md` (Rule 117 ninth amendment: one setup file for the feature: slots, accounts and custom roles, data
  recipes per case, placeholder values, traceability, open questions), generated by `authoring/render_setup.py`.
- `TICKET-LEDGER.json` (a row per ticket of the epic: NEW-CASES with case keys / COVERED / NO-CASE with the reason) and
  `TICKET-SWEEP.json` (project, epic SV-11638, stories, prd_page 963346440, prd_version_handled 3).
- `PO-QUESTIONS-DRAFT.md`: every point the PRD does not settle (ambiguous, contradicting, not testable as written — for example the
  missing S11-R15), one plain question each with (a)/(b)/(c) options, for Chris Ward, after the skill 07 §6 check (list what you
  dropped and which source answered it). Cases that depend on an open question are HELD (`AUTOMATION: HOLD - waiting on the PO
  (question N)`), never guessed. Do not send anything.
- `REPORT.md`: counts per section, the 211-code coverage table (code → case keys, or "not testable: reason"), held cases and why,
  story-vs-PRD differences (none expected; confirm), reading coverage (file, size, line ranges, 100% read).
- Final message: counts per section, held cases, number of questions, gate output, anything you could not do.
