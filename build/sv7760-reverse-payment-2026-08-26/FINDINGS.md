# SV-7760 — reverse customer payment: opaque 500 on not-found

**Ticket** [SV-7760](https://shopview.atlassian.net/browse/SV-7760) · Bug · Medium · assignee Dipesh
Changawala · status **Code Review** · labels `QA_validation_required`, `backend`, `sentry`.

**What it is:** `POST /api/customer-account/reverse-customer-payment` returned a generic **500**
(`RuntimeException: Could not resolve the ReversePaymentCommand class`) when the payment could not be
resolved for the caller's org. `CustomerPaymentNotFound` extended `\RuntimeException` rather than
`DomainError`, so the argument resolver wrapped it instead of re-throwing it. The not-found
*behaviour* was correct; only the HTTP surfacing was wrong.

## Environment

| | |
|---|---|
| app | `https://sv7760.qa.shopview.com` — build **`v26.35.4-6aadeec`** |
| api | `https://sv7760api.qa.shopview.com` |
| etag | `4a3a7ea7020970acd4fce00afe6238df` — **identical at the start and end of the run**, so every verdict below belongs to one build |

## Result — the acceptance criterion is met

**AC1: "Reversing a non-resolvable / out-of-org customer payment returns a proper 4xx with a
meaningful message (no generic 'Could not resolve the … class' 500)." → PASSED.**

| Input to `id` | Status | Body |
|---|---|---|
| nonexistent UUID | **400** | `{"id": "Not found"}` |
| nil UUID `00000000-…` | **400** | `{"id": "Not found"}` |
| malformed string `not-a-uuid` | **400** | `{"id": "Invalid UUID"}` |
| empty string | **400** | `{"id": "Invalid UUID"}` |
| `null` | **400** | `{"id": "Missing required parameter"}` |
| omitted | **400** | `{"id": "Missing required parameter"}` |

No occurrence of the generic *"Could not resolve the … class"* 500 on any not-found input.

**Positive control — and it is load-bearing.** A real, in-org payment
(`db723238-433c-4afc-9f7c-09fde05df503`, $1,240.06, ref 001844, MASTERCARD, on customer *Aacrest
Works*, account `934527f3…`) reversed successfully: **201**, and the account's payment count went
**3 → 2** with that payment gone. Without this, a blanket 400 on everything would look identical to a
pass. It proves the `400 Not found` is **discriminating**, not the endpoint being broken.

**A second clean client error, unprompted:** reversing that same payment again returns **409**
*"This payment has already been reversed."* — another meaningful 4xx rather than a 500.

## NEW FINDING — a 500 survives, on a non-string `id` (API-only)

| Input to `id` | Status |
|---|---|
| integer `12345` | **500** (reproduced twice) |
| array `[1,2]` | **500** |

Body is the generic *"An error occurred. We're sorry for this inconvenience…"* with a `requestId`
(e.g. `401ebffa-6762-4802…`). Strings, `null` and omission are all handled with a 400; other JSON
types are not.

**This is the same class of defect the ticket fixes** — an unhandled throwable reaching the argument
resolver's wrap branch — just entered through a different door. It is worth flagging **now**, while
the ticket is still in Code Review and the developer is in that file, rather than as a separate
ticket later.

**Reachability: API-only.** The screen always sends a UUID string taken from a payment row, so no
user and no manual tester can produce this. Under Standing Rule 51 it is **not filed** — it needs the
QA lead's explicit go-ahead.

## Honest limits

1. **The genuine cross-org case was not exercised.** I had one org. The ticket's own root-cause
   section says `fetchCustomerPayment()` **returns false** and throws `CustomerPaymentNotFound`
   whether the payment is absent or merely outside the caller's org — so a nonexistent UUID reaches
   the identical `throw` at `ReversePaymentCommand.php:24`. The closest available analogue, an id
   that *was* valid and is now unresolvable, returned a clean **409**. I am stating this as reasoning
   about the same code path, **not** claiming I tested a second organisation.
2. **AC2 — "a failing-test-first regression test covers the not-found path" — is not verifiable
   black-box.** It is an assertion about the repository, and needs the PR diff, not the API.
3. **The branch is not declared final and the ticket is still in Code Review**, so under Standing
   Rule 49 these verdicts are **provisional** against build `v26.35.4-6aadeec`.

## Cost note

Whole pass: ~10 small API calls and no browser. The defect is an API surface, so driving Chromium
would have bought nothing. Every probe printed a one-line verdict rather than a response dump —
that, not the number of tests, is what keeps a run cheap.

## Data touched

QA branch `sv7760` — disposable, no cleanup required per the QA lead's ruling. One real payment was
reversed as the positive control (recorded above so it is not mistaken for a defect).
