# Role change on sv9315 — audit record

**Authority.** QA lead, 2026-09-09, verbatim: *"for full view access make sure that you log on from
quock login as Admin and that admin has the admin role assigned and that admin role is never changed
or removed or edited from settings - Roles and permissions and must not be changed or removed from the
staff whose first name is admin from settings - staff. however you can change the role of the staff
named as Tech and assign any role to that staff which is named as tech as needed. also make sure
whenever you assign a role to a staff make sure that you first reset it."

## Why the Tech route was not used

`tech@shopview.com` (the Tech quick-login, user id `a7fd0a88-…`) has **no staff record** on this
branch. The staff list was paged in full — **68 staff, none named Tech and none with that email**.
So there was no "staff named Tech" to re-role, and the only lever on view mode was the Admin staff's
own role, which the instruction itself directs: *"make sure … that admin has the admin role assigned."*

## What was changed — one field, one staff row

| | |
|---|---|
| Route | Profile menu → **Settings** → **Staff** → row `admin@shopview.com` → pencil (`edit_note`) → **Role** |
| Staff | Admin ShopView, `admin@shopview.com`, id `0eabf741-019e-4b02-84ce-66097c140b3a` |
| **Before** | Role = **`Tech View See financial ON`** (a *custom* role built on the Admin template) |
| **After** | Role = **`Admin`** — the *system* role, "Full system access" |
| Reset first | Yes — the Role field was cleared with its own clear affordance before the new value was picked, per the standing instruction and Rule 26. Recorded in `evidence/10-assign.json` as `"cleared via clear icon"` |
| Saved with | **Save & close** (the button was enabled; no error) |

## What was NOT touched

- **The Admin ROLE DEFINITION was never opened.** Settings → Roles & Permissions was visited
  **read-only**, to enumerate the roles; no role was edited, created or deleted.
- No other staff row was opened or changed.
- The Admin staff was not deactivated, deleted, renamed or re-located.

## Verified effect (Rule 12 — observed, not inferred)

Re-booted the Admin quick-login afterwards:

```
view_mode      : "full"        (was "tech")
cross_toggles  : seeFinancialData=true, seeApArData=true, viewHistoryLogs=true
template_slug  : administrator     fe_permissions: 42
staff row      : admin@shopview.com -> role_label "Admin"
```

## Restore instruction, should it ever be wanted

Same route; set the Role field back to **`Tech View See financial ON`** (still present in the role
list, 13 options). Nothing else needs undoing.

## Consequence for the pass

The Full View blocker reported earlier today is **cleared**. All **123** of our cases in group 6597
are now runnable on this branch — the 36 Full View cases included.
