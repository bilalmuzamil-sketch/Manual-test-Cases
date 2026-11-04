# PRD diff v35 -> v36 (Confluence 829227015), by requirement code — 4 Nov 2026

v35: `sources/CONFLUENCE-829227015-2026-10-28.md` (edited 27 Oct 2026). v36: `sources/CONFLUENCE-829227015-v36-2026-11-04.md` (3 Nov 2026, Chris Ward).
Compared by pllib's parser (requirement lines, named items, feedback rows), not by line: v36 was converted from ADF by another script (its
context notes start `** Context note` instead of `> *\* Context note`; pllib now reads both). Codes: 317 and 317, none added or removed.
Named items (bullets, context notes, 49 feedback rows): the same 127 keys, every v35 text word for word in v36.

| Code | v35 | v36 |
|---|---|---|
| S6-R5 | Tracked parts sort against each other by quantity. | Tracked parts sort against each other by the quantity shown in the Total Qty column. The printed count sheet follows the same order. |
| S11-R3c | While an inventory part, an open part request or a part return still uses the entry, the Delete button is disabled and hovering it shows "Part cannot be deleted. Please delete related parts first." | While an inventory part, an open part request, a work order line that received it, or a part return (open or credited) still uses the entry, the Delete button is disabled and hovering it shows "Part cannot be deleted. Please delete related parts first." |
| S13-R19a | A line that only shares the old number, typed in by hand with no link to this part, keeps its number. | (same sentence) A part request added by picking this part's Part Library result is linked to it, and takes the new number. |

Change Log row 2026-11-03 (Chris Ward): rulings on SV-12105, SV-12110 and SV-12115.
