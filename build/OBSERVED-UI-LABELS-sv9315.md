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
