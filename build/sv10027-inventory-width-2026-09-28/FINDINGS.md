# SV-10027 — Inventory list should fit a 1920 x 1080 screen without scrolling sideways

**Ticket:** https://shopview.atlassian.net/browse/SV-10027 · Bug · Medium · status TESTING QA
**PR:** ShopView/shopview #3276 · **Branch:** `SV-10027-inventory-column-widths`

## §0 Sources and build markers (read live, 28 Sep 2026)

| Source | Value |
|---|---|
| QA branch | `sv10027.qa.shopview.com` — **v26.39.1-6a3425d**, last-mod Mon 28 Sep 2026 09:47:19 GMT |
| Production (the BEFORE, Rule 86) | `app.shopview.com` — **v26.39.1-3ef6ade**, last-mod Fri 25 Sep 2026 09:32:14 GMT |
| Requirement | Chris Ward's rewritten description, 24 Sep |
| Widths | **superseded** by Stefan's comment 77398 (28 Sep): product's **"Hybrid B + C"** |

**⚠️ The description's width table is NOT the acceptance criterion any more.** It lists Part number
130, Tags 130, Bin 180, Sell price 100 and no Last Count Date at all. Comment 77398 replaced it with
Hybrid B + C, which *adds* Last Count Date and changes nine widths. I tested against **Hybrid B + C**
as the later product decision (Rule 32), with Chris's description supplying the behaviour.

## §1 The reported bug, reproduced on production

At 1920 x 1080, 100% zoom, default columns: the table is **2230px inside a 1640px area — 590px of
sideways scroll**. Five columns are off-screen: Core, Sell Price, Min, Max, Last Count Date, and the
header row is cut mid-word at "Aver…". Evidence `ev/prod-inventory.png`, exhibit `ev/exhibit-A-fit.png`.

## §2 The fix, measured on the branch

**Table 1640px inside a 1640px area — 0px of sideways scroll.** All 14 named columns plus the history
icon are visible, through Last Count Date. **No header is clipped** (checked `scrollWidth` vs
`clientWidth` on every one, sort arrows included).

Every width matches Hybrid B + C exactly, and they sum to precisely 1,640:

| Column | Spec | Measured | | Column | Spec | Measured |
|---|---|---|---|---|---|---|
| Description | min 170 | **174–188** (flexes) | | Avg Cost | 100 | **100** |
| Part Number | 124 | **124** | | Core | 76 | **76** |
| Tags | 110 | **110** | | Sell Price | 102 | **102** |
| Category | 110 | **110** | | Min | 68 | **68** |
| Manufacturer | 126 | **126** | | Max | 70 | **70** |
| Vendor | 110 | **110** | | Last Count Date | 142 | **142** |
| Bin Location | 164 | **164** | | History icon | 52 | **38–52** (see §5) |
| Total Qty | 112 | **112** | | **Total** | ~1640 | **1640** |

## §3 Behaviour checks — all pass

| # | Check | Result |
|---|---|---|
| 1 | Headers read "Total Qty" / "Avg Cost" | **PASS** — production reads "Total Quantity" / "Average Cost" |
| 2 | Widths hold while scrolling (SV-9484 not back) | **PASS** — all 15 identical before and after scrolling to the bottom |
| 3 | Long values cut off, full value on hover | **PASS** — Description, Vendor, Category, Part Number and Tags all truncate; hovering a clipped Description showed the full `FUEL/WATER SEPARATOR, (FS19732, 33732, BF1385-SPS)` |
| 4 | Tags: first + "+N", hover lists all | **PASS** — `SHRINK +7` → `SHRINK, TERMINAL, HEAT, CONNECTOR, 12GA, RING, 1210GA, 10GA` (8 tags) |
| 5 | Bin: first + "+N", hover lists all with quantity | **PASS** — part **W4715QP**: `BARN 44 + 1` → hover gives `BARN: 44 / B1FLOOR: 2` |
| 6 | Bin: click "+N" expands, "Show less" collapses | **PASS** — expands to both bins + "Show less"; clicking it returns to `BARN 44 + 1` |
| 7 | Fixed Sell Price off the second line, on hover | **PASS** — part **N000000001069**: no "Fixed Sell Price" text anywhere in the row; hovering the green `$500.00` badge gives the tooltip **"Fixed Sell Price"** |
| 8 | A "100 Available" badge fits on one line | **PASS** — all 30 badges single-line (23px tall); widest is `280 Available` at 84px in the 112px column |
| 9 | Column picker uses the short names | **PASS** — lists `… Total Qty, Avg Cost …`; neither long form appears |
| 10 | Adding a column widens the table and scrolls | **PASS** — adding **Size**: 15→16 columns, 1640→**1718px**, **78px** of sideways scroll; removing it restores 1640/0 exactly |
| 11 | Parts Catalogue tags unchanged | **PASS** — still up to **3 tags + "…"** (e.g. `M50 | R005559R | W40 | ...`), no "+N" anywhere |

## §4 The Windows scrollbar caveat — better than the handoff predicts

The handoff and comment 77398 warn of **~13px of sideways scroll on Windows**, reasoning that a 17px
always-visible scrollbar leaves 1,623px while the 170px Description minimum holds the table at 1,636px.

**Measured: 0px.** Narrowing the table container by exactly 17px gives container 1623 / table 1623,
with Description at **171px** — still above its 170 floor. Sweeping the width down confirms the real
floor is **1622px** (Description pinned at 170), so overflow only begins below that:

| Container | Table | Description | Sideways scroll |
|---|---|---|---|
| 1640 | 1640 | 188 | **0** |
| 1623 *(Windows-equivalent)* | 1623 | 171 | **0** |
| 1610 | 1622 | 170 *(floor)* | 12 |
| 1590 | 1622 | 170 | 32 |

**Honest limit:** this is a 17px-narrower container in Chromium, not a real Windows browser. It
reproduces the arithmetic the prediction rests on, not the platform.

## §5 One measurement worth flagging

The leading history-icon column measured **52px in my first run and 38px in every settled run**, with
Description absorbing the 14px difference (174 vs 188) so the table stayed exactly 1640 either way.
Every measurement taken with data rows loaded shows 38px. It matters only because the Windows
prediction above assumes 52 — at 52 the floor would be 1636 and ~13px of Windows scroll *would*
appear. Worth a dev's eye.

## §6 Honest method notes

- **A false regression was nearly reported.** My first attempt at "Show less" clicked a wrapper node,
  the cell did not collapse, and it looked like a defect. Re-run against the leaf element, it works.
  Verified before reporting (Rule 75).
- Same class of trap on the column picker: a click returned "true" and changed nothing until I
  targeted the checkbox inside the row rather than the row's label.
- **Manufacturer hover is NOT verified** — no manufacturer value in the loaded rows is long enough to
  truncate, so there was nothing to hover. Every other truncating column was checked.
- Nothing was left changed: the Size column was toggled on and back off; no data was edited.
