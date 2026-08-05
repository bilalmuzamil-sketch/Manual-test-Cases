# ROLE-RESET-LOG — 2026-08-05

**Nothing was reset, and nothing was modified. Zero writes were made to any role, any staff member or
any organisation setting.** This file exists to say so precisely, with the reasoning, rather than leave
a Rule-26 step silently unaccounted for.

## Why no reset was performed

**Standing Rule 26 requires resetting every *in-scope* role to template before verifying
permission-gated behaviour, so the test runs against spec defaults rather than another tester's drift.**

**This pass drove no role.** The cross-permission observation it was meant to make could not be made at
all — no user on this system holds *reports access without work-order access*, and every route to
becoming such a user is closed from this container (`FINDINGS.md` §4.2). **With no role driven there was
no baseline to protect, so a reset would have had no purpose** — and it would have carried a real cost:
the organisation `d55bc308-e61a-438d-b5f1-c7a73c89d49f` is shared with the Filters and Schedule workers,
and resetting a role they may be observing would have changed their results mid-run on a branch they
cannot see us on. **Rule 6 makes the environment disposable; it does not make it private.**

**Stated plainly so it is not read as a Rule-26 waiver:** the moment a second sign-in exists and the
negative half is driven for real, **the reset becomes mandatory and must be done first**, with the
before/after diff recorded here.

## What WAS done — all eleven roles read and recorded

Read live via `GET /api/organizations/{org}/roles` then `GET /api/roles/{id}` for each.
**Read-only; the full permission arrays are saved as `evidence/roles-permission-sets.json`.**

| Role | Role id | Permissions | `reportsPageAccess` | `workOrdersView` |
|---|---|---|---|---|
| Admin | `cf29706d-…` | 42 | **yes** | yes |
| Service Manager | `2ca7a173-…` | 36 | **yes** | yes |
| Office User | `58bd6045-…` | 25 | **yes** | yes |
| Parts Manager | `b7bd7871-…` | 31 | **yes** | yes |
| **Sales Representative** | `b176ec30-…` | **8** | **yes** | yes |
| Senior Service Advisor | `2cb364be-…` | 31 | no | yes |
| Service Advisor | `a1d0a44b-…` | 25 | no | yes |
| Foreman | `d5ca0707-…` | 23 | no | yes |
| Parts Technician | `0c94a1d5-…` | 19 | no | yes |
| Technician | `475d69b3-…` | 6 | no | yes |
| Time Clock User | `2f75480b-…` | 3 | no | yes |

**Sales Representative in full, all eight:** `customersCreateAndEdit`, `customersView`, `partSalesView`,
`reportsPageAccess`, `seeApArData`, `seeFinancialData`, `woFullViewMode`, `workOrdersView`.

## What that reading revealed — the drift check, and the finding

**Against the specifications there is no per-report permission matrix to check** — all six specs state
the same one-permission model, and Parts Velocity **S1-R4** puts it plainly: *"Both loading the report
and exporting it require the single reports permission — the one permission that grants access to all
reports; there is no per-report permission."* The build agrees: **`reportsPageAccess` is a single atom**
and five roles hold it.

**So the only spec-relevant conformance question is which roles hold that one atom, and there is nothing
in any specification that fixes that list** — it is an organisation's own configuration. **No drift can
be asserted, and none is.**

**One genuine conformance finding did come out of it, and it is a specification defect rather than a
role problem:** **Parts Velocity S1-N1** still reads *"Users without the Manager or Office User role
cannot reach the Reports section…"*, which contradicts **S1-R4 in the same version** and contradicts the
build — **Sales Representative** holds `reportsPageAccess` and is neither Manager nor Office User.
Reported, not changed (`FINDINGS.md` §6).

**A second observation worth recording for whoever runs the reset later:** **no existing role can serve
as the negative subject even after a reset**, because the state needed does not exist in any template.
It requires a **purpose-made custom role** (Rule 5 sanctions exactly that) **plus a way to sign in as
its holder** — and it is the second half that is missing, not the first.
