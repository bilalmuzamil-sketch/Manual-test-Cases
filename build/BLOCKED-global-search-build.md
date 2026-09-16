# ✅ RESOLVED 2026-09-16 — Global Search HAS a reachable build, and it is signed into routinely

> **This file is kept for its history. The blocker it describes is closed. Do not re-raise it.**
>
> **The branch is `sv9160`** — app host `https://sv9160.qa.shopview.com`, API host
> `sv9160api.qa.shopview.com` (no dot before `api`, §A). Observed today on build
> **`v26.36.7-21b4db9`**, signed in as **administrator / 43 permissions**, landed on `/customers`.
> The 2026-08-21 `HTTP 502` was a guessed host on a branch that had not been stood up yet.
>
> **The route that works, unchanged from §A:**
> `bash build/testing-tools/ensure_bridge.sh` → put a live `sv_sso_session=<value>` in
> `/tmp/qa-cookies/sv9160-sso.txt` (`chmod 600`, never committed) →
> `node build/testing-tools/qa-branch-boot.mjs sv9160 /customers admin`.
>
> **⛔ AND A CORRECTION TO MY OWN EARLIER CLAIM (L0133, 2026-09-15):** I reported that the newest
> build had **removed the DEV MODE quick-login panel** and left only Google SSO, and recorded the
> branch as unusable. **That was wrong.** `GET /api/quick-login/users` answers **200** and both the
> Admin and Tech buttons are on the sign-in page today. What I actually had was an **expired
> `sv_sso_session`**: without it the API host answers `401 {"error":"sso_required"}` with a
> `auth.qa.shopview.com` redirect, which reads exactly like "the panel is gone and SSO is now
> mandatory". **A 401 `sso_required` on the API host is a stale session cookie, never a build
> change** — check the cookie before you conclude anything about the product (Rule 104).

---

## The original blocker, as raised on 2026-08-21 (historical)

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
