# What release v26.43.5 (77de68c) changed in Custom Roles & Permissions

Compared with: **v26.43.3 (439ddb6)**. Checked on 2026-11-03.

This was read from the app itself. It shows how the app is built; nothing here has been tested by a person yet.

| Priority | Change |
|---|---|
| Low priority | New protected action: Creating or running work orders › lead change undo |
| Low priority | Screens that depend on “Settings — App” changed |

## Changes to what people see on screen (1)

### Screens that depend on “Settings — App” changed
**Low priority.** The app now shows or hides things based on this permission in a different set of places (before: 16, now: 17).

Why it matters: A button, menu item or page may now appear or disappear for some people.

Before: 16 places → Now: 17 places

How to check it (suggestions, not proof):
1. Log in as someone with “Settings — App”: the related buttons, menus and pages are shown and work.
2. Log in as someone without it: they are hidden.

Test result: Not Tested · Approval: Not documented


## Behind-the-scenes checks (1)

### New protected action: Creating or running work orders › lead change undo
**Low priority.** There is a new action in the app (creating or running work orders › lead change undo). Only people with one of 14 permissions (for example “Invoicing & Payments — Create & Edit” or “Part Sales — Create & Edit”) can use it.

Why it matters: A new feature: make sure the right people can use it and nobody else can.

How to check it (suggestions, not proof):
1. Log in as someone whose role has one of the permissions listed and try it: it should work.
2. Log in as someone whose role has none of them and try it: it should be blocked, and the button or page should not be shown.

Test result: Not Tested · Approval: Not documented

---

## Technical details (for developers)

Compared snapshot `impl-v26.43.3` with `impl-v26.43.5`, engine 1.2.0.

- **New API endpoint guarded by a permission: POST /api/work-orders/{workOrderId}/lead-change-undo** — Low: New capability; confirm the guard matches the permission the PRD/story names. Before `— (endpoint did not exist)` → now `attribute: PermissionEnum::ROLE_WORK_ORDER_CREATE_AND_EDIT`. Evidence `{"controller": "api/src/VehicleService/WorkOrders/UI/HTTP/Board/UndoLeadChangeController.php::__invoke"}`
- **Screens that use "Settings — App" changed** — Low: Front end now reads this permission in different places — a screen may show/hide differently. Before `16 file(s)` → now `17 file(s)`. Evidence `{"files_added": ["app/src/components/ts/work-orders/displays/composables/useAddTechnician.ts"], "files_removed": []}`