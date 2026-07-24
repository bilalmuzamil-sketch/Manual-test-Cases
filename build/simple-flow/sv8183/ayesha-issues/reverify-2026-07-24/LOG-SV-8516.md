# SV-8516 — LIVE re-verification log (2026-07-24)

Issue (Ayesha, ticket Done + Staging_Verified): a Time Clock user could edit part details, cancel a part,
cancel an order, return a part, and change vendor (should have NO access; Production blocks it). Dev
(Sasha): "Users require WOL -> Create & Edit to manage part requests." Ayesha follow-up 2026-07-23:
edit now blocked, but return / cancel-return / resolve-cores still work (folded into SV-8541).

## Env / role / state
- app/api.staging.shopview.com, org d55bc308, workplace Heavy Duty 9919 (b3c8c820).
- Role vehicle: Time Clock User e35b0211 (template = ONLY scheduleView, timesheetsView, workOrdersView).
  Impersonated via POST /api/switch-user on confirmed test acct henry.hess (restored to Technician after).
- Drift RULED OUT (Rule 26): Time Clock live = 3/3 == template, CLEAN, before & after. Reproduced on clean role.

## Live observations (evidence in folder)
1. FE (the fix): Time Clock part-row ⋮ menu now shows ONLY "Return" — NO "Edit" / "Cancel" / "Change Vendor"
   part-action items (sv8516-tc-menus.json: MENU=["Return"]; keywords Cancel/Change Vendor = false). So the
   original over-grant's EDIT/CANCEL/CHANGE-VENDOR controls have been REMOVED from the Time Clock UI = the
   Done/Staging_Verified fix holds at the front end.
2. BE (the gap the fix did NOT close): Time Clock (CONFIRMED 3 perms live) can STILL edit a part via the API:
   POST /api/work-orders/part/change-request {id,line,work_order,description:'...',quantity,part_source_type,
   part_category_id,cost} -> HTTP 200 and the change PERSISTED (re-GET showed the new description). Same as Admin.
   => The SV-8516 fix is FRONT-END ONLY; the backend does not enforce the WOL C&E permission on part edit.
3. Edit of an already-RECEIVED part is blocked by STATE ("Part requests can't be modified once received"),
   not by permission — for Admin and Time Clock alike.

## VERDICT
- ORIGINAL bug (Time Clock could edit/cancel/return/change-vendor in the UI) = was REAL, now FIXED at the FE
  (edit/cancel/change-vendor controls removed from the Time Clock menu). Ayesha's Staging_Verified stands for the UI.
- HONEST CORRECTION / residual: the fix is FE-ONLY. The backend still lets a Time Clock user edit part details
  via the API (change-request -> 200, persisted). Per Standing Rule 24 (FE-restricted-but-API-possible is NOT a
  bug for now) this is FLAGGED: "It can still be done through the API." It is NOT a UI regression and should not
  re-open the ticket unless PO/dev decides BE enforcement is required (same enforcement-model theme as SV-8541).
- Residual return / cancel-return / resolve-cores for Time Clock = confirmed still present (UI + BE) and is
  tracked under SV-8541 (see LOG-SV-8541: pre-resolve-cores -> 201 even for Time Clock).

## Spec wording deviated from (Rule 25)
- requirements.md §9.2: Time Clock = "No" across EVERY column (no access). Time Clock editing a part contradicts this.
- requirements.md §9.1 (Sasha's mapping, SV-8516 comment): part-request management (make/edit/cancel) maps to
  "WO Lines: Create & Edit". Time Clock lacks it, so BE should block edit — it does not (FE only).
- §9.4 caveat applies: the BE atom-collapse means the FE gate is "a convenience, not a BE-enforceable boundary" —
  which is exactly why the BE still permits the edit. So the residual BE-possibility is spec-anticipated (flag, per Rule 24).

## Our cases that missed it / coverage gap
- No dedicated Time-Clock (or any no-access role) part-EDIT/cancel/return negative exists in our suite.
  Nearest: SF-PERM-09 / C29413 (cases/view/29413, financial part-add gate) and SF-PERM-10 / C29414
  (cases/view/29414, per-role COMPLETION matrix only). GAP: our SF-PERM matrix covers completion/bulk-receive/
  review, not per-role part edit/cancel/return gating.
- Follow-up (needs user OK): add an SF-PERM negative for a no-access role (Time Clock) on part actions, asserting
  the UI hides Edit/Cancel/Change-Vendor (passes) AND flagging that the API still permits edit (Rule 24). refs:
  SV-8516 / SV-8183 (§9.2 Time Clock row; §9.1 part-request->WOL C&E; §9.4 atom-collapse).

## Process honesty note
An interim edit-save test accidentally ran while the impersonation vehicle (henry) had already been restored to
Technician (6 perms, which legitimately holds WOL C&E) — that 200 was NOT a Time Clock result and was discarded.
The test was re-run with henry re-assigned to Time Clock and CONFIRMED at 3 perms live before the edit-save; only
that confirmed-3-perms result (200, persisted) is reported above. Part description and henry's role were restored.
