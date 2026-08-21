# BLOCKED — Global Search has no reachable build

**Status: BLOCKED as at 2026-08-21.** Raised by `build/PROJECT-INDEX-REFRESH-2026-08-21.md` §4.

## What is blocked

**Every** live check on Global Search: its **86 TestRail cases** (group 4094, all `created_by = 3`,
confirmed live today) have **never been build-verified**, so their Rule-91 build badge is **❌ CROSS**
and every verdict on them is unobserved. No labels can be confirmed (Rule 9), no verdict can be given
(Rule 12), and no Rule-54 sentence 2 can be written.

## Evidence

* `GET https://sv9160.qa.shopview.com/index.html` → **HTTP 502** (guessed from the newly-found epic
  key; it is a guess, not a published host).
* No Global Search QA host is recorded anywhere in `build/`.
* The project has been **POSTPONED** since the 2026-07-27 ruling, so no branch was ever asked for.

## What DID change, and it matters

The epic now exists: **[SV-9160](https://shopview.atlassian.net/browse/SV-9160)** — "Global Search v2",
Epic, **Open**, created **2026-08-12**, **24 children** (verified two ways). Our record said the epic
key was "NOT AVAILABLE YET". The epic's own description also carries **four open questions** and
**two PRD corrections** (the PRD prescribes PostgreSQL `pg_trgm`/`levenshtein`/`metaphone`; ShopView
is **MySQL on Aurora** — and §10 Phase 3 says *"a React context"* where the app is **Vue 3 + Quasar**).

## Exactly what is needed

Two things from the QA lead, in this order:

1. **Is Global Search still postponed, now that its epic is Open with 24 children and its PRD moved
   yesterday (2026-08-20)?**
2. If it is being picked up: **the QA branch/host name and the feature-flag state**, plus a cookie set
   (`build/BLOCKED-shopview-app-session.md`).
