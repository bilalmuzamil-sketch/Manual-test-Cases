# OPEN QUESTION — Global Search location/workplace scoping (2026-09-18)

The Global Search PRD (576978945 v1.5, last modified 2026-09-08) specifies **tenant/company isolation
and role-based access (§9)** but is **silent on multi-location / workplace scoping**. ShopView is
multi-location (a company has several workplaces; a user can be tied to one). Two concrete instances
where this silence bites — both need a product-owner/engineering answer, neither can be resolved from
the build (Rule 57/58):

## Instance 1 — result visibility
Should global search return records from ALL locations in the user's company, or only the user's
current / assigned location? §9 promises company-level separation only; nothing narrows to a location.
No case in the suite covers location scoping (suite-wide scan 2026-09-17 = 0 hits).

## Instance 2 — the Customer "open work orders" count badge
The customer row shows an open-work-order count badge (§4 Customers: "open WO count badge (e.g. 12)";
also a ranking signal in §6.1 "total open WO count"). The spec does NOT say whether this count is:
- **cross-location** (all of that customer's open work orders across every location), or
- **single-location** (only the open work orders at the user's current/assigned location).
The one weak hint is the word "total" in §6.1 ("total open WO count"), which leans cross-location, but
that is in the ranking section, not the badge definition, and is not decisive. Covered display-wise by
C44832, but that case does not (and cannot yet) assert the count's location scope.

## Instance 3 — what counts as "open" for the badge (which WO statuses)
The badge counts a customer's "open work orders," but the search PRD never lists WHICH work-order
statuses count as open. Facts we hold:
- **The app's full WO status set (recorded, `GET /api/work-orders/statuses`, APP-ACTIONS-PLAYBOOK
  line 1041 / 3791): Estimate · Approved · In progress · Review · Complete · Invoiced · Paid** (seven;
  neither "Declined" nor "Imported" is one of them).
- **The search PRD's ONLY status grouping** is in ranking §6.1: *"Open/active status (Approved, In
  Progress, Review) → +0.30"* and *"Closed/Invoiced WOs older than 90 days are demoted."* So the PRD's
  "active" trio = Approved / In progress / Review.
- **The badge's counted-set is NOT defined in the search PRD.** "open WO count badge" (§4) is an
  existing app concept; the spec does not say whether the badge counts the narrow trio (Approved / In
  progress / Review) or the broader "everything not yet Invoiced/Paid" (which would also include
  Estimate and Complete). These differ — e.g. does an Estimate count? does a Complete-but-not-invoiced
  WO count? Unanswerable from the search spec.
The authoritative definition of "open work order" is the WO lifecycle / the existing customer-record
open-WO count, confirmed with the PO — never read off the build (Rule 57).

## Recommendation
Put ONE product-owner question covering all three: "Is global search — and the customer open-WO count
it shows — scoped to the user's own location/workplace or across the whole company; and exactly which
work-order statuses count toward that 'open' number?" Once answered: add a location-scoping test for
results, and pin down/adjust the open-WO-count case (C44832) to name the counted statuses. Do not infer
any of it from the build.
