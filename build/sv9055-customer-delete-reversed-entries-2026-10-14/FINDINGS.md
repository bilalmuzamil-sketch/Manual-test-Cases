# SV-9055 — customer cannot be deleted when only reversed entries remain — QA (14 Oct 2026)

**Ticket:** [SV-9055](https://shopview.atlassian.net/browse/SV-9055) · Medium · TESTING QA · assignee Dipesh Changawala · reporter MAX (Qazi Sufyan) · no parent · Relates SV-8143 (Done; Dusan removed 1 customer_transaction + 1 customer_payment_statement + 1 customer_payment by hand to let that delete through).
**QA lead's answers:** recording **No** · technical section **No**.
**Branch:** sv9055.qa.shopview.com, build **v26.40.17-f88c11c** (last-modified Tue 13 Oct 2026 08:54:24 GMT). **Production:** v26.40.17-f5bf8f4.

## What the sources ask for (Rule 66 — description + every comment)
- Description: *"Nothing is linked to this customer, so it should delete successfully."* + *"Two things to look at: 1. Why this customer cannot be deleted … 2. The error message itself should be improved … it does not say what is blocking the delete."*
- Chris 77567 (29 Sep): *"check the production database for what is still linked … and make the error say what is blocking it instead of only "existing transactions"."*
- Dipesh 78139 (7 Oct), the fix plan: *"Let the delete go through when the only things on the customer's account are reversed entries (reversed payments or deposits). Anything still active, such as an open or paid invoice, a payment or a deposit, will still block the delete exactly as it does today. The reversed history is not removed."* + two reproduction flows (service WO, part sale).
- Chris 78140: *"I completely agree with you … Please raise the fix."*
- **Gap to watch:** the error-message improvement (description point 2, Chris 77567) is not in Dipesh's plan. Tested and reported either way; the call on whether it is in scope goes to the QA lead (Rule 97d).

## Variant matrix (Rule 96) — written before testing
| # | Customer state before Delete | Expected | Source |
|---|---|---|---|
| A1 | Service WO: invoiced → paid in full (cheque) → payment reversed → invoice reversed → line reopened/deleted → WO deleted → asset + contact deleted | Deletes | Dipesh flow 1 |
| A2 | Part sale: invoiced → paid → payment reversed → invoice reversed → part returned → part sale deleted → asset + contact deleted | Deletes | Dipesh flow 2 |
| A3 | Deposit taken then reversed (no other history) | Deletes | "reversed payments or deposits" |
| A4 | Reversed payment AND reversed deposit together | Deletes | same |
| A5 | Never used (baseline) | Deletes | unchanged behaviour |
| B1 | Open (unpaid) invoice | Blocked | "open … invoice … will still block" |
| B2 | Paid invoice (active payment) | Blocked | "paid invoice … a payment" |
| B3 | Active (held) deposit | Blocked | "a deposit" |
| B4 | Payment reversed but invoice NOT reversed (invoice open again) | Blocked | open invoice |
| B5 | Reversed payment + an active deposit | Blocked | anything active blocks |
| B6 | Open credit (Issue Credit) on the account | Blocked (active entry) — confirm | "anything still active" |
| M | Error text on every blocked case | Report what it says; description asks it to name the blocker | description pt 2, Chris 77567 |
| H | Reversed history kept after the delete; payment/report screens still load | Kept, no errors | "reversed history is not removed" |

## 2026-10-14 ~06:30Z — follow-up work after the QA lead's answers

### SV-11276 filed (QA lead: "Raise a ticket")
- **Production, v26.40.17-f5bf8f4.** Try 1: S2-973, invoiced and paid ($100 cheque ZZ9055-NT1). Its menu offered only Audit Log / Timesheets (0) / Print Work Order. The pasted console request returned 201; the work order is now "Not found"; the payment is still on the customer's Payments tab. Try 2: an invoiced, unpaid work order was deleted the same way, and its invoice is gone from the customer's Invoices tab too.
- The server's own record for a paid work order says `deletable:false`, `deletable_reason:"Paid work order cannot be deleted."`, and it deletes anyway.
- Ready example left on production: customer *ZZAUTOTEST SV9055 paid-WO example 94302*, work order S2-975 (paid, $100 cheque ZZ9055-EX).
- Duplicate search: 8 JQL queries, none matching. SV-9706 (parts held) and SV-10190 (line delete) are related, not duplicates.
- Fields: Bug, Medium, Product Area Customers (copied from SV-9055), parentless like SV-9055, Relates SV-9055. Read back: 9 steps numbered continuously, 2 images as file attachments, console line in step 6.

### Message variant matrix (description point 2 / Chris 77567)
| Blocker left on the customer | Branch v26.40.17-f88c11c | Production v26.40.17-f5bf8f4 |
|---|---|---|
| Work order / asset / contact | Delete greyed out; the tooltip names them (B2) | same (PRW) |
| Open store credit only (made on screen with Issue Credit) — X3 *ZZAUTOTEST SV9055 X3 payment-on-account 93666*, CM9055-4189 −$20 | **Refused: "This customer has open credit. Reverse it from the location that issued it, then delete the customer."** | **Customer deleted** (201) — PX3 |
| Leftover payment $199.04 + held deposit DEP-4705 $25, no work order (X2) — only reachable by deleting the paid work order through the server (SV-11276) | "You cant delete company with existing transactions" (walked live again 06:20Z, one confirm click) | n/a |
- No on-screen path found to a state where Delete is enabled and the generic message appears. New Payment is greyed out on a customer with no invoices; the Deposits tab has no add button.
