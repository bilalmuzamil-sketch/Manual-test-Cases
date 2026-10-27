# Testing helper scripts (reusable harness)

Proven, working scripts for driving ShopView (QA branches, staging, production), Jira and TestRail.
**Reuse them; do not rewrite them each run.** They hold no secrets: each one reads its sign-in from a
file under `/tmp` at runtime. Run them **in place** from this folder (`qa-session.mjs` and the Jira
media checker start their own bridge when needed).

> Method, recipes and rules: [`build/APP-ACTIONS-PLAYBOOK.md`](../APP-ACTIONS-PLAYBOOK.md),
> [`build/TESTING-RUNBOOK.md`](../TESTING-RUNBOOK.md), [`build/JIRA-TICKET-STANDARD.md`](../JIRA-TICKET-STANDARD.md), `CLAUDE.md`.

Last health check: **27 October 2026** — see "Health check" below.

## Sign-in files (never commit these)

| File | What | Lifetime |
| --- | --- | --- |
| `/tmp/qa11685/cookies.json` (or any path you pass) | QA-branch cookies `{sv_sso_session, PHPSESSID, cf_clearance}` for `.qa.shopview.com` | ~24 h, or until a redeploy |
| `/tmp/cln/cookies.json` | Staging cookies, same three names, for `.shopview.com` | ~24 h, or until a redeploy |
| `SV_PROD_PW` env or `/tmp/sv-prod-pw.txt` | Production password (production signs in with credentials, not cookies) | — |
| `/tmp/atlassian/cookies.txt` | Atlassian cookies (Netscape format) for Jira | until signed out |
| `/tmp/testrail/creds.json` | `{ "email", "password" or "key", "host": "https://shopview.testrail.io" }` | — |

A sleeping QA branch is woken with `POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws.com/default/toggleQaEnv
{"action":"wake","env":"svNNNN"}`; it is ready when `https://svNNNNapi.qa.shopview.com/api/health` answers 401.

## Browser and screen

| Script | What it does |
| --- | --- |
| `qa-session.mjs` | **Main harness.** `open({env:'branch'|'prod'|'staging', ticket, cookies, vp, dpr, record, quick})` signs in once and returns a live page plus helpers (`record`, `caption`, `glideClick`, `pointBeside`, `confirm` for the two-step "Are You Sure?" dialogs). `port(dir)` is exported: it checks the local bridge and **starts a fresh one if it is dead**. |
| `staging-bridge.mjs` | Local bridge that lets Chromium reach the internet through the agent proxy. Prints `BRIDGE_LISTENING 127.0.0.1:<port>`. Started automatically by `qa-session.mjs`. |
| `cap_shot.mjs` | `shot(page, path, marks, dpr)` — screenshot plus the exact boxes of the marked elements, for annotation. |
| `jira-page-media-check.mjs` | `node jira-page-media-check.mjs <KEY> <commentId> [out.png]` — opens the Jira comment in a real browser and reports the video player(s) Jira rendered, with a screenshot. Read-only. |
| `staging-boot2.mjs` | Older staging page loader (dev login + local storage). `SV_KEY=tech node staging-boot2.mjs /workorders`. Needs `/tmp/cln/cookies.json`. |
| `staging-api.mjs` | Signed-in request to staging's API (read-only). `node staging-api.mjs GET /api/auth/me/fe-permissions`. |
| `staging-admin.mjs` | Staging admin calls via dev `quick-login` (`login`, `api`, `changeLocation`). |
| `staging-restore-tech.mjs` | `node staging-restore-tech.mjs <roleId>` — puts the Tech user back on its baseline role (**Technician** on shared staging); reset that role to template first (Rule 105). |

## Jira

| Script | What it does |
| --- | --- |
| `jira_post_qa.py` | `python3 jira_post_qa.py <KEY> <comment.txt> <files…> [--expect-build v..] [--build-url https://svNNNN.qa.shopview.com/ --build-cookies <json>] [--prd N] [--edit <commentId>] [--dry]` — the pre-post gate (build marker, ticket state, newest comments), uploads the pictures as real attachments, posts, and reads it back. **Pass `--build-url` for a QA branch**, or it reads staging's build. |
| `jira_edit_comment.py` | `python3 jira_edit_comment.py <KEY> <commentId> <comment.txt>` — update a posted comment in place and read it back. |
| `jira_to_status.py` | `python3 jira_to_status.py <KEY> --label <existing label> [--to Done|Open]` — add a label and walk the workflow. |

Jira search: `/rest/api/2/search` is retired here — use `/rest/api/3/search/jql`.

## Pictures

| Script | What it does |
| --- | --- |
| `ticket_exhibit.py` | Sharp 2× ticket pictures with numbered plain captions (the SV-10804 standard). |
| `qa_exhibits.py` | Annotated QA exhibits: boxes, arrows and captions drawn on the pixels; before/after panels. |

## Screen recordings and voice-over

| Script | What it does |
| --- | --- |
| `finish_recording.py` | `python3 finish_recording.py <video.webm> <startSec> <out.mp4> [--width 1280] [--crf 28]` — trims the login and cuts every still stretch to 1.5 s (2 s at the end). Prints `duration_before_s`, `duration_s`, `idle_removed_s` — record them in the findings doc. |
| `narrate.py` | `python3 narrate.py <script.json> <out_dir> [--voice en-US-AriaNeural] [--rate +0%]` — one MP3 per line; `script.json = [{"id","text"}, …]`. |
| `anchor_mux.py` | Lays each voice line where its caption appears in the film. |
| `idle_cut_voiced.py` | Cuts still pauses out of a voiced film without cutting the voice. |

## TestRail

| Script | What it does |
| --- | --- |
| `testrail-api.mjs` | `get_projects`, `get_case`, `get_cases`, `get_run`, `add_result_for_case`, `raw <endpoint>`. Run with `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`. **No TestRail writes without the QA lead's permission.** |

## Proxy notes (load-bearing)

- Node scripts that go through the agent proxy need `NODE_USE_ENV_PROXY=1` and `NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`.
- `$HTTPS_PROXY` and the bridge port change between containers — never reuse an old port; `qa-session.mjs`'s `port()` handles it.
- Never stop a bridge with `pkill -f` (it can kill your own shell) — find the exact process with `ps` and kill that.

## Health check — 27 October 2026

Every `.mjs` / `.py` file passes a syntax check; Playwright, Pillow, imageio-ffmpeg, numpy, edge-tts and requests are installed.

| Tool | Result |
| --- | --- |
| `qa-session.mjs` (QA branch, production, bridge self-heal) | Works — used live today; bridge killed on purpose and healed by the next run |
| `jira_post_qa.py` | Works — dry run on SV-11669 read the branch build, ticket state and comments |
| `jira-page-media-check.mjs` | **Was broken, fixed** — it was a one-off tied to SV-9828 and a dead bridge port; now takes ticket + comment, starts its own bridge; re-run on SV-9828 found the video player |
| `staging-restore-tech.mjs` | **Was wrong, fixed** — it restored Tech to "Time Clock User", not the agreed "Technician"; now requires the role id |
| `staging-api.mjs` / `staging-admin.mjs` | Not run live (no staging cookies this session); now stop with a plain message instead of a crash when the cookies are missing |
| `testrail-api.mjs` | Works — `get_projects` answered 200 (read-only) |
| `narrate.py` | Works — made a 2.5 s test clip |
| `finish_recording.py` | Works — on a 9.4 s test video with a 6 s still stretch it cut 3.9 s, longest still left 1.5 s |
| `ticket_exhibit.py`, `qa_exhibits.py`, `cap_shot.mjs` | Load cleanly; used for today's SV-11669 / SV-11834 pictures |
| `staging-boot2.mjs`, `anchor_mux.py`, `idle_cut_voiced.py` | Syntax and imports only (need staging cookies / a voiced film to run) |

## Security

**Never commit any file under `/tmp`** — the repo is public. These scripts contain no secret values; keep it that way.
