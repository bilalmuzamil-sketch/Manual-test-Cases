# Price/Category (Settings Pricing and Categories sorting): source check, 14 Oct 2026

This was a read-only pass over Confluence and Jira. Nothing was written to TestRail, Jira or Confluence, and no git command was run.
The baseline is the 13 Oct capture (`SOURCE-CHECK-2026-10-13.md`).

## 1. PRD

| Item | 13 Oct | 14 Oct |
|---|---|---|
| Page | 578781186 "Settings "Pricing" And "Categories" Sorting" | same |
| Confluence version | 20 | **21** (`mcp__Atlassian__fetch` metadata) |
| Last modified | 2026-10-13 | API said "about 6 hours ago" at capture; no exact timestamp given. The Jira stories were re-synced at 2026-10-13 15:39 -0500, so the PRD edit was most likely made on the evening of 13 Oct US time, after our 13 Oct capture |
| Status line | "Locked for build - 2026-09-15" | **"Locked for build - 2026-10-13"** |
| Epic / owner / design / video | SV-11258 · @Chris Ward · artifact UMNdojKWhYhRyJrjdgZa4P · Loom 262e6148… | unchanged |
| Change Log table | header row only | still header row only (the page records none of these changes) |
| Verbatim copy | `sources/CONFLUENCE-578781186-2026-10-13.md` (359 lines, 22,410 bytes) | `sources/CONFLUENCE-578781186-2026-10-14.md` (**375 lines, 23,978 bytes**) |

How the copy was made: `getConfluencePage` (markdown) body string written out with JSON escapes decoded (`\"`→`"`, `\\`→`\`, `\n`→newline), nothing else changed, same method as 13 Oct. Fidelity evidence: the `diff` against the 13 Oct copy shows only the edited paragraphs (below), so every untouched line is byte-identical to the 13 Oct copy. The `fetch` rendering of the same page (version 21) was read in full against it; no textual difference was seen apart from rendering (smartlink/mention tags, `_…_` instead of `*…*` italics, `->` instead of `-\>`).

Raw diff: `sources/prd-diff-2026-10-13-to-2026-10-14.txt`.

## 2. Requirement-code changes (13 Oct to 14 Oct)

Script: regex `^\s*\\?[-*]\s+\*\*(S\d+-[A-Z]+\d+[a-z]?):\*\*\s*(.*)$` over both copies. Output: `sources/requirement-code-changes-2026-10-14.txt`.

**63 codes before, 67 now: 4 added, 0 removed, 4 reworded, 59 identical.**

### Added (4): the "no third state" rule

| Code | Text (verbatim) |
|---|---|
| S1-R6a | Every further click on the Name header flips the direction again. There is no third state. |
| S1-R11a | A third click re-sorts the list A to Z, the same as the first click. Every further click flips the direction again. |
| S2-R6a | Every further click flips the direction again. There is no third state. |
| S3-R5a | A third click gives the same order as the first click. Every further click flips the direction again. |

### Removed: none

### Reworded (4): Fixed price now opens highest first

| Code | Old (13 Oct) | New (14 Oct) |
|---|---|---|
| S3-R4 | When the user clicks a sortable column header that is not currently sorted, the list sorts by that column in ascending order. | When the user clicks a sortable column header that is not currently sorted, the list sorts by that column: A to Z for Part number and Category, highest first for Fixed price (S3-R8). |
| S3-R5 | When the user clicks that same header again, the list re-sorts into descending order. | When the user clicks that same header again, the list re-sorts in the opposite direction. |
| S3-R8 | Fixed price sorts by value, lowest first when ascending. | Fixed price sorts by value. Its first click puts the highest price first. |
| S3-R9 | Fixed price sorts highest first when descending. | The second click on Fixed price puts the lowest price first. |

**This is a change of behaviour, not of wording:** on 13 Oct the first click on Fixed price gave the lowest price first; now it gives the highest price first, and the second click gives the lowest.

## 3. Changes outside the requirement lines

| Where | Old | New |
|---|---|---|
| Header table, Status | Locked for build - 2026-09-15 | Locked for build - 2026-10-13 |
| §2 Feature Overview, "Sort arrows" (new bullet after "Only the column being sorted shows an arrow.") | (none) | "Each click on the header being sorted flips its direction. A third click gives the same order as the first click. No click clears the sort or returns the list to its opening order." |
| §4 Key Decisions (two new decisions, after "Sorting is numeric-aware") | (none) | "**A header toggles; there is no third state.** The first click sorts the column, the second reverses it, and the third gives the first click's order again. Opening the page afresh is how a list returns to its opening order. This is the same rule as every other table in ShopView (Default Sorting, decided 2026-10-13). **Rejected:** a third click that returns the list to its opening order, which makes the same click do two different things." |
| | (none) | "**Fixed price opens on the highest price.** Its first click puts the highest price first, like every money column in ShopView (Default Sorting, decided 2026-10-06). **Rejected:** lowest first, which would make this the one money column in ShopView that opens the other way." |
| §5 Terminology (new term, between "Fresh open" and "Fixed rule") | (none) | "**Default category** - the category row named "Uncategorized", which carries the "Default" badge and cannot be edited." |

Unchanged: Business Case, Jobs to be Done/Goals, Assumptions (§6), Presentation Only, Form Factor, every Story header, Design/Jira/Prerequisites block, every context note, Change Log (still empty). Both new Key Decisions cite a separate ShopView-wide decision, "Default Sorting" (decided 2026-10-06 and 2026-10-13); that document is not in our sources folder and was not read in this pass.

## 4. Comments

`sources/confluence-comments-2026-10-14.md`. **No new comments.** Footer: 1 comment + 3 replies, identical ids, authors, timestamps (all 2026-09-23) and bodies to the 13 Oct capture. Inline: 0 open, 0 resolved, 0 dangling, 0 reopened. Nothing is dated after 2026-10-13.

## 5. Jira (epic SV-11258)

`sources/jira-2026-10-14/CHANGED-2026-10-14.md` (all 10 children with full descriptions and comments, plus the epic). Per-story description diffs: `sources/jira-2026-10-14/SV-1013{4,5,6}-description-diff-2026-10-13-to-2026-10-14.txt`.

JQL `(parent = SV-11258 OR "Epic Link" = SV-11258) AND updated >= "2026-10-13 00:00"` returned all 10 children (no further page), because all were touched on 13 Oct when the epic was split out. Compared with the 13 Oct capture:

| Issue | Changed since 13 Oct capture? | What |
|---|---|---|
| SV-11258 (epic) | **Yes** | Status **Design In Progress → Ready for Development** (updated 15:38 -0500). Description identical. |
| SV-10134 Story 1 Categories | **Yes** (15:39 -0500) | Requirements re-synced to the PRD: added S1-R6a, S1-R11a; S1-R3, R17, R19, R20, N1, N5 now match the PRD wording (they were older wording on 13 Oct; S1-N5 moved above S1-N2). 2 new acceptance criteria: repeated Name clicks flip and never unsort; third QuickBooks click returns A to Z. |
| SV-10135 Story 2 Pricing Matrices | **Yes** (15:39 -0500) | Added S2-R6a; S2-R10, R13, N1 now match PRD wording. 1 new acceptance criterion: third click gives the first click's order (Z to A), no unsorted state. |
| SV-10136 Story 3 Fixed Rules | **Yes** (15:39 -0500) | S3-R4, R5, R8, R9 reworded (highest price first), S3-R5a added; S3-R12, R12b, R13 now match PRD; **S3-R18 (search) and S3-R19 (loading indicator) added to the story for the first time**. Acceptance criteria: price ascending/descending pair replaced by first click = $10.00 first, second click = $9.00 first; new third-click criterion. |
| SV-10386, SV-10387, SV-10394, SV-10395, SV-10396, SV-10403, SV-10445 | No | Updated timestamps equal the 13 Oct capture; descriptions byte-identical. |

Comments: each story has 1 comment (Vladimir Tomovic, 2026-10-07), already in the 13 Oct capture. **No new Jira comments.**

**Jira now agrees with the PRD:** a script compared the 67 requirement lines in the three stories with the 67 in PRD v21; every code is present in both and every text matches once backticks and bold marks are ignored. On 13 Oct the stories still carried older wording for 15+ codes and lacked S3-R18/S3-R19.

## 6. What this means for the suite (for the next authoring pass; nothing was edited)

- Any case expecting the first Fixed price click to show the **lowest** price first now contradicts S3-R4/R8/R9 and the SV-10136 acceptance criteria. The quoted Expected Result must be re-quoted from v21 (Rule 113: the source changed).
- Four new requirements (S1-R6a, S1-R11a, S2-R6a, S3-R5a) need coverage: repeated clicks keep flipping, the third click equals the first, no unsorted state.
- New Terminology entry ("Default category" = "Uncategorized", Default badge, cannot be edited) and the new Sort-arrows bullet are quotable sources for existing Default-category and arrow cases.
- `update-2026-10-13/anchor-quotes-current.json` holds the old text of S3-R4, S3-R5, S3-R8 and S3-R9 (checked by grep) and has no entries for the 4 new codes, so it is now stale.

## 7. Reading coverage

| Source | Size | Read |
|---|---|---|
| PRD page 578781186 v21, `getConfluencePage` markdown | 375 lines / 23,978 bytes | 100%: every line read while transcribing; diffed by script against 13 Oct copy |
| PRD page 578781186 v21, `fetch` rendering | full body | 100% read against the saved copy |
| Footer comments (1 + 3 replies) | 4 bodies | 100% read, compared with 13 Oct copy |
| Inline comments, 4 states | 0 items | 100% (empty) |
| Jira child search result | 66,134 bytes JSON, 10 issues | 100% processed by script: all 10 descriptions and 3 comments written verbatim to the CHANGED file; descriptions compared byte-for-byte with the 13 Oct capture; the 3 changed descriptions read in full via their diffs |
| Jira epic SV-11258 | 1 issue | 100% read |

Not done: the "Default Sorting" decision cited by the two new Key Decisions is a separate document and is not in our sources. Fetching it is outside this task.

## Follow-up checks, 14 Oct 2026 (main session)
- **"Default Sorting" decision (cited by the two new Key Decisions):** searched Confluence (title and text, CQL), Jira (summary/text "Default Sorting"; only old, unrelated tickets such as SV-9056, SV-3497) and public Slack (after 1 Oct). **No such decision document exists in any source we can reach.** The PRD v21 states both rules in full (no third state; Fixed price opens on the highest price), so the cases quote the PRD.
- **Design:** https://claude.ai/artifact/UMNdojKWhYhRyJrjdgZa4P re-read 14 Oct; all 6 files byte-identical to the 13 Oct copy (md5 match). The design does not show a Fixed price sort direction, so it does not conflict with v21.
- **Tech plan (13 Oct):** FR-018 ("first click on an unsorted header sorts ascending") and FR-020 ("lowest first ascending") now conflict with PRD v21 (S3-R4, S3-R8: Fixed price first click highest first). The PRD is newer and wins (Rules 30/57); the affected cases carry a divergence sentence (Rule 56). Raised as an outstanding item: an updated tech plan, if one exists.
- **Anchors rebuilt** from v21: 67 codes (`update-2026-10-13/anchor-quotes-current.json`; v20 copy `anchor-quotes-2026-10-13-v20.json`). Validator against v21 flagged exactly C154742, C154745, C154751 (S3-R4/R5/R8/R9 quotes) and the 4 new codes uncovered.
