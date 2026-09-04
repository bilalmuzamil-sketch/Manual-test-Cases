# SV-9623 — IBS Batches: reverse a Sent invoice back to Ready To Send

Build: **v26.35.8-327c626** on sv9623.qa.shopview.com. Reporter Chris Ward (High priority).
Dev (Milan Zivanovic): "Not sure about all possible cases, would be nice that someone test it."

## Feature location
Reports → ACCOUNTING → **IBS Batches** ("IBS Batch Transactions") → tabs **Ready To Send / Sent / Payments**.
The fix adds, in the **Sent** tab, a far-right delete (trash) action **`button_remove_from_batch_{txId}`** per
invoice inside an expanded batch. Endpoint: `POST /api/customers/ibs/remove-from-batch {customer_transaction_id}`.
Enabled state driven by the backend flag **`can_remove_from_batch`**. Confirm dialog before removal. The action is
gated by the existing **invoicingPayments** permission; the whole view by **seeApArData** (both pre-existing).

## Acceptance criteria — ALL PASS
1. **Button in a new far-right column of Sent** — PASS. Red trash icon per invoice row inside a Sent batch.
2. **Removes invoice from Sent → back to Ready To Send** — PASS (UI + API).
   - UI: click trash → confirm dialog "Remove from batch? INV-S2-17276 will be moved back to Ready to Send"
     → toast "Invoice moved back to Ready to Send." → invoice appears in Ready To Send.
   - API: remove-from-batch → 200; invoice leaves batch, batch balance recomputes
     ($12,294.55 → $10,105.80 after removing a $2,188.75 invoice), other invoices stay.
3. **Only unpaid removable; paid → button unavailable** — PASS.
   - Paid invoice: `can_remove_from_batch=false`, button DISABLED with tooltip
     "Only unpaid invoices can be removed from a batch"; API remove → 400
     "Only an unpaid invoice can be removed from a batch. Reverse the batch payment first."

## Edge cases (dev asked for "all possible cases")
- **Credit in a batch:** the credit row has NO remove button; removing a credit via the API → 400 "not found". PASS.
- **Remove the LAST transaction from a batch:** 200, the now-empty batch DISAPPEARS from Sent, invoice back in
  Ready To Send. PASS.
- **Re-batch after removal:** the returned invoice can be batched again (create-batch → 201). PASS.
- **Multi-invoice batch:** removing one leaves the others in the batch, balance recomputes. PASS.

## FINDING (minor, for the dev) — tooltip is misleading for the credit-balance guard case
Batch `8f162b86` has 2 UNPAID invoices (S-16140, S-17228) plus an applied credit (CM-395) that nets the batch to
$403.91. Those unpaid invoices have `can_remove_from_batch=false` and their Remove button is DISABLED — the API
explains why: 400 "This invoice can't be removed from the batch: the batch total that would remain is smaller than
this invoice. Please reach out to our support…". This balance guard is sensible (removing the invoice would make the
batch's credit exceed the remaining invoices). BUT the button's tooltip still says **"Only unpaid invoices can be
removed from a batch"**, which is misleading here because the invoice IS unpaid — the real reason is the credit /
batch-balance guard. Recommend the tooltip reflect the actual reason for this case. Not a blocker; the gate works.

## Not driven live this run
- Per-role permission drive: `invoicingPayments`/`seeApArData` gate the action/view (per the code); these are
  PRE-EXISTING permissions the fix reuses, not a new surface. switch-user impersonation returned 400 on this env,
  so the per-role UI was not driven; noted rather than claimed as verified.

## VERDICT: QA PASSED — all three acceptance criteria met, edge cases handled. One minor tooltip observation.
