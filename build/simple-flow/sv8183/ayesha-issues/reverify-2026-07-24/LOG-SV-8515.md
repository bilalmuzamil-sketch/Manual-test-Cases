# SV-8515 — LIVE re-verification log (2026-07-24)

Issue (Ayesha): Office user (real prereq = Vendor & Order Management: VIEW only) has no per-PO
Receive button but can multi-select POs -> "Receive Selected" -> bulk receive "same as Admin".
Ticket: Ready to Fix.

## Env / role / state
- app/api.staging.shopview.com, org d55bc308, workplace Heavy Duty 9919 (b3c8c820).
- Role vehicle: Office User role d704c465 (V&O View only). Impersonated via POST /api/switch-user on
  confirmed test acct henry.hess@staging.shopview.local (temp reassigned to Office; restored after).
- Reset-to-template / drift RULED OUT (Rule 26): Office live fe_permissions 25/25 == template, CLEAN
  (role-drift-before-2026-07-24.json). Impersonated session: vendorOrderManagementView=true,
  vendorOrderManagementCreateAndEdit=FALSE, seeFinancialData=true. Reproduced on a CLEAN template role.

## Live observations (evidence files in this folder)
1. Per-PO Receive button HIDDEN for Office on /parts/orders (matches Ayesha). sv8515-office-parts-orders.png
2. FE GAP CONFIRMED: after multi-select, "Receive Selected" button IS shown; opens full /bulk-receive
   "Receive Vendor Parts" screen with editable invoice#, date, cost $, tax (33 inputs) + Receive Parts /
   Receive All submit. None FE-gated for View-only. sv8515-office-after-select.png, sv8515-bulk-receive-screen.png
3. BE ENFORCES / actual receive BLOCKED: driving the real Receive All fires POST /api/inventory/orders/accept
   -> HTTP 403 {"errors":[{"error":"Access denied."}]}. Receive does NOT complete. sv8515-recv5-after.png, sv8515-recv5-net.json
   Control: same empty accept body = 400 (validation) for Admin vs 403 (Access denied) for Office => real BE gate.
   receive-view (the read) = 200 for Office, which is why the editable screen loads.

## VERDICT
REAL FE gap (dev-accepted) BUT NOT a data-layer permission bypass; our prior report was INCOMPLETE.
- REAL bug: multi-select "Receive Selected" -> /bulk-receive path + editable receive screen are exposed to a
  Vendor&Order-Mgmt VIEW-ONLY user though the per-PO button is correctly hidden. FE route guard should require
  Vendor&Order Mgmt: Create&Edit (hasPartsPermissions).
- NOT a bypass: backend denies the actual receive (accept -> 403); no PO received, no inventory mutated.
  Ayesha's "receive same as Admin / bypass permission model" is OVERSTATED at the enforcement layer -> the true
  defect is a misleading dead-end FE, not privilege escalation. (Inverse of Rule 24: FE over-exposes, BE blocks.)

## Spec wording deviated from (Rule 25)
- requirements.md §9.1: "Bulk Receive page (accountant, PO-list driven) | 7/8/9 | Vendor & Order Mgmt: Create & Edit
  (route gate hasPartsPermissions) + See Financial Data for cost/sell edit."
- §9.2 Office row Bulk Receive = "No (4)", footnote 4: "Office has Vendor & Order Mgmt: View only -> can open Bulk
  Receive but cannot receive." => BE matches spec (receive blocked). FE deviates by exposing the Receive Selected
  entry point. Dev fix (require C&E to reach Bulk Receive) is a stricter, acceptable tightening.

## Our cases that missed it / coverage gap
- SF-PERM-03 / C29407 (cases/view/29407): verdict "Office cannot receive" correct at BE layer, but case never drove
  the multi-select Receive Selected FE path -> GAP.
- SF-PERM-05 / C29409 (cases/view/29409): per-PO button IS hidden (still valid) but scope stopped there.
- Follow-up (needs user OK, do not author yet): SF-PERM negative for a V&O View-only user asserting Receive Selected
  absent/disabled + /bulk-receive route guarded + accept -> 403. refs: SV-8515 / SV-8183 (§9.1; §9.2 fn4).
