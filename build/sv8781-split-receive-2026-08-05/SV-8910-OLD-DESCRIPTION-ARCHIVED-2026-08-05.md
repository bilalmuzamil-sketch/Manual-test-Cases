# SV-8910 — the ORIGINAL description, archived before it was replaced

**Why this file exists.** On 2026-08-05 the QA lead asked for the ticket description to be rewritten
as simple, layman-followable steps with inline images and **nothing else** — so the *Impact*,
*Why it matters more now*, *Technical details for developers* and *Scope note* sections were removed
from the ticket. They are preserved here verbatim so nothing is lost, and the technical detail also
lives on the ticket itself in **comment 74583** (the re-test), which is richer than what was removed.

The replacement description uses the **simpler one-line reproduction** proved in the re-test, rather
than the original two-line one ($25 + $30 + $12 = $61), because there are fewer steps to get wrong.

**Then revised again the same day, on the QA lead's own reproduction.** He re-ran it with round
figures — **$100.00 and $200.00, invoice total $300.00** — and asked for the steps to use those
instead of the re-test's $7.11 / $103.03, and to be made easier still for a layman.

**THREE THINGS HE CAUGHT THAT THE STEPS HAD WRONG, all now fixed:**

1. **Reusing our literal invoice numbers breaks the next person.** Anyone following the steps
   verbatim hits *"this invoice number already exists"*. The steps no longer hard-code an invoice
   number at all — they tell the tester to **invent two unused ones** (initials + date, e.g.
   `AB-0806-1`), and repeat the **21-character limit** up front.
2. **The part names and descriptions were ours.** Changed to neutral `Sample part one` / `SAMPLE-1`
   and `Sample part two` / `SAMPLE-2`, different from anything we or he used.
3. **The screenshots are from the $7.11 / $103.03 run**, so with the steps now at $100 / $200 the
   numbers would have looked contradictory. Each image carries a **note strip** stating the example
   costs and that the behaviour is the same whatever costs are entered.

**One thing his screenshots revealed, now stated in Current behaviour.** His two delivery pages
(`S2-15896` and `S2-15897`, invoice `ZZ-CHK-M9`) each show the **correct** amount inside — $100.00
and $200.00. So **the delivery detail page is right and only the Vendor Invoices list doubles.**
That matches our API finding exactly: the *stored* header `total_price` is wrong, the list renders
that stored value, and the detail page recomputes from its own items. It is also why the defect is
easy to miss — and why a tester who clicks into a row could wrongly pass it.

**Honesty note (Standing Rule 12).** The **$300.00 / $600.00 figures in the current description
describe the QA lead's run, not one we observed end to end.** What we observed live was
**$110.14 written onto both rows** with a same-run control at exactly $7.11. The $300 figures follow
from the same confirmed mechanism — the whole invoice total is written to every purchase order in
the submission — and his screenshots corroborate the setup, but we did not personally see his
Vendor Invoices list.

---

## Original description, verbatim

> _Found while QA-testing SV-8781 on the sv8781 QA branch. It is NOT caused by that change — it
> reproduces identically in the legacy receive dialog and the SV-8781 PR description already calls it
> out as pre-existing and out of scope. Raised separately so it is not lost, because that fix makes it
> much easier to reach._
>
> ### What happens now
>
> When one vendor invoice is received in a single submission and its items belong to **two different
> purchase orders**, the system creates **one delivery record per purchase order** and stamps **the
> whole invoice total on each of them**. On Parts → Vendor Invoices the Total Cost column therefore
> shows the full invoice amount twice, so the invoice looks worth double what it is.
>
> ### What should happen
>
> Each row should carry only the portion of the invoice belonging to its own purchase order, so the
> rows add up to the invoice total. In the reproduction below that is $36.00 against one order and
> $25.00 against the other, totalling $61.00 — not $61.00 twice.
>
> ### Evidence
>
> **1. Parts → Vendor Invoices, Total Cost column. One invoice, two rows, $61.00 on each.**
> (image: ANNOTATED-1-duplicate-delivery-totals.png)
>
> **2. The receive screen that produced it — two items from two different purchase orders, one
> invoice number, subtotal $61.00.**
> (image: ANNOTATED-2-receive-that-caused-it.png)
>
> ### Steps to reproduce
>
> Environment sv8781.qa.shopview.com, build v3.5-fb6371c, signed in as Admin. Reproduced 2026-08-05.
> Every value used is named so this can be re-run without guessing.
>
> 1. Create a work order for customer **Aaborough Works** on asset **2020 Ford Transit**
>    (VIN 86J8FAC1VALJ43SJY). This became **S2-15888**.
> 2. Add two lines from the canned lines **"Service - 5th wheel adjustment"** and
>    **"Service - Steer hub oil"**, and approve them.
> 3. Add one vendor-sourced part to each line, both from vendor **Aabridge Beverages**: ZZ-L1 quantity
>    2 at cost $25.00, and ZZ-L2 quantity 2 at cost $30.00. Order both — they land together on
>    purchase order **S-15888**.
> 4. Partially receive ZZ-L1 — take 1 of the 2, under any invoice number (I used
>    ZZAUTOTEST-INV-PARTIAL). That leaves 1 outstanding.
> 5. Select the **"Service - 5th wheel adjustment"** line, open the line bulk-action menu and choose
>    **Split work order** — click the entry twice, since the first click arms it and turns it red and
>    the second performs the split. A new work order is created: **S2-15889**. ZZ-L1 is partially
>    received so it correctly stays on S-15888.
> 6. On the new work order S2-15889 add its own vendor part from the **same vendor** — ZZ-OWN quantity
>    3 at cost $12.00 — and order it. That creates a second purchase order, **S-15889**. S2-15889 now
>    has parts spanning two purchase orders.
> 7. Open the receive screen for S2-15889. Both items appear in one vendor block (correct — that is
>    what SV-8781 delivers). Enter **one** invoice number (I used ZZAUTOTEST-INV-MERGED), tick both
>    items and receive. Subtotal reads $61.00 — ZZ-L1's remaining 1 at $25.00 plus ZZ-OWN's 3 at
>    $12.00.
> 8. Go to **Parts → Vendor Invoices** and search for that invoice number.
> 9. Observe two rows for the single invoice — against orders S2-15889 and S2-15888 — with **Total
>    Cost $61.00 on both**, i.e. $122.00 recorded for a $61.00 invoice.
>
> ### Impact
>
> Money-facing and easy to miss. The per-item cost posts correctly against each purchase order, so
> stock and part costs are right — it is the invoice-header total that duplicates. Anyone reading
> Vendor Invoices, or any figure built from those rows, sees roughly double for an affected invoice.
> Only invoices whose items span more than one purchase order are affected.
>
> **Why it matters more now.** Before SV-8781, a work order whose parts spanned two purchase orders
> could not be received on one invoice at all — the state was effectively unreachable. With that fix
> it becomes a normal, expected flow, so this duplication moves from a corner case to something users
> will meet routinely.
>
> ---
>
> ### Technical details for developers
>
> **Observed on** sv8781.qa.shopview.com, app-version `v3.5-fb6371c` (index.html last-modified
> Wed 05 Aug 2026 13:18:47 GMT, etag `b1f24719a960bcc98f97804e81280dcf`). The receive was submitted
> from the work-order-scoped screen: `POST /api/orders/receive-requested-parts` → 200.
>
> Resulting delivery rows, read from `GET /api/inventory/deliveries`:
>
> ```
> invoice_number ZZAUTOTEST-INV-MERGED   order_number S-15889   total_price 61.00
> invoice_number ZZAUTOTEST-INV-MERGED   order_number S-15888   total_price 61.00
>
> actual composition:  ZZ-OWN  3 x $12.00 = $36.00   (order S-15889)
>                      ZZ-L1   1 x $25.00 = $25.00   (order S-15888)
>                      invoice total        $61.00
> ```
>
> Each delivery row receives the invoice-level total rather than the sum of the items belonging to its
> own order. The per-item posting itself is correct — S-15888 took ZZ-L1's remaining 1 and S-15889
> took ZZ-OWN's 3 — which is why this surfaces only on the invoice/delivery header figure.
>
> **Object ids for the reproduction.** Work orders S2-15888 = 4be9c3df-50c7-4ba0-91ba-4a1c7d6432b0,
> S2-15889 = 41309809-1312-495f-92b0-c551c3e44d61. Purchase orders
> S-15888 = 5ea83031-a32e-408a-b2dc-a7083989f4cb, S-15889 = a6e4bc4b-b381-43f5-9e52-98b175afca02.
> Vendor Aabridge Beverages = 1e7bd0bf-e882-45fa-8c21-835e32ffa374. The data is still in place on the
> QA branch.
>
> **Scope note.** Confirmed pre-existing and identical in the legacy receive dialog per the SV-8781 PR
> description, and explicitly excluded from that PR's scope. This is not a regression from SV-8781 —
> that ticket passed QA.
>
> _Raised from QA of SV-8781 and linked to it. Posted by Claude Code._

---

## UI labels verified live before the rewrite

Every label used in the replacement steps was read from the running build, not assumed:

| Step | Label / control | How it was verified |
|---|---|---|
| Create the work order | **Create Work Order** (`button_new_work_order`) | read from `/workorders` |
| Add a line | **New Line** → canned-line picker → approve checkbox → **Save & Close** | read from the work order lines screen |
| Add a part | the **Parts** tab's inline row: *Description · Part Number · Quantity · Cost · Core Charge · Sell Price · Margin · Category · **Vendor*** | read from `/workorders/{id}/part-requests` |
| Order it | a button labelled **Order** (`button_part_request_action`) on the part row | seeded an unordered part and observed the control |
| Receive it | a button labelled **Receive** on the part row, and **Receive** per row under **Parts → Purchase Orders** | seeded an ordered part and observed both |
| Split | the **⋮** button above the lines list — **`aria-label="Line bulk action"`, and it is DISABLED until a line's checkbox is ticked**; menu reads *Set line status · Delete lines · **Split work order*** | ticked a line and opened the menu |
| See the result | **Parts → Vendor Invoices** (`/parts/deliveries`) | read live, with the ZZ-CHK rows visible |

**Two traps a manual tester would otherwise hit**, now called out in the steps: the **⋮ is greyed out
until a line is ticked**, and **the invoice number field rejects anything over 21 characters**
(*"Invoice number is too long. Max length is 21 characters."* — hit during our own testing).
