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
