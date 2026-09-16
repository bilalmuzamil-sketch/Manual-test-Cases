# THE 18 "NOT READY" CASES — the recipes already exist, I should not have called them a gap

**Date:** 2026-09-14 · **Correction to** `READINESS-VERDICT-2026-09-14.md` §B2

## WHAT I GOT WRONG

I reported eight permission cases, two location cases and one organization case as **NOT READY**, as
though the setup were an open problem. **It is not.** The recipes are in the repo, proved by other
sessions, and I should have searched before declaring a gap — that is the standing directive, and I
skipped it.

Sources (all on `origin/claude/slack-session-0sxnd9`): `build/APP-ACTIONS-PLAYBOOK.md` and
`build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md`.

## THE RECIPES — verbatim from the playbook

| Need | Recipe |
|---|---|
| **Test as an arbitrary role — preferred** | `POST /api/switch-user {user_id}` — impersonate a real holder. `user_id` is the staff `id` from `GET /api/staff?limit=200`, which **lists `role_label` per staff**, so you can find a holder of each role without creating anything |
| **A role with no live holder** | `POST /api/iam/create {email, firstName, lastName, roleId, departments, workplaceId}` — a fresh staff on that role, then switch-user to it |
| **Reset a role to template FIRST (Rule 26)** | UI: Settings → Roles & Permissions → pencil → Reset to Template → Save. API: `POST /api/roles/{id}` re-PUTting template perms. Read live atoms with `GET /api/roles/{id}` and the template with `GET /api/role-templates/{template_id}/fe-permissions` |
| **A second location** | List them: `GET /api/staff/my-workplaces`. Switch: `POST /api/iam/change-location {workplace_id, workplace_timezone}` → 200 |
| **Role-swap on the Tech user (alternative)** | `POST /api/staff/{staff_id}/change` assigns a reset role to the quick-login Tech user — avoids creating users on a shared org |
| **Auth** | `POST /api/quick-login {"key":"admin"}` → 200, rotates `PHPSESSID` |

🔴 **Rule 26 is not optional:** reset the role to template **before** any permission verification, and
if another actor re-adds atoms on the shared org, **reset again and continue** — persistently, no retry
cap (Rule 26a).

⚠️ **The trap the playbook names:** without `POST /api/iam/change-location`, `default_workplace` reads
`"None"` and inventory/parts pages sit on *"Loading…"* forever. That would look exactly like a search
defect. Set the location before judging anything.

## REVISED STATUS OF THE 18

| Cases | Was | Now |
|---|---|---|
| C45142–47, C45149, C45159 — seven role setups | "NOT READY" | **ACHIEVABLE** — `GET /api/staff?limit=200` to find a holder per role, then `switch-user`. Reset to template first |
| C45151, C45152 — second location | "NOT READY" | **ACHIEVABLE** — `my-workplaces` + `change-location`. Still needs a part sale at the other location, so A5 touches it |
| C45150 — second organization | "NOT READY" | **PROBABLY ACHIEVABLE** — not covered by these recipes; the org boundary may need an admin. **The one I would still ask about** |
| C45153, C55665 — need a part sale | BLOCKED | **STILL BLOCKED BY A5** |
| C45148 — unrecognised result type | "may not be seedable" | **UNCHANGED** — still needs your ruling |
| C45154, C45155, C45157, C45160 | "needs a check" | **UNCHANGED** — quick checks during the run |

**So the honest count is not "18 not ready".** It is: **11 need a documented setup step** that takes
minutes with the recipes above, **2 are blocked by A5**, **1 needs your ruling**, and **4 are quick
checks during the run**.

## AND — the QA lead says other sessions are already doing this

Role and location setup is live work elsewhere. **This session should not duplicate it.** The right
move is for `manual-test-cases-c2` to use the recipes above, or to inherit whatever those sessions have
already stood up. **Check before building.**

## OUTSTANDING — what I need from you

| # | What I need | Why |
|---|---|---|
| 1 | Confirm **who** does the role/location setup — the other sessions, `manual-test-cases-c2`, or me | So it is done once, not three times, on a shared org where Rule 26 resets affect everyone |
| 2 | A steer on **C45150** (second organization) — the one recipe the playbook does not cover | It may need an admin |
