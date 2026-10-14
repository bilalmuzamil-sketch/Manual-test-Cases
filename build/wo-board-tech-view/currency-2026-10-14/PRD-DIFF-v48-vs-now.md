# PRD diff — Confluence 845185030, page v48 (12 Oct 2026) → v49 (14 Oct 2026)

Compared by script (`PRD-DIFF-v48-vs-now.json`): `CONFLUENCE-845185030-2026-10-14.md` (page v48) against `CONFLUENCE-845185030-v49-2026-10-14b.md` (page v49, read 14 Oct 2026 after Chris Ward's edit). Code lines are compared after whitespace normalisation only.

Confluence diff: https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=48&selectedPageVersions=49

## Version history since our v48 copy

| Version | When (UTC) | Author | Version message | Compare |
|---|---|---|---|---|
| v49 | 2026-10-14 15:34:20 | Chris Ward | Bilal QA 14 Oct: S4-R28 approved lines; S3-R20c; S4-N5; S5-R11a/b; S1-R13c; Out of Scope; Status; Change Log from dev start (v34) | [diff 48→49](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=48&selectedPageVersions=49) |

## Counts

Requirement codes before 221 · now 225 · **added 4 · removed 0 · reworded 2** · identical 219.

## Added

### S1-R13c — v49, 2026-10-14 15:34 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=48&selectedPageVersions=49))

**Now:** A link or saved filter that opens Board View or Tech View with "Imported" selected opens the page in List instead, with Imported still selected and Board View and Tech View greyed out as in S1-R13a. The user's saved display is not changed, so their next visit without Imported opens it.

### S3-R20c — v49, 2026-10-14 15:34 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=48&selectedPageVersions=49))

**Now:** The column of S3-R20b takes no drops. Dropping a work order on it is refused with "This technician can't be assigned work orders." and the work order stays where it was. The column shows no inactive marker, because the technician is not deactivated (S3-N4). Once it holds no work orders, the column is no longer shown.

### S5-R11a — v49, 2026-10-14 15:34 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=48&selectedPageVersions=49))

**Now:** Estimated hours on a card is the total of the work order's lines with declined lines left out, the same figure as the work order page's Total Hours. It can differ from that page by up to 0.1 hours, because the page rounds each line to whole minutes. It can also differ from the List's Estimated Hours, which keeps its production figure (List is unchanged).

### S5-R11b — v49, 2026-10-14 15:34 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=48&selectedPageVersions=49))

**Now:** Wherever a technician is named on a card, a group header or a column header, the name is the technician's staff record name, the same name the List's Lead Technician column shows.

## Removed

None.

## Reworded

### S4-R28 — v49, 2026-10-14 15:34 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=48&selectedPageVersions=49))

**Was:** The shift-clearing prompt (S4-R11, S4-R26) shows only when the outgoing lead has a work-order-level shift on this work order that has not ended. A work-order-level shift is one that covers every current line of the work order, which is what the Schedule's Entire work order drop creates. A shift on only some lines does not show the prompt.

**Now:** The shift-clearing prompt (S4-R11, S4-R26) shows only when the outgoing lead has a work-order-level shift on this work order that has not ended. A work-order-level shift is one that covers every approved line of the work order, judged at the moment the lead changes; this is what the Schedule's Entire work order drop creates. Lines not yet approved, and declined lines, are ignored. On a work order with one line, a shift on that line counts, and so does a Choose lines shift that ticks every approved line. A shift on only some approved lines does not show the prompt, and that includes an Entire work order shift once a line has been added and approved after it was made.

### S4-N5 — v49, 2026-10-14 15:34 UTC ([diff](https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=845185030&selectedPageVersions=48&selectedPageVersions=49))

**Was:** Nothing can be dropped onto an inactive technician's column/group (S2-N2, S3-N2).

**Now:** Nothing can be dropped onto the column/group of an inactive technician (S2-N2, S3-N2) or of a technician who is not enrolled at this location (S3-R20c).

## Non-code sections

- **Status line:** was "In development: PRD v33, 2026-09-28. Remaining design items with Branko are tracked on the review child page." → now "In development: PRD v49, 2026-10-14. Every change since development started is listed in the Change Log (section 10).".
- **Out of Scope (section 2):** three bullets added (verbatim below). Nothing removed.
- **Change Log (section 10):** was an empty table of 9 blank rows; now 16 dated rows (2026-09-28 baseline v34 … 2026-10-14 v49), all reporter Chris Ward (verbatim below).
- **Everything else** (Business case, Key Decisions, Glossary, context notes, section 9 messages table): unchanged — the script finds no other changed non-code line.

## Every changed non-code line (script output)

```diff
-| **Status** | In development: PRD v33, 2026-09-28. Remaining design items with Branko are tracked on the review child page. |
+| **Status** | In development: PRD v49, 2026-10-14. Every change since development started is listed in the Change Log (section 10). |
+- A Work order preview panel that opens a List row in a side panel. A List row opens the work order page, as in production (List is unchanged). A later idea, not in this release.
+- Collapse all and Expand all controls for the technician groups. Groups collapse one at a time (S2-R5, S2-R13).
+- Find a column, Show all and Reset to default in the Columns menu. The column chooser is as described in S5-R1 and S5-R2.
-|  |  |  |  |
-|  |  |  |  |
-|  |  |  |  |
-|  |  |  |  |
-|  |  |  |  |
-|  |  |  |  |
-|  |  |  |  |
-|  |  |  |  |
-|  |  |  |  |
+| 2026-09-28 | Chris Ward | Development started after Milan's tech review, which was answered on 2026-09-25. Baseline: the PRD as of v34. | Every change since is listed below. |
+| 2026-09-29 | Chris Ward | Assigned to me hides groups and columns with none of my work (no muted look); the open count includes Complete; an Imported lock tooltip was added (S4-N9). v35. | S4-N9 was removed again in v48. |
+| 2026-09-29 | Chris Ward | Removing the lead uses the same shift prompt, and the lead change and the shift clearing succeed or fail together (S4-R26, S4-R27). v36. | FF-4. |
+| 2026-09-29 | Chris Ward | S9-R14: removing the lead moves the work order to the bottom of Unassigned; a work order created or split with a lead keeps the initial sort. v37. | Replaced in v38. |
+| 2026-10-01 | Chris Ward | S9-R14: removing the lead returns the work order to Unassigned in the initial sort, not the bottom. v38. | Slavcho, 29 Sep. |
+| 2026-10-02 | Chris Ward | New S2-R16 (a search keeps collapsed groups collapsed; the count shows matches), S2-R17 (Tech View pin order matches Board View), S2-R18 (Unassigned opens expanded, sticky header, loads in pages), S2-N4 (no pinning in Tech View with Assigned to me on), S2-N5 (no total row in Tech View), S7-R7 (Assigned Techs right after Lines). v39. | Slavcho, Tech View questions. |
+| 2026-10-06 | Chris Ward | S1-R12 (a header click keeps the place); S3-R20 empty column text ("Drag a work order here to assign it" for users who can reassign, "No work orders" otherwise); S4-R28 to S4-R31 (shift prompt trigger, wording, Cancel, scope); S4-N10 to S4-N12 (reorder and conflict alerts). v40. | Slavcho, drag-and-drop questions. |
+| 2026-10-07 | Chris Ward | New S3-R20a: the empty column of a pinned technician who can no longer be assigned work reads "No work orders". v41. | Narrowed in v44. |
+| 2026-10-07 | Chris Ward | New S7-R8 to S7-R10: on the Lines tab, a line with no labor technician but with scheduled technicians shows their names instead of "Unassigned", with no badge. v42. | SV-9769. |
+| 2026-10-08 | Chris Ward | S1-N1 rewritten to match the List's empty state; new S1-N1a ("No work orders match these filters", "Try removing a filter to widen your results.", Clear all filters) and S1-N1b (No work orders match the search "{search}", no button). v43. | QA automation finding. |
+| 2026-10-09 | Chris Ward | S3-R20a narrowed to a deactivated pinned technician. New S3-R20b: a pinned technician not enrolled at this location gets no column; if they still lead work orders here, they appear as a normal unpinned column. v44. | Matches the build (Sasha, SQ-11). |
+| 2026-10-12 | Chris Ward | S1-E3: Assigned to me stays as the user set it when the location changes (was: resets). v45. | SV-11098. |
+| 2026-10-12 | Chris Ward | S4-R8 context note: a technician on a line only through a Schedule shift does not keep the line; it follows the incoming lead. v46. | SV-11128. |
+| 2026-10-12 | Chris Ward | S4-R28 defines a work-order-level shift. v47. | SV-11126. |
+| 2026-10-12 | Chris Ward | Imported is List-only: new S1-R13a and S1-R13b; S4-N2 and the Story 4 prerequisite drop Imported; S4-N9 removed. v48. | Sasha's decision of 24 Sep. |
+| 2026-10-14 | Chris Ward | S4-R28: only approved lines count, judged when the lead changes. New S3-R20c (no drop onto a not-enrolled technician's column, no inactive marker, the column goes once empty); S4-N5 widened to match. New S5-R11a (card estimated hours follow the work order page's Total Hours) and S5-R11b (the staff record name on cards and headers). New S1-R13c (a link or saved filter with Imported opens List). Out of Scope adds the work order preview panel, Collapse all / Expand all and the extra Columns menu items. Status line updated. v49. | Bilal's QA questions, 14 Oct. |
```

## Identical codes

S1-R1, S1-R2, S1-R3, S1-R4, S1-R7, S1-R8, S1-R9, S1-R11, S1-R12, S1-R13, S1-R13a, S1-R13b, S1-R14, S1-N1, S1-N1a, S1-N1b, S1-N2, S1-N3, S1-N4, S1-N5, S1-E2, S1-E3, S2-R1, S2-R2, S2-R3, S2-R4, S2-R5, S2-R6, S2-R7, S2-R8, S2-R9, S2-R10, S2-R11, S2-R12, S2-R13, S2-R14, S2-R15, S2-R16, S2-R17, S2-R18, S2-N1, S2-N2, S2-N3, S2-N4, S2-N5, S2-E1, S2-E2, S3-R1, S3-R2, S3-R3, S3-R4, S3-R5, S3-R6, S3-R7, S3-R8, S3-R9, S3-R12, S3-R13, S3-R14, S3-R15, S3-R16, S3-R17, S3-R18, S3-R19, S3-R20, S3-R20a, S3-R20b, S3-R21, S3-R22, S3-N1, S3-N2, S3-N3, S3-N4, S3-E1, S3-E2, S3-E3, S3-E4, S3-E5, S4-R1, S4-R4, S4-R5, S4-R6, S4-R7, S4-R8, S4-R9, S4-R10, S4-R11, S4-R12, S4-R13, S4-R14, S4-R15, S4-R16, S4-R17, S4-R18, S4-R19, S4-R20, S4-R21, S4-R22, S4-R23, S4-R24, S4-R25, S4-R26, S4-R27, S4-R29, S4-R30, S4-R31, S4-N1, S4-N2, S4-N3, S4-N4, S4-N6, S4-N7, S4-N8, S4-N10, S4-N11, S4-N12, S4-E1, S4-E2, S4-E3, S4-E4, S4-E5, S4-E6, S4-E7, S4-E8, S5-R1, S5-R2, S5-R3, S5-R4, S5-R5, S5-R7, S5-R8, S5-R9, S5-R10, S5-R11, S5-R12, S5-R13, S5-N1, S5-N2, S5-N3, S5-E1, S5-E2, S5-E3, S5-E4, S5-E5, S5-E6, S6-R1, S6-R2, S6-R3, S6-R4, S6-R5, S6-R6, S6-R7, S6-N2, S6-E1, S7-R1, S7-R2, S7-R3, S7-R4, S7-R5, S7-R6, S7-R7, S7-R8, S7-R9, S7-R10, S7-N1, S7-E1, S8-R1, S8-R2, S8-N1, S8-E1, S9-R1, S9-R2, S9-R3, S9-R4, S9-R5, S9-R6, S9-R7, S9-R8, S9-R9, S9-R10, S9-R11, S9-R12, S9-R13, S9-R14, S9-R15, S9-N1, S9-N2, S9-N3, S9-E1, S9-E2, S9-E3, S11-R1, S11-R2, S11-R3, S11-R4, S11-R5, S11-R6, S11-R7, S11-R8, S11-R9, S11-R10, S11-N1, S11-E1, S11-E2, S12-R1, S12-R2, S12-R3, S12-R4, S12-R5, S12-R6, S12-R7, S12-R8, S12-R9, S12-R10, S12-R11, S12-R12, S12-R13, S12-R14, S12-R15
