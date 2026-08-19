# Schedule build-verification — BATCH A execution log (2026-08-18)

**Batch A = Navigation · Sidebar · Toolbar · Read-display, 61 cases.** All 61 driven LIVE against the
staging Schedule module, then written with 61 byte-verified `update_case` operations.

## Build under test (marker read live at start and confirmed at end)
| | |
|---|---|
| App marker (`<meta name="app-version">`, `app.staging.shopview.com/index.html`) | **`v3.8-bd246fd`** |
| last-modified / etag | Tue, 18 Aug 2026 19:57:31 GMT · `c4dd352f91ecfee192844c6a04a643fc` |
| Location for all observations | **Staging Heavy Duty - 9919** (`b3c8c820…`, America/Edmonton — the standing default) |
| Session | `/tmp/cln/cookies.json` (ALIVE, `GET /api/staff/my-workplaces` → 200); NO quick-login / NO switch-user used |
| Observation date stamped | **8/18/2026** — Edmonton local date of the observation window (the default observation location is `America/Edmonton`, where it was 18 Aug during the run; matches the build's own deploy date and the sibling batches). The app's UTC now-line read 8/19 near midnight; the honest local-of-record date is 8/18. |

## HOW THE UI RENDERED — the boot2 direct-cookie recipe (the prior scoping "UI can't render" conclusion is DISPROVEN)
The SPA rendered fully with **no quick-login and no switch-user** (shared-session safety) using the same
boot2 hydration the Report Suite WIP/IV workers proved: seed the `/tmp/cln/cookies.json` cookies into the
browser context, navigate to `/login`, seed `localStorage.user` (from the cached `/tmp/seed.json` admin
user object) + `localStorage.fe_permissions_wrapper` (from a live `GET /api/auth/me/fe-permissions`, 42
perms, `view_mode: full`) + `localStorage.token`, then navigate to `/schedule`. The Schedule page,
sidebar, mini calendar, grid (Day/Week/Month), toolbar, Filter & display / View options menus, shift
detail modal, tooltips and drill-down were all screen-observed live. Recipe: `/tmp/schedA/boot.mjs`.

## Scope (Rule 38) — batch A C-id set (61, all ours `created_by=3`, 0 foreign, 0 Automated)
29925, 29927, 29928, 29929, 29930, 29931, 29932, 29933, 29934, 29935, 29936, 29937, 29939, 29940,
29941, 29942, 29943, 29944, 29945, 29946, 29947, 29948, 29950, 29951, 29952, 29953, 29954, 30001,
30003, 30004, 30005, 30006, 30034, 30035, 30036, 30037, 30038, 30039, 30040, 30041, 30042, 30043,
30044, 30045, 30046, 30047, 30050, 30051, 30071, 30072, 30073, 43554, 43582, 43583, 43584, 43586,
43587, 43806, 43807, 43812, 43813.
**`custom_atmstatus=3` (Automated / Rule-71 HELD) in this batch: NONE.** (`atm` captured at write time
for every case: 40 were `1` Not-Automated, 21 were `4` Pending — none `3`.)

## Outcome split (61)
| Outcome | Count | Cases |
|---|---|---|
| **READY** (feature present + runnable; marker set/kept `AUTOMATION: READY`) | **57** | see below |
| **NOT AVAILABLE / DEFERRED** (Rule 69 — feature not found in build) | **4** | C29945, C30005, C43812, C43813 |
| EXPECT-FAIL | 0 | — (no live-backed deviation ticket exists; the one deviation is flagged, not ticketed) |
| HOLD | 0 | — (all prior HOLDs were re-verified and lifted; see below) |

### Marker transitions this pass
- **DEFERRED → READY (8):** C29931, C29937, C29939, C29946, C30001, C30034, C43806, C43807 — feature
  observed present and runnable live.
- **HOLD → READY (7):** C43582, C43583, C43584, C43586, C43587 (the panel-collapse toggle — the prior
  HOLD reason *"the panel button does not exist in this build"* is now FALSE: `button_schedule_panel_toggle`
  exists and works), C30044 (My Shifts filters the grid, 160→1→160 lanes), C30004 (shift is
  `fc-event-draggable`; a manual tester can drag — a hold on a runnable case disarms it, skill G10).
- **stayed READY, re-stamped (42):** all other read/display cases confirmed present.
- **plain READY → DEFERRED (1):** C29945 (Priority filter not found — see A-FINDINGS).
- **DEFERRED, date-refreshed + under-dev line added (3):** C30005, C43812, C43813.

## Writes — 61 × `update_case`, EVERY ONE HTTP 200 + BYTE-VERIFIED PASS
- Per-op log: `a-write-oplog.jsonl` (61 rows). **61/61 verify = PASS.**
- Each write sent all three text fields (`custom_preconds`, `custom_steps`, `custom_expected`);
  `custom_preconds` and `custom_steps` sent **unchanged** (byte-identical to the pre-write snapshot),
  only `custom_expected` changed (the Rule-54 provenance sentence-2 + the automation marker). On re-GET:
  `custom_expected` matched the intended payload and every untouched field
  (`title`, `custom_preconds`, `custom_steps`, `refs`, `custom_atmstatus`, `section_id`, `type_id`) was
  byte-identical. **0 mismatches, batch never stopped.**
- **The testable body of all 61 (title / preconditions / steps / numbered expected-behaviour) is
  byte-identical old→new** — only the metadata provenance line and the marker moved (Rule-69/Rule-41
  content-vs-metadata discipline).
- **0 add / 0 delete / 0 section / 0 run writes / 0 result writes / 0 Jira writes.**
- **Run 357** ("Schedule - Ayesha", `include_all=False`, 195 tests, 93P/11F/7B/84U) **PROVEN UNTOUCHED**
  — the writer made only `get_case` + `update_case` calls; `update_case` never alters run membership, and
  zero run/result endpoints were called.

## Post-write live census (all 61 re-read from TestRail)
READY 57 / DEFERRED 4 = 61; **exactly one automation marker and exactly one provenance line per case;
0 stale `8/17/2026` dates; 0 unexpected raw list markup** (C43554/C43806/C43807 legitimately keep their
authored `<p>`/`<hr>`/`<br>` HTML — unchanged in structure).
