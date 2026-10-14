# Part Lifecycle design — what changed between the 8 Oct and 13 Oct copies

Design: canvas artifact Vz6rprcWyP16tYxzM1kdeE "Parts Lifecycle Update", read 13 Oct 2026 with the Artifact tool.
Raw page `artifact-raw.html`: 10,412,871 bytes (8 Oct: 10,170,839). 53 embedded files (`files/`, md5 in
`board-files-md5.txt`); board images in `png/` (47). No design comments (empty list, as on 8 Oct).

## File by file (md5 compared with design-2026-10-08-artifact/board-files-md5.txt)
| File | Change | What it shows now (read by viewing the image / reading the text) |
|---|---|---|
| ListBefore.dc.html | removed | replaced by board 4.0 below |
| bulk-00-list-production.dc.html | NEW (board 4.0) | Image of today's Inventory list (production code). Column headers: Description, Part Number, Tags, Category, Manufacturer, Vendor, Bin Location / Quantity, **Total Qty**, Avg Cost, Core, Sell Price, Min, Max, Last…; filters "Bin Location: All bin locations", "Category: All categories", "Supply"; "New Inventory Part"; sidebar Inventory / **Catalog**. No Active/Inactive tabs, no checkboxes. |
| tracking-00-p5-1-tooltip (5.1) | image changed | Tooltip now reads "Tracked parts keep a stock count, with Min and Max. Turn this off for items you don't count. Untracked parts are left out of the Inventory Value report." (matches PRD S4-R3). Dialog: Edit Inventory Part, Active chip, Part Status Active/Inactive, Inventory Tracking, Delete Part / Cancel / Save. |
| daily-05-p6-2-canned-warning (6.2) | image changed | Warning toast now reads "These parts are inactive and were not added: GREASETUBE." with "Close" (8 Oct: "GREASETUBE is inactive and was not added."). |
| tracking-02-p5-3-list-not-tracked (5.3) | image changed | Column header now "Total Qty" (was "Total Quantity"); row shows "Not Tracked". |
| tracking-03-p5-6-search-not-tracked (5.6) | image changed | Same header change; search "not tracked". |
| tracking-06-p5-7-cycle-count-untracked (5.7) | image changed | Same header change; cycle count mode (Save, Cancel, "Count changes available: 200"); untracked row shows "Not Tracked" in Total Qty and Count. |
| correct-06-p2-6-history-other-location (2.6) | html changed, image same | The Part History table at Lethbridge is now redrawn as text over the screenshot: columns Staff / Date / Time / Event; six entries "Description updated | Original description: … | New description: … | Changed at: Staging Heavy Duty - 9919" and "Part number updated | Original number: … | New number: … | Changed at: Staging Heavy Duty - 9919". |
| canvas.json (notes) | 10 notes changed | Notes now: S8-R7 / S8-N1a permission wording; entries at the change location carry no "Changed at" (S10-R25); board 2.6 keeps production column widths and says the build still narrows Staff/Date/Time ("needs fixing to match"); board 4.0 = production screenshot, "The quantity column reads \"Total Qty\""; S4-R3 tooltip with the Inventory Value sentence; "Total Qty" wording in S4-R8 / S6 notes; S9-R10 / S9-R10b single warning naming each part by the inventory part's own number. |
| all other 40 boards and 4 Before boards | unchanged (same md5) | read on 8 Oct: `../design-2026-10-08-artifact/BOARDS-TRANSCRIPT-2026-10-08.md` holds their text; identical bytes, so that transcript still applies. |

## Effect on the 8 Oct design-vs-PRD questions
- Board 5.1 tooltip lacked the Inventory Value sentence → now has it (resolved).
- Board 6.5/6.2 old per-part canned-job wording → now the single-warning wording (resolved).
- Canvas note on 2.4 "Changed at" at the change location → note now says no "Changed at" there (resolved).
- Canvas note "saving any untracked part needs Delete" → now S8-R7 / S8-N1a wording (resolved).
- Board 2.6 narrowed columns → note now says production widths are kept and the build must be fixed (resolved in the design; a build check).
- "Total Quantity" vs "Total Qty" → boards now say "Total Qty", like the PRD (resolved).

## Trap (13 Oct 2026): the saved page needs re-escaping before a browser can open it
The Artifact tool's saved raw page (`artifact-raw.html`) holds the design's files as JSON inside
`<script type="application/json" id="appifact-doc">`. In this copy, 51 `</script` sequences inside that JSON were saved
unescaped, so the browser ends the script early and the canvas renders as loose text (0 buttons). The 8 Oct copy had them
escaped. Fix: replace `</` with `<\/` inside that JSON only (the JSON value is unchanged, checked by script). The working
page is `artifact-page.html` (16 buttons, 8 frames, same as 8 Oct); `artifact-raw.html` is kept as received.
- 14 Oct 2026: design re-read with the Artifact tool; all 53 embedded files have the same md5 as the 13 Oct copy (unchanged), so the 13 Oct copy and its drive results stand.
