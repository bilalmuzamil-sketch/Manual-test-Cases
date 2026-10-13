# Part Lifecycle: source check, 13 Oct 2026 (against the 8 Oct 2026 copies)

All sources were read only. Nothing was written to Confluence, Jira or TestRail.

## 1. PRD: Confluence 829227015 "Parts Lifecycle Update"

| | 8 Oct copy | 13 Oct copy |
|---|---|---|
| File | `sources/CONFLUENCE-829227015-PartLifecycle-v26-2026-10-08.md` | `sources/CONFLUENCE-829227015-PartLifecycle-2026-10-13.md` |
| Confluence version | v26 | **v27**. This is the real Confluence version number, read from `mcp__Atlassian__fetch` metadata (`version: 27`, page created 2026-09-03T20:50:22Z). It is not the version printed in the page body |
| Last modified | 8 Oct 2026, about 13:25 UTC | **9 Oct 2026**. The API gives the date only |
| Status row in the page | "Ready for dev - 2026-10-07" | "Ready for dev - 2026-10-07" (**unchanged**, even though the version moved) |
| Lines / bytes | 737 / 70,928 | 740 / 71,737 |
| Requirement codes (`- **S…:**` lines) | 288 | 290 |

**How it was saved:** fetched with `getConfluencePage`, contentFormat `markdown`, which is the same call and format as the v26 copy. The `body` field was written to the file byte for byte by a script, so it was not retyped. Checks:
- The file ends with the page's closing context note ("…carry their own second line, as listed, or none.*").
- 290 `- **S<n>-…:**` lines are present.
- The `fetch` text of the same page differs only in markup (smartlink tags, table padding), not in wording.

Line diff: `sources/prd-diff-v26-to-2026-10-13.txt` (30 lines, 2,603 bytes).

### Requirement codes, v26 → v27 (compared by script on `- **S…:**` lines)

- **Added (4):**
  - **S7-N5c**: the duplicate check never counts the part being saved. A case or punctuation change to the part's own number (FF-5507 → FF5507) saves.
  - **S9-R10b**: the canned-job warning names each part by the inventory part's own number, not as typed in the canned job.
  - **S10-R12a**: the bulk counts include only the parts the user selected. Cores are not counted, so 2 parts with cores reads "2 parts updated."
  - **S11-E4**: saving a Part Library detail page whose entry was deleted elsewhere is refused with "Part Library entry not found."
- **Removed (2):**
  - **S5-R14**: "The dashboard's Critical Reorder list leaves out untracked parts."
  - **S9-E12**: "The dashboard's Critical Reorder list leaves out inactive parts."
- **Changed wording (3):**
  - **S7-N5a**: adds "The message names the active part's number."
  - **S13-R4a**: "Vendor is hidden where the screen that opens the dialog hides it." becomes **"Vendor always shows."**
  - **S13-R13**: adds "Parts at other locations count whether they are active or inactive."

### Changes outside requirement lines

- **§2 Accounting, new bullet:** "Inventory Value figures already saved for past dates keep their saved values. The count of bins below zero, which ships with this release, applies from release on and does not rework earlier dates." This ties SV-10380 into the PRD.
- **§2 Out of scope, reworded:** "Reorder and stockout alert changes, beyond leaving untracked and inactive parts out of the dashboard's Critical Reorder list and the Supply filter (S5-R14, S6-R10, S9-E12)." becomes "…beyond leaving untracked parts out of the Supply filter (S6-R10)."
- **No other changes:** the overview, Key Decisions, Terminology, the §8 message table and the Status row did not change. §3 Goals still reads "No stockout or reorder signals for items the shop knows it cannot count."

**Fact to note:** the Critical Reorder exclusion was item 3 of Product's 7 Oct "Decided by Product" comment. v27 withdraws it, and no comment explains why.

## 2. Confluence comments: `sources/confluence-comments-2026-10-13.md`

- 2 footer threads, 7 messages, all saved in full.
- 0 inline comments in every status: open, resolved, reopened and dangling.
- **No comment is newer than 8 Oct 2026 13:20 UTC.** The newest is Chris Ward's 8 Oct 13:17:53 UTC reply ("Both OK, and the page is now v26"), which we already had.
- **The v27 edit has no comment.**

## 3. Jira: `sources/jira-2026-10-13/STORIES-2026-10-13.md`

**What was fetched:** 24 issues on one page, with no further page: epic SV-10647, stories SV-10814 to SV-10826, tasks SV-11038 to SV-11046, and SV-10380. Descriptions and comments are verbatim. Only SV-10380 has comments (4, the newest on 7 Oct, all unchanged).

**Updated after 8 Oct 2026 13:20 UTC: 13 issues.**

| Issue | Updated (UTC) | What changed compared with `jira-2026-10-08/STORIES-2026-10-08.md` |
|---|---|---|
| SV-10647 (epic) | 9 Oct 21:46 | Status **Design In Progress → Ready for Development**. Description adds a link: "Tech plan: [Parts Lifecycle Update (Tech Plan)](https://powertools.shopview.com/md-viewer/6aed643a-…)" |
| SV-10380 (bug) | 9 Oct 17:21 | New acceptance criterion: "Inventory Value figures saved for dates before release keep their saved values. Only dates from release on count bins below zero." Status (Ready to Fix) and comments unchanged |
| SV-10814 Story 1 | 9 Oct 17:03 | Adds S1-R5a, S1-R5b, S1-R9a and 2 acceptance criteria (active and tracked on release day; export shows "Not Tracked" with no status column) |
| SV-10817 Story 4 | 9 Oct 17:03 | S4-R3 tooltip adds "Untracked parts are left out of the Inventory Value report."; "Total Quantity" becomes "Total Qty" in S4-R8 and the acceptance criteria |
| SV-10818 Story 5 | 9 Oct 17:03 | Adds S5-E1 and its acceptance criterion; S5-R10 now says "Total Qty" |
| SV-10819 Story 6 | 9 Oct 17:03 | S6-R1 now returns untracked parts plus normal matches; adds S6-R10 (Supply filter) and its acceptance criterion; "Total Qty" wording |
| SV-10820 Story 7 | 9 Oct 17:03 | Adds S7-R6c, S7-R6d, S7-N5b and S7-N5c; S7-N5a gets its extra sentence; 3 new acceptance criteria (FF-5507 cases, category kept) |
| SV-10821 Story 8 | 9 Oct 17:03 | S8-R14 and S8-R15 rewritten ("exactly the users who see Delete … today"); S8-N1 now covers create only; adds S8-N1a; acceptance criteria changed to match |
| SV-10822 Story 9 | 9 Oct 17:03 | S9-R10 and S9-R10a become one canned-job warning; adds S9-R10b, S9-R18 to S9-R20 (global search) and S9-E8a; S9-N3 and S9-E1 rewritten; acceptance criteria changed to match |
| SV-10823 Story 10 | 9 Oct 17:03 | Adds S10-R12a, S10-R22a and S10-R25a, with 3 acceptance criteria |
| SV-10824 Story 11 | 9 Oct 17:03 | Adds S11-R3a, S11-R3b, S11-R6a and S11-E4; S11-R6 reworded ("when the requested part is received"); 2 new acceptance criteria |
| SV-10825 Story 12 | 9 Oct 17:03 | S12-R11 now uses "…is in use and cannot be deleted." and adds "Part Library entry not found" without a full stop; adds S12-R12 to S12-R14 and 3 acceptance criteria |
| SV-10826 Story 13 | 9 Oct 17:03 | S13-R4a ("Vendor always shows"), S13-R13, S13-R19, S13-N1 (exact match only) and S13-E1 rewritten; adds S13-R19b, R19c, R19d, S13-N3a, N7, N8, N9 and N9a; acceptance criteria changed to match |

- **Not changed since 8 Oct 13:20 UTC (11 issues):** SV-10815 and SV-10816 (last updated 8 Oct 11:01 UTC), and the 9 tasks SV-11038 to SV-11046 (8 Oct 11:01–11:02 UTC). Their text is identical.
- **The stories now match PRD v27 exactly.** A script compared every `* S…:` line in the 13 stories with the PRD: 290 codes on each side, none missing on either side, and identical wording.
- **The 8 Oct copies of the stories were behind PRD v26.** They did not carry the v21–v26 changes.
- **Leftover reference:** task **SV-11041** (Verify Phase 4) still lists S9-E12 under "Covers". Its checklist still reads "Dashboard Critical Reorder leaves out untracked and inactive parts (S5-R14, S9-E12)". Both requirements were removed in PRD v27.
- **Not yet updated:** SV-11041 also still says "editing other fields of an untracked part keeps today's access (assumption pending Product)". Product decided this on 8 Oct as S8-N1a.

## 4. Reading coverage

| File | Size | Lines read | Coverage |
|---|---|---|---|
| `sources/CONFLUENCE-829227015-PartLifecycle-2026-10-13.md` (PRD v27) | 71,737 B, 740 lines | 1–740 | 100% |
| `sources/CONFLUENCE-829227015-PartLifecycle-v26-2026-10-08.md` (PRD v26) | 70,928 B, 737 lines | compared line by line with `diff` and by the requirement-code script; all 30 differing lines read | 100% compared |
| `sources/confluence-comments-2026-10-13.md` (API responses: 2 footer threads, 7 messages; 4 inline queries, all empty) | 18,004 B, 160 lines | every message, in full | 100% |
| `sources/confluence-comments-2026-10-08.md` | 1,098 B, 13 lines | 1–13 | 100% |
| `sources/jira-2026-10-13/STORIES-2026-10-13.md` (24 issues) | 94,624 B, 1,151 lines | 1–1151 | 100% |
| `sources/jira-2026-10-08/STORIES-2026-10-08.md` | 84,434 B, 1,059 lines | compared line by line with `diff` (320-line diff, all read) | 100% compared |
| `SOURCE-CHECK-2026-10-08.md` | 4,040 B | all | 100% |
