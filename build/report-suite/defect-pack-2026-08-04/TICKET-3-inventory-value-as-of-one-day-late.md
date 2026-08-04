# TICKET 3 — ready to paste into Jira

| Field | Value |
|---|---|
| **Project** | SV (shopview.atlassian.net) |
| **Issue type** | Bug |
| **Summary** | Inventory Value reports the stock value for one day AFTER the date asked for |
| **Suggested parent** | **SV-8672** — `Inv Value - Story 5 - As-Of Date and History` |
| **Parent reasoning** | This is precisely and only the as-of date resolution, which is what SV-8672 owns — it is the story carrying requirements S5-R2, S5-R4 and S5-R7, all three of which this breaches. Not SV-8678 (the nightly capture), because history *is* being captured and served correctly; it is the date lookup that is shifted. Not the epic, because a single story plainly owns it. |
| **Suggested severity / priority** | **High** |
| **Severity reasoning** | This is a **money figure reported against the wrong date**, on the report an owner would use to close a month or value stock for accounts — and **it is invisible: the page looks entirely normal.** A stock valuation taken on 31 July is silently the 1 August figure. Not Critical because nothing is written or corrupted; the reading is simply mislabelled. |
| **Affects build** | `v3.4.1-0ed4433` on `sv8582.qa.shopview.com` |
| **Observed** | 2026-08-04 |
| **Labels (suggested)** | `reports-suite`, `inventory-value`, `date-handling`, `qa-found` |

---

## What's wrong

The Inventory Value report lets you look at what your stock was worth **as of** a chosen date. Whatever
date you choose, it answers with the **day after** it. Always exactly one day out.

Ask for 3 August and the report says it is showing you 4 August. Ask for 31 July and it shows 1 August.
Ask for 31 January and it shows 1 February.

## Why it matters

This is a money figure, and it is being reported against the wrong day. If someone values their stock
at the end of a month — the most likely reason anyone uses this feature — they get the **next** month's
first-day figure instead, labelled with the date they asked for.

**Nothing on the screen suggests anything is wrong.** The report looks completely normal, the totals
look sensible, and the only clue is the small "As of" line, which shows the shifted date rather than the
date you chose. Someone would have to notice that discrepancy and know it mattered.

There is a knock-on effect too. That "As of" line is only supposed to appear when the report has had to
fall back to an earlier recorded day than you asked for. Because of this shift, **the report can never
land on an earlier day** — it always lands one day later — so the message's real purpose can never
happen, and instead it shows all the time.

## What should happen instead

The written requirement (Inventory Value specification, version 3) says three things, and the report
breaks all three:

> "**S5-R2:** The report values inventory **as of the end** of the selected range."

> "**S5-R4:** Otherwise, the report replays the closest recorded day **on or before** the end of the
> selected range."

> "**S5-R7:** A Custom range lets the user pick a start and end date; the report values as of the picked
> end date (never a future date — it is capped at today)."

**S5-R4 is broken twice over:** the day shown is not the end of the range, and it is not *on or before*
it either — it is **after** it, which the requirement expressly forbids.

*(One thing does work correctly, worth saying so: asking for a date in the future is properly capped
back to today.)*

## How to see it yourself

No special data is needed.

1. Open the **Inventory Value** report.
2. Set a date range that **ends yesterday** — 3 August 2026 — and press **Apply**.
3. Look at the **"As of"** line just under the report title. It reads **08/04/2026** — *today* — not the
   3 August you asked for.
4. Now set a range ending **31 July 2026** and press **Apply**. The "As of" line reads **08/01/2026**.
5. Try one more, ending **31 January 2026**. It resolves to **02/01/2026**.

Each time, the date shown is exactly one day later than the date you chose.

If you want to see that this really is arithmetic on your date rather than the report finding the
nearest available day, try a range ending **31 January 2020** — long before any stock history exists.
It still answers **1 February 2020**.

---
---

# FOR ENGINEERING — technical evidence

**Environment.** API `https://sv8582api.qa.shopview.com`, build `v3.4.1-0ed4433`. Org
`d55bc308-e61a-438d-b5f1-c7a73c89d49f`, workplace `b3c8c820-f815-4cf1-8938-10956c5ee71a`. Server date at
observation: **2026-08-04**. Nightly history on this org begins around **2026-08-01** (one to two days
deep).

⚠️ **This QA branch was declared NOT FINAL by engineering.** This finding is provisional. **If it is
already fixed or still in progress, please close saying so** — we will re-run the probes.

## The exact request and the exact response field

The resolved date is returned as **`data.as_of_date`** on the report payload
(`GET /api/reporting/reports/inventory-value`, alongside `collection`, `pagination` and `totals`).

```
GET …/inventory-value?range=custom&start_date=2026-08-03&end_date=2026-08-03&locations=<HD>
 -> 200   data.as_of_date = "2026-08-04"    asked 08-03  ✗   rows 5657  totals.total_cost 48554218

GET …/inventory-value?range=custom&start_date=2026-07-01&end_date=2026-07-31&locations=<HD>
 -> 200   data.as_of_date = "2026-08-01"    asked 07-31  ✗   rows 5657  totals.total_cost 48554966

GET …/inventory-value?range=custom&start_date=2026-01-01&end_date=2026-01-31&locations=<HD>
 -> 200   data.as_of_date = "2026-02-01"    asked 01-31  ✗   rows 0

GET …/inventory-value?range=custom&start_date=2020-01-01&end_date=2020-01-31&locations=<HD>
 -> 200   data.as_of_date = "2020-02-01"    asked 01-31  ✗   rows 0

GET …/inventory-value?range=custom&start_date=2026-08-04&end_date=2026-08-04&locations=<HD>
 -> 200   data.as_of_date = "2026-08-04"    asked 08-04  — shift MASKED (it lands on today)

GET …/inventory-value?range=custom&start_date=2027-01-01&end_date=2027-01-31&locations=<HD>
 -> 200   data.as_of_date = "2026-08-04"    future correctly capped to today   ✅

GET …/inventory-value?locations=<HD>            (no range parameter at all)
 -> 200   data.as_of_date = "2026-08-04"
```

**Eight of eight date probes shifted by exactly one day**, plus **eleven more** in a separate boundary
run, every one echoing `as_of_date 2026-08-04` for `end_date=2026-08-04`.

## Two facts that pin down what it is and is not

1. **Stored history IS being served, correctly, and the shift sits on top of it.** The 31 July request
   returned `total_cost` **48554966** ($485,549.66) where today's live figure is **48554218**
   ($485,542.18). Two different real numbers — so a snapshot lookup is genuinely happening; it is
   looking up the wrong day.
2. **The shift is applied outside the history window entirely.** A 2020 request — years before any
   capture — still returns `2020-02-01`. So this is arithmetic on the requested date, not a lookup that
   happens to land one day out.

## Knock-on effect on S5-R5 / S5-R6

> **S5-R6:** *"When the displayed day matches the date asked for (the common current-view case), the
> "As of" indicator is **not** shown."*

The indicator is **always** shown — on the default view (This Month, ending today, values representing
today) the page renders `As of 08/04/2026` immediately after the report title. And because the
resolution can never land *earlier* than the requested date, the one condition the indicator exists for
(S5-R5) **cannot be produced at all**.

## It also reaches the exported file

`build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/exports/iv__MULTI__wholelist__csv.head.txt`,
line 1, verbatim:
```
"As of: 2026-08-04"
```
…on an export whose requested `end_date` was `2026-08-04`, so masked there; but the same metadata line
carries the shifted value for any past date.

## Possibly related — one line, not asserted

Every report PDF prints its date-range header one day late as well: `end_date=2026-08-04` printed as
`Date Range: Jun 1, 2026 – Aug 5, 2026`, on all four PDFs of both Sales reports, while the **data** in
those files correctly stops at 4 August. That **suggests** a shared timezone conversion, and it may be
the same root cause — but **we have not proven that** and are not claiming it. Worth a glance while you
are in the date handling. (Recorded at `batch-sbc-sbr/ENV-DEFECTS.md` §6.)

## What is NOT established

- Whether the shift is in date parsing, a timezone conversion, or the snapshot lookup itself.
- Whether the Work In Progress nightly snapshot has the same shift — **it cannot be checked**, because
  no read route into the stored snapshot rows exists on this build (probes 404). Filed separately as an
  access request.
- How the fault behaves against deeper history. This org has one to two days of captures.

## Evidence files (in the QA repo)

- `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/api/api-wip-iv.json` → `iv.asOf` — all eight
  probes with resolved dates, row counts and total-cost figures
- `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/api/iv-pdf-boundary.json` — eleven more
- `build/report-suite/viu-2026-08-03/batch-wip-iv/VERDICTS.md` line 2142
- `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/exports/iv__MULTI__wholelist__csv.head.txt`

> **Note on attachments:** files were not attached — the exact request strings, the exact response field
> and its value for every probe, and the two differing total-cost figures are inlined above.

## QA test cases affected

IV-DATE-02 = C30562 · IV-DATE-04 = C30564 · IV-DATE-05 = C30565 · IV-DATE-06 = C30566.
