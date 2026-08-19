# Schedule build-verification — BATCH B execution log (Scheduling CORE)

**Batch B = Drag-to-create · Scope picker · Shift start times / Unassigned · Multi-day spread ·
Linked series · Shift block anatomy · Overlap / lane stacking · Shift detail modal · Reassignment /
context menu — 66 cases.** All driven LIVE against the staging Schedule module, then written with
65 byte-verified `update_case` operations (C43811 held — Automated).

> **STATUS: DONE.** The pass-start BLOCKED note that stood here (a prior fresh-container worker that
> could not mint a session) is **superseded** — the fresh cookies supplied for this run authenticate
> (`GET /api/staff/my-workplaces` → HTTP 200, real data), so live verification proceeded normally.

## Build under test (marker read live at start AND end)
| | |
|---|---|
| App marker at pass **start** (`<meta name="app-version">`, `app.staging.shopview.com/index.html`) | **`v3.8-bd246fd`** — last-modified Tue 18 Aug 2026 19:57:31 GMT, etag `c4dd352f91ecfee192844c6a04a643fc` |
| App marker at pass **end** | **`v3.8-da72171`** — last-modified Wed 19 Aug 2026 06:58:40 GMT, etag `7e51cdf10ae9a5b00cba629186fb41d4` |
| Marker moved during the pass? | **YES — `v3.8-bd246fd` → `v3.8-da72171`.** Same **v3.8** minor = a **bug-fix deploy** (Standing Rule 60 / skill `03` §6.1): *a same-minor redeploy does NOT make a prior pass stale; the re-check trigger is a specific observed contradiction, never a changed version string.* Every case was observed on **`v3.8-bd246fd`**, and its Rule-54 sentence-2 honestly names that build. No case was re-observed on `v3.8-da72171`. |
| Location for all observations | **Staging Heavy Duty - 9919** (`b3c8c820-f815-4cf1-8938-10956c5ee71a`, America/Edmonton — the standing default; restored — location was never changed) |
| Session | `/tmp/staging-cookie.txt` + `/tmp/cln/cookies.json` (ALIVE; `my-workplaces` 200; `fe-permissions` 200 with `scheduleView` · `scheduleCreateAndEdit` · `scheduleDelete`, `view_mode: full`). **NO quick-login / NO switch-user** (sibling-worker safety; batch C runs next). |
| Observation date stamped (Rule 54 sentence 2) | **8/19/2026** — the live America/Edmonton date during the observation+write window (00:40–01:40 MDT on 19 Aug). |

## HOW THE UI RENDERED — boot2 direct-cookie recipe (no quick-login), recreated after the container reset
`/tmp/schedA/boot.mjs` from batch A was gone (ephemeral `/tmp`). Recreated as `/tmp/schedB/boot.mjs`,
same recipe: seed `/tmp/cln/cookies.json` cookies into the Chromium context, `POST
/api/iam/change-location` to Heavy Duty 9919, navigate `/login`, seed `localStorage.user` (from the
cached `/tmp/seed.json` admin user object) + `localStorage.fe_permissions_wrapper` (from a live `GET
/api/auth/me/fe-permissions`, 42 perms) + `localStorage.token`, then navigate `/schedule`. Chromium
went straight through `$HTTPS_PROXY` (no MITM bridge needed this run). The Schedule page, sidebar,
mini-calendar, grid (Day / Week / Month), toolbar, empty-cell context menu, drag-to-create scope
picker, multi-day spread surface, shift detail modal, series blocks, conflict blocks, lane stacking
and tooltips were all screen-observed live.

## Scope (Rule 38) — batch B C-id set (66, all ours `created_by = 3`, 0 foreign, 1 Automated held)
Sections **4260** Drag-and-Drop (11) · **4261** Scope Picker (4) · **4262** Shift Start Times and
Unassigned (11) · **4263** Multi-Day Spread (14) · **4264** Linked Series and Banners (4) · **4265**
Shift Block Anatomy (3) · **4266** Overlap and Lane Stacking (4) · **4268** Shift Detail Modal (10) ·
**4275** Reassignment and Context Menu (5).

`custom_atmstatus` captured at write time for all 66: **65 were `1` (Not Automated)** and **1 was `3`
(Automated) — C43811, HELD, not written** (Rule 71 / skill §6.4 — see `B-HELD-AUTOMATED.md`). A live
re-check confirmed C43811 is the ONLY `atm=3` case in batch B.

## Outcome split (66)
| Outcome | Count | Notes |
|---|---|---|
| **READY** (feature present + runnable on the build; marker set/kept `AUTOMATION: READY`) | **65** | every one observed live; see `B-FINDINGS.md` for the honest N-of-M on the drag-gesture and spread-hours limits |
| **NOT AVAILABLE / DEFERRED** (Rule 69 — feature not found in build) | **0** | every feature area rendered; no case is "not built" |
| **EXPECT-FAIL** | **0** | the one EXPECT-FAIL marker (C29962 → SV-8957) lost its backing — **SV-8957 is OBSOLETE** — so per §15.1 the marker came off (plain READY); flagged in `B-FINDINGS.md` |
| **HOLD** | **0** | the 7 prior HOLDs were all re-verified runnable and lifted (§15.1a — a HOLD on a runnable case disarms it) |
| **HELD (Automated, not written)** | **1** | C43811 (`atm=3`) — verified live, not edited |

### Marker transitions this pass (65 written)
- **`Not available on Build to test Yet` → READY (25):** C29955, C29958, C29971, C29973, C29974,
  C29975, C29979, C29980, C29981, C30008, C30009, C30010, C30054, C43795, C43796, C43797, C43799,
  C43800, C43801, C43802, C43803, C43804, C43805, C43808, C43809 — feature observed present + runnable.
- **`HOLD` → READY (7):** C29967 (Choose-lines multi-select observed), C29982, C29983, C29984, C29985
  (spread surface present + series creation proven on the board), C30013 (Add Note control present),
  C43555 (Month-view drag runnable — its open-PO note is preserved in the provenance sentence 1).
- **`READY - EXPECT FAIL (SV-8957)` → READY (1):** C29962 — **SV-8957 is OBSOLETE** (read live via
  Jira), so the marker has no live backing (§15.1). Click-to-arm is genuinely absent; the tester runs
  the case and records the result. Flagged in `B-FINDINGS.md`.
- **stayed READY, re-stamped (32):** all other cases confirmed present + runnable.

## Writes — 65 × `update_case`, EVERY ONE HTTP 200 + BYTE-VERIFIED PASS
- Per-op log: `b-write-oplog.jsonl` (65 rows). **65/65 verify = PASS, 0 FAIL, 0 mismatch — the batch
  never stopped.**
- Each write sent all three text fields (`custom_preconds`, `custom_steps`, `custom_expected`);
  `custom_preconds` and `custom_steps` sent **byte-identical to the pre-write snapshot**. On re-GET,
  `custom_expected` matched the intended payload and every untouched field (`title`,
  `custom_preconds`, `custom_steps`, `custom_atmstatus`) was byte-identical.
- **The testable body of all 65 (title / preconditions / steps / numbered expected-behaviour) is
  byte-identical old→new** — only the metadata provenance line (Rule-54 **sentence 2** appended:
  *"Last checked against build v3.8-bd246fd on 8/19/2026."*) and the automation marker moved. The
  documents-only **sentence 1** (sources + 17 August read-dates) was preserved unchanged.
- **0 add / 0 delete / 0 section / 0 run writes / 0 result writes / 0 Jira writes.**

## Post-write live census (all 66 re-read from TestRail)
**65 `AUTOMATION: READY` + 1 (none, C43811 HELD) = 66; exactly one automation marker and exactly one
provenance line per written case; every written case carries `Last checked against build v3.8-bd246fd
on 8/19/2026`; 0 raw list markup; 0 duplicate provenance lines; 0 foreign cases (`created_by != 3`).**

## Run 357 — PROVEN UNTOUCHED
Run 357 ("Schedule - Ayesha", `include_all=False`) read live after the pass: **93 Passed / 11 Failed
/ 7 Blocked / 84 Untested = 195 tests — identical to the batch-A snapshot.** The writer made only
`update_case` + `get_case` calls; `update_case` never alters run membership, and **zero run/result
endpoints were called**, so no result and no membership could move. `refs`/titles were not changed, so
the `case_refs`/`case_title` read-time echoes on results did not move either.

## Environment left clean
One shift created live to confirm C29955 (single-line drop → immediate shift) was **deleted**
(`DELETE /api/schedule/shifts/{id}` → HTTP 204; board re-read → 0 remaining for that WO). Every scope
picker / spread dialog opened during observation was **Cancelled** (button `button_drop_cancel`) — no
other shift, series, event or role was created or changed. Location left at Heavy Duty 9919.
