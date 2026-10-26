# Splitting Sales Representatives: setup file for Claude sessions

This file is for a Claude session. A manual tester never needs it: each test case is complete on its own. **It is prepared but not linked from the test cases** (QA lead, 19 Oct 2026). It holds no environment address, credentials, cookies or session data.

## 1. Header
- Feature: Splitting Sales Representatives (epic SV-10890; stories SV-11265 to SV-11272). TestRail group 84266, 180 cases.
- Generated: 19 Oct 2026, with the cases; regenerated 20 Oct 2026 for PRD version 10, Chris Ward's answers, the 7 new cases and the 8 design cases DR-01 to DR-08; regenerated 22 Oct 2026 for PRD version 11 (answers 39 and 40, new cases S5-18 and REL-16, DR-03 released, DR-08 deleted); regenerated again 22 Oct 2026 for the tech plan pass (Rule 134: 13 cases changed, 9 new draft cases S2-15, S2-16, S4-27, S4-28, S5-19, S5-20, REL-17, REL-18, REL-19, not yet in TestRail); regenerated again 22 Oct 2026 for the one-action-steps pass (steps split to one action each and unnecessary steps removed; no precondition changed, so every recipe below is unchanged); regenerated again 22 Oct 2026 for the Rule 136 pass (DRAFT: 32 cases split into 2 or 3, 36 new cases with keys ending b or c, not yet in TestRail; steps that only read are folded into the step before; untested state such as the report already open for today, an invoice already made, a switch already turned off, moved into the preconditions, so the recipes of the cases that changed follow their new precondition lines); regenerated 26 Oct 2026 for the QA lead's pattern (Rule 117 fourteenth amendment, DRAFT, not yet in TestRail: the cases now say their preconditions in plain words with no placeholders or examples, so every recipe below adds a "Plain names in the test case" line matching the case's words to the placeholders; the records, values and examples are unchanged); earlier, regenerated 26 Oct 2026 for the scenario preconditions (Rule 117 thirteenth amendment, DRAFT, not yet in TestRail: every case's Preconditions open with a "Scenario:" line; the design cases' browser-window and design-pictures line now sits just above the starting screen; the Counter Sale customer's state in [C665952](https://shopview.testrail.io/index.php?/cases/view/665952) is its own line; no record, value or example changed, so every recipe below satisfies the same records as before).
- Sources: PRD Confluence 919928833 version 11 (21 Oct 2026, Chris Ward); Chris Ward's answers 1 to 40 to the question sheet (19 and 21 Oct 2026); tech plan (dated 14 Oct 2026, uploaded 19 Oct 2026 and again, byte-identical, 22 Oct 2026; read in full 22 Oct 2026); Claude design canvas https://claude.ai/artifact/8MHqwyffAYtqZ6EccS5RUm (export read 19 Oct 2026); Sales By Representative spec Confluence 585629698 version 28; Sales By Customer spec Confluence 577634305 version 21.
- **No build yet** (QA lead, 19 Oct 2026). Every recipe below is UNVERIFIED until the build verification session runs it.
- At session start, ask the user for: the site to use and how to sign in as ACCOUNT-A (and ACCOUNT-B/C/D where a case needs them).

## 2. Accounts and roles
| Slot | Role as shown in the UI | Used for | Cases |
|---|---|---|---|
| ACCOUNT-A | Admin | Creates every record and performs every step except where another slot is named. | all |
| ACCOUNT-B (view only) | custom role with Work Orders — View only | the plain-text field | [C665920](https://shopview.testrail.io/index.php?/cases/view/665920) |
| ACCOUNT-C (work orders only) | custom role with Work Orders — Create & Edit, no Customers — Create & Edit | New Customer from a work order | [C665990](https://shopview.testrail.io/index.php?/cases/view/665990) |
| ACCOUNT-D (no reports) | custom role without Reports — Page Access | report access | [C666015](https://shopview.testrail.io/index.php?/cases/view/666015) |
| ACCOUNT-E (part sales only) | custom role with Part Sales — Create & Edit, no Customers — Create & Edit, no Work Orders — Create & Edit | New Customer from a part sale | [C690668](https://shopview.testrail.io/index.php?/cases/view/690668) |
| ACCOUNT-F (customers only) | custom role with Customers — Create & Edit, no Work Orders — View, no Work Orders — Create & Edit | the representative list in Edit Customer | [C715567](https://shopview.testrail.io/index.php?/cases/view/715567) |
| Developer check | not a UI account: only a data repair makes a staff record stop existing or belong to another organization | developers set this up; manual QA cannot | [C690666](https://shopview.testrail.io/index.php?/cases/view/690666), [C690670](https://shopview.testrail.io/index.php?/cases/view/690670), [C665980](https://shopview.testrail.io/index.php?/cases/view/665980), [C715568](https://shopview.testrail.io/index.php?/cases/view/715568) |

## 3. Flags and settings
- Always on: no feature setting (PRD Key Decisions: "Always on.").
- Staff "Sales Representative" switch on for every {Sales-rep-…} person; off for {Staff-member-D}.
- Location Shop Supplies Charge: 0% for the money cases unless the case names 10%.
- Browser: desktop at least 1024 px; design cases 1440 px at 100% zoom (1536 px and 200% zoom where named); phone cases on a touch screen with no mouse pointer; the wide-tablet case on a touch tablet with no mouse at least 1024 px wide; two-window cases in two windows of one browser.
- Report cases: Sales By Representative with Show Unassigned on and the Sales Type column turned on in the column selector, as each case says.

## 4. Data recipes
### Shared procedures (UNVERIFIED click paths; no build yet)
| Procedure | How | Check |
|---|---|---|
| P-REP | Settings > Staff > New Staff Member: First Name, Last Name, an email with ZZAUTOTEST in it, a Role, a Department, Location {Location-A}; turn the "Sales Representative" switch on; save. | The person is listed in a work order's Sales Representative dropdown. |
| P-NOSWITCH | As P-REP with the "Sales Representative" switch off. | Not listed in the dropdown. |
| P-CUSTOMER | Customers > New Customer: Name, required details, Sales Representative field(s) as the case names (+ to add Service Parts / Part Sales); save. Add a contact and an asset (unit). | The customer page lists the representative rows as named. |
| P-WO | Work Orders > Create Work Order: the customer and an asset; on the card set the Sales Representative field(s) as named (+ > "Sales Representative - Parts" for Labor/Parts); add the labor line(s) (hours × rate) and part(s) the case names; approve the lines. | The card and the Finance tab show what the case names. |
| P-PARTSALE | Part Sales > New Part Sale for the customer; add the part(s) and shop supplies named. | The part sale shows the named Sales Representative. |
| P-FEE | On the work order Finance tab add the whole-invoice fee or discount (not on a line) or the line fee/discount the case names. | The Finance tab totals match the case's numbers. |
| P-INVOICE | Finance tab > Create Invoice (close the payment dialog without paying). | The invoice exists; the card is read-only. |
| P-EXPAND | On Sales By Representative, a representative's invoice rows show only after their row is expanded with the chevron in its Date cell (the Date column header's chevron expands every row). | The invoice rows show under the representative. |
| P-HISTORY | Open the work order's history and open a saved version (the read-only card). | The version opens read-only. |
| P-SPLIT / P-REOPEN | Split Work Order or Split Part Sale moving one line or part to the new document; or pay the invoice in full and reopen the paid work order. | A new work order or part sale exists, made from the first. |
| P-TAX-EXEMPT | Mark the customer tax exempt so no tax applies to its invoices; add a non-taxable whole-invoice discount on the Finance tab. | The invoice total before tax equals the total. |
| P-PRE-RELEASE | For release-day cases: create the named records and export the named report on the site BEFORE the release is installed; keep the files. | Files saved with their dates. |

### One recipe per case: the placeholder values (the examples in the case are the values)
#### SETUP-S1-02 — [C665916](https://shopview.testrail.io/index.php?/cases/view/665916) Sales Representative list starts with Unassigned, then reps by first name
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. {Sales-rep-A} and {Sales-rep-B} share a first name; {Sales-rep-C} has a later first name. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ann Brook and {Sales-rep-C} is ZZAUTOTEST Ben Able (first name "ZZAUTOTEST Ann" or "ZZAUTOTEST Ben").
- Staff member {Staff-member-D} is active at {Location-A} with the "Sales Representative" switch off. For example: {Staff-member-D} is ZZAUTOTEST Dan Noswitch.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}, {Staff-member-D}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C; {Staff-member-D} = staff member D; {Work-order-1} = the work order.

#### SETUP-S1-03 — [C665917](https://shopview.testrail.io/index.php?/cases/view/665917) Picking a sales representative saves at once and closes the list
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S1-04 — [C665918](https://shopview.testrail.io/index.php?/cases/view/665918) Picking Unassigned clears the Sales Representative field
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S1-05 — [C665919](https://shopview.testrail.io/index.php?/cases/view/665919) Escape or a click outside closes the list without a change
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S1-06 — [C665920](https://shopview.testrail.io/index.php?/cases/view/665920) A user who can only view work orders sees the field as plain text
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as {User-B}, whose role has "Work Orders — View" but not "Work Orders — Create & Edit", at {Location-A}. For example: {User-B} is ZZAUTOTEST SSR Viewer with the custom role ZZAUTOTEST SSR View Only; {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {User-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {User-B} = user B; {Work-order-1} = the work order.

#### SETUP-S1-07 — [C665921](https://shopview.testrail.io/index.php?/cases/view/665921) A rep whose switch is turned off stays and reads (Inactive)
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Staff members {Sales-rep-A} and {Sales-rep-B} are active at {Location-A}. {Sales-rep-A}'s "Sales Representative" switch is on; {Sales-rep-B}'s was on and has since been turned off (the staff account is still active). For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field holds {Sales-rep-B}, picked while their switch was on. For example: {Work-order-1} is S2-40001.
- Starting screen: the Work Orders page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S1-08 — [C665922](https://shopview.testrail.io/index.php?/cases/view/665922) A deactivated staff member stays in the field and reads (Inactive)
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Staff member {Sales-rep-A} is active at {Location-A} with the "Sales Representative" switch on. Staff member {Sales-rep-B} had the switch on, and their staff account has since been deactivated. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field holds {Sales-rep-B}, picked before their account was deactivated. For example: {Work-order-1} is S2-40001.
- Starting screen: the Work Orders page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S1-09 — [C665923](https://shopview.testrail.io/index.php?/cases/view/665923) Picking a rep turned off in another tab is refused with a message
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide. {Sales-rep-B}'s staff record is open in a second tab of the same browser, with the "Sales Representative" switch on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S1-10 — [C665924](https://shopview.testrail.io/index.php?/cases/view/665924) Developer check: a failed save puts the field back and shows an error
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S1-10b — [C715639](https://shopview.testrail.io/index.php?/cases/view/715639) Developer check: a change made while the field is saving is ignored
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S1-11 — [C690666](https://shopview.testrail.io/index.php?/cases/view/690666) A rep who no longer exists or is in another organization reads Unassigned
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; "Sales Representative - Labor" reads {Sales-rep-A} and "Sales Representative - Parts" holds {Staff-member-C}, whose staff record no longer exists. For example: {Work-order-1} is S2-40001 and {Staff-member-C} is ZZAUTOTEST Gone Rep.
- Work order {Work-order-2} for {Customer-A} is open and not invoiced; its one "Sales Representative" field holds {Staff-member-D}, a staff member of another organization. For example: {Work-order-2} is S2-40002 and {Staff-member-D} is ZZAUTOTEST Other Org Rep.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Staff-member-C}, {Staff-member-D}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Staff-member-C} = staff member C; {Staff-member-D} = staff member D; {Work-order-1} = the first work order; {Work-order-2} = the second work order.

#### SETUP-S2-01 — [C665925](https://shopview.testrail.io/index.php?/cases/view/665925) The + adds Labor and Parts fields holding the same person
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S2-02 — [C665926](https://shopview.testrail.io/index.php?/cases/view/665926) Adding the Parts field to an Unassigned work order gives two Unassigned
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Work-order-1} = the work order.

#### SETUP-S2-03 — [C665927](https://shopview.testrail.io/index.php?/cases/view/665927) The + menu closes with Escape or a click outside, with no change
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S2-04 — [C665928](https://shopview.testrail.io/index.php?/cases/view/665928) Changing the Parts representative never changes the Labor one
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows "Sales Representative - Labor" and "Sales Representative - Parts", both reading {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S2-05 — [C665929](https://shopview.testrail.io/index.php?/cases/view/665929) The remove x keeps the Labor person in the one field
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows "Sales Representative - Labor" reading {Sales-rep-A} and "Sales Representative - Parts" reading {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S2-06 — [C665930](https://shopview.testrail.io/index.php?/cases/view/665930) Removing Parts when Labor is Unassigned leaves nobody
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows "Sales Representative - Labor" reading "Unassigned" and "Sales Representative - Parts" reading {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S2-07 — [C665931](https://shopview.testrail.io/index.php?/cases/view/665931) An inactive person is copied to Parts when the Parts field is added
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Staff member {Sales-rep-C} had the "Sales Representative" switch on, was picked on {Work-order-1}, and has since had the switch turned off (the account is still active). For example: {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads "{Sales-rep-C} (Inactive)". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C; {Work-order-1} = the work order.

#### SETUP-S2-07b — [C715640](https://shopview.testrail.io/index.php?/cases/view/715640) An inactive Labor person does not stop a change to the Parts field
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Staff member {Sales-rep-C} had the "Sales Representative" switch on, was picked on {Work-order-1}, and has since had the switch turned off (the account is still active). For example: {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows "Sales Representative - Labor" and "Sales Representative - Parts", both reading "{Sales-rep-C} (Inactive)". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C; {Work-order-1} = the work order.

#### SETUP-S2-07c — [C715641](https://shopview.testrail.io/index.php?/cases/view/715641) Removing Parts keeps the inactive Labor person in the one field
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Staff member {Sales-rep-C} had the "Sales Representative" switch on, was picked on {Work-order-1}, and has since had the switch turned off (the account is still active). For example: {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows "Sales Representative - Labor" reading "{Sales-rep-C} (Inactive)" and "Sales Representative - Parts" reading {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C; {Work-order-1} = the work order.

#### SETUP-S2-08 — [C665932](https://shopview.testrail.io/index.php?/cases/view/665932) An invoiced split work order shows both names as plain text
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} exists; its card shows "Sales Representative - Labor" reading {Sales-rep-A} and "Sales Representative - Parts" reading {Sales-rep-B}; it has just been invoiced. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S2-09 — [C665933](https://shopview.testrail.io/index.php?/cases/view/665933) A change sent to a work order invoiced in another tab is refused
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}; it is ready to invoice. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide. {Work-order-1} is also open in a second tab of the same browser
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S2-10 — [C665934](https://shopview.testrail.io/index.php?/cases/view/665934) Reversing the invoice unlocks the field and the next invoice re-captures
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} exists; its one "Sales Representative" field reads {Sales-rep-A}; it has been invoiced (not paid). For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S2-11 — [C665935](https://shopview.testrail.io/index.php?/cases/view/665935) A part sale's single Sales Representative field still saves and logs
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Part sale {Part-sale-1} for {Customer-A} is open and not invoiced; its Sales Representative field reads "Unassigned". For example: {Part-sale-1} is P-30001.
- Starting screen: {Part-sale-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Part-sale-1}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Part-sale-1} = the part sale; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S2-12 — [C665936](https://shopview.testrail.io/index.php?/cases/view/665936) A work order split off another keeps its representatives
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has {Sales-rep-C} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows "Sales Representative - Labor" reading {Sales-rep-A} and "Sales Representative - Parts" reading {Sales-rep-B}; it has two approved lines. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C; {Work-order-1} = the work order.

#### SETUP-S2-14 — [C690667](https://shopview.testrail.io/index.php?/cases/view/690667) Two windows: the later pick on the one field wins and Parts goes
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in two windows of a desktop browser at least 1024 px wide, side by side, and both windows show the one "Sales Representative" field.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S2-15 — [C715564](https://shopview.testrail.io/index.php?/cases/view/715564) A work order opened from its history shows its reps as plain text
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has {Sales-rep-C} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows "Sales Representative - Labor" reading {Sales-rep-A} and "Sales Representative - Parts" reading {Sales-rep-B}, and its history holds a version saved after both were set (for example after a line was added). For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C; {Work-order-1} = the work order.

#### SETUP-S2-16 — [C715565](https://shopview.testrail.io/index.php?/cases/view/715565) Reopening a paid work order keeps its representatives
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has {Sales-rep-C} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} shows "Sales Representative - Labor" {Sales-rep-A} and "Sales Representative - Parts" {Sales-rep-B}; it has been invoiced and paid in full. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C; {Work-order-1} = the work order.

#### SETUP-S3-01 — [C665937](https://shopview.testrail.io/index.php?/cases/view/665937) On a phone the representatives show after the card is expanded
Sub folder: Story 3 — Representatives on a phone (section 84269).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open on a phone (a touch screen with no mouse pointer).
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S3-02 — [C665938](https://shopview.testrail.io/index.php?/cases/view/665938) On a phone the field shows its arrow and opens its list without hover
Sub folder: Story 3 — Representatives on a phone (section 84269).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open on a phone (a touch screen with no mouse pointer).
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S3-02b — [C715642](https://shopview.testrail.io/index.php?/cases/view/715642) On a phone the + and the remove x work without hover
Sub folder: Story 3 — Representatives on a phone (section 84269).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open on a phone (a touch screen with no mouse pointer).
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S3-03 — [C665939](https://shopview.testrail.io/index.php?/cases/view/665939) On a phone the customer window's representative fields work as on desktop
Sub folder: Story 3 — Representatives on a phone (section 84269).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s page is open on a phone (a touch screen with no mouse pointer).
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S4-01 — [C665940](https://shopview.testrail.io/index.php?/cases/view/665940) Edit Customer has a Sales Representative field that lists Unassigned first
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Staff member {Staff-member-D} is active with the "Sales Representative" switch off. For example: {Staff-member-D} is ZZAUTOTEST Dan Noswitch.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Staff-member-D}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Staff-member-D} = staff member D.

#### SETUP-S4-01b — [C715643](https://shopview.testrail.io/index.php?/cases/view/715643) A customer can be saved with nobody as its sales representative
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s Edit Customer window is open in a desktop browser at least 1024 px wide, with the Sales Representative field reading "Unassigned".
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S4-02 — [C665941](https://shopview.testrail.io/index.php?/cases/view/665941) New Customer has the Sales Representative field too
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Starting screen: the Customers page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S4-03 — [C665942](https://shopview.testrail.io/index.php?/cases/view/665942) Adding Service Parts renames the first field and copies the person
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has {Sales-rep-A} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s Edit Customer window is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S4-04 — [C665943](https://shopview.testrail.io/index.php?/cases/view/665943) Adding Part Sales starts with what new part sales would get
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" {Sales-rep-B}, with no Part Sales field. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s Edit Customer window is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C.

#### SETUP-S4-04b — [C715644](https://shopview.testrail.io/index.php?/cases/view/715644) Changing Service Parts never changes an added Part Sales field
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-B}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s Edit Customer window is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C.

#### SETUP-S4-03b — [C724219](https://shopview.testrail.io/index.php?/cases/view/724219) Adding Service Parts starts Unassigned when the rep's switch is off
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Staff member {Staff-member-D} is active at {Location-A} with the "Sales Representative" switch turned off after being picked on the customer. For example: {Staff-member-D} is ZZAUTOTEST Dan Noswitch.
- Customer {Customer-A} has {Staff-member-D} as its one sales representative, shown as "{Staff-member-D} (Inactive)". For example: {Customer-A} is ZZAUTOTEST SSR Switch Off.
- Starting screen: {Customer-A}'s Edit Customer window is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Staff-member-D}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Staff-member-D} = staff member D.

#### SETUP-S4-04c — [C724220](https://shopview.testrail.io/index.php?/cases/view/724220) Adding Part Sales starts Unassigned when the person it copies is switched off
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Staff member {Sales-rep-A} is active at {Location-A} with the "Sales Representative" switch on. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able.
- Staff member {Staff-member-D} is active at {Location-A} with the "Sales Representative" switch turned off after being picked on the customer. For example: {Staff-member-D} is ZZAUTOTEST Dan Noswitch.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" "{Staff-member-D} (Inactive)", with no Part Sales field. For example: {Customer-A} is ZZAUTOTEST SSR Switch Off PS.
- Starting screen: {Customer-A}'s Edit Customer window is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Staff-member-D}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Staff-member-D} = staff member D.

#### SETUP-S4-05 — [C665944](https://shopview.testrail.io/index.php?/cases/view/665944) Removing Service Parts makes the Service Labor person the one rep
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s Edit Customer window is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C.

#### SETUP-S4-06 — [C665945](https://shopview.testrail.io/index.php?/cases/view/665945) Removing Part Sales makes new part sales follow again
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s Edit Customer window is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C.

#### SETUP-S4-07 — [C665946](https://shopview.testrail.io/index.php?/cases/view/665946) Nothing in the customer window is saved until Save
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has {Sales-rep-A} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s Edit Customer window is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S4-08 — [C665947](https://shopview.testrail.io/index.php?/cases/view/665947) The customer page shows the reps with or without an address
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no address and no sales representative; customer {Customer-B} has no address and {Sales-rep-A} as Service Labor and {Sales-rep-B} as Service Parts. For example: {Customer-A} is ZZAUTOTEST SSR No Address and {Customer-B} is ZZAUTOTEST SSR Split No Address.
- Starting screen: the Customers page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Customer-B}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = customer A; {Customer-B} = customer B; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S4-09 — [C665948](https://shopview.testrail.io/index.php?/cases/view/665948) A new work order starts with the customer's one representative
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has {Sales-rep-A} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: the Work Orders page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S4-10 — [C665949](https://shopview.testrail.io/index.php?/cases/view/665949) A new work order for a split customer starts with Labor and Parts
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" {Sales-rep-B}. For example: {Customer-A} is ZZAUTOTEST SSR Split Fleet.
- Starting screen: the Work Orders page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S4-11 — [C665950](https://shopview.testrail.io/index.php?/cases/view/665950) A new part sale starts with Part Sales, Service Parts or the one rep
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has {Sales-rep-A} as its one sales representative; customer {Customer-B} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" {Sales-rep-B}; customer {Customer-C} shows Service Labor {Sales-rep-A}, Service Parts {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}. For example: {Customer-A} is ZZAUTOTEST SSR One, {Customer-B} is ZZAUTOTEST SSR Two and {Customer-C} is ZZAUTOTEST SSR Three.
- Starting screen: the Part Sales page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Customer-B}, {Customer-C}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = customer A; {Customer-B} = customer B; {Customer-C} = customer C; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C.

#### SETUP-S4-12 — [C665951](https://shopview.testrail.io/index.php?/cases/view/665951) Part Sales set to Unassigned gives new part sales Unassigned
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" reading "Unassigned". For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: the Part Sales page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S4-12b — [C715645](https://shopview.testrail.io/index.php?/cases/view/715645) A part sale invoiced with Unassigned is credited to Unassigned
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" reading "Unassigned". For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Part sale {Part-sale-1} for {Customer-A} started with Sales Representative "Unassigned", has one part, and was invoiced today without a representative being picked. For example: {Part-sale-1} is P-30001.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with Show Unassigned on and the Sales Type column turned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Part-sale-1}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Part-sale-1} = the part sale; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S4-13 — [C665952](https://shopview.testrail.io/index.php?/cases/view/665952) Counter Sale starts with no representative
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Nobody has set a representative on {Location-A}'s Counter Sale customer.
- Starting screen: the Part Sales page is open at {Location-A} in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-S4-14 — [C665953](https://shopview.testrail.io/index.php?/cases/view/665953) Changing a work order's representative never changes its customer
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has {Sales-rep-A} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A} (copied from {Customer-A} when it was created). For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C; {Work-order-1} = the work order.

#### SETUP-S4-14b — [C715646](https://shopview.testrail.io/index.php?/cases/view/715646) Changing a work order's customer never changes its representatives
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has {Sales-rep-A} as its one sales representative; customer {Customer-B} has {Sales-rep-B}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet and {Customer-B} is ZZAUTOTEST SSR Other.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A} (copied from {Customer-A} when it was created). For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Customer-B}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = customer A; {Customer-B} = customer B; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S4-14c — [C715647](https://shopview.testrail.io/index.php?/cases/view/715647) Changing a customer's representative never changes its work orders
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has {Sales-rep-A} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A} (copied from {Customer-A} when it was created). For example: {Work-order-1} is S2-40001.
- Starting screen: {Customer-A}'s Edit Customer window is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S4-15 — [C665954](https://shopview.testrail.io/index.php?/cases/view/665954) A rep with the switch off is not copied to a new work order
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Staff members {Sales-rep-A} and {Sales-rep-B} are active at {Location-A}. {Sales-rep-A}'s "Sales Representative" switch is on; {Sales-rep-B}'s was on and has since been turned off (the staff account is still active). For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has {Sales-rep-B} as its one sales representative, picked while their switch was on. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: the Work Orders page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S4-15b — [C715648](https://shopview.testrail.io/index.php?/cases/view/715648) A switched-off customer rep is still credited when invoicing with nobody
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Staff members {Sales-rep-A} and {Sales-rep-B} are active at {Location-A}. {Sales-rep-A}'s "Sales Representative" switch is on; {Sales-rep-B}'s was on and has since been turned off (the staff account is still active). For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has {Sales-rep-B} as its one sales representative, picked while their switch was on. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} was created after the switch was turned off, so its Sales Representative reads "Unassigned"; it has one labor line and one part, and was invoiced today without a representative being picked. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S4-16 — [C665955](https://shopview.testrail.io/index.php?/cases/view/665955) A work order invoiced with nobody takes the customer's reps per side
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" {Sales-rep-B}. For example: {Customer-A} is ZZAUTOTEST SSR Split Fleet.
- Work order {Work-order-1} for {Customer-A} exists; it has one labor line (for example $100.00) and one part (for example $50.00); both sides read "Unassigned" and it was invoiced today without a representative being picked. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with the Sales Type column turned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S4-17 — [C665956](https://shopview.testrail.io/index.php?/cases/view/665956) An empty side is not filled from the customer at invoicing
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has {Sales-rep-B} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} exists; its card showed "Sales Representative - Labor" reading "Unassigned" and "Sales Representative - Parts" reading {Sales-rep-A} when it was invoiced today; it has one labor line and one part. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with Show Unassigned on and the Sales Type column turned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S4-18 — [C665957](https://shopview.testrail.io/index.php?/cases/view/665957) Deactivating a rep clears their customer fields and removes Part Sales
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}; customer {Customer-B} has {Sales-rep-C} as its one representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet and {Customer-B} is ZZAUTOTEST SSR Other.
- Starting screen: Settings > Staff is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Customer-B}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = customer A; {Customer-B} = customer B; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C.

#### SETUP-S4-19 — [C665958](https://shopview.testrail.io/index.php?/cases/view/665958) The Deactivate window counts a customer once when a rep holds two fields
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-B} and "Sales Representative - Service Parts" {Sales-rep-B}, and no other customer has {Sales-rep-B}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: Settings > Staff is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S4-19b — [C715649](https://shopview.testrail.io/index.php?/cases/view/715649) Turning off the switch still shows today's warning with no customer count
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-B} and "Sales Representative - Service Parts" {Sales-rep-B}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Sales-rep-B}'s staff record is open in Settings > Staff in a desktop browser at least 1024 px wide, with the "Sales Representative" switch on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S4-20 — [C665959](https://shopview.testrail.io/index.php?/cases/view/665959) Renaming a rep updates their name on every customer
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" {Sales-rep-B}; customer {Customer-B} has {Sales-rep-B} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet and {Customer-B} is ZZAUTOTEST SSR Other.
- Starting screen: {Sales-rep-B}'s staff record is open in Settings > Staff in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Customer-B}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = customer A; {Customer-B} = customer B; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S4-20b — [C715650](https://shopview.testrail.io/index.php?/cases/view/715650) A customer still holding a switched-off rep keeps them and saves
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Staff members {Sales-rep-A} and {Sales-rep-B} are active at {Location-A}. {Sales-rep-B}'s "Sales Representative" switch is on; {Sales-rep-A}'s was on and has since been turned off (the staff account is still active). For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, picked while their switch was on, and "Sales Representative - Service Parts" {Sales-rep-B}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: the Customers page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S4-21 — [C665960](https://shopview.testrail.io/index.php?/cases/view/665960) The assignments export lists one row per customer per person with Side
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has {Sales-rep-A} as its one representative; customer {Customer-B} shows Service Labor {Sales-rep-A} and Service Parts {Sales-rep-B}; customer {Customer-C} has {Sales-rep-C} as its one representative and "Sales Representative - Part Sales" {Sales-rep-C}. The customer names sort A to Z as {Customer-A}, {Customer-B}, {Customer-C}, and {Sales-rep-A}'s name sorts before {Sales-rep-B}'s. For example: {Customer-A} is ZZAUTOTEST SSR A-One, {Customer-B} is ZZAUTOTEST SSR B-Two and {Customer-C} is ZZAUTOTEST SSR C-Three.
- Starting screen: the page with the Sales Representative Assignments export is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Customer-B}, {Customer-C}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = customer A; {Customer-B} = customer B; {Customer-C} = customer C; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C.

#### SETUP-S4-22 — [C665961](https://shopview.testrail.io/index.php?/cases/view/665961) Re-importing a customer keeps all its representatives
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} shows Service Labor {Sales-rep-A}, Service Parts {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- A contacts import file contains {Customer-A} with its current details. For example: the file is ZZAUTOTEST-ssr-reimport.csv.
- Starting screen: the contacts import is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C.

#### SETUP-S4-25 — [C690668](https://shopview.testrail.io/index.php?/cases/view/690668) A part-sales-only user adding a customer from a part sale sees the reps
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as {User-B}, whose role has "Part Sales — Create & Edit" but not "Customers — Create & Edit" or "Work Orders — Create & Edit", at {Location-A}. For example: {User-B} is ZZAUTOTEST SSR Part Sales Only with the custom role ZZAUTOTEST SSR Part Sales Only; {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Staff member {Staff-member-D} is active at {Location-A} with the "Sales Representative" switch off. For example: {Staff-member-D} is ZZAUTOTEST Dan Noswitch.
- Starting screen: the Part Sales page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Staff-member-D}, {User-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Staff-member-D} = staff member D; {User-B} = user B.

#### SETUP-S4-26 — [C690669](https://shopview.testrail.io/index.php?/cases/view/690669) Reactivating a rep does not put them back on their customers
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Staff members {Sales-rep-A} and {Sales-rep-B} are active at {Location-A} with the "Sales Representative" switch on. Staff member {Sales-rep-C} had the switch on, and their staff account has since been deactivated. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Before {Sales-rep-C} was deactivated, customer {Customer-A} had {Sales-rep-C} as its one sales representative and customer {Customer-B} showed "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet and {Customer-B} is ZZAUTOTEST SSR Other.
- Starting screen: {Sales-rep-C}'s staff record is open in Settings > Staff in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Customer-B}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = customer A; {Customer-B} = customer B; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C.

#### SETUP-S3-04 — [C690672](https://shopview.testrail.io/index.php?/cases/view/690672) On a wide touch tablet the card opens expanded with its buttons showing
Sub folder: Story 3 — Representatives on a phone (section 84269).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open on a touch tablet with no mouse, held so its screen is at least 1024 px wide. For example: an iPad Pro 12.9-inch in landscape.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S4-27 — [C715566](https://shopview.testrail.io/index.php?/cases/view/715566) A part sale split off another keeps its representative
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} shows "Sales Representative - Part Sales" {Sales-rep-C}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Part sale {Part-sale-1} for {Customer-A} is open and not invoiced, with Sales Representative {Sales-rep-A} and two parts. For example: {Part-sale-1} is P-30001.
- Starting screen: {Part-sale-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Part-sale-1}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Part-sale-1} = the part sale; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C.

#### SETUP-S4-28 — [C715567](https://shopview.testrail.io/index.php?/cases/view/715567) A customers-only user sees the representatives in Edit Customer
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as {User-B}, whose role has "Customers — Create & Edit" but neither "Work Orders — View" nor "Work Orders — Create & Edit", at {Location-A}. For example: {User-B} is ZZAUTOTEST SSR Customers Only with the custom role ZZAUTOTEST SSR Customers Only; {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Staff member {Staff-member-D} is active at {Location-A} with the "Sales Representative" switch off. For example: {Staff-member-D} is ZZAUTOTEST Dan Noswitch.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Staff-member-D}, {User-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Staff-member-D} = staff member D; {User-B} = user B.

#### SETUP-S5-01 — [C665962](https://shopview.testrail.io/index.php?/cases/view/665962) A split invoice gives the Labor rep a Labor row and the Parts rep a Parts row
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} exists; it has one labor line of 2.00 hours at $100.00 an hour (Tech Time 2.00) and one part sold at $50.00; "Sales Representative - Labor" reads {Sales-rep-A} and "Sales Representative - Parts" reads {Sales-rep-B}; it was invoiced today. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with the Sales Type column turned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S5-01b — [C715651](https://shopview.testrail.io/index.php?/cases/view/715651) The Sales Type column shows after Status, with no value on summary rows
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} exists; it has one labor line of 2.00 hours at $100.00 an hour (Tech Time 2.00) and one part sold at $50.00; "Sales Representative - Labor" reads {Sales-rep-A} and "Sales Representative - Parts" reads {Sales-rep-B}; it was invoiced today. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with the Sales Type column off.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S5-02 — [C665963](https://shopview.testrail.io/index.php?/cases/view/665963) All shop supplies, including a hand-typed amount, go to the Labor row
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 10% of labor, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} exists; it has one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00, and on its Finance tab shop supplies were typed by hand as $15.00 in place of the calculated $20.00; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}; it was invoiced today. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with the Sales Type column turned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S5-03 — [C665964](https://shopview.testrail.io/index.php?/cases/view/665964) A whole-invoice discount is shared by the size of each side
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one labor line of 6.00 hours at $100.00 an hour ($600.00), one part sold at $400.00, shop supplies typed by hand as $30.00 and a whole-invoice discount of $50.00 (not on any line); Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S5-04 — [C665965](https://shopview.testrail.io/index.php?/cases/view/665965) A negative side still shares a discount by size
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one labor line of 6.00 hours at $100.00 an hour ($600.00), one returned part credited at $100.00 (a part line of -$100.00) and a whole-invoice discount of $70.00; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S5-05 — [C665966](https://shopview.testrail.io/index.php?/cases/view/665966) The Parts share is rounded to the cent and the Labor row gets the rest
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} has one labor line of 1.00 hour at $100.00 ($100.00), one part sold at $200.00 and a whole-invoice discount of $1.00; work order {Work-order-2} for {Customer-A} has one labor line of 1.00 hour at $100.00, one part sold at $100.00 and a whole-invoice discount of $0.01. On both, Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}, and both were invoiced today. For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the first work order; {Work-order-2} = the second work order.

#### SETUP-S5-06 — [C665967](https://shopview.testrail.io/index.php?/cases/view/665967) A whole-invoice fee with no labor or parts dollars goes to one side
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Three work orders for {Customer-A} each have only a whole-invoice fee of $25.00 and no labor or parts dollars, and all three were invoiced today: {Work-order-1} with Labor {Sales-rep-A} and Parts {Sales-rep-B}; {Work-order-2} with Labor "Unassigned" and Parts {Sales-rep-B}; {Work-order-3} with both sides "Unassigned" and a customer with no representative. For example: {Work-order-1} is S2-40001, {Work-order-2} is S2-40002 and {Work-order-3} is S2-40003.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with Show Unassigned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}, {Work-order-2}, {Work-order-3}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the first work order; {Work-order-2} = the second work order; {Work-order-3} = the third work order.

#### SETUP-S5-07 — [C665968](https://shopview.testrail.io/index.php?/cases/view/665968) A part sale is one Part Sales row holding the whole sale
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Three part sales for {Customer-A} have Sales Representative {Sales-rep-A} and were invoiced today: {Part-sale-1} has one part at $80.00 and shop supplies of $5.00; {Part-sale-2} has one part at $40.00 and no shop supplies charge; {Part-sale-3} has one part at $30.00 and a shop supplies charge of $0.00. For example: {Part-sale-1} is P-30001, {Part-sale-2} is P-30002 and {Part-sale-3} is P-30003.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with the Sales Type column turned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Part-sale-1}, {Part-sale-2}, {Part-sale-3}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Part-sale-1} = the first part sale; {Part-sale-2} = the second part sale; {Part-sale-3} = the third part sale; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S5-08 — [C665969](https://shopview.testrail.io/index.php?/cases/view/665969) One person on both sides shows one Labor, Parts row
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} has one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00; work order {Work-order-2} for {Customer-A} has one part sold at $50.00 and no labor. On both, "Sales Representative - Labor" and "Sales Representative - Parts" read {Sales-rep-A}, and both were invoiced today. For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with the Sales Type column turned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the first work order; {Work-order-2} = the second work order.

#### SETUP-S5-08b — [C715652](https://shopview.testrail.io/index.php?/cases/view/715652) Narrowing Sales Type to Labor or Parts shows only that side
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} exists; it has one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00; "Sales Representative - Labor" and "Sales Representative - Parts" both read {Sales-rep-A}; it was invoiced today. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with the Sales Type column turned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S5-09 — [C665970](https://shopview.testrail.io/index.php?/cases/view/665970) Report totals are the same split or not when Show Unassigned is on
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} exists; it has one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00; its one "Sales Representative" reads {Sales-rep-A}; it was invoiced today. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S5-10 — [C665971](https://shopview.testrail.io/index.php?/cases/view/665971) Margin % on an invoice row uses only that row's side
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} exists; it has one labor line of 2.00 hours at $100.00 an hour and one part with cost $30.00 sold at $50.00; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}; it was invoiced today. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S5-11 — [C665972](https://shopview.testrail.io/index.php?/cases/view/665972) The Sales Type column is off by default and first in the column list
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- You have never changed the columns of Sales By Representative since the release.
- Starting screen: Reports > Sales By Representative is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-S5-11b — [C715653](https://shopview.testrail.io/index.php?/cases/view/715653) A Sales Type column you turn on stays on when you sign in again
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The Sales Type column of Sales By Representative is off for you.
- Starting screen: Reports > Sales By Representative is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-S5-12 — [C665973](https://shopview.testrail.io/index.php?/cases/view/665973) Expanded CSV and PDF always carry the Sales Type column
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} exists; it was invoiced today with a labor line and a part; Labor {Sales-rep-A}, Parts {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with the Sales Type column off on screen.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S5-13 — [C665974](https://shopview.testrail.io/index.php?/cases/view/665974) A zero-dollar side or invoice still counts for its representative
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} has one labor line of 1.00 hour at $100.00 and no parts, with Labor {Sales-rep-A} and Parts {Sales-rep-B}; work order {Work-order-2} totals $0.00 (one labor line at $0.00) with its one Sales Representative {Sales-rep-A}. Both were invoiced today. For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with the Sales Type column turned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the first work order; {Work-order-2} = the second work order.

#### SETUP-S5-14 — [C665975](https://shopview.testrail.io/index.php?/cases/view/665975) A renamed rep stays one row under the current name in the report
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} exists; it has a labor line and a part; Labor {Sales-rep-A}, Parts {Sales-rep-B}; it was invoiced today. For example: {Work-order-1} is S2-40001.
- Since that invoice, {Sales-rep-B}'s last name has been changed. For example: from "Able" to "Brook".
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S6-01 — [C665976](https://shopview.testrail.io/index.php?/cases/view/665976) Printed work order names the one person who holds both sides
Sub folder: Story 6 — Printed work order (section 84273).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Staff member {Sales-rep-A} is active at {Location-A} with the "Sales Representative" switch on. Staff member {Sales-rep-C} is active and had the switch on, and it has since been turned off. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} has one "Sales Representative" field reading {Sales-rep-A}; work order {Work-order-2} for {Customer-A} has one "Sales Representative" field holding {Sales-rep-C}, picked before their switch was turned off. For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-C}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-C} = sales rep C; {Work-order-1} = the first work order; {Work-order-2} = the second work order.

#### SETUP-S6-01b — [C715654](https://shopview.testrail.io/index.php?/cases/view/715654) A split work order with one person on both sides prints one name
Sub folder: Story 6 — Printed work order (section 84273).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows "Sales Representative - Labor" and "Sales Representative - Parts", both reading {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S6-02 — [C665977](https://shopview.testrail.io/index.php?/cases/view/665977) Printed work order names both people, Parts first
Sub folder: Story 6 — Printed work order (section 84273).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Staff members {Sales-rep-A} and {Sales-rep-B} are active at {Location-A} with the "Sales Representative" switch on. Staff member {Sales-rep-C} is active and had the switch on, and it has since been turned off. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} has Labor {Sales-rep-A} and Parts {Sales-rep-B}; work order {Work-order-2} for {Customer-A} has Labor {Sales-rep-A} and Parts {Sales-rep-C}, picked before their switch was turned off. For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C; {Work-order-1} = the first work order; {Work-order-2} = the second work order.

#### SETUP-S6-03 — [C665978](https://shopview.testrail.io/index.php?/cases/view/665978) Printed work order shows Unassigned for an empty side
Sub folder: Story 6 — Printed work order (section 84273).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} has Labor "Unassigned" and Parts {Sales-rep-B}; work order {Work-order-2} has Labor {Sales-rep-A} and Parts "Unassigned". For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the first work order; {Work-order-2} = the second work order.

#### SETUP-S6-04 — [C665979](https://shopview.testrail.io/index.php?/cases/view/665979) Printed work order leaves the row off when nobody is on it
Sub folder: Story 6 — Printed work order (section 84273).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Work-order-1} = the work order.

#### SETUP-S6-05 — [C665980](https://shopview.testrail.io/index.php?/cases/view/665980) A side whose staff member no longer exists prints as Unassigned
Sub folder: Story 6 — Printed work order (section 84273).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and Labor reads {Sales-rep-A} and Parts held {Sales-rep-B}, whose staff record no longer exists. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S7-01 — [C665981](https://shopview.testrail.io/index.php?/cases/view/665981) Changing the one field writes a log entry with before and after
Sub folder: Story 7 — Work order log (section 84274).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S7-01b — [C715655](https://shopview.testrail.io/index.php?/cases/view/715655) Adding the Parts field and changing it each write one log entry
Sub folder: Story 7 — Work order log (section 84274).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S7-01c — [C715656](https://shopview.testrail.io/index.php?/cases/view/715656) Removing the Parts field writes a log entry
Sub folder: Story 7 — Work order log (section 84274).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S7-02 — [C665982](https://shopview.testrail.io/index.php?/cases/view/665982) A split work order's log entry shows Unassigned for an empty side
Sub folder: Story 7 — Work order log (section 84274).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S7-03 — [C665983](https://shopview.testrail.io/index.php?/cases/view/665983) Picking the person already in the field writes no log entry
Sub folder: Story 7 — Work order log (section 84274).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S7-05 — [C690670](https://shopview.testrail.io/index.php?/cases/view/690670) A log entry reads Unassigned for a rep who no longer exists
Sub folder: Story 7 — Work order log (section 84274).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; "Sales Representative - Labor" reads {Sales-rep-A} and "Sales Representative - Parts" holds {Staff-member-C}, whose staff record no longer exists. For example: {Work-order-1} is S2-40001 and {Staff-member-C} is ZZAUTOTEST Gone Rep.
- Work order {Work-order-2} for {Customer-A} is open and not invoiced; its one "Sales Representative" field holds {Staff-member-D}, a staff member of another organization. For example: {Work-order-2} is S2-40002 and {Staff-member-D} is ZZAUTOTEST Other Org Rep.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Staff-member-C}, {Staff-member-D}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Staff-member-C} = staff member C; {Staff-member-D} = staff member D; {Work-order-1} = the first work order; {Work-order-2} = the second work order.

#### SETUP-S8-01 — [C665984](https://shopview.testrail.io/index.php?/cases/view/665984) Sales By Representative has a Sales Type filter, all selected
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: Reports > Sales By Representative is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-S8-02 — [C665985](https://shopview.testrail.io/index.php?/cases/view/665985) Sales By Representative exports name the Sales Type selection
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: Reports > Sales By Representative is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-S8-02b — [C715657](https://shopview.testrail.io/index.php?/cases/view/715657) With no Sales Type ticked, Sales By Representative export makes no file
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: Reports > Sales By Representative is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-S8-03 — [C665986](https://shopview.testrail.io/index.php?/cases/view/665986) Sales By Customer's Product Type filter now reads Sales Type
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: Reports > Sales By Customer is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-S8-04 — [C665987](https://shopview.testrail.io/index.php?/cases/view/665987) Sales By Customer exports name the Sales Type selection
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: Reports > Sales By Customer is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-S8-04b — [C715658](https://shopview.testrail.io/index.php?/cases/view/715658) With no Sales Type ticked, Sales By Customer export makes no file
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: Reports > Sales By Customer is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-S8-05 — [C665988](https://shopview.testrail.io/index.php?/cases/view/665988) Sales By Customer figures do not change with the new wording
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Today customer {Customer-A} has one invoiced part sale of $40.00 and one invoiced work order of $250.00 that includes a part. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: Reports > Sales By Customer is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S8-12 — [C690671](https://shopview.testrail.io/index.php?/cases/view/690671) Sales By Representative exports with no rows still have the headings
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- {Location-A} has no invoices on {Date-A}. For example: {Date-A} is 1 Jan 2026.
- Starting screen: Reports > Sales By Representative is open for {Date-A} in a desktop browser at least 1024 px wide, showing no invoices.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Date-A}, {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Date-A} = the date; {Location-A} = the test location.

#### SETUP-S8-12b — [C715659](https://shopview.testrail.io/index.php?/cases/view/715659) Sales By Customer exports with no rows still have the headings
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- {Location-A} has no invoices on {Date-A}. For example: {Date-A} is 1 Jan 2026.
- Starting screen: Reports > Sales By Customer is open for {Date-A} in a desktop browser at least 1024 px wide, showing no invoices.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Date-A}, {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Date-A} = the date; {Location-A} = the test location.

#### SETUP-S5-19 — [C715568](https://shopview.testrail.io/index.php?/cases/view/715568) A rep whose staff record is gone shows the name kept on the invoice
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} was invoiced today with "Sales Representative - Labor" {Sales-rep-A} and "Sales Representative - Parts" {Staff-member-C}; since then {Staff-member-C}'s staff record no longer exists. For example: {Work-order-1} is S2-40001 and {Staff-member-C} is ZZAUTOTEST Gone Rep.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with Show Unassigned on and the Sales Type column turned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Staff-member-C}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Staff-member-C} = staff member C; {Work-order-1} = the work order.

#### SETUP-S5-20 — [C715569](https://shopview.testrail.io/index.php?/cases/view/715569) A discount bigger than the invoice is shared by size and both rows end at $0.00
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative, and no tax applies to its invoices. For example: {Customer-A} is ZZAUTOTEST SSR Tax Exempt, set as tax exempt.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one labor line of 1.00 hour at $100.00 ($100.00), one part sold at $50.00 and a non-taxable whole-invoice discount of $200.00 (not on any line); Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S4-23 — [C665989](https://shopview.testrail.io/index.php?/cases/view/665989) Saving a customer with a rep turned off in another tab is refused
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s Edit Customer window is open in a desktop browser at least 1024 px wide, and {Sales-rep-B}'s staff record is open in a second tab of the same browser, with the "Sales Representative" switch on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S4-24 — [C665990](https://shopview.testrail.io/index.php?/cases/view/665990) A work-orders-only user adding a customer from a work order sees the reps
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as {User-B}, whose role has "Work Orders — Create & Edit" but not "Customers — Create & Edit", at {Location-A}. For example: {User-B} is ZZAUTOTEST SSR WO Only with the custom role ZZAUTOTEST SSR WO Only; {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Starting screen: the Work Orders page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {User-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {User-B} = user B.

#### SETUP-S5-15 — [C665991](https://shopview.testrail.io/index.php?/cases/view/665991) The Summary export has no Sales Type column and rep rows leave it blank
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} exists; it was invoiced today with a labor line and a part; Labor {Sales-rep-A}, Parts {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S5-16 — [C665992](https://shopview.testrail.io/index.php?/cases/view/665992) Line fees stay with their side and a processing fee is shared by size
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one labor line of 3.00 hours at $100.00 ($300.00) with a labor-line discount of $30.00, one part sold at $100.00 with a part-line fee of $10.00, and a whole-invoice fee of $38.00; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S5-17 — [C665993](https://shopview.testrail.io/index.php?/cases/view/665993) Every report row adds up to the report totals to the cent
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Today {Location-A} has at least three invoices: one split work order, one work order with one person on both sides and one part sale.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with Show Unassigned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S7-04 — [C665994](https://shopview.testrail.io/index.php?/cases/view/665994) The Audit Log finds an entry by the Parts person's name
Sub folder: Story 7 — Work order log (section 84274).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}, and the Parts side was changed to {Sales-rep-B} today. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S2-13 — [C665995](https://shopview.testrail.io/index.php?/cases/view/665995) Moving lines into an existing work order does not change its reps
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} has two approved lines and Labor {Sales-rep-A}, Parts {Sales-rep-B}; work order {Work-order-2} for {Customer-A} has one Sales Representative {Sales-rep-C}. For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C; {Work-order-1} = the first work order; {Work-order-2} = the second work order.

#### SETUP-S5-18 — [C715271](https://shopview.testrail.io/index.php?/cases/view/715271) A part sale's labor cells show a dash in the PDF and are blank in the CSV
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Part sale {Part-sale-1} for {Customer-A} has Sales Representative {Sales-rep-A} and one part at $80.00, and was invoiced today. For example: {Part-sale-1} is P-30001.
- Starting screen: Reports > Sales By Representative is open in a desktop browser at least 1024 px wide, set to today.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Part-sale-1}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Part-sale-1} = the part sale; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S8-06 — [C665996](https://shopview.testrail.io/index.php?/cases/view/665996) A rep with no invoice of the chosen Sales Type leaves the report
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today {Sales-rep-A} holds only the Labor side of one invoiced split work order, and {Sales-rep-B} holds its Parts side; neither has other invoices today.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with Show Unassigned on and the Sales Type column turned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S8-06b — [C715660](https://shopview.testrail.io/index.php?/cases/view/715660) The Sales Type column header does not sort the report
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today {Sales-rep-A} holds only the Labor side of one invoiced split work order, and {Sales-rep-B} holds its Parts side; neither has other invoices today.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with Show Unassigned on and the Sales Type column turned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S8-07 — [C665997](https://shopview.testrail.io/index.php?/cases/view/665997) Going back from an invoice keeps the Sales Type selection
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today has at least one invoiced split work order with Labor {Sales-rep-A} and Parts {Sales-rep-B}.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with Show Unassigned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-S8-08 — [C665998](https://shopview.testrail.io/index.php?/cases/view/665998) Sales By Customer's Sales Type menu has Select all and Clear selection
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: Reports > Sales By Customer is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-S8-09 — [C665999](https://shopview.testrail.io/index.php?/cases/view/665999) Changing Sales Type on Sales By Customer collapses expanded rows
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today {Customer-A} has an invoiced part sale and an invoiced work order.
- Starting screen: Reports > Sales By Customer is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location.

#### SETUP-S8-09b — [C715661](https://shopview.testrail.io/index.php?/cases/view/715661) Sales By Customer keeps its Sales Type choice when you go back
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today {Customer-A} has an invoiced part sale and an invoiced work order.
- Starting screen: Reports > Sales By Customer is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location.

#### SETUP-S8-10 — [C666000](https://shopview.testrail.io/index.php?/cases/view/666000) The Customer filter searches only within the chosen Sales Type
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Today customer {Customer-A} has only an invoiced part sale and customer {Customer-B} only an invoiced work order; both names start with the same text, {Search-A}. For example: {Customer-A} is ZZAUTOTEST SSR Parts Only, {Customer-B} is ZZAUTOTEST SSR Service Only and {Search-A} is ZZAUTOTEST SSR.
- Starting screen: Reports > Sales By Customer is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Customer-B}, {Location-A}, {Search-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = customer A; {Customer-B} = customer B; {Location-A} = the test location; {Search-A} = the search word.

#### SETUP-S8-10b — [C715662](https://shopview.testrail.io/index.php?/cases/view/715662) The Customer filter sits between Sales Type and Location
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: Reports > Sales By Customer is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-S8-11 — [C666001](https://shopview.testrail.io/index.php?/cases/view/666001) Sales By Representative's Sales Type filter works on a touch screen
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: Reports > Sales By Representative is open on a phone or tablet (a touch screen with no mouse pointer).
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-S8-11b — [C715663](https://shopview.testrail.io/index.php?/cases/view/715663) Sales By Customer's Sales Type filter works on a touch screen
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: Reports > Sales By Customer is open on a phone or tablet (a touch screen with no mouse pointer).
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-REL-15 — [C666002](https://shopview.testrail.io/index.php?/cases/view/666002) Reversed invoices stay out of Sales By Customer with both types selected
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today {Customer-A} has one invoiced work order and one invoice that was reversed.
- Starting screen: Reports > Sales By Customer is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location.

#### SETUP-REL-16 — [C715272](https://shopview.testrail.io/index.php?/cases/view/715272) Part sale rows show a dash in the labor columns and the totals do not change
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Part sale {Part-sale-1} (one part at $80.00) and work order {Work-order-1} (one labor line of 2.00 hours at $100.00 an hour) for {Customer-A} both have Sales Representative {Sales-rep-A}, and both were invoiced today. For example: {Part-sale-1} is P-30001 and {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Part-sale-1}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Part-sale-1} = the part sale; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-REL-01 — [C666003](https://shopview.testrail.io/index.php?/cases/view/666003) On release day an existing customer keeps its one representative
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Before the release was installed, customer {Customer-A} had {Sales-rep-A} as its sales representative, customer {Customer-B} had none, and customer {Customer-C} had a representative who was no longer a user of the shop; you noted how the three customer pages looked. For example: {Customer-A} is ZZAUTOTEST SSR Before, {Customer-B} is ZZAUTOTEST SSR Before None and {Customer-C} is ZZAUTOTEST SSR Before Gone User.
- The browser window is a desktop browser at least 1024 px wide, and the design pictures "customer-00-b-customer-page.png" (board 2.0), "customer-01-b-customer-dialog-open.png" (board 2.1) and "customer-02-b-new.png" (board 2.2) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: the release is installed and {Customer-A}'s page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Customer-B}, {Customer-C}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = customer A; {Customer-B} = customer B; {Customer-C} = customer C; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-REL-02 — [C666004](https://shopview.testrail.io/index.php?/cases/view/666004) On release day an open work order keeps its one representative
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Before the release was installed, work order {Work-order-1} for {Customer-A} was open (not invoiced) with {Sales-rep-A} as its sales representative. For example: {Work-order-1} is S2-39001.
- The browser window is a desktop browser at least 1024 px wide, and the design pictures "card-00-b-wo-rest2.png" (board 1.0) and "card-01-b-wo-open.png" (board 1.1) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: the release is installed and {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-REL-03 — [C666005](https://shopview.testrail.io/index.php?/cases/view/666005) Sales By Representative for a past date shows the same totals
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Before the release was installed, you exported Sales By Representative (Expanded CSV) for a past date range with invoices, with Show Unassigned on. For example: the range is 1 Aug 2026 to 31 Aug 2026.
- The browser window is a desktop browser at least 1024 px wide, and the design pictures "sbr-00-b-sbr.png" (board 4.0), "sbr-01-b-sbr-filter.png" (board 4.1), "sbr-02-b-sbr-columns.png" (board 4.2) and "sbr-03-b-sbr-expanded.png" (board 4.3) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: the release is installed and Reports > Sales By Representative is open in a desktop browser at least 1024 px wide, set to the same date range as the export made before the release, with Show Unassigned on and the Sales Type column turned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-REL-04 — [C666006](https://shopview.testrail.io/index.php?/cases/view/666006) Invoices from before 29 Jul 2026 stay Unassigned on both sides
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- {Location-A} has invoices dated before 29 Jul 2026. For example: invoices from June 2026.
- Starting screen: Reports > Sales By Representative is open in a desktop browser at least 1024 px wide, set to a date range before 29 Jul 2026 that holds those invoices, with Show Unassigned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-REL-05 — [C666007](https://shopview.testrail.io/index.php?/cases/view/666007) Saved report columns and sort reset once on release day
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Before the release was installed, you changed the columns and the sort of Sales By Representative.
- Starting screen: the release is installed and you open Reports > Sales By Representative in the same browser, desktop width at least 1024 px.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-REL-05b — [C715664](https://shopview.testrail.io/index.php?/cases/view/715664) An old Product Type link opens Sales By Representative with all types
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Before the release was installed, you bookmarked a link to Sales By Representative that narrowed it by Product Type.
- Starting screen: the release is installed and the bookmark is ready in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-REL-06 — [C666008](https://shopview.testrail.io/index.php?/cases/view/666008) A Sales By Customer filter from before the release keeps its options
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Before the release was installed, you bookmarked Sales By Customer with only one Product Type option selected. For example: only the parts option selected.
- The browser window is a desktop browser at least 1024 px wide, and the design picture "sbc-00-b-sbc-filter.png" (board 5.0) attached to this case is open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: the release is installed and the bookmark is ready in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-REL-07 — [C666009](https://shopview.testrail.io/index.php?/cases/view/666009) Imported work orders still have no sales representative
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- {Location-A} has an imported work order, {Work-order-1}. For example: {Work-order-1} is an imported work order from the previous system.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location; {Work-order-1} = the work order.

#### SETUP-REL-08 — [C666010](https://shopview.testrail.io/index.php?/cases/view/666010) Customer invoice and estimate documents still show no representative
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-REL-09 — [C666011](https://shopview.testrail.io/index.php?/cases/view/666011) Credit memos stay out of Sales By Representative
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today {Customer-A} has an invoiced split work order (Labor {Sales-rep-A}, Parts {Sales-rep-B}) and a credit memo of $20.00.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with Show Unassigned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-REL-10 — [C666012](https://shopview.testrail.io/index.php?/cases/view/666012) The Sales Follow-Up report is still not in the Reports menu
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: any page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-REL-11 — [C666013](https://shopview.testrail.io/index.php?/cases/view/666013) No sales representative is sent to QuickBooks
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A} is connected to a QuickBooks test company.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-REL-12 — [C666014](https://shopview.testrail.io/index.php?/cases/view/666014) On a phone Lead Technician and Service Advisor keep today's arrow behaviour
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- The browser window is a phone screen, and the design pictures "phone-00-b-phone-details.png" (board 6.0) and "phone-01-b-phone-open.png" (board 6.1) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Work-order-1} is open on a phone (a touch screen with no mouse pointer).
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Work-order-1} = the work order.

#### SETUP-REL-13 — [C666015](https://shopview.testrail.io/index.php?/cases/view/666015) A user without Reports access still cannot open Sales By Representative
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as {User-B}, whose role does not have "Reports — Page Access", at {Location-A}. For example: {User-B} is ZZAUTOTEST SSR No Reports; {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: any page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}, {User-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location; {User-B} = user B.

#### SETUP-REL-14 — [C666016](https://shopview.testrail.io/index.php?/cases/view/666016) A work order that is never split is credited exactly as before
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} exists; it has one labor line of 2.00 hours at $100.00 an hour and one part with cost $30.00 sold at $50.00; its one Sales Representative reads {Sales-rep-A}; it was invoiced today. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with the Sales Type column off.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-REL-17 — [C715570](https://shopview.testrail.io/index.php?/cases/view/715570) Filter labels on other reports read as before
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- At least three locations are open to you: {Location-A}, {Location-B} and {Location-C}. For example: Staging Heavy Duty - 9919, QA Testing and ZZAUTOTEST SSR Third Location.
- Starting screen: Reports > Parts Velocity is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}, {Location-B}, {Location-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location; {Location-B} = the second location; {Location-C} = the third location.

#### SETUP-REL-18 — [C715571](https://shopview.testrail.io/index.php?/cases/view/715571) The invoice preview still opens for a split work order
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Customer {Customer-A} has a unit (vehicle), {Unit-A}. For example: {Unit-A} is ZZAUTOTEST SSR Truck 1.
- Work order {Work-order-1} for {Customer-A} on {Unit-A} is open and not invoiced; it has one labor line and one part; "Sales Representative - Labor" reads {Sales-rep-A} and "Sales Representative - Parts" reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Unit-A}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Unit-A} = the unit; {Work-order-1} = the work order.

#### SETUP-REL-18b — [C715665](https://shopview.testrail.io/index.php?/cases/view/715665) A unit's invoice list still opens after a split work order is invoiced
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Customer {Customer-A} has a unit (vehicle), {Unit-A}. For example: {Unit-A} is ZZAUTOTEST SSR Truck 1.
- Work order {Work-order-1} for {Customer-A} on {Unit-A} has one labor line and one part; "Sales Representative - Labor" reads {Sales-rep-A} and "Sales Representative - Parts" reads {Sales-rep-B}; it was invoiced today. For example: {Work-order-1} is S2-40001.
- Starting screen: {Unit-A}'s page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Unit-A}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Unit-A} = the unit; {Work-order-1} = the work order.

#### SETUP-REL-19 — [C715572](https://shopview.testrail.io/index.php?/cases/view/715572) A log entry saved before the release reads one representative
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Before the release was installed, work order {Work-order-1} for {Customer-A} had its Sales Representative changed from {Sales-rep-A} to {Sales-rep-B}, which wrote a "Sales representative changed" entry, and a version of it was saved to its history with {Sales-rep-B}; it is still open and not invoiced. For example: {Work-order-1} is S2-39002.
- Starting screen: the release is installed and {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-REL-19b — [C715666](https://shopview.testrail.io/index.php?/cases/view/715666) A history version saved before the release shows one representative
Sub folder: Release day and what must not change (section 84276).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Before the release was installed, work order {Work-order-1} for {Customer-A} had {Sales-rep-B} as its one Sales Representative, and a version of it was saved to its history with {Sales-rep-B}; it is still open and not invoiced. For example: {Work-order-1} is S2-39002.
- Starting screen: the release is installed and {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-D-01 — [C666017](https://shopview.testrail.io/index.php?/cases/view/666017) Work order card at rest matches the design
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced with nobody in Sales Representative; work order {Work-order-2} has Sales Representative {Sales-rep-A}. For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-02-n1-rest.png" (board 1.2) and "card-05-n1-picked.png" (board 1.5) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the first work order; {Work-order-2} = the second work order.

#### SETUP-D-02 — [C666018](https://shopview.testrail.io/index.php?/cases/view/666018) Hovering the Sales Representative row shows the box, arrow and +
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-03-n1-hover.png" (board 1.3) and "card-06-n1-picked-hover.png" (board 1.6) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-D-03 — [C666019](https://shopview.testrail.io/index.php?/cases/view/666019) The Sales Representative list looks as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads "Unassigned". For example: {Work-order-1} is S2-40001.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-04-n1-list.png" (board 1.4) and "card-15-n1-unassign-list.png" (board 1.15) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-D-04 — [C666020](https://shopview.testrail.io/index.php?/cases/view/666020) The + tooltip and menu look as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-07-n1-add-tip.png" (board 1.7) and "card-08-n1-add-menu.png" (board 1.8) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-D-05 — [C666021](https://shopview.testrail.io/index.php?/cases/view/666021) Labor and Parts fields at rest and on hover look as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows "Sales Representative - Labor" and "Sales Representative - Parts", both reading {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-09-n1-added.png" (board 1.9), "card-10-n1-added-hover.png" (board 1.10) and "card-11-n1-labor-list.png" (board 1.11) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-D-05b — [C715667](https://shopview.testrail.io/index.php?/cases/view/715667) Design: at 200% zoom the Labor and Parts labels show in full
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows "Sales Representative - Labor" and "Sales Representative - Parts", both reading {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-09-n1-added.png" (board 1.9) and "card-10-n1-added-hover.png" (board 1.10) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-D-06 — [C666022](https://shopview.testrail.io/index.php?/cases/view/666022) Two reps, the remove x and removing Parts look as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and Labor reads {Sales-rep-B} and Parts reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-12-n1-two.png" (board 1.12), "card-13-n1-remove-tip.png" (board 1.13) and "card-14-n1-removed.png" (board 1.14) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-D-07 — [C666023](https://shopview.testrail.io/index.php?/cases/view/666023) Clearing the field with Unassigned looks as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-15-n1-unassign-list.png" (board 1.15) and "card-16-n1-cleared.png" (board 1.16) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-D-08 — [C666024](https://shopview.testrail.io/index.php?/cases/view/666024) The invoiced work order card shows the reps as plain text
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} exists; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}; it has been invoiced. For example: {Work-order-1} is S2-40001.
- The browser window is 1440 px wide with the zoom at 100%, and the design picture "card-17-n1-invoiced.png" (board 1.17) attached to this case is open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-D-09 — [C666025](https://shopview.testrail.io/index.php?/cases/view/666025) Work order log entries read as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-18-b-audit.png" (board 1.18) and "card-19-n1-audit.png" (board 1.19) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-D-10 — [C666026](https://shopview.testrail.io/index.php?/cases/view/666026) Design: Edit Customer's Sales Representative field and list look as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "customer-03-n2-edit.png" (board 2.3), "customer-04-n2-edit-list.png" (board 2.4) and "customer-05-n2-edit-picked.png" (board 2.5) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Customer-A}'s page is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C.

#### SETUP-D-10b — [C715668](https://shopview.testrail.io/index.php?/cases/view/715668) Design: Edit Customer's + tooltip and menu look as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "customer-06-n2-add-tip.png" (board 2.6) and "customer-07-n2-add-menu.png" (board 2.7) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Customer-A}'s Edit Customer window is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C.

#### SETUP-D-11 — [C666027](https://shopview.testrail.io/index.php?/cases/view/666027) Design: adding Service Parts and Part Sales in Edit Customer looks as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has {Sales-rep-A} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "customer-08-n2-service-parts.png" (board 2.8), "customer-09-n2-add-menu-2.png" (board 2.9), "customer-10-n2-three-added.png" (board 2.10) and "customer-11-n2-ps-list.png" (board 2.11) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Customer-A}'s Edit Customer window is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C.

#### SETUP-D-11b — [C715669](https://shopview.testrail.io/index.php?/cases/view/715669) Design: removing Service Parts in Edit Customer looks as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "customer-12-n2-three.png" (board 2.12), "customer-13-n2-remove-tip.png" (board 2.13) and "customer-14-n2-ps-only.png" (board 2.14) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Customer-A}'s Edit Customer window is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C.

#### SETUP-D-12 — [C666028](https://shopview.testrail.io/index.php?/cases/view/666028) The customer page reads every representative row as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} shows Service Labor {Sales-rep-A}, Service Parts {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- The browser window is 1440 px wide with the zoom at 100%, and the design picture "customer-15-n2-page-three.png" (board 2.15) attached to this case is open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Customer-A}'s page is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C.

#### SETUP-D-13 — [C666029](https://shopview.testrail.io/index.php?/cases/view/666029) New Customer's representative field looks as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "customer-16-n2-new.png" (board 2.16), "customer-17-n2-new-menu.png" (board 2.17) and "customer-18-n2-new-ps.png" (board 2.18) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: the Customers page is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Sales-rep-C} = sales rep C.

#### SETUP-D-14 — [C666030](https://shopview.testrail.io/index.php?/cases/view/666030) A part sale's representative field is unchanged from Part Sales Update v1
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Part sale {Part-sale-1} for {Customer-A} is open and not invoiced. For example: {Part-sale-1} is P-30001.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "partsale-00-b-ps.png" (board 3.0), "partsale-01-n3-rest.png" (board 3.1), "partsale-02-n3-hover.png" (board 3.2), "partsale-03-n3-list.png" (board 3.3) and "partsale-04-n3-picked-hover.png" (board 3.4) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Part-sale-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Part-sale-1}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Part-sale-1} = the part sale; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-D-15 — [C666031](https://shopview.testrail.io/index.php?/cases/view/666031) Design: Sales By Representative rows and dashes look as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today has one invoiced split work order (Labor {Sales-rep-A}, Parts {Sales-rep-B}), one invoiced work order with {Sales-rep-A} on both sides and one invoiced part sale with no shop supplies.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "sbr-04-a4-sbr-c.png" (board 4.4) and "sbr-05-a4-sbr-expanded.png" (board 4.5) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: Reports > Sales By Representative is open for today in that browser window, with the Sales Type column off.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-D-15b — [C715670](https://shopview.testrail.io/index.php?/cases/view/715670) Design: the Sales Type filter on Sales By Representative looks as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today has one invoiced split work order (Labor {Sales-rep-A}, Parts {Sales-rep-B}), one invoiced work order with {Sales-rep-A} on both sides and one invoiced part sale with no shop supplies.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "sbr-06-a4-filter-open.png" (board 4.6) and "sbr-07-a4-sbr-labor-only.png" (board 4.7) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: Reports > Sales By Representative is open for today in that browser window, with the Sales Type column turned on (as in the picture of board 4.7).
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-D-15c — [C715671](https://shopview.testrail.io/index.php?/cases/view/715671) Design: the Sales Type column on Sales By Representative looks as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today has one invoiced split work order (Labor {Sales-rep-A}, Parts {Sales-rep-B}), one invoiced work order with {Sales-rep-A} on both sides and one invoiced part sale with no shop supplies.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "sbr-08-a4-columns-off.png" (board 4.8), "sbr-09-a4-columns-on.png" (board 4.9) and "sbr-10-a4-sbr-expanded-type.png" (board 4.10) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: Reports > Sales By Representative is open for today in that browser window, with the Sales Type column off.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-D-16 — [C666032](https://shopview.testrail.io/index.php?/cases/view/666032) Sales By Representative Expanded CSV and PDF look as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today has one invoiced split work order (Labor {Sales-rep-A}, Parts {Sales-rep-B}) and one invoiced part sale.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "sbr-11-a4-export-csv.png" (board 4.11) and "sbr-12-a4-export-pdf-crop-1.png" (board 4.12) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: Reports > Sales By Representative is open in that browser window, with the Sales Type column off.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-D-17 — [C666033](https://shopview.testrail.io/index.php?/cases/view/666033) Sales By Customer Sales Type filter looks as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "sbc-01-n5-sbc.png" (board 5.1) and "sbc-02-n5-sbc-open.png" (board 5.2) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: Reports > Sales By Customer is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location.

#### SETUP-D-18 — [C666034](https://shopview.testrail.io/index.php?/cases/view/666034) Design: on a phone the Sales Representative field looks as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads "Unassigned". For example: {Work-order-1} is S2-40001.
- The browser window is a phone screen 390 px wide, and the design pictures "phone-02-n6-field.png" (board 6.2), "phone-03-n6-list.png" (board 6.3) and "phone-04-n6-picked.png" (board 6.4) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Work-order-1} is open on a phone (a touch screen with no mouse pointer), card expanded.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-D-18b — [C715672](https://shopview.testrail.io/index.php?/cases/view/715672) Design: on a phone the + and the Labor and Parts fields look as designed
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- The browser window is a phone screen 390 px wide, and the design pictures "phone-05-n6-add-menu.png" (board 6.5), "phone-06-n6-added.png" (board 6.6) and "phone-07-n6-parts-list.png" (board 6.7) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Work-order-1} is open on a phone (a touch screen with no mouse pointer), card expanded.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-S1-01 — [C665915](https://shopview.testrail.io/index.php?/cases/view/665915) Sales Representative field appears below Service Advisor when unassigned
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the Admin role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} was created for {Customer-A} at {Location-A}, is not invoiced or paid, and nobody has picked a sales representative on it. For example: {Work-order-1} is S2-40001.
- Starting screen: the Work Orders page, on a desktop or laptop computer with a mouse.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Work-order-1} = the work order.

#### SETUP-DR-01 — [C690658](https://shopview.testrail.io/index.php?/cases/view/690658) Design: invoiced card keeps "Lead technician" and "Service advisor" labels
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Work order {Work-order-1} has been invoiced; its card shows "Sales Representative - Labor" reading {Sales-rep-A} and "Sales Representative - Parts" reading {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Work order {Work-order-2} is open and not invoiced. For example: {Work-order-2} is S2-40002.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-17-n1-invoiced.png" (board 1.17) and "card-02-n1-rest.png" (board 1.2) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the first work order; {Work-order-2} = the second work order.

#### SETUP-DR-02 — [C690659](https://shopview.testrail.io/index.php?/cases/view/690659) Design: a part sale's field label still reads "Sales representative"
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Part sale {Part-sale-1} for {Customer-A} is open and not invoiced. For example: {Part-sale-1} is P-30001.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "partsale-01-n3-rest.png" (board 3.1), "partsale-02-n3-hover.png" (board 3.2) and "partsale-04-n3-picked-hover.png" (board 3.4) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: {Part-sale-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Part-sale-1}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Part-sale-1} = the part sale; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-DR-03 — [C690660](https://shopview.testrail.io/index.php?/cases/view/690660) Design: a part sale row shows a dash in the labor columns
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Part sale {Part-sale-1} for {Customer-A} has Sales Representative {Sales-rep-A}, one part and no labor, and was invoiced today. For example: {Part-sale-1} is P-30001 with one part sold at $50.00.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "sbr-03-b-sbr-expanded.png" (board 4.3), "sbr-10-a4-sbr-expanded-type.png" (board 4.10), "sbr-11-a4-export-csv.png" (board 4.11) and "sbr-12-a4-export-pdf-crop-1.png" (board 4.12) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: Reports > Sales By Representative is open in that browser window, with the date range set to today, Show Unassigned on and the Sales Type column turned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Part-sale-1}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Part-sale-1} = the part sale; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B.

#### SETUP-DR-04 — [C690661](https://shopview.testrail.io/index.php?/cases/view/690661) Design: invoice dates in the Expanded exports match the screen
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} has "Sales Representative - Labor" {Sales-rep-A} and "Sales Representative - Parts" {Sales-rep-B} and was invoiced today; it has one labor line and one part. For example: {Work-order-1} is S2-40001.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "sbr-10-a4-sbr-expanded-type.png" (board 4.10), "sbr-11-a4-export-csv.png" (board 4.11) and "sbr-12-a4-export-pdf-crop-1.png" (board 4.12) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: Reports > Sales By Representative is open in that browser window, with the date range set to today and Show Unassigned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-DR-06 — [C690663](https://shopview.testrail.io/index.php?/cases/view/690663) Design: Sales Type sits between Status and Location
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- A second location, {Location-B}, is open to you, and the report shows its Location column. For example: {Location-B} is QA Testing, and both locations are selected in the Location filter.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Work order {Work-order-1} at {Location-A} has "Sales Representative - Labor" {Sales-rep-A} and "Sales Representative - Parts" {Sales-rep-B} and was invoiced today. For example: {Work-order-1} is S2-40001.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "sbr-09-a4-columns-on.png" (board 4.9), "sbr-11-a4-export-csv.png" (board 4.11) and "sbr-12-a4-export-pdf-crop-1.png" (board 4.12) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: Reports > Sales By Representative is open in that browser window, with the date range set to today and Show Unassigned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Location-A}, {Location-B}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Location-A} = the test location; {Location-B} = the second location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

#### SETUP-DR-07 — [C690664](https://shopview.testrail.io/index.php?/cases/view/690664) Design: each split row shows its share under Adjustments
Sub folder: Design — how it looks (section 84277).
Satisfies the case's preconditions; here with the placeholders and examples a Claude session uses (the case itself, in the QA lead's pattern of 26 Oct 2026, says them in plain words):
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} has labor $600.00, parts $400.00, shop supplies $30.00 and a whole-invoice discount of $50.00, "Sales Representative - Labor" {Sales-rep-A} and "Sales Representative - Parts" {Sales-rep-B}, and was invoiced today. For example: {Work-order-1} is S2-40001.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "sbr-07-a4-sbr-labor-only.png" (board 4.7), "sbr-11-a4-export-csv.png" (board 4.11) and "sbr-12-a4-export-pdf-crop-1.png" (board 4.12) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: Reports > Sales By Representative is open in that browser window, with the date range set to today and Show Unassigned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases; where a precondition says a switch was turned off, an account deactivated or a name changed after the person was picked, do that in Settings > Staff last; P-EXPAND when a step expands a row of Sales By Representative.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.
Plain names in the test case: {Customer-A} = the customer; {Location-A} = the test location; {Sales-rep-A} = sales rep A; {Sales-rep-B} = sales rep B; {Work-order-1} = the work order.

## 5. Mapping table
| Sub folder | Cases |
|---|---|
| Story 1 — One Sales Representative field on the work order | [C665916](https://shopview.testrail.io/index.php?/cases/view/665916), [C665917](https://shopview.testrail.io/index.php?/cases/view/665917), [C665918](https://shopview.testrail.io/index.php?/cases/view/665918), [C665919](https://shopview.testrail.io/index.php?/cases/view/665919), [C665920](https://shopview.testrail.io/index.php?/cases/view/665920), [C665921](https://shopview.testrail.io/index.php?/cases/view/665921), [C665922](https://shopview.testrail.io/index.php?/cases/view/665922), [C665923](https://shopview.testrail.io/index.php?/cases/view/665923), [C665924](https://shopview.testrail.io/index.php?/cases/view/665924), [C715639](https://shopview.testrail.io/index.php?/cases/view/715639), [C690666](https://shopview.testrail.io/index.php?/cases/view/690666), [C665915](https://shopview.testrail.io/index.php?/cases/view/665915) |
| Story 2 — Separate Labor and Parts representatives | [C665925](https://shopview.testrail.io/index.php?/cases/view/665925), [C665926](https://shopview.testrail.io/index.php?/cases/view/665926), [C665927](https://shopview.testrail.io/index.php?/cases/view/665927), [C665928](https://shopview.testrail.io/index.php?/cases/view/665928), [C665929](https://shopview.testrail.io/index.php?/cases/view/665929), [C665930](https://shopview.testrail.io/index.php?/cases/view/665930), [C665931](https://shopview.testrail.io/index.php?/cases/view/665931), [C715640](https://shopview.testrail.io/index.php?/cases/view/715640), [C715641](https://shopview.testrail.io/index.php?/cases/view/715641), [C665932](https://shopview.testrail.io/index.php?/cases/view/665932), [C665933](https://shopview.testrail.io/index.php?/cases/view/665933), [C665934](https://shopview.testrail.io/index.php?/cases/view/665934), [C665935](https://shopview.testrail.io/index.php?/cases/view/665935), [C665936](https://shopview.testrail.io/index.php?/cases/view/665936), [C690667](https://shopview.testrail.io/index.php?/cases/view/690667), [C715564](https://shopview.testrail.io/index.php?/cases/view/715564), [C715565](https://shopview.testrail.io/index.php?/cases/view/715565), [C665995](https://shopview.testrail.io/index.php?/cases/view/665995) |
| Story 3 — Representatives on a phone | [C665937](https://shopview.testrail.io/index.php?/cases/view/665937), [C665938](https://shopview.testrail.io/index.php?/cases/view/665938), [C715642](https://shopview.testrail.io/index.php?/cases/view/715642), [C665939](https://shopview.testrail.io/index.php?/cases/view/665939), [C690672](https://shopview.testrail.io/index.php?/cases/view/690672) |
| Story 4 — A customer's default representatives | [C665940](https://shopview.testrail.io/index.php?/cases/view/665940), [C715643](https://shopview.testrail.io/index.php?/cases/view/715643), [C665941](https://shopview.testrail.io/index.php?/cases/view/665941), [C665942](https://shopview.testrail.io/index.php?/cases/view/665942), [C665943](https://shopview.testrail.io/index.php?/cases/view/665943), [C715644](https://shopview.testrail.io/index.php?/cases/view/715644), [C724219](https://shopview.testrail.io/index.php?/cases/view/724219), [C724220](https://shopview.testrail.io/index.php?/cases/view/724220), [C665944](https://shopview.testrail.io/index.php?/cases/view/665944), [C665945](https://shopview.testrail.io/index.php?/cases/view/665945), [C665946](https://shopview.testrail.io/index.php?/cases/view/665946), [C665947](https://shopview.testrail.io/index.php?/cases/view/665947), [C665948](https://shopview.testrail.io/index.php?/cases/view/665948), [C665949](https://shopview.testrail.io/index.php?/cases/view/665949), [C665950](https://shopview.testrail.io/index.php?/cases/view/665950), [C665951](https://shopview.testrail.io/index.php?/cases/view/665951), [C715645](https://shopview.testrail.io/index.php?/cases/view/715645), [C665952](https://shopview.testrail.io/index.php?/cases/view/665952), [C665953](https://shopview.testrail.io/index.php?/cases/view/665953), [C715646](https://shopview.testrail.io/index.php?/cases/view/715646), [C715647](https://shopview.testrail.io/index.php?/cases/view/715647), [C665954](https://shopview.testrail.io/index.php?/cases/view/665954), [C715648](https://shopview.testrail.io/index.php?/cases/view/715648), [C665955](https://shopview.testrail.io/index.php?/cases/view/665955), [C665956](https://shopview.testrail.io/index.php?/cases/view/665956), [C665957](https://shopview.testrail.io/index.php?/cases/view/665957), [C665958](https://shopview.testrail.io/index.php?/cases/view/665958), [C715649](https://shopview.testrail.io/index.php?/cases/view/715649), [C665959](https://shopview.testrail.io/index.php?/cases/view/665959), [C715650](https://shopview.testrail.io/index.php?/cases/view/715650), [C665960](https://shopview.testrail.io/index.php?/cases/view/665960), [C665961](https://shopview.testrail.io/index.php?/cases/view/665961), [C690668](https://shopview.testrail.io/index.php?/cases/view/690668), [C690669](https://shopview.testrail.io/index.php?/cases/view/690669), [C715566](https://shopview.testrail.io/index.php?/cases/view/715566), [C715567](https://shopview.testrail.io/index.php?/cases/view/715567), [C665989](https://shopview.testrail.io/index.php?/cases/view/665989), [C665990](https://shopview.testrail.io/index.php?/cases/view/665990) |
| Story 5 — Credit on the invoice and in Sales By Representative | [C665962](https://shopview.testrail.io/index.php?/cases/view/665962), [C715651](https://shopview.testrail.io/index.php?/cases/view/715651), [C665963](https://shopview.testrail.io/index.php?/cases/view/665963), [C665968](https://shopview.testrail.io/index.php?/cases/view/665968), [C665969](https://shopview.testrail.io/index.php?/cases/view/665969), [C715652](https://shopview.testrail.io/index.php?/cases/view/715652), [C665972](https://shopview.testrail.io/index.php?/cases/view/665972), [C715653](https://shopview.testrail.io/index.php?/cases/view/715653), [C665973](https://shopview.testrail.io/index.php?/cases/view/665973), [C665975](https://shopview.testrail.io/index.php?/cases/view/665975), [C715568](https://shopview.testrail.io/index.php?/cases/view/715568), [C665991](https://shopview.testrail.io/index.php?/cases/view/665991), [C715271](https://shopview.testrail.io/index.php?/cases/view/715271) |
| Credit and totals — exact amounts | [C665964](https://shopview.testrail.io/index.php?/cases/view/665964), [C665965](https://shopview.testrail.io/index.php?/cases/view/665965), [C665966](https://shopview.testrail.io/index.php?/cases/view/665966), [C665967](https://shopview.testrail.io/index.php?/cases/view/665967), [C665970](https://shopview.testrail.io/index.php?/cases/view/665970), [C665971](https://shopview.testrail.io/index.php?/cases/view/665971), [C665974](https://shopview.testrail.io/index.php?/cases/view/665974), [C715569](https://shopview.testrail.io/index.php?/cases/view/715569), [C665992](https://shopview.testrail.io/index.php?/cases/view/665992), [C665993](https://shopview.testrail.io/index.php?/cases/view/665993) |
| Story 6 — Printed work order | [C665976](https://shopview.testrail.io/index.php?/cases/view/665976), [C715654](https://shopview.testrail.io/index.php?/cases/view/715654), [C665977](https://shopview.testrail.io/index.php?/cases/view/665977), [C665978](https://shopview.testrail.io/index.php?/cases/view/665978), [C665979](https://shopview.testrail.io/index.php?/cases/view/665979), [C665980](https://shopview.testrail.io/index.php?/cases/view/665980) |
| Story 7 — Work order log | [C665981](https://shopview.testrail.io/index.php?/cases/view/665981), [C715655](https://shopview.testrail.io/index.php?/cases/view/715655), [C715656](https://shopview.testrail.io/index.php?/cases/view/715656), [C665982](https://shopview.testrail.io/index.php?/cases/view/665982), [C665983](https://shopview.testrail.io/index.php?/cases/view/665983), [C690670](https://shopview.testrail.io/index.php?/cases/view/690670), [C665994](https://shopview.testrail.io/index.php?/cases/view/665994) |
| Story 8 — Sales Type filters on both sales reports | [C665984](https://shopview.testrail.io/index.php?/cases/view/665984), [C665985](https://shopview.testrail.io/index.php?/cases/view/665985), [C715657](https://shopview.testrail.io/index.php?/cases/view/715657), [C665986](https://shopview.testrail.io/index.php?/cases/view/665986), [C665987](https://shopview.testrail.io/index.php?/cases/view/665987), [C715658](https://shopview.testrail.io/index.php?/cases/view/715658), [C665988](https://shopview.testrail.io/index.php?/cases/view/665988), [C690671](https://shopview.testrail.io/index.php?/cases/view/690671), [C715659](https://shopview.testrail.io/index.php?/cases/view/715659), [C665996](https://shopview.testrail.io/index.php?/cases/view/665996), [C715660](https://shopview.testrail.io/index.php?/cases/view/715660), [C665997](https://shopview.testrail.io/index.php?/cases/view/665997), [C665998](https://shopview.testrail.io/index.php?/cases/view/665998), [C665999](https://shopview.testrail.io/index.php?/cases/view/665999), [C715661](https://shopview.testrail.io/index.php?/cases/view/715661), [C666000](https://shopview.testrail.io/index.php?/cases/view/666000), [C715662](https://shopview.testrail.io/index.php?/cases/view/715662), [C666001](https://shopview.testrail.io/index.php?/cases/view/666001), [C715663](https://shopview.testrail.io/index.php?/cases/view/715663) |
| Release day and what must not change | [C666002](https://shopview.testrail.io/index.php?/cases/view/666002), [C715272](https://shopview.testrail.io/index.php?/cases/view/715272), [C666003](https://shopview.testrail.io/index.php?/cases/view/666003), [C666004](https://shopview.testrail.io/index.php?/cases/view/666004), [C666005](https://shopview.testrail.io/index.php?/cases/view/666005), [C666006](https://shopview.testrail.io/index.php?/cases/view/666006), [C666007](https://shopview.testrail.io/index.php?/cases/view/666007), [C715664](https://shopview.testrail.io/index.php?/cases/view/715664), [C666008](https://shopview.testrail.io/index.php?/cases/view/666008), [C666009](https://shopview.testrail.io/index.php?/cases/view/666009), [C666010](https://shopview.testrail.io/index.php?/cases/view/666010), [C666011](https://shopview.testrail.io/index.php?/cases/view/666011), [C666012](https://shopview.testrail.io/index.php?/cases/view/666012), [C666013](https://shopview.testrail.io/index.php?/cases/view/666013), [C666014](https://shopview.testrail.io/index.php?/cases/view/666014), [C666015](https://shopview.testrail.io/index.php?/cases/view/666015), [C666016](https://shopview.testrail.io/index.php?/cases/view/666016), [C715570](https://shopview.testrail.io/index.php?/cases/view/715570), [C715571](https://shopview.testrail.io/index.php?/cases/view/715571), [C715665](https://shopview.testrail.io/index.php?/cases/view/715665), [C715572](https://shopview.testrail.io/index.php?/cases/view/715572), [C715666](https://shopview.testrail.io/index.php?/cases/view/715666) |
| Design — how it looks | [C666017](https://shopview.testrail.io/index.php?/cases/view/666017), [C666018](https://shopview.testrail.io/index.php?/cases/view/666018), [C666019](https://shopview.testrail.io/index.php?/cases/view/666019), [C666020](https://shopview.testrail.io/index.php?/cases/view/666020), [C666021](https://shopview.testrail.io/index.php?/cases/view/666021), [C715667](https://shopview.testrail.io/index.php?/cases/view/715667), [C666022](https://shopview.testrail.io/index.php?/cases/view/666022), [C666023](https://shopview.testrail.io/index.php?/cases/view/666023), [C666024](https://shopview.testrail.io/index.php?/cases/view/666024), [C666025](https://shopview.testrail.io/index.php?/cases/view/666025), [C666026](https://shopview.testrail.io/index.php?/cases/view/666026), [C715668](https://shopview.testrail.io/index.php?/cases/view/715668), [C666027](https://shopview.testrail.io/index.php?/cases/view/666027), [C715669](https://shopview.testrail.io/index.php?/cases/view/715669), [C666028](https://shopview.testrail.io/index.php?/cases/view/666028), [C666029](https://shopview.testrail.io/index.php?/cases/view/666029), [C666030](https://shopview.testrail.io/index.php?/cases/view/666030), [C666031](https://shopview.testrail.io/index.php?/cases/view/666031), [C715670](https://shopview.testrail.io/index.php?/cases/view/715670), [C715671](https://shopview.testrail.io/index.php?/cases/view/715671), [C666032](https://shopview.testrail.io/index.php?/cases/view/666032), [C666033](https://shopview.testrail.io/index.php?/cases/view/666033), [C666034](https://shopview.testrail.io/index.php?/cases/view/666034), [C715672](https://shopview.testrail.io/index.php?/cases/view/715672), [C690658](https://shopview.testrail.io/index.php?/cases/view/690658), [C690659](https://shopview.testrail.io/index.php?/cases/view/690659), [C690660](https://shopview.testrail.io/index.php?/cases/view/690660), [C690661](https://shopview.testrail.io/index.php?/cases/view/690661), [C690663](https://shopview.testrail.io/index.php?/cases/view/690663), [C690664](https://shopview.testrail.io/index.php?/cases/view/690664) |

## 6. Dependencies and shared fixtures
- Every case owns its records; the example names carry ZZAUTOTEST. Money cases need a location where nothing else is invoiced that day (or a fresh ZZAUTOTEST location).

## 7. Reset and cleanup
- Leave ZZAUTOTEST records in place. Turn back on any "Sales Representative" switch a case turned off, and reactivate any staff member a case deactivated, before reusing them.

## 8. Traceability
Every case's expected results quote their source sentences word for word (PRD v11, Chris Ward's answers, tech plan, report specs); the checker `authoring/build.py` refuses any quote not found verbatim. All 143 PRD version 11 requirement codes are covered (174 library cases, 22 Oct 2026, after the Rule 136 pass).

## 9. VIU status
- Every case and recipe: UNVERIFIED — the build is not yet available.

## 10. Open questions
- Chris Ward answered all 38 questions of the first sheet on 19 Oct 2026 (design-recheck-2026-10-20/chris-answers.json).
- Questions 39 and 40 (rows 46 and 47, light green) of the same sheet (https://docs.google.com/spreadsheets/d/17Ry1BtRTPEkecBP5TlgAE0T93Ai1TQewdJ7B7WpWDBQ) were answered by Chris Ward on 21 Oct 2026 and became PRD version 11: [C690660](https://shopview.testrail.io/index.php?/cases/view/690660) was released; DR-08 (C690665) was deleted on 22 Oct 2026 because nothing makes a Lead Technician message show today (answer 40). (A third, on the phone control, was withdrawn on 20 Oct 2026 as answered by answer 9; its held case DR-05 was deleted.) Question 41 (a customer adds the Part Sales field while its Service Parts or one representative has the switch off: what does the new field start with?) was drafted on 22 Oct 2026 in tech-plan-pass-2026-10-22/NEW-QUESTIONS.md; it was added to the same sheet on 22 Oct 2026 (rows 48-49, light orange) and Chris Ward answered it on 23 Oct 2026 (PRD version 13, S4-R7 and S4-R8: the added field starts "Unassigned"); no case is held on it.
