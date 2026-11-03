# SV-11904 — Part Sale Fees & Discounts column: full fee name on hover, heading on one line (IN PROGRESS)

Ticket: https://shopview.atlassian.net/browse/SV-11904 · QA branch https://sv11904.qa.shopview.com · build v26.43.5-2999cf9
(index.html last-modified Mon 02 Nov 2026 16:52:15 GMT). Production before: build v26.43.5-77de68c, part sale P-85 (Trucks Hill 2).
QA lead settings: API mode · no recording · no technical section · phone check judged against Chris's ask (79907).
Sources: description (ours), Chris 79907 (rules), Dipesh 79976/79977 (handoff + test plan), handoff file (/tmp only, summarised here).

## Test data (branch, left in place)
- P2-162: row 1 Ignition Switch "Such a Long name testing" 5% (dev's) + "Disc" −2% (ours → +1 badge); row 2 Freight
  "ZZAUTOTEST Part Discount with a long name" −2%; row 3 Engine Oil Filter "ZZAUTOTEST Flat fee with a long name" +$5.00;
  row 8 "Fee" 3% (dev's). All added on screen (row ⋮ → Add Part Fee / Discount), 201 + "Fee added".
- P-248 (new, 684124d6…): two ZZAUTOTEST parts, no fees → then "ZZAUTOTEST Part Fee with a long name" 5% on row 1.

## Results so far (branch)
| Check | 1440 | 1024 | 768 | 1440 dark | phone 375/390 touch |
|---|---|---|---|---|---|
| cut name → full name on hover (3 cut names: fee %, discount %, fee flat) | PASS | PASS | PASS | PASS | tap: tooltip + viewer |
| name that fits ("Fee") → no tooltip | PASS | PASS | PASS | PASS | — |
| rate / +1 / +$5.00 → no tooltip, still visible | PASS | PASS | PASS | PASS | — |
| tooltip gone after moving away | PASS | PASS | PASS | PASS | — |
| heading one line, all headings 39 px | PASS | PASS | PASS | PASS | PASS (375) |
| cells line up with heading (x/w equal) | PASS | PASS | PASS | PASS | — |
| pinned Actions stays while scrolling | PASS | PASS | PASS | PASS | — |
| heading row 39 px without column → 39 px with (P-248) | PASS | | | | |
| Description / Sell Price widths unchanged when column appears (P-248) | PASS | | | | |
| click name → viewer with full names; close leaves nothing | PASS | | | | |
| hover then click without moving → tooltip gone at 0.4 s and 2 s | PASS | | | | |
| phone: tap shows full name (Chris 79907) | | | | | PASS (tooltip + viewer list) |
| phone: tooltip stays OVER the open viewer (handoff expects it not to) | | | | | stays ≥6 s, clears on next tap — ASK QA LEAD |

Notes:
- Cell shows names in Title Case (CSS); tooltip + viewer show the name as typed. Bucket (c): styling, full name readable.
- 768 first run hovered empty space (table below the fold) — my script, fixed by scrolling each cell into view (Rule 79c).
- Phone: two tap methods (touchscreen.tap, locator.tap) at 390×844 agree; Chrome device emulation with touch, not a real phone.

## Production before (build v26.43.5-77de68c, P-85 at Trucks Hill 2, 1440)
- Added on screen: "ZZAUTOTEST Part Fee with a long name" 5% + "Disc" −2% on row 1 (201 + toasts). Test data left.
- Heading "Fees & Discounts" on 2 lines, heading row 49 px; name cut to 41 px; hover on name / 5% / +1 → nothing.
- Gotcha: production screen location was Truck Hill 1 → part sale page bounced to the list. Fixed by switching the
  on-screen location first (scripts/loc.mjs).

## Work order Parts tab (Chris: "stays as it is")
- Branch S2-4219 vs production S2-1788 (different orders, no shared record): same 13 headings in the same order, no
  Fees & Discounts column on either, heading row 47 px on both; fixed widths equal (Part Number 94, Quantity 70, Cost/Core/
  Sell Price 82, Margin 86, Category 224, Requested At 98). Description/Vendor/Status/Actions widths follow each order's data.

## Exhibits (ev/)
before-after-1440.png · every-kind-of-name-1440.png · other-widths-and-dark.png · viewer-full-names.png ·
phone-tooltip-over-viewer.png (for the open question).

## Still to do
- Pre-post gate + comment, after the QA lead answers the phone-tooltip question (asked 3 Nov).

## Posted 3 Nov 2026 — QA lead ruling: "Partially passed" (two comments, Rule 115)
- Gate: branch marker re-read v26.43.5-2999cf9 (unchanged); P2-162 test data re-read live (4 fee cells as named);
  ticket re-read (no comment after Dipesh 79977, status TESTING QA); text scanned: no AI fingerprints, no technical section.
- **79984** WHAT PASSED (green): Chris's 3 points quoted, 14-row table (13 PASSED + production REPRODUCED), 4 images in order
  (before-after-1440, every-kind-of-name-1440, other-widths-and-dark, viewer-full-names), steps. Echo: 4 media, 14 rows.
- **79985** OVERALL QA STATUS: PARTIALLY PASSED (warning panel) — last comment: phone tooltip stays over the viewer, picture,
  5 steps, current/expected with the handoff quote, environment, @Dipesh Changawala. Echo: 1 media, mention present.
- Status left in TESTING QA (not fully passed). No label added.
- Learning check: (1) the production screen location must match the record's location or the page bounces to the list —
  scripts/loc.mjs; (2) at 768 the table is below the fold — scroll each cell into view before hovering (my first 768 run
  hovered empty space); (3) production has no test id on the fee name — screenshot by position, not by id.

## 3 Nov — Dipesh 79993: "couldn't reproduce … Which device preset did you use, and was it a quick tap or a press-and-hold?"
Our 79985 named neither, and our "phone" set-up was 375/390 wide + touch with the DESKTOP browser identity (body class
`desktop touch`), which is not what a DevTools device preset gives. Re-run live on the same build v26.43.5-2999cf9
(fix not deployed yet), P2-162 row 1, gestures sent with exact durations (scripts/devtap.mjs), tap target confirmed by
elementFromPoint = text_part_adjustment_name_c6a8c0ad…:

| Set-up (body class) | Quick tap (~160 ms) | Press-and-hold (~900 ms) |
|---|---|---|
| iPhone 12 Pro preset 390×664 dpr 3 (mobile touch platform-ios) | viewer opens, no tooltip at 0.5/3/6 s — NOT REPRODUCED | tooltip during hold; viewer on release; tooltip gone — NOT REPRODUCED |
| Pixel 7 preset 412×839 dpr 2.625 (platform-android) | same — NOT REPRODUCED | same — NOT REPRODUCED |
| iPhone SE preset 320×568 dpr 2 (platform-ios) | same — NOT REPRODUCED | same — NOT REPRODUCED |
| Desktop Chrome + touchscreen 1440×900 (desktop touch) | tooltip stays with viewer open, 0.5/3/6 s — REPRODUCED (beside the viewer) | REPRODUCED |
| Desktop Chrome + touchscreen 1024×768 (desktop touch) | REPRODUCED (over the viewer) | REPRODUCED |
| Our original 390×844 + touch, desktop identity (desktop touch) | REPRODUCED | REPRODUCED |
| Desktop with mouse (earlier run) | not reproduced (tooltip gone at 0.4 s) | — |

=> Our remaining item was mis-described: it does NOT happen on phones; it happens on a desktop browser with a touchscreen
(touchscreen laptop). 79984 row 12 ("tooltip and viewer" on a phone tap) is also wrong for real phone presets: a quick tap
shows the viewer only. Honest limit: Chrome device emulation, not a real phone or a real touchscreen laptop.
Exhibit: ev/phone-vs-touch-laptop.png; raw frames + json: ev/dev/. Lesson saved: Standing Rule 120, LESSONS-INDEX, playbook §AY.
Nothing posted yet — taken to the QA lead first (Rule 106(d)).

## 3 Nov — Dipesh 79996: fix deployed. Retest on build v26.43.5-51811b2 (last-mod Tue 03 Nov 2026 10:11:37 GMT)
Marker read 10:37 UTC and again right before posting (unchanged). Same P2-162 row 1, gestures by CDP with exact
durations (scripts/devtap.mjs, OUT=ev/dev2), states read at 0.5/3/6 s, Chrome 153.0.8010.12:

| Set-up (body class) | Quick tap | Press-and-hold |
|---|---|---|
| iPhone 12 Pro 390×664 (mobile touch platform-ios) | viewer, no tooltip (197 ms) | name during hold; viewer, no tooltip (931 ms) |
| Pixel 7 412×839 (platform-android) | viewer, no tooltip (195 ms) | same (895 ms) |
| iPhone SE 320×568 (platform-ios) | viewer, no tooltip (179 ms) | same (905 ms) |
| Desktop Chrome + touch 1440×900 (desktop touch) | viewer, no tooltip (182 ms) — was REPRODUCED | viewer, no tooltip (912 ms) — was REPRODUCED |
| Desktop Chrome + touch 1024×768 | viewer, no tooltip (183 ms) — was REPRODUCED | viewer, no tooltip (927 ms) — was REPRODUCED |
| Desktop Chrome + touch 390×844 | viewer, no tooltip (154 ms) — was REPRODUCED | viewer, no tooltip (901 ms) — was REPRODUCED |
=> 12/12 not reproduced on the fix build. (On desktop+touch a hold now shows no tooltip during the hold either; the viewer
lists every name in full — the handoff says a tap opening the viewer is the expected touch result.)

Regression on the new build (ev/m2*): hover full name at 1440/1024/768/1440 dark on all 3 cut names, no tooltip on Fee/5%/+1/+$5.00,
gone after leaving; heading one line 39 px everywhere (only 'more_vert' icon reports 3 "lines" — same on the old build);
click -> viewer full names, close leaves nothing; hover-then-click -> tooltip gone at 0.4 s and 2 s;
new part sale P-249 (6c214e00…) 39 px without fees -> fee "ZZAUTOTEST Part Fee with a long name" 5% added on screen (201,
"Fee added") -> 39 px, Description 168 / Part Number 124 / Sell Price 82 / Actions 122 unchanged, Fees & Discounts 120, hover
shows full name; WO Parts tab S2-4219: same 13 headings, 47 px, no Fees column, fixed widths as before.

Exhibit: ev/fix-before-after-touch-laptop-1024-quick.png (old frame from ev/dev; it did not record boxes, so the viewer box
was taken from the new run (same viewport) and the tooltip box measured from pixels: grey 117,117,117, rows 440-501,
cols 1436-1779 at dpr 2). Uploaded as media f3483cea-6c88-4f08-ae4b-6e8f01621aed.

Posted (gate: marker re-read unchanged, test data re-read, ticket re-read — last comment still 79996, status TESTING QA,
text scan clean, no technical section):
- 79984 edited 05:48 UTC-5: row 12 rewritten for phone presets + dated note. Echo: 4 media, 14 rows.
- 79985 edited 05:48 UTC-5: heading/step 1/environment corrected to touchscreen laptop + dated notes. Echo: 1 media.
- **79997** NEW (Rule 112): OVERALL QA STATUS: PASSED, answers Dipesh, before/after picture, 6-row set-up table (old vs new),
  9-row re-check table, steps, honest limit (Chrome emulation, not a real device). Echo: 1 media, 6 + 9 rows, mention.
- Label QAcomplete + status move: the label edit was refused by the tool permission check — NOT done. Available
  transitions from TESTING QA: Blocked, Close (OBSOLETE), QA Complete, Rejected from Testing (no direct Ready for Production).
  Waiting on the QA lead.
Learning check: (1) after a "couldn't reproduce" the dev may deploy a fix before you reply — re-read the marker before
replying and retest on the new build instead of answering about the old one (Rule 59/72); (2) devtap/meas/viewer now take
OUT so old evidence is not overwritten.
