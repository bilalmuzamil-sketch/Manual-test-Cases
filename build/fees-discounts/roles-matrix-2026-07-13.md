# F&D roles matrix — re-derived live 2026-07-13 (qb env)

> Re-derived before the FD-HIST / FD-PERM VIU (Technician had drifted on the shared qb env).
> Org d55bc308-…; 11 system roles present. Only **admin** and **tech** can be logged in here
> (quick-login), so enforcement was probed with the **Tech** user's live permission set.

## Technician (Tech user) — live fe-permissions 2026-07-13
**HAS:** workOrdersCreateAndEdit, workOrdersDelete, workOrderLinesCreateAndEdit, workOrdersView,
customersView, catalogInventoryCreateAndEdit/View, scheduleView, vendorOrderManagement C&E/View,
woPickParts, woReviewWorkOrders, woTechViewMode. **view_mode = tech (financials masked).**
**LACKS:** See Financial Data, Manage Accounts Payable & Receivable, Customer Management: C&E,
Settings → Finance, Part Sales: C&E.
→ Drift vs old matrix: Tech now HAS workOrdersCreateAndEdit + workOrdersDelete +
workOrderLinesCreateAndEdit (previously lacked WO C&E). This makes the WO-C&E / Lines-C&E
NEGATIVE cases (FD-PERM-002/003, FD-PERM-009/FD-HIST-006 negatives) **not testable** here.

## Live enforcement probe (Tech), 2026-07-13
| Gate | Endpoint | Result | Case(s) |
|---|---|---|---|
| See Financial Data | GET /api/work-orders/view/{id} | sub_total masked to "0.00" | FD-PERM-001, FD-PERM-005, FD-HIST-005 |
| Settings → Finance | GET /api/adjustment-templates | **403 Access denied** | FD-TMPL-016, FD-PERM-007 |
| Customer Mgmt + Manage AP/AR | GET+POST /api/customers/{id}/default-adjustments | **403 / 403** | FD-CUST-015, FD-PERM-008 |
| WO history (Tech HAS WO/Lines C&E) | GET /api/work-orders/{id}/history | **200 with entries** | FD-PERM-009, FD-HIST-006 (positive) |

**Enforcement model (unchanged):** templates admin + customer-defaults are BACK-END enforced
(403). See Financial Data masks amounts in the payload. Whole-WO adjustment write is FE-only
(BUG-FD-3, FD-PERM-002) — not re-testable now (Tech has WO C&E). Invoiced/Paid block is
BE-enforced (409, FD-PERM-011). History endpoint is FE-only (returns entries regardless) — the
no-WO-C&E negative needs a real restricted-role login (not available: only admin/tech here).
