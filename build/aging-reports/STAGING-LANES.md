# A/R and A/P aging — STAGING pass with parallel workers (plan, 12 Nov 2026)

QA lead 12 Nov: "we might need to use multiple workers as we are short of time, but again we need to do it safely so that the workers do not
interrupt each other's tasks and testing and do not waste more time." Chosen scope: the staging pass (Rule 126), starting with the tests that
can only be judged off the QA site.

## Gate before any lane starts — and before ANY ask for a staging sign-in or run (QA lead 12 Nov: not until the feature is on staging)
1. Staging sign-in works (`staging-boot.mjs`, `/tmp/shopview/staging.env`, chmod 600 — never committed).
2. Staging carries this release: A/R Aging Summary shows the "Past due:" chip and the "info_outline" description icon (QA build v26.45.3-34788b2 shows both). If not, STOP — nothing to run yet.
3. A staging run exists in TestRail (copy of run 557's cases; creating it needs his go-ahead, Rule 6).

## Lanes — one sign-in each, never shared
| Lane | Sign-in | Owns | Never touches |
|---|---|---|---|
| A | staging user 1 (Admin) | A/R Summary, A/R Detail, A/R Collection + every location-switch test (switching changes only this user) + the offline/server-error tests | A/P data, roles |
| B | staging user 2 — a DIFFERENT person given the Admin role at lane start (never the same user as A: a second sign-in as the same user ends the first, L0634) | A/P Summary, A/P Detail, A/P Unpaid + all PDF tests (staging allows 120 s) + permission tests (only lane B's own test staff and roles) | the Admin role, A/R data |
| C | production test account (read-only) | before/after comparisons for "as before the release" tests | anything on staging |

## Safety mechanics
- **One runner per lane at a time.** Each lane has its own queue file `stg/<lane>/queue.sh`; a lane's runner waits on `pgrep -f "STG_LANE=<lane>"` only, so lanes never wait on or kill each other. Never start a second copy (L0690).
- **Own folders and data.** Output `exec/stg/<lane>/…`; seeded records tagged `ZZS<lane>` (A: ZZSA, B: ZZSB) so no lane reads another's data. No deletes of any record a lane did not create.
- **Only the coordinator writes to TestRail and Jira.** Lanes write `RESULTS-stg-<lane>-*.json`; the coordinator runs the Rule 140 gate, then posts with `push_results_to_run.py` one batch at a time (no duplicate results, L0669). No Jira from any lane.
- **Every result names the build marker read that morning** (L0688) and every message carries the ticket link and the run link (Rule 141).
- **Bridge and sign-ins are refreshed per step** (`ensure_bridge.sh`); a container restart is recovered by the coordinator, not by the lanes.

## First items for the lanes (QA site could not judge them)
- Lane A: C1062582, C1062583, C715442, C715443, C715633–C715638 (load-error messages offline — staging has no "Environment Sleeping" handler).
- Lane B: C715469 (2,000-line PDF), C715475 (Inventory Value PDF) — SV-12539 asks for exactly this retest on staging.
- Then the full suite split A/R → A, A/P → B, comparisons → C (Rule 101: full, not a delta).
