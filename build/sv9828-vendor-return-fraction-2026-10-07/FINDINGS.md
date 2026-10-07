# SV-9828 — Vendor return: partial quantities lose their fraction — QA findings (7 Oct 2026)

**Ticket:** [SV-9828](https://shopview.atlassian.net/browse/SV-9828) · Bug · Medium · TESTING QA · assignee parth fadadu · reporter Dusan Bulovan · no parent, no links. Found while tracing SV-9681.
**Expected behaviour (source):** Chris Ward, comment **77578** (29 Sep): item 1 — *"Partial quantities lose their fraction. Returning 2.5 gallons takes only 2 off stock … Fix: take the exact returned quantity off stock, decimals included."* · check: *"return 2.5 of a part to a vendor, and on-hand stock drops by exactly 2.5."* · item 2 — *"Stock may still be overstated from single-item returns made while the old bug was live … Find the parts affected and send the list to Support."*
**QA handoff:** Parth, comment **77605** — use **Receive Credit for a core return** (bug path); **Create Return → Save Return** is the control and must stay exact; item 2 *"has no UI repro. It needs a data query."*
**PR:** ShopView/shopview#3372 (open), fix commit `9cc1f92` (+ merges of main `a6880ac`, `71ec2f7`, `a4b34da`). Changes: `UpdateInventoryWhenPartGetsReturnedToVendor` (exact deduction, default + named bins), `UpdateInventoryPartWhenReturnGetsDeleted` (exact restore), `AddReturnItemCommand` (no truncation). Item 2 explicitly not in the PR.
**AFTER build:** `sv9828.qa.shopview.com`, front end `v26.40.8-71ec2f7` (last-modified Wed 07 Oct 2026 08:35:19 GMT).
**BEFORE (Rule 86):** production `app.shopview.com`, `v26.40.10-9b663ae`.

## Set-up (per-ticket branch, no clean-up)
P550848 (FUEL/WATER SEPARATOR, vendor Hester & Sons) had no core on the branch → given one with `inventory/parts/change {…, core:true, core_charge:25}`; core part `b919e7ca…` (same vendor, 6 on hand). Work orders seeded by API (customer 4 Star Truck Repair, canned line *Service - Battery service*); **everything under test clicked on screen**: inline Add Part (qty), **Pick**, core **Ok**, Parts → Returns tick → **Receive Credit** → Credit Memo # → **Post Credit**; **Create Return → Save Return**; **Cancel Return → Yes**.
**Core stock is not shown on any screen** — core parts are not listed in Parts → Inventory on the branch **or on production** (5 cored production parts checked, none of their cores listed), and the part edit window shows only *Core Charge*. Core stock was therefore read from the part record (`GET /api/inventory/parts/{coreId}`). Main-part stock is shown on screen as the Inventory badge *"N Available"*.

## Results — branch (`v26.40.8-71ec2f7`)
| # | Path | Work order / part | Returned | Stock before → after | Change | Result |
|---|---|---|---|---|---|---|
| 1 | Receive Credit, core return | S9828-17580 / P550848 core | 2.5 | 6.00 → 3.50 | −2.5 | PASS |
| 2 | Receive Credit, core return | S9828-17581 | 0.5 | 3.50 → 3.00 | −0.5 | PASS |
| 3 | Receive Credit, core return | S9828-17582 | 1.25 | 3.00 → 1.75 | −1.25 | PASS |
| 4 | Receive Credit, core return (whole number) | S9828-17583 | 3 | 1.75 → −1.25 | −3 | PASS |
| 5 | Receive Credit, received qty edited to 1.5 of 2.5 | S9828-17584 | 1.5 | −1.25 → −2.75 | −1.5 | PASS |
| 6 | Create Return → Save Return (control), screen badge | MD668D ATF bulk | 2.5 | **20 Available → 17.5 Available** | −2.5 | PASS |
| 6b | Create Return of a part WITH a core adds two rows (part + core) | P550848 | part 1 / core 2.5 | main 20 → 19, core −2.75 → −5.25 | exact both | PASS (my first attempt typed 2.5 into the core row; quantity box is `input_return_qty_0_0` once a part is chosen) |
| 7 | Cancel a manual return (restore) — via `POST /api/part/manual-return-request/{id}/cancel` | MD668D | 2.5 | 17.5 → 20 | +2.5 | PASS (back end) — **and on screen, 7 Oct ~16:45Z: Cancel Return > Yes > "Are You Sure?" cancelled 0.50 (16.75 → 17.25) and 2.00 (badge *17.25 → 19.25 Available*), row gone after reload** |
| 8 | Delete a completed vendor return — `POST /api/inventory/returns/delete {id}` (no screen) | core + MD668D | 1.5 / 2.5 | core −5.25 → −3.75, MD668D 17.5 → 20 | +1.5 / +2.5 | PASS (back end only) |
| 9 | Add a single item to an existing return (original bug) — `POST /api/inventory/returns/add-item {return_id, quantity, inventory_part_id}` (no screen) | MD668D | 2.5 | 20 → 17.5; item stored as 2.50 | −2.5 | PASS (back end only) |
| 10 | Picking a 2.5 part | P550848 | 2.5 | 6 → 3.5 | −2.5 | exact (not this ticket, recorded) |

Not applicable: a non-core inventory part has no Return in its ⋮ menu (only *Move* / *Add Part Fee / Discount*), so Receive Credit only moves stock for core returns.
Back-end probe side effect: `add-item` with only `return_id` + `quantity` returned 201 and stored a part-less 2.50 item on return ZZE (matches the PR's deferred "no validation" note); the return was later deleted.

## Production BEFORE (bug reproduced on screen)
Work order **S2-963** (Trucks Hill 2, customer *aa*), part **1238214 (A428)** at quantity 2.5, Pick, core **Ok**, Returns → **Receive Credit** showed *Received quantity* **2.50** → Post Credit → core **32 → 30 (−2)**. Evidence `ev/prod/confirm.png`, `ev/prod/result.json`.

## ❌ WITHDRAWN — my false observation "Cancel Return does nothing" (kept as the record)
**It was wrong.** After **Yes** the same window relabels Yes to an orange **"Are You Sure?"** (`button_remove_return_confirmation_answer`); I never clicked it. With the second click the cancel is sent and the stock comes back exactly (above, row 7). The QA lead marked SV-10993 Obsolete (78157) and the same trap was already in LESSONS-INDEX (2 Oct, SV-10406). New Standing Rule 102 + `s.confirm()` helper. The original text follows, struck by this heading:
Parts → Returns → ⋮ on a **Manual** return → **Cancel Return** → dialog *"Warning! This will permanently delete the return…"* → **Yes**: the dialog closes, **no request is sent**, no message, the row stays, stock unchanged. Front-end code says Yes should call `POST part/manual-return-request/{id}/cancel` and toast *"Manual return cancelled successfully"*. Reproduced on **production `v26.40.10-9b663ae`** (ZZT-FIB-1002, 7 → 4.5 after Create Return; Cancel Return → still 4.5) and on the branch (MD668D). The endpoint itself works (row 7). **SV-9498** (customer E2 Trucking, cancel manual returns) was **QA-passed by us on 10 Sep** when the button worked → this looks like a **regression**. Not caused by SV-9828 (PR is back-end only). Bucket: (a) confirmed defect, already-closed ticket SV-9498 covers the symptom. **Raised with the QA lead before any ticket.**

## Production clean-up (restore-after)
Manual return cancelled via endpoint (ZZT 4.5 → 7); vendor credit **ZZ9828PROD** deleted (`inventory/returns/delete`, core 30 → 32); part removed from S2-963 (main 27.5 → 30); S2-963 deleted (re-read → 400). Removing the part also added 2.5 to the core (34.5) — corrected with a cycle count. **Final: main 30 = 30, core 32 = 32, ZZT-FIB-1002 7 = 7.** Location left at Trucks Hill 2.

## Branch state left
P550848 now has a core (b919e7ca…); stock values moved by the tests; work orders S9828-17580…17585; credits ZZB–ZZD remain (ZZE deleted). Per-ticket branch, no clean-up.

## QA lead's rulings (7 Oct)
*"Partially passed, item 2 (Recommended)"* · Cancel Return: *"New ticket (Recommended)"* · technical section *"No"* · side question answered: Rule 88 (UI ↔ API) confirmed.

## Cancel Return ticket — SV-10993 (filed in error; marked OBSOLETE by the QA lead 7 Oct 11:39 −0500)
Pre-ticket check: standard read; Jira searched on the symptom (SV-9498 Done, QA-passed by us 10 Sep; SV-10837 OBSOLETE part-sale; no open duplicate); reproduced with **brand-new returns three times on screen** (MD668D 1.00 / 2.00 / 0.50: stock 20→19 stays 19, 19→17 stays 17, 17→16.5 stays 16.5) plus once on production (ZZT-FIB-1002 7→4.5 stays 4.5). After **Yes** the page sends three reports to the error tracker and no cancel request — the cancel endpoint itself works when called directly (+2.5 exact). Steps walked live (top **Parts** → left **Returns** → ⋮ → **Cancel Return** → **Yes**).
**[SV-10993](https://shopview.atlassian.net/browse/SV-10993)** "Parts > Returns: Cancel Return on a manual return does nothing" — Bug · Medium · Product Area Parts (copied from SV-9828) · no parent (SV-9828 has none) · Relates SV-9828 + SV-9498 · 3 images (61926–61928). Read back: media `file` ×3 at 1630×322 / 688×421 / 1630×496, table 5 rows, list numbering continuous (images sit inside their steps), 0 jargon hits.

## Pre-post gate (Rule 72, with today's amendment) — ~16:20Z
Front-end marker `v26.40.8-71ec2f7` unchanged · PR #3372 head `a4b34da` unchanged · SV-9828 TESTING QA, 4 comments (last 78007) · **fresh live result: add-item 0.75 → MD668D 16.5 → 15.75 (exactly 0.75)** · fingerprint scan 0 hits · example numbers in the steps updated to the live badge (15.75).

## Posted
- **78155** (11:21:29 −0500): yellow *"OVERALL QA STATUS: PARTIALLY PASSED"* (waiting on item 2), Chris 77578 item 2 quoted, 12-row table, 3 images (61931–61933), on-screen steps (Create Return path, visible) + the core path with the honest note that core stock is not shown on screen, separate-issue paragraph → SV-10993.
- **78156** (11:21:29 −0500): @parth fadadu — who produces the item-2 list for Support, and when.
- Read back (v3 ADF): 78155 panel `warning`, media `file` ×3 in order (1550×430, 1223×364, 1503×245), tableRow 13, listItem 15, SV-10993 link present; 78156 mention resolved.

## My own slip, recorded (caught before reporting)
The first Create Return control run showed the badge **20 → 19** for a "2.5" return and looked like a defect. It was **my input**: a part with a core opens **two rows** (part + core), and after a part is chosen its quantity box becomes `input_return_qty_0_0`, so my 2.5 had gone into the core row. Stored values proved both rows exact (1 and 2.5). Re-run with a core-less part: 20 → 17.5.

## Learning check (Rule 95)
Recorded: playbook §AC.15 addendum 6 (returns screens, labels, endpoints, core stock not on screen, Create Return quantity box, Cancel Return dead); LESSONS-INDEX row (a "wrong number" on a form with a hidden second row is my input until the stored values say otherwise); `ticket_exhibit.py` gained an optional `'right'` badge side (a left badge covered the "No" button), backwards compatible (SV-10142 exhibits rebuilt byte-identical); Jira `/rest/api/2/search` is retired → `/rest/api/3/search/jql`.

## Correction pass — 7 Oct 2026, ~16:40–16:55 UTC
- QA lead: SV-10993 was not a defect (second confirmation missed); SV-9828 rejected from testing for Parth to do item 2.
- Re-verified Cancel Return on screen with both clicks (sv9828 `v26.40.8-71ec2f7`): 0.50 return → MD668D 16.75 → 17.25; 2.00 return → Inventory badge **17.25 → 19.25 Available**; one `POST …/manual-return-request/{id}/cancel` each; rows gone after reload. The new `s.confirm()` helper then cancelled the P550848 manual core return (3.50) in one call (steps: Yes → "Are You Sure?" → dialog closed). The MD668D 1.00 return had already been cancelled by the QA lead (stock 15.75 → 16.75 before my run).
- Exhibit `ev/04-cancel-return-restores-hd.png` (attachment 61940).
- **Comment 78155 edited in place at 11:50 CDT** (Rule 100 notes on the top, row 8 and the new picture): row 8 now on-screen PASSED, "Separate issue … SV-10993" paragraph removed. Pre-post gate: marker `v26.40.8-71ec2f7` unchanged, ticket REJECTED FROM TESTING read live, fingerprint scan 0 hits. Read back: panel warning first, 4 images in order 01–04, 13 table rows, no SV-10993 text. Previous text kept as `comment-as-posted-78155.txt`.
- SV-10993 left exactly as the QA lead set it (Obsolete) — not touched.
- Learning check: Standing Rules 102 (double confirmation) + 103 (re-open tickets before calling them outstanding); `qa-session.mjs` `confirm()`; playbook §AC.15 addendum 6 corrected; LESSONS-INDEX row; register updated with live states.

## Screen recording added to 78155 — 7 Oct 2026, 12:43–13:20 CDT (QA lead: "Yes")
- Recording: `ev/sv9828-cancel-return-recording.mp4` (3:35, 2,566,518 bytes, 1280×674, H.264), filmed on sv9828 `v26.40.8-71ec2f7`: MD668D 18.75 → Create Return 0.5 → 18.25 → Cancel Return (Yes → Are You Sure?) → 18.75. Decodes cleanly end to end; first 3 s checked — opens on Work Orders, no sign-in page.
- Gate: build marker unchanged, ticket REJECTED FROM TESTING with no new comments, voice scan clean. Comment edited in place with dated notes (top line + "Added on 7 October 2026, 12:43 CDT").
- Attachment **61948** (61947 was my first upload; it had the sign-in page as frame 0 and was deleted and replaced). Comment media repointed to file `3a2bdcc6…` via the v3 ADF after the same-name swap left it on the deleted `d87861f5…`.
- Read back: panel `warning` first, 13 table rows, 5 media in order (4 pictures + video 1280×674). On the Jira page: inline player 720×379 with controls; preview frame = Work Orders page. The headless browser cannot play H.264 (stated limit); playback proven by the clean local decode.
