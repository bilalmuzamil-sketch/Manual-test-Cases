# Part Sales — design driving log (2026-09-30)

Design source: `Founder-Partssales.zip` (Claude design canvas export) + live artifact
https://claude.ai/artifact/JRh7EY87SWcHC9i3sm85K9 . The canvas `.dc.html` boards and their
embedded product screenshots were extracted from the `appifact-doc` record in `_t.html` to
`design/canvas/` (29 boards + 33 PNG screenshots + canvas.json). Every board's annotation text was
read; the key product screenshots were opened and zoomed. Boards are real screenshots: **before =
staging as it ships today, after = this build, work order = for comparison, new = no before exists.**

## States driven (opened & read)
- **c-doc-charged.png** — customer document, core charged: `Water Pump $517.55`, child `↳ Core charge
  $79.99`; Summary Parts **$597.54**, GST (5%) **$29.88**, Total **$627.42**. Tabs: Parts (1), Notes,
  Stats, Finance. Toolbar: Customer PO, Invoice Date, download/email/print/settings, **Add Deposit**,
  **Create Invoice**. Estimate/Invoice toggle. (S1-R13)
- **c-doc-returned.png** — same doc, core returned: adds child `↳ Core credit -$79.99`; Parts
  **$517.55**, GST **$25.88**, Total **$543.43**. (S1-R11, S1-R6)
- **c-doc-prereceive.png** (board Document_PreReceive) — estimate before receipt still prints the
  Core charge child + counts to totals. (S1-R13, post-release only)
- **c-returned-row.png** — parts grid: columns Description, Part Number, Quantity, Cost, Core, Sell
  Price, Margin, Category, Vendor, Requested At, Status, Fees & Discounts, Actions. Part row status
  Received with the Return-Core arrow in Actions; core row carries the **Returned** badge + ⋮. (S1-R22, S6)
- **c-returned-menu.png** — the ⋮ on a returned core offers **Cancel Return**. (S1-R5)
- **c-cancel-dialog.png** — "Confirmation / This will put that part back onto the part sale." with
  **Cancel** and **Put Back**. (S1-R5a)
- **s106.png** (DepositDialog_PartSale) — Create Deposit: Deposit Date, Payment Method, Deposit Amount,
  Reference Number, Memo pre-filled "Deposit for Part Sale P-196", Cancel / **Record Deposit**. Ship
  row adds **Collect in Portal** beside Record Deposit. (S8-R2, R7, R8)
- **s90.png** (Menu_After) — ⋮ menu: **Audit Log → Add Parts Sale Fee / Discount → Set status →
  Delete Part Sale**, all plain (Delete no longer red). (S4-R3, R4)
- **s87.png** (Tax_Editing) — Financial Info card with pencil; Item/Cost, Parts $290.91, Subtotal
  $290.91, **Taxes** select (GST), Total **$305.46** (green, recalculated), Balance $305.46, **Save**. (S3-R1/R2/R3)
- **s96.png** (Rep_After open) — header card P2-251, Complete, "Started: Today", **Sales
  Representative** field = "Unassigned", picker open reads "No results" (no reps flagged yet). (S5-R1/R2/N2/N4)
- **s101.png** (Actions_After) — the **Actions** column: primary button (**Order**) aligned under the
  Actions heading on a left rail, utility icons (trash, ⋮) pinned right. (S6-R1/R2/R3)
- **c-tabs-after.png** — tab bar reads **Parts (1)  Notes  Stats  Finance**. (S7-R5)

Board annotations for every area (Actions, Cores, Deposit, DepositDialog, Document, Log, Menu, Rep,
Split, Tabs, Tax; before/after/work-order/new) were read in full and used to ground preconditions and
step wording. Key Decision: the "before" boards were captured from staging (1,226 commits ahead of
production) and verified to hold for production.
