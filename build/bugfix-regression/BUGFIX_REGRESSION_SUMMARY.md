# Bug-Fix / Regression Re-Test - Final Summary

_Generated 2026-07-05 - Filtered to Jira status = Done only_

## Verdict counts (Done-status tickets only)

| Verdict | Count |
|---|---|
| FIXED | 77 |
| STILL-REPRODUCES | 3 |
| NOT-TESTABLE | 19 |
| NEEDS-INFO | 2 |
| OBSOLETE | 0 |
| PARTIALLY-REPRODUCES | 0 |
| **GRAND TOTAL** | **101** |

> All 101 Done-status tickets have a result file; count reconciles to 101. (13 non-Done tickets were excluded - see 'Excluded (not Done)' below.)

## STILL-REPRODUCES (action needed)

- **SV-4600** (invoicing / accounting, v0.48 Bug Fixes) - When applying a vendor credit during payment, if the credit amount is greater than the bill amount, the system incorrectly marks the entire credit as spent. It does not leave the remaining balance to be claimed on another payment. Example: payment $125, credit $200.
- **SV-4910** (work orders, SV-4796 Epic (V0.43 Regression Testing Bugs)) - On the Work Order screen the 'New Line' button appears with a solid blue background. On production it appears with a white background, blue text, and a blue outline.
- **SV-5296** (work orders, v0.48 Regressions) - Opening a specific work order (client S-30660) fails to load and shows 'Ooooops! An error occurred. For more information, please contact support. Include your request ID: [...]'. Reported as unable to reproduce on the test account.

_No PARTIALLY-REPRODUCES cases in the Done-only set._

## NEEDS-INFO (what's needed)

- **SV-5132** (parts / inventory) - Account-specific (Gearhead Mechanical). Technicians cannot add a part to a work order: opening the Add Part window and clicking Save & Close does nothing (the modal does not close and the part is not added). Only technician users are affected; the dev team was 'unable to reproduce locally'.
  - _Needed:_ Re-test of prior NEEDS-INFO. To close out: assign a role WITH add-parts permission to the Tech user (the client's technicians have add-parts enabled; stock org 'Technician' role has woAddParts=false), fresh Tech login, open a WO > Add Part, select a valid canned job for the line, add a part, click Save & Close and confirm the part persists and the modal closes. Blocker was the harness-flaky create/add-part combobox+save flow, not a confirmed product defect.
- **SV-6873** (parts / inventory) - With Auto Pick enabled, approving a quoted part request picks double the requested quantity (e.g. request 4 of SV029 picks 8). Returning restores only 4, leaving inventory short. Occurs in both Part Sales and Work Orders; disabling Auto Pick makes it behave correctly.
  - _Needed:_ Actionable to close out: with Auto Pick enabled, add a real core INVENTORY part (received, with a part number) to a WO line or Part Sale as an unapproved/quoted request of qty N (e.g. 4), approve it, and confirm picked qty == N (not 2N) and inventory drops by N; then return and confirm inventory restores by N. Blocker here was purely building the unapproved-core-inventory-part state via the harness-flaky create/add-part UI, not the fix itself. autoPickInventoryParts was restored to false after testing.

## OBSOLETE
- None in the Done-only set. (The sole OBSOLETE-verdict ticket, SV-3408, was excluded because its Jira status is OBSOLETE - see below.)

## Excluded (not Done)

These 13 tickets were removed because their Jira status is not "Done". Grouped by Jira status so nothing is hidden:

### OBSOLETE (7)
- **SV-3408** (verdict: OBSOLETE; area: parts / inventory) - In the parts tab on a work order, an icon on the left was supposed to show the initials of the user who created the original parts request (with the full name on hover), but it showed 'AN' instead.
- **SV-4803** (verdict: FIXED; area: parts / inventory) - When a line status is changed from Needs Approval/Authorization Required to Approved/Authorized, a requested Special Order Part with all data incorrectly stayed in Quoted status instead of updating to 'Auth to order' with an Order action.
- **SV-4845** (verdict: NOT-TESTABLE; area: work orders) - For a line configured as a Fixed line total, changing the Estimated Time caused the Labor Portion / Parts Portion (and related values) to be reset to 0 in the line editor. Not reproducible on Production.
- **SV-4847** (verdict: FIXED; area: work orders) - Immediately after creating a WO (create WO -> create line -> request inventory part 'reteststage' qty 1 $19 -> Save & Close -> Finance tab), the total in the Finance tab differed from the total under the Financial Info section / Work Ord...
- **SV-5052** (verdict: FIXED; area: purchase orders / vendor) - On WO S-32 two DEF Fluid parts were received (with a vendor invoice number). The Vendor Invoices screen and vendor transaction history show both received, but the work order itself only displays one of the received parts; the second rece...
- **SV-5128** (verdict: FIXED; area: parts / inventory) - On the Work Order parts display, the Part Number was not appearing for the main part; only the Part Description was shown. (Core part already showed its part number.)
- **SV-6805** (verdict: NOT-TESTABLE; area: customer portal / customers) - For account Central Iowa Ag & Machinery, transferring a customer transaction to QuickBooks fails with 'Bookkeeping customer not found for name "Jeff Burkley"'. The item appears under Reports > QB Unexported Items (Type: Payment Create, T...

### Open (4)
- **SV-5106** (verdict: FIXED; area: invoicing / accounting) - On WO S-1820 Parts screen, when the user attempts to edit a part description, the description box shows up as EMPTY even though the text exists, forcing them to retype it.
- **SV-5123** (verdict: FIXED; area: invoicing / accounting) - When viewing an invoice under the Finance tab in mobile view, the invoice layout does not render properly — elements appear misaligned, clipped, or out of order, making the invoice difficult or impossible to read on mobile.
- **SV-5277** (verdict: STILL-REPRODUCES; area: customer portal / customers) - After creating a new customer on Staging, the system does not open the new contact modal (sometimes it appears briefly and then closes automatically). Not reproducible on Production.
- **SV-6799** (verdict: STILL-REPRODUCES; area: work orders) - The 'Approved' and 'Paid' work order statuses both display in the same green color, making them hard to distinguish at a glance in the Work Orders tab and Customers > Work Orders tab.

### In Progress (1)
- **SV-6788** (verdict: FIXED; area: work orders) - Sometimes the ShopCoach line builder needs to be run multiple times before it works. It stops loading and gives no results; clicking Build Lines again restarts it and it loads the second time. Issue is intermittent and not reproduced eve...

### Ready to Fix (1)
- **SV-5047** (verdict: STILL-REPRODUCES; area: parts / inventory) - Request-order-receive a special order part on a line with a core price set. Before pressing OK/Not OK (review), the Core price appears as $0 under the header "Rate", which is wrong.

> Note: No ambiguous done-adjacent statuses (e.g. Closed, Resolved, Verified, QA Complete) were present in the data - the only statuses observed were Done, OBSOLETE, Open, Ready to Fix, and In Progress. If any of the excluded statuses above should be treated as Done, let us know and we will re-include them.

## Scope notes

- 16 SV-4796 Milan-assigned tickets were **excluded per request**.
- The "Testing Basic" Google Doc was **ignored** (out of scope for this run).
- This report was additionally **filtered to Jira status = Done**; non-Done tickets are listed under 'Excluded (not Done)'.

## Methodology

- Each reported bug was reproduced directly on **Staging** via the **Tech-role / admin logins**, performing the **real user actions** described in the ticket.
- **Disposable test data** was used (e.g. ZZAUTOTEST records) so nothing permanent was altered.
- Verdicts: FIXED (bug no longer occurs), STILL-REPRODUCES (bug still occurs), NOT-TESTABLE (cannot be exercised in this environment), NEEDS-INFO (inconclusive / needs access or data), OBSOLETE (feature/flow no longer exists).


## Caveats

- A few widgets are **undrivable headless** (e.g. some canvas/combobox controls), which limited a small number of flows.
- **create-* endpoints returned HTTP 500** during this session, which affected some create/add flows and contributed to several NOT-TESTABLE / NEEDS-INFO verdicts.
