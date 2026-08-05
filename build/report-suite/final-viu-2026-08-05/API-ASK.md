# Report Suite — API-ONLY FINDINGS: ASKING, NOT FILING (Standing Rule 51)

**Rule 51 is unconditional and a batch approval never covers an API item.** Each finding below is listed
with its **reachability reason** — the test being: *is this reachable only by calling an endpoint directly
with a request the product's own screens never send?*

---

## ASK 1 · The date-range values the server accepts do not match the new nine-preset requirement

**What I observed live on `v3.5-16cf83f`** (Sales By Customer, `GET /api/reporting/reports/sales-by-customer?range=…`):

| Value sent | Server response |
|---|---|
| `this_year`, `last_year`, `this_quarter`, `last_quarter`, `this_month`, `last_month`, `this_week`, `last_week` | **HTTP 200** |
| **`today`**, **`yesterday`** | **HTTP 200** — still accepted |
| **`last_12_months`** | **HTTP 400** "Selected date range is invalid." |
| `custom` (without dates) | HTTP 400 "Start and end dates are required for a custom range." |

**The requirement, verbatim, Sales By Customer v14 S2-R2** (saved 2026-08-05T13:07:07Z):

> "The picker offers nine options, in this order: **Last 12 Months**, This Year, Last Year, This Quarter,
> Last Quarter, This Month, Last Month, This Week, Last Week… **There is no Today, no Yesterday, and no
> option labeled 'Custom'.**"

**So the server rejects the new first preset and still accepts both deleted ones.**

**REACHABILITY — why this is an ASK and not a ticket.** Two honest reasons, and the second matters more:

1. **I did not drive the picker.** What the *screen* offers is the user-facing requirement. If the picker
   no longer lists Today or Yesterday, then no user and no manual tester can reach them, and the fact that
   the endpoint still honours the old tokens is **back-end tolerance, not a user-facing defect** — which is
   the Rule-51 test almost exactly. The screen may equally still show eleven options, in which case it **is**
   user-facing. **I cannot tell which without opening the picker, and I have not.**
2. **The requirement is six hours old.** It was written at 13:07Z today. Filing a defect against a
   requirement the same afternoon it appears, without checking the screen, is how SV-8821 ended up closed as
   not reproducible.

**WHAT I NEED:** one instruction — *file it, or leave it until the picker has been driven?* If the answer is
file, it needs a live screen check first so the ticket names what the user sees.

---

## ASK 2 · The `variant` parameter is mandatory on every export and its absence gives a bare 400

`GET /api/reporting/reports/sales-by-customer/export?format=pdf&range=this_year` →
**HTTP 400** `{"errors":[{"error":"Invalid export variant. Allowed values: summary, expanded."}]}`

This is **correct behaviour, not a defect** — I record it only because it is a useful, previously
unrecorded contract detail (`variant=summary|expanded` is required alongside `format` and `range`), and it
is going into the playbook so nobody re-derives it. **Nothing to file.**

---

## NOTHING ELSE IS API-ONLY

I checked the other new finding item by item. The **Inventory Value page controls** (IV S1-R8) are a screen
control, so if that difference is real it is **user-facing and fileable** — it is held only because **I did
not observe it myself this pass** (it rests on a prior pass's note), not because of Rule 51.
