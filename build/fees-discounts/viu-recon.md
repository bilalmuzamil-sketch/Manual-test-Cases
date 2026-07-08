# Fees & Discounts V1 — QA env (qb) VIU Recon

> **STATUS: BLOCKED at access — egress allowlist.** The F&D QA environment's real
> **API host is not reachable** from this session's egress proxy, so authentication
> and surface recon could not be performed. Details below. This file captures the
> durable findings (the real API host, the app host, the cookie set) so the next
> run resumes instantly once the host is allowlisted.

## Environment (qb / SV-7387)

| Thing | Value | Reachable? |
|---|---|---|
| **App (SPA) host** | `https://qb.qa.shopview.com/` | **YES** — returns the SPA `index.html` (HTTP 200). |
| **Real API host** | `https://sv7387api.qa.shopview.com` | **NO** — egress proxy returns **403 "Host not in allowlist: sv7387api.qa.shopview.com"**. |
| `qbapi.qa.shopview.com` (guessed candidate) | — | **NO** — DNS/policy: proxy `502 connect_rejected` (does not resolve / not allowed). Not the API host. |
| `qb.qa.shopview.com/api/...` | — | Serves SPA HTML (the SPA returns index.html for unknown routes) — **not** the API. |

**How the API host was found:** the SPA index at `https://qb.qa.shopview.com/`
loads one bundle `/js/index.*.js`; grepping it for `*.shopview.com` yields exactly
one API host: **`https://sv7387api.qa.shopview.com`**. (Env is SV-7387 — the F&D
Custom-Roles/permissions Jira, consistent with the F&D feature branch.)

## The blocker (report to user)

The agent egress proxy's allowlist does **not** include `sv7387api.qa.shopview.com`.
- `POST https://sv7387api.qa.shopview.com/api/quick-login` →
  **403 `Host not in allowlist: sv7387api.qa.shopview.com. Add this host to your
  network egress settings to allow access.`**
- `qbapi.qa.shopview.com` → proxy `502 connect_rejected` (recorded in
  `$HTTPS_PROXY/__agentproxy/status`).

Per `/root/.ccr/README.md`, a 403 from the proxy is an **organization egress-policy
denial** — I must **not** retry or route around it, only report it. The pattern
`app-host allowed, API-host blocked` is the same shape as other QA envs; the fix is
to **add `sv7387api.qa.shopview.com` to the session's network egress allowlist**
(the app host `qb.qa.shopview.com` is already allowed).

**NEEDS USER APPROVAL:** allowlist host `sv7387api.qa.shopview.com` for network
egress. Once added, re-run the probe (below) — the two supplied cookies can then be
validated.

## Cookies (names only — values in `/tmp/fees-discounts/cookies.env`, chmod 600)

Two cookies supplied (no `cf_clearance`):
- `sv_sso_session` (64-hex) — the SSO session.
- `PHPSESSID` (32-hex) — PHP session.

**Not yet validated** — could not reach the API host to test them. Whether
`cf_clearance` is also needed is **undetermined**: the app host `qb.qa` served HTML
without any Cloudflare challenge, so a challenge was **not** observed, but the
authenticated API path was never exercised. Re-check after allowlisting.

## Logged-in user / role

**Undetermined** — quick-login could not run (API host blocked). Admin & tech both
untested.

## Is F&D live / feature flag

**Undetermined** — could not reach `/administration/feature-flags` or
`/api/organizations/settings`. Per spec §1, F&D is gated by a per-org
**"Fees & Discounts" feature flag**; whether it is ON on this env is unverified.

## Per-surface BUILT / NOT-YET table

**All undetermined — no surface could be loaded.** Target surfaces to check once
access is restored (from `requirements.md` + `design-notes.md`):

| Surface | Route to check | Status |
|---|---|---|
| Feature flag "FeesAndDiscounts" | `/administration/feature-flags` | UNVERIFIED |
| Template Builder / admin templates (Story 7/8) | Administration → Service → **Fees & Discounts** (below Canned Lines) | UNVERIFIED |
| Whole-WO fee/discount (Story 1/3) | WO detail `⋯` → "Add Work Order Fee / Discount"; sidebar "WO Fees & Discounts" card | UNVERIFIED |
| Labor-line adjustment (Story 1) | WO line row 3-dot → Add fee / discount | UNVERIFIED |
| Part-line adjustment (Story 1) | WO part menu → Add fee / discount | UNVERIFIED |
| Processing Fee (Story 8, template-only) | admin F&D page → Type = "Processing Fee" | UNVERIFIED |
| Customer default templates + auto-apply (Story 9) | Customer page → "Fees & Discounts (N)" tab | UNVERIFIED |
| Part Sales adjustments (Story 11) | Part Sale → `⋯` "Add Parts Sale Fee / Discount"; parts "Fees & Discounts" column | UNVERIFIED |
| Audit / history log (Story 10) | WO history log — "Fee added/updated/removed" entries | UNVERIFIED |
| QuickBooks line-item mapping (Story 6) | Settings → QuickBooks (Fee/Discount item map) | UNVERIFIED (QB out of scope for deep VIU) |

## What's VIU-able now

**Nothing.** All F&D verification is blocked on egress access to
`sv7387api.qa.shopview.com`. The SPA cannot even hydrate/authenticate in a browser,
because every `/api/*` call the SPA makes targets the blocked API host (the MITM
bridge relays through the same egress proxy).

## Resume procedure (once the host is allowlisted)

1. Harness is already staged at `/tmp/fdcln/` (`fd-admin.mjs`, `probe.mjs`) and
   cookies at `/tmp/fdcln/cookies.json` (= `/tmp/fees-discounts/cookies.env`).
2. `cd /tmp/fdcln && NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node probe.mjs`
   with `FD_API=https://sv7387api.qa.shopview.com` — confirms cookies, logged-in
   user, admin+tech, org settings.
3. Then boot2-hydrate Chromium against `https://qb.qa.shopview.com/` (adapt
   `build/testing-tools/staging-boot2.mjs`: APP = qb host, API = sv7387api host,
   cookie domain `.qa.shopview.com`, chromium glob
   `/opt/pw-browsers/chromium-*/chrome-linux/chrome`).
4. Walk the surface table above; screenshot to `/tmp/fees-discounts/recon/*.png`.
