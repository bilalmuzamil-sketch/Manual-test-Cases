# Schedule build-verification — BATCH B execution log (Scheduling CORE)

**Batch B = Drag-to-create · Scope picker · Multi-day spread · Shift lifecycle · Reassignment, 66 cases.**

## STATUS: BLOCKED at pass-start on LIVE STAGING ACCESS — 0 TestRail writes, 0 Jira writes.

This is a **FRESH container** started 2026-08-19 (~06:30 UTC). The prior batch-B worker died having
done no work; nothing to resume from them. This log records the fresh start, the exact scope, and the
one blocker that stops live verification.

## Build under test (marker read live at pass start)
| | |
|---|---|
| App marker (`<meta name="app-version">`, `app.staging.shopview.com/index.html`) | **`v3.8-bd246fd`** — reachable through the proxy, HTTP 200 |
| Matches | the SCHEDULE-PLAN.md / A-EXECUTION.md marker exactly — the build has **NOT** moved |
| Read at | 2026-08-19 (~00:40 MDT / ~06:40 UTC) |

**The build is reachable and unchanged. The blocker is authentication, not the build.**

## 🛑 THE BLOCKER — no live staging session, and one cannot be minted here
The batch-B live render path was **replicated in full and it genuinely fails at authentication** (so
this is NOT a "0 writes on a UI block without replicating it" report — the path was driven to the auth
wall):

| Step attempted | Result |
|---|---|
| Probe `/tmp/staging-cookie.txt` | **absent** (ephemeral `/tmp`; the batch-A file is gone with its container) |
| Probe `/tmp/cln/cookies.json` | **absent** (same) |
| Best available cookies (`/tmp/_ck.txt`, `/tmp/rs-cookie.txt`, both 2026-08-04, ~15 days old) → `GET https://api.staging.shopview.com/api/staff/my-workplaces` | **HTTP 401** |
| Fallback `POST https://api.staging.shopview.com/api/quick-login {"key":"admin"}` (with old cookie, and with no cookie) | **HTTP 401** `{"error":"sso_required","sso_redirect_url":"https://auth.staging.shopview.com/login?..."}` |

`quick-login` is itself SSO-gated: without a valid `sv_sso_session` it 401s, so it cannot bootstrap a
session from nothing. No file anywhere in `/tmp` newer than 2026-08-10 contains a staging cookie
(swept: `find -newermt`, `grep sv_sso_session`). `/tmp/seed.json` (the `localStorage.user` object,
2026-08-10) survives but is useless without live cookies.

**WHAT IS NEEDED (from the user, via the coordinator):** fresh `.staging.shopview.com` session cookies
— **`sv_sso_session` + `PHPSESSID` + `cf_clearance`** — dropped into **`/tmp/staging-cookie.txt`**
(header form) or **`/tmp/cln/cookies.json`** (json form). These are mintable only by the user through
`auth.staging.shopview.com/login` (Rule 22 access ask; Rule 36 outstanding item).

**Why no work proceeds without them (Rule 12 / skill 03 §7.1):** batch B is the drag/scope/spread/shift
cluster — its verdicts require driving the SPA and the `/api/schedule/*` endpoints live. Setting or
lifting any automation marker from anything other than **live observation** is forbidden (skill 03 §6.4
corollary / Rule 69): a metadata-only TestRail write here would disarm the cases, so **nothing is
written to TestRail** until a live session exists.

## Scope (Rule 38) — batch B C-id set (66, all ours `created_by=3`, 0 foreign) — read-only from TestRail
Confirmed live via `tr_client.get_cases` per section (project 1 / suite 1), 2026-08-19:

| Section | Name | # | C-ids |
|---|---|---|---|
| 4260 | Drag-and-Drop Scheduling | 11 | 29955, 29956, 29957, 29958, 29959, 29960, 29961, 29962, 43555, 43796, 43797 |
| 4261 | Scope Picker | 4 | 29963, 29964, 29965, 29967 |
| 4262 | Shift Start Times and Unassigned Shifts | 11 | 29969, 29970, 29971, 29972, 29973, 29974, 29975, 43795, 43799, 43800, 43801 |
| 4263 | Multi-Day Spread Scheduling | 14 | 29978, 29979, 29980, 29981, 29982, 29983, 29984, 29985, 29986, 38863, 43802, 43803, 43804, 43805 |
| 4264 | Linked Series and Banners | 4 | 29987, 29988, 29989, 29990 |
| 4265 | Shift Block Anatomy | 3 | 29991, 29992, 29995 |
| 4266 | Overlap and Lane Stacking | 4 | 29996, 29997, 29998, 29999 |
| 4268 | Shift Detail Modal | 10 | 30008, 30009, 30010, 30011, 30012, 30013, 30014, 30015, 43808, 43809 |
| 4275 | Reassignment and Context Menu | 5 | 30052, 30054, 38855, 43556, **43811** |

**66 total.** `custom_atmstatus`: **65 × Not-Automated (1) · 1 × Automated (3)**. **0 foreign.**

### Automated — HELD (Rule 71, ask-first) — see B-HELD-AUTOMATED.md
- **C43811** (Reassignment and Context Menu, §4275) — the only `atm=3` in batch B; Vlad's automation
  contract. Verify live (once access lands), record the intended change, **ask the QA lead before any
  edit**, edit only coupled with build-verification, then hand to Vlad. **No other atm=3 in batch B.**

## HOW TO RESUME (instant, once cookies land)
1. Drop fresh staging cookies into `/tmp/staging-cookie.txt` (or `/tmp/cln/cookies.json`); confirm
   `GET /api/staff/my-workplaces` → 200. Default location **Staging Heavy Duty - 9919** (`b3c8c820…`).
2. Re-read the build marker (start + end); if still `v3.8-bd246fd`, batch A's boot2 recipe applies
   verbatim (A-EXECUTION.md §"HOW THE UI RENDERED": seed cookies → navigate `/login` → seed
   `localStorage.user` from `/tmp/seed.json` + `fe_permissions_wrapper` from live
   `GET /api/auth/me/fe-permissions` + `token` → navigate `/schedule`). No quick-login/switch-user
   while a sibling is live.
3. Seed ZZAUTOTEST schedulable WOs (WO + approved line) per Rules 5/14; board API
   `GET /api/schedule/board`; discover create/scope/spread endpoints by probing (empty body →
   validation error). Clean up after.
4. Walk the 66 cases (five runnability checks); drag cases — try SPA fullcalendar handles AND the
   underlying POST; honest N-of-M for un-driveable gestures (present-but-undriveable stays READY with
   the limit noted — do NOT fake, do NOT falsely defer a BUILT feature).
5. Checkpoint per ≤10 cases to `b-write-oplog.jsonl`; byte-verify every `update_case` (Rule 50).

## Writes this session
**0 TestRail writes · 0 Jira writes · 0 run writes.** Run 357 (Schedule, Ayesha's) untouched — no
run/result endpoint was called. Only read-only `tr_client.get_cases` (scope enumeration) and read-only
staging HTTP probes (auth wall) were performed.
