# SV-10599 — "In Stock" shown for a part with 0 on hand — QA findings (7 Oct 2026)

**Ticket:** [SV-10599](https://shopview.atlassian.net/browse/SV-10599) · Bug · Medium · TESTING QA · assignee parth fadadu · reporter MAX (Qazi Sufyan) · customer Summit Fire Apparatus Services Ltd. (Devon Gillespie).
**Expected behaviour — the ruling:** Chris Ward, comment **77666** (30 Sep): *"Let's go with Option A: hide the In Stock badge on the work order line when the part's on-hand quantity is 0 or less. Nothing else changes for now (counts, Pick and auto-pick stay as they are)."* (Option A as written by Parth in 77604: *"hide the badge when it is 0 or less … Only fixes the badge. Counts, Pick and auto-pick still treat the part as in stock"*.) Ticket description: *"'In Stock' should only show when the part is actually on hand."* Chris 77533: *"the in stock badge does not show at 0 quantity or less"*.
**No QA handoff comment.** PR ShopView/shopview#3391 (fix commit `10d4f3b`) used as an input: on-hand from `AvailableQuantityCalculator::fromBins` in the WO's workplace; badge hidden at ≤ 0 on the **Lines tab (desktop + mobile), the Parts tab and the part sale page**; a core follows its main part; unchanged: stored status, WO list / part-sale counts, the collapsed-line summary, Pick / bulk pick / auto-pick.
**AFTER build:** `sv10599.qa.shopview.com`, `v26.40.3-971d112` (last-modified Mon 05 Oct 2026 04:34:20 GMT) — PR commit `971d112`, which contains `10d4f3b`.

## SOURCE-CURRENCY
| Source | Identifier | Checked | Verdict |
|---|---|---|---|
| Ticket + comments | SV-10599, 3 comments (last 77666), no attachments | 7 Oct ~10:45Z | CURRENT |
| Changelog | last content change 4–5 Oct (TESTING QA, QA branch); 6 Oct rank only | 7 Oct | CURRENT |
| PR | #3391, 34 files | 7 Oct | CURRENT |
| Build | v26.40.3-971d112 | start | CURRENT |

## Variant matrix (Rule 96) — parts added ON SCREEN through the line's inline **Add Part** row; Pick clicked on screen; stock levels set by cycle count (set-up)
| # | Where | Part | On hand | Badge on screen | Result |
|---|---|---|---|---|---|
| 1 | WO S10599-17580, Lines tab | 448-4865 SPINDLE NUT KIT (picker showed *Inventory Qty: 0 ea*) | 0 | **none**; Pick still offered | PASS |
| 2 | same, Parts tab | same | 0 | **none** (Status column empty); Pick offered | PASS |
| 3 | WO S10599-17580 | 573.D430FH-HV FLAT HOOK WINCH STRAP | 10 | **In Stock** | PASS |
| 4 | WO S10599-17580 | MH55205 Load Spring IHC, qty 5 | 2 (short) | **In Stock** (rule is ≤ 0 only) | PASS |
| 5 | Pick on 0-stock part | 448-4865 | 0 → −1 | Pick still works (bin goes −1), as ruled | PASS |
| 6 | WO S10599-17581 | 448-4865 | −1 | none | PASS |
| 7 | WO S10599-17581 | MH55205 | −3 | none | PASS |
| 8 | stock arrives (cycle count 448-4865 → 3) | 448-4865 | 3 | **In Stock** appears | PASS |
| 9 | stock gone (cycle count → 0) | 448-4865 | 0 | hidden again | PASS |
| 10 | stock only at another location (5 at Lethbridge, 0 at Heavy Duty) | 448-4865 on a Heavy Duty WO | 0 here | none | PASS |
| 11 | cored part, WO S10599-17582 | 577.55547 MAT SENSOR + "Core for…" row | 0 | none on main **and** core | PASS |
| 12 | same after main stock → 3 | same | 3 | In Stock on main **and** core | PASS |
| 13 | part sale (new, authorized) | 401-10B (0) / 84-2005 (14) | 0 / 14 | none / In Stock; Pick on both | PASS |
| 14 | phone width 390 (line card expanded) | WO S10599-17581, 4 parts | −1, −3, 1+ | In Stock only on the stocked part | PASS |
| 15 | Technician quick-login (Tech View) | WO S10599-17581 | — | same as admin | PASS |
| 16 | vendor (non-inventory) part | ZZAUTOTEST vendor part | n/a | **Auth To Order** unchanged | PASS |

## Unchanged by the ruling — observed, raised with the QA lead (Rule 97(d))
- **Parts tab, collapsed line row:** reads **"2 In Stock"** for WO S10599-17581 while both parts are at −1 / −3 and their own badges are hidden. PR lists it as a known follow-up ("a counts change, which the PM decision keeps out of scope").
- **Work Orders list:** the blue **2** bubble on the status for S10599-17581 = `statusInStock: 2` from the list endpoint, same two parts. Chris: *"counts … stay as they are"*.
- **Pick** offered on 0 / negative stock and it takes the bin negative — ruled unchanged.

## Environment changes (per-ticket branch, no clean-up needed)
ZZAUTOTEST WOs S10599-17580/17581/17582 + a part sale; stock changed on 448-4865 (now 0), MH55205 (−3), 577.55547 (3, now has a $25 core); a 448-4865 inventory record created at Lethbridge (qty 5).

## Production BEFORE (bug reproduced live)
Production `app.shopview.com` build `v26.40.8-1e8e914`, Trucks Hill 2, work order **S-961** (customer *aa*): on an approved line, inline **Add Part** → picker showed *"ZZKRYPTON Brake Kit | PERTAB-7001 | Inventory Qty: 0 EA"* → added → the line shows **In Stock** (part request status `in_stock`, inventory 0). A427 (1238213, 5 on hand) added alongside also shows In Stock. Evidence `ev/raw/P1-picker.png`, `ev/raw/P2-lines.png`.
**Clean-up:** work order S-961 deleted (`work-orders/delete` 201; re-read → `400 workOrderId Not found`); inventory re-read unchanged — PERTAB-7001 **0**, 1238213 **5** (nothing was picked).

## Exhibits
`ev/01-before-vs-after-hd.png` (production picker + line vs branch picker + line) · `ev/02-parts-tab-core-part-sale-hd.png` (Parts tab main + core at 0 and at 3; part sale) · `ev/03-phone-hd.png` (390 wide). Built by `build_exhibits.py` from 2× captures.

## QA lead's rulings (7 Oct 2026, ~11:40Z)
*"Mark the ricket as passed but hold to release if the followup comment above is confirmed bybthe tagged authorities."* · counts question *"Yes in followup comment"* · extra surfaces *"Yes in followup comment"* · technical section *"No"* · S2-960 (SV-10642) *"OK"*.

## Live re-check before posting (Rule 68/72) — ~11:50Z
Branch marker `v26.40.3-971d112` unchanged. S10599-17581 re-read: parts ZZ10599V `authorized_to_order`, 573.D430FH-HV `in_stock` 10, MH55205 `in_stock` −3, 448-4865 `in_stock` 0. Parts tab collapsed row reads **"3 In Stock"** (chip at 987,188); list bubble **4**, hover tooltip **"1 Part Ready to Order | 3 Parts In Stock"**; list endpoint `statusInStock: 3`. Ticket: TESTING QA, 3 comments, only change today = QA Assignee set (05:49 −0500). Fingerprint scan 0 hits.

## Posted
- **78112** (06:57:04 −0500): green panel *"OVERALL QA STATUS: PASSED"*, bold hold-release line, Chris's 77666 quoted, 16-row table, 3 images (61889/61890/61891).
- **78113** (06:57:05 −0500): follow-up, **@Chris Ward + @parth fadadu** on the counts (picture 61892, A/B for Chris, ticket question for Parth), **@Chris Ward** on the badge also being hidden on the Parts tab and part sale page (A/B).
Read back via v3 ADF: panel `success`; media `file` ×3 in order + ×1; tableRow 17 = header + 16; mentions resolved.

## Learning check (Rule 95)
Recorded: inline Add Part picker shows *"Inventory Qty: N"* per option (`select_inline_part_number` → `.q-menu .q-item`); WO list status bubble `#partsActionsCount-<woId>` hover tooltip spells out the counts; a user's location set with `iam/change-location` **persists across logins** (a later quick-login lands at that location — switch back explicitly); `inventory/parts/change` needs `id, catalog_part_id, category_id, quantity, purchase_price, tags, bins` (+ `core:true, core_charge` mints a core). Playbook §AC.15 addendum 4.
