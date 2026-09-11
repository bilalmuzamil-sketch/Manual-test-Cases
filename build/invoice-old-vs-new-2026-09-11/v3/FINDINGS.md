# INV-S9901-16810 (older) vs INV-S2-10056 (newer) — 2026-09-11

**Status: analysis only. Nothing filed, nothing posted.**

| | file | document | shop | producer | pages |
|---|---|---|---|---|---|
| **OLDER** | `OLD-INV-S9901-16810.pdf` | Invoice **INV-S9901-16810**, invoice date Sep 11 2026 | Staging Heavy Duty - 9919 | WeasyPrint 69.0 | 11 |
| **NEWER** | `NEW-INV-S2-10056.pdf` | Invoice **INV-S2-10056**, invoice date Oct 2 2025 | Heavy Duty - 9919 | WeasyPrint 69.0 | 5 |

Same shop (GST# 812694966 RT0001, 9919 Shepard Road SE), same render engine.

---

## Result: the two invoices are the same design

**16 structural checks, all 16 identical**, plus every fixed landmark on the page at the same
position to a tenth of a point, and the letterhead image byte-for-byte the same file
(sha256 `17cf53f5141d7b3c…`, 11,904 bytes, on every page of both).

| | both |
|---|---|
| Page 595.28 × 841.89pt, margins, white card | identical |
| Content box — the rule above the line table | y 346.4, x 58.5 → 536.8 |
| Every rule x-span in the document | identical set |
| Totals cell borders | x 393.0..463.4 and 464.9..535.3, 70.4pt wide |
| Description / Quantity / Rate / Amount column x | 90.4 / 339.4 / 442.2 / 498.8 |
| Typeface, type sizes, colours | Nunito-Sans + Bold; 6.48/9.6/10.5/10.8/14.4; #000000 + #424242 |
| **Bold / not-bold on every element role** | identical — no role differs |
| "Bill To" and "Remit payment to" | y 126.0 |
| Asset table headings | y 237.3 |
| Line-item column headings | y 355.4 |
| First job line | y 384.8 |
| Labor / Parts row labels | x 60.8 |
| Summary block rows | y 41.6 / 54.7 / 67.8 / 80.9 / 94.0 / 107.1 / 120.2 / 133.3 |
| Signature block | y 247.1 and 269.1 |
| Disclaimer | 7 lines, y 167.2 → 220.2 |
| Footer | y 814.1 |

A full role-by-role skeleton diff of both documents (517 rows vs 204 rows) produced **no row pattern
that exists in one design and not the other** — every apparent difference resolves to a right-aligned
amount of a different digit count, or a page-count difference.

## What does differ, and why it is data

- **Shop name** — "Staging Heavy Duty - 9919" vs "Heavy Duty - 9919". Same GST number, address and
  phone. The letterhead is frozen onto an invoice when it is created, and the newer file is a render
  of an **October 2025** invoice, so it carries the name as it was then.
- **Remit-to block** — likewise frozen per invoice (Punta Gorda vs Foothills Group / Interstate
  Billing).
- **Masthead height** — the older one's shop name and document number each wrap to two lines because
  they are longer, so its address block starts 19.6pt lower. "Bill To" is at y 126.0 on both
  regardless.
- **"Service Order" wrapping** — that column sizes itself to its own content, and `S9901-16810` is
  wider than `S2-10056`, so the heading fits on one line in the older file and wraps in the newer.
- **Asset row height** — "2019 Landoll Corporation 930e" wraps; "2006 Peterbilt 335" does not.
- **Page count** — 11 vs 5, because the older invoice carries far more work.

---

## The finding that matters more than this pair

Counting the per-line totals rows across all four documents supplied so far — **all from the same
shop, all rendered the same way**:

| document | supplied as | Parts Total rows | Labor Total rows | Line Total rows |
|---|---|---|---|---|
| **EST-S9901-17435** | older | **0** | **0** | 5 |
| **INV-S9901-16810** | older | **29** | **29** | 30 |
| EST-S1-17520 | newer | 24 | 24 | 25 |
| INV-S2-10056 | newer | 12 | 12 | 13 |

**Two documents both supplied as the "old" one disagree with each other.** One prints "Parts Total"
and "Labor Total" under every job line and the other does not — same shop, same template, same day.

That was the single difference found in the previous pair, and this proves it is **not something the
redesign introduced**. It is a per-invoice setting: the **"Summarize parts total"** and
**"Summarize labor total"** toggles behind the gear icon on the work order's Finance tab, read from
`GET /api/invoices/{woId}/settings/view`. Proven on 2026-09-10: with both `false` the per-line
Labor/Parts figures disappear, and setting them `true` brings them straight back.

**Honest limit:** the staging session is expired (HTTP 401), so the two work orders' settings have
**not** been read. The inference is from the four documents' own content plus the 2026-09-10
measurement, not from reading these two records live.

## Exhibits

| file | shows |
|---|---|
| `ev/EX1-same-design.png` | the two invoices side by side with the measured identical list |
| `ev/EX2-two-old-invoices-disagree.png` | the two "old" invoices from the same shop, one with the extra rows and one without |

Rebuild with `python3 make_exhibits.py` — every box is placed from a PDF coordinate, not by eye.
