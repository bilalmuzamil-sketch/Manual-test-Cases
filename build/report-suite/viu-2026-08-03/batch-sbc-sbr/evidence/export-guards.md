# Export guards, empty exports and the over-size question — re-tested first-hand 2026-08-04

Build `v3.4.1-0ed4433`. Written because an earlier draft of my verdicts credited a "too large"
export refusal that I had taken from a PREVIOUS pass's notes rather than observed myself. Standing
Rule 12 says verified means observed this run, so I re-tested it. The result changed six verdicts.

## 1. The date-range span guard IS real, with an exact message

```
GET /api/reporting/reports/sales-by-customer/export
    ?format=csv&variant=expanded&range=custom&start_date=2024-08-05&end_date=2026-08-04&…
-> 400 {"errors":[{"error":"Date range cannot exceed 366 days."}]}
```

Identical on `sales-by-representative`. This confirms the 366-day clause in `SBC-DATE-03`
([C30104](https://shopview.testrail.io/index.php?/cases/view/30104)) and `SBR-DATE-02`
([C30202](https://shopview.testrail.io/index.php?/cases/view/30202)) — that half of both cases is
right, even though the "Custom range" control they name does not exist.

## 2. The 10,000-data-row export cap is UNREACHABLE on this org

Because the range is itself capped at 366 days, the widest export obtainable is well under the cap:

| Widest attempt | Result |
|---|---|
| SBC, 12 months, both locations, Expanded CSV | **200** — 5,746 data lines |
| SBR, 12 months, both locations, Expanded CSV, Show Unassigned on | **200** — 3,555 data lines |
| Either report, ~24 months | **400** `Date range cannot exceed 366 days.` |

So **no over-cap refusal could be produced**, and I could not verify the specified message
"This report is too large to export. Narrow the date range or filters, then try again."

## 3. NEW DEFECT — the Expanded PDF returns HTTP 500 at scale

The same scope that produces a perfectly good Expanded **CSV** makes the Expanded **PDF** crash:

```
GET …/sales-by-customer/export?format=pdf&variant=expanded
    &range=custom&start_date=2025-08-04&end_date=2026-08-04&locations=<both>
-> 500  requestId ffca8e2c-f6ae-4477-9216-16083355a3e5

GET …/sales-by-representative/export?format=pdf&variant=expanded   (same scope, showUnassigned=1)
-> 500  requestId 139bcca5-44a4-41a6-8255-e4d7b4a1ef30
```

A **2-month** Expanded PDF renders fine (SBC 49 pages, SBR 1 page), so this is a scale failure, not a
broken endpoint.

**Why this matters more than a missing message:** the 10,000-row cap exists precisely so a big export
fails *gracefully*. Here the export dies with a 500 well BELOW the cap. That is the finding, and it is
what turned `SBC-EXP-14` C30172, `SBR-EXP-15` C30290, `SBC-API-05` C30194 and `SBR-API-05` C30320 from
PASS into DEVIATION.

## 4. Empty / no-match exports: they generate, but with NO totals row

```
GET …/sales-by-customer/export?format=csv&variant=summary&start_date=2026-08-01&end_date=2026-08-04
-> 200 text/csv  166 bytes
"Locations: Staging Heavy Duty - 9919"
Customer,"Inv. Hrs","Labor Invoiced","Labor Margin","Parts Invoiced","Parts Margin","Shop Supplies",Margin,"Margin %",Subtotal
```

```
GET …/sales-by-representative/export?format=csv&variant=summary&…
-> 200 text/csv  156 bytes
"Locations: Staging Heavy Duty - 9919"
Representative,"Inv. Hrs","Labor Invoiced","Labor Margin","Parts Invoiced","Parts Margin",Margin,"Margin %",Subtotal
```

The empty **PDFs** (extracted with `tools/extract_pdf.py`) carry the full header strip, the column
headers and the footer, but likewise **no Totals line**:

```
Sales By Customer Report
Staging Foothills Group Inc
Staging Heavy Duty - 9919
Date Range: Aug 1, 2026 – Aug 5, 2026
Product Type: Parts & Service
Locations: Staging Heavy Duty - 9919
Customer Inv. Hrs Labor Invoiced Labor Margin Parts Invoiced Parts Margin Shop Supplies Margin Margin % Subtotal
Software Powered by ShopView Page 1 of 1
```

`SBC-EXP-15` C30173 and `SBR-EXP-16` C30291 both require a **zeroed totals row** on an empty export.
There is none, so both became DEVIATION.

## 5. Two useful by-products

- **The PDF footer's exact text is `Software Powered by ShopView Page 1 of 1`** — a real build label
  for `SBC-EXP-08` C30166 and `SBR-EXP-06` C30281.
- **With one location in scope the export header row correctly omits the Location column**, which
  confirms S4-R12 / S21-R7 on the export surface as well as on screen (the screen half was already
  proven with a single-workplace user).
- The `Date Range` line again reads one day past the requested `end_date`
  (`end_date=2026-08-04` printed as `Aug 5, 2026`) — the same off-by-one recorded in `ENV-DEFECTS.md` §6.
