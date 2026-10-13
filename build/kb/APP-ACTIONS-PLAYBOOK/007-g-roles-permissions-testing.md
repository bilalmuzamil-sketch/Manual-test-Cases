## G. Roles & permissions testing
- **RESET TO TEMPLATE FIRST (Standing Rule 26/26a):** before ANY permission/role verification on the
  shared org, reset every in-scope role to its template/default so you test spec-defaults, not drift.
  Record pre-reset → reset → post-reset (the diff IS a finding). Path: Settings → Roles & Permissions →
  pencil → Reset to Template → Save. If a role RE-DRIFTS mid-run (concurrent session), reset AGAIN and
  continue (persistently, Rule 26a). Leave roles at template when done. Custom-role reset API:
  `POST /api/roles/{id}` (re-PUT template perms).
- **STAGING ACTION RECIPE: multi-login via Technician role-swap (PREFERRED for any case needing a
  different role/login — Standing Rule 74 multi-login standard, QA lead 2026-08-19):** instead of
  creating a new user, swap the role on the **Technician quick-login user**. Steps: **(1)** don't create
  a user; **(2)** RESET the needed role to template/default and SAVE FIRST — Settings → Roles &
  Permissions → pencil → Reset to Template → Save, or custom-role API `POST /api/roles/{id}` (re-PUT
  template perms) (Rule 26); **(3)** assign that reset role to Tech: `POST /api/staff/6fb22c1b-.../change
  {first_name, last_name, email:'tech@shopview.com', workplace_id:'b3c8c820-...', role_id:<the role>}` →
  201 (EXACT-match email first; invalid `role_id` → 500 no-persist); **(4)** run the test as the Tech
  quick-login user (`POST /api/quick-login {key:'tech'}`), observe live; **(5)** AFTER all testing,
  RESTORE Tech to the **Technician role `131b5274-...`** via the same `/change` call (safety-net
  `staging-restore-tech.mjs`). Re-read the role live before asserting and re-reset if a concurrent actor
  drifts it (Rule 26a). Role-change forces re-auth (409 "Session has expired" → re-login; poll
  fe-permissions). `switch-user` impersonation (below) is the simpler fallback. *Source: CLAUDE.md Rule
  74 multi-login standard + Rule 26/26a.*
- **Impersonate a role holder (SIMPLER live-role fallback):** `POST /api/switch-user {user_id}` (user_id =
  staff `id` from `GET /api/staff?limit=200`, which lists `role_label` per staff). End impersonation with
  a fresh admin `login()`. *Source: CLAUDE.md Rule 14 self-seed playbook.*
- **Create a fresh staff per role (alt):** `POST /api/iam/create {email, firstName, lastName, roleId,
  departments:[...], workplaceId}` → 201 `{user_id}`. On staging a fresh staff needs invite-confirmation
  → PREFER switch-user impersonation.
- **Assign a role to the Tech user (self-service):** `POST /api/staff/{staff_id}/change {first_name,
  last_name, email, workplace_id, role_id}` → 201. **Use Tech `/change` staff_id `6fb22c1b-...`** — the
  staff-LIST id `a7fd0a88-...` **404s on `/change`.** EXACT-match `email==='tech@shopview.com'` before
  changing (never substring). Invalid `role_id` → 500 (does not persist). **NEVER role-swap Tech
  mid-session** → causes the `/no-location` SPA bounce (technique artifact, not a permission result).
  Restore Tech afterward (Technician role `131b5274-...`; safety-net `staging-restore-tech.mjs`).
- **Roles list:** `GET /api/organizations/{org}/roles` (authoritative; `/api/roles` 405s);
  `GET /api/roles/{id}`. 11 system roles, all `default=true`; Office + Time Clock non-editable.
- **Role change forces re-auth:** changing a user's role invalidates the held session → next request
  409 "Session has expired." → re-login; poll fe-permissions until the new set applies (409 is expected).
- **Enforcement model:** backend enforces only resource-level View/Edit; granular perms (Delete, WO
  sub-perms, cross-toggles) are FE-only display gates → **FE-block + BE/API-allow = PASS (Rule 24)**;
  verify denials in the UI (endpoint often returns 400 validation, not 403).

