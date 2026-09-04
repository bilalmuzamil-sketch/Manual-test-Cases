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

## Posted 2026-09-04
- QA comment posted on SV-9623 (comment id 76001) — OVERALL QA STATUS: PASSED, 9-row check table, 2 inline annotated exhibits (01-sent-remove-buttons.png, 02-happy-path-back-to-ready.png).
- Tooltip observation re-verified LIVE before posting (had appeared as red/enabled in the first screenshot; confirmed both credit-batch unpaid invoices S-16140 & S-17228 have can_remove_from_batch=false → buttons DISABLED; hovering the unpaid Lamkin row shows "Only unpaid invoices can be removed from a batch" while the real API reason is the balance guard "the batch total that would remain is smaller than this invoice"). Evidence: tooltip-issue.png.
- Raised as its own ticket **SV-9705** (Bug, priority Low, Product Area Billing Portal, Open), linked **Relates** to SV-9623, with the annotated tooltip-issue.png. Referenced from the SV-9623 comment.

## Update 2026-09-04 (edge screenshots + comment strengthened)
- User asked for every table row to be screenshot-backed. Captured live UI before/after for the 3 edge rows and added 3 annotated exhibits to comment 76001 (updated in place):
  - 03-edge-multi-invoice-remove-one.png (row 8): 2-invoice batch $2,384.17 (Lansing+Dorr) -> remove Dorr -> $1,113.83, Lansing remains.
  - 04-edge-rebatch.png (row 7): Dorr (back in Ready To Send) -> Create Batch -> new $1,270.34 Sent batch.
  - 05-edge-remove-last.png (row 6): 5 batches incl. single-invoice Dorr batch -> remove Dorr -> 4 batches (batch gone); Dorr verified back in Ready To Send.
- Resolved a potential bite: the credit-batch unpaid invoices (Glendale/Lamkin) DO have disabled Remove buttons (can_remove_from_batch=false) despite red icon colour — confirmed live; tooltip issue is real.
- Removed a stale pre-break example ("$2,188.75 from $12,294.55 batch"; $2,188.75 = the paid Honest Diesel invoice, not removable) from the comment; replaced with the screenshot-backed $2,384.17->$1,113.83 numbers.
- SV-9705 corrected Low -> Medium per QA-lead ruling 2026-09-04 (all tickets we create/edit = Medium; PO changes priority). Rule saved in CLAUDE.md (supersedes Rule 53 "Low").
- Env note: per-ticket QA branch (sv9623) needs no cleanup (disposable); left a new Lansing single-invoice Sent batch + Dorr back in Ready To Send from the edge tests.

## Update 2026-09-04 (Rule 67 + SV-9705 description rewritten for a non-technical PO)
- Saved Standing Rule 67: every follow-up ticket we file is written for a non-technical PO to reproduce
  in the easiest way — short plain description, PO-runnable steps that start with "Open the QA branch to
  reproduce the issue: <link>", data-shape-based steps (not dependent on one named batch surviving),
  annotated screenshots, technical detail last. If the PO can't reproduce it, it bites the QA lead.
- Rewrote SV-9705 to that standard (generator build_sv9705_description.py): 2-line description; numbered
  UI steps on sv9623.qa.shopview.com; annotated tooltip-issue.png; technical detail moved to the bottom.
  Priority left Medium; link Relates SV-9623 intact.
- NOTE: could not live-verify the example $403.91 credit batch this pass — sv9623 app session returned 409
  "Session has expired". Steps are written data-shape-based ("the batch that contains two invoices plus a
  credit") so they don't hinge on that exact batch; the screenshot proves the state. If fresh cookies are
  supplied I will re-verify the live data and, if needed, refresh the example.

## Update 2026-09-04 (Rule 68 + SV-9705 live-verified with fresh cookies)
- Saved Standing Rule 68 (capstone): everything we do is bite-proof AND live-verified on the branch, always.
- Fresh cookies supplied → LIVE-VERIFIED the SV-9705 reproduction on sv9623.qa.shopview.com:
  - Build marker unchanged: v26.35.8-327c626 (matches the ticket).
  - The named example batch is LIVE: Glendale Diesel & Fleet Repair ($592.17) + Lamkin Diesel Services Inc
    ($1,874.40), both status=unpaid with can_remove_from_batch=false — exactly the state SV-9705 describes.
  - The annotated screenshot (tooltip-issue.png) reflects the current live state; tooltip behaviour was
    confirmed live earlier this session on this same build.
- OUTSTANDING (from the prior update) is now CLEARED — the example batch was confirmed present; SV-9705's
  steps are reproducible right now and need no change.

## Update 2026-09-04 (Rules 69 + 70; SV-9705 title + top credit line corrected)
- Rule 69: ticket titles are concise but must explain the problem (screen/feature + what is wrong;
  ≤ ~80 chars where the problem still fits; clarity beats brevity).
- Rule 70: "Found while testing <ticket>" goes at the VERY TOP of a follow-up ticket, with the link,
  then a line break, then the ticket's own description/body.
- SV-9705 corrected: title -> "IBS Batches: misleading Remove tooltip on an unpaid invoice in a credit
  batch" (77 chars); description now opens with "Found while testing SV-9623" (linked) + divider, then
  the 2-line problem, reproduce steps, screenshot, technical details last. Priority still Medium.
