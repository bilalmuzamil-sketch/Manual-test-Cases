# SV-11986 — $0 invoice marked Paid cannot be reversed after its $0 payment is deleted (IN PROGRESS)

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
