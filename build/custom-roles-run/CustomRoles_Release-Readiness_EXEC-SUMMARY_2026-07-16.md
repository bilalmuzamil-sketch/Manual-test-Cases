# Custom Roles & Permissions — Release Readiness (Production vs Staging)
**Executive Summary — 16 July 2026**

**Scope.** All 14 production roles compared against all 11 new-model staging roles; every
permission/function verified LIVE on-screen in both environments with captured evidence
(screenshots + saved responses); 176 role-capability comparisons; zero unverified items.

## The verdict

**The new roles model is overwhelmingly faithful to both production behavior and the
specification:** 130 of 176 comparisons (74%) match production exactly, and 95% of all
spec-conformance checks (283 of 297) are per-spec. Every one of the 46 differences was
verified live, and 41 of the 46 are intended by the specification. What remains: 6 spec
deviations (three of them one shared card-terminal configuration issue) and 3 spec
self-contradictions that need decisions before release.

## Key numbers

| | |
|---|---|
| Role-capability comparisons (both environments, live) | **176** |
| … match production exactly | 130 |
| … staging grants more than production | 26 |
| … staging grants less than production | 20 |
| Spec-conformance checks (every verified row judged against the specification) | **297** |
| … agree with the specification (per-spec) | 283 |
| … deviation rows (= 6 distinct findings) | 9 |
| … rows where the specification contradicts itself (= 3 distinct items) | 5 |

## Decisions needed before release

**RED (customer-facing / money):**
- **Service Advisor loses the ability to reverse an invoice.** In production this role can
  reverse an invoice; in the new model it cannot (the button is gone). This is exactly what
  the specification prescribes (invoice reversal now requires work-order delete rights,
  which this role no longer has) — but it is customer-billing-facing, so confirm it is
  intended before release.
- **Taking customer payments is newly granted to 6 roles.** Service Manager, Senior Service
  Advisor, Foreman, Parts Manager, Parts Technician and Office User can all take a customer
  payment in the new model; none of them can in production. This matches the specification —
  but it is money-handling, so confirm it is intended before release.
- **Senior Service Advisor: AR/AP aging reports promised but not delivered.** The
  specification grants this role the receivables/payables aging reports, but the build hides
  them (verified in both environments). This is an unimplemented spec grant — needs a dev
  fix or a spec change.

**AMBER:**
- **Office User still sees work-order notes and part returns.** The 14-July spec update
  removed ALL work-order access for Office User, yet the build still shows the notes tab
  (in both environments) and the part-return control (in staging). Both are small-surface
  over-grants versus the spec — decide: enforce the spec or amend it.
- **"Send to Terminal" shows for three roles the spec would hide it from.** Foreman, Office
  User and Parts Technician see the card-terminal payment button on staging because the
  staging organization has a card terminal configured; the spec says these roles (Customer
  Portal switched off) should not see it. This is a difference in HOW the button is gated
  (organization device vs role setting), not a data risk — decide which gating rule should win.
- **The specification contradicts itself in three places — Product Owner to resolve.**
  (1) Service Manager invoice reversal: one spec table says the role can reverse, another
  says it cannot — the build follows the "cannot" table. (2) Technician declining a
  work-order line: one section grants it, another blocks only approving — unresolvable as
  written; both environments hide it. (3) "Send to Portal" for Office User, Parts Technician
  and Sales Representative: one section grants it to every full-view role, an answered open
  question restricts it to line-approvers — the build follows the stricter reading.

**GREEN (verified safe):**
- **Card-terminal access is safe through the migration.** "Send to Terminal" depends on
  whether the organization has a card terminal device, not on the roles migration —
  migrating roles does NOT change anyone's terminal access.
- **Parts ordering and receiving match production exactly.** All 22 live parts-module checks
  (create purchase orders, receive deliveries) match production for every role.
- **Work-order deletion correctly tightened.** Only Admin, Service Manager and Senior
  Service Advisor can delete a work order in the new model — exactly as the specification
  prescribes (verified live for all 11 roles).

## How much to trust this

Every result was observed live on-screen in both environments (screenshots and captured
responses are archived); nothing was inferred from documents, role definitions or code.
Spec conformance was derived from a verbatim, citation-backed truth table of the v2
specification.

*Full detail: `CustomRoles_Release-Readiness_Prod-vs-Staging_EXEC_2026-07-16.xlsx` (this
summary, the role-by-role delta list, the deviation/open-question register, and the coverage
& method statement) and the complete row-by-row matrix in
`Prod-vs-Staging-LIVE-VERIFIED-2026-07-14.xlsx`.*
