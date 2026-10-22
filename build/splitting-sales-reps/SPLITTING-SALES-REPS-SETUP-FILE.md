# Splitting Sales Representatives: setup file for Claude sessions

This file is for a Claude session. A manual tester never needs it: each test case is complete on its own. **It is prepared but not linked from the test cases** (QA lead, 19 Oct 2026). It holds no environment address, credentials, cookies or session data.

## 1. Header
- Feature: Splitting Sales Representatives (epic SV-10890; stories SV-11265 to SV-11272). TestRail group 84266, 135 cases.
- Generated: 19 Oct 2026, with the cases; regenerated 20 Oct 2026 for PRD version 10, Chris Ward's answers, the 7 new cases and the 8 design cases DR-01 to DR-08; regenerated 22 Oct 2026 for PRD version 11 (answers 39 and 40, new cases S5-18 and REL-16, DR-03 released, DR-08 deleted).
- Sources: PRD Confluence 919928833 version 10 (19 Oct 2026, Chris Ward); Chris Ward's answers to the question sheet (19 Oct 2026); tech plan (dated 14 Oct 2026, uploaded 19 Oct 2026); Claude design canvas https://claude.ai/artifact/8MHqwyffAYtqZ6EccS5RUm (export read 19 Oct 2026); Sales By Representative spec Confluence 585629698 version 28; Sales By Customer spec Confluence 577634305 version 21.
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
| Developer check | not a UI account: only a data repair makes a staff record stop existing or belong to another organization | developers set this up; manual QA cannot | [C690666](https://shopview.testrail.io/index.php?/cases/view/690666), [C690670](https://shopview.testrail.io/index.php?/cases/view/690670), [C665980](https://shopview.testrail.io/index.php?/cases/view/665980) |

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
| P-PRE-RELEASE | For release-day cases: create the named records and export the named report on the site BEFORE the release is installed; keep the files. | Files saved with their dates. |

### One recipe per case: the placeholder values (the examples in the case are the values)
#### SETUP-S1-01 — [C665915](https://shopview.testrail.io/index.php?/cases/view/665915) Sales Representative sits under Service Advisor and reads Unassigned
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S1-02 — [C665916](https://shopview.testrail.io/index.php?/cases/view/665916) Sales Representative list starts with Unassigned, then reps by first name
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. {Sales-rep-A} and {Sales-rep-B} share a first name; {Sales-rep-C} has a later first name. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ann Brook and {Sales-rep-C} is ZZAUTOTEST Ben Able (first name "ZZAUTOTEST Ann" or "ZZAUTOTEST Ben").
- Staff member {Staff-member-D} is active at {Location-A} with the "Sales Representative" switch off. For example: {Staff-member-D} is ZZAUTOTEST Dan Noswitch.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}, {Staff-member-D}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S1-03 — [C665917](https://shopview.testrail.io/index.php?/cases/view/665917) Picking a sales representative saves at once and closes the list
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S1-04 — [C665918](https://shopview.testrail.io/index.php?/cases/view/665918) Picking Unassigned clears the Sales Representative field
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S1-05 — [C665919](https://shopview.testrail.io/index.php?/cases/view/665919) Escape or a click outside closes the list without a change
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S1-06 — [C665920](https://shopview.testrail.io/index.php?/cases/view/665920) A user who can only view work orders sees the field as plain text
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as {User-B}, whose role has "Work Orders — View" but not "Work Orders — Create & Edit", at {Location-A}. For example: {User-B} is ZZAUTOTEST SSR Viewer with the custom role ZZAUTOTEST SSR View Only; {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {User-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S1-07 — [C665921](https://shopview.testrail.io/index.php?/cases/view/665921) A rep whose switch is turned off stays and reads (Inactive)
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: Settings > Staff is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S1-08 — [C665922](https://shopview.testrail.io/index.php?/cases/view/665922) A deactivated staff member stays in the field and reads (Inactive)
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: Settings > Staff is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S1-09 — [C665923](https://shopview.testrail.io/index.php?/cases/view/665923) Picking a rep turned off in another tab is refused with a message
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide. Settings > Staff is open in a second tab of the same browser
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S1-10 — [C665924](https://shopview.testrail.io/index.php?/cases/view/665924) Developer check: a failed save or a change made mid-save
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S1-11 — [C690666](https://shopview.testrail.io/index.php?/cases/view/690666) A rep who no longer exists or is in another organization reads Unassigned
Sub folder: Story 1 — One Sales Representative field on the work order (section 84267).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; "Sales Representative - Labor" reads {Sales-rep-A} and "Sales Representative - Parts" holds {Staff-member-C}, whose staff record no longer exists. For example: {Work-order-1} is S2-40001 and {Staff-member-C} is ZZAUTOTEST Gone Rep.
- Work order {Work-order-2} for {Customer-A} is open and not invoiced; its one "Sales Representative" field holds {Staff-member-D}, a staff member of another organization. For example: {Work-order-2} is S2-40002 and {Staff-member-D} is ZZAUTOTEST Other Org Rep.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Staff-member-C}, {Staff-member-D}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S2-01 — [C665925](https://shopview.testrail.io/index.php?/cases/view/665925) The + adds Labor and Parts fields holding the same person
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S2-02 — [C665926](https://shopview.testrail.io/index.php?/cases/view/665926) Adding the Parts field to an Unassigned work order gives two Unassigned
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S2-03 — [C665927](https://shopview.testrail.io/index.php?/cases/view/665927) The + menu closes with Escape or a click outside, with no change
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S2-04 — [C665928](https://shopview.testrail.io/index.php?/cases/view/665928) Changing the Parts representative never changes the Labor one
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows "Sales Representative - Labor" and "Sales Representative - Parts", both reading {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S2-05 — [C665929](https://shopview.testrail.io/index.php?/cases/view/665929) The remove x keeps the Labor person in the one field
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows "Sales Representative - Labor" reading {Sales-rep-A} and "Sales Representative - Parts" reading {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S2-06 — [C665930](https://shopview.testrail.io/index.php?/cases/view/665930) Removing Parts when Labor is Unassigned leaves nobody
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows "Sales Representative - Labor" reading "Unassigned" and "Sales Representative - Parts" reading {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S2-07 — [C665931](https://shopview.testrail.io/index.php?/cases/view/665931) An inactive person keeps their side and the other side can change
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Staff member {Sales-rep-C} held the Labor side and has since had the "Sales Representative" switch turned off. For example: {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows "Sales Representative - Labor" reading "{Sales-rep-C} (Inactive)" and "Sales Representative - Parts" reading {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S2-08 — [C665932](https://shopview.testrail.io/index.php?/cases/view/665932) An invoiced split work order shows both names as plain text
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} exists; its card shows "Sales Representative - Labor" reading {Sales-rep-A} and "Sales Representative - Parts" reading {Sales-rep-B}; it has just been invoiced. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S2-09 — [C665933](https://shopview.testrail.io/index.php?/cases/view/665933) A change sent to a work order invoiced in another tab is refused
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}; it is ready to invoice. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide. {Work-order-1} is also open in a second tab of the same browser
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S2-10 — [C665934](https://shopview.testrail.io/index.php?/cases/view/665934) Reversing the invoice unlocks the field and the next invoice re-captures
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} exists; its one "Sales Representative" field reads {Sales-rep-A}; it has been invoiced (not paid). For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S2-11 — [C665935](https://shopview.testrail.io/index.php?/cases/view/665935) A part sale's card keeps one Sales Representative field and no +
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Part sale {Part-sale-1} for {Customer-A} is open and not invoiced. For example: {Part-sale-1} is P-30001.
- Starting screen: {Part-sale-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Part-sale-1}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S2-12 — [C665936](https://shopview.testrail.io/index.php?/cases/view/665936) A work order split off another keeps its representatives
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has {Sales-rep-C} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows "Sales Representative - Labor" reading {Sales-rep-A} and "Sales Representative - Parts" reading {Sales-rep-B}; it has two approved lines. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S2-14 — [C690667](https://shopview.testrail.io/index.php?/cases/view/690667) Two windows: the later pick on the one field wins and Parts goes
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in two windows of a desktop browser at least 1024 px wide, side by side, and both windows show the one "Sales Representative" field.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S3-01 — [C665937](https://shopview.testrail.io/index.php?/cases/view/665937) On a phone the representatives show after the card is expanded
Sub folder: Story 3 — Representatives on a phone (section 84269).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open on a phone (a touch screen with no mouse pointer).
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S3-02 — [C665938](https://shopview.testrail.io/index.php?/cases/view/665938) On a phone the field, its arrow and the + work without hover
Sub folder: Story 3 — Representatives on a phone (section 84269).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open on a phone (a touch screen with no mouse pointer).
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S3-03 — [C665939](https://shopview.testrail.io/index.php?/cases/view/665939) On a phone the customer window's representative fields work as on desktop
Sub folder: Story 3 — Representatives on a phone (section 84269).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s page is open on a phone (a touch screen with no mouse pointer).
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-01 — [C665940](https://shopview.testrail.io/index.php?/cases/view/665940) Edit Customer has an optional Sales Representative field
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Staff member {Staff-member-D} is active with the "Sales Representative" switch off. For example: {Staff-member-D} is ZZAUTOTEST Dan Noswitch.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Staff-member-D}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-02 — [C665941](https://shopview.testrail.io/index.php?/cases/view/665941) New Customer has the Sales Representative field too
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Starting screen: the Customers page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-03 — [C665942](https://shopview.testrail.io/index.php?/cases/view/665942) Adding Service Parts renames the first field and copies the person
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has {Sales-rep-A} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-04 — [C665943](https://shopview.testrail.io/index.php?/cases/view/665943) Adding Part Sales starts with what new part sales would get
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" {Sales-rep-B}, with no Part Sales field. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-05 — [C665944](https://shopview.testrail.io/index.php?/cases/view/665944) Removing Service Parts makes the Service Labor person the one rep
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-06 — [C665945](https://shopview.testrail.io/index.php?/cases/view/665945) Removing Part Sales makes new part sales follow again
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-07 — [C665946](https://shopview.testrail.io/index.php?/cases/view/665946) Nothing in the customer window is saved until Save
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has {Sales-rep-A} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-08 — [C665947](https://shopview.testrail.io/index.php?/cases/view/665947) The customer page shows the reps with or without an address
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no address and no sales representative; customer {Customer-B} has no address and {Sales-rep-A} as Service Labor and {Sales-rep-B} as Service Parts. For example: {Customer-A} is ZZAUTOTEST SSR No Address and {Customer-B} is ZZAUTOTEST SSR Split No Address.
- Starting screen: the Customers page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Customer-B}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-09 — [C665948](https://shopview.testrail.io/index.php?/cases/view/665948) A new work order starts with the customer's one representative
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has {Sales-rep-A} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: the Work Orders page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-10 — [C665949](https://shopview.testrail.io/index.php?/cases/view/665949) A new work order for a split customer starts with Labor and Parts
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" {Sales-rep-B}. For example: {Customer-A} is ZZAUTOTEST SSR Split Fleet.
- Starting screen: the Work Orders page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-11 — [C665950](https://shopview.testrail.io/index.php?/cases/view/665950) A new part sale starts with Part Sales, Service Parts or the one rep
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has {Sales-rep-A} as its one sales representative; customer {Customer-B} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" {Sales-rep-B}; customer {Customer-C} shows Service Labor {Sales-rep-A}, Service Parts {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}. For example: {Customer-A} is ZZAUTOTEST SSR One, {Customer-B} is ZZAUTOTEST SSR Two and {Customer-C} is ZZAUTOTEST SSR Three.
- Starting screen: the Part Sales page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Customer-B}, {Customer-C}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-12 — [C665951](https://shopview.testrail.io/index.php?/cases/view/665951) Part Sales set to Unassigned gives new part sales Unassigned
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" reading "Unassigned". For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: the Part Sales page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-13 — [C665952](https://shopview.testrail.io/index.php?/cases/view/665952) Counter Sale starts with no representative
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: the Part Sales page is open at {Location-A} in a desktop browser at least 1024 px wide; nobody has set a representative on {Location-A}'s Counter Sale customer.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-14 — [C665953](https://shopview.testrail.io/index.php?/cases/view/665953) Changing a work order's rep or customer never touches the customers
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has {Sales-rep-A} as its one sales representative; customer {Customer-B} has {Sales-rep-B}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet and {Customer-B} is ZZAUTOTEST SSR Other.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A} (copied from {Customer-A} when it was created). For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Customer-B}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-15 — [C665954](https://shopview.testrail.io/index.php?/cases/view/665954) A rep with the switch off is not copied but still credited at invoicing
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has {Sales-rep-B} as its one sales representative, and {Sales-rep-B}'s "Sales Representative" switch has since been turned off (the account is active). For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: the Work Orders page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-16 — [C665955](https://shopview.testrail.io/index.php?/cases/view/665955) A work order invoiced with nobody takes the customer's reps per side
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" {Sales-rep-B}. For example: {Customer-A} is ZZAUTOTEST SSR Split Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one labor line (for example $100.00) and one part (for example $50.00); both sides read "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-17 — [C665956](https://shopview.testrail.io/index.php?/cases/view/665956) An empty side is not filled from the customer at invoicing
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has {Sales-rep-B} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; its card shows "Sales Representative - Labor" reading "Unassigned" and "Sales Representative - Parts" reading {Sales-rep-A}; it has one labor line and one part. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-18 — [C665957](https://shopview.testrail.io/index.php?/cases/view/665957) Deactivating a rep clears their customer fields and removes Part Sales
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}; customer {Customer-B} has {Sales-rep-C} as its one representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet and {Customer-B} is ZZAUTOTEST SSR Other.
- Starting screen: Settings > Staff is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Customer-B}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-19 — [C665958](https://shopview.testrail.io/index.php?/cases/view/665958) The Deactivate window counts a customer once when a rep holds two fields
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-B} and "Sales Representative - Service Parts" {Sales-rep-B}, and no other customer has {Sales-rep-B}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: Settings > Staff is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-20 — [C665959](https://shopview.testrail.io/index.php?/cases/view/665959) Renaming a rep updates customer fields and a switched-off rep stays
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} shows "Sales Representative - Service Labor" {Sales-rep-A} and "Sales Representative - Service Parts" {Sales-rep-B}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: Settings > Staff is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-21 — [C665960](https://shopview.testrail.io/index.php?/cases/view/665960) The assignments export lists one row per customer per person with Side
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has {Sales-rep-A} as its one representative; customer {Customer-B} shows Service Labor {Sales-rep-A} and Service Parts {Sales-rep-B}; customer {Customer-C} has {Sales-rep-C} as its one representative and "Sales Representative - Part Sales" {Sales-rep-C}. For example: {Customer-A} is ZZAUTOTEST SSR One, {Customer-B} is ZZAUTOTEST SSR Two and {Customer-C} is ZZAUTOTEST SSR Three.
- Starting screen: the page with the Sales Representative Assignments export is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Customer-B}, {Customer-C}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-22 — [C665961](https://shopview.testrail.io/index.php?/cases/view/665961) Re-importing a customer keeps all its representatives
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} shows Service Labor {Sales-rep-A}, Service Parts {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- A contacts import file contains {Customer-A} with its current details. For example: the file is ZZAUTOTEST-ssr-reimport.csv.
- Starting screen: the contacts import is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-25 — [C690668](https://shopview.testrail.io/index.php?/cases/view/690668) A part-sales-only user adding a customer from a part sale sees the reps
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as {User-B}, whose role has "Part Sales — Create & Edit" but not "Customers — Create & Edit" or "Work Orders — Create & Edit", at {Location-A}. For example: {User-B} is ZZAUTOTEST SSR Part Sales Only with the custom role ZZAUTOTEST SSR Part Sales Only; {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Staff member {Staff-member-D} is active at {Location-A} with the "Sales Representative" switch off. For example: {Staff-member-D} is ZZAUTOTEST Dan Noswitch.
- Starting screen: the Part Sales page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Staff-member-D}, {User-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-26 — [C690669](https://shopview.testrail.io/index.php?/cases/view/690669) Reactivating a rep does not put them back on their customers
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has {Sales-rep-C} as its one sales representative; customer {Customer-B} shows "Sales Representative - Service Labor" {Sales-rep-A}, "Sales Representative - Service Parts" {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet and {Customer-B} is ZZAUTOTEST SSR Other.
- Starting screen: Settings > Staff is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Customer-B}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S3-04 — [C690672](https://shopview.testrail.io/index.php?/cases/view/690672) On a wide touch tablet the card opens expanded with its buttons showing
Sub folder: Story 3 — Representatives on a phone (section 84269).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open on a touch tablet with no mouse, held so its screen is at least 1024 px wide. For example: an iPad Pro 12.9-inch in landscape.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-01 — [C665962](https://shopview.testrail.io/index.php?/cases/view/665962) A split invoice gives the Labor rep a Labor row and the Parts rep a Parts row
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one labor line of 2.00 hours at $100.00 an hour (Tech Time 2.00) and one part sold at $50.00; "Sales Representative - Labor" reads {Sales-rep-A} and "Sales Representative - Parts" reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-02 — [C665963](https://shopview.testrail.io/index.php?/cases/view/665963) All shop supplies, including a hand-typed amount, go to the Labor row
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 10% of labor, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-03 — [C665964](https://shopview.testrail.io/index.php?/cases/view/665964) A whole-invoice discount is shared by the size of each side
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one labor line of 6.00 hours at $100.00 an hour ($600.00), one part sold at $400.00, shop supplies typed by hand as $30.00 and a whole-invoice discount of $50.00 (not on any line); Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-04 — [C665965](https://shopview.testrail.io/index.php?/cases/view/665965) A negative side still shares a discount by size
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one labor line of 6.00 hours at $100.00 an hour ($600.00), one returned part credited at $100.00 (a part line of -$100.00) and a whole-invoice discount of $70.00; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-05 — [C665966](https://shopview.testrail.io/index.php?/cases/view/665966) The Parts share is rounded to the cent and the Labor row gets the rest
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} has one labor line of 1.00 hour at $100.00 ($100.00), one part sold at $200.00 and a whole-invoice discount of $1.00; work order {Work-order-2} for {Customer-A} has one labor line of 1.00 hour at $100.00, one part sold at $100.00 and a whole-invoice discount of $0.01. On both, Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002.
- Starting screen: the Work Orders page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-06 — [C665967](https://shopview.testrail.io/index.php?/cases/view/665967) A whole-invoice fee with no labor or parts dollars goes to one side
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Three work orders for {Customer-A} each have only a whole-invoice fee of $25.00 and no labor or parts dollars: {Work-order-1} with Labor {Sales-rep-A} and Parts {Sales-rep-B}; {Work-order-2} with Labor "Unassigned" and Parts {Sales-rep-B}; {Work-order-3} with both sides "Unassigned" and a customer with no representative. For example: {Work-order-1} is S2-40001, {Work-order-2} is S2-40002 and {Work-order-3} is S2-40003.
- Starting screen: the Work Orders page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}, {Work-order-2}, {Work-order-3}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-07 — [C665968](https://shopview.testrail.io/index.php?/cases/view/665968) A part sale is one Part Sales row holding the whole sale
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Three part sales for {Customer-A} have Sales Representative {Sales-rep-A}: {Part-sale-1} has one part at $80.00 and shop supplies of $5.00; {Part-sale-2} has one part at $40.00 and no shop supplies charge; {Part-sale-3} has one part at $30.00 and a shop supplies charge of $0.00. For example: {Part-sale-1} is P-30001, {Part-sale-2} is P-30002 and {Part-sale-3} is P-30003.
- Starting screen: the Part Sales page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Part-sale-1}, {Part-sale-2}, {Part-sale-3}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-08 — [C665969](https://shopview.testrail.io/index.php?/cases/view/665969) One person on both sides shows one Labor, Parts row
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} has one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00; work order {Work-order-2} for {Customer-A} has one part sold at $50.00 and no labor. On both, "Sales Representative - Labor" and "Sales Representative - Parts" read {Sales-rep-A}. For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002.
- Starting screen: the Work Orders page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-09 — [C665970](https://shopview.testrail.io/index.php?/cases/view/665970) Report totals are the same split or not when Show Unassigned is on
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00; its one "Sales Representative" reads {Sales-rep-A}; it is ready to invoice. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-10 — [C665971](https://shopview.testrail.io/index.php?/cases/view/665971) Margin % on an invoice row uses only that row's side
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one labor line of 2.00 hours at $100.00 an hour and one part with cost $30.00 sold at $50.00; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-11 — [C665972](https://shopview.testrail.io/index.php?/cases/view/665972) The Sales Type column is off by default, first in the list and remembered
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- You have never changed the columns of Sales By Representative since the release.
- Starting screen: Reports > Sales By Representative is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-12 — [C665973](https://shopview.testrail.io/index.php?/cases/view/665973) Expanded CSV and PDF always carry the Sales Type column
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} exists; it was invoiced today with a labor line and a part; Labor {Sales-rep-A}, Parts {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open in a desktop browser at least 1024 px wide. The Sales Type column is off on screen
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-13 — [C665974](https://shopview.testrail.io/index.php?/cases/view/665974) A zero-dollar side or invoice still counts for its representative
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} has one labor line of 1.00 hour at $100.00 and no parts, with Labor {Sales-rep-A} and Parts {Sales-rep-B}; work order {Work-order-2} totals $0.00 (one labor line at $0.00) with its one Sales Representative {Sales-rep-A}. For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002.
- Starting screen: the Work Orders page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-14 — [C665975](https://shopview.testrail.io/index.php?/cases/view/665975) A renamed rep stays one row under the current name in the report
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} exists; it has a labor line and a part; Labor {Sales-rep-A}, Parts {Sales-rep-B}; it was invoiced today. For example: {Work-order-1} is S2-40001.
- Starting screen: Settings > Staff is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S6-01 — [C665976](https://shopview.testrail.io/index.php?/cases/view/665976) Printed work order names the one person who holds both sides
Sub folder: Story 6 — Printed work order (section 84273).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S6-02 — [C665977](https://shopview.testrail.io/index.php?/cases/view/665977) Printed work order names both people, Parts first
Sub folder: Story 6 — Printed work order (section 84273).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S6-03 — [C665978](https://shopview.testrail.io/index.php?/cases/view/665978) Printed work order shows Unassigned for an empty side
Sub folder: Story 6 — Printed work order (section 84273).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} has Labor "Unassigned" and Parts {Sales-rep-B}; work order {Work-order-2} has Labor {Sales-rep-A} and Parts "Unassigned". For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S6-04 — [C665979](https://shopview.testrail.io/index.php?/cases/view/665979) Printed work order leaves the row off when nobody is on it
Sub folder: Story 6 — Printed work order (section 84273).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S6-05 — [C665980](https://shopview.testrail.io/index.php?/cases/view/665980) A side whose staff member no longer exists prints as Unassigned
Sub folder: Story 6 — Printed work order (section 84273).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and Labor reads {Sales-rep-A} and Parts held {Sales-rep-B}, whose staff record no longer exists. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S7-01 — [C665981](https://shopview.testrail.io/index.php?/cases/view/665981) Each representative change writes one log entry with before and after
Sub folder: Story 7 — Work order log (section 84274).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S7-02 — [C665982](https://shopview.testrail.io/index.php?/cases/view/665982) A split work order's log entry shows Unassigned for an empty side
Sub folder: Story 7 — Work order log (section 84274).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S7-03 — [C665983](https://shopview.testrail.io/index.php?/cases/view/665983) Picking the person already in the field writes no log entry
Sub folder: Story 7 — Work order log (section 84274).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S7-05 — [C690670](https://shopview.testrail.io/index.php?/cases/view/690670) A log entry reads Unassigned for a rep who no longer exists
Sub folder: Story 7 — Work order log (section 84274).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; "Sales Representative - Labor" reads {Sales-rep-A} and "Sales Representative - Parts" holds {Staff-member-C}, whose staff record no longer exists. For example: {Work-order-1} is S2-40001 and {Staff-member-C} is ZZAUTOTEST Gone Rep.
- Work order {Work-order-2} for {Customer-A} is open and not invoiced; its one "Sales Representative" field holds {Staff-member-D}, a staff member of another organization. For example: {Work-order-2} is S2-40002 and {Staff-member-D} is ZZAUTOTEST Other Org Rep.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Staff-member-C}, {Staff-member-D}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S8-01 — [C665984](https://shopview.testrail.io/index.php?/cases/view/665984) Sales By Representative has a Sales Type filter, all selected
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: Reports > Sales By Representative is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S8-02 — [C665985](https://shopview.testrail.io/index.php?/cases/view/665985) Sales By Representative exports name the Sales Type selection
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: Reports > Sales By Representative is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S8-03 — [C665986](https://shopview.testrail.io/index.php?/cases/view/665986) Sales By Customer's Product Type filter now reads Sales Type
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: Reports > Sales By Customer is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S8-04 — [C665987](https://shopview.testrail.io/index.php?/cases/view/665987) Sales By Customer exports name the Sales Type selection
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: Reports > Sales By Customer is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S8-05 — [C665988](https://shopview.testrail.io/index.php?/cases/view/665988) Sales By Customer figures do not change with the new wording
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Today customer {Customer-A} has one invoiced part sale of $40.00 and one invoiced work order of $250.00 that includes a part. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: Reports > Sales By Customer is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S8-12 — [C690671](https://shopview.testrail.io/index.php?/cases/view/690671) Exports with no rows still download a file with only the headings
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- {Location-A} has no invoices on {Date-A}. For example: {Date-A} is 1 Jan 2026.
- Starting screen: Reports > Sales By Representative is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Date-A}, {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-23 — [C665989](https://shopview.testrail.io/index.php?/cases/view/665989) Saving a customer with a rep turned off in another tab is refused
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s page is open in a desktop browser at least 1024 px wide, and Settings > Staff is open in a second tab.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S4-24 — [C665990](https://shopview.testrail.io/index.php?/cases/view/665990) A work-orders-only user adding a customer from a work order sees the reps
Sub folder: Story 4 — A customer's default representatives (section 84270).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as {User-B}, whose role has "Work Orders — Create & Edit" but not "Customers — Create & Edit", at {Location-A}. For example: {User-B} is ZZAUTOTEST SSR WO Only with the custom role ZZAUTOTEST SSR WO Only; {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Starting screen: the Work Orders page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {User-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-15 — [C665991](https://shopview.testrail.io/index.php?/cases/view/665991) The Summary export has no Sales Type column and rep rows leave it blank
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} exists; it was invoiced today with a labor line and a part; Labor {Sales-rep-A}, Parts {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-16 — [C665992](https://shopview.testrail.io/index.php?/cases/view/665992) Line fees stay with their side and a processing fee is shared by size
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one labor line of 3.00 hours at $100.00 ($300.00) with a labor-line discount of $30.00, one part sold at $100.00 with a part-line fee of $10.00, and a whole-invoice fee of $38.00; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-17 — [C665993](https://shopview.testrail.io/index.php?/cases/view/665993) Every report row adds up to the report totals to the cent
Sub folder: Credit and totals — exact amounts (section 84272).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Today {Location-A} has at least three invoices: one split work order, one work order with one person on both sides and one part sale.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with Show Unassigned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S7-04 — [C665994](https://shopview.testrail.io/index.php?/cases/view/665994) The Audit Log finds an entry by the Parts person's name
Sub folder: Story 7 — Work order log (section 84274).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}, and the Parts side was changed to {Sales-rep-B} today. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S2-13 — [C665995](https://shopview.testrail.io/index.php?/cases/view/665995) Moving lines into an existing work order does not change its reps
Sub folder: Story 2 — Separate Labor and Parts representatives (section 84268).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} has two approved lines and Labor {Sales-rep-A}, Parts {Sales-rep-B}; work order {Work-order-2} for {Customer-A} has one Sales Representative {Sales-rep-C}. For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S5-18 — [C715271](https://shopview.testrail.io/index.php?/cases/view/715271) A part sale's labor cells show a dash in the PDF and are blank in the CSV
Sub folder: Story 5 — Credit on the invoice and in Sales By Representative (section 84271).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Part sale {Part-sale-1} for {Customer-A} has Sales Representative {Sales-rep-A} and one part at $80.00, and was invoiced today. For example: {Part-sale-1} is P-30001.
- Starting screen: Reports > Sales By Representative is open in a desktop browser at least 1024 px wide, set to today.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Part-sale-1}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S8-06 — [C665996](https://shopview.testrail.io/index.php?/cases/view/665996) A rep with no invoice of the chosen Sales Type leaves the report
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today {Sales-rep-A} holds only the Labor side of one invoiced split work order, and {Sales-rep-B} holds its Parts side; neither has other invoices today.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with Show Unassigned on. The Sales Type column is on
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S8-07 — [C665997](https://shopview.testrail.io/index.php?/cases/view/665997) Going back from an invoice keeps the Sales Type selection
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today has at least one invoiced split work order with Labor {Sales-rep-A} and Parts {Sales-rep-B}.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide, with Show Unassigned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S8-08 — [C665998](https://shopview.testrail.io/index.php?/cases/view/665998) Sales By Customer's Sales Type menu has Select all and Clear selection
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: Reports > Sales By Customer is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S8-09 — [C665999](https://shopview.testrail.io/index.php?/cases/view/665999) Changing Sales Type on Sales By Customer collapses rows and survives Back
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today {Customer-A} has an invoiced part sale and an invoiced work order.
- Starting screen: Reports > Sales By Customer is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S8-10 — [C666000](https://shopview.testrail.io/index.php?/cases/view/666000) The Customer filter sits after Sales Type and searches within it
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Today customer {Customer-A} has only an invoiced part sale and customer {Customer-B} only an invoiced work order; both names start with the same text, {Search-A}. For example: {Customer-A} is ZZAUTOTEST SSR Parts Only, {Customer-B} is ZZAUTOTEST SSR Service Only and {Search-A} is ZZAUTOTEST SSR.
- Starting screen: Reports > Sales By Customer is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Customer-B}, {Location-A}, {Search-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-S8-11 — [C666001](https://shopview.testrail.io/index.php?/cases/view/666001) Both reports' Sales Type filters work on a touch screen
Sub folder: Story 8 — Sales Type filters on both sales reports (section 84275).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: Reports > Sales By Representative is open on a phone or tablet (a touch screen with no mouse pointer).
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-REL-15 — [C666002](https://shopview.testrail.io/index.php?/cases/view/666002) Reversed invoices stay out of Sales By Customer with both types selected
Sub folder: Release day and what must not change (section 84276).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today {Customer-A} has one invoiced work order and one invoice that was reversed.
- Starting screen: Reports > Sales By Customer is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-REL-16 — [C715272](https://shopview.testrail.io/index.php?/cases/view/715272) Part sale rows show a dash in the labor columns and the totals do not change
Sub folder: Release day and what must not change (section 84276).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Part sale {Part-sale-1} (one part at $80.00) and work order {Work-order-1} (one labor line of 2.00 hours at $100.00 an hour) for {Customer-A} both have Sales Representative {Sales-rep-A}. For example: {Part-sale-1} is P-30001 and {Work-order-1} is S2-40001.
- Starting screen: the Part Sales page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Part-sale-1}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-REL-01 — [C666003](https://shopview.testrail.io/index.php?/cases/view/666003) On release day an existing customer keeps its one representative
Sub folder: Release day and what must not change (section 84276).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Before the release was installed, customer {Customer-A} had {Sales-rep-A} as its sales representative, customer {Customer-B} had none, and customer {Customer-C} had a representative who was no longer a user of the shop; you noted how the three customer pages looked. For example: {Customer-A} is ZZAUTOTEST SSR Before, {Customer-B} is ZZAUTOTEST SSR Before None and {Customer-C} is ZZAUTOTEST SSR Before Gone User.
- Starting screen: the release is installed and {Customer-A}'s page is open in a desktop browser at least 1024 px wide.
- The browser window is a desktop browser at least 1024 px wide, and the design pictures "customer-00-b-customer-page.png" (board 2.0), "customer-01-b-customer-dialog-open.png" (board 2.1) and "customer-02-b-new.png" (board 2.2) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Customer-B}, {Customer-C}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-REL-02 — [C666004](https://shopview.testrail.io/index.php?/cases/view/666004) On release day an open work order keeps its one representative
Sub folder: Release day and what must not change (section 84276).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Before the release was installed, work order {Work-order-1} for {Customer-A} was open (not invoiced) with {Sales-rep-A} as its sales representative. For example: {Work-order-1} is S2-39001.
- Starting screen: the release is installed and {Work-order-1} is open in a desktop browser at least 1024 px wide.
- The browser window is a desktop browser at least 1024 px wide, and the design pictures "card-00-b-wo-rest2.png" (board 1.0) and "card-01-b-wo-open.png" (board 1.1) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-REL-03 — [C666005](https://shopview.testrail.io/index.php?/cases/view/666005) Sales By Representative for a past date shows the same totals
Sub folder: Release day and what must not change (section 84276).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Before the release was installed, you exported Sales By Representative (Expanded CSV) for a past date range with invoices, with Show Unassigned on. For example: the range is 1 Aug 2026 to 31 Aug 2026.
- Starting screen: the release is installed and Reports > Sales By Representative is open in a desktop browser at least 1024 px wide.
- The browser window is a desktop browser at least 1024 px wide, and the design pictures "sbr-00-b-sbr.png" (board 4.0), "sbr-01-b-sbr-filter.png" (board 4.1), "sbr-02-b-sbr-columns.png" (board 4.2) and "sbr-03-b-sbr-expanded.png" (board 4.3) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-REL-04 — [C666006](https://shopview.testrail.io/index.php?/cases/view/666006) Invoices from before 29 Jul 2026 stay Unassigned on both sides
Sub folder: Release day and what must not change (section 84276).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- {Location-A} has invoices dated before 29 Jul 2026. For example: invoices from June 2026.
- Starting screen: Reports > Sales By Representative is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-REL-05 — [C666007](https://shopview.testrail.io/index.php?/cases/view/666007) Saved report columns reset once and an old Product Type link shows all types
Sub folder: Release day and what must not change (section 84276).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Before the release was installed, you changed the columns and the sort of Sales By Representative and bookmarked a link that narrowed it by Product Type.
- Starting screen: the release is installed and you open Reports > Sales By Representative in the same browser, desktop width at least 1024 px.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-REL-06 — [C666008](https://shopview.testrail.io/index.php?/cases/view/666008) A Sales By Customer filter from before the release keeps its options
Sub folder: Release day and what must not change (section 84276).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Before the release was installed, you bookmarked Sales By Customer with only one Product Type option selected. For example: only the parts option selected.
- Starting screen: the release is installed and the bookmark is ready in a desktop browser at least 1024 px wide.
- The browser window is a desktop browser at least 1024 px wide, and the design picture "sbc-00-b-sbc-filter.png" (board 5.0) attached to this case is open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-REL-07 — [C666009](https://shopview.testrail.io/index.php?/cases/view/666009) Imported work orders still have no sales representative
Sub folder: Release day and what must not change (section 84276).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- {Location-A} has an imported work order, {Work-order-1}. For example: {Work-order-1} is an imported work order from the previous system.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-REL-08 — [C666010](https://shopview.testrail.io/index.php?/cases/view/666010) Customer invoice and estimate documents still show no representative
Sub folder: Release day and what must not change (section 84276).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-REL-09 — [C666011](https://shopview.testrail.io/index.php?/cases/view/666011) Credit memos stay out of Sales By Representative
Sub folder: Release day and what must not change (section 84276).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today {Customer-A} has an invoiced split work order (Labor {Sales-rep-A}, Parts {Sales-rep-B}) and a credit memo of $20.00.
- Starting screen: Reports > Sales By Representative is open for today in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-REL-10 — [C666012](https://shopview.testrail.io/index.php?/cases/view/666012) The Sales Follow-Up report is still not in the Reports menu
Sub folder: Release day and what must not change (section 84276).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: any page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-REL-11 — [C666013](https://shopview.testrail.io/index.php?/cases/view/666013) No sales representative is sent to QuickBooks
Sub folder: Release day and what must not change (section 84276).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A} is connected to a QuickBooks test company.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-REL-12 — [C666014](https://shopview.testrail.io/index.php?/cases/view/666014) On a phone Lead Technician and Service Advisor keep today's arrow behaviour
Sub folder: Release day and what must not change (section 84276).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows one "Sales Representative" field reading "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open on a phone (a touch screen with no mouse pointer).
- The browser window is a phone screen, and the design pictures "phone-00-b-phone-details.png" (board 6.0) and "phone-01-b-phone-open.png" (board 6.1) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-REL-13 — [C666015](https://shopview.testrail.io/index.php?/cases/view/666015) A user without Reports access still cannot open Sales By Representative
Sub folder: Release day and what must not change (section 84276).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as {User-B}, whose role does not have "Reports — Page Access", at {Location-A}. For example: {User-B} is ZZAUTOTEST SSR No Reports; {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: any page is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}, {User-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-REL-14 — [C666016](https://shopview.testrail.io/index.php?/cases/view/666016) A work order that is never split is credited exactly as before
Sub folder: Release day and what must not change (section 84276).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- {Location-A}'s Shop Supplies Charge is 0%, and nothing else is invoiced at {Location-A} today.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one labor line of 2.00 hours at $100.00 an hour and one part with cost $30.00 sold at $50.00; its one Sales Representative reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in a desktop browser at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-01 — [C666017](https://shopview.testrail.io/index.php?/cases/view/666017) Work order card at rest matches the design
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-02-n1-rest.png" (board 1.2) and "card-05-n1-picked.png" (board 1.5) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced with nobody in Sales Representative; work order {Work-order-2} has Sales Representative {Sales-rep-A}. For example: {Work-order-1} is S2-40001 and {Work-order-2} is S2-40002.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-02 — [C666018](https://shopview.testrail.io/index.php?/cases/view/666018) Hovering the Sales Representative row shows the box, arrow and +
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-03-n1-hover.png" (board 1.3) and "card-06-n1-picked-hover.png" (board 1.6) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-03 — [C666019](https://shopview.testrail.io/index.php?/cases/view/666019) The Sales Representative list looks as designed
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-04-n1-list.png" (board 1.4) and "card-15-n1-unassign-list.png" (board 1.15) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-04 — [C666020](https://shopview.testrail.io/index.php?/cases/view/666020) The + tooltip and menu look as designed
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-07-n1-add-tip.png" (board 1.7) and "card-08-n1-add-menu.png" (board 1.8) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-05 — [C666021](https://shopview.testrail.io/index.php?/cases/view/666021) Labor and Parts fields at rest and on hover look as designed
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-09-n1-added.png" (board 1.9), "card-10-n1-added-hover.png" (board 1.10) and "card-11-n1-labor-list.png" (board 1.11) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its card shows "Sales Representative - Labor" and "Sales Representative - Parts", both reading {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-06 — [C666022](https://shopview.testrail.io/index.php?/cases/view/666022) Two reps, the remove x and removing Parts look as designed
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-12-n1-two.png" (board 1.12), "card-13-n1-remove-tip.png" (board 1.13) and "card-14-n1-removed.png" (board 1.14) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and Labor reads {Sales-rep-B} and Parts reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-07 — [C666023](https://shopview.testrail.io/index.php?/cases/view/666023) Clearing the field with Unassigned looks as designed
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-15-n1-unassign-list.png" (board 1.15) and "card-16-n1-cleared.png" (board 1.16) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-08 — [C666024](https://shopview.testrail.io/index.php?/cases/view/666024) The invoiced work order card shows the reps as plain text
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design picture "card-17-n1-invoiced.png" (board 1.17) attached to this case is open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} exists; Labor reads {Sales-rep-A} and Parts reads {Sales-rep-B}; it has been invoiced. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-09 — [C666025](https://shopview.testrail.io/index.php?/cases/view/666025) Work order log entries read as designed
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-18-b-audit.png" (board 1.18) and "card-19-n1-audit.png" (board 1.19) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads {Sales-rep-A}. For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-10 — [C666026](https://shopview.testrail.io/index.php?/cases/view/666026) Edit Customer: one field, its list and the + look as designed
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "customer-03-n2-edit.png" (board 2.3), "customer-04-n2-edit-list.png" (board 2.4), "customer-05-n2-edit-picked.png" (board 2.5), "customer-06-n2-add-tip.png" (board 2.6) and "customer-07-n2-add-menu.png" (board 2.7) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s page is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-11 — [C666027](https://shopview.testrail.io/index.php?/cases/view/666027) Edit Customer with Service Parts and Part Sales looks as designed
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "customer-08-n2-service-parts.png" (board 2.8), "customer-09-n2-add-menu-2.png" (board 2.9), "customer-10-n2-three-added.png" (board 2.10), "customer-11-n2-ps-list.png" (board 2.11), "customer-12-n2-three.png" (board 2.12), "customer-13-n2-remove-tip.png" (board 2.13) and "customer-14-n2-ps-only.png" (board 2.14) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} has {Sales-rep-A} as its one sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s page is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-12 — [C666028](https://shopview.testrail.io/index.php?/cases/view/666028) The customer page reads every representative row as designed
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design picture "customer-15-n2-page-three.png" (board 2.15) attached to this case is open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Customer {Customer-A} shows Service Labor {Sales-rep-A}, Service Parts {Sales-rep-B} and "Sales Representative - Part Sales" {Sales-rep-C}. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Starting screen: {Customer-A}'s page is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-13 — [C666029](https://shopview.testrail.io/index.php?/cases/view/666029) New Customer's representative field looks as designed
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "customer-16-n2-new.png" (board 2.16), "customer-17-n2-new-menu.png" (board 2.17) and "customer-18-n2-new-ps.png" (board 2.18) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Three active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A}, {Sales-rep-B} and {Sales-rep-C}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able, {Sales-rep-B} is ZZAUTOTEST Ben Able and {Sales-rep-C} is ZZAUTOTEST Cara Able.
- Starting screen: the Customers page is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Sales-rep-C}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-14 — [C666030](https://shopview.testrail.io/index.php?/cases/view/666030) A part sale's representative field is unchanged from Part Sales Update v1
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "partsale-00-b-ps.png" (board 3.0), "partsale-01-n3-rest.png" (board 3.1), "partsale-02-n3-hover.png" (board 3.2), "partsale-03-n3-list.png" (board 3.3) and "partsale-04-n3-picked-hover.png" (board 3.4) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Part sale {Part-sale-1} for {Customer-A} is open and not invoiced. For example: {Part-sale-1} is P-30001.
- Starting screen: {Part-sale-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Part-sale-1}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-15 — [C666031](https://shopview.testrail.io/index.php?/cases/view/666031) Sales By Representative screen, filter and column look as designed
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "sbr-04-a4-sbr-c.png" (board 4.4), "sbr-05-a4-sbr-expanded.png" (board 4.5), "sbr-06-a4-filter-open.png" (board 4.6), "sbr-07-a4-sbr-labor-only.png" (board 4.7), "sbr-08-a4-columns-off.png" (board 4.8), "sbr-09-a4-columns-on.png" (board 4.9) and "sbr-10-a4-sbr-expanded-type.png" (board 4.10) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today has one invoiced split work order (Labor {Sales-rep-A}, Parts {Sales-rep-B}), one invoiced work order with {Sales-rep-A} on both sides and one invoiced part sale with no shop supplies.
- Starting screen: Reports > Sales By Representative is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-16 — [C666032](https://shopview.testrail.io/index.php?/cases/view/666032) Sales By Representative Expanded CSV and PDF look as designed
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "sbr-11-a4-export-csv.png" (board 4.11) and "sbr-12-a4-export-pdf-crop-1.png" (board 4.12) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Today has one invoiced split work order (Labor {Sales-rep-A}, Parts {Sales-rep-B}) and one invoiced part sale.
- Starting screen: Reports > Sales By Representative is open in that browser window, with the Sales Type column off.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-17 — [C666033](https://shopview.testrail.io/index.php?/cases/view/666033) Sales By Customer Sales Type filter looks as designed
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "sbc-01-n5-sbc.png" (board 5.1) and "sbc-02-n5-sbc-open.png" (board 5.2) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Starting screen: Reports > Sales By Customer is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-D-18 — [C666034](https://shopview.testrail.io/index.php?/cases/view/666034) On a phone the representative fields look as designed
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is a phone screen 390 px wide, and the design pictures "phone-02-n6-field.png" (board 6.2), "phone-03-n6-list.png" (board 6.3), "phone-04-n6-picked.png" (board 6.4), "phone-05-n6-add-menu.png" (board 6.5), "phone-06-n6-added.png" (board 6.6) and "phone-07-n6-parts-list.png" (board 6.7) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} is open and not invoiced; it has one approved labor line and one part, and its one "Sales Representative" field reads "Unassigned". For example: {Work-order-1} is S2-40001.
- Starting screen: {Work-order-1} is open on a phone (a touch screen with no mouse pointer), card expanded.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-DR-01 — [C690658](https://shopview.testrail.io/index.php?/cases/view/690658) Design: invoiced card keeps "Lead technician" and "Service advisor" labels
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "card-17-n1-invoiced.png" (board 1.17) and "card-02-n1-rest.png" (board 1.2) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Work order {Work-order-1} has been invoiced; its card shows "Sales Representative - Labor" reading {Sales-rep-A} and "Sales Representative - Parts" reading {Sales-rep-B}. For example: {Work-order-1} is S2-40001.
- Work order {Work-order-2} is open and not invoiced. For example: {Work-order-2} is S2-40002.
- Starting screen: {Work-order-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}, {Work-order-2}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-DR-02 — [C690659](https://shopview.testrail.io/index.php?/cases/view/690659) Design: a part sale's field label still reads "Sales representative"
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "partsale-01-n3-rest.png" (board 3.1), "partsale-02-n3-hover.png" (board 3.2) and "partsale-04-n3-picked-hover.png" (board 3.4) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Part sale {Part-sale-1} for {Customer-A} is open and not invoiced. For example: {Part-sale-1} is P-30001.
- Starting screen: {Part-sale-1} is open in that browser window.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Part-sale-1}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-DR-03 — [C690660](https://shopview.testrail.io/index.php?/cases/view/690660) Design: a part sale row shows a dash in the labor columns
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "sbr-03-b-sbr-expanded.png" (board 4.3), "sbr-10-a4-sbr-expanded-type.png" (board 4.10), "sbr-11-a4-export-csv.png" (board 4.11) and "sbr-12-a4-export-pdf-crop-1.png" (board 4.12) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Part sale {Part-sale-1} for {Customer-A} has Sales Representative {Sales-rep-A}, one part and no labor, and was invoiced today. For example: {Part-sale-1} is P-30001 with one part sold at $50.00.
- Starting screen: Reports > Sales By Representative is open in that browser window, with the date range set to today and Show Unassigned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Part-sale-1}, {Sales-rep-A}, {Sales-rep-B}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-DR-04 — [C690661](https://shopview.testrail.io/index.php?/cases/view/690661) Design: invoice dates in the Expanded exports match the screen
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "sbr-10-a4-sbr-expanded-type.png" (board 4.10), "sbr-11-a4-export-csv.png" (board 4.11) and "sbr-12-a4-export-pdf-crop-1.png" (board 4.12) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} has "Sales Representative - Labor" {Sales-rep-A} and "Sales Representative - Parts" {Sales-rep-B} and was invoiced today; it has one labor line and one part. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open in that browser window, with the date range set to today and Show Unassigned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-DR-06 — [C690663](https://shopview.testrail.io/index.php?/cases/view/690663) Design: Sales Type sits between Status and Location
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "sbr-09-a4-columns-on.png" (board 4.9), "sbr-11-a4-export-csv.png" (board 4.11) and "sbr-12-a4-export-pdf-crop-1.png" (board 4.12) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- A second location, {Location-B}, is open to you, and the report shows its Location column. For example: {Location-B} is QA Testing, and both locations are selected in the Location filter.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Work order {Work-order-1} at {Location-A} has "Sales Representative - Labor" {Sales-rep-A} and "Sales Representative - Parts" {Sales-rep-B} and was invoiced today. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open in that browser window, with the date range set to today and Show Unassigned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Location-A}, {Location-B}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

#### SETUP-DR-07 — [C690664](https://shopview.testrail.io/index.php?/cases/view/690664) Design: each split row shows its share under Adjustments
Sub folder: Design — how it looks (section 84277).
Satisfies these precondition lines, exactly as the case states them:
- You are signed in as a user with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "sbr-07-a4-sbr-labor-only.png" (board 4.7), "sbr-11-a4-export-csv.png" (board 4.11) and "sbr-12-a4-export-pdf-crop-1.png" (board 4.12) attached to this case are open beside it at 100% (actual size). Names, numbers and dates in the pictures are sample data.
- Two active staff members at {Location-A} have their "Sales Representative" switch on: {Sales-rep-A} and {Sales-rep-B}. For example: {Sales-rep-A} is ZZAUTOTEST Ann Able and {Sales-rep-B} is ZZAUTOTEST Ben Able.
- Customer {Customer-A} has no sales representative. For example: {Customer-A} is ZZAUTOTEST SSR Fleet.
- Work order {Work-order-1} for {Customer-A} has labor $600.00, parts $400.00, shop supplies $30.00 and a whole-invoice discount of $50.00, "Sales Representative - Labor" {Sales-rep-A} and "Sales Representative - Parts" {Sales-rep-B}, and was invoiced today. For example: {Work-order-1} is S2-40001.
- Starting screen: Reports > Sales By Representative is open in that browser window, with the date range set to today and Show Unassigned on.
- If any record above is missing, mark this test Blocked: "setup not done".
Procedures: P-REP for each {Sales-rep-…}; P-NOSWITCH for {Staff-member-…}; P-CUSTOMER for each {Customer-…}; P-WO / P-PARTSALE / P-FEE for the work orders and part sales; P-INVOICE where a precondition says invoiced; P-PRE-RELEASE for release-day cases.
Placeholders used: {Customer-A}, {Location-A}, {Sales-rep-A}, {Sales-rep-B}, {Work-order-1}. Values: the "For example" lines above; record the real work order and part sale numbers here after setup.

## 5. Mapping table
| Sub folder | Cases |
|---|---|
| Story 1 — One Sales Representative field on the work order | [C665915](https://shopview.testrail.io/index.php?/cases/view/665915), [C665916](https://shopview.testrail.io/index.php?/cases/view/665916), [C665917](https://shopview.testrail.io/index.php?/cases/view/665917), [C665918](https://shopview.testrail.io/index.php?/cases/view/665918), [C665919](https://shopview.testrail.io/index.php?/cases/view/665919), [C665920](https://shopview.testrail.io/index.php?/cases/view/665920), [C665921](https://shopview.testrail.io/index.php?/cases/view/665921), [C665922](https://shopview.testrail.io/index.php?/cases/view/665922), [C665923](https://shopview.testrail.io/index.php?/cases/view/665923), [C665924](https://shopview.testrail.io/index.php?/cases/view/665924), [C690666](https://shopview.testrail.io/index.php?/cases/view/690666) |
| Story 2 — Separate Labor and Parts representatives | [C665925](https://shopview.testrail.io/index.php?/cases/view/665925), [C665926](https://shopview.testrail.io/index.php?/cases/view/665926), [C665927](https://shopview.testrail.io/index.php?/cases/view/665927), [C665928](https://shopview.testrail.io/index.php?/cases/view/665928), [C665929](https://shopview.testrail.io/index.php?/cases/view/665929), [C665930](https://shopview.testrail.io/index.php?/cases/view/665930), [C665931](https://shopview.testrail.io/index.php?/cases/view/665931), [C665932](https://shopview.testrail.io/index.php?/cases/view/665932), [C665933](https://shopview.testrail.io/index.php?/cases/view/665933), [C665934](https://shopview.testrail.io/index.php?/cases/view/665934), [C665935](https://shopview.testrail.io/index.php?/cases/view/665935), [C665936](https://shopview.testrail.io/index.php?/cases/view/665936), [C690667](https://shopview.testrail.io/index.php?/cases/view/690667), [C665995](https://shopview.testrail.io/index.php?/cases/view/665995) |
| Story 3 — Representatives on a phone | [C665937](https://shopview.testrail.io/index.php?/cases/view/665937), [C665938](https://shopview.testrail.io/index.php?/cases/view/665938), [C665939](https://shopview.testrail.io/index.php?/cases/view/665939), [C690672](https://shopview.testrail.io/index.php?/cases/view/690672) |
| Story 4 — A customer's default representatives | [C665940](https://shopview.testrail.io/index.php?/cases/view/665940), [C665941](https://shopview.testrail.io/index.php?/cases/view/665941), [C665942](https://shopview.testrail.io/index.php?/cases/view/665942), [C665943](https://shopview.testrail.io/index.php?/cases/view/665943), [C665944](https://shopview.testrail.io/index.php?/cases/view/665944), [C665945](https://shopview.testrail.io/index.php?/cases/view/665945), [C665946](https://shopview.testrail.io/index.php?/cases/view/665946), [C665947](https://shopview.testrail.io/index.php?/cases/view/665947), [C665948](https://shopview.testrail.io/index.php?/cases/view/665948), [C665949](https://shopview.testrail.io/index.php?/cases/view/665949), [C665950](https://shopview.testrail.io/index.php?/cases/view/665950), [C665951](https://shopview.testrail.io/index.php?/cases/view/665951), [C665952](https://shopview.testrail.io/index.php?/cases/view/665952), [C665953](https://shopview.testrail.io/index.php?/cases/view/665953), [C665954](https://shopview.testrail.io/index.php?/cases/view/665954), [C665955](https://shopview.testrail.io/index.php?/cases/view/665955), [C665956](https://shopview.testrail.io/index.php?/cases/view/665956), [C665957](https://shopview.testrail.io/index.php?/cases/view/665957), [C665958](https://shopview.testrail.io/index.php?/cases/view/665958), [C665959](https://shopview.testrail.io/index.php?/cases/view/665959), [C665960](https://shopview.testrail.io/index.php?/cases/view/665960), [C665961](https://shopview.testrail.io/index.php?/cases/view/665961), [C690668](https://shopview.testrail.io/index.php?/cases/view/690668), [C690669](https://shopview.testrail.io/index.php?/cases/view/690669), [C665989](https://shopview.testrail.io/index.php?/cases/view/665989), [C665990](https://shopview.testrail.io/index.php?/cases/view/665990) |
| Story 5 — Credit on the invoice and in Sales By Representative | [C665962](https://shopview.testrail.io/index.php?/cases/view/665962), [C665963](https://shopview.testrail.io/index.php?/cases/view/665963), [C665968](https://shopview.testrail.io/index.php?/cases/view/665968), [C665969](https://shopview.testrail.io/index.php?/cases/view/665969), [C665972](https://shopview.testrail.io/index.php?/cases/view/665972), [C665973](https://shopview.testrail.io/index.php?/cases/view/665973), [C665975](https://shopview.testrail.io/index.php?/cases/view/665975), [C665991](https://shopview.testrail.io/index.php?/cases/view/665991), [C715271](https://shopview.testrail.io/index.php?/cases/view/715271) |
| Credit and totals — exact amounts | [C665964](https://shopview.testrail.io/index.php?/cases/view/665964), [C665965](https://shopview.testrail.io/index.php?/cases/view/665965), [C665966](https://shopview.testrail.io/index.php?/cases/view/665966), [C665967](https://shopview.testrail.io/index.php?/cases/view/665967), [C665970](https://shopview.testrail.io/index.php?/cases/view/665970), [C665971](https://shopview.testrail.io/index.php?/cases/view/665971), [C665974](https://shopview.testrail.io/index.php?/cases/view/665974), [C665992](https://shopview.testrail.io/index.php?/cases/view/665992), [C665993](https://shopview.testrail.io/index.php?/cases/view/665993) |
| Story 6 — Printed work order | [C665976](https://shopview.testrail.io/index.php?/cases/view/665976), [C665977](https://shopview.testrail.io/index.php?/cases/view/665977), [C665978](https://shopview.testrail.io/index.php?/cases/view/665978), [C665979](https://shopview.testrail.io/index.php?/cases/view/665979), [C665980](https://shopview.testrail.io/index.php?/cases/view/665980) |
| Story 7 — Work order log | [C665981](https://shopview.testrail.io/index.php?/cases/view/665981), [C665982](https://shopview.testrail.io/index.php?/cases/view/665982), [C665983](https://shopview.testrail.io/index.php?/cases/view/665983), [C690670](https://shopview.testrail.io/index.php?/cases/view/690670), [C665994](https://shopview.testrail.io/index.php?/cases/view/665994) |
| Story 8 — Sales Type filters on both sales reports | [C665984](https://shopview.testrail.io/index.php?/cases/view/665984), [C665985](https://shopview.testrail.io/index.php?/cases/view/665985), [C665986](https://shopview.testrail.io/index.php?/cases/view/665986), [C665987](https://shopview.testrail.io/index.php?/cases/view/665987), [C665988](https://shopview.testrail.io/index.php?/cases/view/665988), [C690671](https://shopview.testrail.io/index.php?/cases/view/690671), [C665996](https://shopview.testrail.io/index.php?/cases/view/665996), [C665997](https://shopview.testrail.io/index.php?/cases/view/665997), [C665998](https://shopview.testrail.io/index.php?/cases/view/665998), [C665999](https://shopview.testrail.io/index.php?/cases/view/665999), [C666000](https://shopview.testrail.io/index.php?/cases/view/666000), [C666001](https://shopview.testrail.io/index.php?/cases/view/666001) |
| Release day and what must not change | [C666002](https://shopview.testrail.io/index.php?/cases/view/666002), [C715272](https://shopview.testrail.io/index.php?/cases/view/715272), [C666003](https://shopview.testrail.io/index.php?/cases/view/666003), [C666004](https://shopview.testrail.io/index.php?/cases/view/666004), [C666005](https://shopview.testrail.io/index.php?/cases/view/666005), [C666006](https://shopview.testrail.io/index.php?/cases/view/666006), [C666007](https://shopview.testrail.io/index.php?/cases/view/666007), [C666008](https://shopview.testrail.io/index.php?/cases/view/666008), [C666009](https://shopview.testrail.io/index.php?/cases/view/666009), [C666010](https://shopview.testrail.io/index.php?/cases/view/666010), [C666011](https://shopview.testrail.io/index.php?/cases/view/666011), [C666012](https://shopview.testrail.io/index.php?/cases/view/666012), [C666013](https://shopview.testrail.io/index.php?/cases/view/666013), [C666014](https://shopview.testrail.io/index.php?/cases/view/666014), [C666015](https://shopview.testrail.io/index.php?/cases/view/666015), [C666016](https://shopview.testrail.io/index.php?/cases/view/666016) |
| Design — how it looks | [C666017](https://shopview.testrail.io/index.php?/cases/view/666017), [C666018](https://shopview.testrail.io/index.php?/cases/view/666018), [C666019](https://shopview.testrail.io/index.php?/cases/view/666019), [C666020](https://shopview.testrail.io/index.php?/cases/view/666020), [C666021](https://shopview.testrail.io/index.php?/cases/view/666021), [C666022](https://shopview.testrail.io/index.php?/cases/view/666022), [C666023](https://shopview.testrail.io/index.php?/cases/view/666023), [C666024](https://shopview.testrail.io/index.php?/cases/view/666024), [C666025](https://shopview.testrail.io/index.php?/cases/view/666025), [C666026](https://shopview.testrail.io/index.php?/cases/view/666026), [C666027](https://shopview.testrail.io/index.php?/cases/view/666027), [C666028](https://shopview.testrail.io/index.php?/cases/view/666028), [C666029](https://shopview.testrail.io/index.php?/cases/view/666029), [C666030](https://shopview.testrail.io/index.php?/cases/view/666030), [C666031](https://shopview.testrail.io/index.php?/cases/view/666031), [C666032](https://shopview.testrail.io/index.php?/cases/view/666032), [C666033](https://shopview.testrail.io/index.php?/cases/view/666033), [C666034](https://shopview.testrail.io/index.php?/cases/view/666034), [C690658](https://shopview.testrail.io/index.php?/cases/view/690658), [C690659](https://shopview.testrail.io/index.php?/cases/view/690659), [C690660](https://shopview.testrail.io/index.php?/cases/view/690660), [C690661](https://shopview.testrail.io/index.php?/cases/view/690661), [C690663](https://shopview.testrail.io/index.php?/cases/view/690663), [C690664](https://shopview.testrail.io/index.php?/cases/view/690664) |

## 6. Dependencies and shared fixtures
- Every case owns its records; the example names carry ZZAUTOTEST. Money cases need a location where nothing else is invoiced that day (or a fresh ZZAUTOTEST location).

## 7. Reset and cleanup
- Leave ZZAUTOTEST records in place. Turn back on any "Sales Representative" switch a case turned off, and reactivate any staff member a case deactivated, before reusing them.

## 8. Traceability
Every case's expected results quote their source sentences word for word (PRD v10, Chris Ward's answers, tech plan, report specs); the checker `authoring/build.py` refuses any quote not found verbatim. All 142 PRD version 10 requirement codes are covered.

## 9. VIU status
- Every case and recipe: UNVERIFIED — the build is not yet available.

## 10. Open questions
- Chris Ward answered all 38 questions of the first sheet on 19 Oct 2026 (design-recheck-2026-10-20/chris-answers.json).
- Questions 39 and 40 (rows 46 and 47, light green) of the same sheet (https://docs.google.com/spreadsheets/d/17Ry1BtRTPEkecBP5TlgAE0T93Ai1TQewdJ7B7WpWDBQ) were answered by Chris Ward on 21 Oct 2026 and became PRD version 11: [C690660](https://shopview.testrail.io/index.php?/cases/view/690660) was released; DR-08 (C690665) was deleted on 22 Oct 2026 because nothing makes a Lead Technician message show today (answer 40). (A third, on the phone control, was withdrawn on 20 Oct 2026 as answered by answer 9; its held case DR-05 was deleted.) No question is open.
