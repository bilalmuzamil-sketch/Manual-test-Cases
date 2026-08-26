# Credential handling (durable, safe) — ShopView QA workspace

**This repo is PUBLIC. Secret VALUES are NEVER committed here** (Rule 82). This file records only the
mechanism and the variable NAMES, so any session knows where to read from without asking again.

## The durable, safe store: environment variables (set ONCE)
Set these in the Claude Code on the web **environment settings** for this environment
(Environment variables / secrets). Once set, they are injected into every session automatically and
the QA lead never has to paste them again. The sandbox cannot set these itself (by design).

| Variable | What it is |
|---|---|
| `TESTRAIL_API_KEY` | TestRail API key (for `email:api_key` basic auth) |
| `TESTRAIL_EMAIL`   | TestRail login email (falls back to `CLAUDE_USERNAME`) |
| `SHOPVIEW_PASSWORD`| ShopView app login password (falls back to `CLAUDE_PASSWORD`); only needed for app/build login |

## How sessions use them
- Python tools: `from load_creds import testrail_creds` (in `build/testing-tools/`) → env-first, then
  `/tmp/shopview-creds.env` fallback.
- Shell/one-time: run `build/testing-tools/init_creds.sh` to write `/tmp/shopview-creds.env` (chmod 600)
  from the env vars, so existing scripts that read that file keep working unchanged.

## If env vars are NOT set (fallback)
The QA lead pastes them once per session; they are stored ONLY at `/tmp/shopview-creds.env` (chmod 600)
and are gone when the container is reclaimed. Setting the environment variables above removes this step.

**Never** commit a secret value, print it in a log, or place it anywhere under version control.
