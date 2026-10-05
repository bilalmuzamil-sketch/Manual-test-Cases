# UNATTENDED BUILD-VERIFY PLAN — 2026-10-05 (QA lead asleep; resume from here)
Order (QA lead): (1) Founder Mode **Part Sales** build-verify FULLY; (2) Founder Mode **Notifications** build-verify.
Build: QA branch **sv9667.qa.shopview.com**, app **v26.40.7-7ffda69**. Cookies in /tmp/cln/sv9667-cookies.json +
/tmp/qa-cookies/sv9667-sso.txt (NEVER committed). Boot: `qa-branch-boot.mjs sv9667 <route> admin`.

## Scope (live census 2026-10-05)
- **Part Sales group 20435: 104 cases** (61 Bilal + 43 Mudassir, incl. sub-folder "Part Sales — QA Additions (Mudassir)"
  and new "Specification update 5 October 2026 (QA Additions)" C236959–C236962). Full re-verify (Rule 101: new build).
  - 31 flagged Automated. **Authorized to edit (QA lead 10-05): C154586, C154589, C154593, C154597, C154601, C154603,
    C154611, C154618, C154624.** The other 22 Automated: verify on build, **DO NOT WRITE** (Rule 71) — report + ask.
  - None edited by Nebojsa. 25 last-edited by Vlad (created by Bilal/Mudassir) — editable by creator rule, but
    automated ones still follow the 9-only authorization.
  - Mudassir's 43: re-stamp + build-label alignment only; his test logic/approach kept (QA lead "Good", 10-05).
- **Notifications group 20436: 56 cases** (C154651–C154706), all Bilal, all HOLD "no QA branch yet" — but the epic is
  **SV-9667 = this same sv9667 build** (Founder Mode Batch #1) → verify live whether the Notifications Center exists.
  Authoring notes: origin/claude/slack-session-setup-7v5itm:build/founder-mode/notifications/PROJECT-STATE.md.

## Standards to apply on every case touched
Rule 115 (+ precondition amendment, L0049 build-steps) · Rule 117 (other branch: concise title, seed values as examples
beside QA steps, build glossary, Expected = runnable observations + verbatim quote) · Expected substance never changed
(57/114) · stamp "Last checked against build v26.40.7-7ffda69 on 10/5/2026." · marker READY / staging-only portal HOLD /
"Not available on Build to test Yet - Last checked 10/5/2026" (Rule 69) · fr-view served scan · check_tester_runnable.py.

## Confirmed on sv9667 today (evidence build-verify-2026-10-05/)
- Roles: "Create Custom Role" → "Choose a template" (Skip/Apply) → "Create Role" (Role Name*). Permission groups:
  Work orders (View/Create & Edit/Delete; View mode; Review work orders; Pick parts; Order parts; Receive later; Move
  labor) · Work order lines (Create & Edit/Delete) · Invoicing & payments (View/Create & Edit/Delete / Reverse) ·
  Part sales (View/Create & Edit/Delete) · Catalog and Inventory · Vendor and order management (vendors, POs,
  deliveries and part returns) · Page Access: **"Customer portal"** · Settings sub-items · **See Financial Data**.
  **No "Vendors" or "Work Order Parts" permission exists** (C154591 names them → fix).
- Settings sidebar: SETTINGS(Settings/Staff/Roles & Permissions/Locations/Departments/Taxes) · PARTS(Pricing/Bin
  Locations/Categories) · INTEGRATIONS(**QuickBooks**/IBS) · FINANCE(Payment Methods) · IMPORTS.
- Taxes: "GST" 5% exists; "HST BC" 12%; no 6% / 8.25% → cases that need them add via "New Tax".
- Payment Methods: "Cash" exists (Customer Payments). ShopPay not in that list — location still to find.

## Progress
- [x] census · [x] read all 22 changed cases · [x] settings screens
- [ ] part-sale flow screens (Add Part row/Core, Order, Receive dialog + Charged tag, Return Core, Cancel Return,
      row menu Decline, Delete Part Sale, Split, Edit tax rate picker, Create Invoice/New Customer Payment,
      payment history reverse, Reverse invoice, Add Deposit/Collect In Portal, Sales Rep toggle, inventory Add Part/Pick,
      WO Complete, customer Part Sales tab, ShopPay location, QuickBooks connection state)
- [ ] apply to 104 (minus 22 held automated) · [ ] gates + served scan · [ ] hand-off + report
- [ ] Notifications: confirm on sv9667 → observe → apply 56 → gates → hand-off
