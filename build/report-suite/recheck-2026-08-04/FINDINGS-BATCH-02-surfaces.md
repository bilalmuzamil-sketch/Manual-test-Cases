# Batch 2 — the export surfaces, the Location column, and the two carried-forward items

Build: **`v3.4.1-3d03023`**. All observations live, this run.

## ⚠️ WHAT THE DEPLOY BROKE — a new `"Date Range:"` line on EVERY export

`evidence/location-and-metadata-matrix.json` — **36 of 36** export surfaces re-captured (6 reports ×
3 location scopes × every variant and tab). **Every single one now begins with a `Date Range:` line
that did not exist on the previous build.**

| Report | Metadata lines now, in order | Header row is now line |
|---|---|---|
| Sales By Customer | `Date Range: …` · `Locations: …` | 3 |
| Sales By Representative | `Date Range: …` · `Locations: …` | 3 |
| Parts Velocity | `Date Range: …` · `Locations: …` | 3 |
| Technician Utilization | `Date Range: …` · `Locations: …` | 3 |
| Work In Progress | `Date Range: …` · `Locations: …` | 3 |
| **Inventory Value** | `Date Range: …` · **`As of: …`** · `Locations: …` | **4** |

Byte-exact first lines (the UTF-8 BOM is still there, at the start of the new line 1):
```
﻿"Date Range: Jul 1, 2026 - Aug 4, 2026"
"Locations: Staging Heavy Duty - 9919"
```

### The sweep — how many cases this invalidated: **exactly ONE**

I swept all **469** active cases for any claim about an export's first line or line order (pattern
sweep over title + preconditions + steps + expected + notes, then read every hit by hand): **24
candidates, 1 genuinely false.**

| Case | What it says | Still true? |
|---|---|---|
| **IV-EXP-04 = [C30590](https://shopview.testrail.io/index.php?/cases/view/30590)** | *"the CSV's **first line** reads "As of: 2026-08-04""* | ❌ **FALSE** — it is now line **2** |
| SBC-EXP-03 = [C30161](https://shopview.testrail.io/index.php?/cases/view/30161) | *"as a **leading line above the column headers**"* | ✅ still true (line 2 is still above the headers) |
| SBR-EXP-10/11 = [C30285](https://shopview.testrail.io/index.php?/cases/view/30285)/[C30286](https://shopview.testrail.io/index.php?/cases/view/30286) | *"**starts with** a UTF-8 BOM"* | ✅ still true (the BOM leads the new line 1) |
| IV-EXP-02 [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) · PV-EXP-02 [C30376](https://shopview.testrail.io/index.php?/cases/view/30376) · SBR-EXP-02 [C30277](https://shopview.testrail.io/index.php?/cases/view/30277) · TU-EXP-04 [C30437](https://shopview.testrail.io/index.php?/cases/view/30437) · WIP-EXP-02 [C30511](https://shopview.testrail.io/index.php?/cases/view/30511) · SBC-EXP-09 [C30167](https://shopview.testrail.io/index.php?/cases/view/30167) | all hedge with *"(exact position in the file is confirmed in the build)"* | ✅ still true |
| the remaining 12 | quote `As of` / `Locations:` without a position claim | ✅ still true |

**This is Standing Rule 42 paying for itself.** 23 of the 24 survived a real change to the file
format *because they were written scope-conditionally instead of pinning a line number*. The one that
broke is the one that said "first line".

**The fix applied to C30590** removes the brittle claim rather than swapping one line number for
another, so the next added line cannot break it either:

> *…and in the spreadsheet it is one of the short summary lines that sit above the column headings,
> reading "As of: 2026-08-04" (with a colon). Both are correct; do not raise the difference, **and do
> not count the summary lines - more of them may be added**.*

## The Location column, end to end, on all six reports — CONFIRMED

The server-side rule is **correct and unchanged**: the per-row Location column appears **only** when
more than one location is in scope, and is **absent** at single-location and no-parameter scope.
Verified on the file itself, in every format, for every report:

| Report | SINGLE scope | MULTI scope — Location column at index | NO-parameter scope |
|---|---|---|---|
| Sales By Customer | absent ✓ | Summary **1** (after Customer) · Expanded **4** | absent ✓ |
| Sales By Representative | absent ✓ | Summary **1** · Expanded **5** | absent ✓ |
| Parts Velocity | absent ✓ | **5** (after Vendor) | absent ✓ |
| Technician Utilization | absent ✓ | **0 — FIRST, before Technician** | absent ✓ |
| Work In Progress | present when selected | **3** (as `Branch`) | present when selected |
| Inventory Value | absent ✓ | **4** (after Vendor) | absent ✓ |

**On-screen headers, read live** (`evidence/screen/screen-columns.json`, screenshots per report):

| Report | On-screen order (Location in bold position) |
|---|---|
| Sales By Customer | Customer · Date · **Location** · Inv. Hrs · Labor Invoiced · Labor Margin · Parts Invoiced · Parts Margin · Shop Supplies · Margin · Margin % · Subtotal |
| Sales By Representative | Date · Invoice · Customer · Status · **Location** · Inv. Hrs · … · Subtotal |
| Parts Velocity | Type · Part # · Description · Category · Vendor · **Location** · Units Sold · Unit Cost · Sell Price · Revenue · Margin · Margin % · Demand · Last Sale · On Hand |
| Technician Utilization | Technician · **Location** · Total Hours · WO Hours · Internal Hours · Utilization % · Est. Lost Labor |
| Work In Progress | WO # · Status · Customer · Asset · **Location** · Advisor · Days Open · Earned · Remaining · Total |
| Inventory Value | Part # · Description · Category · Vendor · **Location** · Qty · Unit Cost · Unit Sell · Margin · Margin % · Total Sell · **Total Cost** |

**Two screen-vs-file position deviations CONFIRMED, both unchanged from the previous build:**
- **Technician Utilization** — screen is `Technician · Location`, the file is `Location · Technician`.
- **Inventory Value** — screen ends `… Margin · Margin % · Total Sell · Total Cost`, the file ends
  `… Total Cost · Total Sell · Margin · Margin %`. **Total Cost is last on screen but 9th in the file.**

**Nav group headings, read live** — `LABOR · PERFORMANCE · PARTS · SALES · FINANCE · ACCOUNTS
RECEIVABLE · ACCOUNTS PAYABLE · ACCOUNTING · COMMUNICATIONS`. **SALES exists**, so queue row B7 /
SBC-NAV-01 = [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) is **CONFIRMED** —
Sales By Customer sits under **SALES**, not PERFORMANCE. The high-churn nav worry did not materialise.

**Column Selection panels, toggle counts read live** — Sales By Customer **9** · Sales By
Representative **7** · Technician Utilization **5** · Inventory Value **11** · Parts Velocity **20** ·
Work In Progress **15**. The first three match the counts those cases assert (queue rows B10, B15,
B20) — **CONFIRMED**.

## CARRIED-FORWARD ITEM 1 — the Inventory Value on-screen column order: **SETTLED**

The previous worker recorded this as owed and did not re-observe it. It is now observed live on the
new build (above, and `evidence/screen/inventory-value.png`). **On screen `Total Cost` is last; in the
file it is 9th of 12.** The order genuinely differs, so the deviation is real and **CONFIRMED**, not
an artefact of the earlier capture.

## CARRIED-FORWARD ITEM 2 — the per-cell API cross-check: **SETTLED, 0 mismatches**

`evidence/ruling3/money-and-crosscheck.json`. Whole-file, not a sample:

| Check | Result |
|---|---|
| Rows in the live spreadsheet | **9,276** (9,275 data + 1 `Totals`) |
| Rows pulled from the report's own API (19 pages of 500) | **9,275** |
| Cells cross-checked (money · percent · quantity) | **55,584** |
| **Genuine value mismatches** | **0** |
| Rows my key could not pair to an API row | **11** |

**Honest note on both numbers, because a clean figure means nothing without it.** A first run of this
check reported **10 mismatches**; every one was **my own formatter's fault** — the build writes a
negative as `-$33.73` (minus outside the `$`) and I had generated `$-33.73`. Corrected, they all
match. The **11 unpaired rows** are likewise a **keying limit, not a data defect**: I keyed on
*(part number, location name)* and several part numbers contain embedded quotes and slashes
(`14'X10"X2`, `SQT2"X2"X.100`, `AS1-1/4"x1-1/4"x3/16`, `RT2x1x1/8`). Row counts reconcile exactly
(9,275 = 9,275) and **not one paired row showed a wrong value**, so there is no evidence of a value
defect — but I am not going to claim 9,275 of 9,275 paired when 11 did not.

## CARRIED-FORWARD ITEM 3 — the money format: **CONFIRMED, still text, values still correct**

`evidence/ruling3/money-and-crosscheck.json`, whole-file census on the new build:

| Column | Numeric cells | Text cells | Example |
|---|---:|---:|---|
| Unit Cost | 0 | 9,276 | `$702.02` |
| Unit Sell | 0 | 9,276 | `$988.80` |
| Total Cost | 0 | 9,276 | `$21,762.62` |
| Total Sell | 0 | 9,276 | `$30,652.80` |
| Margin | 0 | 9,276 | `$8,890.18` |
| Margin % | 0 | 9,276 | `29.0%` |
| **Total money/percent** | **0** | **55,656** | |
| Qty (the control) | **9,271** | 5 | `786.55` |

**Exactly the previous figure — 55,656 of 55,656 fail a numeric parse, 0 pass, while Qty parses
fine.** And half (a) still holds: **the amounts are correct** (0 value mismatches above). So the QA
lead's closing condition — *"if that still shows the amount in number and that amount is correct then
its good to stay closed"* — **is still met**, and SV-8823 can stay closed on that ground.

## The `columns=` parameter — CONFIRMED still ignored

`evidence/ruling3/columns-param-sha256.json`. Three requests, same scope:

| Request | Status | SHA-256 of the returned file |
|---|---|---|
| no `columns` parameter | 200 | `15a811e72ff5f52b687a49dd…` |
| `columns=part_number,description,qty` | 200 | `15a811e72ff5f52b687a49dd…` — **byte-identical** |
| `columns=zzz_nonsense_column` | 200 | `15a811e72ff5f52b687a49dd…` — **byte-identical** |

All twelve columns come back whatever is asked for, an invalid column name raises **no** validation
error, and the file's order still differs from the screen. **The half of SV-8823 the QA lead's ruling
did not cover is unchanged on the new build.**

## The single-location Location filter (queue row B18) — CONFIRMED, with the same honest caveat

Scoped the session to **Staging Heavy Duty - 9919** only (`POST /api/iam/change-location` → 200) and
re-drove all six reports in a **fresh browser context**: the **Location filter is still shown on all
six**, reading `Location  All locations`, and a Location column header still renders. So the build
still follows the written spec rather than Chris Ward's hide-it ruling — **DEVIATION CONFIRMED, no
case change** (Rule 32: no product decision has landed).

**The caveat, stated rather than glossed:** changing the *active workplace* does not make the signed-in
user a *single-location user* — they still have access to both locations, which is why the filter
still offers "All locations". The **definitive** answer needs a staff member whose access is
restricted to one location. The server-side half **is** settled independently and cleanly: at SINGLE
scope the file has **no Location column** on all five reports that gate it, so the data rule is right.
