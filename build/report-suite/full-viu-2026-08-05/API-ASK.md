# API-ASK — Report Suite, 2026-08-05 (Standing Rule 51)

Rule 51: a fault reachable **only** by calling an endpoint directly with a request the product's own
screens never send is **not filed** — it is written here and raised as an ask.

## Item 1 — the date-range preset the specification puts first is rejected by the server

**What I observed.** The Sales By Customer specification, version 15, **S2-R2**, says verbatim:

> "The picker offers nine options, in this order: Last 12 Months, This Year, Last Year, This Quarter,
> Last Quarter, This Month, Last Month, This Week, Last Week … There is no Today, no Yesterday, and no
> option labeled 'Custom'."

Live on `v3.5-16cf83f`, asking the report for that first preset returns **HTTP 400 "Selected date range
is invalid."**, while `today` and `yesterday` — the two the specification says do not exist — are both
**accepted, HTTP 200**. Nine presets probed: this_week, last_week, this_month, last_month, this_quarter,
last_quarter, this_year, last_year all return 200; `last_12_months` and `last_30_days` both 400.

**Why it is an ask and not a ticket — and why I am genuinely unsure.** I probed the API directly. I did
**not** open the date picker in the browser and count its options, so **I do not know whether a user can
actually select "Last 12 Months"**. If the picker offers it, this is plainly user-facing and should be a
ticket. If the picker does not offer it yet, then the only way to reach the 400 is by hand-editing a
request, and Rule 51 says do not file it.

**The ask:** may I (a) drive the picker in the browser to settle reachability, and then (b) file it if it
is reachable? That is a five-minute check and I ran out of session before doing it.

## Item 2 — not an API-only item, recorded here so it is not lost

The Sales By Customer and Sales By Representative CSV exports emit `$1,979.40`, `100.0%` and
`Jul 31 2026` where **SBC S14-R9/R10/R11 and SBR S14-R17 all require plain numbers, no dollar sign, no
thousands separators, no percent sign, and dates as mm-dd-yyyy**. This is reachable from the product's
own Download (CSV) menu item, so it is **user-facing and NOT an API-only item** — it belongs in a ticket.
The only existing ticket, **SV-8823**, names Inventory Value only. See FILED.md.
