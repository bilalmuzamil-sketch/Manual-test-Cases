# Custom Roles & Permissions — Updated-Spec Diff (Phase 1)

**Spec source:** Confluence "Custom Roles and Permissions" (SV-7388), exported
9 Jul 2026 11:05 UTC. Verbatim readable copy: `updated-spec-source.md`.
**Spec version marker:** last Change Log row **09 Jul 2026** (Sasha Grosman) —
"Clarified See Financial Data applies to Core app, not Customer Portal, Billing
Portal, and Settings pages." (This is the newest change; there are prior 07/08 Jul
rows this diff also leans on.)

**Scope compared:** the **160 cases that appear in TestRail RUN 331**
("Nightly Test Run - Jul 9, 2026", project 1 / suite 1). The run spans many
sections (Custom Roles - (Revised) core cases + generic Test Cases functional
suites); the run — not a section — is the authoritative set. Test/case-id map:
`build/custom-roles-run/run331-tests.json`.

**Method / stance:** conservative. UPDATE only when the spec change is settled and
unambiguous AND the new expected is the spec-correct behavior (updating expected to
the *correct* spec behavior does not mask bugs — a live deviation still fails in
Phase-2 VIU). FLAG when the spec is internally contradictory/ambiguous, the case is
adversarial/combo encoding known-defect nuance, or a correct rewrite would change
the case's subject wholesale.

---

## KEY SPEC CHANGES (the deltas that drive this diff)

1. **"View History Logs" → renamed "View Part History"** (Change Log 07 Jul).
   Now ONLY controls viewing **Part History** on the inventory page; it lives under
   **Part Sales**, last in the list. It **no longer controls Work Order history.**
   - Work-order **audit log (WO-level AND line-level)** now requires **Work Orders →
     Create & Edit**.
   - **Story history (WOL level)** requires **Work Order Lines → View** (inherited
     from WO View).
2. **AP/AR aging reports follow the Reports permission** (all-or-nothing), **no
   longer** Manage AP/AR (Change Log 03 Jul). Reports is all-or-nothing; a user with
   Reports ON sees all reports incl. AR/AP aging regardless of Manage AP/AR.
3. **Reverse Invoice moved to Work Orders → Delete** (was Invoicing → Delete), for
   both Work Orders and Part Sales (Change Log 28 Jun). Deleting a return still
   requires Invoicing & Payments → Delete.
4. **Order Parts** now (a) **controls the WO Parts tab** and (b) **requires See
   Financial Data** (Change Log 03 Jul; §1a). Enabling Order Parts with SFD OFF
   prompts to enable SFD.
5. **See Financial Data OFF → PROMPT to disable dependents** (not silent auto-clear)
   (Change Log 01 Jul; §5a). Prompt lists: Invoicing & Payments CRUD, Part Sales
   CRUD, Order Parts, Manage AP/AR.
6. **Manage AP/AR requires See Financial Data ON** (Change Log 08 Jul); AP/AR now
   also gates **sensitive Vendor fields** (Edit Vendor + Vendor overview card), not
   just customer fields (01 Jul). Setting label settled as **"Manage Accounts
   Payable and Receivable"** (renamed from "View and Manage AP/AR", 10 Jun).
7. **Customer Portal** default ON for **Service Advisor, Senior SA, Service Manager,
   Parts Manager** (+ Administrator) (Open Q6 / Change Log 10 Jun + 19 Jun SM added).
8. **Notes model** (Change Log 01/03/08 Jul): WO **View** = create + edit ANY note +
   delete own; WO **Delete** = delete ANY note. **Customer** notes are governed by
   **Customer Management** (View = create/edit anyone's note + delete own; Delete =
   delete others' notes) — NOT by Work Orders perms.
9. **Send to Portal** requires **Full View** (Tech View cannot); "anyone who can
   approve a WOL" (10 Jun / Open Q6). **Send to Terminal** requires Invoicing →
   Create & Edit **AND** Customer Portal ON (06 Jul). **Deposits** sit behind
   Invoicing → Create & Edit.
10. **Office users cannot create invoices** — hard-coded rule that disables the
    Create Invoice button on WOs and Part Sales, overriding Invoicing CRUD (07 Jul).
11. **Marking cores OK/Not-OK** = gated by **WO → View** (Key Decision / 07 Jul) —
    though §1a/§1b also list it under WOL Create & Edit (spec-internal conflict).
12. **Settings → Integrations** stays and hosts **QuickBooks, IBS, Open API** (26/28
    Jun); Departments live under **App Settings** (08 Jul).
13. **Digital Inspections** derive from existing atoms — no separate permission
    (WOL CRUD for add/fill/remove/reopen; Settings › Service for template authoring)
    per SV-8095. (Already reflected in the DI per-role cases.)
14. **Timesheets have NO Delete** — only View + Create & Edit (§1j).
15. **System roles = 11** shipped (Owner dropped/merged into Admin). Spec prose still
    says "12" in a couple of places but the matrix + Role Descriptions enumerate 11.

---

## DELTA TABLE

Legend: **UPD** = updated in TestRail this phase · **FLAG** = flagged for user
decision (not changed) · **OK** = already spec-correct / not affected.

| Spec change | Case(s) | Decision | Detail |
|---|---|---|---|
| #7 Customer Portal now ON for SA/SSA/SM/PM | **C2528** | **UPD** | Case listed Service Manager, Service Advisor, Parts Manager among roles where Customer Portal is *hidden*. Per spec those roles now HAVE Customer Portal. Removed SM/SA/PM from the precond role list (kept Foreman, Technician, Parts Technician, Office, Time Clock User); rewrote expected to name the roles that DO get Customer Portal. |
| #5 SFD OFF prompts to disable dependents (not silent auto-clear) | **C26475** | **UPD** | Case title/steps/expected said turning SFD OFF "auto-clears / auto-unchecks" the 6 Part-Sales+Invoicing checkboxes. Spec §5a: a **prompt** appears listing dependents (Invoicing CRUD, Part Sales CRUD, Order Parts, Manage AP/AR) to disable; confirm disables, cancel keeps SFD ON. Retitled + rewrote steps + expected to the prompt model. |
| #6 AP/AR setting renamed "Manage Accounts Payable and Receivable" | **C26424** | **UPD** | Expected named the pre-10-Jun label "View and Manage AP/AR Data". Renamed to the current "Manage Accounts Payable and Receivable" (and stripped the pasted inline-style span). Behaviour (Invoicing Delete with AP/AR OFF prompts to enable AP/AR) unchanged and matches §1i. |
| #2 Aging reports follow Reports permission | C26482, C26504 | OK | Both already written to the new behaviour (aging visible with AP/AR OFF when Reports ON). No change. |
| #1 View History Logs → View Part History (repurposed) | **C26488** | **FLAG** | Case asserts "View History Logs ON shows WO-level + line-level history (work orders only)". The toggle was **relabelled + repurposed** to control only inventory **Part History**; WO audit log now needs WO Create & Edit and line story needs WOL View. A correct rewrite changes the case's entire subject → needs user decision (repurpose vs split vs retire). |
| #1 History-logs capability wording in combos | C27418, C27468, C27487, C27494 | **FLAG** | All grant "view WO history logs" from the History Logs permission. Under the repurpose, that permission no longer grants WO history. Adversarial/combo section (normally out-of-scope 3641–3645) — flag, don't rewrite. |
| #8 Customer notes governed by Customer Management, not Work Orders | **C27873** | **FLAG** | Ties modify/delete of another user's **customer** note to **Work Orders Delete** (role A = Customers View + WO View no WO-Delete → actions absent; role B adds WO Delete → delete reachable). Spec now says customer-note edit = Customer Mgmt View (any note) and delete-others = Customer Mgmt **Delete**. Real discrepancy but subtle/enforcement-nuanced → flag. |
| #3 Reverse Invoice = WO Delete (+ SM "cannot reverse" migration note) | C26496 | **FLAG** | Internal contradiction: step 6/7 says "confirm cannot reverse invoices" but Expected says "CAN reverse Both". Migration table also says SM "Loses Invoicing Delete (cannot reverse)" while reverse is now under WO Delete (SM has WO Delete). Spec self-contradicts → flag, do not force. |
| #3 Reverse Invoice per role | C2497 | **FLAG** | "Finance tab visible for Owner/Admin/SM/SA" expected "Reverse Invoice options are available". Reverse now needs WO Delete; SA has WO View+Edit (no Delete) → SA should NOT see Reverse. Bundled-roles case; carving per-role is ambiguous → flag. |
| #14 Timesheets have no Delete | C2500 | **FLAG** | Expected: "Edit, delete, and modify actions are available on timesheet entries" (Admin/Office). Spec §1j: Timesheets has no Delete permission. "delete" may mean per-entry removal vs the Delete atom — ambiguous → flag. |
| #12 App Settings covers Roles & Permissions; Office App Settings ON | C2480 | **FLAG** | Expected hides "Roles and Permissions" for Office, but spec Key Decision says App Settings covers Roles & Permissions and Office has App Settings ON → Office may now see it. Could be further-gated (Admin pages) → flag. Integrations/Finance visibility in the case already matches spec. |
| #1/§1a WO-detail editable fields gated by WO Create & Edit | C2561 | **FLAG** | Lists **Technician** among roles that can edit Lead Technician, but Technician has WO **View only** (no Edit) per matrix. Possible extra rule for techs → flag. |
| §1a WO edit (change customer/asset) needs WO Create & Edit | C2565, C2567 | **FLAG** | Both list **Office** as able to Change Customer/Contact / Change Asset, but Office has WO View only (no Edit) per matrix. 07-Jul change removed a "misleading customer-setting controls WO tab" requirement → ambiguous → flag. |
| #2 AR-aging endpoint permission model | C26553 | **FLAG** | Backend-API case gates AR Aging on `ROLE_ACCOUNT_RECEIVABLE_REPORT::VIEW`; new spec routes aging through the all-or-nothing **Reports** permission. 403 for tech still holds (tech Reports OFF) but the gating model/permission name may be stale. Backend-API section + could-mask → flag. |
| §1f/§1g return-to-inventory ownership | C26419 | **FLAG** | Title says "Catalog and Inventory Create & Edit enables Return to Inventory" but precond/steps/expected are entirely about **Vendor and Order Management**. Spec attributes return-to-inventory to BOTH Catalog Edit (Open Q3) and Vendor Edit (§1g). Title/body mismatch → flag for cleanup. |
| Label discrepancy modal vs list | C26340 | **FLAG** | Already a "decision needed from product" case (Admin↔Administrator, Parts Tech↔Parts Technician, Time Clock↔Time Clock User). Judgment/product-decision → leave as-is. |
| #15 system-role count / descriptions | C26320 | OK | Expects 11 system roles with the exact spec Role Descriptions — matches (spec "12" prose counts the dropped Owner; live = 11). No change. |
| #7 Customer Portal defaults matrix | C26506 | OK | Already tests the new SA/SSA/SM/PM(+Admin) matrix and even notes the Admin spec-internal inconsistency. No change. |
| Per-role verification (SA, Time Clock, Sales Rep) | C26498, C26505, C26504 | OK | Match the updated matrix (SA AP/AR OFF + 7 sensitive fields hidden; Time Clock 3 read-only views + empty View Mode; Sales Rep Reports+SFD only, aging via Reports). No change. |
| Digital Inspections per-role (SV-8095 model) | C27625–C27636 (SA), C27703–C27714 (Sales Rep), C26652–C26718 (builder/lifecycle) | OK | Already derive inspection rights from WOL CRUD + Settings›Service per SV-8095. Match the updated Key Decision. No change. |
| Cascade / parent-gate / sub-toggle cases | C26372, C26379, C26387, C26388, C26391, C26407, C26411, C26414, C26415, C26420, C26432, C26471, C26528 | OK | Match §1/§2/§3/§5 (CRUD cascade, Review sub-toggle, Add Customer/Asset gating, Parts Dept parent gate, Part Sales/Catalog CRUD, Invoicing View→Finance tab, universal clock-in, Part Sales SFD prompt). No change. |
| Generic functional suites (not permission-spec) | Login redirects C26744–26746; Settings save C27266; Staff C2059; Taxes C1960/1998/1999/2004/2005/2011; Integrations/IBS C24545/24547/25189/25190; Pricing C19336; Partial Payments C18624/18653/18681/18682/18685/18710; WO list/columns C10/C59/C1851/C2175; New WO C25703; WO-lines C2134/C32/C290/C291/C2189/C1883/C2137/C221/C24549; Parts tab C257; Deposits/Credit Memos C22324–C26604; Parts PO/Vendors/Multi-bin C2470/C1004/C139/C22196/C22238/C22272; Reports render C27259/C27265/C27267/C27268/C178; Timesheet Activities C19278/C19283/C19284/C19285/C19286; Part Sales C2594/C2639; Unpaid invoices C988/C993; Roles/Perms visibility C2480(flagged)/C2484/C2485/C2488/C2495/C2502/C2516/C2521/C2523/C2555/C2558/C2560/C2561(flag)/C2563/C2564/C2565(flag)/C2567(flag); Regression C27834; Breakage C27562/C27580; Backend C26578 | OK | Not driven by the changed permission rules, or already consistent with the updated spec. No change. |

---

## SUMMARY

- **Cases in scope (RUN 331):** 160.
- **UPDATED (3):** C2528, C26424, C26475 — all verified HTTP 200 + re-fetched.
- **FLAGGED-only (14):** C2480, C2497, C2500, C2561, C2565, C2567, C26340, C26419,
  C26488, C26496, C26553, C27418, C27468, C27487, C27494, C27873.
  *(count of distinct case IDs listed = 16; see per-row reasons above.)*
- **Up-to-date / unaffected (remaining ≈141):** functional suites + Custom-Roles
  cases already written to the current spec.

> Note: FLAG list resolves to **16 case IDs** (C2480, C2497, C2500, C2561, C2565,
> C2567, C26340, C26419, C26488, C26496, C26553, C27873, C27418, C27468, C27487,
> C27494). Up-to-date count = 160 − 3 updated − 16 flagged = **141**.
