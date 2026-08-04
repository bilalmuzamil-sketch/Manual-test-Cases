# Filters — the API-only finding, held for the QA lead's word (Standing Rule 51)

**Nothing here has been filed.** An API-related defect is never raised on our own initiative, and a
batch approval never covers an API item — the ask has to be separate, every time.

## The reachability test, applied

> If the fault is invisible to a user AND to a manual tester — reachable only by calling an endpoint
> directly with a request the product's own screens never send — it is API-RELATED.

## The one finding

**A nonsense value for a Yes/No filter is silently ignored, while a nonsense field NAME is properly
rejected.**

- `GET /api/work-orders?...&filters[0][field]=vehicleHere&filters[0][value]=banana` → **HTTP 200
  with the FULL unfiltered list** (5 of 5 rows, mixed statuses, mixed customers).
- `GET /api/work-orders?...&filters[0][field]=zzz_not_a_field&filters[0][value]=x` → **HTTP 400**, a
  clean validation refusal.
- `GET /api/work-orders?...&filters=garbage&pagination=nope` → **HTTP 400**, clean.

So the endpoint validates the field name but not the field's value domain.

**Why it is API-only.** The Asset on Site control offers exactly two options, `Yes` and `No`, wired
to `filter_option_vehicleHere_1` and `filter_option_vehicleHere_0`. The screen can only ever send
`1` or `0`. There is no typing, no free text and no URL route that produces `banana` from any user
action — the address-bar route was checked too and the page normalises it before the request. **No
customer and no manual tester can reach this.**

**Why it is arguably not a defect at all.** Silently ignoring an out-of-domain value is the same
behaviour the specification asks for on the surfaces that matter (S11-R3, S11-N1: ignore what you
cannot use, do not error). It is an inconsistency in strictness, not a failure.

## THE ASK

**Do you want a ticket for this, or not?** It is written up and ready either way. If yes it goes in
at **priority Low**, parent **SV-8785**, linked to **SV-8796**.

Evidence: `build/filters/viu-2026-08-04/evidence/raw/o-api.json`.

## For the record — everything else we found IS user-facing

All five tickets filed today fail through the product's own screens, which is why they were filed
rather than queued here: SV-8843 (layout), SV-8844 (the saved search query), SV-8845 (phone shared
links), SV-8846 (no Clear Filters on a phone), SV-8847 (the empty screen). A server error appearing
in a response is technical *evidence*; it is not what makes a ticket API-related.
