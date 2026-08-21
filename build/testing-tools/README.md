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
| `testrail-api.mjs` | TestRail basic-auth helper: `get_projects`, `get_case`, `get_cases`, `get_run`, `add_result_for_case`, plus `raw <endpoint>` — **and the canonical `addCasePayload()` / `addCase()` / `verifyCreatedCase()`**. `node testrail-api.mjs get_case 26482` | `/tmp/testrail/creds.json` |
| `testrail_add_case.py` | **CANONICAL `add_case` payload builder (Python twin of the above).** `add_case_payload(...)` defaults `custom_atmstatus` to `1` ("Not Automated") and **raises** if a caller passes `3`. `python3 testrail_add_case.py` prints the payload and demonstrates the guard. | nothing (pure) |
| `check_add_case_payloads.py` | **GUARD — run before any push that creates cases.** Scans the repo for `add_case` payloads that would flag a case `3` ("Automated"), and warns about post-write verifiers that treat `3` as the PASS condition. Exit 0 clean / 1 hazard. | nothing (pure) |

### 🛑 `custom_atmstatus` — copy the payload from the helper, never from an old exec script

`custom_atmstatus` is TestRail's **"Automation status"** dropdown (field id 17):
`1` Not Automated · `2` Cannot be automated · `3` Automated · `4` Pending — `is_required: true`
with `default_value: "1"` (read live from `get_case_fields` on project 1, 2026-08-11).

**Every one-off push script in this repo used to send `3`**, because there was no shared helper and
each pass copied the previous one. So every case we created by API landed in TestRail flagged
**Automated when nobody had automated it**. That field is how the automation engineer records what he
has actually automated, and **Standing Rule 65 keys the whole tell-Vlad duty off it** — so `1` is a
statement of fact and `3` is a claim about somebody else's work.

```sh
python3 build/testing-tools/check_add_case_payloads.py   # before any create-cases push
```

The ~19 already-executed scripts that still contain `3` were **deliberately left byte-identical** as
the audit record of what was run; the guard lists them by name every run so an old audit record is
never mistaken for a live hazard — and never copied.

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

### Install the pre-commit secret-scan hook (once per clone)

```sh
cp build/testing-tools/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
```

The hook runs `scan_secrets.py --staged` and **blocks the commit on exit 1**. This
repository is **PUBLIC**, so a credential that reaches a commit is disclosed the
moment it is pushed — and rewriting history does not un-disclose it, the value has
to be rotated. **If the scanner file is missing the hook FAILS the commit rather
than passing quietly** (Standing Rule 82: a guardrail that silently no-ops is worse
than none, because it gets reported as having run).

Modes: `--staged` (what git will commit) · no flag (the whole working tree,
tracked **and** untracked) · `--all` / `--tracked` (every tracked file) ·
`--diff FILE` · `--selftest` (proves detection fires and that clean text passes).
Genuine false positives are marked on the line with `scan-secrets:allow`.
