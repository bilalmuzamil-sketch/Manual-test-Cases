# Dev follow-up ticket draft — PO subtotal rounding-method 1-cent gap

> **DRAFT ONLY — not filed to Jira.** Ready for the user to file (or ask me to). Found during SV-8721 QA on staging, verified live this session.

> **How to file (so the inline images render):** Create the ticket via the **Jira v2 REST API** with the **description in wiki markup**, AND upload **all three PNGs as attachments to the same issue**. In Jira, an attached image referenced as `!filename.png!` renders inline in the description — the `!filename!` refs resolve against the issue's own attachments, so the images must be attached to that exact issue. The GitHub raw links in the Evidence section are kept as a backup in case the inline attachments are not present.

---

## Title

PO aggregate total off by 1 cent between Receive Parts screen and Purchase Orders list (two rounding methods)

## Summary

A purchase order's aggregate total shows **$2,288.64** on the **Receive Parts** screen but **$2,288.65** on the **Purchase Orders list** for the same PO. The two screens use different rounding methods for the aggregate (sum-then-round vs round-each-line-then-sum), so they disagree by 1 cent. Display-only — every per-line cost and total is identical and correct; only the aggregate differs.

## Environment

- Staging: `app.staging.shopview.com` / API `api.staging.shopview.com`
- Workplace: Heavy Duty (9919), admin
- Feature under QA: SV-8721 5-decimal cost fix

## Steps to Reproduce

1. Create a work order.
2. Add multiple vendor parts whose full-precision unit costs have decimals beyond 2 places. Use these 6 costs (as used in the QA repro):
   - 124.96545
   - 122.99656
   - 40.99885
   - 0.123456 (stored, rounded to 5 dp, as 0.12346)
   - 999.00001
   - 1000.55555
   (qty 1 each, as used in the repro)
3. Order all 6 parts into one purchase order.
4. Open the **Receive Parts** screen for that PO and note the **"Subtotal:"** and **"Total:"** values.
5. Open the **Purchase Orders list** (`/parts/orders`) and note the **"Total Price"** value on that PO's row.
6. Compare the two aggregate figures.

## Expected

The two screens should show the **same** PO aggregate total. One consistent rounding method should be used for the PO aggregate across all surfaces.

## Actual

- **Receive Parts** screen — **"Subtotal:"** and **"Total:"** both show **$2,288.64**.
  Method: sum the full 5-decimal costs, THEN round once.
  124.96545 + 122.99656 + 40.99885 + 0.12346 + 999.00001 + 1000.55555 = 2288.63988 → **$2,288.64**

!ANNOT-a-receive-subtotal.png!

- **Purchase Orders list** — **"Total Price"** column shows **$2,288.65**.
  Method: round each line to 2 dp FIRST, then add.
  124.97 + 123.00 + 41.00 + 0.12 + 999.00 + 1000.56 = **$2,288.65**

!ANNOT-b-po-list-total-price.png!

- **PO Details** screen — shows **no** aggregate total at all (only per-line "Cost" at 5 dp and "Total Cost" at 2 dp; no Subtotal/Total row).

!ANNOT-c-po-details-no-total.png!

- The stored order total (`total_price_decimal`) = **2288.65** (matches the Purchase Orders list).

The 1-cent gap is not visible on any single screen; it only appears if a user flips between the Receive Parts screen and the Purchase Orders list and compares them.

## Impact & Scope

- **Display-only.** Every per-line **Cost** (5 dp) and per-line **Total** (2 dp) is identical and correct across all screens; only the aggregate differs by 1 cent.
- The **persisted / stored** total and the value that would flow to QuickBooks is **$2,288.65** (round-each-line-then-sum = `total_price_decimal`). The Receive-screen **$2,288.64** is a display-only sum-then-round and does **not** persist.
- Therefore **no stored-data corruption and no QuickBooks corruption** — the stored/QB-side figure is the correct penny-accurate $2,288.65.
- **Severity: low / cosmetic.** Worth aligning because these totals are money-facing and users compare screens.

## Not Verified

- A **live QuickBooks round-trip was NOT driven** this session — there is no reachable connected-QB company on staging (a real QB push needs a QB-connected company + a human in QuickBooks).
- The "QuickBooks receives $2,288.65" statement is the **ShopView-side stored-data answer** (`total_price_decimal` = 2288.65 + the per-line 2-dp costs that sum to $2,288.65), **not** an observed QB sync.
- If product wants certainty, a QuickBooks-connected verification is still **open**.

## Suggested Fix (dev-facing)

Pick ONE canonical rounding method for the PO aggregate and use it on every surface. Recommend matching the stored/QuickBooks value = **round-each-line-to-2dp-then-sum** ($2,288.65). Apply that method to the Receive Parts screen **"Subtotal:"** / **"Total:"** so all surfaces agree with the Purchase Orders list and the stored total.

## Evidence

Three annotated screenshots (attach all three to the issue so the `!filename!` refs above and below render inline):

Receive Parts screen "Subtotal: $2,288.64":
!ANNOT-a-receive-subtotal.png!

Purchase Orders list "Total Price $2,288.65":
!ANNOT-b-po-list-total-price.png!

PO Details screen, no aggregate total:
!ANNOT-c-po-details-no-total.png!

GitHub raw links (backup, in case the inline attachments are not present):

- https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/side-projects/SV-8721-5decimal-2026-07-27/evidence/discrepancy-locate/ANNOT-a-receive-subtotal.png
- https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/side-projects/SV-8721-5decimal-2026-07-27/evidence/discrepancy-locate/ANNOT-b-po-list-total-price.png
- https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/slack-session-0sxnd9/build/side-projects/SV-8721-5decimal-2026-07-27/evidence/discrepancy-locate/ANNOT-c-po-details-no-total.png

## Related

- **SV-8721** — the 5-decimal cost fix this was found alongside. SV-8721 itself is a **correct pass** (PO receive subtotal now matches the vendor invoice). This is a **separate, display-only follow-up**, not a regression of that fix.
