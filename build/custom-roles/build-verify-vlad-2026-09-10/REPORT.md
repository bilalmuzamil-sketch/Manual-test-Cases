# Build verification — C43850 + C45275 (Vladimir Tomovic's cases, corrected this session)

- **Env:** staging — https://app.staging.shopview.com, 2026-09-10.
- **Author:** both **Vladimir Tomovic** (TestRail user 1). Normally hands-off (Rule 38); **corrected here
  under his explicit per-session permission** (recorded in `build/custom-roles/C43850-C45275-VLAD-AUTH-2026-09-10.md`).
  Both are Automated (`custom_atmstatus = 3`) → QA-lead go-ahead covers Rule 71; Rule-65 notice filed.
- Both use TestRail's **separated-steps** format (`custom_steps_separated`, L0034).

## C43850 — Report Location scope follows the signed-in user's enrollments (SV-8582)
Every route/label confirmed live:
| Step | Build control (observed) | Verdict |
|---|---|---|
| Administration > Staff, own row "Departments" button (shows a count, e.g. "4 Departments") | present | ✅ |
| "Manage staff enrollments" dialog: Current enrollments, Select Workplace, Select Department, Enroll, delete icon | present | ✅ |
| A location the admin isn't in, to enroll (e.g. "QB Location" offered in Select Workplace) | feasible | ✅ |
| Reports > Work In Progress (`/reports/work-in-progress`), "Location:" filter | present | ✅ |
- **Correction applied (step 2):** named the real dialog controls — "In the Select Workplace field choose
  a location… in Select Department choose a department… click Enroll." (Glossary: the enrollment dialog
  says **Workplace**; the report says **Location** — same entity, two labels.)

## C45275 — Changing the customer clears the Authorizer; changing only the contact does not (SV-8218)
Every control confirmed live:
| Step | Build control (observed) | Verdict |
|---|---|---|
| WO Lines tab, customer card Authorizer row ("Authorizer None") | present | ✅ |
| **Change Customer** = the **swap ⇆ icon** (top-right of the customer card; tooltip "Change Customer") → dialog with Customer picker + Contact picker + **Update Customer** | present | ✅ |
| Authorizer picker (dropdown on the Authorizer row) → **"No authorizer"** + contact options | present | ✅ |
- **⚠️ Corrected a near-miss (L0037):** the "Change Customer" control is an **icon with a hover tooltip**,
  invisible to a text/HTML scan — I nearly reported it absent; the QA lead's screenshot corrected it.
- **Correction applied (steps 2–4):** name the swap ⇆ icon and its "Change Customer" tooltip (and warn it
  is NOT the "Change Asset" swap icon on the vehicle card), and name the **Update Customer** submit button.

## Tooling fix (L0038)
`check_runnable_cases.py` read only the plain `custom_steps` field and falsely failed BOTH cases as "no
steps." Patched to read `custom_steps_separated` content when the plain field is empty. Plain-steps
regression (C26577) still passes.

---
## Five-table summary
### 1 — DONE
- Both cases build-verified live; every route/label/control confirmed. C-ids: C43850, C45275.
- Corrections applied via API (separated steps), render confirmed `fr-view` (0 escaping), gate 2/2.
- Runnable-gate patched for separated-steps cases; Rule-65 Vlad notice filed.
### 2 — LEFT
- Nothing for build-verification. Full behavioural execution (does the filter actually change; does the
  customer-change actually clear the Authorizer) is the test-execution lane's job — the controls are all
  in place for it.
### 3 — BLOCKED (and what it does NOT block)
- None. (Earlier apparent blocker "Change Customer absent" was a false-absent — resolved, L0037.)
### 4 — HOW TO UNBLOCK
- n/a.
### 5 — HANDOFF-READY
- **YES.** Both render clean, pass the runnable gate, and every step names a real, reachable control.
