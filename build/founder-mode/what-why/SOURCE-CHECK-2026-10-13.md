# What/Why (Title and Description) — source check, 13 Oct 2026

Read-only pass over Confluence and Jira. Nothing was written to TestRail, Jira or Confluence.

## 1. The PRD

| Item | Value |
|---|---|
| Page | 845348896 "What Are You Doing / Why Are You Doing It?" (Chris Ward's personal space) |
| Confluence version | **13**, read from the page metadata (`mcp__Atlassian__fetch`, ARI `…:page/845348896`). Page created 2026-09-10. |
| Last modified | **2026-10-13**: CQL `lastmodified >= "2026-10-13"` matches, and the API said "about an hour ago" at capture. The API gave no exact timestamp. |
| Status line on the page | **"Locked for build - 2026-09-16"**. Unchanged from 30 Sep. |
| Epic on the page | **SV-11257** "What Are You Doing / Why Are You Doing It? (split out of SV-9667, Founder Mode Batch #1)". On 30 Sep it was SV-9667. |
| Design | https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6. Unchanged. |
| Child pages | **None.** `getConfluencePageDescendants` returned 0. |
| Verbatim copy | `sources/CONFLUENCE-845348896-2026-10-13.md`: 229 lines, 25,478 bytes. This is the `getConfluencePage` markdown body, saved unchanged. |
| 30 Sep copy | `sources/CONFLUENCE-845348896-WhatWhy-Update-v1-2026-09-30.md`: 57 lines, 3,992 bytes. **This is a capture summary, not a verbatim page copy.** It recorded "Last modified Sep 24 2026" and no version number. |

### Cross-check
How the copy was made: the MCP result cannot be piped to disk, so the body string was written out from the tool result with JSON escapes decoded (`\"`→`"`, `\\`→`\`) and no other change. Fidelity evidence: 37 of 40 requirement lines are byte-identical to the independently captured 30 Sep anchors, and the other 3 differ only as explained in §2. The `fetch` call returned the same page in a second markdown dialect (bullet character, smart-link wrappers, `line_name` without the backslash) and was read against it; no textual difference was seen (read, not script-compared).

## 2. Requirement-code changes (30 Sep → 13 Oct)

The 30 Sep file has no requirement lines, because it is a summary. The 30 Sep requirement baseline is therefore **`anchor-quotes.json`**: 40 verbatim quotes captured on 2026-09-30 and used in the cases. A script extracted the `- **S#-X#:** text` lines from the new copy and compared them with the baseline. Output: `sources/requirement-code-changes-2026-10-13.txt`.

| Result | Codes |
|---|---|
| Codes on the page now | 40 (S1-R1…R7, S1-N1 · S2-R1…R3 · S3-R1…R12 incl. R6a/R7a/R9a, S3-N1…N3, S3-E1…E3 · S4-R1…R7, S4-N1) |
| **Added** | **0** |
| **Removed** | **0** |
| Identical | 37 |
| **Different text: 3. None of them changes the meaning.** | |
| S1-R5 | The page now ends with *"(Corrected 2026-09-10: the first build gave the picker no placeholder, so the prompt never appeared on a new line.)"* The 30 Sep anchor stops at *"…as soon as the user types or picks a canned line."* The note is dated 2026-09-10, which is before our 30 Sep capture. It was most likely on the page already and left out of the anchor as an editorial note. We cannot prove this, because there is no verbatim 30 Sep page copy. The requirement sentence itself is identical. |
| S4-R1 | Markdown only: the page shows `**Withdrawn.**` in bold and the anchor has plain `Withdrawn.`. The words are identical. |
| S4-R2 | Escaping only: the page markdown renders the asterisk as `"\\\*Line Title"` and the anchor has `"*Line Title"`. The words are identical. The real column name is `*Line Title`, as confirmed in Jira SV-10133 and SV-10392. |

**Verdict: the requirements did not change between 30 Sep and 13 Oct.** The texts that the 23 Sep comment thread said would change were already in the 30 Sep baseline:
- S1-R6 "Title is a required field"
- S3-R7 "4,000 bytes"
- S4-R1 withdrawn

## 3. Changes outside the requirement lines

`sources/prd-diff-to-2026-10-13.txt` is the raw `diff`, 288 lines. It compares a summary with a verbatim copy, so almost every line differs. It is kept as instructed but does not tell us much on its own. Comparing the 30 Sep summary's facts with the new page shows:

- **Epic moved:** SV-9667 → **SV-11257**, split out on 2026-10-13. The page header table now names SV-11257. This edit is most likely the reason the page moved on 13 Oct.
- **Page moved** from "last modified Sep 24" to 2026-10-13, now version 13.
- Unchanged: status, design link, business case, key decisions, out-of-scope list, assumptions, the one open question ("Who downloads the Customer Invoice report, and why?", Blocks: nothing), §6 Surfaces and Form Factor. Every fact in the 30 Sep summary still matches the page.
- §8 Change Log still has only its header row, with no entries.

## 4. Comments

Details are in `sources/confluence-comments-2026-10-13.md`.

| Thread | Author | Date | Newer than 30 Sep? |
|---|---|---|---|
| Footer 882147348 "Tech planning notes" (5 items: starting format, S1-R6 wording, one importer, report shortened too, "Tech story missing.") | Milan Zivanovic* | 2026-09-23 | No |
| Reply 883261444 (answers: ship "Title is a required field"; S4-R2 names; 4,000 bytes on both routes; PRD to be updated) | Chris Ward | 2026-09-23 | No |
| Inline comments | none (0 open, 0 resolved, 0 dangling, 0 reopened) | n/a | n/a |

\*The comments API gives only an account id. The name comes from Jira SV-10403, which credits comment 882475016 (same account) to Milan Zivanovic.

**No comment is newer than 30 Sep 2026.** All the promised PRD updates appear in the current text.

## 5. Jira: epic SV-11257 and its 8 children

Details are in `sources/jira-2026-10-13/STORIES-2026-10-13.md`. The query was `key/parent/"Epic Link"`, 1 page, with no remainder.

| Key | Type | Status | One line |
|---|---|---|---|
| SV-11257 | Epic | TESTING QA | Created 2026-10-13, "Split out of SV-9667"; links to PRD 845348896 (remote link) and relates to SV-9667 |
| SV-10130 | Story | TESTING QA | S1, line dialog. Comments: tech-plan link, TestRail list (C154707–C154710), "Ready for QA" with QA env |
| SV-10131 | Story | TESTING QA | S2, ShopCoach builder (C154711–C154712) |
| SV-10132 | Story | TESTING QA | S3, QuickBooks line text (C154713–C154722); QA Severity High |
| SV-10133 | Story | TESTING QA | S4, imports (C154723–C154725) |
| SV-10390 | Task | TESTING QA | Verify QuickBooks and report line text (tech plan Phase 1, FR-008–FR-014) |
| SV-10391 | Task | TESTING QA | Verify dialog and ShopCoach labels (Phase 3, FR-001–FR-007) |
| SV-10392 | Task | TESTING QA | Verify invoices import wording (Phases 2 and 4, FR-015–FR-018) |
| SV-10393 | Task | TESTING QA | Verify E2E coverage (Phase 5). Done on PR #3553 per a 2026-10-08 comment |

**New facts in Jira that matter to us.** These are facts only, not sources of expected behaviour (Rule 57):
- **A QA build now exists.** Developer Nemanja Djuric posted "Ready for QA testing" on 2026-10-08 with:
  - QA env **sv10130.qa.shopview.com**
  - QuickBooks host **qb1.qa.shopview.com**, which runs the same code against the sv10130 backend
  - PR #3553, which ships all four stories in one branch

  PROJECT-STATE still says "No QA branch yet".
- Developer "known gaps":
  - The design board shows "Title \*", but the build has no asterisk, citing S1-R7. This is a design-vs-PRD point.
  - Import row error messages keep the old wording ("Line name cannot be empty.").
  - CSV formula-injection exposure in the Customer Invoice export. This is pre-existing, with a follow-up being drafted.
  - A CSV UTF-8 byte-order mark is rejected. This is pre-existing.

**How the Jira story texts differ from the PRD.** A script compared every requirement code; see section 2 of the output file.
- 15 codes are identical. 22 differ. S3-E1–E3 exist only in the PRD.
- Jira uses UK "labelled" and "behaviour"; the PRD uses US "labeled" and "behavior".
- **Jira is stale on substance:**
  - **S1-R6**: Jira says "Title is required", replacing "Line name is required". The PRD says "Title is a required field". The developer's comment confirms the PRD wording ships.
  - **S4-R1**: Jira still has the live work-order-import rename. The PRD has withdrawn it.
  - **S4-R3**: Jira says "Both importers". The PRD says "The importer".
  - **S3-R7**: Jira says "too long for QuickBooks" with no number. The PRD says "longer than 4,000 bytes … both cut at that same limit".
  - **S3-R6a**: **Jira says Require Tech Story "is off by default". The PRD does not say this.** It is a Jira-only claim with no PRD backing.
  - The Jira S1 acceptance criteria still say "Title is required".
- Jira is shorter than the PRD in S3-R6, R7a, R8, R9, R9a, R10, R11 and S3-N3. The rationale sentences are dropped, but the meaning is the same.

## 6. Tech plan

**"Title and Description — Technical Implementation Plan"** is linked in a SV-10130 comment by Nemanja Djuric on 2026-10-07:
https://powertools.shopview.com/md-viewer/2cb42c08-54d6-40ef-b98b-696198c19feb

The page is outside Atlassian and was **not fetched**. The verification tasks cite its Phases 1–5 and its FR-001…FR-018 and NFR-001…004 codes, and say "Tech plan: Milan has the current copy". A CQL title search found no Confluence copy. Rule 30: the tech plan is an input we do not hold.

## 7. Reading coverage

Every file below was read to 100%.

| File | Size | Lines | How it was read |
|---|---|---|---|
| Confluence page body (getConfluencePage markdown) | 25,478 B | 229 | Read in full as returned, then saved |
| Confluence page (fetch, for the version) | ≈25 KB | n/a | Read in full |
| Footer comments + replies, all inline-comment states | 4,682 B saved | 53 | Read in full |
| `sources/jira-2026-10-13/STORIES-2026-10-13.md` (9 issues) | 47,068 B | 634 | Read in full, lines 1–634 |
| Raw Jira JSON (combined both epics) | 212,566 chars | n/a | Processed in full by script; the rendered output was read in full |
| 30 Sep summary copy | 3,992 B | 57 | Read in full |
| `anchor-quotes.json` | 7,681 B | 41 | All 40 entries compared by script |
| `prd-diff-to-2026-10-13.txt` | 30,061 B | 288 | Generated by `diff`; not read line by line, because both of its inputs were read in full |
| `requirement-code-changes-2026-10-13.txt` | 12,319 B | 121 | Read in full (summary and per-code opcodes) |
| Remote links for SV-11257, SV-10130, SV-10132 | n/a | n/a | Read in full: the epic has a link to the PRD only, and the stories have none |
