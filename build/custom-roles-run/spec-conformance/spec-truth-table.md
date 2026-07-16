# Custom Roles — SPEC TRUTH TABLE (re-derived VERBATIM from the canonical spec)
**Source of truth:** `build/custom-roles-spec-update/current-spec-2026-07-15.md`
(Confluence pageId 565116952, exported 2026-07-15; last change-log row = 7/14/2026
"Updated Office Role definition"). Re-derived FROM SCRATCH on 2026-07-16 for the
trust-critical re-audit of the "Per Spec (v2)?" annotations in
`Prod-vs-Staging-LIVE-VERIFIED-2026-07-14.xlsx`.

> **Supersedes** the §B matrix in `spec-v2-permission-intent.md` where they disagree.
> That extract carried a PRE-7/14 Office column (Work Orders = V, Part Sales = V) and
> a WO-Lines slip (Office = — instead of V). Confirmed against the canonical spec and
> against `build/custom-roles-spec-update/spec-diff-2026-07-15.md` §2.9 (the 7/14
> Office changes: **Office/Work Orders V → —**, **Office/Part Sales V → —**,
> **Office/Invoicing V → V/E/D**; every other cell unchanged).

Role keys: Admin / SM (Service Manager) / SSA (Senior Service Advisor) / SA (Service
Advisor) / FOR (Foreman) / TECH (Technician) / PM (Parts Manager) / PT (Parts
Technician) / OFF (Office) / SREP (Sales Representative) / TC (Time Clock User).

---

## 1. CRUD matrix (spec §"Permission Matrix", CRUD Areas table — verbatim)

| Area | Admin | SM | SSA | SA | FOR | TECH | PM | PT | OFF | SREP | TC |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Work Orders | V/E/D | V/E/D | V/E/D | V/E | V/E | V | V/E | V | **—** | V | V |
| WO Lines | V/E/D | V/E/D | V/E/D | V/E/D | V/E/D | V/E | V/E | V | **V** | V | — |
| Schedule | V/E/D | V/E/D | V/E/D | V/E/D | V/E/D | V | V | V | V | — | V |
| Customers | V/E/D | V/E/D | V/E | V/E | V/E | V | V/E/D | V/E | V/E/D | V/E | — |
| Part Sales | V/E/D | V/E/D | V/E/D | V/E | V | — | V/E/D | V/E | **—** | V | — |
| Catalog and Inv | V/E/D | V/E/D | V/E | V/E | V/E | — | V/E/D | V/E | V | — | — |
| Vendor and Order | V/E/D | V/E/D | V/E/D | V/E | V/E | — | V/E/D | V/E/D | V | — | — |
| Invoicing | V/E/D | V/E | V/E/D | V/E/D | V/E | — | V/E/D | V/E | **V/E/D** | — | — |
| Timesheets | V/E | V/E | V/E | V | V | — | — | V | V/E | — | V |

Matrix note (verbatim): "WO Lines View is not independently configurable — it is
inherited from Work Orders View." → **INTERNAL INCONSISTENCY (flagged):** Office has
WO Lines = V but Work Orders = — (nothing to inherit from). Also documented in
`spec-diff-2026-07-15.md` §3.6 as a NEW-only contradiction. Not resolved by inference.

## 2. Toggles (spec "Toggles" table — verbatim)

| Toggle | Admin | SM | SSA | SA | FOR | TECH | PM | PT | OFF | SREP | TC |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Reports | ON | ON | ON | — | — | — | ON | — | ON | ON | — |
| Customer Portal | ON | ON | ON | ON | — | — | ON | — | — | — | — |
| Parts Dept | ON | ON | ON | ON | ON | — | ON | ON | ON | — | — |
| Billing Portal | ON | ON | — | — | — | — | — | — | ON | — | — |
| Settings | ON | ON | — | — | — | — | ON | — | ON | — | — |

## 3. WO Sub-Settings / View Mode / Cross-Cutting (verbatim)

| Setting | Admin | SM | SSA | SA | FOR | TECH | PM | PT | OFF | SREP | TC |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Review WOs | ON | ON | ON | ON | ON | — | ON | — | — | — | — |
| Pick Parts | ON | ON | ON | ON | ON | ON | ON | ON | — | — | — |
| Order Parts | ON | ON | ON | ON | ON | — | ON | ON | — | — | — |
| View Mode | Full | Full | Full | Full | Full | Tech | Full | Full | Full | Full | — |
| See Financial | ON | ON | ON | ON | ON | — | ON | ON | ON | ON | — |
| See AP/AR | ON | ON | ON | — | — | — | ON | — | ON | ON | — |
| History Logs | ON | ON | ON | ON | ON | — | ON | ON | ON | — | — |

NOTE: the matrix "History Logs" row is the toggle relabeled **"View Part History"**
(7/7 change log: "Changed 'View History Logs' Relabel 'View Part History' Only
controls viewing Part History Setting lives under Part Sales"). It does NOT gate the
WO-level History tab — that is Work Orders → Create & Edit (§1a Edit + 7/7: "Audit
log (both line level and work order level) requires WO → Create & Edit").

Settings sub-toggles (Admin/SM/PM/Office only) — unchanged from the extract; not
used by any annotated row.

## 4. Capability → gate map (re-derived, verbatim citations)

| Capability (workbook) | Gate per spec | Verbatim citation | Roles granted (per §1–§3 above) |
|---|---|---|---|
| WO Delete | Work Orders → Delete | §1a Delete: "Delete work orders, Reverse Invoices as long as validation criteria is met (e.g. no payments made). Delete any note…" | Admin, SM, SSA |
| Reverse Invoice (WO) | Work Orders → Delete | 28-Jun change log: "Reversing an Invoice has been moved… For WO requires Work Order → Delete" | Admin, SM*, SSA — *SM CONTRADICTED by migration table: "Loses Invoicing Delete (cannot reverse)" → **SPEC INCONSISTENT for SM** |
| Take Payment / New Payment / deposits | Invoicing → Create and Edit | §1i Edit: "Create invoices, process payments directly from work orders and part sales… collect deposits"; Open Q4: "These sit behind Invoice and Payments - Create and Edit" | Admin, SM, SSA, SA, FOR, PM, PT, OFF (Office explicitly CAN pay: "Office users are expected to be able to make payments but not create invoices") |
| Issue Credit | **SPEC SILENT** | no issuance action anywhere; §5b covers only Credits-*tab visibility* | n/a — not inferred |
| Send to Portal | Full View (§4) — but Open Q6 conditions it on WOL-approve | §4 Full View: "Has access to 'Send to Portal' button"; Tech View: "Cannot Send to Portal"; 6/10 log: "User must have Full View"; Open Q6 answer: "Send to Portal button: can be anyone who can approve a WOL" | Bare-Full-View reading: all Full-View roles (all but TECH, TC). Q6 reading: Admin, SM, SSA, SA, FOR, PM. **PT / OFF / SREP = SPEC INCONSISTENT/AMBIGUOUS** (Full View but no WOL C&E) |
| Send to Terminal | Invoicing C&E **+ Customer Portal ON** | §1i Edit: "To send to terminal use must have this and 'Customer Portal: ON' enabled"; 7/6 log | Admin, SM, SSA, SA, PM (FOR/PT/OFF hold Invoicing C&E but Customer Portal OFF → withheld) |
| See AP/AR — AGING REPORTS (the Pass-11 observed surface) | **Reports toggle** | §2a Note: "AR/AP aging reports are part of Reports — a user with Reports ON sees all reports, including AR/AP aging, regardless of Manage AP/AR"; Jul-3 log (decoupled) | Admin, SM, SSA, PM, OFF, SREP |
| See AP/AR — Customer/Vendor tabs + sensitive fields | Manage AP/AR (`seeApArData`) | §5b ON: "Unpaid Invoices tabs, Payments tabs, and Credits tabs on Customer and Vendor detail pages…" | Admin, SM, SSA, PM, OFF, SREP (same six roles — coincide) |
| Part Return (from a WO) | **NO permission gate** — but practically needs WO View | §1a: "Returning a part from a WOL does not require a permission. In practice, the user will need WO view so they can see the point, but there is no logical gate"; 29-Jun log: "Everyone has access to Return a part from a WO" | Everyone WITH Work Orders View = all roles EXCEPT **Office** (WO = — since 7/14) |
| Remove a WO LINE | WO Lines → Delete | §1b Delete: "Remove lines from work orders" | Admin, SM, SSA, SA, FOR |
| Remove a single WO part (atom) | SPEC SILENT beyond return(no gate)/move(WOL C&E)/remove-lines(WOL Delete) | §1b Edit: "move parts between lines" | n/a — no annotated row |
| Order Parts / WO Parts tab / New PO | WO sub-setting Order Parts (`woOrderParts`); needs WO View + SFD | §1a: "Place purchase orders… Controls visibility of the Parts tab on the work order. Financial Gate: Enabling Order Parts requires See Financial Data" | Admin, SM, SSA, SA, FOR, PM, PT |
| Receive parts / accept delivery (PO surface) | Vendor and Order Management → Create and Edit | §1g Edit: "create and manage purchase orders, manage deliveries… Includes returning parts to vendors or inventory" (Order Parts also "controls receiving parts deliveries onto a work order" for the WO surface) | Admin, SM, SSA, SA, FOR, PM, PT |
| Approve line | WOL → Create & Edit ("authorize lines") + NOT Tech View | §1b Edit: "authorize lines"; §4 Tech View: "Cannot approve lines (approve action hidden)"; Open Q6: "anyone who can approve a WOL" | Admin, SM, SSA, SA, FOR, PM (TECH excluded by Tech View) |
| Decline line | WOL → Create & Edit — **addressed** by "authorize lines" (NOT spec-silent) | §1b Edit: "…**authorize lines**…" (declining a pending line is part of authorizing lines). §4 Tech View blocks only Approve, never mentions Decline → **Technician = SPEC AMBIGUOUS** | Admin, SM, SSA, SA, FOR, PM (+TECH ambiguous: WOL C&E granted, Tech-View decline unaddressed) |
| Core OK/Not-OK | Work Orders → View (latest) | Key Decision: "Marking Cores OK/Not Ok… gate is WO->View (which implies WOL-> View)"; 7/7 log. (§1b Edit still lists it = documented internal inconsistency) | All with WO View = all EXCEPT Office (no annotated row in the workbook) |
| Create Work Order (New button) | Work Orders → Create and Edit | §1a Edit: "Create new work orders" | Admin, SM, SSA, SA, FOR, PM |
| Create Customer in New-WO ("Add") | Customer Management → C&E, reachable only via New-WO dialog (WO C&E) | 6/1 log: "Create/Edit customer also affect the ability to create a customer in the New WO flow"; §1d Edit: "Create new customers" | Compound: WO C&E ∩ Cust C&E = Admin, SM, SSA, SA, FOR, PM. NOTE: PT/OFF/SREP DO hold Cust C&E (§1 Customers row) — absent only because the dialog is unreachable (no WO C&E) |
| Create Asset in New-WO ("Add") | Customer Management → C&E ("manage vehicles"), reachable via New-WO dialog | §1d Edit: "manage vehicles" | same compound set as above |
| Change Customer / Change Asset on WO | Work Orders → Create and Edit | §1a Edit: "edit customer details and change customer, change asset…" | Admin, SM, SSA, SA, FOR, PM |
| WO-level History tab | Work Orders → Create and Edit | §1a Edit: "Users can view the work order and work order line level audit logs"; 7/7 log | Admin, SM, SSA, SA, FOR, PM |
| WO Notes tab (create/edit any note) | Work Orders → View | §1a View: "Users can also see the Notes tab, create notes, and edit any note…" | All with WO View = all EXCEPT **Office** |
| Timesheets tab | Timesheets → View | §1j View: "View timesheets from work orders. If OFF, the Timesheets top level nav item is hidden"; clock-in/out + "My Timesheets" always on | Admin, SM, SSA, SA, FOR, PT, OFF, TC |
| New Line (add WO line) | WOL → Create and Edit | §1b Edit: "Add new lines…"; §4 Tech View: "Can only create new work order lines" | Admin, SM, SSA, SA, FOR, TECH, PM |
| Reviewed (Review Work Orders) | WO sub-setting Review Work Orders (`woReviewWorkOrders`) | §1a sub-settings: "Without this setting, users will not see the Review option on work orders" | Admin, SM, SSA, SA, FOR, PM |
| See Financial Data (rate/margin) | See Financial Data toggle | §5a | Admin, SM, SSA, SA, FOR, PM, PT, OFF, SREP |
| Invoicing / Finance view | Invoicing → View (+ SFD; + an entry point: "They will also need access to Work Orders, Part Sales, or Customers to see those entry points", §1i View) | §1i View | Admin, SM, SSA, SA, FOR, PM, PT, OFF (Office entry point = Customers since 7/14, not the WO) |

## 5. Spec silences / internal inconsistencies (register — checked against the FULL spec incl. change log, key decisions, open questions)

| Item | Status | Why |
|---|---|---|
| Issue Credit | SPEC SILENT | no issuance gate anywhere; only Credits-tab visibility (§5b) |
| Remove-a-WO-part atom | SPEC SILENT (as a discrete atom) | only return (no gate) / move parts (WOL C&E) / remove lines (WOL Delete) |
| Decline line | **NOT silent** — §1b "authorize lines" (WOL C&E); ONLY the Tech-View treatment of Decline is unaddressed | corrected 2026-07-16 (previously mislabeled spec-silent) |
| Send to Portal for PT/Office/Sales Rep | SPEC INCONSISTENT/AMBIGUOUS | §4/6-10 Full-View grant vs Open Q6 "can approve a WOL" withhold |
| Office WO Lines = V while Work Orders = — | SPEC INCONSISTENT | WOL View is defined as inherited from WO View (§1b + matrix note); diff §3.6 |
| SM Reverse Invoice | SPEC INCONSISTENT | matrix WO V/E/D + 28-Jun (Reverse=WO Delete) grant it; migration Behavior-Changes table says SM "Loses Invoicing Delete (cannot reverse)" |
| Core OK/Not-OK | SPEC INCONSISTENT (WO View vs WOL C&E), latest = WO View | Key Decision/7-7 vs §1b/Jul-3 (no annotated row affected) |
| WOL story history | minor inconsistency (7/7 log "WOL - View" vs §1b Edit listing) | no annotated row affected |

## 6. 2026-07-16 RE-AUDIT — the corrections applied to the workbook (diff summary)

Root causes: (1) the §B matrix in `spec-v2-permission-intent.md` carried the
pre-7/14 Office column (WO=V, Part Sales=V; also WOL=— slip), so the generator
(`add_spec_standing_columns.py`) built `notes`/`partreturn` grant sets that included
Office; (2) the generator's `createcust`/`createasset` rows reused the WO-C&E grant
set with a "spec does not grant" template, wrongly asserting PT/Office/Sales-Rep lack
Customer Management C&E; (3) Decline was blanket-labeled SPEC SILENT although §1b
"authorize lines" addresses it; (4) the SM Reverse migration-table contradiction and
the Office WO-visibility cascade were missed; (5) the AP/AR-aging citation led with
Manage AP/AR instead of the operative Reports gate.

Corrected row-level classes (all other corrections are citation/reason-text fixes):

| Tab / row | Role | Capability | OLD class | NEW class |
|---|---|---|---|---|
| Full Dual Matrix r155 | Office User | WO Notes | Per spec (matches) | **DEVIATION** (7/14: Office has NO Work Orders access; both envs show Notes) |
| Pass-11 r25 | Office User | Part Return | Per spec — expected grant | **DEVIATION (reachability)** (return is ungated, but Office cannot reach a WO per the 7/14 matrix) |
| Full Dual Matrix r17/33/49/65/81/113/129/145/161/177 | all but Technician | Decline line | Spec silent | **Per spec** (§1b "authorize lines" = WOL C&E) |
| Full Dual Matrix r97 | Technician | Decline line | Spec silent | **Spec inconsistent/ambiguous** (WOL C&E granted; §4 Tech View blocks only Approve) |
| Pass-11 r29 | Service Manager | Finance (Reverse component) | Per spec — expected grant | **Spec inconsistent** (matrix+28-Jun vs migration-table "cannot reverse") |

**Corrected tally (297 rows): Per-spec 283 / DEVIATION 9 / Spec-silent 0 (row-level) /
Spec-inconsistent-or-ambiguous 5.**
