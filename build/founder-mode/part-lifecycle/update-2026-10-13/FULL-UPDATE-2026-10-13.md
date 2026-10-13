# Part Lifecycle — full update, 13 Oct 2026 (Rule 122 full pass)

**Trigger and approval.** Chris Ward answered the 13 product questions on 9 Oct and edited the PRD; the QA lead said "Wait" on 9 Oct, then **"Yes"** on 13 Oct to updating the Part Lifecycle cases. "Yes" (13 Oct) also moved the two Critical Reorder cases to "Retire OR retest".
**Folder:** TestRail Founder Mode → Part Lifecycle, section [20439](https://shopview.testrail.io/index.php?/suites/view/1&group_id=20439).

## Sources (all read in full, Rule 119) — `../SOURCE-CHECK-2026-10-13.md`
| Source | Version |
|---|---|
| PRD, Confluence 829227015 | **v27**, last modified 9 Oct 2026 (Status row still "Ready for dev - 2026-10-07"); re-checked unchanged immediately before the writes (Rule 59). Changes from v26: `PRD-CHANGES.md` (4 added: S7-N5c, S9-R10b, S10-R12a, S11-E4; 2 removed: S5-R14, S9-E12; 3 reworded: S7-N5a, S13-R4a, S13-R13; one new Accounting bullet) |
| Product answers, 9 Oct | `../po-answers-2026-10-09/ANSWERS-Chris-Ward-2026-10-09.md` |
| QA lead's set-up answers, 9 Oct | `../po-answers-2026-10-09/ANSWERS-QA-lead-test-setup-2026-10-09.md` (negative bin, no-bin import, global search on, deleted part keeps its entry, where cores show) |
| PRD comments | no new comment since 8 Oct |
| Jira | 13 of 24 issues changed since 8 Oct: the 11 stories now carry PRD v27's requirement lines word for word; epic Ready for Development; SV-10380 adds "figures saved before release keep their values". SV-11041 still lists the removed S5-R14/S9-E12 |
| Tech plan | 7 Oct 2026 (the latest we hold) |
| Design | 13 Oct copy: 1 board added (4.0), 6 changed, 10 notes changed — `../sources/design-2026-10-13-artifact/DESIGN-CHANGES-2026-10-13.md`. Five of the six 8 Oct design-vs-PRD questions are resolved by it |

## What was written (every write read back and matched; `applied/apply-log.jsonl`)
- **257 cases rewritten in full** to the current standard (Rule 117 with all eight 8 Oct amendments): the Preconditions field holds the link "Setup (manual QA tester and Claude session)" and plain one-sentence preconditions with {Name-A} placeholders, numbered {Line-1}/{Work-order-1}, every example "(for example …)"; no Setup block in TestRail; Steps are actions only; every result starts "Step N:"; Source; verbatim PRD v27 quotes; the marker.
- **7 new cases:** C540877 (purchase order receipt creates the Part Library entry, S11-R6), C540878 and C540879 (SV-10380: after release a bin below zero counts; before release saved figures keep their values), C540880 (S7-N5c own-number case/punctuation change saves), C540881 (S13-R4a Vendor always shows), C540882 (S9-R4/S9-R7 no invoice-line or scan lookup offers an inactive part), C540883 (S10-R12a cores not counted).
- **264 new setup docs**, one per case, public, in the Drive folder "Setup for Claude session (test case setup docs)" (Part 1 manual QA tester, Part 2 Claude session; flat paragraphs, no nested lists). The 7 new cases' first docs were recreated with the case number and the first copies trashed (`docs/trash-log.jsonl`). A sample doc was read back from Drive and matched its source paragraph for paragraph.
- **Moved to "Retire OR retest" (54275), content unchanged:** C425759 and C425639 (Critical Reorder; S9-E12 and S5-R14 removed; Product answer 13). C154761 stays there, proposed for retirement (its footer control left the PRD). The other seven cases in 54275 were rewritten and stay there. The folder holds 10 cases.
- **Coverage:** 290 of 290 PRD v27 requirement codes quoted by a case (`COVERAGE-2026-10-13.md`). S9-E9 and S10-R25a are public-API only and sit with C425755 / C425776 in 54275.
- **Marker on every case:** `AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified`.
- **Nobody else had edited any Part Lifecycle case** (all 260 last edited by us before the update), so no permission was needed (Rule 123).

## Design gates (Rule 124 as amended 9 Oct) — `DESIGN-COVERAGE-2026-10-13.md`
Every file read; one-click sweep 64/64 hovered and clicked, 0 failed; canvas drive 7 pages, 51/51 boards played and exported, 0 errors; text inventory 663 texts, 0 unclassified, 0 CASE-NEEDED; label check 1,414 labels, the 39 misses are all example data.

## Test runs (Rule 123)
No dedicated Part Lifecycle run exists. Part Lifecycle cases appear in the daily "Nightly Test Run" runs (include all cases, created by Vladimir Tomovic). The two newest open ones, run 538 (12 Oct) and run 537 (9 Oct), each hold all 267 Part Lifecycle cases (257 updated, 7 new, 3 in Retire OR retest): checked 13 Oct.

## Questions with no quotable source (writers' notes) — for the PO sheet AFTER build verification (Rule 66)
Full text in the `notes` of `proposals-A/B/C/D.json`. In short:
1. S11-E4 with S12-R4: does "Failed to save library part." show together with "Part Library entry not found."?
2. S12-R14: which lookup results count as "special-order lookup results"?
3. Parts CSV import: is a tracked part with no bin refused or given a default bin; does the import run the S7-N3 duplicate check; is it "another route" for S7-N6?
4. S1-R9: does Export follow the search box and filters?
5. S5-R8: how does an untracked part get bins with none marked Default?
6. Where does a tester see a core's tracking state, its own number and description, or its own row (S5-R9, S13-R15/R18, S10-R13a)?
7. Does Dashboard v1 show an inventory value figure, and where (C425659, C425758)?
8. S10-R8: "use them" for one part on reactivation — intended?
9. S9-R10: order and separator of part numbers in the canned-job warning.
10. Which permissions let a role create a vendor return without Part Library & Inventory → View?
11. S7-R6d: no on-screen way to make an entry that points at a deleted manufacturer.
Design/story notes kept for build verification: board 7.2 shows no Delete on the entry page (S11-R3 says delete is there); board 2.6's image still shows narrowed columns (note says the build must be fixed); board 5.5 shows a "Manufacturer updated | - | -" history entry; SV-11041 still lists S5-R14 and S9-E12.

## Display check
`render-0/1/2.log` (257 updated) and `render-new.log` (7 new) — results recorded in PROJECT-STATE when finished.
