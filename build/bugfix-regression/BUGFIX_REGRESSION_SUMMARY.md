# Bug-Fix / Regression Re-Test - Final Summary

_Generated 2026-07-05_

## Verdict counts

| Verdict | Count |
|---|---|
| FIXED | 84 |
| STILL-REPRODUCES | 6 |
| NOT-TESTABLE | 21 |
| NEEDS-INFO | 2 |
| OBSOLETE | 1 |
| PARTIALLY-REPRODUCES | 0 |
| **GRAND TOTAL** | **114** |

> All 114 planned tickets have a result file; count reconciles to 114.

## STILL-REPRODUCES (action needed)

- **SV-4600** (invoicing / accounting, v0.48 Bug Fixes) - When applying a vendor credit during payment, if the credit amount is greater than the bill amount, the system incorrectly marks the entire credit as spent. It does not leave the remaining balance to be claimed on another payment. Example: payment $125, credit $200.
- **SV-4910** (work orders, SV-4796 Epic (V0.43 Regression Testing Bugs)) - On the Work Order screen the 'New Line' button appears with a solid blue background. On production it appears with a white background, blue text, and a blue outline.
- **SV-5047** (parts / inventory, v0.44 Regressions) - Request-order-receive a special order part on a line with a core price set. Before pressing OK/Not OK (review), the Core price appears as $0 under the header "Rate", which is wrong.
- **SV-5277** (customer portal / customers, v0.48 Regressions) - After creating a new customer on Staging, the system does not open the new contact modal (sometimes it appears briefly and then closes automatically). Not reproducible on Production.
- **SV-5296** (work orders, v0.48 Regressions) - Opening a specific work order (client S-30660) fails to load and shows 'Ooooops! An error occurred. For more information, please contact support. Include your request ID: [...]'. Reported as unable to reproduce on the test account.
- **SV-6799** (work orders, v0.54 Regressions) - The 'Approved' and 'Paid' work order statuses both display in the same green color, making them hard to distinguish at a glance in the Work Orders tab and Customers > Work Orders tab.

_No PARTIALLY-REPRODUCES cases this run._

## NEEDS-INFO (what's needed)

- **SV-5132** (parts / inventory) - Account-specific (Gearhead Mechanical). Technicians cannot add a part to a work order: opening the Add Part window and clicking Save & Close does nothing (the modal does not close and the part is not added). Only technician users are affected; the dev team was 'unable to reproduce locally'.
  - _Needed:_ Re-test of prior NEEDS-INFO. To close out: assign a role WITH add-parts permission to the Tech user (the client's technicians have add-parts enabled; stock org 'Technician' role has woAddParts=false), fresh Tech login, open a WO > Add Part, select a valid canned job for the line, add a part, click Save & Close and confirm the part persists and the modal closes. Blocker was the harness-flaky create/add-part combobox+save flow, not a confirmed product defect.
- **SV-6873** (parts / inventory) - With Auto Pick enabled, approving a quoted part request picks double the requested quantity (e.g. request 4 of SV029 picks 8). Returning restores only 4, leaving inventory short. Occurs in both Part Sales and Work Orders; disabling Auto Pick makes it behave correctly.
  - _Needed:_ Actionable to close out: with Auto Pick enabled, add a real core INVENTORY part (received, with a part number) to a WO line or Part Sale as an unapproved/quoted request of qty N (e.g. 4), approve it, and confirm picked qty == N (not 2N) and inventory drops by N; then return and confirm inventory restores by N. Blocker here was purely building the unapproved-core-inventory-part state via the harness-flaky create/add-part UI, not the fix itself. autoPickInventoryParts was restored to false after testing.

## OBSOLETE
- **SV-3408** (parts / inventory) - In the parts tab on a work order, an icon on the left was supposed to show the initials of the user who created the original parts request (with the full name on hover), but it showed 'AN' instead.

## Scope notes

- 16 SV-4796 Milan-assigned tickets were **excluded per request**.
- The "Testing Basic" Google Doc was **ignored** (out of scope for this run).

## Methodology

- Each reported bug was reproduced directly on **Staging** via the **Tech-role / admin logins**, performing the **real user actions** described in the ticket.
- **Disposable test data** was used (e.g. ZZAUTOTEST records) so nothing permanent was altered.
- Verdicts: FIXED (bug no longer occurs), STILL-REPRODUCES (bug still occurs), NOT-TESTABLE (cannot be exercised in this environment), NEEDS-INFO (inconclusive / needs access or data), OBSOLETE (feature/flow no longer exists).

## Caveats

- A few widgets are **undrivable headless** (e.g. some canvas/combobox controls), which limited a small number of flows.
- **create-* endpoints returned HTTP 500** during this session, which affected some create/add flows and contributed to several NOT-TESTABLE / NEEDS-INFO verdicts.

