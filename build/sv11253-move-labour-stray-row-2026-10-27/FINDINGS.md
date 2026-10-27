# SV-11253 — Move labour to line hands a claimed row back as a stray unassigned row (27 Oct 2026)

Mode: **API** (QA lead chose "API (faster)"). No recording, no technical section. Labels/QA assignee checked: no `accounting`
label, QA Assignee empty → no confirmation needed.
Branch `sv11253`: front end `v26.43.1-baa44e3` (index last-modified Mon 26 Oct 2026 16:51:59 GMT, etag `94fe3ef1…`).
Sources: ticket description (no comments, no developer test plan); found in PR #3619 review; Chris: Low, for later (SV-11087 78583).

## Status: BLOCKED on the branch, before captured on production

### Branch blocker (sv11253)
- The "Move labor" item is in the LINE's right-click menu (`menu-item_move_labor`). It shows only when the role has
  `woMoveLabor`. On sv11253 the admin does not have it, and **no role can**: the branch permission catalogue
  (`GET /api/fe-permissions`) has **59** permissions, staging and production have **61**. Missing on the branch:
  `woMoveLabor`, `woReceivedLater` (sv11565 is the same).
- Admin role reset to template: already at template (save stayed disabled). Turning the **Move labor** toggle on and saving
  (Edit Anyway + Confirm) → `PUT /api/roles/{id}` 200 but the permission is not stored.
- The dialog's own request `POST /api/work-orders/tasks/move` → **403 "Access denied."**
- So the ticket's step 2 cannot be performed on sv11253 by any route. Needs the developer to add the permission to the branch.

### Branch steps done so far (work order S11253-17580, f1f0a862-…)
1. Tech ShopView pressed Start on line 1 ("Service - Full grease service") → claimed the empty row (check-in 201), then
   Stop with story → 0.12 h.
2. Admin: Edit labor on line 2 ("Service - PDI") → David Combs (Amanda Williams refused: "not available in this shop").
3. Move labor: blocked (above).

### Production before (app.shopview.com, work order S2-1763, location Trucks Hill 2) — bug reproduced, all on screen
1. Start on line 1 → row claimed for Bilal Muzammil; Stop with story (0.03 h).
2. Edit labor on line 2 → Ayesha Test.
3. Right-click line 1 → Move labor → Technician Bilal - Muzammil, Target line = line 2 → Move to line (201).
   Line 1 then shows an empty Unassigned row; line 2: Bilal Muzammil 0.03 h + Ayesha Test.
4. Timesheets → edit Bilal's entry → Line = 3 "EMpty LIne" → Save → *Confirm Overwrite* (the admin has an old open entry
   S2500-137, Aug 28 – Oct 30, which gets split; test org data) → Confirm → change 201 + move 201.
5. **Line 2 now shows an extra empty row, drawn on screen as "Deleted user", above Ayesha Test** (API: first_name
   "Unassigned", tech_exists false, 0.00 h). This is the stray row the ticket describes. Picture: `ev/prod-7-stray-row.png`.

Test data left: branch S11253-17580; production S2-1763 (no clean-up per standing ruling). Production split of the admin's
S2500-137 open entry (Confirm Overwrite) — test org.

## Learning check
- Playbook §AT addendum: Move labour to line path + the missing-permission check. Lessons index row added.

## 27 Oct follow-up — Rule 114 check, then BLOCKED (comment 79547)
- The QA lead switched **Move labor** on for the Admin role (`73f72525-…`). Re-read on a fresh load: **off**. I switched it on,
  saved (Edit Anyway → Confirm): `PUT /api/roles/{id}` 200, the payload carries 57 permission ids (none for Move labor),
  reopen → **off** (`ev/branch-0-role-movelabor.png`, `ev/branch-0b-role-movelabor-on.png`). The line menu on S11253-17580
  still has no Move labor item (`ev/branch-1-context-menu.png`).
- QA lead's video (`/tmp`, uploaded to Jira as SV-11253-Move-labor-does-not-stay-on.webm; frame grid `ev/lead/grid.png`):
  same on Admin and on a brand-new role.
- Posted comment **79547** tagging Slavcho Mitrov with the video; ticket moved TESTING QA → **Blocked**. Read back: 5 steps,
  1 video (1280×720), mention resolved.

## 27 Oct — Slavcho's answer (79552)
"This is the QA environment, not this branch. Move labor has been its own permission since SV-8911. Production got it from
a one-off set of console commands, which the QA database template never ran. So on sv11253 the permission doesn't exist:
the toggle saves without an error, but there's nothing to store, and it reads back off. I've asked for the commands to be
run on sv11253. Once they have been, log out and back in (permissions load at login), switch Move labor on for Admin, and
the test can continue."
- Confirms the catalogue finding (59 vs 61). No reply posted (nothing to ask). Next: once the commands run — check
  `GET /api/fe-permissions` includes `woMoveLabor`, fresh login, switch Move labor on for Admin, re-read the role, then run
  the move → timesheet move → stray-row check on S11253-17580 + the variants. Blocked now on (1) the commands and (2) fresh
  `.qa.shopview.com` cookies (sso_required since ~08:38 UTC).

## 27 Oct — RETEST after Slavcho set up Move labor (79558) → PASSED, comment 79561
Fresh cookies; branch `v26.43.1-baa44e3` (index last-modified Mon 26 Oct 2026 16:51:59 GMT, etag `94fe3ef1…`) unchanged at
start and at the pre-post gate. Catalogue now 61 incl. `woMoveLabor`; Admin `fe_permissions` includes it; the line menu shows
`menu-item_move_labor`. Ticket re-read before testing: Blocked, last comment 79558. Source = ticket description (no
developer test plan). Each variant on a fresh work order (3 canned lines, each with an empty Unassigned row); Start/Stop
driven on screen as Tech ShopView (quick-login tech); Edit labor / Move labor / timesheet edit driven on screen as Admin.

| V | Work order | Steps | Line under check, end state | Verdict |
|---|---|---|---|---|
| V1 | S11253-17581 | Tech Start/Stop on L1 (claims empty row) → Edit labor L2 = David Combs → Move labor L1→L2 → timesheet move Tech L2→L3 | L2: Tech ShopView 0.00 h, David Combs — no empty row | PASS |
| V1b | S11253-17581 | then Tech Start/Stop on L2; then Admin Start/Stop on L2 | Tech reused his row (0.01 h); Admin got his own new row; no stray row claimed | PASS |
| V2 | S11253-17582 | claim L1 → Move L1→L2 (L2 had only its own empty row, which the move absorbed) → timesheet move L2→L3 → Admin clocks in on L2 | L2: Tech ShopView 0.00 h (+ Admin's own row) — no empty row | PASS |
| V3 | S11253-17583 | claim L1 → Edit labor adds David on L1 → Move BOTH (multi-select) L1→L2 → timesheet move Tech L2→L3 → Admin clocks in on L2 | L2: David Combs, Admin ShopView, Tech ShopView 0.00 h — no empty row | PASS |
| V4 | S11253-17584 | claim L1, NOT moved → timesheet move Tech L1→L3 | L1 gets its empty Unassigned row back (SV-11087 hand-back unchanged) | PASS |
| V5 | S11253-17585 | Tech picked on purpose (Edit labor) on L1 → Start/Stop → Edit labor L2 = David → Move L1→L2 → timesheet move L2→L3 | L2: David Combs, Tech ShopView 0.00 h — identical to V1 (the ticket's "like Edit Line") | PASS |
| V6 | S11253-17586 | V1 repeated (second specimen, 2x capture) | L2: Tech ShopView 0.00 h, David Combs | PASS |

Production before, re-captured 27 Oct at 2x (app.shopview.com `v26.43.2-537378f`, S2-1763): line 2 = "Deleted user" (API:
Unassigned, tech_exists false) + Ayesha Test.
Bundle check: the only screen action that moves labour rows between lines is `work-orders/tasks/move` (Move To Line, one or
several technicians) — both driven. Whether the server routes a multi-technician move through `changeLineId()` or
`updateMultipleTaskByLineId()` cannot be seen from the screen; both screen paths behave correctly.
Exhibits: ev/01-before-after-stray-row.png (prod vs V6), ev/02-other-variants.png (V3/V4/V5). Comment **79561** posted (no
recording, no technical section — QA lead's choice), read back: PASSED panel first, 2 attachments 1040×718 / 1040×1056 in
order, 6 check rows, 7 steps. Pre-post gate: branch build re-read (gate gained `--build-url` — it had read staging's marker),
ticket re-read (Blocked, 79558 last), PRD unchanged, voice scan clean. Ticket status left as is (Blocked) for the QA lead.
Learning check: playbook §AT addendum (multi-select technician pick by typing; timesheet editor path; timesheet create /
clock-out payloads; gate --build-url).
