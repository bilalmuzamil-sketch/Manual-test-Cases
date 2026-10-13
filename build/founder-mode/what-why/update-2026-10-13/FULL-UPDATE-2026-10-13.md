# What/Why — full update, 13 Oct 2026 (Rule 122 full pass)

**Order (QA lead, 13 Oct):** "See if the existing test cases need to be updated / new needs to be created / existing need to be modified — do them", and "Make sure you do NOT skip running the design thoroughly as needed."
**Folder:** TestRail Founder Mode → What/Why, section [20437](https://shopview.testrail.io/index.php?/suites/view/1&group_id=20437). **Epic:** SV-11257 (split out of SV-9667).

## Sources (all read in full) — `../SOURCE-CHECK-2026-10-13.md`
| Source | State |
|---|---|
| PRD Confluence 845348896 | edited 13 Oct (epic link only); 40 codes, none added, removed or reworded since 30 Sep; re-checked identical immediately before the writes |
| PRD comments | one tech-planning thread (23 Sep) with Chris Ward's answers; none newer |
| Jira | epic SV-11257 (TESTING QA): stories SV-10130–SV-10133 and verify tasks SV-10390–SV-10393. Story texts lag the PRD in places (S1-R6 wording, S4-R1 withdrawn, S3-R7 no byte limit, S3-R6a "off by default") — the PRD wins |
| Tech plan | "Title and Description — Technical Implementation Plan" (shared by the QA lead 13 Oct): `sources/tech-plan-Title-and-Description-2026-10-13.md`, read in full |
| Design | canvas Pz1Q6BfvreYFpQwVQZPTE6, 8 files — `DESIGN-COVERAGE-2026-10-13.md` |
| QA build | the epic names sv10130.qa.shopview.com (qb1.qa.shopview.com for QuickBooks steps), PR #3553. Not signed into; build verification is a separate session |

## What was written (every write read back and matched; `applied/apply-log.jsonl`)
- **19 cases rewritten in full** in the current layout (Rule 117 with all eight amendments): link "Setup (manual QA tester and Claude session)", plain one-sentence preconditions with {Name-A} placeholders and numbered {Line-1}/{Work-order-1}, every example "(for example …)", Steps actions only, "Step N:" results, Source, verbatim quotes, marker `AUTOMATION: HOLD - not yet build-verified on the What/Why QA build`.
- **18 new cases, C549075–C549092**, added first so each setup doc carries its case number, then linked: Edit Line labels, emptied Title, phone width, lines saved before the change, ShopCoach prompts and report text, no description, "Tech story missing.", accented over-long line, over-long line still syncs, imported invoice not synced, old line in the new form, reversed and re-invoiced invoice, report permission, Invoices import template header, mixed old/new column names, swapped columns, unknown column.
- **37 new setup docs**, one per case (public folder). The 10 setup docs of 9 Oct are replaced: list for deleting by hand `docs/OLD-DOCS-TO-DELETE.md`.
- **Coverage:** 40/40 codes (`COVERAGE-2026-10-13.md`). **Retired:** none. **Nobody else had edited any What/Why case.**
- **Test runs:** no dedicated What/Why run (run 495 is Part Sales + Notifications, Vladimir's). All 37 cases are in the newest open Nightly run, 538.

## Runnability notes
- Four cases need a live QuickBooks Online sandbox connection on the QuickBooks host (C154715, C549084, C549085, C549087); C154721 and C549087 need a QuickBooks invoice synced before the change; C549086 and C549076 need work orders created before the change. Each says so and is marked Blocked if that data does not exist.
- Require Tech Story is organisation-wide: cases that set it on and off cannot run in parallel on one build; each setup doc records and restores it.

## Questions for Product (no quotable source) — send AFTER build verification (Rule 66)
1. Is a tech story that is only spaces treated as absent? (tech plan FR-009/D3 say yes; PRD names only empty and "Tech story missing.")
2. Is the joined text trimmed at its end (tech plan), although S3-R8 says nothing is trimmed?
3. Labels now always sit above their fields (tech plan D5, SV-10391) — is that within S1-R7 "nothing else changes"?
4. Can shops rely on old import headers matching regardless of case (tech plan D4)?
5. What does the Customer Invoice report show, after release, for an invoice created before the change?
6. When exactly does the line window write "Tech story missing."?
7. The Title message now shows under the field (SV-10130 developer) — is that a validation change under S1-R7?
8. Is Require Tech Story off by default (Jira, design note and tech plan say so; the PRD does not)?
Design note: New Line board shows "Title *"; the SV-10130 developer says no asterisk ships; cases follow the PRD's "Title".
