# API-only findings — ASKED, NOT FILED (Standing Rule 51)

Rule 51: an API-related defect is never filed on our own initiative, and a batch approval does not
cover it. Each item below is reachable **only** by sending a request the product's own screens never
send, so no customer and no manual tester can reach it.

## 1. A meaningless `vehicleHere` value returns the not-on-site set instead of an unfiltered list

**Observed live** on `v3.4.2-d00239b`:

| Request | HTTP | Rows | Distribution of `vehicleHere` |
|---|---|---|---|
| `filters[0][field]=vehicleHere&filters[0][value]=1` | 200 | 500 | 500 true |
| `filters[0][field]=vehicleHere&filters[0][value]=0` | 200 | 500 | 500 false |
| `filters[0][field]=vehicleHere&filters[0][value]=true` | 200 | 500 | **500 false** |
| `filters[0][field]=vehicleHere&filters[0][value]=bogus` | 200 | 500 | **500 false** |

So any value that is not exactly `1` is coerced to "not on site" rather than rejected or ignored.
The string `true` — the most likely thing a caller would try — silently returns the **opposite** of
what it asks for.

**Why it is API-only:** the Asset on Site control can only ever emit `1` or `0`, so no screen can
produce this. It matters for whoever automates against the endpoint, and for anyone integrating.

**This also corrects a recorded fact.** `build/APP-ACTIONS-PLAYBOOK.md` states *"a bad `vehicleHere`
value → 200 UNFILTERED"*. That is **not** what this build does — it returns the `vehicleHere=0` set,
which is a filtered result, not an unfiltered one. The playbook line needs correcting; it was not
edited from this pass because that file is shared with two sibling workers.

**The ask:** file it, or leave it? It is a hardening item rather than a customer-visible fault.

## 2. Malformed filter parameters — recorded as sound, no ask needed

For completeness, because it is the same surface and it is **good** news. No 5xx anywhere:

| Probe | HTTP | Response |
|---|---|---|
| unknown field | 400 | `Resource could not be filtered by field: not_a_field` |
| field with no value | 400 | `Invalid filter data. The filter array s…` |
| value with no field | 400 | `Invalid filter data. The filter array s…` |
| non-numeric filter index | 200 | 500 rows, unfiltered |
| `filters=notanarray` | 400 | `Unexpected value for parameter "filter…` |

Clean validation responses throughout. Nothing to raise.
