# SV-9246 — cross-tenant authorization — RE-TEST WITH TWO ORGS

**Ticket** [SV-9246](https://shopview.atlassian.net/browse/SV-9246) · Bug · status **TESTING QA** ·
fix branch `sv9246.qa.shopview.com` (etag `b1ad2217b3cf29ac7760d87cb5cf9035`).

**Supersedes** `FINDINGS.md` (which was INCONCLUSIVE for lack of a second org). The QA lead supplied a
second organisation on the same branch, which unblocked the real test.

## VERDICT: FAIL — the vulnerability still reproduces on the fix branch

An **ordinary org admin of one organisation can impersonate a user in another organisation and read +
mutate that organisation's financial data.** This is exactly SV-9246's stated impact
(cross-tenant data exposure + cross-tenant financial mutation), reproduced end to end.

## The two organisations (genuinely distinct, same branch)

| | org | account |
|---|---|---|
| **A** | `d55bc308` — Staging Foothills Group Inc | Bilal.muzamil@shopview.com |
| **B** | `37aa0f4a` — Dteem | bilal.muzamil+9246admin@shopview.com |

**B is a plain "Admin"** (`role_label: Admin`), org Dteem has **1 staff**, and B's 42
`fe_permissions` contain **no** impersonation / super-admin / cross-org permission. So B is not a
support/super user — it is an ordinary single-org admin.

## The exploit chain (verbatim transcript in `evidence/exploit.txt`, UTC-stamped)

1. Authenticate as **B** (org Dteem, 37aa0f4a). `GET /workplaces` → org 37aa0f4a. ✔ genuinely org B.
2. **`POST /api/switch-user {user_id: <active org-A user edward.brown@…>}` → 200.**
   `GET /workplaces` now returns **`d55bc308` (org A)**. The org boundary is crossed by impersonation.
3. **Cross-tenant READ:** `GET /api/customer-payment/list?account_id=<org-A account>` now returns
   **org A's 3 payments** (db723238 $1,240.06 · 03cf06cc $278.38 · cc0a5bcc $185.58). Before
   impersonation the same call from B returned **0**.
4. **Cross-tenant MUTATION:** `POST /api/customer-account/reverse-customer-payment {id: db723238}` →
   **201**.
5. **Independent confirmation from org A's OWN session:** the account went from **3 payments to 2**,
   and db723238 is gone. So the reversal genuinely landed in org A, not just in the attacker's view.

This is reproducible: repeated from a freshly-minted clean B session (dropping any prior PHP session)
with the same result.

## Additional observation — stale impersonation state

Once B was impersonating, **re-authenticating via `POST /login` (same PHPSESSID) did NOT clear the
impersonation** — a subsequent `switch-user` returned *"You are already impersonating a user. Exit
impersonation first."* I found **no exit-impersonation endpoint** (`/switch-user/exit`,
`/exit-impersonation`, `/switch-back`, `DELETE /switch-user`, `/stop-impersonation` all 404/405). A
genuinely clean session required minting a **new** PHP session. The ticket's Expected Behavior
explicitly requires impersonation to be *"cleared when the session changes"* — this is not, on the
`login` path.

## What DID hold (the cookie/header path — reported for completeness)

Before finding the impersonation path, the direct cross-tenant vectors were all correctly blocked:
- B reading org A's payment list / customer with its **own** session → 0 rows / 400 Not found.
- B asserting org A via `X-Organization-Id` / `X-Organization` / `Organization-Id` / `X-Org-Id`
  headers, on both read and the reverse mutation → **ignored** (0 rows; never 201; org A intact).

So the header-injection and plain-session vectors appear fixed. **The impersonation (`switch-user`)
path is not**, and it is the one that fully reproduces the ticket's impact.

## One hygiene note (secondary, likely SV-7760 territory)

A cross-tenant reverse from B's *own* (non-impersonating) session returned a **500**, not the
"controlled 403 / non-enumerating 404/400" the ticket's Expected Behavior asks for. This is the
opaque-500-on-not-found class from SV-7760 (whose fix is on a different branch). It did not expose or
mutate data — the mutation only succeeded via impersonation.

## Honest limits

- I could not test the literal **`Authorization: Bearer <token>`** header named in the title — the
  login response `token` is a serialized PHP object (null bytes, unusable as a bearer), and no
  API-token/personal-access-token endpoint exists (all 404). The impersonation path reproduces the
  same *impact* the title describes, but via `switch-user`, not a raw Bearer header. Whether the two
  share a root cause is for the developer to confirm.
- **Whether cross-org impersonation is meant to be possible at all for any role** is a product
  question — but the ticket's Expected Behavior says impersonation must be *scoped and authorized*,
  and here a plain single-org Admin crossed the boundary, so at minimum the scoping is absent.

## Data touched (disposable QA branch, user authorised "destroy freely")

Reversed org A payment **db723238** ($1,240.06) on account 934527f3 as part of the mutation proof —
left reversed. All actions on `sv9246`, a per-ticket QA branch. No production data.

## No Jira post

This is a FAIL on a security ticket — nothing posted without the QA lead's explicit direction.

## Independently reproduced by the QA lead in-browser (2026-08-26)

The QA lead re-ran the exploit from his own two browser sessions (console `fetch`, each tab's real
login), confirming it is not a harness artefact:

```
BEFORE  Org B session is org: ['37aa0f4a-fcb0-4eff-afd1-b7d9a2de04cf']   (sees 0 of Org A's payments)
switch-user -> 200
AFTER   session now resolves to org: ['d55bc308-...']  (Org A)
EXPOSURE Org B now reads Org A's payments: 2
   03cf06cc  MASTERCARD  278.38  ref 027193
   cc0a5bcc  MASTERCARD  185.58  ref 016624
>>> BUG STILL EXISTS: an Org B admin crossed into Org A and read its data.
```

Same two payments the API run left after reversing db723238 — API and in-browser results agree
exactly. Verdict stands: **FAIL**.
