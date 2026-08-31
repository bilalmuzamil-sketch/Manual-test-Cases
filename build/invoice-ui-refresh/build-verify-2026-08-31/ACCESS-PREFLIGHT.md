# ACCESS PREFLIGHT — Invoice Refresh QA branch `sv8218` · 2026-08-31

**Build-verification lane. NO verification has been performed** — the QA lead is confirming source
currency in another session and I am **holding for his go-ahead** (Rules 80/81).

## ACCESS — LIVE

| Check | Result | Read at (UTC) |
|---|---|---|
| `GET https://sv8218.qa.shopview.com/index.html` | **HTTP 200** | 2026-08-31T08:30Z |
| **BUILD MARKER** | **`v26.35.5-8c3cc21`** | 2026-08-31T08:30Z |
| `last-modified` | **Fri, 28 Aug 2026 21:43:14 GMT** | ″ |
| `etag` | `f4fe56c10d617c0285684d0ed1df6afd` | ″ |
| `sha256(index.html)` | `45c226323820e36a616effa1…` | ″ |
| **Authenticated probe — the API host** `sv8218api.qa.shopview.com/api/auth/me/fe-permissions` | **HTTP 200**, JSON payload | 2026-08-31T08:31Z |

**The session is genuinely live**, not a false 200: the probe went to the **`…api.` host** (core §6
trap 2 — the SPA host serves `index.html` for any unmatched path and returns 200 for anything), and it
came back with a real permissions payload.

**⚠️ `cf_clearance` was NOT supplied and was NOT needed.** Two cookies — `sv_sso_session` and
`PHPSESSID` — are sufficient on this branch today. Recorded because core §6 describes a three-cookie
set; if a Cloudflare challenge appears later, `cf_clearance` is the missing piece to ask for **by name**.

**Cookie handling:** values in `/tmp/qa-cookies/` only, `chmod 600`, **never committed**; header built
as a single line with `'; '.join` (core §6 trap 3 — `paste -sd'; '` silently corrupts it and drops a
cookie). Both cookies are now in the secret scanner's fingerprint set (4 secrets, FULL mode).

## THE SESSION'S IDENTITY — it matters for what can and cannot be observed

| | |
|---|---|
| template | **`administrator`** (`d1f1f7c2-bac2-4cc1-88af-7c44aa772289`) |
| `view_mode` | **`full`** |
| `system_role` | **true** |
| `fe_permissions` | **42**, including `invoicingPaymentsView` · `invoicingPaymentsCreateAndEdit` · `invoicingPaymentsDelete` |
| `cross_toggles` | `seeFinancialData: true` · `seeApArData: true` · `viewHistoryLogs: true` |

**⇒ CONSEQUENCE, stated before the pass rather than discovered during it:** this is a **full-view
administrator with every financial toggle on**. It can observe the positive path of every case, but it
**cannot, as itself, observe a single permission-NEGATIVE case** — anything asserting that a
restricted role does *not* see a control. Those need a different role (Rule 74's Technician
role-swap), which **mutates a shared role on a shared branch** and so is scheduled deliberately, last,
and only once no sibling is live (core §7.3).

## ⚠️ A VERSION-SCHEME DIFFERENCE, FLAGGED NOT ASSUMED

`sv8218` reports **`v26.35.5-8c3cc21`**. Every other branch and staging in our records uses the
`v3.x-<sha>` form (`v3.10-49b5fe3`, `v3.8-bc7508a`, `v3.7-6e2d301`). **Two different schemes.** I am
not guessing what that means — it may be a re-versioned product line, or a different build pipeline for
this feature. **It matters only in that our "within 3 builds" validity window (Rule 77) cannot be
computed across two schemes**, so for this project the marker is recorded verbatim and compared only
against itself.

## WHAT I HAVE NOT DONE

No case opened, no step walked, no verdict formed, no screenshot taken, no data seeded, no role
touched, no TestRail read or write for this project, **no lock claimed.** The build marker above is the
whole of it.
