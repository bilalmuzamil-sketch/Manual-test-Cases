# SV-11986 — $0 invoice marked Paid cannot be reversed after its $0 payment is deleted — QA PASSED 3 Nov 2026

Ticket https://shopview.atlassian.net/browse/SV-11986 (Bug, TESTING QA, developer Slavcho Mitrov, reporter Mike Freeman via
Intercom, customer SCA Fleet Services, WO S-13790). QA branch https://sv11986.qa.shopview.com.
Pre-checks: labels ai-unverified-repro, bug-report, powertools-unassigned, source-intercom (no `accounting`); QA Assignee empty.
QA lead choices (3 Nov): API mode (or quicker, nothing skipped) · no recording · no technical section.

## Sources
- Description: $0 invoice auto-marked Paid; Reverse shows "This invoice has been paid, please delete payment before
  reversing."; expected: a $0 invoice can be reversed when no real payment exists.
- Chris Ward 79969 (2 Nov): the $0 payment IS recorded and CAN be deleted; the problem is the invoice still cannot be
  reversed afterwards the way a paid invoice can.
- Slavcho 79998 (3 Nov): PR #4092 — deleting a $0 invoice's $0 payment puts the invoice back to Pending and the work order
  back to Invoiced, so it can be reversed as usual (how it worked before v26.43.3). Already-stuck invoices (12 on production)
  need a one-time data fix, not part of this branch.
- Chris 80010 (3 Nov): approves the data fix for all 12 (Nemanja runs it). Not testable on the branch; production data, not ours.

## How the state is built (screens a user has)
- A line with no labour and no parts: Lines tab -> New Line dialog -> Title + Description + Labor type General Labor, 0 hours,
  Line Approved -> Save & Close (production), or canned line "HD Misc Buffer" (0 hours, no parts) on the branch.
  Complete the line and the work order, Create Invoice -> invoice $0.00 -> marked Paid with a $0.00 payment
  ("Payment for invoice …") on Customer -> Payments.
- Delete = Customer -> Payments -> delete icon on the $0.00 row -> dialog "This action will reverse the payment for all
  invoices associated with it. The payment record is preserved for audit history." -> Reverse.
- Reverse = work order -> Finance tab -> invoice menu (⋮ beside the settings cog) -> Reverse -> "This action will re-open and
  undo the invoice." -> Reverse.
- Production customer ZZAUTOTEST Aabridge Freight carries a $50 default fee on new work orders; removed during setup.

## Results (3 Nov 2026). Branch build v26.45.0-279650f (last-mod 03 Nov 11:06:14 GMT) on every run; production v26.45.0-8e138e1.
Every step on screen (Reverse menu + dialogs, Payments bin + dialog); set-up of WOs/lines by API; statuses read on screen
(Finance badge, Customer > Invoices / Payments rows, Work Orders list) and by the work-order record.

| # | Case | Environment / record | Result |
|---|---|---|---|
| P | $0 invoice (New Line dialog, General Labor 0 h) -> Paid with $0 payment -> Reverse refused -> delete the $0 payment -> Reverse | production S1-1910 | BUG REPRODUCED: after the delete the WO + invoice stay Paid, Payments row gone, Reverse still shows "This invoice has been paid, please delete payment before reversing." |
| 1 | Reverse while the $0 payment exists | branch S11986-17581, -17584 | Refused with the same warning (correct: a payment exists; Chris 79969) |
| 2 | Delete the $0 payment (Customer > Payments bin > Reverse) | branch S11986-17581, -17584 | Invoice pending (Customer > Invoices "Unpaid" $0.00), WO badge Invoiced, payment row gone |
| 3 | Reverse after the delete | branch S11986-17581, -17584 | Dialog "This action will re-open and undo the invoice." -> Reverse -> WO Complete, invoice removed, invoice row gone from Customer > Invoices, Work Orders list shows Complete |
| 4 | Invoice again unchanged | branch S11986-17581 | $0 invoice again, Paid with a new $0 payment (expected) |
| 5 | Customer's goal: correct the WO (add priced line HD CVIP electric brake trailer) and invoice | branch S11986-17584 | Invoice $406.09, WO Invoiced / invoice pending |
| 6 | Regression: normal invoice paid on screen (New Payment, EFT $406.09) -> delete payment -> Reverse | branch S11986-17583 | Paid -> Invoiced/pending -> Reverse -> Complete (unchanged behaviour) |

| 7b | $0 invoice from a New Line with Labor Rate "Fixed Line Total" = 0.00 (built in the dialog on screen) | branch S11986-17585 | Paid -> delete -> Invoiced/Unpaid -> Reverse -> Complete: PASS |

100% discount: QA lead said test it first. Not possible on this branch: the discount needs a mapped QuickBooks discount item and
the branch has NO QuickBooks company (mapping-status says connected:true but products-and-services 400 "Bookkeeping is not
configured" and integration returns an Intuit authUrl) = external dependency (no Intuit account). Covered the nearest user-buildable
shape (Fixed Line Total $0) instead; stated in the comment. The 12 already-stuck production invoices
are a one-time data fix (Slavcho 79998 / Chris 80010), not part of this branch.
Note: on COD customers, Create Invoice on screen opens the New Customer Payment dialog; closing it leaves no invoice. That is the
COD payment-at-invoicing flow, unrelated to this ticket; step 5's invoice was created without a payment for that reason.
Evidence: ev/before-after-reverse.png, ev/branch-steps.png (scripts/exhibits.py with /usr/bin/python3); per-run result.json files.

## Posted
Pre-post gate 14:14 UTC: branch marker v26.45.0-279650f / last-mod 03 Nov 11:06:14 GMT unchanged; ticket TESTING QA, last update 08:09
(Chris 80010), nothing new; text scanned for AI fingerprints (0). Comment 80024 (green PASSED, 8 checks, 2 inline images) posted
09:16 −0500; attachments 63494 before-after-reverse.png + 63495 branch-steps.png confirmed on the issue. Label QAcomplete added,
transition 10 -> status QA Complete (read back). No recording, no technical section (QA lead's choice).
Learning check: playbook §AZ added (reverse + payment-delete controls, $0 line recipes, COD Create Invoice opens payment dialog,
discount needs QuickBooks); lessons row added (new WO goes to the SESSION location).
