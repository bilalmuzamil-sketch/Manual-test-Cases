# Schedule build-verification — BATCH C execution log (FINAL batch)

**Batch C = Events · Conflict Detection · Capacity Bars · Deletion/Series scopes/Undo · Keyboard ·
Permissions · Edge Cases/Responsiveness · Working Hours Settings · Cross-Module/Rewrite · API — 68
cases.** All driven LIVE against the staging Schedule module, then written with **64 byte-verified
`update_case` operations** (the 4 Automated cases C38847-C38850 HELD — write nothing, Rule 71).

## Build under test (marker read live at start AND end)
| | |
|---|---|
| App marker at pass **start** (`<meta name="app-version">`) | **`v3.8-da72171`** — last-mod Wed 19 Aug 2026 06:58:40 GMT, etag `7e51cdf10ae9a5b00cba629186fb41d4`, read 2026-08-19T07:46:43Z |
| App marker at pass **end** | **`v3.8-da72171`** — byte-identical (no redeploy under the pass) |
| Relation to batch B | Same as batch B's END marker (`v3.8-da72171`). Same **v3.8** minor = bug-fix deploy (Rule 60 / skill §6.1) — not stale-making. |
| Location | **Staging Heavy Duty - 9919** (`b3c8c820…`, America/Edmonton) — restored; location left unchanged |
| Session | `/tmp/staging-cookie.txt` + `/tmp/cln/cookies.json` (ALIVE; `my-workplaces` 200; `fe-permissions` 200 with `scheduleView`/`scheduleCreateAndEdit`/`scheduleDelete`, `view_mode: full`). `quick-login {key:'tech'}` used ONCE for the Permissions View tier, then admin restored (§6.2 PHPSESSID recapture) — safe, sole worker on staging. |
| Observation date (Rule 54 sentence 2) | **8/19/2026** (live America/Edmonton date during the pass) |

## HOW THE UI RENDERED — boot2 direct-cookie recipe (recreated at `/tmp/schedC/boot.mjs`)
Same recipe batches A/B used: seed `/tmp/cln/cookies.json` cookies + `localStorage.user` (from
`/tmp/seed.json`) + live `fe_permissions_wrapper` + `token`, navigate `/schedule`. Chromium via
`$HTTPS_PROXY` (no MITM bridge). For the Permissions View tier a variant (`/tmp/schedC/bootkey.mjs`)
`quick-login`'d as tech, recaptured the rotated PHPSESSID, and seeded the tech user object. Screen-
observed live: schedule grid (Day/Week/Month), sidebar, mini-calendar, empty-cell context menu, event
modal, conflict pill + dropdown, capacity bars + hover + detail modal, shift detail modal, series-delete
scope dialog, undo toast, dark-mode toggle, responsive panel, and the Administration → Locations
business-hours per-day editor.

## Scope (Rule 38) — batch C C-id set (68, all ours `created_by = 3`, 0 foreign, 4 Automated held)
Sections **4269** Events (7): C30016, C30017, C30018, C30020, C30021, C30022, C30615 · **4270** Conflict
Detection (7): C30023, C30024, C30025, C30027, C30028, C30029, C43798 · **4271** Capacity Bars (5):
C30030, C30031, C30032, C30033, C43810 · **4276** Deletion/Series/Undo (9): C30057, C30058, C30059,
C30060, C30061, C30062, C30064, C30065, C38864 · **4277** Keyboard (3): C30066, C30068, C30070 · **4279**
Permissions (13): C30074, C30075, C30076, C30077, C30078, C30079, C30080, C30081, C30082, C30083, C30084,
C30614, C38926 · **4280** Edge/Responsiveness (10): C30086, C30087, C30088, C30089, C30090, C38865,
C38866, C43585, C43588, C43589 · **5405** Working Hours Settings (5): **C38847, C38848, C38849, C38850
(Automated — HELD)**, C38851 · **5408** Cross-Module/Rewrite (5): C38867, C38868, C38869, C38870, C38871
· **5409** API — Schedule (4): C38872, C38873, C38874, C38875.

`custom_atmstatus` captured live for all 68: **64 = `1` (Not Automated)**, **4 = `3` (Automated —
C38847-C38850, HELD, not written)**. A live re-check confirmed those four are the ONLY `atm=3` in batch C.

## Outcome split (68)
| Outcome | Count |
|---|---|
| **READY** (present + runnable; marker set/kept `AUTOMATION: READY`, Rule-54 sentence 2 re-stamped) | **64** |
| **HELD (Automated `atm=3`, write nothing)** | **4** (C38847, C38848, C38849, C38850) |
| NOT-FOUND / DEFERRED (feature absent) | 0 |
| EXPECT-FAIL (live-backed ticket) | 0 |
| HOLD (feature absent) | 0 |

Per-area live evidence and the honest observation split are in **`C-FINDINGS.md`**; the 4 held cases in
**`C-HELD-AUTOMATED.md`**.

## Writes — 64 × `update_case`, EVERY ONE HTTP 200 + BYTE-VERIFIED PASS
- Per-op log: **`c-write-oplog.jsonl`** (64 rows). Each row: `cid · http · atm (at write) · verify · marker`.
- Each write sent all three text fields; `custom_preconds` + `custom_steps` sent **byte-identical to the
  pre-write snapshot**. On re-GET, `custom_expected` matched the intended payload and `title` /
  `custom_preconds` / `custom_steps` / `custom_atmstatus` were byte-identical (Rule 50 STOP-on-mismatch armed).
- **The testable body of all 64 (title / preconditions / steps / numbered expected behaviour) is
  byte-identical old→new** — only the Rule-54 **sentence 2** (appended *"Last checked against build
  v3.8-da72171 on 8/19/2026."*) and the automation marker changed. The documents-only **sentence 1**
  (sources + 17 August read-dates) was preserved unchanged.
- Marker: all 64 → `AUTOMATION: READY` (lifting the 17-Aug `Not available on Build to test Yet` and
  `HOLD - needs a … sign-in` markers, from live verification — §6.4).
- **0 add / 0 delete / 0 section / 0 run writes / 0 result writes / 0 Jira writes.**

## Post-write census
Exactly one automation marker and one provenance line per written case; every written case carries
`Last checked against build v3.8-da72171 on 8/19/2026`; 0 raw list markup (the writer refuses any case
containing `<`); 0 foreign cases (all `created_by = 3`).

## Run 357 — UNTOUCHED
Only `get_case` + `update_case` calls were made to TestRail (via `tr_client`); `update_case` never alters
run membership, and **zero run/result endpoints were called**, so run 357 ("Schedule - Ayesha",
`include_all=False`) is untouched.

## Environment left clean
- One ZZAUTOTEST event created live (undo test) → **Undone** (board re-read: 0 ZZAUTOTEST events).
- Locations business-hours dialog opened + toggle switched ON to reveal the per-day editor → **closed
  WITHOUT saving** (no location setting changed).
- Dark mode toggled → **restored to light**.
- `quick-login tech` → **restored to admin** (session healthy, 42 perms, all schedule atoms).
- **No role definition or staff record changed; Tech remains on the Technician role.** Location left at
  Heavy Duty 9919.
