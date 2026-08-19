# Schedule RE-CHECK vs Stefan V's 2026-08-19 deploy — EXECUTION LOG

**Status: BLOCKED at STEP 0 — staging session dead. 0 TestRail writes, 0 Jira, 0 run writes. NOTHING executed.**

## Build marker (Rule 49/60) — CAPTURED, live
- App: `app.staging.shopview.com`
- `<meta name="app-version">` = **`v3.8-d0e135e`** (the new Stefan deploy; matches the task's expected marker)
- `last-modified`: **Wed, 19 Aug 2026 13:27:07 GMT**
- `etag`: `"aa6ea37f82dd0af1b3fe6da5dfd65573"`
- Read at start AND end of this attempt — **byte-identical both times, no redeploy under the attempt.**
- vs prior batch build `v3.8-bd246fd`: **same minor (v3.8) = bug-fix redeploy (Rule 60), so all Schedule verdicts remain PROVISIONAL** and every layer-1/layer-2 claim needs re-observation.

## THE BLOCKER (Rule 12 / 22 / 36) — fresh cookies required
The cookies supplied in the task's STEP 0 are already **expired/invalid**:
- `GET /api/staff/my-workplaces` (both browser-UA and plain) → **HTTP 401 `{"error":"sso_required"}`**
- `GET /api/auth/me/fe-permissions` → **HTTP 401 `sso_required`**
- `GET /api/schedule/color-labels` → **HTTP 401 `sso_required`**
- `POST /api/quick-login {key:'admin'}` (with browser UA + Origin/Referer) → **HTTP 401 `sso_required`**
  — quick-login is itself session-gated, so it **cannot bootstrap** a dead SSO session.
- Static assets DO load (index.html HTTP 200), so `cf_clearance` is fine — the dead cookie is **`sv_sso_session`**.

**Cause:** Stefan's deploy at 13:27 GMT today expired the staging session (staging cookies die on deploy or ~24h), and the provided `sv_sso_session` is stale. This is the same estate-wide `.qa/.staging.shopview.com` blocker that recurs after every deploy.

**What is needed to unblock:** a fresh live `sv_sso_session` (+ `PHPSESSID`) for `api.staging.shopview.com`, captured after the 13:27 GMT deploy. `cf_clearance` in hand is still valid.

## Why nothing was written this pass
This is a **RE-CHECK-against-the-new-build** pass — its entire premise is live re-verification against `v3.8-d0e135e`. With no live access:
- Part 1 (Stefan-changed labels/verdicts) — needs live UI. BLOCKED.
- Part 2 (re-confirm the 4 defect-sheet items — some may now be fixed) — needs live UI. BLOCKED.
- Part 3 (Priority-filter fix C29945 re-scope / C29942 tweak) — the wording is document-driven (Branko's 2026-08-19 ruling) and decision-ready, BUT the task requires "Verify live: popover shows only Assignment + Status", and Rule 59 requires re-confirming the build marker at write time. Writing now would stamp cases against a build I have not observed and force a re-touch on resume (Rule 41). **Deliberately deferred to the resume, so all edits go in one live-verified pass.**
- Part 4 (permission tiers via Technician role-swap) — needs live + role-swap. BLOCKED.

No inference was substituted for observation (Rule 12).

## READY TO EXECUTE THE MOMENT COOKIES ARRIVE (resume plan)
1. Re-read build marker (start), re-auth, `GET /api/auth/me/fe-permissions` (expect scheduleView/CreateAndEdit/Delete).
2. **Part 1** — map Stefan's changed areas → cases; drive live; correct label drift; re-confirm verdicts; `<br>` re-stamp to `v3.8-d0e135e`. Watch: Month single-line chips/today-circle/+N-more; Day hour-axis; Week today-tint #E9F5FF; dialogs; toolbar "Search schedule…"; sidebar Lucide conflict icon; **SV-9361** WO-number shop-spliced form (e.g. S3-14083) + search both forms; **SV-9357** 90%-zoom edges; event drag to/from dept placeholder skips reassign modal (toast).
3. **Part 2** — re-confirm 4 items → update Schedule_Defects-for-Testers_2026-08-19.md (+ flag .xlsx):
   - C30029 conflict amber-vs-red (Lucide icon added — likely affected).
   - B3 spread "Couldn't read this shop's working hours" (C29979/80/81/82/83/84, C43802, C43804) — spread single-day preview added.
   - SV-8870 Month-view drag does nothing (C43555) — Month view reworked.
   - SV-8957 click-to-arm absent (C29962) — likely still reproduces.
4. **Part 3** — C29945 RE-SCOPE to negative + C29942 TWEAK (exact text in PRIORITY-FILTER-BRANKO-RULING-2026-08-19.md §3/§4); provenance = Branko 2026-08-19 ruling + epic SV-8685 + story SV-8687; Rule-56 divergence (spec v30 §5.1 still lists Priority; latest wins). Verify popover = Assignment + Status only. `AUTOMATION: READY`. (C29946 optional example tidy.)
5. **Part 4 (LAST)** — permission tiers (§4279, 13 cases + related) via Technician role-swap: per role → reset-to-template + save → assign to Tech quick-login user → quick-login {key:'tech'} → observe View/Edit/Delete/nav-off/WO-dependency → RESTORE Technician role to Tech at END. Do NOT create users.
6. Automated (atm=3) — C43811, C38847-38850 + any live-re-read atm=3: verify live, WRITE NOTHING → Schedule-RECHECK-HELD-AUTOMATED.md (Rule 71).
7. `<br>` format (C30133 template), byte/normalization-verify each write (Rule 50), commit+push per sub-batch ≤10 with schedule-recheck-oplog.jsonl. Run 357 UNTOUCHED. 0 Jira. Restore Tech→Technician + location at END.

## Scope reference (read this pass, read-only, no live)
- Group 4254 "Schedule - 2026": 195 cases, all ours (0 foreign), 5 Automated (C43811, C38847-38850) HELD.
- Permission section 4279 "Permissions" = 13 cases (Part 4).
- Spec Confluence v30 CURRENT; epic SV-8685.
