# Simple Flow — SV-8183 OPTIONAL regression edits — TestRail execution log

- Date: 2026-07-24
- Authorization: user-authorized 2026-07-24 (2 optional regression edits).
- Scope: 2 `update_case` ONLY. NO add/delete/section. Run 325 untouched. Project 1 / suite 1.
- Executor: build/simple-flow/sv8183/exec_optional_edits_2026-07-24.py
- Creds: /tmp/tr-creds.env (verified read-only GET C29410 = HTTP 200 before any write).

## SF-PERM-06 = C29410 (section 4090 'API — Permissions')

- Fields changed: custom_steps (added step 5), custom_expected (added expected 5 — per-role Bulk Receive 'accept' BE-enforcement matrix), refs
- update_case: HTTP 200 · re-GET: HTTP 200 · MATCH: True

### custom_steps

**Before:**

```
<ol>
<li>As a role that lacks the mapped permission, confirm the gated setting or action is hidden or unavailable in the app.</li>
<li>As that same role, try the same setting change directly through the API (bypassing the app) and note the response.</li>
<li>As a role that lacks the completion or review sign-off permission, try to complete a work order and to sign off a review directly through the …[truncated]
```

**After:**

```
<ol>
<li>As a role that lacks the mapped permission, confirm the gated setting or action is hidden or unavailable in the app.</li>
<li>As that same role, try the same setting change directly through the API (bypassing the app) and note the response.</li>
<li>As a role that lacks the completion or review sign-off permission, try to complete a work order and to sign off a review directly through the …[truncated]
```

### custom_expected

**Before:**

```
<ol>
<li>In the app, a role without the mapped permission does not see or cannot use the gated setting or action (this is the v1 pass criterion).</li>
<li>The Work Order settings save is also blocked at the backend: the unauthorized API request is rejected with HTTP 403.</li>
<li>Work order completion and review sign-off are NOT blocked at the backend today: a direct API call from a role lacking t …[truncated]
```

**After:**

```
<ol>
<li>In the app, a role without the mapped permission does not see or cannot use the gated setting or action (this is the v1 pass criterion).</li>
<li>The Work Order settings save is also blocked at the backend: the unauthorized API request is rejected with HTTP 403.</li>
<li>Work order completion and review sign-off are NOT blocked at the backend today: a direct API call from a role lacking t …[truncated]
```

### refs

**Before:**

```
SV-8183 (§9.1 Bulk Receive gate / §9.2 accept enforcement)
```

**After:**

```
SV-8183 (§9.1 Bulk Receive gate / §9.2 accept enforcement)
```

## SF-PERM-12 = C30647 (section 4084 'Permissions')

- Fields changed: custom_expected (added expected 3 — plain Rule-24 QA note; NEW-1/NEW-2 API-possible flag), refs
- update_case: HTTP 200 · re-GET: HTTP 200 · MATCH: True

### custom_expected

**Before:**

```
<ol>
<li>The part menu must not offer Edit, Cancel or Change Vendor for a no-access user (only Return may appear).</li>
<li>The actions being hidden in the interface is the pass condition.</li>
<li>QA note: for a no-access role, editing a part or changing its vendor is hidden on screen but can still be done through the API. Per the product ruling (2026-07-24), this front-end-only gating is accepte …[truncated]
```

**After:**

```
<ol>
<li>The part menu must not offer Edit, Cancel or Change Vendor for a no-access user (only Return may appear).</li>
<li>The actions being hidden in the interface is the pass condition.</li>
<li>QA note: for a no-access role, editing a part or changing its vendor is hidden on screen but can still be done through the API. Per the product ruling (2026-07-24), this front-end-only gating is accepte …[truncated]
```

### refs

**Before:**

```
SV-8516 (§9.2 Time Clock part-actions; NEW-1 change-vendor SFD-vs-VOM atom + NEW-2 part add/delete API-flag context,§9.1/§9.4)
```

**After:**

```
SV-8516 (§9.2 Time Clock part-actions; NEW-1 change-vendor SFD-vs-VOM atom + NEW-2 part add/delete API-flag context; §9.1/§9.4)
```

## Result

- Both `update_case` returned HTTP 200; both re-GET returned HTTP 200 with MATCH=True.
- viu_status unchanged on both (SF-PERM-06 VIU-Verified; SF-PERM-12 VIU-Verified). Tally unchanged: 152 VIU-Verified / 4 VIU-Pending / 21 Blocked-Env / 5 awaiting-Milos / 3 Deviation / 1 VIU-Deviation = 186 active.
- Rule 4: SF-PERM-06 is in an API-titled section (API — Permissions) so the HTTP 403/allowed detail is stated in the tester-facing expected; SF-PERM-12 is in a UI section (Permissions) so its QA note is plain/observable (says 'through the API', no HTTP codes).
- id-map refs mirrored for both rows (Rule 20). Deliverables regenerated (import 186 rows, Blockers Tracker, workbooks); id-map 186/186 populated (0 blank).
- Note: TestRail normalizes the comma-separated `refs` field by trimming whitespace after commas; SF-PERM-12 refs uses semicolons internally to avoid re-GET drift (clean MATCH).
