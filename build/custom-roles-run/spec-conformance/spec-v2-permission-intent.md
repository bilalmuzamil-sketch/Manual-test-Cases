# Custom Roles & Permissions — SPEC v2 Permission-Intent Extract
**Source doc:** `CustomRolesandPermissions_2.doc` (Confluence "Export to Word" MHTML;
quoted-printable HTML). **Owner:** Sasha Grosman. **Epic:** SV-7388.
**Extraction method that worked:** the file is NOT a binary .doc — `file` reports
"news or mail, ASCII text" = an MHTML export. Decoded quoted-printable with Python
`quopri`, then HTML→structured-text with BeautifulSoup (tables preserved).
antiword/libreoffice/catdoc all FAILED (libreoffice: "source file could not be
loaded"; antiword/catdoc not installed).
**Cross-check:** the decoded body is byte-for-byte the same spec as the repo's
`build/custom-roles-spec-update/current-spec-2026-07-15.md` (same tables, same Change
Log through 14 Jul 2026). This is the current canonical spec.

> Rule followed: where the spec does not address a role×capability, it is marked
> **SPEC SILENT** — nothing inferred.

---

## A. ROLES THE SPEC DEFINES (new-model system roles)

Spec text says "12 system role templates" BUT the Owner role was **dropped and
merged into Admin** (Open Q7/Q9 + 10 Jun 2026 change log), so the Permission Matrix
lists **11 roles**. The 11 matrix roles (spec IDs from "Role Descriptions"):

| Role | System ID | Spec one-line description |
|---|---|---|
| Admin | system-admin | Full system access |
| Service Manager | system-sm | Full operational access, limited admin (App Settings + Wages only) |
| Senior Service Advisor | system-ssa | Work order and customer management with expanded access |
| Service Advisor | system-jsa | Work order and customer management with invoicing access |
| Foreman | system-foreman | Oversees technicians and work orders |
| Technician | system-tech | Assigned work orders and time tracking (Tech View) |
| Parts Manager | system-pm | Full parts and inventory control |
| Parts Tech | system-pt | Parts operations and vendor management |
| Office | system-office | Office administration, reporting, back-office ops |
| Sales Representative | system-salesrep | Reports and financial data access only |
| Time Clock | system-timeclock | Clock in/out only |

- **Owner:** SPEC EXPLICIT — removed. "We will drop Owner role. The legacy Owner
  role will merge into the new Admin role." (Open Q7; 10 Jun 2026 change log.)
- **Admin editability:** "Admin system role cannot be edited to lose access to the
  Admin pages. All other parts are editable." (Open Q9.)
- **Office & Time Clock:** "cannot be edited — clicking them opens a read-only
  permission summary." (Roles List Page / Key Decisions.)
- **Time Clock View Mode:** "Time Clock user does not have Full or View permission.
  Their 'View Mode' permission is empty." (09 Jun 2026 change log.)

---

## B. THE CANONICAL PERMISSION MATRIX (verbatim from spec §"Permission Matrix")

### CRUD Areas — V=View, E=Create&Edit, D=Delete, — =OFF
(WO Lines View is NOT independently configurable — inherited from Work Orders View.)

| Area | Admin | Svc Mgr | Sr. SA | Svc Adv | Foreman | Tech | Parts Mgr | Parts Tech | Office | Sales Rep | Time Clock |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Work Orders | V/E/D | V/E/D | V/E/D | V/E | V/E | V | V/E | V | V | V | V |
| WO Lines | V/E/D | V/E/D | V/E/D | V/E/D | V/E/D | V/E | V/E | V | — | V | — |
| Schedule | V/E/D | V/E/D | V/E/D | V/E/D | V/E/D | V | V | V | V | — | V |
| Customers | V/E/D | V/E/D | V/E | V/E | V/E | V | V/E/D | V/E | V/E/D | V/E | — |
| Part Sales | V/E/D | V/E/D | V/E/D | V/E | V | — | V/E/D | V/E | V | V | — |
| Catalog & Inv | V/E/D | V/E/D | V/E | V/E | V/E | — | V/E/D | V/E | V | — | — |
| Vendor & Order | V/E/D | V/E/D | V/E/D | V/E | V/E | — | V/E/D | V/E/D | V | — | — |
| Invoicing | V/E/D | V/E | V/E/D | V/E/D | V/E | — | V/E/D | V/E | V/E/D | — | — |
| Timesheets | V/E | V/E | V/E | V | V | — | — | V | V/E | — | V |

### Page/Parent Toggles
| Toggle | Admin | Svc Mgr | Sr. SA | Svc Adv | Foreman | Tech | Parts Mgr | Parts Tech | Office | Sales Rep | Time Clock |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Reports | ON | ON | ON | — | — | — | ON | — | ON | ON | — |
| Customer Portal | ON | ON | ON | ON | — | — | ON | — | — | — | — |
| Parts Dept | ON | ON | ON | ON | ON | — | ON | ON | ON | — | — |
| Billing Portal | ON | ON | — | — | — | — | — | — | ON | — | — |
| Settings | ON | ON | — | — | — | — | ON | — | ON | — | — |

### WO Sub-Settings / View Mode / Cross-Cutting
| Setting | Admin | Svc Mgr | Sr. SA | Svc Adv | Foreman | Tech | Parts Mgr | Parts Tech | Office | Sales Rep | Time Clock |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Review WOs | ON | ON | ON | ON | ON | — | ON | — | — | — | — |
| Pick Parts | ON | ON | ON | ON | ON | ON | ON | ON | — | — | — |
| Order Parts | ON | ON | ON | ON | ON | — | ON | ON | — | — | — |
| View Mode | Full | Full | Full | Full | Full | Tech | Full | Full | Full | Full | — |
| See Financial | ON | ON | ON | ON | ON | — | ON | ON | ON | ON | — |
| See AP/AR | ON | ON | ON | — | — | — | ON | — | ON | ON | — |

### Settings Sub-Toggles (only roles with Settings ON)
| Sub-setting | Admin | Svc Mgr | Parts Mgr | Office |
|---|---|---|---|---|
| App Settings | ON | ON | — | ON |
| Service | ON | — | — | ON |
| Parts | ON | — | ON | — |
| Integrations | ON | — | — | ON |
| Finance | ON | — | ON | ON |
| Data Import | ON | — | ON | ON |
| Wages | ON | ON | — | ON |

(Other 7 roles have Settings OFF → no sub-toggles = SPEC SILENT/N/A for them.)

---

## C. CAPABILITY-BY-CAPABILITY PRESCRIBED INTENT
(Maps each capability that appears in the prod-vs-staging comparison tabs to the
spec's exact wording + gate. "Which roles" derived ONLY from the matrix in §B.)

### 1) WO Delete (delete work order)
- **Gate:** Work Orders → **Delete**. §1a: "Delete work orders, Reverse Invoices as
  long as validation criteria is met (e.g. no payments made). Delete any note,
  including notes created by other users. Note: this permission is not enough to
  delete payments."
- **Roles WITH per matrix:** Admin, Service Manager, Senior SA. **WITHOUT:** Service
  Advisor, Foreman, Tech, Parts Mgr, Parts Tech, Office, Sales Rep, Time Clock.

### 2) Invoice Reverse / Issue Credit / Take Payment (New Payment) / Finance access
- **Reverse Invoice (WO):** now gated by **Work Orders → Delete** (moved OFF
  Invoicing Delete). 28 Jun 2026 change log: "Reversing an Invoice has been moved …
  For WO requires Work Order → Delete For PS requires Part Sale → Delete." Also §1a
  Delete bullet ("Reverse Invoices as long as validation criteria is met").
- **Reverse a Part Sale invoice:** **Part Sales → Delete** ("Delete part sales and
  reverse part sales invoices", §1e).
- **Take Payment / process payments / collect deposits:** **Invoicing → Create and
  Edit** (§1i Edit: "Create invoices, process payments … manage invoice fields and
  collect deposits"; Open Q4: "Send to Terminal and Deposits … sit behind Invoice
  and Payments - Create and Edit").
- **Delete payments / void / delete a Part Sale return:** **Invoicing → Delete**
  (§1i Delete). Note §1i: Invoicing **Delete additionally requires Manage AP/AR ON**
  (modal prompt if OFF). Deleting a return = Invoicing Delete (28 Jun 2026).
- **Issue Credit:** SPEC SILENT — no line labeled "Issue Credit"; spec speaks of
  Credits *tabs* visibility under Manage AP/AR (§5b), not a credit-issuance action.
- **Finance access (Settings › Finance sub-toggle):** "Financial settings — tax
  configuration, payment settings, payment methods." Roles ON: Admin, Parts Mgr,
  Office (per Settings Sub-Toggles table). Svc Mgr = OFF.
- **Roles with Invoicing Edit (take payment) per matrix:** Admin, Svc Mgr, Sr. SA,
  Svc Adv, Foreman, Parts Mgr, Parts Tech, Office. **Invoicing Delete:** Admin,
  Sr. SA, Parts Mgr. **NOT:** Tech, Sales Rep, Time Clock (no Invoicing at all).
- **Office override:** "Office Users Cannot Create Invoices … A hard coded rule for
  Office users will disable the Create Invoice button on Work Orders and Part Sales.
  This overrides the Invoicing & Payments CRUD." (Office can still make payments.)

### 3) Send to Portal
- **Gate:** requires **Full View** (View Mode). §4 Full View: "Has access to 'Send
  to Portal' button." Tech View restriction: "Cannot Send to Portal — the 'Send to
  Portal' button is not visible and the user cannot take this action."
- Open Q6 adds: "Send to Portal button: can be anyone who can approve a WOL." 10 Jun
  2026 change log: "Send to Portal button is controlled by View Mode. User must have
  Full View."
- **Effect per matrix:** every role in Full View can Send to Portal; **Technician
  (Tech View) canNOT** — 28 Jun 2026 + migration table both state "Technicians lose
  'send to portal'." Time Clock = empty View Mode (N/A).

### 4) Send to Terminal
- **Gate:** requires **Invoicing → Create and Edit AND Customer Portal → ON**. §1i
  Edit: "Send to terminal: To send to terminal use must have this and 'Customer
  Portal: ON' enabled." 06 Jul 2026 change log: "Send to Terminal required both
  Invoicing.. → Create & Edit and Customer Portal → ON to be visible." Open Q4: sits
  behind Invoice & Payments - Create and Edit.
- **Roles meeting BOTH (Invoicing E + Customer Portal ON) per matrix:** Admin, Svc
  Mgr, Sr. SA, Svc Adv, Parts Mgr. (Foreman has Invoicing E but Customer Portal OFF
  → no. Office has Invoicing E but Customer Portal OFF → no.)

### 5) See AP/AR (accounts payable/receivable, aging reports)
- **Two SEPARATE things — spec is explicit they are decoupled:**
  - **AP/AR tabs + sensitive fields = Manage AP/AR toggle (`seeApArData`).** §5b ON:
    "see accounts payable/receivable data: Unpaid Invoices tabs, Payments tabs, and
    Credits tabs on Customer and Vendor detail pages and can make bulk payments from
    the Unpaid Invoices tab." Requires See Financial Data ON (08 Jul 2026: "Manage
    AP/AR required See Financial Data on"). Also gates sensitive Customer + Vendor
    fields (Credit Terms, Credit Limit, Default Labor Rate, Default Shop Supplies,
    Min/Max, Taxes, PO is Required).
  - **AR/AP AGING REPORTS = Reports toggle (NOT Manage AP/AR).** §2a Note: "AR/AP
    aging reports are part of Reports — a user with Reports ON sees all reports,
    including AR/AP aging, regardless of Manage AP/AR." Jul 3 2026 change log:
    "Manage AP & AR no longer gates the AR & AP aging reports — those now follow the
    Reports permission (all-or-nothing)."
- **Roles with Manage AP/AR ON per matrix:** Admin, Svc Mgr, Sr. SA, Parts Mgr,
  Office, Sales Rep. **OFF:** Svc Adv, Foreman, Tech, Parts Tech, Time Clock.
- **Roles with Reports ON (→ see aging) per matrix:** Admin, Svc Mgr, Sr. SA, Parts
  Mgr, Office, Sales Rep. **OFF:** Svc Adv, Foreman, Tech, Parts Tech, Time Clock.

### 6) Part Return / Remove a WO part
- **Return a part from a WO: NO PERMISSION GATE.** §1a: "Returning a part from a WOL
  does not require a permission. In practice, the user will need WO view … but there
  is no logical gate for returning a part from a WO." 29 Jun 2026 change log:
  "Everyone has access to Return a part from a WO."
- **Return parts to vendors / to inventory (Vendor & Order context):** **Vendor and
  Order Management → Create and Edit** ("Includes returning parts to vendors or
  inventory", §1g).
- **Restock / return to inventory (inventory adjustment):** **Catalog and Inventory
  → Edit** (Open Q3: "Yes, it should include return to inventory"; §1f Edit "make
  inventory adjustments including returning items to inventory").
- **Delete a Part Sale return:** **Invoicing → Delete** (§1i; 28 Jun 2026).
- **Remove a WO part / Remove a WO LINE:** removing lines = **WO Lines → Delete**
  (§1b Delete "Remove lines from work orders"). Removing/moving parts *between*
  lines = **WO Lines → Create and Edit** ("move parts between lines"). SPEC has no
  distinct "remove a single WO part" atom beyond these.
- **Roles: return-a-WO-part = ALL (no gate).** WO Lines Delete (remove lines) per
  matrix: Admin, Svc Mgr, Sr. SA, Svc Adv, Foreman. NOT: Tech, Parts Mgr, Parts
  Tech, Office, Sales Rep, Time Clock.

### 7) Order Parts area / Parts tab
- **Gate:** Work Orders sub-setting **Order Parts (`woOrderParts`)**. §1a Order
  Parts: "Place purchase orders for parts needed on a work order. Creates a PO
  linked to the work order. Also controls receiving parts deliveries onto a work
  order. **Controls visibility of the Parts tab on the work order.** Financial Gate:
  Enabling Order Parts requires See Financial Data." Requires **Work Orders → View**
  only (not Edit) PLUS **See Financial Data ON**. Jul 3 2026 change log: "Order Parts
  now controls the WO Parts tab and requires See Financial Data."
- **Roles with Order Parts ON per matrix:** Admin, Svc Mgr, Sr. SA, Svc Adv,
  Foreman, Parts Mgr, Parts Tech. **OFF:** Tech, Office, Sales Rep, Time Clock.

### 8) Approve/Decline line / Set Line Status / WO Lines Create&Edit
- **Gate:** **Work Order Lines → Create and Edit.** §1b Edit: "Add new lines, edit
  line details, move parts between lines, **authorize lines**, manage part requests
  on lines, add inspections … edit mileage, engine hours, license plate, VIN. Mark a
  core OK or Not OK on a line. View a line's story history."
- **Approve action is ALSO gated by View Mode:** Tech View "Cannot approve lines
  (approve action hidden)" and "Cannot edit existing WO lines — read-only … WO lines
  read-only after approval" (§4). So a Tech-View user cannot approve even with WOL
  Edit.
- **Roles with WO Lines Edit per matrix:** Admin, Svc Mgr, Sr. SA, Svc Adv, Foreman,
  Tech (Tech View — approve hidden), Parts Mgr. **View-only (no Edit):** Parts Tech,
  Sales Rep. **None:** Office, Time Clock.
- "Decline line" / "Set Line Status" as named actions = SPEC SILENT (spec uses
  "authorize lines"); treat as covered by WO Lines Create & Edit.

### 9) Core OK / Not-OK
- **Two distinct spec statements (marking cores appears in BOTH WO View and WOL
  Edit) — the reconciled/latest gate is Work Orders → View:**
  - §1a View: "Users can mark cores Ok/Not Ok." 07 Jul 2026 + Key Decision:
    "Marking Cores OK/Not Ok is gated by WO→View" / "Discussed with Cody and agreed
    everyone should have access to this. Therefore gate is WO→View (which implies
    WOL→View)."
  - §1b WOL Edit also lists "Mark a core OK or Not OK on a line" (Jul 3 2026:
    "Marking a core OK or Not-OK … tied to Work Order Lines → Create & Edit").
  - **NOTE FOR DOWNSTREAM:** the spec is internally inconsistent here (WO→View per
    Key Decision/07 Jul vs WOL→Create&Edit per §1b/Jul 3). Latest change-log
    intent = **everyone with WO→View** (Key Decision is the reconciliation).
- **Roles: WO→View = ALL 11 roles have WO View** → per the latest decision, all can
  mark cores.

### 10) New-WO create Customer / create Asset
- **Create Customer (in New WO flow):** **Customer Management → Create and Edit.**
  01 Jun 2026 change log: "Create/Edit customer also affect the ability to create a
  customer in the New WO flow." §1d Edit: "Create new customers…"
- **Change customer / change asset on existing WO:** **Work Orders → Create and
  Edit.** §1a Edit: "Edit work order fields (edit customer details and change
  customer, change asset, service advisor, lead technician, status, on site status)."
- **Create Asset (vehicle):** **Customer Management → Create and Edit** ("manage
  vehicles", §1d Edit).
- **Data-access nuance (Key Decision / Open Q10):** a user who can create a WO but
  lacks Customers access can still SELECT from the customer list in New-WO but won't
  see the Customers nav tab; related tabs show but WO/PS links are not clickable.
- **Roles with Customer Mgmt Create&Edit per matrix:** Admin, Svc Mgr, Sr. SA, Svc
  Adv, Foreman, Parts Mgr, Parts Tech, Office, Sales Rep. **View-only:** Tech.
  **None:** Time Clock.

### 11) WO-level History
- **Gate:** **Work Orders → Create and Edit** (relabeled from "View History Logs").
  §1a Edit: "Users can view the work order and work order line level audit logs."
  07 Jul 2026 change log: "Audit log (both line level and work order level) requires
  WO → Create & Edit." (Distinguish: **WOL-level story history** requires **WOL →
  Create & Edit** per Jul 3/07 Jul; a line's story-history VIEW noted as WOL View in
  07 Jul entry — spec has minor inconsistency, latest = WO C&E for audit logs.)
- **Roles with WO Create&Edit (→ WO-level history) per matrix:** Admin, Svc Mgr,
  Sr. SA, Svc Adv, Foreman, Parts Mgr. **NOT:** Tech, Parts Tech, Office, Sales Rep,
  Time Clock.

### 12) Timesheets
- **View timesheets from WO:** **Timesheets → View** (§1j). "If OFF, the Timesheets
  top level nav item is hidden. However, if the user has Reports ON they will still
  see the timesheet activities report."
- **Edit timesheets (adjust hours, all staff):** **Timesheets → Create and Edit**
  (§1j). "No Delete action — Timesheets only has View and Create and Edit."
- **Always-on regardless of Timesheets perm:** "All users can always clock in/out …
  All users who can clock in / out can see 'My Timesheets' regardless of this
  setting" (§1j + 06 Jul 2026).
- **Roles: Timesheets Edit per matrix:** Admin, Svc Mgr, Sr. SA, Office. **View
  only:** Svc Adv, Foreman, Parts Tech, Time Clock. **None:** Tech, Parts Mgr,
  Sales Rep.

### 13) New Line (add a work order line)
- **Gate:** **Work Order Lines → Create and Edit** (§1b Edit: "Add new lines…").
- **Tech-View exception:** Tech View "Can only create new work order lines. Cannot
  edit existing work order lines — they are read-only." (§4) — so Tech can ADD lines
  but not edit existing ones.
- **Roles per matrix:** same as WO Lines Edit — Admin, Svc Mgr, Sr. SA, Svc Adv,
  Foreman, Tech, Parts Mgr. **Cannot:** Parts Tech (View only), Sales Rep (View
  only), Office (none), Time Clock (none).

### 14) Change Customer / Change Asset on a WO
- **Gate:** **Work Orders → Create and Edit.** §1a Edit (verbatim): "Edit work order
  fields (edit customer details and change customer, change asset, service advisor,
  lead technician, status, on site status of asset)." 25 Jun 2026 change log
  clarified editing customer/asset on WO based on WO+WOL settings (SV-7938). On-Site
  status specifically gated by WO → Create&Edit (29 Jun 2026 / SV-8021).
- **Roles with WO Create&Edit per matrix:** Admin, Svc Mgr, Sr. SA, Svc Adv,
  Foreman, Parts Mgr. **NOT (WO View only):** Tech, Parts Tech, Office, Sales Rep,
  Time Clock.

---

## D. OTHER EXPLICIT ROLE-LEVEL "SHOULD / SHOULD NOT" STATEMENTS

- **Office should NOT create invoices** (hard-coded, overrides Invoicing CRUD) — but
  CAN make payments. (§"Office Users Cannot Create Invoices"; Key Decision; 07 Jul.)
- **Technician: Tech View only, loses Send to Portal, gains Pick Parts** (matrix +
  migration table + 28 Jun 2026).
- **Sales Rep: "Reports and financial data access only"** — matrix shows only
  Work Orders V, Customers V/E, Part Sales V, Timesheets none, Reports ON, SFD ON,
  AP/AR ON. Sales Rep default template "has been updated" (07 Jul 2026).
- **Time Clock: clock in/out only**, empty View Mode, no WO Lines/Customers/
  Invoicing/Parts; has WO View, Schedule V, Customers —, Timesheets V.
- **Foreman:** Pick Parts ON, Order Parts ON, but Customer Portal OFF, Reports OFF,
  Settings OFF, AP/AR OFF. Can grab parts but example given: "a Foreman who can grab
  parts from the shelf but cannot place purchase orders" is the *independent-toggle
  illustration* — in the actual matrix Foreman DOES have Order Parts ON.
- **Parts Manager:** "Loses WO/WOL Delete. Gains Schedule View, Customer Portal"
  vs legacy (migration table). Full parts control, Settings ON (Parts/Finance/Data
  Import sub-toggles).
- **Parts Tech:** Vendor & Order FULL (V/E/D) — the only non-parts-mgr role with
  Vendor Delete; gains Pick Parts, Order Parts, Invoicing V/CE, History Logs
  (migration table).
- **Senior SA:** biggest expansion — gains WO/WOL/Schedule/PartSales Delete, Vendor
  FULL, Invoicing FULL, Timesheets CE, Customer Portal, AP/AR, Reports.
- **Service Manager:** "Loses Invoicing Delete (cannot reverse)" + loses Settings
  Service/Parts/Finance/Data Import; gains Billing Portal, Customer Portal.

---

## E. STAFF-RECORD (NON-PERMISSION) CAPABILITIES — spec explicitly excludes from role model
- **Appears on technician schedule** = department assignment on staff record, NOT a
  permission.
- **Can clock into WO line tasks** = "Time Clock" setting on the staff record, NOT a
  permission (separate from basic attendance clock in/out available to all).

---

## F. CAPABILITIES IN THE COMPARISON TABS WHERE SPEC IS SILENT
- **Issue Credit** as a discrete action — SPEC SILENT (only Credits-tab *visibility*
  via Manage AP/AR).
- **"Decline line" / "Set Line Status"** as named actions — SPEC SILENT (spec says
  "authorize lines" under WOL Create&Edit).
- **"Remove a WO part"** as a distinct single-part atom — SPEC SILENT beyond
  "return a part = no gate", "move parts between lines = WOL C&E", "remove lines =
  WOL Delete".
