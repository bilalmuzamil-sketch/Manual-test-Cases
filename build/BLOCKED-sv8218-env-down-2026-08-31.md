# BLOCKED — the sv8218 QA branch is unreachable (2026-08-31, ~02:40 UTC)

**This one is proved, not assumed.** It is the only genuine environmental blocker on Invoice UI
Refresh, and it stops exactly 6 cases and nothing else (Rule 68).

## What was observed

| Host | Repeated probes |
|---|---|
| `sv8218api.qa.shopview.com` | `000` (connection refused), `503`, `000` — three rounds |
| `sv8218.qa.shopview.com` | `000` on every round |
| `sv8218api.qa.shopview.com/` (root) | `404 Unknown service` once, otherwise unreachable |

It was **working minutes earlier** — `my-workplaces`, `work-orders` and `view-profile` all returned
200 as Admin, and C45177 was verified end to end against it. Mid-task, a credit-memo create and an
invoice reversal both returned **503 Service Temporarily Unavailable**, and the host then stopped
answering.

## The documented remedy was tried and does not cover this branch

`build/APP-ACTIONS-PLAYBOOK.md` records a wake lambda for a QA env that auto-sleeps:

```
POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv
     {"action":"wake","env":"<env>"}
```

- `{"env":"sv8218"}` → **`{"message":"Internal Server Error"}`**, twice.
- `{"env":"sv9315"}` → **`"sv9315 is waking up."`** — so the lambda itself is healthy and the call
  shape is right; it simply does not know `sv8218`.

**⇒ NEW FACT FOR THE PLAYBOOK:** the wake lambda is **per-environment and not universal**. It answers
for `sv7387` and `sv9315`; it errors for `sv8218`.

## Not a wider outage

`sv9315api.qa.shopview.com` returns **200 `{"data":[]}`** at the root and `sv9315.qa.shopview.com`
serves the SPA. TestRail is up. **The problem is specific to sv8218.**

## What it blocks — and what it does not

**Blocks (6 cases, all previously classed "mine"):** C44923 · C44947 · C45190 · C45191 · C45196 ·
C45197. Each has its recipe already in hand; they need only a reachable branch.

**Does NOT block:** the other **102 of 119** are build verified and marked; the 11 finished cases
(Rule 69 deferred, staging-only, Rule 58 held) are complete; every deliverable is written and pushed.
**Nothing about the Invoice UI Refresh handover waits on this.**

## What unblocks it

The branch coming back. If it is deliberately torn down, say so and the 6 move to the
`DEFERRED-RUN.md` list with "environment removed" as the reason rather than sitting as open work.

## Meanwhile

`sv9315` is up, and it is the assigned next task (Inline Add and Edit Parts, 119 cases; Printer
Friendly WO, 44 cases). Work continues there rather than idling.
