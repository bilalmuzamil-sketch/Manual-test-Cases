# Price/Category (Settings Pricing and Categories sorting): source check, 13 Oct 2026

This was a read-only pass over Confluence and Jira. Nothing was written to TestRail, Jira or Confluence.

## 1. PRD

| Item | Value |
|---|---|
| Page | 578781186 "Settings "Pricing" And "Categories" Sorting" (Chris Ward personal space) |
| Confluence version | **20** (page metadata via `mcp__Atlassian__fetch`; page created 2026-05-16) |
| Last modified | **2026-10-13** (CQL `lastmodified >= "2026-10-13"` matches; the API said "about an hour ago" at capture; it gave no exact timestamp) |
| Status line on page | **"Locked for build - 2026-09-15"**, unchanged |
| Epic on page | **SV-11258** (was SV-9667 on 30 Sep) |
| Design / video | https://claude.ai/artifact/UMNdojKWhYhRyJrjdgZa4P · https://www.loom.com/share/262e61485be24d07984b571b3350635b (both unchanged) |
| Child pages | **None** (`getConfluencePageDescendants` returned 0) |
| Verbatim copy | `sources/CONFLUENCE-578781186-2026-10-13.md`: 359 lines, 22,410 bytes. This is the `getConfluencePage` markdown body, unchanged |
| 30 Sep copy | `sources/CONFLUENCE-578781186-PriceCategory-Sorting-2026-09-30.md`: 47 lines, 3,248 bytes. It is a **capture summary, not a verbatim copy**. It recorded "Last modified Sep 23 2026" and no version number |

How the copy was made: the MCP result cannot be piped to disk, so the body string was written out from the tool
result with JSON escapes decoded (`\"`→`"`, `\\`→`\`), no other change. Fidelity evidence: 60 of 63 requirement lines
are byte-identical to the independently captured 30 Sep anchors (the other 3 differ only by `**` bold). The `fetch`
rendering of the same page was read against it; no textual difference was seen (read, not script-compared).

## 2. Requirement-code changes (30 Sep to 13 Oct)

The 30 Sep file holds no requirement lines, so the baseline is **`anchor-quotes.json`**: 63 verbatim quotes captured 2026-09-30. A script compared it with the requirement lines in the 13 Oct copy (format: `\- **S#-X#:** text`). The full output is in `sources/requirement-code-changes-2026-10-13.txt`.

| Result | Codes |
|---|---|
| Codes on the page now | 63 (S1-R1…R21, N1, N5, N2, N3 · S2-R1…R13, N1, N2 · S3-R1…R19 incl. R12a/R12b, N1, N2) |
| **Added** | **0** |
| **Removed** | **0** |
| Identical | 60 |
| **Different text, 3, formatting only** | S1-N3, S2-N2, S3-N2. The page bolds `**Settings - Parts**` and the anchor has it in plain text. The words are identical. |

**Verdict: the requirements did not change between 30 Sep and 13 Oct.** Every ruling from the 23 Sep comment thread was already in the 30 Sep baseline:
- S3-R12 numeric-aware opening order
- S3-R12b and S3-R13 list only categorised rules
- S3-R18 search works
- S3-R19 loading indicator
- S1-R19 "first whenever it is among the matching rows"
- S1-N5 generic message suppressed
- §6 real volumes

## 3. Changes outside the requirement lines

`sources/prd-diff-to-2026-10-13.txt` is the raw `diff` (408 lines). It compares a summary with a verbatim copy, so nearly every line differs. It is kept as instructed. Comparing the facts in the 30 Sep summary with the 13 Oct page gives:

- **The epic moved from SV-9667 to SV-11258** (split out 2026-10-13). The page header now links SV-11258. This is the most likely reason the page changed on 13 Oct.
- **The owner cell** now holds an @mention ("@Chris Ward"). This is cosmetic.
- **Unchanged:** status, design and video links, Business Case, Feature Overview, Jobs to be Done, Key Decisions, Terminology, Assumptions (1,076 categories / 8,994 fixed rules; QA tests at that size), Presentation Only, and Form Factor (desktop only). Every fact in the 30 Sep summary still matches.
- **Section numbering** runs 1–6, then two unnumbered sections, then "8. Requirements" and "10. Change Log", with no 7 or 9. The Change Log has only its header row.
- **Spelling:** the PRD body uses US "behavior" throughout, as agreed in the comment thread.

## 4. Comments

Details are in `sources/confluence-comments-2026-10-13.md`.

| Thread item | Author | Date | Newer than 30 Sep? |
|---|---|---|---|
| Footer 882311170 "Tech-planning readiness pass" (design vs S1-R17; S3-R12 wording; Fixed Rules search question; production volumes) | Milan Zivanovic* | 2026-09-23 08:36 | No |
| Reply 882475010 (US spelling; "Behaviour" canvas page title) | Milan Zivanovic* | 2026-09-23 09:34 | No |
| Reply 882475016 (category-less rules not listed; S1-R19 and search; S1-N5 "told once") | Milan Zivanovic* | 2026-09-23 12:07 | No |
| Reply 882311473 (Chris Ward's answers to all three) | Chris Ward | 2026-09-23 13:49 | No |
| Inline comments | none (0 open, 0 resolved, 0 dangling, 0 reopened) | – | – |

\*The comments API returns only an account id. The name comes from Jira SV-10403, which says comment 882475016 was "Raised by Milan Zivanovic".

**No comment is newer than 30 Sep 2026.** All PRD changes promised in the thread are in the current text.

**Open item from the thread (design, not PRD).** Chris Ward said "The canvas will be updated to match the PRD. Test S1-R17 as written." The 13 Oct design canvas was not checked in this pass. Whether the "three rules that bite" board still shows an empty QuickBooks cell sorted last is **not verified**.

## 5. Jira: epic SV-11258 and its 10 children

Details are in `sources/jira-2026-10-13/STORIES-2026-10-13.md` (one page of results, nothing left over).

| Key | Type | Status | One line |
|---|---|---|---|
| SV-11258 | Epic | **Design In Progress** | Created 2026-10-13, "Split out of SV-9667". Description says lists sort "**including fixed rules for parts with no category**". Remote link to PRD 578781186 |
| SV-10134 | Story | Open | S1 Categories (C154726–C154735) |
| SV-10135 | Story | Open | S2 Pricing Matrices (C154736–C154741) |
| SV-10136 | Story | Open | S3 Fixed Rules (C154742–C154751) |
| SV-10403 | Story | Open | **Story 4: list fixed rules with no category** (empty Category cell, sorts last, counted in N, searchable). Explicitly "Not in this release"; **not in the PRD** |
| SV-10386 | Bug | Open | categories-list endpoint has no authorization check (outside feature scope) |
| SV-10387 | Bug | Open | Fixed Rules shows prices without two decimals ($4.5); fix must keep sort by value |
| SV-10445 | Bug | Open | Fixed Rules omits rules whose part has no category (deferred, "not this release") |
| SV-10394 | Task | Board Backlog | Verify Categories sorting (tech plan Phases 1–2, FR-001–012, FR-026) |
| SV-10395 | Task | Board Backlog | Verify Pricing Matrices + tab labels (Phase 3, FR-013–017, FR-024, FR-026) |
| SV-10396 | Task | Board Backlog | Verify Fixed Rules sorting, load-all, release note (Phases 4–5, FR-018–029) |

**No QA build is announced.** The stories are Open, there is no "Ready for QA" comment, and no QA environment is named.

### Jira story text vs the PRD

A script compared every code. 43 codes are identical and 18 differ. S3-R18 and S3-R19 exist only in the PRD. Jira still holds the **pre-23-Sep wording** for these:
- **S1-R19.** Jira says Default stays first "after a reload in place or a search". The PRD narrows this: first only when it is among the matching rows, never forced in.
- **S1-N5.** Jira lacks "the app's generic error message … is suppressed, so the user never sees two".
- **S1-R17.** Jira lacks "sorts under P in the same run as … genuinely named Parts".
- **S3-R12.** Jira says "When the tab first opens … sorted by Part number in ascending order". The PRD adds "numeric-aware, per S3-R6".
- **S3-R12b.** Jira says "A fixed rule with no category sorts last…". The PRD says the tab **lists only rules whose part has a category**, and the 3 others go to a separate ticket.
- **S3-R13.** Jira says "All fixed rules load". The PRD says "Every fixed rule the tab lists (S3-R12b) loads".
- **S3 acceptance criterion.** Jira still expects a category-less rule to appear last when Category is sorted. Under the PRD such a rule is not listed.
- **Other differences:** backticks vs quotes, UK "behaviour", and dropped "as it does today" phrasing. These change wording only, not meaning.

### Verify-task points not in the PRD

Facts only; Rule 57 means they are never expected behaviour:
- SV-10394 says "hovering an unsorted sortable header fades its arrow in, by design". This is possibly at odds with PRD §2 "Only the column being sorted shows an arrow". **PO question candidate.**
- SV-10395 says "Switching tabs and back keeps each tab's sort". The PRD is silent on this.
- SV-10396 says that while loading, "tabs and Add fixed rule still work". PRD S3-R19 names only headers, search box and rows as unusable, so this is consistent.
- SV-10396 also gives the search example `$4.5`, which relies on today's price format (see SV-10387).

## 6. Tech plan

The verify tasks name a tech plan, **"Parts Settings Sorting"**, Phases 1–5 with FR-001…FR-029 and NFR-001/002/005, and say "**Milan has the current copy**". **No link is given anywhere** in the epic, stories, tasks or comments. A CQL title search found no Confluence page, so it was not fetched. The tech plan is a missing input (Rule 30). The PRD's §4 mentions a "technical-specification readiness pass on 2026-09-15".

## 7. Reading coverage

All items were read to 100%.

| File | Size | Lines | Coverage |
|---|---|---|---|
| Confluence page body (getConfluencePage markdown) | 22,410 B | 359 | Read in full, then saved |
| Confluence page (fetch, for version) | ≈22 KB | – | Read in full |
| Footer comments + 3 replies, all inline-comment states | 8,273 B saved | 86 | Read in full |
| `sources/jira-2026-10-13/STORIES-2026-10-13.md` (11 issues) | 36,873 B | 536 | Read in full, lines 1–536 |
| Raw Jira JSON (both epics combined) | 212,566 chars | – | Processed in full by script; the rendered output was read in full |
| 30 Sep summary copy | 3,248 B | 47 | Read in full |
| `anchor-quotes.json` | 8,805 B | 64 | All 63 entries compared by script |
| `prd-diff-to-2026-10-13.txt` | 26,487 B | 408 | Generated by `diff`. Not re-read line by line, because both inputs were read in full |
| `requirement-code-changes-2026-10-13.txt` | 8,896 B | 106 | Read in full |
| Remote links SV-11258, SV-10134, SV-10136 | – | – | Read in full: PRD link on the epic only |
