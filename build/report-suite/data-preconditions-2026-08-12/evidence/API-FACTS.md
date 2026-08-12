# API facts established this pass (read-only)

**Build `v3.7-4626299` · 12 August 2026 · all GET**

## Report endpoints
| Report | Path | Range parameters |
|---|---|---|
| Sales By Customer | `/api/reporting/reports/sales-by-customer` | `range=custom&start_date=&end_date=` + `productType=` |
| Sales By Representative | `/api/reporting/reports/sales-by-representative` | as above + `invoiceStatus=` |
| Parts Velocity | `/api/reporting/reports/parts-velocity` | as above + `type=` |
| Technician Utilization | `/api/reporting/reports/technician-utilization` | as above |
| Inventory Value | `/api/reporting/reports/inventory-value` | as above |
| Work In Progress | `/api/reporting/reports/work-in-progress` | **`from=`/`to=` full ISO instants** + `tab=` |

## THREE TRAPS, each measured — record these before anyone re-derives them

### 1 · An unfiltered call returns the ACTIVE WORKPLACE ONLY, not all locations
Sales By Customer with no `locations` parameter returns **245 rows, every one
`Staging Heavy Duty - 9919`**. That is not "all the data" — it is the active workplace.
**Reading it as "all locations" makes a five-location organisation look like a one-location
one**, which is exactly how this pass first mis-concluded that no multi-location data existed.
Same class as the `/api/labour-types` artefact already in CLAUDE.md.

### 2 · `locations=A&locations=B` (repeated key) SILENTLY TAKES THE LAST ONE
Measured: repeated-key returned **299 rows, all Lethbridge** — i.e. exactly the second value,
with the first silently discarded. **No error, no warning.** A probe using this format would
report a confident single-location answer for a two-location query.

**The working format is comma-joined: `locations=A,B`** → 520 rows spanning both.
`locations[]=A&locations[]=B` returns HTTP 400 `Invalid location id "Array".`

### 3 · The server caps the date range at 366 days
`>366 days` → HTTP 400 `"Date range cannot exceed 366 days."`
Work In Progress words the same cap `"Date range cannot be over one year."`

## A finding that satisfies a precondition outright
With two locations selected, the Location cell takes the literal value **`Multiple`** for a
customer whose invoices span both — **16 such customers** in the 2025-09-01..2026-08-12 range.
This directly satisfies "at least one customer has invoices at two different locations".

## Data present per location (range 2025-09-01 .. 2026-08-12)
| Location | SBC customers | SBR reps | Inventory rows | WIP tabs (Est/NotStarted/Partial/Completed) |
|---|---:|---:|---:|---|
| Staging Heavy Duty - 9919 | 245 | 3 | 5814 | 136 / 30 / 78 / 15 |
| Staging Lethbridge - 4310 | 299 | 1 | 3620 | 59 / 8 / 52 / 18 |
| L'Espace Tralala Yoga | 8 | 1 | 7 | 18 / 3 / 0 / 0 |
| (New Location) Melissa Heiney | 4 | 1 | 3 | 0 / 0 / 0 / 0 |
| 3rd | 1 | 0 | 1 | 0 / 0 / 0 / 0 |
| QB Location | 0 | 0 | 0 | 0 / 0 / 0 / 0 |

**Two locations carry full, independent data sets.** Multi-location preconditions are met by
the data that already exists — nothing needs seeding for them.
