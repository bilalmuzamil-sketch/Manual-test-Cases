# Report Suite — DEFECT PACK, 2026-08-04

> **Why this exists.** The QA lead asked one question of four findings: **"What is exactly the error
> and how to reproduce it?"** This answers that from the captured evidence, plus two clean-ups he
> asked for in the same pass.
>
> **READ-ONLY pass.** No test case was edited, no TestRail write of any kind was made, no spec was
> touched. The only live traffic added by this pass was **GET-only** export/report reads (the probes
> in `probe/`), which settled a disagreement the two earlier batches had left open.

---

## SOURCE-CURRENCY (Standing Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|
| The build | `sv8582.qa.shopview.com`, app-version **`v3.4.1-0ed4433`** (`last-modified` Mon 03 Aug 2026 13:40:38 GMT, `etag` `02091e9dc11f187d7739b4efa166ea21`) | re-read live 2026-08-04 04:07 UTC — **unchanged** since the batches ran | 2026-08-04 | **PARTIAL — the branch is NOT FINAL** (Rule 49). Every verdict here is provisional and queued in `viu-2026-08-03/RECHECK-QUEUE.md`. **See the honest caveat below: the marker names the FRONT END only.** |
| Parts Velocity spec | Confluence pageId 620888066 | **v4**, Jul 29 2026 | 2026-08-03 capture | CURRENT |
| Inventory Value spec | Confluence pageId 720142338 | **v3**, 2026-07-29 | 2026-07-31 capture | CURRENT |
| SBC / SBR specs | pageIds 577634305 / 585629698 | SBC v13 / SBR v15 | 2026-08-03 capture | CURRENT |
| Epic + child stories | **SV-8582**, 97 children SV-8583→SV-8679 | re-read 2026-08-04 (`epic-reread-2026-08-04/tickets.json`) | 2026-08-04 | CURRENT |
| Tech plan | `tech-plan-2026-07-29/` | 2026-07-29 | 2026-08-04 | CURRENT |
| Designs | none exist for Report Suite | — | — | **N/A — spec-only project** (recorded, not a shortfall) |

**⚠️ Honest caveat on the build marker.** `v3.4.1-0ed4433` comes from `<meta name="app-version">` in
the SPA's `index.html`. It identifies the **front-end bundle**. Every defect in this pack except #5's
column-order half is computed by the **back end**, and the back end can be redeployed without that
marker moving. So "the marker is unchanged" does **not** prove the API is unchanged. Where it matters
I re-observed the behaviour live this pass rather than trusting the marker — see #2, where re-probing
changed the finding materially.

---

## THE HEADLINE, IN ONE TABLE

| # | Defect | Reproducible now? | Severity | Ticket file |
|---|---|---|---|---|
| 1 | **PDF download fails with a server error on a medium-to-large view**, on 5 of the 6 reports, well under the documented 10,000-row cap | **Yes**, every time above the threshold | **High** | `TICKET-1-pdf-export-500-at-scale.md` |
| 2 | **Turns / Yr is overstated on the "This Year" date preset** — it divides by 215 days where the requirement says 216 | **Yes**, on `This Year` only. **Narrower than first reported** — see the correction | **High** (wrong number, invisible to the reader) | `TICKET-2-turns-per-year-window-off-by-one.md` |
| 3 | **Inventory Value reports the stock value for the wrong day** — always one day later than asked | **Yes**, every past date | **High** (wrong number, invisible to the reader) | `TICKET-3-inventory-value-as-of-one-day-late.md` |
| 4a | **Creating an invoice fails with a server error** — blocks 14 test cases | **Yes** | **High** (blocks a core flow and our verification) | `TICKET-4-invoice-create-500.md` |
| 4b | **Saving a customer fails with a server error when a sales-rep id is supplied** | **Yes** | **Low** (robustness; the UI's own save works) | `TICKET-5-customers-change-500.md` |
| 5 | **Inventory Value spreadsheet: money arrives as text, and the file ignores your column choice and re-orders the columns** | **Yes** | **Medium** | `TICKET-6-inventory-value-export-formatting.md` |

---
---

# 1. The PDF download fails with a server error on a medium-to-large view

### Summary
On five of the six reports, choosing a PDF download for anything bigger than a few hundred rows
returns a bare server error instead of a file, while the spreadsheet download of the identical view
succeeds in about a second — and it happens far below the 10,000-row limit that exists precisely so
a big export would fail politely.

### Environment + build marker
`https://sv8582.qa.shopview.com` (API `https://sv8582api.qa.shopview.com`), build **`v3.4.1-0ed4433`**.
Observed by the two VIU batches on **2026-08-03/04**, and **re-observed by this pass on 2026-08-04
03:58–04:00 UTC**. Org `d55bc308-e61a-438d-b5f1-c7a73c89d49f`, workplaces `Staging Heavy Duty - 9919`
and `Lethbridge 4310`.

### Preconditions — and how to create the data state
**No seeding is needed. The existing QA data already exceeds the threshold**, which is itself part of
the finding — a tester will hit this on the first realistic export they try.

- Parts Velocity, `This Year`, one location: **6,219 rows**; the whole `search=` box narrows it to any
  size you want. `search=GA` → **344 rows** (works). `search=HO` → **449 rows** (fails).
- Inventory Value, no filters, one location: **5,657 rows**; both locations: **9,275 rows**.
- If you ever need a *smaller* set, narrow with the report's own search box — that is the only
  "seeding" required in either direction.

### Steps to reproduce — from the screen
1. Sign in as any user with reports access and open **Parts Velocity** (`/reports/parts-velocity`).
2. Set the date range to **This Year** and select a single location.
3. Type `GA` into the **Search parts** box. Roughly 344 rows remain.
4. Open the **three-dot** menu (`Export report`) and choose **Download (PDF)** — a file arrives.
5. Change the search to `HO`. Roughly 449 rows remain.
6. Choose **Download (PDF)** again — after about half a minute **no file arrives** and an error
   appears. Choose **Download (CSV)** on the same view — the spreadsheet arrives in about a second.

### Steps to reproduce — the exact requests
```
# 344 rows -> 200, a 31-page PDF
GET /api/reporting/reports/parts-velocity/export?range=this_year&type=both&format=pdf&search=GA
    -> 200  application/pdf  308,824 bytes   27,358 ms   x-request-id 207aa593-aedb-4f51-b03d-f5829343febe

# 449 rows, ALL columns -> 500
GET /api/reporting/reports/parts-velocity/export?range=this_year&type=both&format=pdf&search=HO
    -> 500  application/problem+json  173 bytes   33,260 ms   x-request-id e583742c-a980-4ce3-86a2-7baee1c47519
       {"errors":[{"error":"An error occurred. We're sorry for this inconvenience, please try again a bit later later."},
                  {"requestId":"e583742c-a980-4ce3-86a2-7baee1c47519"}]}

# THE SAME 449 ROWS with only two columns -> 200
GET /api/reporting/reports/parts-velocity/export?range=this_year&type=both&format=pdf&search=HO
    &columns=part_number,description
    -> 200  application/pdf  213,370 bytes    8,032 ms   x-request-id a74f14eb-b3ca-4a68-afe9-5de89a3495a7

# Inventory Value, whole list, one location, 5,657 rows
GET /api/reporting/reports/inventory-value/export?range=custom&start_date=2026-08-01&end_date=2026-08-04
    &locations=b3c8c820-f815-4cf1-8938-10956c5ee71a&format=pdf
    -> 500   34,877 ms   x-request-id d6e2a808-631d-4aba-be09-1d25125fd9dc
...&format=csv
    -> 200  text/csv  724,109 bytes   2,426 ms   x-request-id 8c6d3848-a126-4271-91af-93954e1512af
```

### Expected — the requirement, verbatim (Rule 25)
> **Inventory Value spec v3, S10-R12 — "Export size guardrail."** *"To keep a single-shot export
> renderable, an export is capped at a maximum of **10,000 rows** in the filtered set. When the current
> filtered set exceeds the cap, neither the PDF nor the CSV is produced; instead the user sees the
> message: **" This report is too large to export. Narrow the date range or filters, then try again."**"*

> **Inventory Value spec v3, S10-R14.** *"If a download fails, the user sees an error notification:
> "Failed to export inventory value report (pdf)" or "Failed to export inventory value report (csv)"."*

The point is not the wording of a message. It is that **a guardrail exists whose entire purpose is to
make a large export fail gracefully, and the failure happens far below it** — so the guardrail never
runs and the user gets a raw server error instead.

### Actual — what was observed
**Parts Velocity** (`exports-log.jsonl`, 29 probes, plus this pass's 6):

| Rows | Columns | Result | Elapsed | request id |
|---:|---|---|---:|---|
| 13 | all | 200 (2 pp) | 3.5 s | `ed33b3c8-…` |
| 41 | all | 200 (6 pp) | 7.8 s | `beed12a8-…` |
| 321 | all | 200 (24 pp) | 23.4 s | `7c05f5b3-…` |
| **344** | all | **200 (31 pp, 308,830 B)** | **37.9 s** | `bf010de0-…` |
| **344** | all | **200 (byte-identical)** | **55.4 s** | `440a5831-…` |
| **344** | all | **200 (308,824 B)** | **27.4 s** | `207aa593-…` ← this pass |
| **449** | all | **500** | **39.1 s** | `36af28ab-…` |
| **449** | all | **500** | **36.0 s** | `767a0020-…` |
| **449** | all | **500** | **33.3 s** | `e583742c-…` ← this pass |
| **449** | **2 only** | **200 (213,370 B)** | **8.0 s** | `a74f14eb-…` ← this pass |
| 475 | all | 500 | 63.1 s | `f144cde6-…` |
| 724 | all | 500 | 35.1 s | `6c76fffb-…` |
| 1,079 | all | 500 | 63.1 s | `1ffab647-…` |
| 1,241 | all | 500 | 45.6 s | `1f6ec1cd-…` |
| 3,238 | all | 500 | 69.2 s | `7bbf9c85-…` |
| 3,238 | **2 only** | **500** | 33.2 s | `fdc5da7b-…` ← this pass |

**Inventory Value** (`iv-pdf-boundary.json`, `pdfprobe.json`):

| Rows | Result | Elapsed |
|---|---|---|
| 1 · 11 · 149 · 269 · 276 · 320 · 396 · 408 · 411 · 532 | 200 | 18–29 s |
| **538** | **200 then 500** | 25 s / 31 s |
| **578** | **200 then 500** | 25.4 s / 32.2 s |
| 648 · 725 · 793 · 896 · 1,339 · 3,872 · 4,416 · 4,811 · 5,154 · 5,657 · 9,275 | 500 | 31–33 s |
| 5,657 | **500** | **34.9 s** ← this pass |
| 5,657 — **CSV** | **200**, 724,109 B | **2.4 s** ← this pass |

**Sales By Customer / Sales By Representative** — the 12-month, two-location **Expanded PDF** returns
500 on both (`ffca8e2c-f6ae-4477-9216-16083355a3e5`, `139bcca5-44a4-41a6-8255-e4d7b4a1ef30`), while the
Expanded CSV of the same scope succeeds at 5,746 and 3,555 data lines. A 2-month Expanded PDF renders
fine (SBC 49 pages).

**Technician Utilization** — the This-Year **Expanded** PDF returns 500 after 32.8 s
(`87142301-9ebe-4330-9f3d-c23c91837800`) while its Summary PDF returns in 1.95 s.

### The disagreement between the two batches — and what settles it
The brief is right that the batches disagreed, and neither was wholly right.

- The **Inventory Value** pass concluded **"a ~30-second server-side timeout"** — every one of its
  failures landed at **31–33 s**.
- The **Parts Velocity** pass **ruled a timeout out** — a **55.4 s success** sat beside a **36.0 s
  failure**, which no fixed wall-clock limit can produce — and bounded it at **344 rows pass /
  449 rows fail**.

**What is ESTABLISHED (all of it observed, none inferred):**
1. **PDF only.** The CSV of every failing scope succeeded, always, and fast — 0.8–5.1 s, including the
   full 5,657-row Inventory Value list at 2.4 s and Parts Velocity's whole 6,219-row list.
2. **It fires far below the 10,000-row cap**, so the graceful guardrail never runs. Inventory Value's
   entire two-location list (9,275 rows) fails; Parts Velocity fails at **449 of 6,219**.
3. **The cap itself does work** where it is reachable: Parts Velocity across both locations is 10,064
   rows and is refused politely with **HTTP 400** *"This report is too large to export. Narrow the date
   range or filters, then try again."* So this is a second, different failure mode below that line.
4. **It is not row count alone.** This pass's decisive datum: **the same 449 rows, same filters, same
   range, one request apart — 500 with all 20 columns (33.3 s), 200 with 2 columns (8.0 s).**
   Narrowing the columns rescued it; narrowing them on 3,238 rows did not.
5. **It is an application error, not a gateway timeout.** The response is `500` with
   `content-type: application/problem+json`, the app's own doubled sentence and an `x-request-id`.
   A proxy timeout would be a `502`/`504` with an HTML body. `server: nginx/1.30.4` passed it through.
6. **The renderer is `WeasyPrint 69.0`** (the `Producer` field of every successful PDF).
7. **Server throughput for identical work varies a lot** — the same 344-row / 31-page PDF took
   **27.4 s, 37.9 s and 55.4 s** on three occasions, byte-identical output. So elapsed time is not a
   clean proxy for how much work was done.

**What is NOT established — the mechanism.** Two readings each fit part of the data and we cannot
separate them from outside the server:
- **an execution-time limit of roughly 30–33 s somewhere in the render path** — fits every Inventory
  Value failure and all three of this pass's failures (33.2 s, 33.3 s, 34.9 s), but **cannot explain**
  the 55.4 s success or the 63.1 s and 69.2 s failures;
- **a resource ceiling (memory / page count) rather than time** — fits the 55.4 s success and the
  columns-rescue result, but **does not explain** why so many failures cluster so tightly at 31–35 s.

Fact 7 (throughput varies) partly reconciles them: if a fixed limit applies to one *stage* while the
total request time also includes a variable stage, both patterns can coexist. **That is a hypothesis,
not a finding, and it is not asserted in the ticket.** One look at the server log for any of the
captured `x-request-id`s will settle it in minutes — that is the ask.

### Evidence
- `build/report-suite/viu-2026-08-03/batch-pv-tu/evidence/pv/exports/exports-log.jsonl` (29 probes)
- `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/api/iv-pdf-boundary.json`, `pdfprobe.json`
- `build/report-suite/viu-2026-08-03/batch-sbc-sbr/evidence/export-guards.md` §3
- `build/report-suite/defect-pack-2026-08-04/probe/pdf500-mechanism-probe.json` (this pass)
- Successful PDFs for comparison: `batch-pv-tu/evidence/pv/exports/*.pdf`

### Frequency
**Deterministic outside a narrow band.** Small views always succeed; large views always fail; and
there is a band at the edge where the same request can go either way — Inventory Value at **538 and
578 rows** succeeded once and failed once each. Threshold on Parts Velocity with all columns: **passes
at 344, fails at 449**. On Inventory Value: **reliable up to ~532, unreliable 538–578, always fails
from 648.**

### Severity — **High**
A user cannot get a PDF of a full year, or of a whole parts list, on five of the six reports, and what
they get instead is a bare "something went wrong" with no guidance. It is not **Critical** because
there is a working path to the same data (the spreadsheet, which is fast and complete) and no data is
corrupted or lost.

### What we do NOT yet know
- The mechanism (above).
- Whether the 63.1 s and 69.2 s Parts Velocity failures are the *same* failure as the 33 s ones, or a
  second slower path. Not established.
- Whether the failure is per-request or affected by concurrent load — all probing was single-threaded.
- The exact row/column threshold on Sales By Customer, Sales By Representative and Technician
  Utilization; only that the widest reachable scope fails and a 2-month scope succeeds.
- Whether it is already fixed or still being worked on — **the branch is not final.**

### TestRail cases this bears on
PV-EXP-11 = [C38885](https://shopview.testrail.io/index.php?/cases/view/38885) ·
TU-EXP-09 = [C38887](https://shopview.testrail.io/index.php?/cases/view/38887) ·
IV-EXP-07 = [C30593](https://shopview.testrail.io/index.php?/cases/view/30593) ·
IV-EXP-09 = [C30595](https://shopview.testrail.io/index.php?/cases/view/30595) ·
SBC-EXP-14 = [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) ·
SBC-API-05 = [C30194](https://shopview.testrail.io/index.php?/cases/view/30194) ·
SBR-EXP-15 = [C30290](https://shopview.testrail.io/index.php?/cases/view/30290) ·
SBR-API-05 = [C30320](https://shopview.testrail.io/index.php?/cases/view/30320) ·
plus a proposed new case **PV-EXP-12** (new, no C-id yet) staged in
`batch-pv-tu/STAGED-CHANGES.md` §D. **None of these was edited by this pass.**

---
---

# 2. Turns / Yr divides by the wrong number of days on the "This Year" preset

### Summary
On the **This Year** date range, the Turns / Yr figure on Parts Velocity is calculated over **215 days
where the requirement says 216**, so every Turns / Yr number on that view is about half a percent too
high — and nothing on the screen tells the reader the figure is wrong.

### ⚠️ CORRECTION to the earlier finding — the defect is NARROWER than reported
The Parts Velocity batch recorded this as *"BRAKECLEAN (512 sold, 618 on hand, **Jan 1 – Aug 4**)
returns 1.40648754422 … the WINDOW DIVISOR IS ONE DAY SHORT"*, which reads as though any range from
Jan 1 to Aug 4 is affected. **It is not.** Re-probing this pass with an explicit custom range over
**those exact dates** returned the **spec-correct** figure. The batch's probe used
`range=this_year`, not a custom range, and the difference between the two is the whole defect.

This matters practically: a developer handed *"the divisor is off by one"* would inspect the Turns
formula and find nothing wrong with it. The formula is correct. **The window derived for the
`this_year` preset is what is short.**

### Environment + build marker
Same build **`v3.4.1-0ed4433`**, `sv8582.qa.shopview.com`. Re-observed live **2026-08-04 04:10–04:16
UTC**. Today's date on the server: **2026-08-04**.

### Preconditions — and how to create the data state
**No seeding.** Any inventory part with sales this year and stock on hand shows it; **440 rows** on
this org qualify. The example below uses part **`BRAKECLEAN`** at `Staging Heavy Duty - 9919`, which
already exists.

### Steps to reproduce — from the screen
1. Open **Parts Velocity** (`/reports/parts-velocity`).
2. Set the date range to the **This Year** preset and press **Apply**.
3. Open **Column Selection** and switch **Turns/Yr** on (it is hidden by default).
4. Search for `BRAKECLEAN`. Read **Units Sold**, **On Hand** and **Turns/Yr**.
5. Now set the same period as a **custom range** on the calendar — **1 Jan 2026 to 4 Aug 2026** — and
   press **Apply**. Read the same row again.
6. The two Turns/Yr figures differ, although the period is the same period. The custom one is right.

### Steps to reproduce — the exact requests
```
A) THE PRESET
GET /api/reporting/reports/parts-velocity?range=this_year&type=both
    &locations=<HeavyDuty>,<Lethbridge>&search=BRAKECLEAN
 -> 200  units_sold 512  on_hand 618  turns_per_year 1.40648754422     implied window 215 days
         units_sold 359  on_hand  12  turns_per_year 50.78875968992    implied window 215 days

B) THE IDENTICAL DATES AS A CUSTOM RANGE
GET /api/reporting/reports/parts-velocity?range=custom&start_date=2026-01-01&end_date=2026-08-04
    &type=both&locations=<HeavyDuty>,<Lethbridge>&search=BRAKECLEAN
 -> 200  units_sold 512  on_hand 618  turns_per_year 1.39997602781     implied window 216 days  ✅
         units_sold 359  on_hand  12  turns_per_year 50.55362654317    implied window 216 days  ✅
```
The divisor is recovered from the returned figure itself, so it does not depend on reading any code:
`Window = Units Sold × 365 ÷ (Turns/Yr × On Hand)`.

### Expected — the requirement, verbatim (Rule 25)
> **Parts Velocity spec v4, §5 Definitions.** *"**Window** — the whole-day span of the selected range,
> **inclusive of both the start and end dates**, with a floor of 1 day (so a single-day range such as
> Today has Window = 1). This is the divisor used to annualize Turns / Yr."*

> **Parts Velocity spec v4, S5-R4 (column calculation table).** *"**Turns / Yr** … `(Units Sold ÷
> Window days × 365) ÷ On Hand`; renders `0.00` when On Hand is 0."*

1 Jan 2026 → 4 Aug 2026 inclusive is **31+28+31+30+31+30+31+4 = 216** days. (2026 is not a leap year.)

### Actual — the arithmetic, both ways, on two independent rows
**Row 1 — `BRAKECLEAN` at Heavy Duty: Units Sold 512, On Hand 618.**
- Build: `512 ÷ 215 × 365 ÷ 618` = **1.40648754422** — matches the returned value to all 11 decimals.
- Spec: `512 ÷ 216 × 365 ÷ 618` = **1.39997602781** — matches the custom-range value exactly.
- Overstated by **0.465 %**.

**Row 2 — `BRAKECLEAN` at Lethbridge: Units Sold 359, On Hand 12.**
- Build: `359 ÷ 215 × 365 ÷ 12` = **50.78875968992** — matches.
- Spec: `359 ÷ 216 × 365 ÷ 12` = **50.55362654317** — matches the custom-range value exactly.

A third row from the batch corroborates: `GREASETUBE`, 208 sold / 39 on hand → **9.05426356587**
returned, `208÷215×365÷39` = 9.05426356589, spec `÷216` = 9.01235.

The error factor is exactly **216 ÷ 215**, i.e. every Turns / Yr on **This Year** is **0.465 % high**,
and it grows as the year shortens: on 2 January the preset would divide by 1 instead of 2 and the
figure would be **double**.

### Which presets are affected — measured, not assumed
| Preset | Inclusive span the spec requires | Window the build used | Rows measured | Verdict |
|---|---|---|---|---|
| **`this_year`** (Jan 1 → today) | **216** | **215** | 440 | **✗ ONE DAY SHORT** |
| `last_month` (Jul 1 → Jul 31) | 31 | **31** | 6 | ✅ correct |
| `last_quarter` (Apr 1 → Jun 30) | 91 | **91** | 447 | ✅ correct |
| `last_year` (2025 in full) | 365 | **365** | 416 | ✅ correct |
| `this_quarter` (Jul 1 → today) | 35 | **92** | 6 | **⚠️ see below — not asserted** |
| `this_month`, `this_week` | 4 / — | not measurable | 0 | no row had both sales and stock in the period |

So **every closed past period is correct** — which is further proof that the formula is fine and only
the current-period window derivation is at fault.

**⚠️ The `this_quarter` observation is recorded, NOT asserted as a defect.** It divided by **92**,
which is exactly the inclusive span of the **whole** quarter (1 Jul → 30 Sep) rather than
quarter-to-date (35). Whether that is wrong depends on what end date the **This Quarter** picker
actually selects, which I could not read from the API, and only 6 rows carried a usable figure. It is
in the ticket as a "please check this too while you are in here", clearly labelled.

*(Aside, not a defect: `range=last_12_months` is rejected by this endpoint with HTTP 400 even though
the picker offers a **Last 12 Months** preset — the picker evidently maps it to different parameters.
Recorded so nobody mistakes it for a bug.)*

### Evidence
- `build/report-suite/defect-pack-2026-08-04/probe/turns-ab-probe.json` (the decisive A/B)
- `build/report-suite/defect-pack-2026-08-04/probe/turns-presets-probe.json` (all eight presets)
- `build/report-suite/defect-pack-2026-08-04/probe/turns-window-probe.json`
- `build/report-suite/viu-2026-08-03/batch-pv-tu/evidence/pv/calc-checks.json` → `turnsCheck`
- `build/report-suite/viu-2026-08-03/batch-pv-tu/VERDICTS.md` line 150

### Frequency
**Always**, on the This Year preset, on every row that has both sales and stock — 440 rows on this org
right now. Never on a custom range covering the same dates.

### Severity — **High**
A wrong number on a report a shop owner uses to decide what to reorder, **and nobody can tell it is
wrong by looking at it**. It is not Critical because the error today is under half a percent and no
data is corrupted — but the same bug is a 2× error in early January, so its size is seasonal.

### What we do NOT yet know
- Whether `this_month`, `this_week` and `last_12_months` share the fault. No row on this org had both
  in-period sales and on-hand stock for those ranges, so **there was nothing to measure** — this is a
  genuine data gap, not an assumption. Seedable, but it needs an invoiced sale inside the period and
  invoicing is broken (defect 4a), so it is blocked behind that.
- Whether `this_quarter`'s 92 is correct (see above) — needs the UI's selected end date confirmed.
- Whether the same short window feeds any other calculation. Only Turns / Yr is documented as using
  Window; Units Sold, Demand and the money columns are windowed but not divided by it, so they would
  be affected only by which events fall inside the range, and no discrepancy was seen there.

### TestRail cases this bears on
PV-CALC-09 = [C30367](https://shopview.testrail.io/index.php?/cases/view/30367) ·
PV-CALC-16 = [C30374](https://shopview.testrail.io/index.php?/cases/view/30374). **Neither was edited
by this pass** — and both will need their reproduction wording corrected to name the **This Year
preset**, since as written they would not reproduce it. That is flagged, not done.

---
---

# 3. Inventory Value reports the stock value for the wrong day

### Summary
When you ask Inventory Value for the stock value as of a past date, it answers with the day **after**
the one you asked for — always exactly one day late — so the number on screen belongs to a different
day than the one the date control says.

### Environment + build marker
Same build **`v3.4.1-0ed4433`**. Observed **2026-08-04** (`batch-wip-iv`, re-confirmed in this pass's
boundary data where every probe with `end_date=2026-08-04` returned `as_of_date 2026-08-04`).
Server's today: **2026-08-04**. Nightly history on this org begins around **2026-08-01**.

### Preconditions — and how to create the data state
**No seeding.** The report already has two recorded days of history. The proof does not even need
history: the off-by-one shows on dates with **no** data at all (see the 2020 probe), because the
resolved date is echoed back in the payload regardless.

### Steps to reproduce — from the screen
1. Open **Inventory Value** (`/reports/inventory-value`).
2. On the date control, set a range that **ends yesterday** — 3 Aug 2026 — and press **Apply**.
3. Look at the **"As of"** line under the report title. It reads **08/04/2026** — today — not the
   3 Aug you asked for.
4. Now set a range ending **31 Jul 2026** and press **Apply**. The "As of" line reads **08/01/2026**.
5. Repeat with a range ending **31 Jan 2026**: the report resolves to **02/01/2026**.

### Steps to reproduce — the exact requests and the exact field
The resolved date is returned as **`data.as_of_date`** in the report payload:
```
GET /api/reporting/reports/inventory-value?range=custom&start_date=2026-08-03&end_date=2026-08-03
 -> 200   data.as_of_date = "2026-08-04"     asked 08-03, answered 08-04   ✗
          rows 5657   totals.total_cost 48554218   (identical to today's live figure)

GET …?range=custom&start_date=2026-07-01&end_date=2026-07-31
 -> 200   data.as_of_date = "2026-08-01"     asked 07-31, answered 08-01   ✗
          rows 5657   totals.total_cost 48554966   (a DIFFERENT figure — stored history IS being served)

GET …?range=custom&start_date=2026-01-01&end_date=2026-01-31
 -> 200   data.as_of_date = "2026-02-01"     asked 01-31, answered 02-01   ✗   rows 0

GET …?range=custom&start_date=2020-01-01&end_date=2020-01-31
 -> 200   data.as_of_date = "2020-02-01"     asked 01-31, answered 02-01   ✗   rows 0

GET …?range=custom&start_date=2027-01-01&end_date=2027-01-31   (a future range)
 -> 200   data.as_of_date = "2026-08-04"     correctly capped at today     ✅
```
Note the last two: the shift is applied **even outside the history window and even in 2020**, so it is
plainly arithmetic on the requested date, not a history lookup landing somewhere sensible.

### Expected — the requirement, verbatim (Rule 25)
> **Inventory Value spec v3, S5-R2.** *"The report values inventory **as of** the end of the selected
> range."*

> **Inventory Value spec v3, S5-R4.** *"Otherwise, the report replays the closest recorded day **on or
> before** the end of the selected range."*

> **Inventory Value spec v3, S5-R7.** *"A Custom range lets the user pick a start and end date; the
> report values as of the picked end date (never a future date — it is capped at today)."*

**S5-R4 is breached twice over:** the day served is not the end of the range, and it is not *on or
before* it either — it is **after** it, which the requirement explicitly forbids.

### Actual
Every requested end date resolves to **end date + 1 day**. Where the +1 day lands on today, the shift
is masked (the report shows today's live stock, which is why the default view looks right). Where it
lands on a stored snapshot, a **different day's money** is reported under the requested date's label:
asking for 31 July returned total cost **$485,549.66** while today's live figure is **$485,542.18** —
so real, different stored numbers are being served under the wrong date.

There is a knock-on effect: the **"As of"** indicator is supposed to appear only when the day shown
differs from the day asked for (S5-R6) but it is **always** shown — and because of this off-by-one,
**no request can ever resolve to an earlier day**, so the one case the indicator exists for cannot be
produced at all.

### Evidence
- `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/api/api-wip-iv.json` → `iv.asOf`
  (all eight probes with their resolved dates, row counts and total-cost figures)
- `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/api/iv-pdf-boundary.json` (11 more probes,
  every one echoing `asOf 2026-08-04`)
- `build/report-suite/viu-2026-08-03/batch-wip-iv/VERDICTS.md` line 2142
- The exported CSV carries it too: `batch-wip-iv/evidence/exports/iv__MULTI__wholelist__csv.head.txt`
  line 1 = `"As of: 2026-08-04"`

### Frequency
**Always.** Eight out of eight date probes, plus eleven more in the boundary set — every one shifted
by exactly one day, across 2020, January 2026, July 2026 and August 2026. The only requests that look
right are those whose +1 lands on today, and future dates, which are correctly capped.

### Severity — **High**
This is a **money figure reported against the wrong date**, on the report an owner would use to close
a month or value stock for accounts — and, exactly as the QA lead said, **nobody can tell it is wrong
by looking at it.** A month-end stock valuation taken on 31 July would silently be the 1 August
figure. Not Critical only because no data is written or corrupted; the reading is simply mislabelled.

### What we do NOT yet know
- Whether the shift is in the date parsing, in a timezone conversion, or in the snapshot lookup. The
  PDF header shows a related one-day-late date (`end_date=2026-08-04` printed as `Aug 5, 2026` — see
  the awareness list), which **suggests** a shared timezone conversion, but that is a hypothesis and
  is not asserted.
- Whether Work In Progress's nightly snapshot has the same shift — it cannot be checked, because
  there is no read route into the stored rows (see `NIGHTLY-SNAPSHOT-EXPLAINED.md`).
- How the fault behaves once history is more than two days deep. This org's history starts ~2026-08-01.

### TestRail cases this bears on
IV-DATE-02 = [C30562](https://shopview.testrail.io/index.php?/cases/view/30562) ·
IV-DATE-04 = [C30564](https://shopview.testrail.io/index.php?/cases/view/30564) ·
IV-DATE-05 = [C30565](https://shopview.testrail.io/index.php?/cases/view/30565) ·
IV-DATE-06 = [C30566](https://shopview.testrail.io/index.php?/cases/view/30566). **None edited.**

---
---

# 4. Two endpoints return HTTP 500, and they block 15 test cases

### Summary
**(4a)** Creating an invoice fails with a server error, so no new invoice can be made on this branch —
which is what leaves the whole invoiced-hours column at zero and makes the sales-rep test set
unreachable. **(4b)** Saving a customer fails with a server error if a sales-rep id is supplied,
although the save the screen itself performs works.

### ⚠️ HONEST CORRECTION on which of the two actually blocks the cases
The brief describes both as "what stopped the invoiced-hours pipeline and the sales-rep deactivation
prerequisites". On the evidence, **4a does all the blocking. 4b does not.** The `customers/change`
500 blocked one *API-only shortcut* for assigning a customer's rep, which was then done successfully
through the shape the UI uses (HTTP 200). It is a genuine robustness defect — a server should answer
an unexpected field with a 400, not a 500 — but **nothing in the 15 depends on it.** Filed separately
and rated Low for that reason, rather than being bundled in to look weightier.

### Environment + build marker
Same build **`v3.4.1-0ed4433`**, observed **2026-08-03/04** during the SBC/SBR batch.

### 4a — `POST /api/invoices/create`

**Preconditions, and how to create them** (the whole chain is already proven and scripted in
`batch-sbc-sbr/tools/seed_seed_invoiced_wo.mjs` — 264 work orders were created and all 264 deleted):
1. `POST /api/iam/change-location {workplace_id, workplace_timezone}` — switch into the workplace
   first, or later writes report success and do nothing.
2. `POST /api/work-orders/create {company_id, vehicle_id, workplace_id, start_date,
   is_vehicle_here:true}` → **201**, id in `data.work_order_id`.
3. Add a priced line — `POST /api/work-orders/{woId}/lines/create-from-canned-line
   {canned_line_id, status:'authorized'}` → **201**. *(The plain
   `POST /api/work-orders/lines/create` route 500s as soon as validation passes — request ids
   `ecdf8b8d-…`, `0b0f8bd9-…`, `e97df1d1-…`, `07c300f0-…` — so use the canned-line route.)*
4. Drive the work order through to **Complete** in the UI wizard.

**Steps to reproduce**
1. With that completed, priced work order, call
   `POST /api/invoices/create {"work_order_id":"<id>"}` → **HTTP 500**.
2. Or do it from the screen: open the work order's **Finance** tab and press **Create Invoice**. It
   fails the same way through a different route:
```
POST /api/work-orders/invoices/estimate
{"work_order_id":"72bf3305-cbf8-44bb-ad52-3e983dd930e7","type":"html","isEstimate":1,
 "includeDeclined":0,"issueDate":"","dueDate":"","historyEvent":null}
-> 500
```
**Request ids captured:** `24dbd181-7ed7-489c-b1f2-ae7e878b0dbe`,
`a7ab157a-dc44-48fb-8440-b7a92576645c`, `8d0e2a06-7727-4c89-9b43-e719154ab327`,
`818265ba-7cc1-4dfc-8d58-2c5f5c470d9a`, `b7bf4a22-eff4-4b71-9c68-c0792be63a48`.

**Expected.** An invoice is created. There is no Report Suite requirement to quote here — invoicing is
not Report Suite work — which is exactly why this is filed as a standalone bug and not under the epic.
What the reports then require of it is:
> **SBR spec v15, S19-R6.** *"At invoice creation, the WO's Sales Rep is snapshotted onto the resulting
> invoice, and that snapshot is what the report reads."*

That requirement is why a broken invoice-create makes a whole test area unreachable: **a new invoice
is the only way to create a new rep row in the report.**

**Actual.** 500 on both routes, five request ids captured, on a work order driven all the way to
Complete with a completed priced line. Everything up to invoicing works.

### 4b — `POST /api/customers/change` with `sales_rep_id`

**Steps to reproduce**
1. `GET /api/customers/view/{id}` for any customer.
2. Re-post the same body to `POST /api/customers/change` **with `sales_rep_id` added** → **HTTP 500**.
3. Re-post it **without** `sales_rep_id`, carrying `sales_rep_first_name` / `sales_rep_last_name`
   instead — the shape the Edit Customer dialog actually sends → **HTTP 200**:
```
POST /api/customers/change
{"name":"Aaborough Works","telephone":"573-219-5819","address_1":"6622 Donna Knoll Apt. 574",
 "city":"Michellefort","state_or_province":"Nova Scotia","postal_code":"A3P7S3","country_code":"",
 "sales_rep_first_name":"Dalton","sales_rep_last_name":"Daniel","ibs":"","require_po":false,
 "credit_term":"COD","credit_limit":0,"shop_supplies_charge":null,"min_shop_supplies_charge":null,
 "max_shop_supplies_charge":null,"pin_notes":false,"notes":null,
 "id":"7af75d7c-c9f8-4209-860a-e685e9bd7c1c",
 "tax":{"id":null,"isEnabledLabor":false,"isEnabledParts":false,"isEnabledShopSupplies":false}}
-> 200
```
4. Read the customer back: `sales_rep_id` is **`null`** and the name pair is populated — the customer's
   rep is stored **by name, not by id**.

**Expected.** An unrecognised or unsupported field should be rejected with a validation error
(HTTP 400), not crash the request. **No spec text covers this** — stated plainly rather than dressed
up: this is a general robustness expectation, not a quoted requirement.

**Honest limit:** **no request id was captured** for this 500 — the probe was not logging them at that
moment. The reproduction above regenerates one on demand in about a minute.

### The 15 cases that cannot be verified until 4a is fixed
**Nine** recorded as blocked outright — all nine are the ones this pass reclassifies (see
`RECLASSIFIED.md`):

| Internal ID | TestRail | Link |
|---|---|---|
| SBR-API-06 | C30321 | https://shopview.testrail.io/index.php?/cases/view/30321 |
| SBR-DEACT-02 | C30253 | https://shopview.testrail.io/index.php?/cases/view/30253 |
| SBR-DEACT-03 | C30254 | https://shopview.testrail.io/index.php?/cases/view/30254 |
| SBR-DEACT-04 | C30255 | https://shopview.testrail.io/index.php?/cases/view/30255 |
| SBR-DEACT-05 | C30256 | https://shopview.testrail.io/index.php?/cases/view/30256 |
| SBR-DEACT-06 | C30257 | https://shopview.testrail.io/index.php?/cases/view/30257 |
| SBR-DEACT-07 | C30258 | https://shopview.testrail.io/index.php?/cases/view/30258 |
| SBR-DEACT-08 | C30259 | https://shopview.testrail.io/index.php?/cases/view/30259 |
| SBR-DEACT-09 | C30260 | https://shopview.testrail.io/index.php?/cases/view/30260 |

**Five** whose arithmetic cannot be exercised because **every** `Inv. Hrs`, `Hrs Worked` and
`Hrs Invoiced` value is `0.0` across the whole org and every date range — and a new invoice is the only
way to put hours into that pipeline:

| Internal ID | TestRail | Link |
|---|---|---|
| SBC-CALC-03 | C30151 | https://shopview.testrail.io/index.php?/cases/view/30151 |
| SBR-CALC-01 | C30229 | https://shopview.testrail.io/index.php?/cases/view/30229 |
| SBR-CALC-02 | C30230 | https://shopview.testrail.io/index.php?/cases/view/30230 |
| SBR-CALC-03 | C30231 | https://shopview.testrail.io/index.php?/cases/view/30231 |
| SBR-CALC-09 | C38894 | https://shopview.testrail.io/index.php?/cases/view/38894 |

**And one partially blocked, counted as the fifteenth:**

| Internal ID | TestRail | Link | Why |
|---|---|---|---|
| SBR-WO-05 | C30314 | https://shopview.testrail.io/index.php?/cases/view/30314 | Passes overall — two of its three legs were proven live — but the **customer-rep fallback** leg only applies at invoice creation, so it cannot be exercised. |

**Honest note on the count.** 9 + 5 = **14 fully blocked**; with the one partially blocked case that
is **15**. The SBC/SBR batch's own prose says *"Six cases (SBC-CALC-03, SBR-CALC-01/02/03/09)"* and
then names five — the "six" is an arithmetic slip in that document. The correct figure is **five**
invoiced-hours cases, and the fifteenth item is SBR-WO-05's unexercisable leg. Nothing is being padded
to reach fifteen and nothing is being dropped to avoid it.

### Evidence
- `build/report-suite/viu-2026-08-03/batch-sbc-sbr/ENV-DEFECTS.md` §1, §2, §3, §4
- `build/report-suite/viu-2026-08-03/batch-sbc-sbr/evidence/deactivation/customer-edit-dialog.md`
- `build/report-suite/viu-2026-08-03/batch-sbc-sbr/VERDICTS.md` findings **F15**, **F50**
- `build/report-suite/viu-2026-08-03/batch-sbc-sbr/verdicts.csv` (per-case verdicts and reasons)

### Frequency
**4a:** always, on every attempt, on both routes. **4b:** always, whenever `sales_rep_id` is present.

### Severity
**4a — High.** A core money flow does not complete on this branch, and it blocks 15 test cases from
ever being graded. Not Critical because it is a QA branch and nothing suggests it is on a release
build. **4b — Low.** The screen's own save works; only an unsupported field crashes, and the correct
behaviour would be a validation message.

### What we do NOT yet know
- The cause of either 500 — request ids are captured for 4a; the log will say.
- Whether either is intentional work-in-progress on an unfinished branch. **It is not final.**
- Whether invoice creation is broken generally or only for work orders created through the API.
  Every attempt used an API-created work order, and the UI's own **Create Invoice** button failed on
  the same work order — but a work order created entirely through the UI wizard was **not** tried.
  That is a real gap in the reproduction and it is stated rather than glossed.

---
---

# 5. FOR AWARENESS — the Inventory Value spreadsheet, and three smaller observations

The QA lead asked for this one **flagged for awareness rather than as a new ticket**. A paste-ready
ticket is nonetheless written (`TICKET-6-…`) so it can be filed in one move if he wants it, because it
has a concrete user cost.

### 5a. Money in the Inventory Value spreadsheet arrives as text
The CSV writes money exactly as the screen does — dollar sign, thousands separators, quoted because of
the comma. Spreadsheets therefore import every money column as **text**, so it cannot be summed,
sorted numerically or charted without cleaning it first.

**Observed, line 4 of the file, verbatim:**
```
R134A,Refrigerant,HD-Fluids,—,786.55,$14.21,$21.86,"$11,176.88","$17,193.98","$6,017.10",35.0%
```
**Breached requirement, verbatim (Rule 25) — Inventory Value spec v3, Story 10 context note:**
> *"in the CSV, money values are written as plain numbers with two decimals and **no thousands
> separators (so they parse cleanly in a spreadsheet)**; the PDF uses the same on-screen currency
> formatting with the "$" and thousands separators."*

The PDF half is correct. Only the CSV breaches it.

### 5b. The spreadsheet ignores your column choice and re-orders the columns
Turning **Margin** or **Total Sell** off on screen does not remove them from the file — the export
emits **every** column regardless. And the file's order is not the screen's order:

| | Order |
|---|---|
| On screen | Part #, Description, Category, Vendor, [Location,] Qty, Unit Cost, Unit Sell, Margin, Margin %, **Total Sell, Total Cost** |
| In both files | Part #, Description, Category, Vendor, [Location,] Qty, Unit Cost, Unit Sell, **Total Cost, Total Sell, Margin, Margin %** |

So **Total Cost is 9th in the file and last on screen**, and **Margin % is last in the file**.
Confirmed at the API too: a three-column request and a deliberately nonsensical column name both
returned the same full file, with no error.

**Verbatim file header** (`batch-wip-iv/evidence/exports/iv__MULTI__wholelist__csv.head.txt`):
```
"As of: 2026-08-04"
"Locations: All locations"
"Part #",Description,Category,Vendor,Location,Qty,"Unit Cost","Unit Sell","Total Cost","Total Sell",Margin,"Margin %"
Totals,,,,,"195,249.93",,,"$977,080.47","$1,832,152.49","$855,072.02",46.7%
```
**Breached requirement, verbatim — Inventory Value spec v3, S10-R3:**
> *"Both downloads include **only the columns currently shown**, in the **same left-to-right order as
> the screen**, with **Total Cost last**."*

Three assertions in one requirement, and all three are breached.

**Grouping justification:** 5a and 5b are one ticket because they are one component — the Inventory
Value export writer — and one fix touches both. They are not merged with defect #1 (the PDF 500),
which is a different failure in a different layer.

**Severity — Medium.** Real, daily friction for anyone doing arithmetic on the file, and a column
choice that is silently ignored, but the data itself is correct and complete.

**Cases:** IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588) ·
IV-EXP-03 = [C30589](https://shopview.testrail.io/index.php?/cases/view/30589). Neither edited.

### 5c. Every report PDF prints a date range one day too long
Requested `end_date=2026-08-04`; all four PDFs on both Sales reports printed
`Date Range: Jun 1, 2026 – Aug 5, 2026`. The **data** respects the requested range (the CSV rows stop
at 4 Aug) — only the printed header is wrong. It looks like the same class of timezone conversion as
defect #3. **Not filed** — it is cosmetic and it belongs with defect #3's investigation; recorded here
and in `batch-sbc-sbr/ENV-DEFECTS.md` §6.

### 5d. The customer's "Sales Representative" picker offers inactive staff
The Edit Customer dialog's dropdown lists the **whole staff list** — including staff flagged inactive
(`Louis Mccoy`, `Mary Higgins`) — rather than the sales-rep-toggled set that `GET /api/sales-reps`
returns and that the **work-order** selector correctly uses. **Not filed** — it is a real user-facing
inconsistency but it is outside the four findings the QA lead asked about, so it is surfaced here for
his go-ahead rather than filed on our own initiative (Rule 6). Evidence:
`batch-sbc-sbr/VERDICTS.md` finding **F50**.

---
---

## THE TWO CLEAN-UPS

- **(a)** 9 mislabelled cases → **`RECLASSIFIED.md`**. Corrected totals below.
- **(b)** the 12 nightly-snapshot cases in plain terms → **`NIGHTLY-SNAPSHOT-EXPLAINED.md`**.

### Corrected overall totals

| Verdict | Was | Now | Change |
|---|---:|---:|---|
| VIU-Observed-PASS | 326 | **326** | — |
| DEVIATION | 107 | **107** | — |
| NOT-BUILT | 13 | **13** | — |
| EXTERNAL-DEPENDENCY | 29 | **20** | **−9** |
| **BLOCKED-BY-DEFECT (new label)** | 0 | **9** | **+9** |
| **Total** | **475** | **475** | — |

The population is unchanged; nine cases move from "we are waiting on a third party" to "we are waiting
on a defect fix in this same branch", which is a materially different message to the QA lead — the
first sounds like something nobody controls, the second has an owner and a ticket.

**This is a corrected list only. `batch-sbc-sbr/`'s own files were NOT touched** (another pass owns
them) — **the master ledger still needs this merged.**

---

## OUTSTANDING — what I need from you

**1. The Atlassian MCP is not available in my session, so I could NOT file the tickets.**
- **What is missing:** Jira tooling. My session has only the GitHub MCP; there is no
  `jira_*` / `createJiraIssue` / `getJiraIssue` tool, no Atlassian entry in the MCP config, and no
  Atlassian credential in `/tmp`. I searched the deferred-tool catalogue four ways to be sure.
- **Who owns it:** you / the coordinator.
- **What it blocks:** all six tickets, and the duplicate search — **I could not query Jira for
  existing tickets, so I cannot promise none of these is already filed.** The paste-ready ticket files
  are complete and were written to be filed verbatim.
- **What would unblock it:** enable the Atlassian MCP for this worker, **or** hand the six
  `TICKET-*.md` files to the sibling worker that already has it working.
- **Since:** 2026-08-04, the moment the filing authorisation arrived.

**2. Your go-ahead to merge the 9 reclassifications into the master ledger.**
- **What is missing:** authorisation, and a decision on who edits `batch-sbc-sbr/verdicts.csv` +
  `VERDICTS.md`, since another pass owns those files and I was told not to touch them.
- **What it blocks:** the headline tally. Until it is merged, two different totals exist in the repo.
- **What would unblock it:** one line from you saying merge it, and which worker does it.

**3. A developer-provided way to read the nightly snapshot rows** — the full ask, in plain terms, is
in `NIGHTLY-SNAPSHOT-EXPLAINED.md`.
- **What it blocks:** 12 test cases can never be graded, in either direction.
- **Who owns it:** engineering (the owners of SV-8667 and SV-8678).

**4. A ruling on two observations I deliberately did NOT file** (5c the PDF header date, 5d the
inactive-staff rep picker). Both are real; neither is one of the four you asked about, so I have not
acted on my own initiative.

**5. Confirmation of when the QA branch is declared final** (Rule 49).
- **Why it is blocked on you and why that is right:** you have not been asked for this yet — I am
  raising it, not chasing it. Engineering said the branch is still being worked on, so **every verdict
  in this pack is provisional**, and `viu-2026-08-03/RECHECK-QUEUE.md` stays **OPEN** until the build
  settles. Defect #2 is the proof that this caution earns its keep: re-probing the same build changed
  the finding from "the divisor is wrong" to "the This Year preset's window is wrong", which is a
  different ticket.
- **What would unblock it:** engineering telling us the branch is final, or the app-version marker
  moving — **and note the caveat above: that marker tracks the front end only**, so for these
  back-end calculations we will re-run the probes rather than trust it.

**6. `this_month` / `this_week` / `last_12_months` Turns coverage is genuinely unmeasurable today** —
no row on this org has both in-period sales and on-hand stock for those ranges, and creating one needs
an invoice, which is defect 4a. So it is blocked behind 4a rather than skipped.
