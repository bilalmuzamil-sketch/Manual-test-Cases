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

## Recommendation
Put ONE product-owner question covering both: "Is global search — and the customer open-WO count it
shows — scoped to the user's own location/workplace, or across the whole company the user can access?"
Once answered: add a location-scoping test for results, and pin down what the open-WO count reflects
(and add/adjust a case for it). Do not infer either from the build.
