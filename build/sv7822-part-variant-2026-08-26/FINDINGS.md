# SV-7822 — "Cannot change to part variant that already exists in the system"

**Ticket** [SV-7822](https://shopview.atlassian.net/browse/SV-7822) · Bug · Medium · assignee Slavcho
Mitrov · status **TESTING QA** · reported by customer 502 Equipment via Intercom.

**The bug:** when one location holds **two `part` rows for the same catalogue part**, the save guard
("one inventory part per catalogue part per location") picked one arbitrary matching row; if it landed
on the duplicate it concluded the part conflicted with *itself* and refused the save — **permanently,
even when the Catalog part field was never touched.**
**The fix (PR [#2683](https://github.com/ShopView/shopview/pull/2683)):** run that check only when the
catalogue part actually changes, and consider every matching row. Editing a part without re-pointing
its Catalog part now saves; re-pointing onto an already-stocked catalogue part is still rejected.

**Why this was testable at all:** the trigger is a duplicate row no endpoint can create, so Slavcho
seeded one directly and (comment 75659) **left it in place** — part **0002-060004** (MUD FLAP SPRING
SUPPORT) at **Staging Heavy Duty - 9919**.

## Verdict: PASSED — and verified as *discriminating*, not just "it saves"

## Environment

| | |
|---|---|
| branch | `https://sv7822.qa.shopview.com` / `sv7822api…` — build **`v26.35.4-dc6e8f2`** |
| etag | `d58c38a53635b55975d45615edf181ef` — identical at the start and end of the run |
| save endpoint | `POST /api/inventory/parts/change` |

## The broken state is genuinely present

Searching 0002-060004 at HD-9919 returns **two rows**: the real one `167846ed-…-614593` (qty 2, in
use) and the seeded duplicate `00000000-…-007822` (qty 0). Two rows for one (catalogue part, location)
is exactly the state that makes the old code reject the save.

## What was tested

| # | Test | Result |
|---|---|---|
| 1 | **The customer's blocked action** — save the real row with the Catalog part **unchanged**, duplicate present | **PASSED — 201, it saved** |
| 2 | A harmless edit persists — nudge purchase_price 0.01 → 0.02, re-read | **PASSED — persisted; catalogue part untouched** (then restored to 0.01) |
| 3 | The duplicate is **tolerated, not silently removed** — search still shows both rows after saving | **PASSED — 2 rows remain** |
| 4 | **Discrimination — the guard is still live.** Re-point 0002-060004 onto another catalogue part already stocked at HD-9919 (P550848) | **PASSED — still 400 "Cannot change to part variant that already exists in the system"** |

**Check 4 is the one that makes this meaningful.** Slavcho's own caveat: the QA env runs the fixed
code, so "it saves" is expected and there is nothing to compare against. A bare pass could mean the
fix simply *disabled* the guard. Check 4 proves it did not — a genuine conflict still fires the exact
original error — so the fix is **surgical**: unchanged-catalogue-part saves succeed, conflicting
re-points are still blocked. That is precisely PR #2683's stated contract, both halves confirmed.

## Honest limits

1. **No before/after against unfixed code.** The QA branch is the fixed code; I did not stand up a
   from-`main` env to watch the same save *fail*. Slavcho verified the negative locally (400 before,
   201 after) and by replaying the old code's lookup query; I confirmed the positive plus the intact
   guard. If a genuine before/after is wanted, he offered to deploy a from-main env seeded identically.
2. **The seeded duplicate is Slavcho's, not a state I created** — so this proves the *fix behaviour*
   on a real reproduction, not that the trigger arises in normal use (it does not; that is the point).
3. **Two items are out of scope and were not tested**, both flagged in the ticket: the blank category
   name (a separate frontend bug) and the missing unique constraint on (catalogue part, location) —
   the reason duplicates keep accruing; PR #2683 makes the app tolerant but does not add the index.

## Cost note

Whole pass: ~7 small API calls, no browser — the fix is in the save endpoint, so the endpoint is
where it was tested. The two early 400s were **my** payload shape (`bins` wanted `{id, quantity,
isDefault}`, the GET returns `{binLocationId, name, …}`); I let the server name each missing field
rather than guess, which is the SV-8815 lesson applied.

## Data touched

QA branch `sv7822` — disposable, no cleanup required. purchase_price on 167846ed was moved 0.01 → 0.02
→ 0.01 (restored). The seeded duplicate `…7822` was **left in place** per Slavcho's note so others can
still look. No foreign data, no new records.
