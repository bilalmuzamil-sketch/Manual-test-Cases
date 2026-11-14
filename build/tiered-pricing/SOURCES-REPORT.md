# Tiered Pricing — sources report (intake, sources half) · 14 Nov 2026

Read only: nothing was written to TestRail, Jira, Slack or Google. The design drive is the other worker's (`design-2026-11-14/`); this report covers the PRDs, the tickets and the tech plans.

## What I did

| Step | Output |
|---|---|
| Fetched both PRDs verbatim and recorded their versions | `sources/CONFLUENCE-938213378-v37-read-2026-11-14.md`, `sources/CONFLUENCE-968687617-v21-read-2026-11-14.md` |
| Swept epic SV-11692 (Rule 129) | `TICKET-LEDGER.json`, `TICKET-SWEEP.md`, `TICKET-SWEEP.json`, `sources/jira/` (54 ticket copies + the JQL snapshot) |
| Read both tech plans in full (Rule 119) | `sources/notes/NOTES-TECH-PLAN-1-Tiered-Pricing.md`, `sources/notes/NOTES-TECH-PLAN-2-Sales-by-Tier-and-Category.md`, `sources/notes/NOTES-PRD-AND-TICKETS-2026-11-14.md` |
| Requirements map (Rules 43, 113, 115) | `REQUIREMENTS-MAP.md`, `requirements.json` |
| Invariant set (Rule 96, skill 17) | `INVARIANTS.md` |
| Numbers and hazards (Rule 116) | `NUMBERS-AND-HAZARDS.md` |
| PO question drafts (skill 07 §6.0) | `PO-QUESTIONS-DRAFT.md` (not sent) |

## Sources, versions, read dates

| Source | Identifier | Version / last updated | Read | Verdict |
|---|---|---|---|---|
| Tiered Pricing PRD | Confluence 938213378 (space PM) | page version **37**, 2026-11-12 22:23 UTC, Matthew Barge, "Credits not tied to a part is no longer a reserved name (reports row removed)"; in-body "v0.17" | 2026-11-14 | CURRENT |
| Sales by Tier and Sales by Category PRD | Confluence 968687617 (space PM) | page version **21**, 2026-11-12 22:08 UTC, Matthew Barge, "Engineering tech plan answers, round 3 (Milan, Nov 12)" | 2026-11-14 | CURRENT |
| Tech plan 1 (Tiered Pricing) | `sources/TECH-PLAN-Tiered-Pricing-upload-2026-11-14.md` | dated 2026-11-11, revision 9 (2026-11-13), built on PRD page **37** | 2026-11-14 | CURRENT — matches the PRD page read today, so **no PRD diff is owed** (PROJECT-STATE said "written against v0.17 (page version 37)"; confirmed) |
| Tech plan 2 (reports) | `sources/TECH-PLAN-Sales-by-Tier-and-Sales-by-Category-upload-2026-11-14.md` | dated 2026-11-11, revision 8 (2026-11-13), built on reports PRD page **21** | 2026-11-14 | CURRENT |
| Epic and tickets | SV-11692 | 54 children; latest ticket update 2026-11-13 13:38 (UTC−5) | 2026-11-14 | CURRENT (sweep exits 1 only because no case exists yet — expected) |
| Design | claude.ai artifact A3NtAX9CHJCD87SXDTn9AE | package v1794631438-539a (design worker) | used read-only for two checks (below) | owned by the design worker |

**People (from the PRDs):** owner / PO **Matt Barge** (both PRDs); design authority **Fabian Bonjean and Mathieu Lachapelle** (Mathieu approves after Fabian); engineering **Milan Zivanovic** (tech plans); the 29 verification tickets are assigned to **Stefan Vukovic**. Status on both pages: final design approved 9 Nov 2026, tech review done, engineering questions answered 11–12 Nov, ready for engineering. There is **no feature flag** (TP S1-R7).

## Reading coverage (Rule 119)

| File | Size | Lines | Read | How |
|---|---|---|---|---|
| Tiered Pricing PRD copy | 147,457 B | 1–1,190 | **100%** | read directly in five chunks (1–239, 240–469, 470–719, 720–959, 960–1,190) |
| Reports PRD copy | 35,271 B | 1–461 | **100%** | read in full in-session (markdown) before saving; saved copy converted from ADF with the repo's `adf2md.py` |
| Tech plan 1 | 433,089 B | 1–3,626 | **100%** | 1–69 and 606–1,035, 1,629–3,626 read directly; Section 1 (70–605): 390 lines proved byte-identical to PRD text already read (script after markdown/id normalisation), the other 80 read directly; Section 10 traceability (1,036–1,628): every row parsed by script, 65 annotated rows read in full, 525 pointer-only rows listed and reviewed |
| Tech plan 2 | 221,613 B | 1–1,933 | **100%** | 1–70 and 218–405, 645–1,933 read directly; Section 1 (71–217): 69 lines proved identical to PRD text, 55 read directly; Section 10 (406–644): every row parsed, 86 annotated + 19 combined rows read in full, 124 pointer-only rows reviewed |
| 54 ticket descriptions + comments | 326,381 B (copies) | 2,493 | **100%** | each read in full (stories, acceptance criteria, verification checklists, the obsolete contracts story, 4 pre-existing tickets); 2 comments in total |
| 11 tickets linked from outside the epic | — | — | summary + status only | none is a defect (all Tasks/Stories: SV-11165, SV-2958, SV-3398, SV-3411, SV-4027, SV-4409, SV-4411, SV-4621, SV-7857, SV-9414, SV-9492); the PRD "covers" or cites them. Their descriptions were not opened — say if you want them read |

## Counts

| Item | Count |
|---|---|
| PRD requirement codes | Tiered Pricing **279** + reports **65** = 344 (match the tech plans' own totals) |
| Plus sentences without ids | 26 Error Handling sentences (21 + 5) and 12 Permissions-table rows → **382 PRD rows** |
| Rows only the tech plans add | **39** (TPX-01…TPX-40, TPX-11 folded into INV-39) |
| Rows only the tickets add or contradict | **3** (stale/typo acceptance text; no case) |
| Verdicts (placeholders) | new case 347 · forced failure, AUTOMATION: HOLD 18 · not independently testable 10 · partly testable 4 · held on a question 3 |
| Tickets under the epic | **54** (both `parent =` and `"Epic Link" =` return the same 54; 0 sub-tasks): 19 Tiered Pricing stories + the reports story SV-11718 + obsolete SV-11698 (contracts, Won't Do) + 4 pre-existing (SV-4387, SV-5744, SV-7160 bugs/task the PRD fixes; SV-9314 floor request, out of scope) + 29 engineering tasks (18 + 11 "Verify:" + SV-12682 release B) |
| Ledger plan | 23 → new cases, 28 → covered by story cases, 3 no-case (obsolete, out of scope, engineering-only), 11 linked background |
| Invariant set | **93** V1 behaviours → **79 invariants** (62 kept-and-restated, 17 silent) for the separate "must not change" folder · 13 superseded (10 changed, 3 replaced) · 1 removed (Categories-list QuickBooks column, shown by the design) · risk H 32 / M 39 / L 20 |
| Numbers | **24** figures on lines/settings + **15** report figures, each with its hazards |
| PO questions | **3** survivors (Q1 reopened paid work order tier; Q2 when a picked category moves — conditional; Q4 download header-line order — PRD vs design), **17** candidates dropped with the check that dropped them (Q3 dropped after checking the design) |

## Open points (what the sources leave open or get wrong)

1. **Reopened paid work order** — engineering gives it the customer's current tier; Product was only told (FYI); PRD S10-R14 says a work order keeps its tier → Q1.
2. **Category picker timing on the matrix page** — PRD S3-R13 "when the matrix is saved" vs engineering "when the picker closes"; no design board for it → Q2.
3. **Download header-line order** — PRD S4-R7 (Category before Priced By) vs design CSV stand-in 20.20 (Priced By before Category) → Q4; the design worker should hold the same difference in the divergence register (send one question).
4. **Stale ticket text** (no PO question; the QA lead may want the PO to fix the tickets): SV-11707 AC books revenue to the catalog category (PRD: the line's category); SV-11718 summary says the Totals tie to Sales (PRD: they don't); SV-12458 AC example lists the current category; the 18 Tiered Pricing "Verify:" tasks say "PRD page version 35" (the plan is at 37).
5. **PRD-internal wording gap** — S1-R3 names only half-cent ties as a release-day price change, while S10-R17 (typed part number), S10-N1 (cost edited to $0) and S11-R5 (cleared price) also change prices for a client who sets nothing up. Cases follow the specific requirements (they say "today" explicitly); no question.
6. **Tech plan 2 Appendix C is empty** — the signed list of invoices whose part lines don't add up (RPT S1-R7) is filled only from a staging run before merge; historical tie-out checks must exclude exactly those invoices.
7. **Imported historical invoices** without part rows — engineering to report whether any exist (tech plan 2 R-D18).
8. **For the design worker (seen while checking Q2–Q4; not investigated further):** (a) the CSV stand-in on board 20.20 lists Priced By rows as "Tier 2", "Tier 3" with no number prefix, while RPT S1-R11/S4-R3 want "2 · Fleet" style labels with tier numbers; (b) board 7.9's note puts "The Fluids 30 matrix also prices 1 other category: Oil." in an info icon by the matrix name, while TP S7-R15 says "Above the grid, a line names the other categories". Both are design-vs-PRD differences for the divergence register (Rule 130).
9. **Committing note:** my step-2 files (ledger, sweep, ticket copies) were swept into the design worker's commit e7199eac8 because the two workers share one git index; they are on the branch intact. Later commits used `git commit -- <paths>` so only my files go into my commits.

## OUTSTANDING — what I need from you

| What | Who | What it blocks | Since |
|---|---|---|---|
| Decide whether to send Q1, Q2, Q4 (after the design drive and case drafts; skill 07, Rule 66) | QA lead → PO Matt Barge | the reopened-work-order part of TP S10-R14 and TPX-01; the timing half of TP S3-R13; the line order of RPT S4-R7 | 2026-11-14 |
| Product source code access, or a developer to confirm dependencies | QA lead / engineering | the "code today" column of INVARIANTS.md stays NOT AVAILABLE | 2026-11-14 |
| Tiered Pricing QA branch name and whether its data predates the release | engineering | which invariant rows can also run on QA | 2026-11-14 |
| Appendix C list (tech plan 2) once engineering's staging run exists | engineering / Matt Barge | exact historical tie-out checks | 2026-11-14 |
| Whether to read the 11 linked background tickets' descriptions | QA lead | nothing now (none is a defect) | 2026-11-14 |

**Waiting on the PO:** no question sheet exists yet for Tiered Pricing; the three drafts above are not sent.

**Tool note:** the Atlassian connection reports it runs on a deprecated V1 endpoint (removal 2027-03-01). If it is the official Atlassian connector, remove it and add it again from Claude's connector directory; a custom connector should point at https://mcp.atlassian.com/v2/mcp.
