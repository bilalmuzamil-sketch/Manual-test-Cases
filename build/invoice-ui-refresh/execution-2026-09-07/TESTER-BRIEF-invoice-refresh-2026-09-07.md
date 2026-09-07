# Invoice Refresh — brief for the manual test team

**Date:** 7 September 2026 · **Where to test:** staging, `https://app.staging.shopview.com`
**Build this brief was prepared on:** `v26.35.9-9812433`
**Your test run:** R417 · **Your cases:** the "Invoice Refresh (Aug 2026)" folder
**Companion file:** `Invoice-UI-Refresh_Defects-for-Testers_2026-09-07.xlsx` — every case, with what to do

---

## Read this first

1. **One known problem is already reported. Do not raise it again.**
   The **work order number does not appear** on the Estimate or the Invoice. It is reported and is
   waiting on a product decision: **SV-9770**. When you reach the two cases about the order-reference
   row, expect the field to be missing, mark them failed, and **raise nothing new**.
   *If it fails in a different way from that, that IS new — please report it.*
2. **Everything else on the printed documents matched.** Every label the cases quote was checked
   against real documents produced by the build on the date above, and apart from the work order
   number they were all found, spelled as written.
3. **If anything looks off, mark it Blocked rather than guessing.** Never skip a case.

## The short version

| | Cases | What it means for you |
|---|---|---|
| **Ready to run** | **102** | Open the case and run it. You give the pass or fail. |
| **Needs a screen or record we could not cover** | **15** | Listed below. Run them once you can reach the state. |
| **Known difference, already reported** | **2** | Expect a fail. Do not raise anything new. |
| **Not ours** | **1** | Leave it alone. |
| **Total in the folder** | **120** | |

## What was checked for you, so you do not have to

- The documents were produced from the build itself and read back field by field.
- **Text sizes are correct.** Every size on the document matches what the specification asks for. An
  earlier problem where all the text printed at three-quarters size has been fixed.
- **The masthead is correct** — the shop's name, address and phone match the shop record exactly, and
  no price or status wording appears up there.
- **Addresses are correct.** "Bill To" spans the full width when there is no "Remit Payment To" block,
  which is what the design asks for. **"Remit Payment To" is missing on purpose** — it only appears
  when the shop is set up to be paid at a different address, and none of the three shops on staging is.
  That is not a fault.
- **The credit document was produced and checked** — it is headed "Credit: CM-…", carries an issue
  date, shows "Credit To" at full width, and correctly has no "Remit Payment To".

## The 15 that need something we could not set up

Run these when the state exists. None of them is known to be broken — they simply were not reachable
from the sample records.

| What it needs | Cases |
|---|---|
| The **authorizer entry screens** on the work order | 5 cases in "Authorizer Entry (Work Order)" |
| A **parts sale** with lines, taken through to an invoice | 8 cases in "Parts Sale Estimate and Invoice" |
| **Direct API checks** rather than a document | 2 cases in "API — Authorizer Entry" |

## States nobody produced this pass — worth creating as you go

Several cases describe a situation the sample work order never had. They are marked ready to run, but
you will need to create the state first:

- a **fully paid** invoice (for the paid date, the payments list and a zero balance)
- an invoice with **adjustments** (fees or discounts) on it
- a work order with a **declined line**, and the "Show declined work" option turned on
- a shop set up to be **paid at another address**, so "Remit Payment To" appears
- a work order with **no customer PO** and **no authorizer**, to check those fields disappear
- an asset with **no VIN and no serial**, and one with **no unit number**

## If you find something

Mark the case failed and tell the QA lead. Please include the work order or document number you used,
and say what you saw against what the case expected. Do not raise a ticket yourself.

## OUTSTANDING — what we are waiting on

| What | Who | What it blocks |
|---|---|---|
| A ruling on the **work order number** (SV-9770) | Chris Ward | Two cases in the order-reference row. Everything else can proceed. |
