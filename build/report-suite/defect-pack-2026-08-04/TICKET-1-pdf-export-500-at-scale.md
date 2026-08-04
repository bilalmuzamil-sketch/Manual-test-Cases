# TICKET 1 — ready to paste into Jira

| Field | Value |
|---|---|
| **Project** | SV (shopview.atlassian.net) |
| **Issue type** | Bug |
| **Summary** | PDF download fails with a server error on a medium-sized report view, on 5 of the 6 reports |
| **Suggested parent** | **SV-8591** — `[Reports Suite][A3] Export contract + 10k row-cap guard (CSV attachment + PDF scaffold)` |
| **Parent reasoning** | The defect is in the **shared** export/PDF path — it reproduces on Parts Velocity, Technician Utilization, Inventory Value, Sales By Customer and Sales By Representative alike, so it is not any one report's story. SV-8591 is the story that owns the export contract **and the 10,000-row cap guard**, and the essence of this bug is that the failure happens far below that guard so the guard never runs. Filing it under any single report's export story (SV-8646 / SV-8654 / SV-8677 / SV-8612 / SV-8631) would hide that it is one shared fault, and filing it on the epic SV-8582 would be less specific than it needs to be. |
| **Suggested severity / priority** | **High** |
| **Severity reasoning** | A user cannot get a PDF of a full year or a whole parts list on five of six reports, and gets a bare "something went wrong" with no guidance. Not Critical: the spreadsheet download of the same view works, is fast and is complete, and no data is corrupted or lost. |
| **Affects build** | `v3.4.1-0ed4433` on `sv8582.qa.shopview.com` |
| **Observed** | 2026-08-03 and 2026-08-04 (re-confirmed 2026-08-04 03:58–04:00 UTC) |
| **Labels (suggested)** | `reports-suite`, `export`, `pdf`, `qa-found` |

---

## What's wrong

When you ask a report for a PDF and the view has more than a few hundred lines in it, no file arrives.
Instead you get an error message saying something went wrong. Asking for the **spreadsheet** version of
exactly the same view works perfectly, and takes about a second.

This happens on five of the six new reports: Parts Velocity, Technician Utilization, Inventory Value,
Sales By Customer and Sales By Representative.

## Why it matters

Anyone trying to print or share a report for a full year — or a whole parts list — gets an error page
instead of a document. The reports were built with a deliberate safety net so that an over-large
download would be refused **politely**, with a message telling the user to narrow the dates or filters.
That safety net is set at 10,000 lines. This failure happens **far** below it — as low as 449 lines out
of a 6,219-line list — so the polite message never appears and the user just sees a crash.

There is no way for the person to tell how big is "too big", because a view that works one minute can be
made to fail simply by turning more columns on.

## What should happen instead

The written requirement (Inventory Value specification, version 3) says a download that is too large
should be **refused gracefully with a clear message**, not fail:

> "To keep a single-shot export renderable, an export is capped at a maximum of 10,000 rows in the
> filtered set. When the current filtered set exceeds the cap, neither the PDF nor the CSV is produced;
> instead the user sees the message: 'This report is too large to export. Narrow the date range or
> filters, then try again.'"

And if a download does fail for another reason, the same specification says the user should get a clear
message naming the report and the format — not a generic error:

> "If a download fails, the user sees an error notification: 'Failed to export inventory value report
> (pdf)' or 'Failed to export inventory value report (csv)'."

So: either the PDF should succeed at these ordinary sizes, or the safety net should catch it and explain
itself. At the moment neither happens.

## How to see it yourself

No special data is needed — the existing test data is already big enough, which is part of the problem.

1. Sign in as any user who can see reports, and open **Parts Velocity**.
2. Set the date range to **This Year** and pick a single location.
3. In the **Search parts** box type `GA`. About 344 lines remain.
4. Open the **three-dot** menu and choose **Download (PDF)**. A file arrives — this is the "working"
   case, so you can see the difference.
5. Now change the search to `HO`. About 449 lines remain.
6. Choose **Download (PDF)** again. After about half a minute, **no file arrives and an error appears.**
7. On that same view choose **Download (CSV)**. The spreadsheet arrives in about a second, with all the
   data in it. That is the proof that the data is fine and only the PDF is failing.

To see it on the other reports: **Inventory Value** with no filters at all fails the same way, and
**Sales By Customer** / **Sales By Representative** fail on the **Expanded** PDF when you pick a
12-month range across both locations.

If you want a *smaller* view for comparison, narrow the search box further — that is the only setup
needed in either direction.

---
---

# FOR ENGINEERING — technical evidence

**Environment.** App `https://sv8582.qa.shopview.com`, API `https://sv8582api.qa.shopview.com`.
Build marker `<meta name="app-version"> = v3.4.1-0ed4433` (`index.html` `last-modified`
`Mon, 03 Aug 2026 13:40:38 GMT`, `etag` `02091e9dc11f187d7739b4efa166ea21`).
Org `d55bc308-e61a-438d-b5f1-c7a73c89d49f`. Workplaces
`b3c8c820-f815-4cf1-8938-10956c5ee71a` (Heavy Duty) and `f8a8b802-7780-4b16-bf10-343caeb616b2`
(Lethbridge). Renderer, from the `Producer` metadata of every successful PDF: **`WeasyPrint 69.0`**.

⚠️ **This QA branch was declared NOT FINAL by engineering.** These findings are provisional. **If this
is already fixed, or is work still in progress, please close this ticket saying so** — we will re-run
the probes and update our test cases accordingly. We would rather be told than guess.

## The failing request, and a passing one beside it

```
# PASS — 344 rows, all 20 columns, 31 pages
GET /api/reporting/reports/parts-velocity/export?range=this_year&type=both&format=pdf&search=GA
 -> 200  application/pdf; charset=UTF-8   308,824 bytes   27,358 ms
    x-request-id 207aa593-aedb-4f51-b03d-f5829343febe

# FAIL — 449 rows, all 20 columns
GET /api/reporting/reports/parts-velocity/export?range=this_year&type=both&format=pdf&search=HO
 -> 500  application/problem+json   173 bytes   33,260 ms
    x-request-id e583742c-a980-4ce3-86a2-7baee1c47519
    server: nginx/1.30.4
    {"errors":[{"error":"An error occurred. We're sorry for this inconvenience, please try again a bit later later."},
               {"requestId":"e583742c-a980-4ce3-86a2-7baee1c47519"}]}

# PASS — THE SAME 449 ROWS, only two columns
GET /api/reporting/reports/parts-velocity/export?range=this_year&type=both&format=pdf&search=HO
    &columns=part_number,description
 -> 200  application/pdf   213,370 bytes   8,032 ms
    x-request-id a74f14eb-b3ca-4a68-afe9-5de89a3495a7

# Inventory Value, whole list, one location, 5,657 rows — PDF vs CSV, same scope
GET /api/reporting/reports/inventory-value/export?range=custom&start_date=2026-08-01
    &end_date=2026-08-04&locations=b3c8c820-f815-4cf1-8938-10956c5ee71a&format=pdf
 -> 500   34,877 ms   x-request-id d6e2a808-631d-4aba-be09-1d25125fd9dc
...&format=csv
 -> 200  text/csv   724,109 bytes   2,426 ms   x-request-id 8c6d3848-a126-4271-91af-93954e1512af
```

## Full probe data — Parts Velocity

| Rows | Columns | Result | Elapsed | request id |
|---:|---|---|---:|---|
| 13 | all | 200 (2 pages) | 3.5 s | `ed33b3c8-2c40-4392-b65e-1fa4d3de245b` |
| 41 | all | 200 (6 pages) | 7.8 s | `beed12a8-ef34-47d7-971d-8ee81413b02b` |
| 321 | all | 200 (24 pages) | 23.4 s | `7c05f5b3-ee5c-47bd-83ac-0c3c19e6329c` |
| **344** | all | **200** (31 pages, 308,830 B) | **37.9 s** | `bf010de0-3326-4ca3-827a-a01a24bc08f1` |
| **344** | all | **200** (byte-identical) | **55.4 s** | `440a5831-ca94-4b71-bade-334f3e946498` |
| **344** | all | **200** (308,824 B) | **27.4 s** | `207aa593-aedb-4f51-b03d-f5829343febe` |
| **449** | all | **500** | **39.1 s** | `36af28ab-0a4e-456d-8be5-ba1e33837d0b` |
| **449** | all | **500** | **36.0 s** | `767a0020-a8ac-4452-8ae3-bb654a4594c1` |
| **449** | all | **500** | **33.3 s** | `e583742c-a980-4ce3-86a2-7baee1c47519` |
| **449** | **2** | **200** (213,370 B) | **8.0 s** | `a74f14eb-b3ca-4a68-afe9-5de89a3495a7` |
| 475 | all | 500 | 63.1 s | `f144cde6-9d8a-4ada-876c-68bb2fb8c4f8` |
| 724 | all | 500 | 35.1 s | `6c76fffb-1c5f-4c8a-80cb-ca84061dd6fd` |
| 1,079 | all | 500 | 63.1 s | `1ffab647-4f67-422f-8c4e-cefd0003c487` |
| 1,241 | all | 500 | 45.6 s | `1f6ec1cd-458f-4144-822f-ef27c5772267` |
| 3,238 | all | 500 | 69.2 s | `7bbf9c85-c871-44ef-b618-adb202d573cd` |
| 3,238 | **2** | **500** | 33.2 s | `fdc5da7b-4a9c-4e39-b967-1d7ca393715a` |
| This Year, both locations = **10,064** rows | all | **400** *"This report is too large to export…"* | 1.9 s | `092e41eb-e8df-4d55-a488-ef3be360bb27` |

Every CSV in the same series returned **200 in 0.15–5.1 s**, including the full 6,219-row list.

## Full probe data — Inventory Value

| Rows | Result | Elapsed |
|---|---|---|
| 1 · 11 · 149 · 269 · 276 · 320 · 396 · 408 · 411 · 532 | 200 | 18–29 s |
| **538** | **200 then 500** | 25.1 s / 31.5 s |
| **578** | **200 then 500** | 25.4 s / 32.2 s |
| 648 · 725 · 793 · 896 · 1,339 · 3,872 · 4,416 · 4,811 · 5,154 · 5,657 · 9,275 | 500 | 31–33 s |
| 5,657 | **500** | **34.9 s** |
| 5,657 (CSV, identical scope) | **200**, 724,109 B | **2.4 s** |

Sample request ids: `dde055bf-d63b-4053-94c2-9ddd2f024e9c` (648 rows, 500, 31.5 s),
`0e35d99b-965b-43a4-a621-2d324692e3bd` (538 rows, 200, 25.1 s),
`dfaec4f6-2dd0-4127-bb28-794b3f860946` (578 rows, 500, 32.2 s),
`5309d12c-8710-4a5d-8de9-9a3964e7727a` (3,872), `c0758b2f-8687-459a-970e-07fe8818b5ad` (5,657),
`8cab25cb-07b1-42ee-a8f9-8de8d4f061d9` (9,275).

## The other three reports

- **Sales By Customer** — 12-month, two-location **Expanded** PDF → **500**, request id
  `ffca8e2c-f6ae-4477-9216-16083355a3e5`. The Expanded CSV of the same scope → **200**, 5,746 data
  lines. A 2-month Expanded PDF renders fine at 49 pages.
- **Sales By Representative** — same scope, `showUnassigned=1`, Expanded PDF → **500**, request id
  `139bcca5-44a4-41a6-8255-e4d7b4a1ef30`. Expanded CSV → **200**, 3,555 data lines.
- **Technician Utilization** — This-Year **Expanded** PDF → **500** after 32.8 s, request id
  `87142301-9ebe-4330-9f3d-c23c91837800`. Its **Summary** PDF returns in 1.95 s.

## What is ESTABLISHED

1. **PDF only.** Every CSV of every failing scope succeeded, and fast (0.8–5.1 s).
2. **Well below the 10,000-row guard**, so the graceful refusal never runs. The guard itself **does**
   work where reachable — 10,064 rows returns **HTTP 400** with the specified message.
3. **Not row count alone.** The same 449 rows, same filters, same range, one request apart: **500 with
   20 columns, 200 with 2 columns.**
4. **Application-level 500, not a gateway timeout** — `application/problem+json`, the app's own message,
   an `x-request-id`, passed through `nginx/1.30.4`. A proxy timeout would be a 502/504 with HTML.
5. **Throughput for identical work varies widely** — the same 344-row/31-page PDF took **27.4 s,
   37.9 s and 55.4 s**, byte-identical output.
6. **Deterministic outside a narrow band.** Inventory Value is reliable to ~532 rows, unstable at
   538–578 (each went both ways), and always fails from 648.

## What is NOT established — please do not read a cause into the above

**We do not know the mechanism, and we are deliberately not asserting one.** Two readings each fit part
of the data and cannot be separated from outside the server:

- **A ~30–33 s limit somewhere in the render path.** Fits every Inventory Value failure (31–33 s) and
  all three of the most recent failures (33.2 s, 33.3 s, 34.9 s). **Cannot explain** the 55.4 s success
  or the 63.1 s and 69.2 s failures.
- **A resource ceiling (memory, page count) rather than time.** Fits the 55.4 s success and the
  two-columns rescue. **Does not explain** why so many failures cluster tightly at 31–35 s.

Established fact 5 (variable throughput) partly reconciles them — a fixed limit on one stage plus a
variable stage would produce both patterns — but **that is a hypothesis, not a finding.**

**One look at the server log for any request id above should settle it.** That is the ask.

## Evidence files (in the QA repo)

- `build/report-suite/viu-2026-08-03/batch-pv-tu/evidence/pv/exports/exports-log.jsonl` — 29 probes,
  each with query string, status, byte count, elapsed ms and request id
- `build/report-suite/viu-2026-08-03/batch-wip-iv/evidence/api/iv-pdf-boundary.json` and
  `pdfprobe.json`
- `build/report-suite/viu-2026-08-03/batch-sbc-sbr/evidence/export-guards.md` §3
- `build/report-suite/defect-pack-2026-08-04/probe/pdf500-mechanism-probe.json` — the columns A/B
- Successful PDFs kept for comparison: `batch-pv-tu/evidence/pv/exports/*.pdf`

> **Note on attachments:** these files were not attached to this ticket — see the covering report; the
> key extracts (request ids, timings, row counts, byte counts and the verbatim error body) are inlined
> above so nothing rests on our word alone.

## QA test cases affected

PV-EXP-11 = C38885 · TU-EXP-09 = C38887 · IV-EXP-07 = C30593 · IV-EXP-09 = C30595 ·
SBC-EXP-14 = C30172 · SBC-API-05 = C30194 · SBR-EXP-15 = C30290 · SBR-API-05 = C30320,
plus one new case proposed to cover this failure specifically.
