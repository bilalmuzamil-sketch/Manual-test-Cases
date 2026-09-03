# OBSERVED UI LABELS — sv9315.qa.shopview.com, build `v26.35.6-598cc8a`, read 2026-09-01

**What this file is for.** `check_runnable_cases.py` proves a precondition is tester-SHAPED. It says so
in its own header: it **cannot** prove the route it names is CORRECT. On 2026-09-01 that gap cost real
work — **117 preconditions named a permission called “Work Order Line - Create and Edit” and 90 named
“Work Orders → Work Order View Mode”, and neither string exists on the screen.** A tester would have
hunted for them and never found them.

So this is the other half of the check: **the labels actually seen on the build, verbatim**, with where
they were seen. `build/testing-tools/check_precond_labels.py` compares the quoted labels in a suite's
preconditions against this list and fails on any label that has never been observed.

**Rules for this file.** A label goes in ONLY when it was read off the served page in a probe whose
evidence is committed. Never from an API field name, never from a spec, never from memory. Each row
names its evidence.

## Top navigation and global chrome

| Label | Where | Evidence |
|---|---|---|
| `Work Orders` | top menu | probe_neg R1, probe_precond_labels |
| `Schedule` · `Customers` · `Parts` · `Reports` | top menu | probe_neg R1 |
| `Search` (with `Ctrl+K`) | top menu | probe_neg R1 |
| `Clock In` | top menu | probe_neg R1 |
| `Settings` | the menu behind your name, top right | probe_precond_labels accountMenu |
| `Edit Profile` · `Change Location:` · `My Timesheets` · `Customer Portal` · `Logout` | same menu | probe_neg R1 |

## Settings sidebar

| Label | Evidence |
|---|---|
| `Roles & Permissions` · `Staff` · `Locations` · `Departments` · `Taxes` | probe_precond_labels |
| `Pricing` · `Bin Locations` · `Categories` · `Inventory` · `Invoices` | probe_precond_labels, probe_nobin |
| `Feature Flags` · `Labor Rates` · `Canned Lines` · `Fees & Discounts` | probe_neg R0 |

## 🔑 The role edit screen — `/administration/roles-permissions/<id>/edit`

**Read verbatim 2026-09-01; evidence `build/inline-add-edit-parts/build-verify-2026-09-01/evidence/precond-role-edit.png`
and `/tmp` probe `roleedit.mjs` output quoted in full in the label-fix pass's own header.**

| Section | Its description on screen | Its controls |
|---|---|---|
| `Work orders` | "Manage work orders the core operational records in ShopView." | `View` · `Create & Edit` · `Delete` |
| `View mode` | "Controls interface complexity, not access controls." | `Full View` · `Tech view` |
| (loose toggles) | — | `Review work orders` · `Pick parts` · `Order parts` |
| `Work order lines` | "Add, edit, and remove the individual labor and part lines on a work order." | `Create & Edit` · `Delete` |
| `Schedule` · `Customers` · `Invoicing & payments` · `Timesheets` | — | `View` · `Create & Edit` · `Delete` |
| `Parts Department` | "Manage parts inventory, catalog, sales, and vendor operations." | — |
| `Cross-Cutting Toggles` | — | `See Financial Data` · `View and Manage AP/AR Data` |
| footer | — | `Delete Role` · `Reset To Template` · `Cancel` · `Save` |

**🛑 THESE DO NOT EXIST AND MUST NEVER BE WRITTEN INTO A CASE:**
`Work Order Line - Create and Edit` · `Work Order View Mode` · `Work Orders → Work Order View Mode`.
The right wording is **the “Work order lines” section’s “Create & Edit” toggle** and **the
“Work orders” section’s “View mode”, set to “Full View” or “Tech view”**.

## The work order screen

| Label | Where | Evidence |
|---|---|---|
| `Lines` · `Parts` · `Notes` · `Stats` · `Finance` | tabs on the work order | last3-line-complete.png |
| `New Line` · `Complete Work Order` · `Mark Reviewed` | toolbar | probe_precond_labels linesTab |
| `Approve` · `Decline` | on a line's row | probe_precond_labels, last3-line-complete.png |
| `Story` (placeholder "Add tech story for this line") | a line's own row | last3-line-complete.png |
| `Labor` · `Parts` | row labels within a line | last3-line-complete.png |
| `+ Add Part` | in a line's Parts section | many |
| `edit` (icon) | right-hand end of a part row — **opacity 0 until hover, measured 0 → 1** | probe_precond_labels hoverRevealsEdit |
| `Needs Approval` · `Authorized` · `Declined` · `Complete` | line status badge | probe_print3, last3-line-complete.png |
| `Quoted` · `Requested` · `In stock` | part request status | probe_neg, pick2 |

## The work order More menu (the three dots, top right) — **ITS CONTENTS DEPEND ON THE STATUS**

Read live 2026-09-01 on two work orders (`/tmp/moremenu.mjs`):

| Work order | Menu, verbatim and in order |
|---|---|
| S9315-14846, **Estimate** | `Audit Log` · `Timesheets (0)` · `Add Work Order Fee / Discount` · `Print Work Order` · `Delete Work Order` |
| S2-15522, **Paid** | `Audit Log` · `Timesheets (4)` · `Print Work Order` — **three items; no Fee / Discount, no Delete** |

**Note the separator: `Fee / Discount` with a SLASH.** An earlier note in this repo transcribed it as
`Fee & Discount` and I copied that into the first version of this file — the label gate then flagged 42
correct cases as wrong. **The cases were right and my reference file was wrong.** That is exactly why
the rule at the top of this file says a label goes in only from a probe with committed evidence, never
from a note. The `Timesheets` item carries a live count in brackets, so it is never a bare
`Timesheets`.

## The inline part row

`Description` · `Part number` · `Qty` · `Category` (default `Uncategorized`) · `Cost` · `Sell price` ·
`More options` · `Save` · the close `×`. In Tech View the close control is labelled `Cancel`.
Evidence: /tmp/rowdump.mjs, probe_bins, probe_full.

Modals: `New Part Request` · `Edit Part Request` (fields `Part Number`, `Description`, `Quantity`,
`Source`, `Category`, `Vendor`, `Cost`, `Core Charge`, `Sell Price`, `Margin %`; buttons
`Cancel Order`, `Save & Close`). `Split across bins…` in the More options menu. `Pulled from` beside
the bin chip. Evidence: probe_gaps C3b, probe_bins.

## Dialogs and messages seen verbatim

| Text | When | Evidence |
|---|---|---|
| `Customer is a required field` | Save on New Work Order with no customer | probe_print5 |
| `Asset is a required field` | Save with no asset | probe_print5 |
| `Line can`t be completed with unfulfilled part requests.` | completing a line with an unpicked part | probe_last3, pick2 |
| `Status transition from authorization_required to complete is not allowed` | jumping a line status | probe_last3 |
| `Enter a description, qty, cost and sell price to save this part.` | incomplete inline save | probe_gaps TD2 |
| `Qty must be greater than 0.` | qty 0 | probe_gaps TD2 |
| `Sell price is below cost.` | sell under cost — does not block | V-message-hunt |
| `Discard this part?` / `Keep Editing` / `Discard Part` | unsaved-row guard | M-second-row |
| `Part added` | successful inline save | probe_last3 |

## Parts area

`New Inventory Part` dialog: `Catalog Part` · `Vendor` · `Category` · `Manufacturer` · `Cost` ·
`Sell Price` · `Core Charge` · `Min` · `Max` · `Tags` · `Inventory` · `Bin Location`
(default `General Storage`) · `Quantity` · `Default` · `Add Bin Location` · `Save`.
Settings › Pricing: `Pricing Matrices(22)` · `Fixed Rules(30)` · `New Price Matrix`, one matrix marked
`Default`. Evidence: /tmp/parts_form2.mjs, /tmp/pricing.mjs.

## The audit history — route, window title and event wording (added 2026-09-02)

**Evidence: the QA lead's own screenshots of `sv9315.qa.shopview.com/workorders/98d0e444-4ad2-4ee6-bc8a-32aa033790f0/lines`,
sent 2026-09-02.** Six screenshots, two of them the same view at different resolutions.

| Thing | Verbatim on screen |
|---|---|
| the button that opens the menu | the **three-dots** button at the top right of the work order, between `SHOPCOACH ANALYSIS` and the `New Line` button |
| the menu item that opens the history | **`Audit Log`** — the FIRST item in the menu |
| the menu, on an **Approved** work order | `Audit Log` · `Timesheets (0)` · `Add Work Order Fee / Discount` · `Print Work Order` · `Delete Work Order` (five items, confirming the status-dependence recorded above) |
| the window that opens | titled **`Work Order Log`** — **NOT** "Audit Log". The menu item and the window it opens have different names |
| its controls | a **`Search`** box |
| its columns | `Event` · `User` · `Line` · `Details` · `Date` · `Time` |
| the print event, verbatim | **`Work order printed`** — sentence case |
| a print row's other cells | `User` = the person (e.g. `Admin ShopView`, `Viktoria Videnovic`) · `Line` = `-` · `Details` = `Total: $6,389.62` · `Date` = `Sep 2, 2026` · `Time` = `02:11 AM` |
| another event seen in the same window | `Line created`, which DOES carry a line name in its `Line` column (`Replace - Brake pot`) |

### 🛑 `Work order printed history` DOES NOT EXIST. It was my own reading error.

The 2026-09-01 pass recorded the event as **"Work order printed history"** and raised a **wording
divergence** against the requirement's "Work Order Printed". **There is no divergence** — the build says
`Work order printed`, and the only difference from the requirement is capitalisation.

**Where the phantom word came from.** `build/printer-friendly-wo/build-verify-2026-09-01/tools/probe_print3.mjs`
line 52 read every row as `tr.innerText`, flattening the whole row into one string:

```
"Work order printed history Admin ShopView - Total: $1,682.39 Sep 1, 2026 10:35 AM"
```

The `Event` cell contains the event name **and a clock icon** whose own text is `history`. Flattening the
row glued the icon's text onto the label. Every other word in that string is a different column.

**The lesson, which is now a rule of this file:** a label is read from **the smallest element that owns
it** — the specific cell, mapped to its column header — never from a container's flattened `innerText`.
And a label that reads like broken English ("printed history") is the tell: go and look again before
reporting a divergence.

## Two labels confirmed 2026-09-02 by scanning the front-end bundles

**Why this method, and its limit.** The QA lead's build session was renewed on 2026-09-02, but the
front end still would not render (its own `/api/api/sso/check` answers 404 on this build and the
single-page app falls back to the sign-in form), while **the API host answers normally**. So the two
labels below were confirmed by fetching the app's JavaScript chunks and searching them, 400 chunks
scanned — every string the interface can display is in there.

**The limit is measured, not assumed.** Four labels already proven by screenshot were scanned as
controls: `Work order lines` and `Create & Edit` were found, **`View mode` and `Tech view` were not**
(the scan hit its 400-chunk cap). **So this method can confirm that a label EXISTS; it can never prove
one does not.** No negative result from a bundle scan may be reported as "this label does not exist".

| Label | Which chunk carries it | What that tells us |
|---|---|---|
| **`Approves Work`** | `ContactDialog.DtOfuEGu.js` | it is a tick on the **customer contact** form, not a permission. Reached by `Customers` → open the customer → the `Contacts` tab → the edit icon on the contact's row |
| **`Part Sales`** | `index.Bl7X34W2.js`, `Parts.CYvVBS1a.js`, `Customer.Dgsv6YDE.js` (7 chunks) | it is a section under the top-menu `Parts` area, and it also appears on the customer screen |

**Both were quoted by Invoice UI Refresh cases that the label gate had flagged as unconfirmed
(C44919, C44920, C44921, C44985). The cases were RIGHT** — they already describe `Approves Work` as a
tick on the contact form, reached exactly that way. **The gap was in this file, not in the cases**, and
no case needed changing. That is the second time in two days the gate flagged correct cases because
this reference was incomplete rather than because the cases were wrong (the first was `Fee / Discount`,
42 cases). **When the gate flags a label, check this file before you touch a case.**

## Build marker moved

This file was written against **`v26.35.6-598cc8a`**. On 2026-09-02 the branch serves
**`v26.35.6-0f8d60b`** (read from the `app-version` meta tag). Every label above was either read off a
screenshot taken on the new build or found in the new build's own chunks; the role-screen rows recorded
earlier were re-confirmed against the 2026-09-02 screenshots and are unchanged.

## Invoice UI Refresh labels — confirmed 2026-09-02 by a COMPLETE bundle sweep

**The sweep was exhaustive this time: 611 chunks, queue emptied, no cap reached — and ALL SIX control
labels came back FOUND**, including `View mode` and `Tech view`, which a truncated 400-chunk run had
missed. So this run's negatives carry weight (a string could still be assembled at runtime, which is
exactly what happened to one of them below).

| Label, verbatim | The chunk that owns it — i.e. which screen |
|---|---|
| `Invoice #` | `OpenInvoicesCard` — the customer's invoice list column |
| `Print credit memo` | `UnpaidTransactionsTable`, `TransactionsPaymentsTable` — the print icon's tooltip on a transaction row |
| `Open only` | `UnpaidTransactionsTable`, `DepositsTable` — the default-on filter on those tables |
| `Show declined work` | `InvoiceContentSettings` — a document option |
| `Summarize labor total` · `Summarize parts total` | `Invoice`, `InvoiceDetails` |
| `Show % on Estimates and Invoices` | `WorkplaceDialog` — a shop setting |
| `New Payment` · `Add Deposit` | `InvoiceActionBar` |
| `Issue Credit` | `UnpaidTransactionsTable`, `IssueCreditMemoDialog` |
| `Send Email` | `UnpaidTransactionsTable`, `OrderItems` |
| `Invoice created` · `Invoice downloaded` · `Invoice emailed` | `WorkOrderHistory` — event names in the history window |
| **`View mode` · `Tech view`** | `WoSettingsRow` — confirming the role-screen rows recorded earlier |

### 🛑 The document toggle is `Estimate/Invoice` — NO SPACES around the slash

`InvoiceContentSettings.Cvu7znOs.js` carries it verbatim:

```
class:"invoice-toggle", color:"primary", label:"Estimate/Invoice"
```

**89 of our cases write it as `Estimate / Invoice`, with spaces.** That is the same control and no tester
is misled, so **the cases were not rewritten** — 89 editor writes for two spaces is churn with a
clobbering risk and no benefit. Instead `check_precond_labels.py` now collapses spacing **around a
separator** before comparing, so `Estimate / Invoice` matches `Estimate/Invoice`. A **different**
separator character is still caught: `Fee / Discount` does not normalise to `Fee & Discount`.

### Two of the four "not found" were never labels

`GST# 812694966 RT0001` (C44957) and `CM-` (C44964) are **data**, quoted in the cases as examples of a
tax identifier and of a credit number's prefix. The gate now skips quoted strings that look like data
(a `#` followed by digits, a run of four or more digits, a bare `XX-` prefix, a money amount) instead of
sending someone to hunt the screen for a value.

### `Remit Payment To` is on the printed page, not in the front-end

C45168 quotes it, and the sweep did not find it — **expected**: it is a block of the printed document,
rendered server-side into the invoice template, so no front-end chunk contains it. It is present
verbatim in the design document, and the suite's 2026-08-31 pass verified it on the printed output.
**A printed-document string can only be confirmed from the rendered document, never from a bundle scan.**

## The printed credit note — route and labels (QA lead's screenshot, 2026-09-02)

**This is the route the 2026-08-31 pass searched 13 candidate API routes for and never found.** It was
never an API route: it is a per-row action in the customer's invoice list.

**Route:** top menu **`Customers`** → open the customer → the **`Invoices`** tab (its label carries a
count, e.g. `Invoices (2)`) → the row whose **`Type`** column shows the orange **`Credit`** chip and
whose **`No.`** begins **`CM`** → the **print icon in the `Action` column**, whose tooltip reads
**`Print credit memo`**.

| Thing | Verbatim on screen |
|---|---|
| the tab | `Invoices` with a count — `Invoices (2)` |
| sibling tabs | `Work Orders` · `Part Sales` · `Contacts (2)` · `Assets (2)` · `Notes` · `Invoices (2)` · `Payments (1)` · `Deposits` · `Fees & Discounts (0)` |
| the table's columns | a select checkbox · `Date` · `Type` · `No.` · `Memo` · `Total` · `Balance` · `Status` · `Action` |
| the type chip on a credit | **`Credit`** (orange) — an ordinary invoice shows **`Invoice`** (blue) |
| a credit's number | begins **`CM`**, e.g. `CM8218-4189` |
| a credit's status | **`Unapplied`** |
| a credit's money | `Total` and `Balance` are NEGATIVE, e.g. `-$500.00` |
| the toolbar above the table | `Balance: $562.26` · `Search` · a **`Open only`** toggle, **ON by default** · a download icon · an email icon · a print icon · `Issue Credit` · `New Payment` |
| the row's own print icon | tooltip **`Print credit memo`** |

**⚠️ THE SCREENSHOT IS NOT FROM sv9315.** Its credit number is `CM8218-4189` and its shop reads
`Staging Heavy Duty - 9919` — so it comes from the **sv8218 / staging** data set. Walked the same route
on **sv9315** with a signed-in browser on 2026-09-02: **no credit exists on the first 120 customers**
(read at `data.response.collection`, the correct key). **So the route is confirmed and the DATA is
absent on sv9315** — the 12 Credit Invoice cases still need either a seeded credit on that branch or a
run on the environment the screenshot came from. Two different gaps; do not conflate them.

## 🛑 A LABEL BEING REAL IS NOT THE SAME AS IT BEING ON *THAT* SCREEN (2026-09-02)

**The gate's blind spot, found the hard way.** 21 Invoice UI Refresh cases told a tester to find a
credit by its number **"in the `Invoice #` column"** of the customer's `Invoices` tab. **That tab has no
such column.** Its columns are, read off the screen and confirmed by the QA lead's screenshot:

```
(select checkbox) · Date · Type · No. · Memo · Total · Balance · Status · Action
```

**`check_precond_labels.py` passed all 21** — because `Invoice #` **is** a real label in this build; it
lives in the `OpenInvoicesCard` component, a different screen. The gate asks *"does this string exist
somewhere in the build?"* when the question a tester needs answered is *"is it on the screen this case
sends me to?"*

**⇒ Two consequences, both now in force:**
1. **This file records the SCREEN each label belongs to**, not just the label. A bare list of strings
   cannot catch a right-label-wrong-screen error.
2. **When a case names a column, a tab or a field, check it against the columns of the screen its own
   route names** — the route is in the case's preconditions, and the columns are in the route registry
   (`node build/testing-tools/route_registry.mjs find "<thing>"`). A label lifted from another screen
   is exactly as useless to a tester as one that does not exist.

Fixed on all 21 by surgical replacement (`the "Invoice #" column` → `the "No." column`), 33 occurrences
across preconditions and steps, every write verified byte-identical apart from the replacement:
`build/invoice-ui-refresh/column-fix-2026-09-02/`.

## Credit states, and how a credit is APPLIED — read off sv8218, 2026-09-03

**Why this section exists.** Six Credit Invoice cases (C45180–C45183, plus a line each in C44967 and
C44968) were `NOT VERIFIED` on 2026-09-02 for want of a credit in a state other than `Unapplied`. The
QA lead's instruction was *"Always seed data, never stay blocked"*, so the states were seeded on the
disposable branch and the route that produces them is recorded here.

**THE ROUTE — a credit is applied from the INVOICE side, never from the credit's own row.** The credit
row's `Action` column offers only three things, confirmed by hovering every icon (the tooltips are
hover-only Quasar tooltips, absent from the DOM until hovered): **`Print credit memo`**, **`Cash Out`**,
**`Reverse`**. There is no "apply" action on it. Applying is done here:

```
Customers → open the customer → the "Invoices" tab
  → tick the credit row AND the unpaid invoice row TOGETHER
  → "New Payment"
```

**Ticking the invoice alone is what made an earlier attempt fail.** With only the invoice ticked, the
`Amount to credit` box reads `0.00` and typing into it simply ENLARGES the payment — the invoice gets
paid by method and the credit stays `Unapplied`. With both rows ticked the dialog grows an extra row
for the credit and consumes it.

**The New Payment dialog, verbatim** (`POST /api/customer-account/create-customer-payment`):

| What it shows | Verbatim |
|---|---|
| Fields | `Payment date` · `Payment method` · `Reference number` · `Memo` |
| Table columns | `No.` · `Date` · `Due` · `Balance` · `Payment` |
| The credit's own row | `Credit` · the credit number · `Today` · and a phrase saying what will happen to it |
| Those phrases | **`Fully consumed -$600.00`** · **`Not needed — invoice fully covered`** · **`Applies $300.00 · $300.00 remaining`** |
| Below the table | **`Amount to credit: $`** · **`Payment amount: $8,000.85`** |
| Buttons | **`Make payment`** · **`Send to Terminal`** |

`Make payment` is **disabled until a `Payment method` is chosen**, even when the whole amount is being
covered by a credit. The methods offered are `EFT, Visa, Cash, E-transfer, Check, Gift card, Amex,
Debit, Payroll deduction, Mastercard, Applied credit, Exmerce`.

**The credit statuses this build actually renders**, read from the customer's `Invoices` tab and from
`/api/customer-account/list-unpaid-transaction` (`data.response.collection`, fields `status` and
`status_label`):

| `status` | `status_label` | Seeded as |
|---|---|---|
| `unapplied` | `Unapplied` | issue a store credit and leave it |
| `applied` | `Applied` | **CM-4194** — $600 credit, $600 consumed against invoice S2-16654 |
| — | `Partially applied` | seen on a **deposit** (`DEP-4704`); see the caution below |
| — | `Held` | a deposit that has not been used |
| — | `Voided` / `Refunded` | `POST /api/credit-memos/{id}/void` · `/cash-out` |

**⚠️ A DEPOSIT ON THE ACCOUNT WILL EAT THE PAYMENT BEFORE THE CREDIT DOES.** The dialog lists **every**
available credit and deposit automatically, not only the rows that were ticked. A partially-applied
credit therefore has to be seeded on an account with **no deposit sitting on it** — the first attempt
produced `Not needed — invoice fully covered` against the credit and consumed a $600 deposit instead.

**⚠️ AND A BUNDLE SCAN CANNOT ANSWER THIS QUESTION.** An exhaustive sweep of this build's front end
(**608 chunks, queue emptied, no cap**) finds `Unapplied`, `Applied` and `Refunded` but **not**
`Partially applied` in any casing. That negative says nothing about the printed credit note: the PDF is
rendered **server-side** (`GET /api/credit-memos/{id}/pdf`), so its status wording never passes through
these chunks. The status a case asserts must be read off the rendered document, not the bundle.
