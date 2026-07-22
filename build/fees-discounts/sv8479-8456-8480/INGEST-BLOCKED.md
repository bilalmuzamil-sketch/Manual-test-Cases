> # ✅ RESOLVED — 2026-07-22
> This block is **no longer blocked.** All three tickets were subsequently ingested from
> local capture `/tmp/fd-tickets/*` (user-exported; no Jira login/network). See:
> - `requirements-SV-8479.md` · `requirements-SV-8456.md` · `requirements-SV-8480.md`
> - `INGEST-SUMMARY-2026-07-22.md` (consolidated summary of all three + process plan)
>
> The attempt log below is kept as a breadcrumb of the access methods tried and the
> reason direct Jira fetch failed (Atlassian-SSO wall; supplied cookies authenticate
> ShopView **staging** only, not atlassian.net).

---

# Fees & Discounts — Jira Ingest Attempt: SV-8479 / SV-8456 / SV-8480

- **Project:** Fees & Discounts V1 (ShopView)
- **Epic:** SV-7387
- **PO:** Chris Ward
- **Ingest date:** 2026-07-22
- **Tickets targeted:** SV-8479, SV-8456, SV-8480
- **Base:** https://shopview.atlassian.net (Confluence/Jira are Atlassian-SSO login-walled — reference pointers only, do NOT fetch)
- **Result:** BLOCKED — NONE of the available access methods could read any of the three tickets. No ticket content was ingested. Per Standing Rule 1 / Rule 17, content was NOT invented or partially guessed.

## Methods tried and exact failures (all three tickets)

### Method 1 — Atlassian REST API v3, Basic auth
`curl -u bilal.muzamil@shopview.com:<value>` against
`https://shopview.atlassian.net/rest/api/3/issue/<KEY>` and `/rest/api/3/myself`.

- Auth probe `GET /rest/api/3/myself` (with the 64-hex value as the token): **HTTP 401** — body `Client must be authenticated to access this resource.`
- Same probe with the 32-hex value as the token: also fails.
- `GET /rest/api/3/issue/SV-8479?fields=summary` (Basic auth, 64-hex): **HTTP 404** — body `Issue does not exist or you do not have permission to see it.`
- Same for the 32-hex token: **HTTP 404**.
- Conclusion: the provided credential values are ShopView/Cloudflare session cookies, NOT Atlassian API tokens (Atlassian tokens are not 64/32-hex). Basic auth is unauthenticated → 401/404.

### Method 2 — Web/session fetch of the browse URL with the provided values as cookies
`curl "https://shopview.atlassian.net/browse/<KEY>"` with
`Cookie: sv_sso_session=<VALUE_1>; PHPSESSID=<VALUE_3>; cf_clearance=<VALUE_2>`.

- `GET /browse/SV-8479`, `/browse/SV-8456`, `/browse/SV-8480`: each returned **HTTP 200, 0 redirects** — BUT the body is the generic Jira SPA shell (≈732 KB, `<title>Jira</title>`), containing only login markers and no ticket data (no "SV-8479", no "Fees", no "Discount" strings). This is the unauthenticated app shell that performs client-side SSO; the shopview.com/Cloudflare cookies do NOT authenticate atlassian.net.
- `GET /rest/api/3/issue/<KEY>` with the same cookies (no Basic auth): **HTTP 404** — `Issue does not exist or you do not have permission to see it.` for SV-8456 and SV-8480 (SSO not satisfied).

### Method 3 — WebFetch of the browse URL
`WebFetch https://shopview.atlassian.net/browse/SV-8479`: **HTTP 403 Forbidden** (SSO/login wall; body not retrieved).

## What is needed to unblock
The three tickets cannot be read from this environment (Atlassian SSO wall; the supplied cookies authenticate ShopView **staging** only, not atlassian.net). Per the established pattern used for SV-8183, the user must **export/paste each ticket's full content** so it can be ingested:

For each of SV-8479, SV-8456, SV-8480, please provide:
1. Summary/title, status, type, and all relevant fields.
2. The complete description text.
3. ALL comments (author + date + full text), in order.
4. Every attachment / screenshot / embedded image / video — the full list (Rule 17: complete count, not a sample), plus the files themselves so each image can be opened and described (the VIU depends on the visuals).

Once pasted/exported, content will be ingested into
`build/fees-discounts/sv8479-8456-8480/requirements-SV-XXXX.md` (one file per ticket).

## Note (context, not from these tickets)
SV-8456 was previously referenced in project memory (the 2026-07-21 "SV-8456 UI-correction" staging VIU pass) — but that prior knowledge is NOT a substitute for reading the ticket itself; no ticket text was pulled here.

## Access-probe side result (Goal A — staging)
The provided cookies DO authenticate ShopView **staging** (confirmed live 2026-07-22):
`POST https://api.staging.shopview.com/api/quick-login {"key":"admin"}` → **HTTP 200** (admin@shopview.com);
`GET /api/auth/me/fe-permissions` → **HTTP 200**.
Working mapping: sv_sso_session = VALUE_1 (64-hex), PHPSESSID = VALUE_3 (32-hex), cf_clearance = VALUE_2. (Secrets kept in /tmp only; never committed.) Staging is ready for the VIU.
