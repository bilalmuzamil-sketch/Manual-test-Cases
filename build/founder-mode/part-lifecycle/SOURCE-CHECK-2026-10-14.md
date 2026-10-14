# Part Lifecycle: source check, 14 Oct 2026 (against the 13 Oct 2026 copies)

All sources were read only. Nothing was written to Confluence, Jira or TestRail.

## 1. PRD: Confluence 829227015 "Parts Lifecycle Update"

| | 13 Oct copy | 14 Oct copy |
|---|---|---|
| File | `sources/CONFLUENCE-829227015-PartLifecycle-2026-10-13.md` | `sources/CONFLUENCE-829227015-PartLifecycle-2026-10-14.md` |
| Confluence version | v27 | **v29**. Read from `mcp__Atlassian__fetch` metadata (`version: 29`, page created 2026-09-03T20:50:22Z). Two edits (v28, v29) happened after the 13 Oct copy; only v29 is retrievable, so the split between them is not known |
| Last modified | 9 Oct 2026 | **"yesterday at 11:19 PM"** as returned on 14 Oct by both `getConfluencePage` and CQL `id = 829227015` (expand `version,history.lastUpdated` returned no extra fields). That is 13 Oct 2026, 11:19 PM; the API does not state the time zone |
| Status row in the page | "Ready for dev - 2026-10-07" | "Ready for dev - 2026-10-07" (**unchanged** again) |
| Lines / bytes | 740 / 71,737 | 757 / 75,323 |
| Requirement codes (pattern below) | 290 | 302 (no duplicates in either) |

**How it was saved:** `getConfluencePage`, contentFormat `markdown` (same call as the 13 Oct copy). The JSON `body` field was written to the file by a script, JSON escapes decoded, nothing else changed. The file ends with the page's closing context note ("…carry their own second line, as listed, or none.*").

**Line diff:** `sources/prd-diff-2026-10-13-to-2026-10-14.txt` (`diff old new`, 48 lines, 5,596 bytes).

### Requirement codes, v27 → v29

Extracted by script from both files with `^\s*\\?[-*]\s+\*\*(S\d+-[A-Z]+\d+[a-z]?):\*\*\s*(.*)$`.

**ADDED (12)**

| Code | Text (verbatim) |
|---|---|
| S1-R9b | The export includes every part on that tab that matches the current search, filters and Supply filter, including parts not yet scrolled into view. With nothing matching, the message "Empty export" shows and no file is made. |
| S5-E2 | A part reaches S5-R8 with bin locations and no default in two ways: the bin location that was its default is deleted in Administration → Bin Locations while the part holds 0 there, or an untracked part is saved with bin locations and none marked default. |
| S5-E3 | A core has no row of its own on the Inventory list, in Export or on the Part Library list, so it cannot be ticked for a bulk change. Its name (S13-R15) and its history show on the core's own Part History page. The core reason in S10-R13a applies when a core reaches a status change by any other route. |
| S7-N7 | S7-N3 to S7-N6 do not apply to the parts CSV import. An import row whose number matches a part already stocked at this location updates that part (S13-N9a). It is never refused for a duplicate number. |
| S7-N8 | An import row with an empty part number is skipped. No message shows. |
| S7-N9 | An import row with an empty description never empties a description. An existing Part Library entry keeps its description. A new entry takes its part number as its description. |
| S7-N10 | An import row that adds a tracked part with no bin location puts the part in a bin named "Unassigned", which the import creates at the location if it is missing. On a new part that bin is the default bin. |
| S9-R10c | When two or more parts are left out, they are listed A to Z by part number, separated by ", ". Example: "These parts are inactive and were not added: AB-100, FF-5507." |
| S9-N3a | Opening Parts → Returns needs 'Vendor Order Management → View'. Starting a vendor return needs 'Vendor Order Management → Create & Edit'. A role with both and without 'Part Library & Inventory → View' opens a return and gets the S9-N3 access error when it searches for a part. |
| S11-R3c | While a part still uses the entry, the Delete button is disabled and hovering it shows "Part cannot be deleted. Please delete related parts first." |
| S12-R14a | A special-order lookup result is a part number this location received from a vendor on a special-order line (a received line with no inventory part, and not a core) in the last 12 months. |
| S12-R14b | When more than one vendor delivered that number in the last 12 months, the result names the vendor of the most recent delivery. |

Every code these new lines cite (S5-R8, S13-R15, S10-R13a, S13-N9a, S9-N3, S11-E4) exists in v29.

**REMOVED (0):** none.

**REWORDED (4)**

| Code | Old (v27) | New (v29) |
|---|---|---|
| S9-E11 | Reports keep inactive parts. Inventory Value, Parts Velocity and the dashboard include them, because their stock still has value and their history still happened. | Reports keep inactive parts. Inventory Value and Parts Velocity include them, because their stock still has value and their history still happened. |
| S10-R8 | For a reactivation from the bulk bar, the confirmation states "These parts can be added to new work again." ("This part ..." for one), followed by "Existing records that use them stay as they are." | … followed by "Existing records that use them stay as they are." ("... that use it ..." for one). |
| S11-R3 | Clicking a row opens that entry's detail page, where it can be edited and deleted. | Clicking a row opens that entry's detail page. The pencil beside the entry's name opens the "Edit Library Part" window, where the entry is edited and where its Delete button sits, bottom left. The detail page itself has no Delete button. |
| S12-R4 | The failure message when saving a Part Library entry reads "Failed to save library part." | The failure message when saving a Part Library entry reads "Failed to save library part." It shows only when the save fails for a reason this page does not name. A save refused for a named reason, such as S11-E4, shows that reason alone. |

### Changes outside requirement lines

| Where | Old (v27) | New (v29) |
|---|---|---|
| §2 Feature Overview, accounting bullets (line 39) | "- The dashboard's inventory figure and the opening inventory used for accounting keep untracked parts, because that stock still sits in the books." | "- The opening inventory used for accounting keeps untracked parts, because that stock still sits in the books." |
| Story 7, context note under S7-R6d (line 363) | "\*\\\* Context note (S7-R6d): many existing entries point to a manufacturer that no longer exists. The data cleanup in SV-10033 runs before this feature is released.\*" | "> \*\\* Context note (S7-R6d): … runs before this feature is released. Manufacturers cannot be deleted in ShopView, so an entry pointing to a missing manufacturer comes only from data saved before the release.\*" (sentence added; also now a quote block) |
| Story 7, new context note (S7-N7) | (none) | "Context note (S7-N7): in one rare case the import can still add a second part whose number differs from a stocked part only by punctuation, when the Part Library entry it matches is not the one stocked here. The duplicate merge tool cleans these up; the import does not refuse them." |
| Story 7, new context note (S7-N9) | (none) | "Context note (S7-N9): before this change, a blank description in an import file emptied an existing entry's description and saved a new entry with none. S7-N9 replaces that." |
| §8 User Feedback Summary table, new row (line 709) | (none) | `Delete on a Part Library entry a part still uses` · "Part cannot be deleted. Please delete related parts first." · "Hover text on the disabled Delete button (S11-R3c)" |

**Not changed:** the Status row, Business Case, Goals, Key Decisions, Terminology, Out of scope, and every other §8 row.

**Fact to note:** v29 contains **no mention of "dashboard" at all**. v27 had two (the §2 accounting bullet and S9-E11), and v27 had already removed the Critical Reorder rules S5-R14 and S9-E12. The PRD is now silent on what the dashboard's stock-value figures include for untracked or inactive parts (Engineering's 7 Oct comment item 8 had stated the dashboard keeps untracked parts). No comment explains either edit.

## 2. Confluence comments: `sources/confluence-comments-2026-10-14.md`

- 2 footer threads, 7 messages: the same ids and `createdAt` times as 13 Oct, bodies unchanged (checked).
- 0 inline comments in every status: open, resolved, reopened, dangling.
- **No comment is newer than 13 Oct 2026.** The newest is still Chris Ward's reply of 8 Oct 13:17:53 UTC.
- **Neither the v28 nor the v29 edit has a comment.**

## 3. Jira: `sources/jira-2026-10-14/CHANGED-2026-10-14.md`

24 issues under SV-10647 plus SV-10380, one page, same set as 13 Oct. **Updated after 13 Oct 2026 00:00 UTC: 1.**

| Issue | Updated (UTC) | What changed |
|---|---|---|
| SV-11041 (Verify Phase 4 - Untracked parts across lists, reports and counts) | 13 Oct 18:22 | "Covers" drops S5-R14 (range now S5-R2…R13) and S9-E12; checklist item "Dashboard Critical Reorder leaves out untracked and inactive parts (S5-R14, S9-E12); …" becomes "Supply filter shows untracked only under All (S6-R10)". Aligns the ticket with PRD v27. No comments. |

**Unchanged (23):** SV-10380, SV-10647, SV-10814 to SV-10826, SV-11038, SV-11039, SV-11040, SV-11042 to SV-11046.

## 4. Reading coverage

| Source | Size | Read |
|---|---|---|
| PRD v29 (`getConfluencePage` markdown body) | 75,226 characters / 757 lines | 100%, saved whole by script; every line compared with v27 by `diff` and by the code-extraction script; the full 48-line diff was read |
| PRD v27 (13 Oct copy) | 71,737 bytes / 740 lines | 100% by `diff` and script |
| PRD `fetch` (ARI) | 77,059 characters | metadata read (version, created, author); its text was not compared line by line with the markdown body |
| CQL `id = 829227015` | 1 result | 100% |
| Footer comments | 2 threads, 7 messages | 100% |
| Inline comments | 0 in all four statuses | 100% |
| Jira query | 24 issues, one page | 100% of key/summary/status/updated; SV-11041 description and comments 100%, diffed against the 13 Oct copy |

The Engineering tech plan and the design were not part of this check.
