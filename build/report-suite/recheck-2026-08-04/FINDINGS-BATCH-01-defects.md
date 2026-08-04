# Batch 1 — the three open defect tickets, re-driven on the NEW build

**Build at start of this run:** `v3.4.1-3d03023` · `last-modified: Tue, 04 Aug 2026 10:41:58 GMT` ·
`etag: "9875201c58ba78d9851c37f7039c16e1"` — read live 2026-08-04 12:57 UTC.
**Prior pass's build:** `v3.4.1-0ed4433` · `Mon, 03 Aug 2026 13:40:38 GMT` · etag `02091e9dc11f187d7739b4efa166ea21`.

**Session:** `POST /api/quick-login {key:'admin'}` → **200**, fresh `PHPSESSID` issued, reused for the
whole run (one login only — the stateful-session trap that burned the previous worker).

| Ticket | Jira status (read live) | Prior finding | **Re-check outcome on `3d03023`** |
|---|---|---|---|
| **SV-8818** PDF export server error at scale | **Open**, Low, parent SV-8582 | `format=pdf` → 500 at whole-list scope; CSV of the same scope fine; PDF fine when narrowed | **CONFIRMED — still reproducible, same mechanism** |
| **SV-8819** Parts Velocity Turns/Yr divides by one day too few | **Open**, Low, parent SV-8582 | `this_year` preset implied a **215**-day window; the same period picked by hand implied **216** | ⭐ **CHANGED — FIXED** |
| **SV-8820** Inventory Value values stock one day late | **Open**, Low, parent SV-8582 | `as_of_date` always the day **after** the end date asked for | **CONFIRMED — identical +1 day shift** |
| **SV-8823** IV spreadsheet money-as-text + columns ignored | **OBSOLETE / Done**, Low | closed on the QA lead's money-as-text ruling | (see Batch on the columns half) |

## SV-8818 — CONFIRMED. Still 500s at scale.

`evidence/sv8818-pdf-recheck.json`, `evidence/sv8818-pdf-recheck-part2.json`.

| Report + scope | CSV | PDF |
|---|---|---|
| Sales By Customer, 1 Jul → 4 Aug, Summary | 200, 882 B | **200**, 178,460 B |
| Sales By Customer, 1 Jul → 4 Aug, Expanded | 200, 2,312 B | **200**, 180,548 B |
| Sales By Representative, Summary | 200, 533 B | **200**, 177,774 B |
| Sales By Representative, Expanded | 200, 1,236 B | **200**, 179,342 B |
| **Parts Velocity, This Year (whole list)** | 200, 1,004,378 B | **500 after 40.0 s** |
| Technician Utilization, This Year, Summary | 200, 926 B | **200**, 177,395 B |
| **Technician Utilization, This Year, Expanded** | 200, 47,541 B | **500 after 31.7 s** |
| Work In Progress, 1 Jul → 4 Aug, one tab, 3 columns | 200, 127 B | **200**, 175,249 B |
| **Inventory Value, 1–4 Aug (whole list)** | 200, 724,149 B | **500 after 44.4 s** |
| Inventory Value, narrowed to part `R134A` | — | **200**, 178,591 B |
| Parts Velocity, narrowed to search `GREASE` | — | **200**, 181,193 B |

Error body verbatim: `An error occurred. We're sorry for this inconvenience, please try again a bit
later later.` (the doubled "later later" is the build's own string). The **narrowed-scope successes
prove the mechanism is scale, not the report** — exactly as filed. **No case change: SV-8818 stays open
and the "known issue" line on its cases stays.**

## SV-8819 — ⭐ FIXED. This is the important one.

`evidence/sv8819-turns-recheck.json`, `evidence/sv8819-presets-recheck.json`.

**The exact test data** (named, per the QA lead's hard requirement): part **`BRAKECLEAN`**, location
**Staging Heavy Duty - 9919** (`b3c8c820-f815-4cf1-8938-10956c5ee71a`), Type = **Inventory**.
Implied window is derived from the returned figure: `W = units_sold × 365 ÷ (turns_per_year × on_hand)`.

| Probe | Prior build `0ed4433` | **New build `3d03023`** |
|---|---|---|
| **A** `This Year` preset | `turns_per_year 1.40648754422` → **W = 215** | `turns_per_year 1.39997602781` → **W = 216** |
| **B** the same period picked by hand, 1 Jan → 4 Aug 2026 | `1.39997602781` → W = 216 | `1.39997602781` → **W = 216** |
| **A vs B agree?** | **NO — the defect** | ✅ **YES — identical to 11 decimal places** |

Whole-population sweep, 500 rows per preset, not a sample:

| Preset | Spec's inclusive span | Prior implied W | **New implied W** | Verdict |
|---|---|---|---|---|
| `this_year` | 216 | **215** (440 rows) | **216** (435 rows) | ✅ **FIXED** |
| `last_year` | 365 | 365 (416 rows) | 365 (374 rows) | unchanged, correct |
| `last_quarter` | 91 | 91 (447 rows) | 91 (427 rows) | unchanged, correct |
| `last_month` | 31 | 31 (6 rows) | 31 (6 rows) | unchanged, correct |
| `this_quarter` | 35 (1 Jul → 4 Aug) | 92 (6 rows) | 92 (6 rows) | **unchanged** — see note |
| `this_month`, `this_week` | — | no measurable rows | no measurable rows | not measurable (no sales) |
| `last_12_months` | 366 | **HTTP 400** | **HTTP 400** | unchanged — not a valid value |

**The defect that was actually asserted in SV-8819 is gone.** The ticket's own scope was the
`this_year` off-by-one, and the preset now agrees exactly with the hand-picked range.

**Honest note, not a new claim:** `this_quarter` still implies **92** days where the elapsed inclusive
span is 35 — i.e. it uses the whole calendar quarter. That was explicitly recorded in the ticket as
*"a second observation we are NOT asserting"*, and it is **unchanged**, so it neither counts as a
regression nor as part of the fix.

## SV-8820 — CONFIRMED. Identical one-day shift.

`evidence/sv8820-asof-recheck.json`. Every end date asked for, and the `as_of_date` returned:

| End date asked for | `as_of_date` returned | Outcome |
|---|---|---|
| 2026-08-03 | **2026-08-04** | shifted +1 |
| 2026-07-31 | **2026-08-01** | shifted +1 |
| 2026-01-31 | **2026-02-01** | shifted +1 |
| 2026-08-02 | **2026-08-03** | shifted +1 |
| 2026-08-04 (= today) | 2026-08-04 | matches — because it is capped at today |
| 2027-12-31 (future) | 2026-08-04 | correctly capped back to today |

Same behaviour as filed, including the one thing that does work (future dates capped). **No case
change: SV-8820 stays open.**
