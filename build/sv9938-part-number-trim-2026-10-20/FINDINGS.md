# SV-9938 — Part Number not trimmed; "0" treated as blank (QA branch sv9938)

**Environment:** https://sv9938.qa.shopview.com, build **v26.40.19-f2443c6** (index.html last-modified Tue 20 Oct 2026 09:10:31 GMT, etag 2c0d4ebe…), Admin ShopView, Staging Heavy Duty - 9919, 20 Oct 2026, 1440×900.
**Production before:** app.shopview.com, build v26.40.21-81fa887, work order S2-868 (Trucks Hill 2).
**Ticket (live, 20 Oct):** TESTING QA, assignee Parth Fadadu; QA Branch set by Stefan Mitrovic 19 Oct. No developer handoff comment.
**Expected (Chris Ward, 77580, 29 Sep, "for new entries only"):**
1. Leading and trailing spaces removed before saving ("PF-2135 " → "PF-2135").
2. Only spaces = empty: never replaces a saved part number; same rules as an empty field.
3. "0" is a real part number, saved as 0.
4. Change check trims the new value too: re-saving "PF-2135" over "PF-2135 " is not a change.
Out of scope: existing data with stray spaces stays; shared empty-text helper unchanged.
QA lead: no recording, no technical section.

Test work order on the branch: `ada61543-a6e2-4d5b-b5fe-d30e0d29b738` (Desert Edge Truck Service & Repair, 2 approved lines), vendor parts ZZ9938-*-38519.

## Branch matrix — Edit Part Request (pencil on the part row), Part Number box
| # | Part had | Typed | Save | Stored after | Rule |
|---|---|---|---|---|---|
| bA | ZZ9938-A-38519 | one space | refused: red message **"Part Number is required"** | ZZ9938-A-38519 (kept) | 2 PASS |
| bA3 | ZZ9938-A-38519 | three spaces | refused: "Part Number is required" | kept | 2 PASS |
| bA2 | ZZ9938-A-38519 | cleared (empty) | screen also clears Description/Category and shows "Description is a required field", "Category is a required field" (no save) | kept | (the empty-field comparison) |
| bB | ZZ9938-B-38519 | 0 | saved | **0** | 3 PASS |
| bE | (none) | 0 | saved | **0** | 3 PASS |
| bD | ZZ9938-D-38519 | ZZ9938-D-38519 + trailing space | saved | ZZ9938-D-38519 (no space); **no "Part number changed" in the Work Order Log** | 1 + 4 PASS |
| bF | ZZ9938-F-38519 | three leading spaces + ZZ9938-F-LEAD | saved | ZZ9938-F-LEAD; log shows "Part number changed" | 1 PASS |
| bG | (none) | cleared | saved | empty | baseline |
| bH | (none) | two spaces | saved | empty — same as bG | 2 PASS |

Work Order Log on the branch WO: "Part number changed" only for B, E, F (real changes); none for D.

## Branch matrix — new parts
| # | Where | Typed | Stored |
|---|---|---|---|
| nT | line → + Add Part row | ZZ9938-NEW-T + trailing space | ZZ9938-NEW-T |
| n0 | + Add Part row | 0 | 0 |
| nS | + Add Part row | three spaces | empty |
| rL | line ⋮ → Request part → New Part Request | two leading + one trailing space around ZZ9938-DLG-L | ZZ9938-DLG-L |
| r0 | New Part Request | 0 | 0 |

## Production before (app.shopview.com v26.40.21-81fa887, S2-868 line "ZZQA9807 Line B", 20 Oct)
| # | Part had | Typed | Production result |
|---|---|---|---|
| pA | ZZ9938-A-02432 | one space | **saved — real number replaced by " "** |
| pB | ZZ9938-B-02432 | 0 | **refused: "Part Number is required"** |
| pE | (none) | 0 | saved, **stored empty** (0 lost) |
| pD | ZZ9938-D-02432 | same + trailing space | **stored with the space**; log "Part number changed ZZ9938-D-02432 → ZZ9938-D-02432" |
| pF | ZZ9938-F-02432 | 3 leading spaces + ZZ9938-F-LEAD | stored with the leading spaces |
| pH | (none) | two spaces | **stored "  "** |
| pnT | + Add Part row | ZZ9938-NEW-T + trailing space | stored with the space |

Also seen: on a received part the Part Number box is disabled (branch), so that path cannot be edited on screen.
Side note (Mudassir also saw it): clearing Part Number in Edit Part Request also clears Description and Category (no save happens).

## Outcome — 20 Oct 2026
- **Mudassir Qamar passed SV-9938 at 04:13 CDT (79080)** and moved it to Ready for Production at 04:14 CDT; the branch was torn down while I was capturing (502 from ~10:10 UTC). His note: rule 4 "Not tested in the UI".
- QA lead's ruling (asked): **"Short note on rule 4"** → posted **comment 79093** (Rule 4: PASSED, checked on screen through the Work Order Log, production vs branch), tagging Parth. Read back: PASSED panel first, 4 numbered steps, 1 picture 900×813 (attachment 62701). Pre-post gate: ticket state and comments unchanged since read; text scan clean.
- Honest limit stated in the comment: the rule's own example (an old number already stored with a space) can't be built on the branch because new saves are trimmed; checked the other direction (new value carries the space). The branch log result comes from the log data read during the test; no screenshot of the branch log exists because the branch was taken down.
