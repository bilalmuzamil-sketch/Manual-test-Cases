# SV-9246 — cross-tenant authorization bypass (Bearer token reaches another org)

**Ticket** [SV-9246](https://shopview.atlassian.net/browse/SV-9246) · Bug · Medium · assignee Slavcho
Mitrov · status **TESTING QA** · spun out of SV-7760.

**What it claims:** a Bearer token that authenticates to **organization A**, used from an
**organization B** context, is accepted as the request's org context — so it can **read and mutate**
another tenant's data (the confirmed example: reversing org A's customer payment from org B).

**Expected (fixed) behaviour, from the ticket:** cross-org reads and mutations must return a
controlled **403** or a non-enumerating **404/400 Not found**; the foreign org's data must stay
unchanged.

## Verdict: INCONCLUSIVE — the core defect could not be exercised (not a pass, not a fail)

This is a **two-organization** test by its nature. I have authenticated access to **exactly one
organization** and the environment gives me no way to obtain a second, so **the ticket's confirmed
reproduction path could not be run**. Everything I *could* reach behaves correctly, but none of it is
the actual defect — so I will not call this passed. For a security bug, a green tick I cannot back
would be worse than none.

## Environment

| | |
|---|---|
| fix branch | `https://sv9246.qa.shopview.com` — build **`v26.35.3-9ccdc12`**; `sv9246api` reachable, auth OK |
| also probed | `https://sv7760.qa.shopview.com` (where the bug was found) — build `v26.35.4-6aadeec` |
| my org | **`d55bc308`** (Staging Foothills Group Inc) — the only org I can authenticate into |
| other orgs visible | `1c92576f` (Bilal Muzamil), `454d57ee` (DT) — listed by `/organizations`, but I cannot get a session that resolves to either |

## What I established (all consistent with correct scoping — but none is the bug)

1. **Global listings are confined to my org.** `GET /customers?limit=100` → 100 rows, **every one**
   `organization_id = d55bc308`; zero foreign rows.
2. **Foreign-org reads are refused.** `GET /organizations/{foreign}` → **404**;
   `GET /organizations/{foreign}/roles` → **403** (both foreign orgs).
3. **An asserted foreign org context is ignored, not honoured.** `GET /customers` with
   `X-Organization-Id` / `X-Organization` / `Organization-Id` headers and with `?organization_id=`
   all set to org DT → still 100 rows of **my** org. This is the closest angle to the ticket's
   "Organization headers … must never allow access to a foreign tenant", and it holds.
4. **No cross-org pivot exists for me.** `switch-user`, `iam/change-organization`,
   `organizations/select`, `iam/switch-organization` and five other variants → 404/400/401;
   `quick-login {organization_id: DT|BM}` returns 200 but the session **still** resolves to
   `d55bc308`.

## Why this is NOT a verification of the fix

The ticket's *confirmed* defect is the **Bearer-token org-mismatch**: a token minted for org A,
presented in an org B request. Every probe above authenticates via the shared SSO cookie +
`quick-login`, which only ever mints a token for **my** org. I therefore never held a token resolving
to a *different* org, so I never created the mismatch the fix is meant to reject. The header-injection
and foreign-read refusals are reassuring, but the developer note says the same token read foreign data
on *unrelated* endpoints — that is the token-resolution path, which I could not touch.

Two honest unknowns I could not settle either:
- **`/organizations` lists 3 orgs to my session.** This may mean the test user is a legitimate member
  of all three, or it may be an enumeration leak. I cannot tell without the membership model, and it
  changes what "foreign" even means for this user.
- **The ticket's own QA note was itself partly inconclusive** (the Incognito retry failed with a 409
  "Session has expired" before ownership was evaluated). Only the Bearer-token path was ever
  confirmed — and that is exactly the path I lack the credentials to replay.

## What is needed to actually verify SV-9246

Cheapest, and what I'd ask for first — **authenticated credentials for a genuinely DIFFERENT
organization** on the sv9246 branch (a `PHPSESSID`/session or a Bearer token that resolves to org A,
NOT `d55bc308`), plus **one payment UUID owned by that org**. Then the real test is three calls:
reverse that org-A payment from my org-B session (expect 403 or non-enumerating 404), read an
unrelated org-A record with the same session (expect refusal), and confirm org A's payment is
**unchanged**.

Alternatively — authorize me to **create a second org + user from scratch** (Rule 14, seed don't
block). That is the correct fallback but heavier and uncertain (it likely needs a signup +
email-verification flow, per the `qa_*@yopmail.com` user in the ticket), so I would estimate the cost
before spending it.

## Cost note

~8 small probe batches, no browser — the defect is an API/authorization surface. I stopped at the
blocking answer (no second-org credential) rather than exploring around it. Nothing was mutated on any
foreign org (none was reachable); no test data created.
