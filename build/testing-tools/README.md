# Testing helper scripts (reusable harness)

These are the **proven, working** scripts for driving ShopView staging and
TestRail during manual/automated test runs. **Do NOT rewrite them each run** —
copy them to `/tmp` and use them as-is. They are intentionally secret-free: every
script reads its credentials from a JSON file under `/tmp` at runtime.

> Full method, entity ids, and rules are in
> [`build/TESTING-RUNBOOK.md`](../TESTING-RUNBOOK.md),
> [`build/VIU-ACCESS-METHOD.md`](../VIU-ACCESS-METHOD.md), and `CLAUDE.md`.

## Setup (do this once per run)

```sh
# 1. Stage the scripts where they expect to live.
mkdir -p /tmp/cln /tmp/testrail
cp build/testing-tools/staging-*.mjs /tmp/cln/
cp build/testing-tools/testrail-api.mjs /tmp/testrail/

# 2. Create the staging cookie file with FRESH cookies (session ~1h; re-grab when
#    it expires). NEVER commit this file.
cat > /tmp/cln/cookies.json <<'JSON'
{ "PHPSESSID": "<fresh>", "cf_clearance": "<fresh>", "sv_sso_session": "<fresh>" }
JSON
chmod 600 /tmp/cln/cookies.json

# 3. Create the TestRail creds file. Use "password" OR "key" (API key). NEVER commit.
cat > /tmp/testrail/creds.json <<'JSON'
{ "email": "<you>@shopview.com", "password": "<password_or_api_key>", "host": "https://shopview.testrail.io" }
JSON
chmod 600 /tmp/testrail/creds.json
```

`staging-boot2.mjs` and `staging-restore-tech.mjs` import `./staging-admin.mjs`,
so keep all `staging-*.mjs` together in `/tmp/cln/`.

## The scripts

| Script | What it does | Reads / needs |
| --- | --- | --- |
| `staging-api.mjs` | Authed fetch to `api.staging.shopview.com` under the captured cookie owner (read-only). `node staging-api.mjs GET /api/auth/me/fe-permissions` | `/tmp/cln/cookies.json` |
| `staging-admin.mjs` | Admin ops via dev `quick-login` — roles, `staff/{id}/change`, org lookups. `login(key)` returns a fresh-PHPSESSID session cookie; writes must go through this. `node staging-admin.mjs admin GET <path>` | `/tmp/cln/cookies.json` |
| `staging-boot2.mjs` | SPA hydration/login for Chromium (Playwright): dev-login + hydrate localStorage, returns a live page. `SV_KEY=tech node staging-boot2.mjs /workorders` | `/tmp/cln/cookies.json`, `$HTTPS_PROXY` (read live), Playwright + Chromium at the paths in the file |
| `staging-bridge.mjs` | FRESH local MITM bridge: accepts Chromium `CONNECT`, relays via Node `fetch` through the agent proxy. FALLBACK when boot2's direct proxy path fails. Prints `BRIDGE_LISTENING 127.0.0.1:<port>`. | `NODE_USE_ENV_PROXY=1`, `NODE_EXTRA_CA_CERTS=<agent CA bundle>`, `$HTTPS_PROXY` (read live) |
| `staging-restore-tech.mjs` | Reset the Tech staff member back to the default "Time Clock" role after a permission run, then verify. `node staging-restore-tech.mjs` | `/tmp/cln/cookies.json` |
| `testrail-api.mjs` | TestRail basic-auth helper: `get_projects`, `get_case`, `get_cases`, `get_run`, `add_result_for_case`, plus `raw <endpoint>`. `node testrail-api.mjs get_case 26482` | `/tmp/testrail/creds.json` |

### Env / proxy notes (preserve these — they are load-bearing)

- Node scripts that go through the agent egress proxy need
  `NODE_USE_ENV_PROXY=1` and `NODE_EXTRA_CA_CERTS` pointing at the current agent
  proxy CA bundle.
- **`$HTTPS_PROXY` rotates between sessions.** Always read it live at start-up;
  never reuse an old bridge or a hard-coded port.
- Chromium is launched with `--no-sandbox --ignore-certificate-errors
  --ssl-version-max=tls1.2` and a Chrome-131 desktop UA (baked into
  `staging-boot2.mjs`). Adjust the Playwright import / `executablePath` if your
  environment's browser paths differ.

## Reconstruction note

- Harvested working sources: `staging-api.mjs` (`/tmp/cln/api.mjs`),
  `staging-admin.mjs` (`/tmp/cln/adm.mjs`), `staging-boot2.mjs`
  (`/tmp/cln/boot2.mjs`), `staging-restore-tech.mjs` (`/tmp/cln/restore.mjs`),
  and `testrail-api.mjs` (consolidated from `/tmp/testrail/{test,get_projects,get,addresult,fetch}.mjs`).
- `staging-bridge.mjs` had **no standalone source file** in `/tmp` (boot2 uses the
  direct-proxy path; the dedicated bridge is the documented fallback). It was
  reconstructed from the pattern in `TESTING-RUNBOOK.md` / `VIU-ACCESS-METHOD.md`.

## Security

**NEVER commit `/tmp/cln/cookies.json` or `/tmp/testrail/creds.json`** — they hold
live cookies / passwords / API keys and must live only under `/tmp`. The scripts
in this folder contain no secret values; keep it that way.
