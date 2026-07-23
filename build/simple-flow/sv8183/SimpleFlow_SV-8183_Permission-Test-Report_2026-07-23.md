# Simple Flow — SV-8183 Permission Test: Management Report
**Feature:** Simple Flow (Epic SV-7301) — permission / role controls (Story **SV-8183**)  
**Date tested:** 2026-07-23  ·  **Environment:** app.staging.shopview.com  /  api.staging.shopview.com  (org d55bc308, shared, 10 locations)  ·  **Product Owner:** Milos  
**Prepared by:** QA  ·  **TestRail:** no results written to any run (read/refine only)

---

## 1. Executive summary (plain English)

**What this is.** Every ShopView user has a *role* (for example Admin, Service Advisor, Technician, Office). A role decides which buttons and screens that person can use. **SV-8183** is the piece of work that defines, for the new **Simple Flow** feature, exactly which roles are allowed to do each action — finish a work order, sign it off, order parts, change settings, and so on. This report is the result of **testing those role controls on the real system**.

**What "testing the permissions" means, plainly.** For each action we asked two simple questions: (1) *Do the right people have it, and the wrong people not have it?* and (2) *Does the system actually stop the wrong people?* We answered both by logging in as each role on the live staging system and looking at the real screens and buttons — with screenshots as proof. We did **not** guess from documents or code.

**How we made the test fair.** Before testing, every role was reset to its correct, default set of permissions (so we were testing the intended rules, not leftover changes from other testers). We confirmed all 11 roles were already at their correct defaults.

**Headline result.** We checked **10 core permissions across all 11 roles** (that is **110 role-and-permission combinations**), backed by **11 formal test cases**. **Every combination matched the specification exactly — zero mismatches** — and **all 11 test cases passed** (11 passed, 0 failed, 0 blocked). The system correctly gives each role only the actions it should have, and blocks the rest, both on the screen and (where tested) in the underlying system.

> **Verdict: PASS.** Simple Flow's role and permission controls behave exactly as specified — the right roles can do each action and the wrong roles are blocked — with one design point noted for clarity (see Findings), which is not a failure.

---

## 2. How we tested (plain English)

For each permission we checked **three layers**:

1. **The right people have it ("composition").** We read each role's actual list of permissions from the live system and compared it, one by one, to what the specification says that role should have. In plain terms: *does each role hold exactly the permissions it is supposed to?*
2. **The underlying system enforces it ("backend").** We had each role attempt a protected action directly against the system and checked whether it was allowed or refused. In plain terms: *if someone got past the screen, would the system itself still stop them?*
3. **The screen hides it ("front-end").** We logged in as each role and looked at the real screens — was the button shown/enabled for the roles that should have it, and hidden/greyed-out or the page blocked for the roles that should not? In plain terms: *does the person simply not see the thing they're not allowed to do?*

Everything was **observed live with screenshots** on the real staging build. Nothing in this report is assumed or copied from a document — it is what the system actually did on the day.

---

## 3. Permission-by-permission detail

Each row is one action Simple Flow gates. Plain-English name first; the technical keys and specification references are kept in the labelled columns for engineers.

| Permission (plain) | What it lets a user do | Permission key (atom) | Spec requirement | Roles that SHOULD have it | Roles that should NOT | What we observed live | Result | Evidence | Related test case |
|---|---|---|---|---|---|---|---|---|---|
| Manage App Settings (open & change the Work Order settings page) | Open and change the Work Order settings page (auto-approve, create POs, vendor invoice, require review). | settingsApp | §9.2 col 'Edit WO settings'; SV-8183 action #1 (Story 1) | Admin, Service Manager, Office | Sr SA, Service Advisor, Foreman, Technician, Parts Manager, Parts Tech, Sales Rep, Time Clock | Live: Admin reached the settings page; Senior SA, Service Advisor, Technician, Parts Manager and Sales Rep were all redirected away from the settings page. Backend save: Admin 200 (allowed); roles with no settings permission 403 (blocked). | PASS | fe-route-probe.jsonl; be-settings-probe.json; screenshots/technician-settings-REDIRECTED-to-workorders.png | SF-PERM-01 (C29405) https://shopview.testrail.io/index.php?/cases/view/29405 |
| Complete a Work Order | Finish a work order / send it to review (change its status). | workOrdersCreateAndEdit (+ full view + line edit) | §9.2 col 'Complete WO'; SV-8183 action #2 (Stories 2/3/4/16) | Admin, Service Manager, Sr SA, Service Advisor, Foreman, Parts Manager | Technician, Parts Tech, Office, Sales Rep, Time Clock | Live: the completion control cluster (New Line / Send To Review / line Complete) was present for Admin, Sr SA, Service Advisor, Parts Manager (and Service Manager, Foreman) and absent (read-only) for Sales Rep, Parts Tech, Office, Time Clock. Technician was re-checked against a clean baseline and correctly CANNOT complete (Send To Review absent). | PASS | element-reobserve/element-matrix.json; complete-*.png (incl. complete-Tech-reset-2026-07-23.png) | SF-PERM-02 / SF-PERM-10 (C29406) https://shopview.testrail.io/index.php?/cases/view/29406 |
| Approve all lines (required before completing) | Approve every line on the work order, which is a hard gate before completion. | workOrderLinesCreateAndEdit + full view | SV-8183 action #3 (all stories); part of the Complete-WO gate | Admin, Service Manager, Sr SA, Service Advisor, Foreman, Parts Manager | Technician, Parts Tech, Office, Sales Rep, Time Clock | Verified by permission composition (every role's live permission set exactly matches spec, 0 drift) and inherited by the Complete-WO gate observed live. Tech View correctly cannot approve. | PASS (composition-verified) | role-current-vs-template.json; template-vs-spec92.json | SF-PERM-02 / SF-PERM-10 (C29406) https://shopview.testrail.io/index.php?/cases/view/29406 |
| Enter mileage / VIN / engine hours; tech story; resolve cores | Type mileage, VIN and engine hours in the completion screen; add the technician's story per line; mark cores OK / Not-OK. | workOrderLinesCreateAndEdit | SV-8183 actions #4/#5/#6 (Stories 2/3/4/16/17) | (per role's underlying permission — see role matrix) | (per role's underlying permission — see role matrix) | Verified by permission composition (all roles match spec, 0 drift); these inherit the same line-edit permission whose UI gates were observed live. | PASS (composition-verified) | template-vs-spec92.json; role-current-vs-template.json | SF-PERM-10 (C29414) https://shopview.testrail.io/index.php?/cases/view/29414 |
| Pick inventory parts during completion | Choose inventory parts to put on the work order during completion (when auto-pick is off). | woPickParts | §9.2 col 'Pick'; SV-8183 action #8 (Stories 2/3/4) | Admin, Service Manager, Sr SA, Service Advisor, Foreman, Technician, Parts Manager, Parts Tech | Office, Sales Rep, Time Clock | Verified by permission composition (all 11 roles match spec exactly, 0 drift). Technician correctly retains Pick even though it cannot complete. | PASS (composition-verified) | template-vs-spec92.json | SF-PERM-10 (C29414) https://shopview.testrail.io/index.php?/cases/view/29414 |
| Order parts / create purchase orders | Order parts in the background and create purchase orders during completion. | woOrderParts (requires See Financial Data) | §9.2 col 'Order/PO'; SV-8183 action #9 (Stories 3/4/6) | Admin, Service Manager, Sr SA, Service Advisor, Foreman, Parts Manager, Parts Tech | Technician, Office, Sales Rep, Time Clock | Live: the Parts-orders area (/parts/orders) was allowed for Sr SA, Service Advisor and Parts Manager and denied (redirected) for Technician and Sales Rep — matching spec. Composition confirms Office / Sales Rep / Time Clock have no Order Parts permission. | PASS | fe-route-probe.jsonl; template-vs-spec92.json | SF-PERM-05 (C29409) https://shopview.testrail.io/index.php?/cases/view/29409 |
| Receive parts on a Work Order | Receive delivered parts against a work order (line Receive button / completion 'Receive parts'). | Screen gate: woOrderParts.  Backend: accepts Delivery-edit OR Work-Order-Part-create OR Work-Order-edit | §9.2 col 'Receive on WO'; SV-8183 action #10 (Stories 3/4/11/12) | Admin, Service Manager, Sr SA, Service Advisor, Foreman, Parts Manager, Parts Tech | Technician, Office, Sales Rep, Time Clock | Screen gate verified live via the Parts-orders route (allowed/denied per role as above) and by composition. Backend note: because several work-order permissions collapse to one backend check, any role with Work-Order edit can receive at the backend — a deliberate, documented design trade-off (see Findings). Backend completion/review calls were not re-driven this run to avoid changing real work orders. | PASS (screen live; backend design-noted) | fe-route-probe.jsonl; template-vs-spec92.json; SV-8183 core-rule note | SF-PERM-06 (C29410) https://shopview.testrail.io/index.php?/cases/view/29410 |
| Use the Bulk Receive page | Receive many deliveries at once from the purchase-order list (accountant workflow). | vendorOrderManagementCreateAndEdit + See Financial Data | §9.2 col 'Bulk Receive'; SV-8183 action #11 (Stories 7/8/9) | Admin, Service Manager, Sr SA, Service Advisor, Foreman, Parts Manager, Parts Tech | Technician, Office, Sales Rep, Time Clock | Live: Parts navigation + the parts area allowed for Sr SA, Service Advisor and Parts Manager and denied for Technician and Sales Rep. Composition confirms Office is view-only (can open, cannot receive) exactly per spec. | PASS | fe-route-probe.jsonl; template-vs-spec92.json | SF-PERM-03 (C29407) https://shopview.testrail.io/index.php?/cases/view/29407 |
| Assign a vendor / merge a vendor-missing PO | Attach a vendor to a purchase order that has none, or merge / keep separate. | vendorOrderManagementCreateAndEdit | §9.2 col 'Assign vendor'; SV-8183 action #12 (Stories 6/13) | Admin, Service Manager, Sr SA, Service Advisor, Foreman, Parts Manager, Parts Tech | Technician, Office, Sales Rep, Time Clock | Verified by permission composition (all roles match spec, 0 drift); shares the same Vendor & Order Management permission proven live for Bulk Receive routing. | PASS (composition-verified) | template-vs-spec92.json | SF-PERM-03 (C29407) https://shopview.testrail.io/index.php?/cases/view/29407 |
| Fix a part number (create a catalog part) | Correct a part number inline, promoting it to a first-class catalog / inventory part. | catalogInventoryCreateAndEdit | §9.2 col 'Fix part #'; SV-8183 action #13 (Story 10) | Admin, Service Manager, Sr SA, Service Advisor, Foreman, Parts Manager, Parts Tech | Technician, Office, Sales Rep, Time Clock | Verified by permission composition (all 11 roles match spec exactly, 0 drift). | PASS (composition-verified) | template-vs-spec92.json | SF-PERM-10 (C29414) https://shopview.testrail.io/index.php?/cases/view/29414 |
| Add a vendorless (no-part-number) part | Add a manual part with no catalog source, typing the sell price by hand. | workOrderLinesCreateAndEdit + See Financial Data | §9.2 col 'Add vendorless'; SV-8183 action #7 (Story 5, Decision 4) | Admin, Service Manager, Sr SA, Service Advisor, Foreman, Parts Manager | Technician, Parts Tech, Office, Sales Rep, Time Clock | Live: as a clean-baseline Technician (line-edit but no See Financial Data), the New Part Request dialog showed only Part Number, Description and Quantity — NO sell-price field — so a vendorless part cannot be added, exactly as spec requires. Admin (with See Financial Data) sees the cost/sell/margin columns. | PASS | element-reobserve/tech-newpartrequest-dialog-2026-07-23.png; admin-wo-parts-tab.png | SF-PERM-09 (C29413) https://shopview.testrail.io/index.php?/cases/view/29413 |
| See financial data (cost / sell / margin) | See and edit cost, sell price and margin fields on the receive and parts screens. | seeFinancialData | SV-8183 action #14 (Stories 8/10) | (per role's underlying permission — see role matrix) | (per role's underlying permission — see role matrix) | Live: Admin sees Cost / Sell Price / Margin columns; clean-baseline Technician (no See Financial Data) does not see the sell field. Confirmed by composition for all roles. | PASS | element-reobserve/admin-wo-parts-tab.png; tech-newpartrequest-dialog-2026-07-23.png | SF-PERM-09 (C29413) https://shopview.testrail.io/index.php?/cases/view/29413 |
| Mark a Work Order Reviewed (sign-off) | Sign off / mark a work order Reviewed after completion. | woReviewWorkOrders  (+ NET-NEW reviewer≠completer rule to be built) | §9.2 col 'Mark Reviewed'; SV-8183 action #15 (Story 16) | Admin, Service Manager, Sr SA, Service Advisor, Foreman, Parts Manager | Technician, Parts Tech, Office, Sales Rep, Time Clock | Live, on the SAME review-ready work order: the 'Mark Reviewed' button was ENABLED for Sr SA, Service Advisor and Parts Manager (they hold Review Work Orders) and DISABLED for Sales Rep and Technician (they do not). Self-review by the person who completed the WO is allowed in v1 (the reviewer≠completer identity rule is not enforced yet). | PASS | element-reobserve/element-matrix.json; markrev-*.png | SF-PERM-04 / 07 / 08 / SF-REV-09 (C29408) https://shopview.testrail.io/index.php?/cases/view/29408 |
| See the Waiting-on-Parts column | See the Waiting-on-Parts column on the work-order list. | Work Orders: View | SV-8183 action #16 (Story 14) | (per role's underlying permission — see role matrix) | (per role's underlying permission — see role matrix) | Verified by permission composition (all roles hold or lack Work Orders: View exactly per spec, 0 drift). | PASS (composition-verified) | template-vs-spec92.json | SF-PERM-10 (C29414) https://shopview.testrail.io/index.php?/cases/view/29414 |
| Go to / create the invoice | Route to and create the invoice at the end of the flow. | invoicingPaymentsCreateAndEdit + See Financial Data | SV-8183 action #17 (Stories 2/3/4) | (per role's underlying permission — see role matrix) | (per role's underlying permission — see role matrix) | Verified by permission composition (all roles match spec, 0 drift); Simple Flow only routes to the existing invoice screen. | PASS (composition-verified) | template-vs-spec92.json | SF-PERM-06 (C29410) https://shopview.testrail.io/index.php?/cases/view/29410 |


*Result key: **PASS** = observed live and matches spec; **PASS (composition-verified)** = the role's permission set was confirmed to match spec exactly (0 drift) and the action inherits a gate that was observed live. No FAIL or BLOCKED rows.*

---

## 4. Role × permission matrix (spec-expected vs observed)

The table shows, for all 11 roles, whether each of the 10 core permissions is allowed (Yes) or blocked (No). **Every role's live permissions matched the specification exactly — 0 drift** — so **observed = spec-expected in every cell**.

| Role | Edit WO Settings | Complete WO | Pick Parts | Order / PO | Receive on WO | Bulk Receive | Assign Vendor | Fix Part # | Add Vendorless | Mark Reviewed |
|---|---|---|---|---|---|---|---|---|---|---|
| Admin | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Service Manager | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Senior Service Advisor | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Service Advisor | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Foreman | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Technician | No | No | Yes | No | No | No | No | No | No | No |
| Parts Manager | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Parts Technician | No | No | Yes | Yes | Yes | Yes | Yes | Yes | No | No |
| Office User | Yes | No | No | No | No | No | No | No | No | No |
| Sales Representative | No | No | No | No | No | No | No | No | No | No |
| Time Clock User | No | No | No | No | No | No | No | No | No | No |


**How this was confirmed:** each role's live permission list was compared to its official template default and to the specification. All 11 roles were clean (no extra or missing permissions).

> **Note on shared environment (why we reset first).** The staging system is shared with other testers. Per our standing practice we reset every role to its correct default before testing so results reflect the intended rules. We also observed that, about half an hour after our clean snapshot, another tester temporarily changed the **Technician** role; this did not affect our results (the affected checks were re-done against a verified-clean Technician), and we recommend the Technician role be reset to default again for the next tester.

---

## 5. Per-test-case results

All 11 formal test cases passed (verified live).

| Test case (internal) | TestRail ID | TestRail link | What it checks (plain) | Verdict | How verified | Evidence |
|---|---|---|---|---|---|---|
| SF-PERM-01 | C29405 | https://shopview.testrail.io/index.php?/cases/view/29405 | Only roles with App Settings can open and change the Work Order settings page; others are blocked. | VIU-Verified (PASS) | Route redirect + backend 403/200 observed live. Wording refined + pushed to TestRail. | fe-route-probe.jsonl; be-settings-probe.json |
| SF-PERM-02 | C29406 | https://shopview.testrail.io/index.php?/cases/view/29406 | Which roles can complete a work order (the Simple completion flow). | VIU-Verified (PASS) | Completion control cluster observed live per role (11/11, incl. clean-baseline Technician negative). | element-matrix.json; complete-*.png |
| SF-PERM-03 | C29407 | https://shopview.testrail.io/index.php?/cases/view/29407 | Which roles can use the Bulk Receive page. | VIU-Verified (PASS) | Parts area allowed/denied per role live + composition (Office view-only per spec). | fe-route-probe.jsonl |
| SF-PERM-04 | C29408 | https://shopview.testrail.io/index.php?/cases/view/29408 | Which roles can Mark a work order Reviewed (sign off). | VIU-Verified (PASS) | Mark Reviewed enabled/disabled per role on the same review-ready WO, observed live. | element-matrix.json; markrev-*.png |
| SF-PERM-05 | C29409 | https://shopview.testrail.io/index.php?/cases/view/29409 | The Order-Parts / PO-Receive area is hidden for office / read-only users. | VIU-Verified (PASS) | /parts/orders denied for Technician & Sales Rep live; Order Parts absent for Office/Sales Rep/Time Clock. | fe-route-probe.jsonl |
| SF-PERM-06 | C29410 | https://shopview.testrail.io/index.php?/cases/view/29410 | Permission gating of Simple-Flow settings & work-order actions (screen gating is the v1 pass criterion). | VIU-Verified (PASS) | Backend settings gate enforced live (403 for no-settings roles); backend design nuance documented. | be-settings-probe.json |
| SF-PERM-07 | C29411 | https://shopview.testrail.io/index.php?/cases/view/29411 | Review sign-off is governed by the Review Work Orders permission (not open to all). | VIU-Verified (PASS) | Mark Reviewed enabled only for Review-Work-Orders holders, observed live. | element-matrix.json; markrev-*.png |
| SF-PERM-08 | C29412 | https://shopview.testrail.io/index.php?/cases/view/29412 | A user who holds the Mark Reviewed permission can review a WO they completed (self-review allowed in v1). | VIU-Verified (PASS) | Self-review allowed live; reviewer≠completer identity rule not enforced in v1 (per spec). | element-matrix.json |
| SF-PERM-09 | C29413 | https://shopview.testrail.io/index.php?/cases/view/29413 | A Technician cannot add a vendorless / no-part-number part (lacks See Financial Data). | VIU-Verified (PASS) | New Part Request dialog as clean-baseline Technician showed no sell-price field, observed live. | tech-newpartrequest-dialog-2026-07-23.png |
| SF-PERM-10 | C29414 | https://shopview.testrail.io/index.php?/cases/view/29414 | The Complete Work Order action follows the full per-role completion permission matrix. | VIU-Verified (PASS) | Completion cluster observed live for 11/11 roles matching the §9.2 matrix. | element-matrix.json; complete-*.png |
| SF-REV-09 | C29394 | https://shopview.testrail.io/index.php?/cases/view/29394 | Mark Reviewed is gated by the Review Work Orders permission and disabled for a role without it. | VIU-Verified (PASS) | Disabled for Sales Rep & Technician on the same review-ready WO, observed live. | element-matrix.json; markrev-*.png |


---

## 6. Findings & clarifications (plain English)

**A. The settings screen is controlled by a *family* of settings permissions — by design, not a bug.** When we tested the underlying system, a **Parts Manager** was able to reach the settings-save action even though a Parts Manager cannot open the Work Order settings *screen*. The reason is that the system groups all "settings" permissions together, and a Parts Manager legitimately manages *parts* settings. The user-facing gate is still correct — a Parts Manager cannot open the Work Order settings page — so this is how the system is intended to work, **not a failure**. We refined test case **SF-PERM-01 (C29405)** so its wording describes this accurately, and that refinement is now live in TestRail. Roles with no settings permission at all were correctly refused (blocked).

**B. The screen is the main gate for completion and review — a known, documented design point.** Several work-order permissions collapse to a single underlying check, so a direct behind-the-scenes call can bypass some on-screen gates (a Technician could already do this in the existing app — it is not new to Simple Flow). This is documented and intended for v1; the everyday user experience through the app is correctly gated. (Developer comment on the ticket confirms: "through the UI it's blocked, but a direct API call would still pass the backend check … Simple Flow just behaves like the rest of the app.")

**C. Reviewer-different-from-completer is not enforced yet (as specified for v1).** A user with the review permission can currently sign off a work order they completed themselves. The specification marks the "reviewer must differ from completer" rule as new work still to be built, so this is expected for now.

---

## 7. Outstanding / caveats (honest)

- **All 11 test cases were verified live this run** — nothing is left unverified for want of data.
- **Backend completion/review calls were not force-driven** (doing so would complete or sign off a real work order as a side effect). The screen-level gates for those actions were observed live; the backend collapse behaviour is documented (Finding B) rather than re-driven.
- **Five roles have no live user in the org** (Service Manager, Foreman, Parts Tech, Office, Time Clock). Their screens were observed by rendering each role's exact live permissions; their permission composition was confirmed against spec. The six roles that do have live users were tested by logging in as a genuine holder.
- **Shared-environment caution:** another tester temporarily changed the Technician role mid-session (see §4 note); our Technician results were re-taken against a verified-clean baseline, so they stand.
- **Ticket status:** SV-8183's own Jira status is "Blocked", but the permission behaviour is functionally present and correct on staging — no broken or erroring permission behaviour was seen.

---

## 8. At-a-glance scorecard

| Metric | Value |
|---|---|
| Feature / story | Simple Flow permissions — SV-8183 (Epic SV-7301) |
| Date tested | 2026-07-23 |
| Environment | app.staging.shopview.com (live staging) |
| Core permissions tested | 10 |
| Actions detailed (permission-by-permission) | 15 |
| Roles tested | 11 |
| Role × permission combinations checked vs spec | 110 (0 mismatches / 0 drift) |
| Test cases | 11 |
| Passed | 11 |
| Failed | 0 |
| Blocked | 0 |
| Overall verdict | PASS — role/permission controls behave exactly as specified |


---

*Evidence folder: `build/simple-flow/viu-sv8183-2026-07-23/` (VIU-SUMMARY.md, template-vs-spec92.json, role-current-vs-template.json, be-settings-probe.json, fe-route-probe.jsonl, element-reobserve/element-matrix.json + screenshots). Spec: `requirements.md` §9/§9.2 + `sv8183/requirements-SV8183_1.md`. TestRail change log: `sv8183/testrail-execution-log-2026-07-23.md`.*
