# How the browser was driven on 2026-08-10 — read this before re-deriving anything

**The egress proxy RESETS Chromium's CONNECT tunnels.** Every previous recipe (a local MITM bridge,
or pointing Chromium straight at `$HTTPS_PROXY`) fails here:

| attempt | result |
|---|---|
| Chromium → local relay bridge → `$HTTPS_PROXY` | `net::ERR_CONNECTION_CLOSED` — and the bridge logged **nothing**, because CONNECT verbs are intercepted before they reach a local listener |
| Chromium → `$HTTPS_PROXY` directly | `net::ERR_CONNECTION_RESET`, unchanged by `--ssl-version-max=tls1.2`, `--disable-quic`, `--ignore-certificate-errors`, disabling ECH |
| Chromium → plain **HTTP** to a local port | **works** |

**THE METHOD THAT WORKS: Chromium never touches the network.** `ctx.route('**/*')` intercepts every
request; **Node performs it** with `NODE_USE_ENV_PROXY=1` (undici honours `$HTTPS_PROXY`) and
`route.fulfill()` hands the bytes back. Static assets are cached on disk at `/tmp/assetcache`, so the
first page load takes ~20 s and later ones a few seconds.

## Signing in WITHOUT `quick-login` (which is barred)

The SPA authenticates from `localStorage`, not from the cookie. Seed four things, via
`ctx.addInitScript` so they exist before the app boots:

- `user` — `{data:{token, details:{user_id, staff_id, email, clockable, default_workplace, …},
  role:{fePermissions:[{name}…]}}}`. Build it from `POST /api/token` (returns `accessToken` for the
  session's own user — it does **not** switch anybody), `GET /api/staff?limit=250` (match on
  `admin@shopview.com`) and `GET /api/auth/me/fe-permissions`.
- `fe_permissions_wrapper` — the `data` object from `/api/auth/me/fe-permissions`.
- `token` — the same access token.
- `location` / `timezone` / `country_code` / `current_shop_id` — the workplace.

**`default_workplace` MUST be non-null or the app bounces to `/administration/locations`** — that
bounce is the "no location" trap, not an auth failure. Generator: `tools/mkuser.py`.

## Route

`page.goto(APP + '/reports/work-in-progress')` etc. **Never** the SPA host for probing — it returns
HTTP 200 on any path. Probe `sv8582api.qa.shopview.com`.
