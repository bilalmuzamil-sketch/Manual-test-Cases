# Printer Friendly Work Orders (6617) — execution on sv9315, 2026-09-10

Run **[R419](https://shopview.testrail.io/index.php?/runs/view/419)**, build **v26.36.0-f43b2fd**,
epic **SV-9383**. All 44 cases are ours (`created_by = 3`) — none foreign, none of Vladimir's.

## Story SV-9384 — the More menu (C45084–C45091)

| Case | Verdict | What was seen |
|---|---|---|
| [C45084](https://shopview.testrail.io/index.php?/cases/view/45084) | **Passed** | `Print Work Order` present (`menu_item_print_work_order`) |
| [C45085](https://shopview.testrail.io/index.php?/cases/view/45085) | **Passed** | exact label, no icon; no item in the menu has one |
| [C45086](https://shopview.testrail.io/index.php?/cases/view/45086) | **Passed** | 4th of 5 — below Timesheets, above Delete |
| [C45087](https://shopview.testrail.io/index.php?/cases/view/45087) | **Passed** | the browser print request fires exactly once |
| [C45088](https://shopview.testrail.io/index.php?/cases/view/45088) | **Blocked** | present on all 5 statuses this branch has; 3 of the 8 do not exist here |
| [C45089](https://shopview.testrail.io/index.php?/cases/view/45089) | **Passed** | present at desktop and at 390×844 |
| [C45090](https://shopview.testrail.io/index.php?/cases/view/45090) | **NOT OBSERVED** | see below — the precondition could not be built |
| [C45091](https://shopview.testrail.io/index.php?/cases/view/45091) | **Passed** | disabled at 0.6 opacity while the line request was held; enabled once loaded |

The menu on an editable work order: `Audit Log · Timesheets (0) · Add Work Order Fee / Discount ·
Print Work Order · Delete Work Order`. On **Paid** it is the shorter `Audit Log · Timesheets (0) ·
Print Work Order`. The toolbar menu's own id is **`button_work_order_nav_bar_menu`**.

## 🛑 C45090 — NOT OBSERVED, and why it must not be reported

`workOrdersView` **cannot be removed from a role on this branch.** `PUT /api/roles/{id}` with the
permission filtered out returns **200**, and the read-back still lists it:

```
sent:      customersView, workOrderLinesCreateAndEdit, woTechViewMode, woPickParts, scheduleView
read back: customersView, workOrderLinesCreateAndEdit, woTechViewMode, woPickParts, scheduleView, workOrdersView
```

So the "user who cannot view work orders" never existed, and anything observed about that user says
nothing about the case. **A 200 is not evidence a write took effect** — the same trap as
`parts/change` accepting a `bins` array and ignoring it (L0029). The role was verified intact
afterwards: `view_mode: tech`, all 6 permissions.

Whether the API silently re-adds `workOrdersView` as a base permission, or rejects its removal
without saying so, is itself worth a question — but it is not this case's finding.

## Two probe bugs caught before they became false defects

1. **The wrong three-dots.** A work order page has one More menu on the toolbar and **one per line**.
   Taking the last one opened a line's menu (`menu_item_add_labor_adjustment_<lineId>`, holding only
   "Add Labor Fee / Discount") and made Print look **absent** on every work order that has lines.
   Only Paid looked right — because it has no lines. **The tell: a result that varied with something
   structurally irrelevant.** Fixed by excluding anything inside `table_work_order_lines` or carrying
   a per-line id.
2. **A menu that never opened.** The `ready_for_review` work order first reported `menuOpen: false`,
   which the probe recorded as "print absent". It is not a reading at all. Retried with a longer
   wait: the menu opens and Print is present.
