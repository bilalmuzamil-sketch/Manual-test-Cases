# SV-11691 — Invoices marked Paid with $0 payments — customer Balance shows settled, A/R Aging shows open

**Ticket:** https://shopview.atlassian.net/browse/SV-11691 (status TESTING QA, epic SV-11839) · **QA branch:** https://sv11839.qa.shopview.com

## Verdict: PASS

## What the ticket expects (verbatim)
> **Expected**
> An invoice is Paid only when payments + applied credits/deposits = total; WO/invoice status and payment status cannot diverge; customer Balance = A/R Aging.

Source: SV-11691 description. Product rule, Chris Ward's comment on SV-11691 (22 Oct 2026, comment 79362): *"Money is the truth. An invoice is Paid only when payments plus applied credits and deposits cover its total. A/R Aging is showing these correctly; the Invoices tab is wrong for these four."* · *"Existing records are never changed automatically. They go on a reviewed list and get fixed one by one."* · *"How to check after the fix: for every invoice, Paid means the recorded money covers the total, and the customer Balance matches A/R Aging."*

## What I did
Followed the ticket's steps 1–3 for all four invoices: Customers → customer → Invoices tab ("Open only" on, then off) → the invoice row; Payments tab; Reports → A/R Aging Summary / Detail.

## What I saw
| Invoice | Customer | Invoices tab (now) | Payment recorded? | Customer Balance header | A/R Aging |
|---|---|---|---|---|---|
| S2-8650 | Wellington Truck Repair | Total $1,867.94 · Balance $1,867.94 · **Unpaid** (shown with "Open only" on and off); its tick-box cannot be selected | none on the Payments tab (17 payments, none for S2-8650) | **$2,182.34** | Summary: 31–60 days $314.40 + 91 And Over $1,867.94 = **$2,182.34** |
| S2-8771 | Inland Heavy Duty Truck Repair | $870.85 · $870.85 · **Unpaid**, not selectable | — | **$7,298.24** | 91 And Over **$7,298.24** (= $870.85 + $6,427.39) |
| S2-8092 | Inland Heavy Duty Truck Repair | $6,427.39 · $6,427.39 · **Unpaid**, not selectable | — | (same customer) | (same) |
| S3-8848 | Oakland City Truck & Trailer Repair (Lethbridge) | $98.26 · $98.26 · **Unpaid**, not selectable | — | **$98.26** | A/R Aging Detail: S3-8848 $98.26 in 91+ (the customer's only open item) |

Every customer Balance equals A/R Aging, and none of the four is shown as Paid any more on the Invoices tab.

Note (not a failure, by the product rule): the work order itself still carries status "Paid" (`GET /api/work-orders?search=S2-8650` → `status: paid`). Chris's rule says these legacy records are corrected one by one from a reviewed list, not automatically, and the developer's comment says the same. The read-only "census" command named in the developer's comment is a server command and was not run by QA.

## Build, time, location, zones
- Build: v26.45.0-aacb66c (read from `<meta name="app-version">` on sv11839; the brief said v26.43.5-c73a58b — the branch has moved on)
- When: 4 Nov 2026, 20:40–20:46 UTC (≈ 1:40–1:46 PM Edmonton)
- Location **Staging Heavy Duty - 9919 (Wellington, Inland); Staging Lethbridge - 4310 (Oakland)**. Zones (Rule 99), all recorded in the evidence JSON: session `change-location` with `workplace_timezone=America/Edmonton` (HTTP 200) · browser `timezoneId=America/Edmonton` · process `TZ=America/Edmonton` · `localStorage['timezone']="America/Edmonton"` · header/location selector showed Staging Heavy Duty - 9919 (Wellington, Inland); Staging Lethbridge - 4310 (Oakland) at the start and end of the run. Note: on this machine the time-zone database (2026e) puts America/Edmonton at UTC−6, while the test browser (Chromium 153) still uses UTC−7 — see RESULTS.md, environment notes.

## Pictures (deviceScaleFactor 2)
- `SV-11691/2-customer-invoices-open-only-off-S2-8650.png`
- `SV-11691/5-ar-aging-summary-wellington.png`
- `SV-11691/3-customer-payments.png`
- `SV-11691/6-inland-heavy-duty-truck-repair-invoices-open-only.png`
- `SV-11691/6-oakland-city-truck-trailer-rep-invoices-open-only.png`

## Evidence
SV-11691/evidence.json, evidence-ar.json, evidence-inland-heavy-duty-truck-repair.json, evidence-oakland-city-truck-trailer-rep.json, evidence-ar-detail-lethbridge-extract.json

No Jira or TestRail write was made.

## Draft QA-pass comment (NOT POSTED)
QA check on sv11839 (build v26.45.0-aacb66c), 4 Nov 2026, Heavy Duty and Lethbridge, Edmonton time. All four invoices now show as Unpaid at their full amount on the customer's Invoices tab and cannot be picked for payment. Each customer Balance matches A/R Aging: Wellington Truck Repair $2,182.34 = $2,182.34, Inland Heavy Duty Truck Repair $7,298.24 = $7,298.24, Oakland City Truck & Trailer Repair $98.26 = $98.26. As agreed with Chris, the work orders themselves still say Paid until they are corrected one by one. Picture: SV-11691/5-ar-aging-summary-wellington.png
