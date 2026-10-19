# WO Board and Tech View: setup file for Claude sessions (48 cases, 16 to 19 Oct 2026)

This file is for a Claude session. A manual tester never needs it: each test case is complete on its own. With this file and the access the user gives at the start of the session, a new session can put the account into every case's starting state. It holds no environment address, credentials, cookies or session data.

## 1. Header

- Feature: Work Orders, Board View and Tech View display options (epic SV-10043; stories SV-10044 to SV-10054).
- Generated: 16 Oct 2026, for the 21 cases rewritten that day in the two-audience layout (a one-time trial ordered by the QA lead), and C614719 added the same evening for PRD v62 S11-R1; C665914 added 19 Oct 2026 for SV-11503 (drag preview), PRD v64; C368131, C368167 and C96936 added 19 Oct 2026 when their preconditions and steps were simplified (QA lead); C682420 (SV-11467) added 19 Oct 2026 from its own preconditions and ticket only (QA lead: "setup should not be invented it should be 100% authentic").
- Sources: PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030, version 62 (16 Oct 2026 17:35 UTC, Chris Ward; S2-R23 and S11-R1 reworded after answers 32 and 33); Jira stories SV-10044 to SV-10054 and defects SV-11317 to SV-11326, SV-11338, SV-11416; tech plan (upload of 8 Oct 2026); Claude Design project "Work Orders" (Branko Cicovic), export of 14 Oct 2026; QA handoff test plan (8 Oct 2026); Chris Ward's answers 1 to 33 (sheet of 14 Oct 2026).
- At session start, ask the user for: the site to use (staging or a QA site) and how to sign in as ACCOUNT-A, and ACCOUNT-B where a case needs it.

## 2. Accounts and roles

| Slot      | Role as shown in the UI     | Used for                                                                      | How the role is set up                                                                                                                                                       | Cases and recipes                                |
|-----------|-----------------------------|-------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|
| ACCOUNT-A | Admin                       | Creates every record and performs every step except where ACCOUNT-B is named. | System role; your initials \> Settings \> Roles & Permissions \> "Admin": Work orders View and Create & Edit on (full access, See financial data included).                  | All 21 cases; SETUP-ADMIN and every case recipe. |
| ACCOUNT-B | ZZAUTOTEST C97020 View Only | The second user who may only view work orders.                                | Custom role: Settings \> Roles & Permissions \> Create Custom Role \> Skip \> name "ZZAUTOTEST C97020 View Only" \> under Work orders tick only View \> Create (P-VIEWONLY). | C97020; SETUP-VIEWONLY.                          |

## 3. Flags and settings

- Density (density button left of the display switcher): Regular is the default; cases name the density they start at.
- Board View "Fields to display" \> "Line technicians": on for C590128 and the name-bubble case (P-FIELDS-LINETECHS).
- Pins (per user, shared by both views): cases name which technicians are pinned, or that none is (P-PIN, P-UNPIN-ALL).
- Tech View columns: C590113 needs a user who has never changed Tech View's columns.
- Staff "Time Clock": on for every technician at the start; the Time Clock case turns it off during the test.
- Browser: design cases use a 1440 px window at 100% zoom (1536 px where named); behaviour cases need at least 1024 px.
- Technician filter: not on staging yet (SV-11326 open); C590127 stays Blocked until it ships.

## 4. Data recipes

### Shared procedures

| Procedure              | Slot      | How                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Check                                                                                                 |
|------------------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| **P-SIGNIN**           | ACCOUNT-A | Sign in as ACCOUNT-A. On a QA site click the Admin quick-login button on the sign-in page (you appear as "Admin ShopView"); elsewhere use the access the user gave at session start. Check the role: your initials (top right) \> Settings \> Roles & Permissions \> "Admin": Work orders View and Create & Edit are on.                                                                                                                                                                                                   | The top bar shows your initials and the location.                                                     |
| **P-LOCATION**         | ACCOUNT-A | Your initials (top right) \> "Change Location" \> pick the location the cases use ("Staging Heavy Duty - 9919" on staging; on another site the location the user names). Create every record below at that location.                                                                                                                                                                                                                                                                                                       | The top bar next to the bell shows that location.                                                     |
| **P-TECH**             | ACCOUNT-A | Your initials \> "Settings" \> "Staff" \> "New Staff Member": First Name "{first}", Last Name "{last}" (the name then shows as "{first} {last}"), an Email with ZZAUTOTEST in it, Role "Technician", at least one Department (required), Location = the case location, "Time Clock" on \> "Save & Close". If a staff member with exactly this name already exists, is active and matches, reuse it (except where the case deletes it or changes its Time Clock: then make it new, and delete or rename the old one first). | "Settings" \> "Staff" lists "{first} {last}" as active with Time Clock on.                            |
| **P-PHOTO**            | ACCOUNT-A | Give the technician a profile photo: use an Email you can open when creating them, accept the invitation email and set a password, sign in as them in a private window, your initials \> "Edit Profile" \> "Click to upload a profile photo", pick any photo, close that window.                                                                                                                                                                                                                                           | Their avatar in Board View shows the photo, not initials.                                             |
| **P-CUSTOMER**         | ACCOUNT-A | Top menu "Customers" \> "New Customer" \> Name "{name}" \> Save. On the customer page "Contacts" \> "New Contact" \> First Name "ZZAUTOTEST", Last Name "Contact" \> Save. For each unit listed for this customer: "Assets" \> "New Asset" \> pick the contact, Year 2022, Make (type "Freight", pick Freightliner), Model M2, Unit = the unit given \> Save. Contact and Make are required.                                                                                                                               | The customer page lists one asset per unit, each with its Unit.                                       |
| **P-WO**               | ACCOUNT-A | "Work Orders" \> "Create Work Order" \> in the New Work Order window pick the customer and the asset with the given Unit \> Save (if a Confirmation about the credit limit appears, click "Create"). On the Lines tab's New Line form type "grease", pick "Service - Full grease service", turn "Line Approved" on \> "Save & Close" (status Approved). If a lead is given, pick it in the page's "Lead Technician" dropdown (saves at once). Leave it empty for no lead.                                                  | List with the customer's name in Search shows the work order with that Unit, status and lead.         |
| **P-WO-ESTIMATE**      | ACCOUNT-A | As P-WO, but click "Save & Close" with "Line Approved" off; the work order stays an Estimate with no lead.                                                                                                                                                                                                                                                                                                                                                                                                                 | List shows the Unit as an Estimate with no lead.                                                      |
| **P-WO-REVIEW**        | ACCOUNT-A | As P-WO, then on the line click "Complete", type a Tech Story (fill any missing detail it asks for, for example Mileage) and click "Complete Line".                                                                                                                                                                                                                                                                                                                                                                        | The status reads Ready For Review.                                                                    |
| **P-WO-INVOICED**      | ACCOUNT-A | As P-WO-REVIEW, then on the "Finance" tab click "Mark Reviewed" (fill Mileage or Engine Hours if asked, "Confirm review"), then "Create Invoice".                                                                                                                                                                                                                                                                                                                                                                          | The status reads Invoiced.                                                                            |
| **P-LINE-TECH**        | ACCOUNT-A | On the work order's "Lines" tab add one approved line per technician given ("grease" \> "Service - Full grease service", "Line Approved" on) and, for each, click the line's name to open Edit Line, choose the technician under Technicians and save.                                                                                                                                                                                                                                                                     | Tech View's "Assigned Techs" cell shows the lead first, then each line technician.                    |
| **P-ADVISOR**          | ACCOUNT-A | On the work order page pick any staff member as Service Advisor.                                                                                                                                                                                                                                                                                                                                                                                                                                                           | List's "Service Advisor" column shows a name for it.                                                  |
| **P-CLOCKIN**          | ACCOUNT-A | Have the line technician clock in to the line the way technicians clock in at the shop, and leave the clock running. UNVERIFIED on screen; API route (playbook, technician tasks): POST /api/technician-tasks/check-in with task_id, line_id, work_order_id and refresh_lines true answers 201. Clock-out is not solved, so the clock stays running.                                                                                                                                                                       | List's "Clocked In" column shows the technician's name for the work order.                            |
| **P-PIN**              | ACCOUNT-A | Work Orders \> "All" \> "Board View": unpin every technician not listed (click the blue pin on their column header), then click the grey pin on each listed technician's column header, in the order listed.                                                                                                                                                                                                                                                                                                               | Board View shows the listed technicians right after "Unassigned", their pins blue, no other pin blue. |
| **P-UNPIN-ALL**        | ACCOUNT-A | Work Orders \> "All" \> "Board View": click every blue pin to unpin it.                                                                                                                                                                                                                                                                                                                                                                                                                                                    | No column header shows a blue pin.                                                                    |
| **P-FIELDS-LINETECHS** | ACCOUNT-A | Work Orders \> "Board View" \> "Fields to display": turn "Line technicians" on.                                                                                                                                                                                                                                                                                                                                                                                                                                            | Board View cards show the line technicians' avatars.                                                  |
| **P-START**            | ACCOUNT-A | Bring the page to the case's starting screen: Work Orders \> the tab named; in each filter clear any choice (click the x on the Asset on Site chip if it shows Yes or No), turn "Assigned to me" off, set Search as named (or empty), set density with the density button as named (Regular is the default), and pick the display named.                                                                                                                                                                                   | The page matches the case's starting-screen line exactly.                                             |
| **P-VIEWONLY**         | ACCOUNT-A | Your initials \> "Settings" \> "Roles & Permissions" \> "Create Custom Role" \> Skip \> Role Name "ZZAUTOTEST C97020 View Only" \> under Work orders tick only View \> Create. Then "Settings" \> "Staff" \> "New Staff Member" First Name "ZZAUTOTEST C97020", Last Name "Viewer", with an email inbox you can open, that role, the case location; finish the invite so ACCOUNT-B can sign in.                                                                                                                            | ACCOUNT-B signs in a second browser and sees Work Orders without a "Create Work Order" button.        |
| **P-EMPTY-LOCATION**   | ACCOUNT-A | UNVERIFIED (no recorded path): find or create a location with no work orders and name it "ZZAUTOTEST Empty Location" (for example Settings \> Locations, if the role allows it). If no such location can be made, ask the user for an empty location and record its name; the case then needs that name.                                                                                                                                                                                                                   | At that location, Work Orders \> "All" \> List shows no work orders.                                  |

### One recipe per case

#### SETUP-C97021 — [C97021](https://shopview.testrail.io/index.php?/cases/view/97021) Tab enters each view once and the arrow keys move between cards and rows

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two technicians are active at {Location-A} with the "Technician" role and Time Clock on: {Technician-A} and {Technician-B}. For example: {Technician-A} is ZZAUTOTEST C97021 Ana and {Technician-B} is ZZAUTOTEST C97021 Ben.
- Customer {Customer-A} has four Approved work orders: {Work-order-1} and {Work-order-2} led by {Technician-A}, {Work-order-3} led by {Technician-B}, and {Work-order-4} with no lead technician. For example: {Customer-A} is ZZAUTOTEST C97021 Keyboard, and {Work-order-1} to {Work-order-4} are S10043-17701 to S10043-17704.
- {Technician-A} and {Technician-B} are pinned in your Board View, and no other technician is pinned.
- Starting screen: "Work Orders" \> "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off, in a browser window at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C97021", Last Name "Ana" (shows as "ZZAUTOTEST C97021 Ana").
2.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C97021", Last Name "Ben" (shows as "ZZAUTOTEST C97021 Ben").
3.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C97021 Keyboard"; units "C97021-U1", "C97021-U2", "C97021-U3", "C97021-U4".
4.  **P-WO** (ACCOUNT-A): Unit "C97021-U1"; customer "ZZAUTOTEST C97021 Keyboard"; lead "ZZAUTOTEST C97021 Ana".
5.  **P-WO** (ACCOUNT-A): Unit "C97021-U2"; customer "ZZAUTOTEST C97021 Keyboard"; lead "ZZAUTOTEST C97021 Ana".
6.  **P-WO** (ACCOUNT-A): Unit "C97021-U3"; customer "ZZAUTOTEST C97021 Keyboard"; lead "ZZAUTOTEST C97021 Ben".
7.  **P-WO** (ACCOUNT-A): Unit "C97021-U4"; customer "ZZAUTOTEST C97021 Keyboard"; no lead.
8.  **P-PIN** (ACCOUNT-A): technicians "ZZAUTOTEST C97021 Ana", "ZZAUTOTEST C97021 Ben".
9.  **P-START** (ACCOUNT-A): starting screen: Board View, All tab, Search "ZZAUTOTEST C97021 Keyboard".

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = ZZAUTOTEST C97021 Ana
- {Technician-B} = ZZAUTOTEST C97021 Ben
- {Customer-A} = ZZAUTOTEST C97021 Keyboard
- {Work-order-1} = the work order for unit C97021-U1
- {Work-order-2} = the work order for unit C97021-U2
- {Work-order-3} = the work order for unit C97021-U3
- {Work-order-4} = the work order for unit C97021-U4

#### SETUP-C368150 — [C368150](https://shopview.testrail.io/index.php?/cases/view/368150) Enter opens the focused card or row, and no key drags it

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two technicians are active at {Location-A} with the "Technician" role and Time Clock on: {Technician-A} and {Technician-B}. For example: {Technician-A} is ZZAUTOTEST C368150 Ana and {Technician-B} is ZZAUTOTEST C368150 Ben.
- Customer {Customer-A} has four Approved work orders: {Work-order-1} and {Work-order-2} led by {Technician-A}, {Work-order-3} led by {Technician-B}, and {Work-order-4} with no lead technician. For example: {Customer-A} is ZZAUTOTEST C368150 Enter, and {Work-order-1} to {Work-order-4} are S10043-17701 to S10043-17704.
- {Technician-A} and {Technician-B} are pinned in your Board View, and no other technician is pinned.
- Starting screen: "Work Orders" \> "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off, in a browser window at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C368150", Last Name "Ana" (shows as "ZZAUTOTEST C368150 Ana").
2.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C368150", Last Name "Ben" (shows as "ZZAUTOTEST C368150 Ben").
3.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C368150 Enter"; units "C368150-U1", "C368150-U2", "C368150-U3", "C368150-U4".
4.  **P-WO** (ACCOUNT-A): Unit "C368150-U1"; customer "ZZAUTOTEST C368150 Enter"; lead "ZZAUTOTEST C368150 Ana".
5.  **P-WO** (ACCOUNT-A): Unit "C368150-U2"; customer "ZZAUTOTEST C368150 Enter"; lead "ZZAUTOTEST C368150 Ana".
6.  **P-WO** (ACCOUNT-A): Unit "C368150-U3"; customer "ZZAUTOTEST C368150 Enter"; lead "ZZAUTOTEST C368150 Ben".
7.  **P-WO** (ACCOUNT-A): Unit "C368150-U4"; customer "ZZAUTOTEST C368150 Enter"; no lead.
8.  **P-PIN** (ACCOUNT-A): technicians "ZZAUTOTEST C368150 Ana", "ZZAUTOTEST C368150 Ben".
9.  **P-START** (ACCOUNT-A): starting screen: Board View, All tab, Search "ZZAUTOTEST C368150 Enter".

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = ZZAUTOTEST C368150 Ana
- {Technician-B} = ZZAUTOTEST C368150 Ben
- {Customer-A} = ZZAUTOTEST C368150 Enter
- {Work-order-1} = the work order for unit C368150-U1
- {Work-order-2} = the work order for unit C368150-U2
- {Work-order-3} = the work order for unit C368150-U3
- {Work-order-4} = the work order for unit C368150-U4

#### SETUP-C368152 — [C368152](https://shopview.testrail.io/index.php?/cases/view/368152) Reassign and Unassign work from the keyboard through the More actions menu

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two technicians are active at {Location-A} with the "Technician" role and Time Clock on: {Technician-A} and {Technician-B}. For example: {Technician-A} is ZZAUTOTEST C368152 Ana and {Technician-B} is ZZAUTOTEST C368152 Ben.
- Customer {Customer-A} has three Approved work orders: {Work-order-1} led by {Technician-A}, {Work-order-2} led by {Technician-B}, and {Work-order-3} with no lead technician. None has a shift on the Schedule. For example: {Customer-A} is ZZAUTOTEST C368152 Reassign, and {Work-order-1} to {Work-order-3} are S10043-17721 to S10043-17723.
- {Technician-A} and {Technician-B} are pinned in your Board View, and no other technician is pinned.
- Starting screen: "Work Orders" \> "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off, in a browser window at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C368152", Last Name "Ana" (shows as "ZZAUTOTEST C368152 Ana").
2.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C368152", Last Name "Ben" (shows as "ZZAUTOTEST C368152 Ben").
3.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C368152 Reassign"; units "C368152-U1", "C368152-U3", "C368152-U4".
4.  **P-WO** (ACCOUNT-A): Unit "C368152-U1"; customer "ZZAUTOTEST C368152 Reassign"; lead "ZZAUTOTEST C368152 Ana".
5.  **P-WO** (ACCOUNT-A): Unit "C368152-U3"; customer "ZZAUTOTEST C368152 Reassign"; lead "ZZAUTOTEST C368152 Ben".
6.  **P-WO** (ACCOUNT-A): Unit "C368152-U4"; customer "ZZAUTOTEST C368152 Reassign"; no lead.
7.  **P-PIN** (ACCOUNT-A): technicians "ZZAUTOTEST C368152 Ana", "ZZAUTOTEST C368152 Ben".
8.  **P-START** (ACCOUNT-A): starting screen: Board View, All tab, Search "ZZAUTOTEST C368152 Reassign".

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = ZZAUTOTEST C368152 Ana
- {Technician-B} = ZZAUTOTEST C368152 Ben
- {Customer-A} = ZZAUTOTEST C368152 Reassign
- {Work-order-1} = the work order for unit C368152-U1
- {Work-order-2} = the work order for unit C368152-U3
- {Work-order-3} = the work order for unit C368152-U4

#### SETUP-C97020 — [C97020](https://shopview.testrail.io/index.php?/cases/view/97020) The keyboard cannot get around permission or status limits

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- A second user {User-B} has the custom role {Role-A}, which allows Work orders: View only, and is signed in in a second browser. For example: {User-B} is ZZAUTOTEST C97020 Viewer and {Role-A} is ZZAUTOTEST C97020 View Only.
- Technician {Technician-A} is active at {Location-A} with the "Technician" role and is pinned in Board View for both users. For example: {Technician-A} is ZZAUTOTEST C97020 Ana.
- Customer {Customer-A} has two work orders led by {Technician-A}: {Work-order-1}, Approved, and {Work-order-2}, Invoiced. None has a shift on the Schedule. For example: {Customer-A} is ZZAUTOTEST C97020 Limits, and {Work-order-1} and {Work-order-2} are S10043-17711 and S10043-17712.
- Starting screen: "Work Orders" \> "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off, in a browser window at least 1024 px wide, for both users.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A, ACCOUNT-B. **Run first:** SETUP-ADMIN, SETUP-VIEWONLY.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C97020", Last Name "Ana" (shows as "ZZAUTOTEST C97020 Ana").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C97020 Limits"; units "C97020-U1", "C97020-U2".
3.  **P-WO** (ACCOUNT-A): Unit "C97020-U1"; customer "ZZAUTOTEST C97020 Limits"; lead "ZZAUTOTEST C97020 Ana".
4.  **P-WO-INVOICED** (ACCOUNT-A): Unit "C97020-U2"; customer "ZZAUTOTEST C97020 Limits"; lead "ZZAUTOTEST C97020 Ana".
5.  **P-PIN** (ACCOUNT-A): technicians "ZZAUTOTEST C97020 Ana".
6.  **P-PIN** (ACCOUNT-B): technicians "ZZAUTOTEST C97020 Ana"; signed in as ACCOUNT-B.
7.  **P-START** (ACCOUNT-A): starting screen: Board View, All tab, Search "ZZAUTOTEST C97020 Limits", for ACCOUNT-A and ACCOUNT-B.

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {User-B} = ZZAUTOTEST C97020 Viewer
- {Role-A} = ZZAUTOTEST C97020 View Only
- {Technician-A} = ZZAUTOTEST C97020 Ana
- {Customer-A} = ZZAUTOTEST C97020 Limits
- {Work-order-1} = the work order for unit C97020-U1
- {Work-order-2} = the work order for unit C97020-U2

#### SETUP-C96945 — [C96945](https://shopview.testrail.io/index.php?/cases/view/96945) A card's More actions menu appears on hover or focus and offers Reassign

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technician {Technician-A} is active at {Location-A} with the "Technician" role and is pinned in your Board View. For example: {Technician-A} is ZZAUTOTEST C96945 Ana.
- Customer {Customer-A} has one Approved work order, {Work-order-1}, led by {Technician-A}. For example: {Customer-A} is ZZAUTOTEST C96945 Card Menu and {Work-order-1} is S10043-17731.
- Starting screen: "Work Orders" \> "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off, in a browser window at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C96945", Last Name "Ana" (shows as "ZZAUTOTEST C96945 Ana").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C96945 Card Menu"; units "C96945-U1".
3.  **P-WO** (ACCOUNT-A): Unit "C96945-U1"; customer "ZZAUTOTEST C96945 Card Menu"; lead "ZZAUTOTEST C96945 Ana".
4.  **P-PIN** (ACCOUNT-A): technicians "ZZAUTOTEST C96945 Ana".
5.  **P-START** (ACCOUNT-A): starting screen: Board View, All tab, Search "ZZAUTOTEST C96945 Card Menu".

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = ZZAUTOTEST C96945 Ana
- {Customer-A} = ZZAUTOTEST C96945 Card Menu
- {Work-order-1} = the work order for unit C96945-U1

#### SETUP-C614711 — [C614711](https://shopview.testrail.io/index.php?/cases/view/614711) Work orders of a deleted lead sit under Deleted technician, which takes no drops

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two technicians are active at {Location-A} with the "Technician" role: {Technician-A} and {Technician-B}. {Technician-A} was made for this case only and has no labor on any work order, because this test deletes that staff record. For example: {Technician-A} is ZZAUTOTEST C614711 Dana and {Technician-B} is ZZAUTOTEST C614711 Eli.
- Customer {Customer-A} has two Approved work orders: {Work-order-1} led by {Technician-A}, and {Work-order-2} with no lead technician. For example: {Customer-A} is ZZAUTOTEST C614711 Deleted Lead, and {Work-order-1} and {Work-order-2} are S10043-17901 and S10043-17902.
- Starting screen: your initials (top right) \> "Settings" \> "Staff", in a browser window at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C614711", Last Name "Dana" (shows as "ZZAUTOTEST C614711 Dana").
2.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C614711", Last Name "Eli" (shows as "ZZAUTOTEST C614711 Eli").
3.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C614711 Deleted Lead"; units "C614711-U1", "C614711-U2".
4.  **P-WO** (ACCOUNT-A): Unit "C614711-U1"; customer "ZZAUTOTEST C614711 Deleted Lead"; lead "ZZAUTOTEST C614711 Dana".
5.  **P-WO** (ACCOUNT-A): Unit "C614711-U2"; customer "ZZAUTOTEST C614711 Deleted Lead"; no lead.
6.  **P-START** (ACCOUNT-A): starting screen: Settings \> Staff page.

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = ZZAUTOTEST C614711 Dana
- {Technician-B} = ZZAUTOTEST C614711 Eli
- {Customer-A} = ZZAUTOTEST C614711 Deleted Lead
- {Work-order-1} = the work order for unit C614711-U1
- {Work-order-2} = the work order for unit C614711-U2

#### SETUP-C96916 — [C96916](https://shopview.testrail.io/index.php?/cases/view/96916) Browser Back restores scroll, tab and filters in Tech View and Board View

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Eight technicians are active at {Location-A} with the "Technician" role and Time Clock on: {Technician-A}, {Technician-B}, {Technician-C}, {Technician-D}, {Technician-E}, {Technician-F}, {Technician-G} and {Technician-H}. For example: {Technician-A} to {Technician-H} are ZZAUTOTEST C96916 Ana, Ben, Cal, Dee, Eve, Fay, Gus and Hal.
- Customer {Customer-A} has about 20 Approved work orders led by {Technician-H} and 2 led by each of the other seven technicians. With a search on its name, Board View is wider than the window (you scroll right to reach {Technician-H}'s column), and that column and the Tech View table are taller than the window. For example: {Customer-A} is ZZAUTOTEST C96916 Scroll Back.
- Starting screen: "Work Orders" \> "Work Orders" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off, "Status" filter set to "Approved" only, in a browser window at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C96916", Last Name "Ana" (shows as "ZZAUTOTEST C96916 Ana").
2.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C96916", Last Name "Ben" (shows as "ZZAUTOTEST C96916 Ben").
3.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C96916", Last Name "Cal" (shows as "ZZAUTOTEST C96916 Cal").
4.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C96916", Last Name "Dee" (shows as "ZZAUTOTEST C96916 Dee").
5.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C96916", Last Name "Eve" (shows as "ZZAUTOTEST C96916 Eve").
6.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C96916", Last Name "Fay" (shows as "ZZAUTOTEST C96916 Fay").
7.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C96916", Last Name "Gus" (shows as "ZZAUTOTEST C96916 Gus").
8.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C96916", Last Name "Hal" (shows as "ZZAUTOTEST C96916 Hal").
9.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C96916 Scroll Back"; units "C96916-H01", "C96916-H02", "C96916-H03", "C96916-H04", "C96916-H05", "C96916-H06", "C96916-H07", "C96916-H08", "C96916-H09", "C96916-H10", "C96916-H11", "C96916-H12", "C96916-H13", "C96916-H14", "C96916-H15", "C96916-H16", "C96916-H17", "C96916-H18", "C96916-H19", "C96916-H20", "C96916-A1", "C96916-A2", "C96916-B1", "C96916-B2", "C96916-C1", "C96916-C2", "C96916-D1", "C96916-D2", "C96916-E1", "C96916-E2", "C96916-F1", "C96916-F2", "C96916-G1", "C96916-G2".
10. **P-WO** (ACCOUNT-A): Unit "C96916-H01"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
11. **P-WO** (ACCOUNT-A): Unit "C96916-H02"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
12. **P-WO** (ACCOUNT-A): Unit "C96916-H03"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
13. **P-WO** (ACCOUNT-A): Unit "C96916-H04"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
14. **P-WO** (ACCOUNT-A): Unit "C96916-H05"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
15. **P-WO** (ACCOUNT-A): Unit "C96916-H06"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
16. **P-WO** (ACCOUNT-A): Unit "C96916-H07"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
17. **P-WO** (ACCOUNT-A): Unit "C96916-H08"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
18. **P-WO** (ACCOUNT-A): Unit "C96916-H09"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
19. **P-WO** (ACCOUNT-A): Unit "C96916-H10"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
20. **P-WO** (ACCOUNT-A): Unit "C96916-H11"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
21. **P-WO** (ACCOUNT-A): Unit "C96916-H12"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
22. **P-WO** (ACCOUNT-A): Unit "C96916-H13"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
23. **P-WO** (ACCOUNT-A): Unit "C96916-H14"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
24. **P-WO** (ACCOUNT-A): Unit "C96916-H15"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
25. **P-WO** (ACCOUNT-A): Unit "C96916-H16"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
26. **P-WO** (ACCOUNT-A): Unit "C96916-H17"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
27. **P-WO** (ACCOUNT-A): Unit "C96916-H18"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
28. **P-WO** (ACCOUNT-A): Unit "C96916-H19"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
29. **P-WO** (ACCOUNT-A): Unit "C96916-H20"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Hal".
30. **P-WO** (ACCOUNT-A): Unit "C96916-A1"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Ana".
31. **P-WO** (ACCOUNT-A): Unit "C96916-A2"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Ana".
32. **P-WO** (ACCOUNT-A): Unit "C96916-B1"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Ben".
33. **P-WO** (ACCOUNT-A): Unit "C96916-B2"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Ben".
34. **P-WO** (ACCOUNT-A): Unit "C96916-C1"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Cal".
35. **P-WO** (ACCOUNT-A): Unit "C96916-C2"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Cal".
36. **P-WO** (ACCOUNT-A): Unit "C96916-D1"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Dee".
37. **P-WO** (ACCOUNT-A): Unit "C96916-D2"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Dee".
38. **P-WO** (ACCOUNT-A): Unit "C96916-E1"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Eve".
39. **P-WO** (ACCOUNT-A): Unit "C96916-E2"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Eve".
40. **P-WO** (ACCOUNT-A): Unit "C96916-F1"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Fay".
41. **P-WO** (ACCOUNT-A): Unit "C96916-F2"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Fay".
42. **P-WO** (ACCOUNT-A): Unit "C96916-G1"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Gus".
43. **P-WO** (ACCOUNT-A): Unit "C96916-G2"; customer "ZZAUTOTEST C96916 Scroll Back"; lead "ZZAUTOTEST C96916 Gus".
44. **P-UNPIN-ALL** (ACCOUNT-A): as described in the procedure table.
45. **P-START** (ACCOUNT-A): starting screen: Board View, Work Orders tab, Status "Approved" only, Search "ZZAUTOTEST C96916 Scroll Back".

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = ZZAUTOTEST C96916 Ana
- {Technician-B} = ZZAUTOTEST C96916 Ben
- {Technician-C} = ZZAUTOTEST C96916 Cal
- {Technician-D} = ZZAUTOTEST C96916 Dee
- {Technician-E} = ZZAUTOTEST C96916 Eve
- {Technician-F} = ZZAUTOTEST C96916 Fay
- {Technician-G} = ZZAUTOTEST C96916 Gus
- {Technician-H} = ZZAUTOTEST C96916 Hal
- {Customer-A} = ZZAUTOTEST C96916 Scroll Back

#### SETUP-C368214 — [C368214](https://shopview.testrail.io/index.php?/cases/view/368214) After Back and Forward the List keeps its tab, search and filters

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Customer {Customer-A} has one Approved work order, {Work-order-1}. For example: {Customer-A} is ZZAUTOTEST C368214 Back Forward and {Work-order-1} is S10043-17751.
- Starting screen: "Work Orders" \> "Work Orders" tab, "List" shown, "Search" empty, no filter chosen, "Assigned to me" off, in a browser window at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C368214 Back Forward"; units "C368214-U1".
2.  **P-WO** (ACCOUNT-A): Unit "C368214-U1"; customer "ZZAUTOTEST C368214 Back Forward"; no lead.
3.  **P-START** (ACCOUNT-A): starting screen: List, Work Orders tab, Search empty.

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Customer-A} = ZZAUTOTEST C368214 Back Forward
- {Work-order-1} = the work order for unit C368214-U1

#### SETUP-C590110 — [C590110](https://shopview.testrail.io/index.php?/cases/view/590110) Design: The view buttons, filter and search icons look as in the design

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "DC-01-toolbar-tech-view-light-1440.png" and "DC-01-toolbar-board-view-light-1440.png" attached to this case are open beside it at 100% (actual size). Names, numbers and rank numbers in the pictures are sample data.
- Customer {Customer-A} has one Approved work order, {Work-order-1}, led by technician {Technician-A}. For example: {Customer-A} is ZZAUTOTEST C590110 Toolbar Icons, {Work-order-1} is S10043-17801 and {Technician-A} is ZZAUTOTEST C590110 Ana.
- Starting screen: "Work Orders" \> "All" tab, "List" shown, "Search" empty, no filter chosen, "Assigned to me" off, density "Regular".
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590110", Last Name "Ana" (shows as "ZZAUTOTEST C590110 Ana").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590110 Toolbar Icons"; units "C590110-U1".
3.  **P-WO** (ACCOUNT-A): Unit "C590110-U1"; customer "ZZAUTOTEST C590110 Toolbar Icons"; lead "ZZAUTOTEST C590110 Ana".
4.  **P-START** (ACCOUNT-A): starting screen: List, All tab, density Regular, Search empty.

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Customer-A} = ZZAUTOTEST C590110 Toolbar Icons
- {Technician-A} = ZZAUTOTEST C590110 Ana
- {Work-order-1} = the work order for unit C590110-U1

#### SETUP-C590112 — [C590112](https://shopview.testrail.io/index.php?/cases/view/590112) Design: Tech View table fills the full width and Status fits its labels

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "DC-03-tech-view-regular-light-1440.png" and "DC-03-tech-view-regular-light-1536.png" attached to this case are open beside it at 100% (actual size). Names, numbers and rank numbers in the pictures are sample data. Your screen lets you widen the window to 1536 px.
- Customer {Customer-A} has an Approved work order {Work-order-1}, led by technician {Technician-A}, and an Estimate {Work-order-2} with no lead technician. Customer {Customer-B} has a work order {Work-order-3} in "Ready For Review", led by {Technician-A}. For example: {Customer-A} is ZZAUTOTEST C590112 Short, {Customer-B} is ZZAUTOTEST C590112 Review, {Technician-A} is ZZAUTOTEST C590112 Ana, and {Work-order-1} to {Work-order-3} are S10043-17807 to S10043-17809.
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, "Search" empty, no filter chosen, "Assigned to me" off, density "Regular".
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590112", Last Name "Ana" (shows as "ZZAUTOTEST C590112 Ana").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590112 Short"; units "C590112-S1", "C590112-S2".
3.  **P-WO** (ACCOUNT-A): Unit "C590112-S1"; customer "ZZAUTOTEST C590112 Short"; lead "ZZAUTOTEST C590112 Ana".
4.  **P-WO-ESTIMATE** (ACCOUNT-A): Unit "C590112-S2"; customer "ZZAUTOTEST C590112 Short"; no lead.
5.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590112 Review"; units "C590112-R1".
6.  **P-WO-REVIEW** (ACCOUNT-A): Unit "C590112-R1"; customer "ZZAUTOTEST C590112 Review"; lead "ZZAUTOTEST C590112 Ana".
7.  **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, density Regular, Search empty.

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Customer-A} = ZZAUTOTEST C590112 Short
- {Customer-B} = ZZAUTOTEST C590112 Review
- {Technician-A} = ZZAUTOTEST C590112 Ana
- {Work-order-1} = the work order for unit C590112-S1
- {Work-order-2} = the estimate for unit C590112-S2
- {Work-order-3} = the work order for unit C590112-R1

#### SETUP-C590114 — [C590114](https://shopview.testrail.io/index.php?/cases/view/590114) Design: Tech View rows show a blue number, a thin progress bar and an avatar

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design picture "DC-05-tech-view-rows-regular-light-1440.png" attached to this case is open beside it at 100% (actual size). Names, numbers and rank numbers in the pictures are sample data.
- Two technicians are active at {Location-A} with the "Technician" role: {Technician-A}, who has a profile photo, and {Technician-B}, who has none. For example: {Technician-A} is ZZAUTOTEST C590114 Eva and {Technician-B} is ZZAUTOTEST C590114 Finn.
- Customer {Customer-A} has an Approved work order {Work-order-1}, led by {Technician-A}, with a service advisor and one approved line {Line-1} whose technician is {Technician-B}, who is clocked in to it; and an Invoiced work order {Work-order-2}, led by {Technician-A}. For example: {Customer-A} is ZZAUTOTEST C590114 Cell Styles, {Work-order-1} and {Work-order-2} are S10043-17812 and S10043-17813, and {Line-1} is "Service - Full grease service".
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off, density "Regular".
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590114", Last Name "Eva" (shows as "ZZAUTOTEST C590114 Eva").
2.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590114", Last Name "Finn" (shows as "ZZAUTOTEST C590114 Finn").
3.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590114 Cell Styles"; units "C590114-U1", "C590114-U2".
4.  **P-WO** (ACCOUNT-A): Unit "C590114-U1"; customer "ZZAUTOTEST C590114 Cell Styles"; lead "ZZAUTOTEST C590114 Eva".
5.  **P-WO-INVOICED** (ACCOUNT-A): Unit "C590114-U2"; customer "ZZAUTOTEST C590114 Cell Styles"; lead "ZZAUTOTEST C590114 Eva".
6.  **P-PHOTO** (ACCOUNT-A): technician "ZZAUTOTEST C590114 Eva".
7.  **P-ADVISOR** (ACCOUNT-A): Unit "C590114-U1".
8.  **P-LINE-TECH** (ACCOUNT-A): Unit "C590114-U1"; technicians "ZZAUTOTEST C590114 Finn"; use the work order's existing approved line.
9.  **P-CLOCKIN** (ACCOUNT-A): Unit "C590114-U1"; technician "ZZAUTOTEST C590114 Finn".
10. **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, density Regular, Search "ZZAUTOTEST C590114 Cell Styles".

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = ZZAUTOTEST C590114 Eva (with a profile photo)
- {Technician-B} = ZZAUTOTEST C590114 Finn (no photo)
- {Customer-A} = ZZAUTOTEST C590114 Cell Styles
- {Work-order-1} = the work order for unit C590114-U1
- {Work-order-2} = the work order for unit C590114-U2
- {Line-1} = the approved line of C590114-U1

#### SETUP-C590117 — [C590117](https://shopview.testrail.io/index.php?/cases/view/590117) Design: Tech View headings show handle, arrow, avatar, name, pin and count

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "DC-08-tech-view-group-headers-light-1440.png" and "DC-08-tech-view-collapsed-light-1440.png" attached to this case are open beside it at 100% (actual size). Names, numbers and rank numbers in the pictures are sample data.
- Two technicians are active at {Location-A} with the "Technician" role: {Technician-A}, who has a profile photo, and {Technician-B}, who has none. No technician is pinned in your Tech View. For example: {Technician-A} is ZZAUTOTEST C590117 Ines and {Technician-B} is ZZAUTOTEST C590117 Jon.
- Customer {Customer-A} has Approved work orders {Work-order-1} led by {Technician-A} and {Work-order-2} led by {Technician-B}, and an Estimate {Work-order-3} with no lead technician. For example: {Customer-A} is ZZAUTOTEST C590117 Group Header, and {Work-order-1} to {Work-order-3} are S10043-17821 to S10043-17823.
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off, density "Regular".
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590117", Last Name "Ines" (shows as "ZZAUTOTEST C590117 Ines").
2.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590117", Last Name "Jon" (shows as "ZZAUTOTEST C590117 Jon").
3.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590117 Group Header"; units "C590117-U1", "C590117-U2", "C590117-U3".
4.  **P-WO** (ACCOUNT-A): Unit "C590117-U1"; customer "ZZAUTOTEST C590117 Group Header"; lead "ZZAUTOTEST C590117 Ines".
5.  **P-WO** (ACCOUNT-A): Unit "C590117-U2"; customer "ZZAUTOTEST C590117 Group Header"; lead "ZZAUTOTEST C590117 Jon".
6.  **P-WO-ESTIMATE** (ACCOUNT-A): Unit "C590117-U3"; customer "ZZAUTOTEST C590117 Group Header"; no lead.
7.  **P-UNPIN-ALL** (ACCOUNT-A): as described in the procedure table.
8.  **P-PHOTO** (ACCOUNT-A): technician "ZZAUTOTEST C590117 Ines".
9.  **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, density Regular, Search "ZZAUTOTEST C590117 Group Header".

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = ZZAUTOTEST C590117 Ines (with a profile photo)
- {Technician-B} = ZZAUTOTEST C590117 Jon (no photo)
- {Customer-A} = ZZAUTOTEST C590117 Group Header
- {Work-order-1} = the work order for unit C590117-U1
- {Work-order-2} = the work order for unit C590117-U2
- {Work-order-3} = the work order for unit C590117-U3

#### SETUP-C590119 — [C590119](https://shopview.testrail.io/index.php?/cases/view/590119) Design: Board View column headings show handle, avatar, name, pin and count

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "DC-10-board-column-headers-light-1440.png" and "DC-10-board-pinned-light-1440.png" attached to this case are open beside it at 100% (actual size). Names, numbers and rank numbers in the pictures are sample data.
- Four technicians are active at {Location-A} with the "Technician" role: {Technician-A}, who has a profile photo, {Technician-B}, who has none, {Technician-C} and {Technician-D}. No technician is pinned in your Board View. For example: {Technician-A} to {Technician-D} are ZZAUTOTEST C590119 Lea, Max, Nia and Oli.
- Customer {Customer-A} has Approved work orders {Work-order-1} led by {Technician-A} and {Work-order-2} led by {Technician-B}, and an Estimate {Work-order-3} with no lead technician. For example: {Customer-A} is ZZAUTOTEST C590119 Column Header, and {Work-order-1} to {Work-order-3} are S10043-17827 to S10043-17829.
- Starting screen: "Work Orders" \> "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off, density "Regular".
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590119", Last Name "Lea" (shows as "ZZAUTOTEST C590119 Lea").
2.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590119", Last Name "Max" (shows as "ZZAUTOTEST C590119 Max").
3.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590119", Last Name "Nia" (shows as "ZZAUTOTEST C590119 Nia").
4.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590119", Last Name "Oli" (shows as "ZZAUTOTEST C590119 Oli").
5.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590119 Column Header"; units "C590119-U1", "C590119-U2", "C590119-U3".
6.  **P-WO** (ACCOUNT-A): Unit "C590119-U1"; customer "ZZAUTOTEST C590119 Column Header"; lead "ZZAUTOTEST C590119 Lea".
7.  **P-WO** (ACCOUNT-A): Unit "C590119-U2"; customer "ZZAUTOTEST C590119 Column Header"; lead "ZZAUTOTEST C590119 Max".
8.  **P-WO-ESTIMATE** (ACCOUNT-A): Unit "C590119-U3"; customer "ZZAUTOTEST C590119 Column Header"; no lead.
9.  **P-UNPIN-ALL** (ACCOUNT-A): as described in the procedure table.
10. **P-PHOTO** (ACCOUNT-A): technician "ZZAUTOTEST C590119 Lea".
11. **P-START** (ACCOUNT-A): starting screen: Board View, All tab, density Regular, Search "ZZAUTOTEST C590119 Column Header".

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = ZZAUTOTEST C590119 Lea (with a profile photo)
- {Technician-B} = ZZAUTOTEST C590119 Max (no photo)
- {Technician-C} = ZZAUTOTEST C590119 Nia
- {Technician-D} = ZZAUTOTEST C590119 Oli
- {Customer-A} = ZZAUTOTEST C590119 Column Header
- {Work-order-1} = the work order for unit C590119-U1
- {Work-order-2} = the work order for unit C590119-U2
- {Work-order-3} = the work order for unit C590119-U3

#### SETUP-C590128 — [C590128](https://shopview.testrail.io/index.php?/cases/view/590128) Design: Density changes Tech View row, avatar and bar sizes, not card avatars

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "DC-06-tech-view-compact-light-1440.png" and "DC-06-tech-view-regular-light-1440.png" and "DC-06-tech-view-comfortable-light-1440.png" attached to this case are open beside it at 100% (actual size). Names, numbers and rank numbers in the pictures are sample data.
- Customer {Customer-A} has an Approved work order {Work-order-1}, led by technician {Technician-A}, with a service advisor and line technician {Technician-B} on its approved line. Board View's "Fields to display" has "Line technicians" on. For example: {Customer-A} is ZZAUTOTEST C590128 Density, {Work-order-1} is S10043-17830, {Technician-A} is ZZAUTOTEST C590128 Ana and {Technician-B} is ZZAUTOTEST C590128 Ben.
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off, density "Regular".
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590128", Last Name "Ana" (shows as "ZZAUTOTEST C590128 Ana").
2.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590128", Last Name "Ben" (shows as "ZZAUTOTEST C590128 Ben").
3.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590128 Density"; units "C590128-U1".
4.  **P-WO** (ACCOUNT-A): Unit "C590128-U1"; customer "ZZAUTOTEST C590128 Density"; lead "ZZAUTOTEST C590128 Ana".
5.  **P-ADVISOR** (ACCOUNT-A): Unit "C590128-U1".
6.  **P-LINE-TECH** (ACCOUNT-A): Unit "C590128-U1"; technicians "ZZAUTOTEST C590128 Ben"; use the work order's existing approved line.
7.  **P-FIELDS-LINETECHS** (ACCOUNT-A): as described in the procedure table.
8.  **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, density Regular, Search "ZZAUTOTEST C590128 Density".

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Customer-A} = ZZAUTOTEST C590128 Density
- {Technician-A} = ZZAUTOTEST C590128 Ana
- {Technician-B} = ZZAUTOTEST C590128 Ben
- {Work-order-1} = the work order for unit C590128-U1

#### SETUP-C590113 — [C590113](https://shopview.testrail.io/index.php?/cases/view/590113) Design: Tech View opens with 13 columns and small grey column headings

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, and you have never changed Tech View's columns. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "DC-04-tech-view-header-row-1440.png" and "DC-04-tech-view-all-columns-1440.png" attached to this case are open beside it at 100% (actual size). Names, numbers and rank numbers in the pictures are sample data. Your screen lets you widen the window to 1536 px.
- Customer {Customer-A} has an Approved work order {Work-order-1}, led by technician {Technician-A}. For example: {Customer-A} is ZZAUTOTEST C590113 Columns, {Work-order-1} is S10043-17840 and {Technician-A} is ZZAUTOTEST C590113 Ana.
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off, density "Regular".
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590113", Last Name "Ana" (shows as "ZZAUTOTEST C590113 Ana").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590113 Columns"; units "C590113-U1".
3.  **P-WO** (ACCOUNT-A): Unit "C590113-U1"; customer "ZZAUTOTEST C590113 Columns"; lead "ZZAUTOTEST C590113 Ana".
4.  ACCOUNT-A must never have changed Tech View's columns; if it has, use a brand-new Admin user for this case.
5.  **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, density Regular, Search "ZZAUTOTEST C590113 Columns".

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Customer-A} = ZZAUTOTEST C590113 Columns
- {Technician-A} = ZZAUTOTEST C590113 Ana
- {Work-order-1} = the work order for unit C590113-U1

#### SETUP-C590122 — [C590122](https://shopview.testrail.io/index.php?/cases/view/590122) Design: Empty groups, empty columns and no-results pages look as in the design

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "DC-18-tech-technician-chosen-light-1440.png" and "DC-13-tech-search-empty-light-1440.png" attached to this case are open beside it at 100% (actual size). Names, numbers and rank numbers in the pictures are sample data. The pictures' words differ from the ones checked here; compare the look and the place only.
- Technician {Technician-A} is active at {Location-A} with the "Technician" role and leads no work orders. For example: {Technician-A} is ZZAUTOTEST C590122 Sam.
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, "Search" empty, no filter chosen, "Assigned to me" off, density "Regular".
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590122", Last Name "Sam" (shows as "ZZAUTOTEST C590122 Sam").
2.  "ZZAUTOTEST C590122 Sam" must lead no work orders.
3.  **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, density Regular, Search empty.

**Check:** Tech View shows "ZZAUTOTEST C590122 Sam"'s group with "No work orders".

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = ZZAUTOTEST C590122 Sam

#### SETUP-C590127 — [C590127](https://shopview.testrail.io/index.php?/cases/view/590127) Design: The Technician filter sits right after Assigned to me in both views

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design picture "DC-18-tech-technician-chip-open-light-1440.png" attached to this case is open beside it at 100% (actual size). Names, numbers and rank numbers in the pictures are sample data. The picture's Department filter is left out of this release.
- Technician {Technician-A} is active at {Location-A} and leads the Approved work order {Work-order-1} of customer {Customer-A}. For example: {Technician-A} is ZZAUTOTEST C590127 Yan, {Customer-A} is ZZAUTOTEST C590127 Technician Filter and {Work-order-1} is S10043-17850.
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, "Search" empty, no filter chosen, "Assigned to me" off, density "Regular".
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590127", Last Name "Yan" (shows as "ZZAUTOTEST C590127 Yan").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590127 Technician Filter"; units "C590127-U1".
3.  **P-WO** (ACCOUNT-A): Unit "C590127-U1"; customer "ZZAUTOTEST C590127 Technician Filter"; lead "ZZAUTOTEST C590127 Yan".
4.  **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, density Regular, Search empty.

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = ZZAUTOTEST C590127 Yan
- {Customer-A} = ZZAUTOTEST C590127 Technician Filter
- {Work-order-1} = the work order for unit C590127-U1

#### SETUP-N1 — [C614714](https://shopview.testrail.io/index.php?/cases/view/614714) A lead whose Time Clock is turned off keeps a named column that takes no drops

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technician {Technician-A} is active at {Location-A} with the "Technician" role and Time Clock on. It was made for this case only, because this test turns that Time Clock off. For example: {Technician-A} is ZZAUTOTEST N1 Tim.
- Customer {Customer-A} has two Approved work orders: {Work-order-1} led by {Technician-A}, and {Work-order-2} with no lead technician. For example: {Customer-A} is ZZAUTOTEST N1 Time Clock Off, and {Work-order-1} and {Work-order-2} are S10043-17911 and S10043-17912.
- Starting screen: your initials (top right) \> "Settings" \> "Staff", in a browser window at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST N1", Last Name "Tim" (shows as "ZZAUTOTEST N1 Tim").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST N1 Time Clock Off"; units "N1-U1", "N1-U2".
3.  **P-WO** (ACCOUNT-A): Unit "N1-U1"; customer "ZZAUTOTEST N1 Time Clock Off"; lead "ZZAUTOTEST N1 Tim".
4.  **P-WO** (ACCOUNT-A): Unit "N1-U2"; customer "ZZAUTOTEST N1 Time Clock Off"; no lead.
5.  Each run needs "ZZAUTOTEST N1 Tim" with Time Clock ON at the start: turn it back on after the test (Settings \> Staff \> pencil \> Time Clock on) and set N1-U1's lead back to that staff member.
6.  **P-START** (ACCOUNT-A): starting screen: Settings \> Staff page.

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = ZZAUTOTEST N1 Tim
- {Customer-A} = ZZAUTOTEST N1 Time Clock Off
- {Work-order-1} = the work order for unit N1-U1
- {Work-order-2} = the work order for unit N1-U2

#### SETUP-N2 — [C614715](https://shopview.testrail.io/index.php?/cases/view/614715) With no work orders at all, Tech View and Board View show No work orders yet

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role and can switch to location {Location-B}, which has no work orders at all: no work orders, estimates or completed work. For example: {Location-B} is ZZAUTOTEST Empty Location.
- Starting screen: any page, in a browser window at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-EMPTY-LOCATION** (ACCOUNT-A): as described in the procedure table.

**Check:** At "ZZAUTOTEST Empty Location" List shows no work orders.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-B} = ZZAUTOTEST Empty Location (see SETUP-N2)

#### SETUP-N3 — [C614716](https://shopview.testrail.io/index.php?/cases/view/614716) Design: Density and Columns tips show above their buttons, hidden while open

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%.
- Customer {Customer-A} has an Approved work order {Work-order-1}, led by technician {Technician-A}. For example: {Customer-A} is ZZAUTOTEST N3 Tooltips, {Work-order-1} is S10043-17921 and {Technician-A} is ZZAUTOTEST N3 Tia.
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST N3", Last Name "Tia" (shows as "ZZAUTOTEST N3 Tia").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST N3 Tooltips"; units "N3-U1".
3.  **P-WO** (ACCOUNT-A): Unit "N3-U1"; customer "ZZAUTOTEST N3 Tooltips"; lead "ZZAUTOTEST N3 Tia".
4.  **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, Search "ZZAUTOTEST N3 Tooltips".

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Customer-A} = ZZAUTOTEST N3 Tooltips
- {Technician-A} = ZZAUTOTEST N3 Tia
- {Work-order-1} = the work order for unit N3-U1

#### SETUP-N4 — [C614717](https://shopview.testrail.io/index.php?/cases/view/614717) Design: Name bubbles show above row and card avatars, headings keep a plain tip

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Six technicians are active at {Location-A} with the "Technician" role: {Technician-A}, {Technician-B}, {Technician-C}, {Technician-D}, {Technician-E} and {Technician-F}. For example: {Technician-A} to {Technician-F} are ZZAUTOTEST N4 Ana, Ben, Cal, Dee, Eve and Fay.
- Customer {Customer-A} has an Approved work order {Work-order-1}, led by {Technician-A}, with five approved lines whose technicians are {Technician-B} to {Technician-F}, so its avatars end in "+N". Board View's "Fields to display" has "Line technicians" on. For example: {Customer-A} is ZZAUTOTEST N4 Name Bubbles and {Work-order-1} is S10043-17931.
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off, in a browser window at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST N4", Last Name "Ana" (shows as "ZZAUTOTEST N4 Ana").
2.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST N4", Last Name "Ben" (shows as "ZZAUTOTEST N4 Ben").
3.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST N4", Last Name "Cal" (shows as "ZZAUTOTEST N4 Cal").
4.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST N4", Last Name "Dee" (shows as "ZZAUTOTEST N4 Dee").
5.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST N4", Last Name "Eve" (shows as "ZZAUTOTEST N4 Eve").
6.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST N4", Last Name "Fay" (shows as "ZZAUTOTEST N4 Fay").
7.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST N4 Name Bubbles"; units "N4-U1".
8.  **P-WO** (ACCOUNT-A): Unit "N4-U1"; customer "ZZAUTOTEST N4 Name Bubbles"; lead "ZZAUTOTEST N4 Ana".
9.  **P-LINE-TECH** (ACCOUNT-A): Unit "N4-U1"; technicians "ZZAUTOTEST N4 Ben", "ZZAUTOTEST N4 Cal", "ZZAUTOTEST N4 Dee", "ZZAUTOTEST N4 Eve", "ZZAUTOTEST N4 Fay"; five approved lines, one technician each.
10. **P-FIELDS-LINETECHS** (ACCOUNT-A): as described in the procedure table.
11. **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, Search "ZZAUTOTEST N4 Name Bubbles".

**Check:** Every precondition line of the case is true on screen, read top to bottom.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = ZZAUTOTEST N4 Ana
- {Technician-B} = ZZAUTOTEST N4 Ben
- {Technician-C} = ZZAUTOTEST N4 Cal
- {Technician-D} = ZZAUTOTEST N4 Dee
- {Technician-E} = ZZAUTOTEST N4 Eve
- {Technician-F} = ZZAUTOTEST N4 Fay
- {Customer-A} = ZZAUTOTEST N4 Name Bubbles
- {Work-order-1} = the work order for unit N4-U1

#### SETUP-C614719 — [C614719](https://shopview.testrail.io/index.php?/cases/view/614719) First Tab skips a collapsed or empty Unassigned to the first technician

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two technicians are active at {Location-A} with the "Technician" role and Time Clock on: {Technician-A} and {Technician-B}. For example: {Technician-A} is ZZAUTOTEST C614719 Ana and {Technician-B} is ZZAUTOTEST C614719 Ben.
- Customer {Customer-A} has two Approved work orders: {Work-order-1} led by {Technician-A} and {Work-order-2} led by {Technician-B}. Customer {Customer-B} has one Approved work order with no lead technician, {Work-order-3}. Both customer names start with the same text, {Search-A}. For example: {Customer-A} is ZZAUTOTEST C614719 Keyboard A, {Customer-B} is ZZAUTOTEST C614719 Keyboard B, {Search-A} is ZZAUTOTEST C614719 Keyboard, and {Work-order-1} to {Work-order-3} are S10043-17801 to S10043-17803.
- {Technician-A} is pinned first and {Technician-B} second in your Board View, and no other technician is pinned.
- Starting screen: "Work Orders" > "All" tab, "Tech View" shown, {Search-A} in "Search", no filter chosen, "Assigned to me" off, every group expanded, the page freshly opened so nothing has had keyboard focus yet, in a browser window at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C614719", Last Name "Ana" (shows as "ZZAUTOTEST C614719 Ana").
2.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C614719", Last Name "Ben" (shows as "ZZAUTOTEST C614719 Ben").
3.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C614719 Keyboard A"; units "C614719-U1", "C614719-U2".
4.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C614719 Keyboard B"; unit "C614719-U3".
5.  **P-WO** (ACCOUNT-A): Unit "C614719-U1"; customer "ZZAUTOTEST C614719 Keyboard A"; lead "ZZAUTOTEST C614719 Ana".
6.  **P-WO** (ACCOUNT-A): Unit "C614719-U2"; customer "ZZAUTOTEST C614719 Keyboard A"; lead "ZZAUTOTEST C614719 Ben".
7.  **P-WO** (ACCOUNT-A): Unit "C614719-U3"; customer "ZZAUTOTEST C614719 Keyboard B"; no lead.
8.  **P-PIN** (ACCOUNT-A): technicians "ZZAUTOTEST C614719 Ana", "ZZAUTOTEST C614719 Ben".
9.  **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, Search "ZZAUTOTEST C614719 Keyboard", every group expanded. Then reload the page and do not press Tab or click a row before handing over, so nothing has had keyboard focus.

**Check:** Every precondition line of the case is true on screen, read top to bottom. With Search "ZZAUTOTEST C614719 Keyboard", Unassigned holds only the unit C614719-U3 work order; with Search "ZZAUTOTEST C614719 Keyboard A", Unassigned is empty.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = ZZAUTOTEST C614719 Ana
- {Technician-B} = ZZAUTOTEST C614719 Ben
- {Customer-A} = ZZAUTOTEST C614719 Keyboard A
- {Customer-B} = ZZAUTOTEST C614719 Keyboard B
- {Search-A} = ZZAUTOTEST C614719 Keyboard
- {Work-order-1} = the work order for unit C614719-U1
- {Work-order-2} = the work order for unit C614719-U2
- {Work-order-3} = the work order for unit C614719-U3

#### SETUP-C665914 — [C665914](https://shopview.testrail.io/index.php?/cases/view/665914) Design- A long customer name stays inside the dragged card in both views

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technician {Technician-A} is active at {Location-A} with the "Technician" role and Time Clock on. For example: {Technician-A} is ZZAUTOTEST C665914 Ana.
- Customer {Customer-A} has a long name, more than 60 characters, that includes one long word with no spaces. For example: {Customer-A} is ZZAUTOTEST C665914 Superlongunbrokencustomernamewithoutanyspacesforthedragpreview.
- Work order {Work-order-1} for {Customer-A} is Approved and led by {Technician-A}. For example: {Work-order-1} is S10043-17901.
- Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off, in a browser window at least 1024 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C665914", Last Name "Ana" (shows as "ZZAUTOTEST C665914 Ana").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C665914 Superlongunbrokencustomernamewithoutanyspacesforthedragpreview"; unit "C665914-U1".
3.  **P-WO** (ACCOUNT-A): Unit "C665914-U1"; customer "ZZAUTOTEST C665914 Superlongunbrokencustomernamewithoutanyspacesforthedragpreview"; lead "ZZAUTOTEST C665914 Ana".
4.  **P-START** (ACCOUNT-A): starting screen: Board View, All tab, Search "ZZAUTOTEST C665914 Superlong".

**Check:** Every precondition line of the case is true on screen, read top to bottom. The card shows the customer name cut off with "…" (the card itself; the preview box is what the case tests).

**Placeholder values** (the case names records by placeholder; give the tester the real work order number after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = ZZAUTOTEST C665914 Ana
- {Customer-A} = ZZAUTOTEST C665914 Superlongunbrokencustomernamewithoutanyspacesforthedragpreview
- {Work-order-1} = the work order for unit C665914-U1

Known examples already on staging (from SV-11503, not created by this file): S2-36633 and S2-35480.

#### SETUP-C368131 — [C368131](https://shopview.testrail.io/index.php?/cases/view/368131) Pinned technician columns after deactivation or removal from this location

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in as an Admin user (Work orders > View and Create & Edit) at {Location-A}, in a desktop browser window at least 1024 px wide. The company has a second location, {Location-B}. For example: {Location-A} is Staging Heavy Duty - 9919 and {Location-B} is Staging Lethbridge - 4310.
- A second user, {User-B}, whose role has Work orders > View only, is signed in at {Location-A} in a second browser or a private window. For example: {User-B} is ZZAUTOTEST C368131 Viewer.
- Three active technicians work at {Location-A}: {Technician-A}, and {Technician-B} and {Technician-C}, who are made for this case only. {Technician-B} leads no work order. For example: {Technician-A} is Esther Howard, {Technician-B} is ZZAUTOTEST Jenny Pinned and {Technician-C} is ZZAUTOTEST Theresa Pinned.
- Customer {Customer-A} has two Approved work orders, with no shift booked for them on the Schedule: {Work-order-1} led by {Technician-A}, and {Work-order-2} led by {Technician-C}. For example: {Customer-A} is ZZAUTOTEST C368131 Pinned Gone, {Work-order-1} is S10043-17691 and {Work-order-2} is S10043-17692.
- You and {User-B} both have {Technician-B} and {Technician-C} pinned in Board View.
- Starting screen: the Work Orders page with no filter set (nothing ticked in "Status", no choice in "Asset on Site", "Assigned to me" off, "Search" empty).
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A, ACCOUNT-B (view only). **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): {Technician-A}: reuse "Esther Howard" if active at the case location with Time Clock on and a Role other than Office User or Time Clock User; otherwise make one.
2.  **P-TECH** (ACCOUNT-A): {Technician-B}: First Name "ZZAUTOTEST", Last Name "Jenny Pinned". New for every run: the test deactivates it.
3.  **P-TECH** (ACCOUNT-A): {Technician-C}: First Name "ZZAUTOTEST", Last Name "Theresa Pinned", Location {Location-A}. New for every run: the test moves it to {Location-B} (for example Staging Lethbridge - 4310).
4.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C368131 Pinned Gone"; unit "C368131-U1".
5.  **P-WO** (ACCOUNT-A), twice on unit "C368131-U1": {Work-order-1} with lead {Technician-A}; {Work-order-2} with lead {Technician-C}. Book no Schedule shift on either.
6.  ACCOUNT-B: Settings > Roles & Permissions > Create Custom Role > Skip > Role Name "ZZAUTOTEST C368131 View Role" > under Work orders turn on View only > Create. Then Settings > Staff > New Staff Member "ZZAUTOTEST C368131 Viewer" with an email you can open, that role, one Department, Location {Location-A} > Save & Close; accept the invitation and set a password. Quick login signs in only as Admin, so ACCOUNT-B signs in with email and password in a second browser context (password in /tmp only).
7.  **P-PIN** as ACCOUNT-A and again as ACCOUNT-B: pin {Technician-B} and {Technician-C}. Only three pins are allowed: if three are already pinned, unpin one first. Pins are per user.
8.  **P-START** (ACCOUNT-A): the Work Orders page with no filter set (nothing in Status, no Asset on Site choice, Assigned to me off, Search empty).

**Check:** Both users' Board View shows {Technician-B} and {Technician-C} right after Unassigned with filled pins; Search with the customer name shows {Work-order-1} led by {Technician-A} and {Work-order-2} led by {Technician-C}. Clear the search.

**Placeholder values** (give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging); {Location-B} = another location (Staging Lethbridge - 4310 on staging)
- {User-B} = ZZAUTOTEST C368131 Viewer
- {Technician-A} = Esther Howard (or the reused technician)
- {Technician-B} = ZZAUTOTEST Jenny Pinned
- {Technician-C} = ZZAUTOTEST Theresa Pinned
- {Customer-A} = ZZAUTOTEST C368131 Pinned Gone
- {Work-order-1}, {Work-order-2} = the two work orders on unit C368131-U1

**Notes for a Claude session:**

- Staging, 19 Oct 2026 (passed, T3761652): S2-35908 led by Aaa ZZAUTOTEST Tara Lead and S2-35909 led by Aaa ZZAUTOTEST Theresa Pinned.
- Step 3 needs both parts on screen: the Location field change (Save & Close) AND the bin icon in Manage staff enrollments (the Department(s) button on her row). The Location change alone leaves her a technician at {Location-A} (seen 17 Oct 2026); the QA lead decided the two-part step on 19 Oct 2026.
- GET /api/staff rows carry both id and staff_id; the Schedule's staffId and the working-hours calls use staff_id.
- Steps 9 to 12: drag each card onto the target column with Playwright; read the message after step 10 character for character; record where each card ends up.
- Steps 7, 8 and 15: record each header's text and whether it shows a pin, an inactive marker and the empty-column text. Evidence: a screenshot after each step with a result, the build marker, the real value of every placeholder.

#### SETUP-C368167 — [C368167](https://shopview.testrail.io/index.php?/cases/view/368167) A refused lead change on the work order page shows an error, keeps the old lead

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in as an Admin user (Work orders > View and Create & Edit) at {Location-A}, in a desktop browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Two active technicians work at {Location-A}: "Esther Howard" (the expected results name her) and {Technician-B}, who is offered in the work order page's "Lead Technician" list. For example: {Technician-B} is Jenny Wilson.
- Customer {Customer-A}, used by this case only, has work order {Work-order-1}, led by "Esther Howard", with status Complete (all lines complete and reviewed, not invoiced). For example: {Customer-A} is ZZAUTOTEST Refused Lead Change and {Work-order-1} is S2-37327.
- Two tabs of the same browser window are open, tab 1 and tab 2, both signed in as you. Do not sign in again in a private window: a second sign-in can end the first tab's session.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): "Esther Howard" (the expected results name her): reuse if active at the case location with Time Clock on; otherwise make one with this name.
2.  **P-TECH** (ACCOUNT-A): {Technician-B}: any second active technician that the work order page's Lead Technician list offers. That list stops after about 100 names (seen 17 Oct 2026, SV-11393 closed as obsolete but still there), so pick one near the top; Jenny Wilson worked on staging on 19 Oct 2026. Ralph Edwards is NOT offered there.
3.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST Refused Lead Change"; unit "TRK-118" (contact first: Contact and Make are required). If the customer shows Over Limit, raise its credit limit first.
4.  **P-WO-REVIEW** (ACCOUNT-A) on that unit: the line "Service - Full grease service"; Lead Technician "Esther Howard" (only a dropdown once the work order is Approved; it saves at once). If a "Missing Details (1)" step shows on Complete, type a Mileage. "Work order sent to review." appears and the status reads Review.
5.  Click "Mark Reviewed"; if the Mark as reviewed window asks for a VIN, type any 17 characters (for example 1FVACWDT1BDAZ0001) > "Confirm Review". The status reads Complete. Do NOT click Create Invoice: the test does that in step 2.
6.  Open the work order in two tabs of the same browser window (right-click > Open link in new tab). Do not quick-login again in a private window: a second quick-login can end the first tab's session.

**Check:** Reload {Work-order-1}: status Complete, Lead Technician "Esther Howard", and on the Finance tab "Create Invoice" can be clicked.

**Placeholder values** (give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-B} = the second technician picked (Jenny Wilson on staging, 19 Oct 2026)
- {Customer-A} = ZZAUTOTEST Refused Lead Change
- {Work-order-1} = the new Complete work order

**Notes for a Claude session:**

- Staging, 19 Oct 2026 (passed, T3792488): S2-37327, Complete, led by Esther Howard; the refusal read "The lead technician can't be changed once a work order is Invoiced or Paid. Please try to resolve this."
- Step 2: leave New Customer Payment open. Closing it with its X takes the invoice back off and the work order returns to Complete (staging and production, 17 Oct 2026); the QA lead decided on 19 Oct 2026 to leave it open.

#### SETUP-C96936 — [C96936](https://shopview.testrail.io/index.php?/cases/view/96936) A lead changed elsewhere moves the work order to its new group on refresh

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in as an Admin user (Work orders > View and Create & Edit) at {Location-A}, in a desktop browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technicians "Esther Howard" and "Aaron Baker" are active at {Location-A} (the expected results name them, so use these two).
- Customer {Customer-A}, used by this case only, has five Approved work orders: {Work-order-1}, {Work-order-2} and {Work-order-3} led by Esther Howard, and {Work-order-4} and {Work-order-5} led by Aaron Baker. For example: {Customer-A} is ZZAUTOTEST F2 Refresh Lead and {Work-order-1} is S2-35331 (the expected results call it "S1-702").
- Two tabs of the same browser window are open, tab A and tab B, both signed in as you.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): "Esther Howard" and "Aaron Baker" (the expected results name them, keep these names), active at the case location, Time Clock on, Role neither Office User nor Time Clock User, this location in Location. Aaron Baker is used because his name sorts near the top: the work order page's Lead Technician list stops after about 100 names (QA lead's decision, 19 Oct 2026, replacing Ralph Edwards, who is not offered there).
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST F2 Refresh Lead" (if it exists, open it); unit "TRK-118".
3.  **P-WO** (ACCOUNT-A), five times on that unit: {Work-order-1}, {Work-order-2}, {Work-order-3} with lead Esther Howard; {Work-order-4}, {Work-order-5} with lead Aaron Baker. (An Estimate's lead is read-only on the page; give it from Board View: More actions (…) > Reassign lead technician.)
4.  Open a second tab of the same browser window (tab B).

**Check:** Work Orders > All tab > Search "ZZAUTOTEST F2 Refresh Lead" > Tech View: Esther Howard shows 3 and Aaron Baker shows 2. If not, fix the leads first.

**Placeholder values** (give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Customer-A} = ZZAUTOTEST F2 Refresh Lead
- {Work-order-1} = one of Esther Howard's three (the expected results call it "S1-702"; give the tester the real number)
- {Work-order-2} to {Work-order-5} = the other four

**Notes for a Claude session:**

- Staging, 19 Oct 2026 (passed, T3481880): S2-35331, S2-35332, S2-35333 led by Esther Howard; S2-35334, S2-35335 by Aaron Baker; {Work-order-1} = S2-35331.
- Step 5: a work order with no lines opens with a New Line window over it; close it with its X before reaching Lead Technician (seen 17 Oct 2026).

#### SETUP-C682422 — [C682422](https://shopview.testrail.io/index.php?/cases/view/682422) More actions reads Assign lead technician when a work order has no lead

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technician {Technician-A} is active at {Location-A} with the "Technician" role and Time Clock on. For example: {Technician-A} is ZZAUTOTEST C682422 Ana.
- Customer {Customer-A} has two Approved work orders: {Work-order-1} with no lead technician, and {Work-order-2} led by {Technician-A}. For example: {Customer-A} is ZZAUTOTEST C682422 Assign Wording, and {Work-order-1} and {Work-order-2} are S2-37401 and S2-37402.
- Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH**: {Technician-A} "ZZAUTOTEST C682422 Ana".
2.  **P-CUSTOMER**: "ZZAUTOTEST C682422 Assign Wording", unit "C682422-U1".
3.  **P-WO** twice on "C682422-U1": {Work-order-1} with no lead; {Work-order-2} with lead {Technician-A}.
4.  **P-START**: Board View, All tab, Search = the customer name.

**Check:** every precondition line is true on screen.

**Placeholder values:** the names above; give the tester the real work order numbers after setup.

#### SETUP-C682423 — [C682423](https://shopview.testrail.io/index.php?/cases/view/682423) The lead technician dialog offers no Unassigned and assigns on one click

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technicians {Technician-A} and {Technician-B} are active at {Location-A} with the "Technician" role and Time Clock on. For example: {Technician-A} is ZZAUTOTEST C682423 Ana and {Technician-B} is ZZAUTOTEST C682423 Ben.
- Customer {Customer-A} has an Approved work order {Work-order-1} led by {Technician-A}, with no shift booked for it on the Schedule. For example: {Customer-A} is ZZAUTOTEST C682423 One Click and {Work-order-1} is S2-37411.
- Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH**: "ZZAUTOTEST C682423 Ana" and "ZZAUTOTEST C682423 Ben".
2.  **P-CUSTOMER**: "ZZAUTOTEST C682423 One Click", unit "C682423-U1".
3.  **P-WO**: {Work-order-1} with lead {Technician-A}; no Schedule shift.
4.  **P-START**: Board View, All tab, Search = the customer name.

**Check:** every precondition line is true on screen.

**Placeholder values:** the names above; give the tester the real work order numbers after setup.

#### SETUP-C682424 — [C682424](https://shopview.testrail.io/index.php?/cases/view/682424) A lead change message names the work order and technician, with Undo

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technicians {Technician-A} and {Technician-B} are active at {Location-A} with the "Technician" role and Time Clock on. For example: {Technician-A} is ZZAUTOTEST C682424 Ana and {Technician-B} is ZZAUTOTEST C682424 Ben.
- Customer {Customer-A} has three Approved work orders: {Work-order-1} with no lead technician, and {Work-order-2} and {Work-order-3} led by {Technician-A}. None has a shift booked on the Schedule. For example: {Customer-A} is ZZAUTOTEST C682424 Toast Words, and {Work-order-1} to {Work-order-3} are S2-37421 to S2-37423.
- The design picture DC-21-toast-light-1440.png is attached to this case.
- Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH**: "ZZAUTOTEST C682424 Ana" and "ZZAUTOTEST C682424 Ben".
2.  **P-CUSTOMER**: "ZZAUTOTEST C682424 Toast Words", unit "C682424-U1".
3.  **P-WO** three times: {Work-order-1} no lead; {Work-order-2} and {Work-order-3} with lead {Technician-A}; no shifts.
4.  The picture DC-21-toast-light-1440.png is attached to the case (also in `build/wo-board-tech-view/design-look-2026-10-14/compare/`).
5.  **P-START**: Board View, All tab, Search = the customer name.

**Check:** every precondition line is true on screen.

**Placeholder values:** the names above; give the tester the real work order numbers after setup.

#### SETUP-C682425 — [C682425](https://shopview.testrail.io/index.php?/cases/view/682425) The lead change message stays while hovered and closes after 8 seconds

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technicians {Technician-A} and {Technician-B} are active at {Location-A} with the "Technician" role and Time Clock on. For example: {Technician-A} is ZZAUTOTEST C682425 Ana and {Technician-B} is ZZAUTOTEST C682425 Ben.
- Customer {Customer-A} has two Approved work orders, {Work-order-1} and {Work-order-2}, both led by {Technician-A}. Neither has a shift booked on the Schedule. For example: {Customer-A} is ZZAUTOTEST C682425 Toast Timing, and {Work-order-1} and {Work-order-2} are S2-37431 and S2-37432.
- You have a stopwatch, for example on your phone.
- Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH**: "ZZAUTOTEST C682425 Ana" and "ZZAUTOTEST C682425 Ben".
2.  **P-CUSTOMER**: "ZZAUTOTEST C682425 Toast Timing", unit "C682425-U1".
3.  **P-WO** twice, both with lead {Technician-A}; no shifts.
4.  Timing: measure the close with the page clock (performance.now) or a recorded video; 8 s per S4-R16.
5.  **P-START**: Board View, All tab, Search = the customer name.

**Check:** every precondition line is true on screen.

**Placeholder values:** the names above; give the tester the real work order numbers after setup.

#### SETUP-C682426 — [C682426](https://shopview.testrail.io/index.php?/cases/view/682426) Undo puts the work order back with its old lead and in its old place

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technicians {Technician-A} and {Technician-B} are active at {Location-A} with the "Technician" role and Time Clock on. For example: {Technician-A} is ZZAUTOTEST C682426 Ana and {Technician-B} is ZZAUTOTEST C682426 Ben.
- Customer {Customer-A} has three Approved work orders led by {Technician-A}, shown in that column in this order from the top: {Work-order-1}, {Work-order-2}, {Work-order-3}. It also has an Approved work order {Work-order-4} with no lead technician. None has a shift booked on the Schedule. For example: {Customer-A} is ZZAUTOTEST C682426 Undo Place, and {Work-order-1} to {Work-order-4} are S2-37441 to S2-37444.
- Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH**: "ZZAUTOTEST C682426 Ana" and "ZZAUTOTEST C682426 Ben".
2.  **P-CUSTOMER**: "ZZAUTOTEST C682426 Undo Place", unit "C682426-U1".
3.  **P-WO** three times with lead {Technician-A}, then drag them in Board View into the order {Work-order-1}, {Work-order-2}, {Work-order-3}; **P-WO** once more with no lead ({Work-order-4}).
4.  Audit Log: open the work order, ⋮ (top right, next to New Line) > Audit Log > Work Order Log, entries "Lead tech changed".
5.  **P-START**: Board View, All tab, Search = the customer name.

**Check:** every precondition line is true on screen.

**Placeholder values:** the names above; give the tester the real work order numbers after setup.

#### SETUP-C682427 — [C682427](https://shopview.testrail.io/index.php?/cases/view/682427) Undo brings back the shifts that a lead change cleared

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technicians {Technician-A} and {Technician-B} are active at {Location-A} with the "Technician" role and Time Clock on. For example: {Technician-A} is ZZAUTOTEST C682427 Ana and {Technician-B} is ZZAUTOTEST C682427 Ben.
- Customer {Customer-A} has an Approved work order {Work-order-1} with one approved line, led by {Technician-A}. For example: {Customer-A} is ZZAUTOTEST C682427 Undo Shifts and {Work-order-1} is S2-37451.
- On the Schedule, {Technician-A} has two "Entire work order" shifts on {Work-order-1}: {Shift-A} today, which started an hour ago and ends later today, and {Shift-B} tomorrow. For example: {Shift-A} is today 9:00 to 15:00 and {Shift-B} is tomorrow 8:00 to 12:00.
- Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH**: "ZZAUTOTEST C682427 Ana" and "ZZAUTOTEST C682427 Ben".
2.  **P-CUSTOMER**: "ZZAUTOTEST C682427 Undo Shifts", unit "C682427-U1".
3.  **P-WO** with one approved line, lead {Technician-A}.
4.  Schedule: drag the work order onto {Technician-A}'s row, choose "Entire work order": {Shift-A} today starting an hour ago and ending later today; {Shift-B} tomorrow 8:00 to 12:00. UNVERIFIED: whether the Schedule accepts a start time in the past; if not, book {Shift-A} to start a few minutes from now and run the test once it has started.
5.  **P-START**: Board View, All tab, Search = the customer name.

**Check:** every precondition line is true on screen.

**Placeholder values:** the names above; give the tester the real work order numbers after setup.

#### SETUP-C682428 — [C682428](https://shopview.testrail.io/index.php?/cases/view/682428) Undo cannot move back a work order that was invoiced in the meantime

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technicians {Technician-A} and {Technician-B} are active at {Location-A} with the "Technician" role and Time Clock on. For example: {Technician-A} is ZZAUTOTEST C682428 Ana and {Technician-B} is ZZAUTOTEST C682428 Ben.
- Customer {Customer-A} has a work order {Work-order-1} led by {Technician-A}, with status Complete (all lines complete and reviewed, not invoiced) and no shift booked on the Schedule. For example: {Customer-A} is ZZAUTOTEST C682428 Undo Invoiced and {Work-order-1} is S2-37461.
- Two browser windows are open side by side, both signed in as you: window 1 on the starting screen below, window 2 on {Work-order-1}'s "Finance" tab.
- Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH**: "ZZAUTOTEST C682428 Ana" and "ZZAUTOTEST C682428 Ben".
2.  **P-CUSTOMER**: "ZZAUTOTEST C682428 Undo Invoiced", unit "C682428-U1" (raise the credit limit if Over Limit).
3.  **P-WO-REVIEW** with lead {Technician-A}, then "Mark Reviewed" (status Complete); do not invoice.
4.  Two browser contexts of the same sign-in side by side; window 2 on the work order's Finance tab. Leave New Customer Payment open after Create Invoice (closing it with X takes the invoice back off). The Undo must be clicked within the toast's 8 seconds.
5.  **P-START**: Board View, All tab, Search = the customer name.

**Check:** every precondition line is true on screen.

**Placeholder values:** the names above; give the tester the real work order numbers after setup.

#### SETUP-C682437 — [C682437](https://shopview.testrail.io/index.php?/cases/view/682437) Releasing a dragged technician header over a row opens no work order

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technicians {Technician-A}, {Technician-B} and {Technician-C} are active at {Location-A}; {Technician-A} and {Technician-B} are pinned in your views, {Technician-C} is not. For example: ZZAUTOTEST C682437 Ana, ZZAUTOTEST C682437 Ben and ZZAUTOTEST C682437 Cy.
- Each of them leads one Approved work order: {Work-order-1} ({Technician-A}), {Work-order-2} ({Technician-B}) and {Work-order-3} ({Technician-C}). For example: customer ZZAUTOTEST C682437 Header Drag.
- Starting screen: "Work Orders" > "All" tab, "Tech View" shown, every group expanded, "Search" empty.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  P-TECH ×3 (Ana, Ben, Cy with the case number), P-PIN Ana and Ben (P-UNPIN-ALL first), P-WO one per technician (customer "ZZAUTOTEST C682437 Header Drag").
2.  Drag with Playwright mouse down/move/up on the group header (the whole header drags, S9-R1a); after release record page URL and title: it must still be Work Orders.

**Check:** every precondition line is true on screen.

#### SETUP-C682438 — [C682438](https://shopview.testrail.io/index.php?/cases/view/682438) On a Board View card, a focused avatar shows the technician's name

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technicians {Technician-A} and {Technician-B} are active at {Location-A}, and "Line technicians" is on in Board View's "Fields to display". For example: ZZAUTOTEST C682438 Ana and ZZAUTOTEST C682438 Ben.
- Customer {Customer-A} has an Approved work order {Work-order-1} led by {Technician-A}, with {Technician-B} on one of its lines. For example: {Customer-A} is ZZAUTOTEST C682438 Avatar Keys.
- Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", nothing focused yet.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  P-TECH Ana and Ben, P-FIELDS-LINETECHS, P-CUSTOMER "ZZAUTOTEST C682438 Avatar Keys", P-WO lead Ana, P-LINE-TECH Ben.
2.  Keyboard only after the click in Search; record each focused element's accessible name and the bubble text.

**Check:** every precondition line is true on screen.

#### SETUP-C682439 — [C682439](https://shopview.testrail.io/index.php?/cases/view/682439) Design- In the Dark theme, Board View column scrollbars are thin and dark

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- The app is in the dark theme.
- At least one technician column at {Location-A} holds more work orders than fit on screen, so it scrolls. For example: Unassigned at Staging Heavy Duty - 9919.
- Starting screen: "Work Orders" > "All" tab, "Board View" shown, in a window 1440 px wide.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  Switch the user to the dark theme (initials > theme). Use Unassigned at Staging Heavy Duty - 9919 (it holds far more cards than fit).
2.  Capture the column's computed scrollbar-color/scrollbar-width and a screenshot of the right edge.

**Check:** every precondition line is true on screen.

#### SETUP-C682440 — [C682440](https://shopview.testrail.io/index.php?/cases/view/682440) Design- At Compact, count bubbles leave the Tech View status name readable

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Work order {Work-order-1} at {Location-A} is Ready For Review and has open service and parts actions, so its status pill shows a red and a blue count. For example: {Work-order-1} is S2-33351.
- Starting screen: "Work Orders" > "All" tab, "List" shown, the number of {Work-order-1} in "Search", in a window 1440 px wide at 100% zoom.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  Use work order S2-33351 on staging (from SV-11467; see SETUP-C682420 step 2). On another environment there is no recorded way in this repository to create a work order with a red and a blue count: ask the user for one, or mark the test Blocked: "setup not done".
2.  Screenshot the pill at each density next to List's pill.

**Check:** every precondition line is true on screen.

#### SETUP-C682429 — [C682429](https://shopview.testrail.io/index.php?/cases/view/682429) Design- Lead menu reads Assign Tech and Reassign Lead Tech (design's version)

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technician {Technician-A} is active at {Location-A} with the "Technician" role and Time Clock on. For example: {Technician-A} is ZZAUTOTEST C682429 Ana.
- Customer {Customer-A} has two Approved work orders: {Work-order-1} with no lead technician and {Work-order-2} led by {Technician-A}. For example: {Customer-A} is ZZAUTOTEST C682429 Design Labels.
- Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  Make the named records with the P- procedures (names carry the case number); this is a held design-version case: do not run it until the QA lead releases it.

**Check:** every precondition line is true on screen.

#### SETUP-C682430 — [C682430](https://shopview.testrail.io/index.php?/cases/view/682430) Design- Lead change messages, Assignment undone, 2.6 s close (design's version)

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technicians {Technician-A} and {Technician-B} are active at {Location-A} with the "Technician" role and Time Clock on. For example: ZZAUTOTEST C682430 Ana and ZZAUTOTEST C682430 Ben.
- Customer {Customer-A} has three Approved work orders led by {Technician-A}: {Work-order-1}, {Work-order-2} with {Technician-B} on one of its lines, and {Work-order-3}. None has a shift on the Schedule. For example: {Customer-A} is ZZAUTOTEST C682430 Design Messages.
- You have a stopwatch, for example on your phone.
- Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  Make the named records with the P- procedures (names carry the case number); this is a held design-version case: do not run it until the QA lead releases it.

**Check:** every precondition line is true on screen.

#### SETUP-C682431 — [C682431](https://shopview.testrail.io/index.php?/cases/view/682431) Design- Locked work orders show short notes, Declined locked (design's version)

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technicians {Technician-A} and {Technician-B} are active at {Location-A} with the "Technician" role and Time Clock on. For example: ZZAUTOTEST C682431 Ana and ZZAUTOTEST C682431 Ben.
- Customer {Customer-A} has four work orders led by {Technician-A}: {Work-order-1} Invoiced, {Work-order-2} Declined, {Work-order-3} Imported, and {Work-order-4} Approved. For example: {Customer-A} is ZZAUTOTEST C682431 Design Locks.
- A second user, {User-B}, whose role has Work orders > View only, is signed in at {Location-A} in a second browser on the same starting screen. For example: {User-B} is ZZAUTOTEST C682431 Viewer.
- Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A, ACCOUNT-B. **Run first:** SETUP-ADMIN.

1.  Make the named records with the P- procedures (names carry the case number); this is a held design-version case: do not run it until the QA lead releases it.

**Check:** every precondition line is true on screen.

#### SETUP-C682432 — [C682432](https://shopview.testrail.io/index.php?/cases/view/682432) Design- Up to five technicians can be pinned, pin messages (design's version)

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Six technicians are active at {Location-A}: {Technician-A}, {Technician-B}, {Technician-C}, {Technician-D}, {Technician-E} and {Technician-F}. None is pinned in your Board View. For example: ZZAUTOTEST C682432 Ana to ZZAUTOTEST C682432 Fay.
- Starting screen: "Work Orders" > "All" tab, "Board View" shown, "Search" empty.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  Make the named records with the P- procedures (names carry the case number); this is a held design-version case: do not run it until the QA lead releases it.

**Check:** every precondition line is true on screen.

#### SETUP-C682433 — [C682433](https://shopview.testrail.io/index.php?/cases/view/682433) Design- Row height in Tech View, Card size in Board View (design's version)

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Starting screen: "Work Orders" > "All" tab, "Tech View" shown, "Search" empty, no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  Make the named records with the P- procedures (names carry the case number); this is a held design-version case: do not run it until the QA lead releases it.

**Check:** every precondition line is true on screen.

#### SETUP-C682434 — [C682434](https://shopview.testrail.io/index.php?/cases/view/682434) Design- Empty Tech View group reads No work orders assigned (design's version)

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technicians {Technician-A} and {Technician-B} are active at {Location-A}, and {Technician-A} is pinned in your views. For example: ZZAUTOTEST C682434 Ana and ZZAUTOTEST C682434 Ben.
- Customer {Customer-A} has one Approved work order, {Work-order-1}, led by {Technician-B}. For example: {Customer-A} is ZZAUTOTEST C682434 Design Empty.
- Starting screen: "Work Orders" > "All" tab, "Tech View" shown, "Search" empty, no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  Make the named records with the P- procedures (names carry the case number); this is a held design-version case: do not run it until the QA lead releases it.

**Check:** every precondition line is true on screen.

#### SETUP-C682435 — [C682435](https://shopview.testrail.io/index.php?/cases/view/682435) Design- Search opens a closed group, N open counts all cards (design's version)

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technician {Technician-A} is active at {Location-A} with the "Technician" role and Time Clock on. For example: {Technician-A} is ZZAUTOTEST C682435 Ana.
- {Technician-A} leads exactly three work orders at {Location-A}: {Work-order-1} Approved, {Work-order-2} an Estimate and {Work-order-3} Declined. For example: customer ZZAUTOTEST C682435 Design Count.
- Starting screen: "Work Orders" > "All" tab, "Tech View" shown, "Search" empty, no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  Make the named records with the P- procedures (names carry the case number); this is a held design-version case: do not run it until the QA lead releases it.

**Check:** every precondition line is true on screen.

#### SETUP-C682436 — [C682436](https://shopview.testrail.io/index.php?/cases/view/682436) Design- No technicians yet and Nothing here yet in both views

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role, in a browser window at least 1024 px wide.
- Location {Location-B} has work orders but no technicians. For example: ZZAUTOTEST Location No Techs.
- Location {Location-C} has no technicians and no work orders. For example: ZZAUTOTEST Location Empty.
- You can change location to {Location-B} and {Location-C}.
- User {User-B} can open Work Orders at {Location-B}, and their role does not have the permission "Settings → App". For example: ZZAUTOTEST C682436 Viewer, with a custom role that has only Work orders View.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A, ACCOUNT-B. **Run first:** SETUP-ADMIN. Released 19 Oct 2026 on PRD v68 S1-N1d (Chris Ward, answer 16; QA lead go-ahead).

1.  {Location-B} and {Location-C}: **UNVERIFIED, no recorded path** (same as P-EMPTY-LOCATION): there is no proven way in this repository to create a location, or to make one with work orders but no technicians. Ask the user for two such locations and record their names; until then the test is Blocked: "setup not done".
2.  {User-B}: **P-VIEWONLY**, naming the role and the user "ZZAUTOTEST C682436 Viewer", with location {Location-B}. That role ticks only Work orders View, so it does not have "Settings → App".
3.  ACCOUNT-A needs "Settings → App" for the Add Technician button: the system "Admin" role has full access (section 2).

**Check:** at {Location-B}, List shows work orders and Settings > Staff lists no technician for that location; at {Location-C}, List shows no work orders. Not re-checked by the session that wrote this recipe (19 Oct 2026).

#### SETUP-C682420 — [C682420](https://shopview.testrail.io/index.php?/cases/view/682420) Design- Tech View count bubbles sit on the status label as in List, any density

**Satisfies these precondition lines, exactly as the case states them** (this case is still in the older layout: it has no placeholders and no setup-file link):

- Sign in as an Owner/Admin user (on staging or a QA branch: the Admin quick-login button on the sign-in page; you appear as "Admin ShopView"). Browser zoom 100%. Window about 1600 px wide.
- Location "Staging Heavy Duty - 9919" (shown in the top bar next to the bell). To change it: click your initials at the top right > Change Location.
- Work order S2-33351 has the status "Ready For Review" with a red number and a blue number on its status pill. (On another environment use any work order whose status pill shows both a red and a blue number.)

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN. The case says "no setup": it creates no records.

1.  **P-SIGNIN** and **P-LOCATION** ("Staging Heavy Duty - 9919"). Set the window to about 1600 px wide at 100% zoom (the case's own line; ticket SV-11467 used the same).
2.  Use work order **S2-33351** on staging. Where this comes from: ticket SV-11467 (Story Defect, "Found while testing SV-11318") names it, shows its Ready For Review pill with a red 2 and a blue 3, and opens it with https://app.staging.shopview.com/workorders?search=S2-33351 (tested on staging build v26.40.19-754919e, 16 Oct 2026). The case was last checked against staging build v26.40.19-c850386 on 19 Oct 2026, and its test in run 498 (T4054407) is marked Passed.
3.  On another environment there is **no recorded way** in this repository to create a work order with a red service-actions count and a blue parts-actions count. Do not invent one: ask the user for a work order whose pill shows both numbers, or mark the test Blocked: "setup not done".

**Check:** List with "S2-33351" in Search shows its status pill reading "Ready For Review" with a red and a blue number on it. Not re-checked by the session that wrote this recipe (19 Oct 2026).

#### SETUP-C682445 — [C682445](https://shopview.testrail.io/index.php?/cases/view/682445) Two people reorder one column at once and each moved card keeps its place

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A} in two separate browsers (for example Chrome and a Chrome private window), each window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technician {Technician-A} is active at {Location-A}. For example: ZZAUTOTEST C682445 Ana.
- Customer {Customer-A} has three Approved work orders led by {Technician-A}, and in Board View {Technician-A}'s column lists them in this order: {Work-order-1}, {Work-order-2}, {Work-order-3}. For example: {Customer-A} is ZZAUTOTEST C682445 Two People, and the work orders are S2-37378, S2-37380 and S2-37377.
- Starting screen, in both browsers: "Work Orders" > "All" tab, "Board View" shown.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A twice (two browsers; SV-11119 used two Admin sign-ins, one in a private window). **Run first:** SETUP-ADMIN.

1.  **P-TECH**: "ZZAUTOTEST C682445 Ana".
2.  **P-CUSTOMER**: "ZZAUTOTEST C682445 Two People", units "C682445-U1", "C682445-U2", "C682445-U3".
3.  **P-WO** three times, one per unit, each with lead {Technician-A}: {Work-order-1}, {Work-order-2}, {Work-order-3}.
4.  In one browser, Board View with the customer's name in Search: drag the cards in {Technician-A}'s column until they read {Work-order-1}, {Work-order-2}, {Work-order-3} (the order is saved for the location, PRD S9-R11). Refresh to confirm.
5.  Sign in as ACCOUNT-A in a second browser (P-SIGNIN), then **P-START** in both: "All" tab, Board View, Search empty.

**Check:** both browsers, after searching the customer, show {Technician-A}'s column as {Work-order-1}, {Work-order-2}, {Work-order-3}.

**Placeholder values:** give the tester the three real work order numbers after setup.

#### SETUP-C682446 — [C682446](https://shopview.testrail.io/index.php?/cases/view/682446) Moving a timesheet entry to another line takes you off the old line

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technician {Technician-A} is active at {Location-A}. For example: ZZAUTOTEST C682446 Ana.
- Work order {Work-order-1} at {Location-A} has two Approved lines, {Line-1} and {Line-2}, each with {Technician-A} under Labor, and you are not under Labor on either line. For example: {Work-order-1} is S10043-18489, {Line-1} is "Service - Cabin air filter" and {Line-2} is "Replace - Suspension air bag".
- You are not clocked in to any line.
- Starting screen: the work order page of {Work-order-1}, "Lines" tab.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH**: "ZZAUTOTEST C682446 Ana".
2.  **P-CUSTOMER**: "ZZAUTOTEST C682446 Timesheet Move", unit "C682446-U1".
3.  **P-WO** on "C682446-U1" (one approved line, {Line-1}), then on the Lines tab add a second approved line ({Line-2}) the same way.
4.  **P-LINE-TECH**: put {Technician-A} on both lines (Edit Line > Technicians). Do not add ACCOUNT-A to either line.
5.  Make sure ACCOUNT-A is not clocked in anywhere (the case's own Clock Out flow, SV-11087's steps).

**Check:** the Lines tab shows {Technician-A} under Labor on both lines and ACCOUNT-A on neither.

**Notes from SV-11087 (developer and QA comments, 14 Oct 2026):** the fix ships in the bugfix release (PR #3619), not with SV-10043; labor rows that existed before the fix count as deliberate and are never removed, so use records made after the fix reached the site. The ticket's own example S10043-18489 is on the QA site sv10043.

## 5. Mapping table (execution order)

| Test case                                                                                                                                             | Account slots        | Recipes in order                          |
|-------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|-------------------------------------------|
| [C97021](https://shopview.testrail.io/index.php?/cases/view/97021) Tab enters each view once and the arrow keys move between cards and rows           | ACCOUNT-A            | SETUP-ADMIN, SETUP-C97021                 |
| [C368150](https://shopview.testrail.io/index.php?/cases/view/368150) Enter opens the focused card or row, and no key drags it                         | ACCOUNT-A            | SETUP-ADMIN, SETUP-C368150                |
| [C368152](https://shopview.testrail.io/index.php?/cases/view/368152) Reassign and Unassign work from the keyboard through the More actions menu       | ACCOUNT-A            | SETUP-ADMIN, SETUP-C368152                |
| [C97020](https://shopview.testrail.io/index.php?/cases/view/97020) The keyboard cannot get around permission or status limits                         | ACCOUNT-A, ACCOUNT-B | SETUP-ADMIN, SETUP-VIEWONLY, SETUP-C97020 |
| [C96945](https://shopview.testrail.io/index.php?/cases/view/96945) A card's More actions menu appears on hover or focus and offers Reassign           | ACCOUNT-A            | SETUP-ADMIN, SETUP-C96945                 |
| [C614711](https://shopview.testrail.io/index.php?/cases/view/614711) Work orders of a deleted lead sit under Deleted technician, which takes no drops | ACCOUNT-A            | SETUP-ADMIN, SETUP-C614711                |
| [C96916](https://shopview.testrail.io/index.php?/cases/view/96916) Browser Back restores scroll, tab and filters in Tech View and Board View          | ACCOUNT-A            | SETUP-ADMIN, SETUP-C96916                 |
| [C368214](https://shopview.testrail.io/index.php?/cases/view/368214) After Back and Forward the List keeps its tab, search and filters                | ACCOUNT-A            | SETUP-ADMIN, SETUP-C368214                |
| [C590110](https://shopview.testrail.io/index.php?/cases/view/590110) Design: The view buttons, filter and search icons look as in the design      | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590110                |
| [C590112](https://shopview.testrail.io/index.php?/cases/view/590112) Design: Tech View table fills the full width and Status fits its labels  | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590112                |
| [C590114](https://shopview.testrail.io/index.php?/cases/view/590114) Design: Tech View rows show a blue number, a thin progress bar and an avatar | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590114                |
| [C590117](https://shopview.testrail.io/index.php?/cases/view/590117) Design: Tech View headings show handle, arrow, avatar, name, pin and count            | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590117                |
| [C590119](https://shopview.testrail.io/index.php?/cases/view/590119) Design: Board View column headings show handle, avatar, name, pin and count     | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590119                |
| [C590128](https://shopview.testrail.io/index.php?/cases/view/590128) Design: Density changes Tech View row, avatar and bar sizes, not card avatars      | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590128                |
| [C590113](https://shopview.testrail.io/index.php?/cases/view/590113) Design: Tech View opens with 13 columns and small grey column headings              | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590113                |
| [C590122](https://shopview.testrail.io/index.php?/cases/view/590122) Design: Empty groups, empty columns and no-results pages look as in the design                | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590122                |
| [C590127](https://shopview.testrail.io/index.php?/cases/view/590127) Design: The Technician filter sits right after Assigned to me in both views          | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590127                |
| [C614714](https://shopview.testrail.io/index.php?/cases/view/614714) A lead whose Time Clock is turned off keeps a named column that takes no drops   | ACCOUNT-A            | SETUP-ADMIN, SETUP-N1                     |
| [C614715](https://shopview.testrail.io/index.php?/cases/view/614715) With no work orders at all, Tech View and Board View show No work orders yet     | ACCOUNT-A            | SETUP-ADMIN, SETUP-N2                     |
| [C614716](https://shopview.testrail.io/index.php?/cases/view/614716) Design: Density and Columns tips show above their buttons, hidden while open         | ACCOUNT-A            | SETUP-ADMIN, SETUP-N3                     |
| [C614717](https://shopview.testrail.io/index.php?/cases/view/614717) Design: Name bubbles show above row and card avatars, headings keep a plain tip      | ACCOUNT-A            | SETUP-ADMIN, SETUP-N4                     |
| [C614719](https://shopview.testrail.io/index.php?/cases/view/614719) First Tab skips a collapsed or empty Unassigned to the first technician | ACCOUNT-A | SETUP-ADMIN, SETUP-C614719 |
| [C665914](https://shopview.testrail.io/index.php?/cases/view/665914) Design- A long customer name stays inside the dragged card in both views | ACCOUNT-A | SETUP-ADMIN, SETUP-C665914 |
| [C368131](https://shopview.testrail.io/index.php?/cases/view/368131) Pinned technician columns after deactivation or removal from this location | ACCOUNT-A, ACCOUNT-B | SETUP-ADMIN, SETUP-C368131 |
| [C368167](https://shopview.testrail.io/index.php?/cases/view/368167) A refused lead change on the work order page shows an error, keeps the old lead | ACCOUNT-A | SETUP-ADMIN, SETUP-C368167 |
| [C96936](https://shopview.testrail.io/index.php?/cases/view/96936) A lead changed elsewhere moves the work order to its new group on refresh | ACCOUNT-A | SETUP-ADMIN, SETUP-C96936 |
| [C682422](https://shopview.testrail.io/index.php?/cases/view/682422) More actions reads Assign lead technician when a work order has no lead | ACCOUNT-A | SETUP-ADMIN, SETUP-C682422 |
| [C682423](https://shopview.testrail.io/index.php?/cases/view/682423) The lead technician dialog offers no Unassigned and assigns on one click | ACCOUNT-A | SETUP-ADMIN, SETUP-C682423 |
| [C682424](https://shopview.testrail.io/index.php?/cases/view/682424) A lead change message names the work order and technician, with Undo | ACCOUNT-A | SETUP-ADMIN, SETUP-C682424 |
| [C682425](https://shopview.testrail.io/index.php?/cases/view/682425) The lead change message stays while hovered and closes after 8 seconds | ACCOUNT-A | SETUP-ADMIN, SETUP-C682425 |
| [C682426](https://shopview.testrail.io/index.php?/cases/view/682426) Undo puts the work order back with its old lead and in its old place | ACCOUNT-A | SETUP-ADMIN, SETUP-C682426 |
| [C682427](https://shopview.testrail.io/index.php?/cases/view/682427) Undo brings back the shifts that a lead change cleared | ACCOUNT-A | SETUP-ADMIN, SETUP-C682427 |
| [C682428](https://shopview.testrail.io/index.php?/cases/view/682428) Undo cannot move back a work order that was invoiced in the meantime | ACCOUNT-A | SETUP-ADMIN, SETUP-C682428 |
| [C682437](https://shopview.testrail.io/index.php?/cases/view/682437) Releasing a dragged technician header over a row opens no work order | ACCOUNT-A | SETUP-ADMIN, SETUP-C682437 |
| [C682438](https://shopview.testrail.io/index.php?/cases/view/682438) On a Board View card, a focused avatar shows the technician's name | ACCOUNT-A | SETUP-ADMIN, SETUP-C682438 |
| [C682439](https://shopview.testrail.io/index.php?/cases/view/682439) Design- In the Dark theme, Board View column scrollbars are thin and dark | ACCOUNT-A | SETUP-ADMIN, SETUP-C682439 |
| [C682440](https://shopview.testrail.io/index.php?/cases/view/682440) Design- At Compact, count bubbles leave the Tech View status name readable | ACCOUNT-A | SETUP-ADMIN, SETUP-C682440 |
| [C682420](https://shopview.testrail.io/index.php?/cases/view/682420) Design- Tech View count bubbles sit on the status label as in List, any density | ACCOUNT-A | SETUP-ADMIN, SETUP-C682420 |
| [C682445](https://shopview.testrail.io/index.php?/cases/view/682445) Two people reorder one column at once and each moved card keeps its place | ACCOUNT-A (two browsers) | SETUP-ADMIN, SETUP-C682445 |
| [C682446](https://shopview.testrail.io/index.php?/cases/view/682446) Moving a timesheet entry to another line takes you off the old line | ACCOUNT-A | SETUP-ADMIN, SETUP-C682446 |
| [C682429](https://shopview.testrail.io/index.php?/cases/view/682429) Design- Lead menu reads Assign Tech and Reassign Lead Tech (design's version) | ACCOUNT-A | SETUP-ADMIN, SETUP-C682429 |
| [C682430](https://shopview.testrail.io/index.php?/cases/view/682430) Design- Lead change messages, Assignment undone, 2.6 s close (design's version) | ACCOUNT-A | SETUP-ADMIN, SETUP-C682430 |
| [C682431](https://shopview.testrail.io/index.php?/cases/view/682431) Design- Locked work orders show short notes, Declined locked (design's version) | ACCOUNT-A | SETUP-ADMIN, SETUP-C682431 |
| [C682432](https://shopview.testrail.io/index.php?/cases/view/682432) Design- Up to five technicians can be pinned, pin messages (design's version) | ACCOUNT-A | SETUP-ADMIN, SETUP-C682432 |
| [C682433](https://shopview.testrail.io/index.php?/cases/view/682433) Design- Row height in Tech View, Card size in Board View (design's version) | ACCOUNT-A | SETUP-ADMIN, SETUP-C682433 |
| [C682434](https://shopview.testrail.io/index.php?/cases/view/682434) Design- Empty Tech View group reads No work orders assigned (design's version) | ACCOUNT-A | SETUP-ADMIN, SETUP-C682434 |
| [C682435](https://shopview.testrail.io/index.php?/cases/view/682435) Design- Search opens a closed group, N open counts all cards (design's version) | ACCOUNT-A | SETUP-ADMIN, SETUP-C682435 |
| [C682436](https://shopview.testrail.io/index.php?/cases/view/682436) Design- No technicians yet and Nothing here yet in both views | ACCOUNT-A, ACCOUNT-B | SETUP-ADMIN, SETUP-VIEWONLY, SETUP-C682436 |

## 6. Dependencies and shared fixtures

- SETUP-ADMIN runs first, once per session. SETUP-VIEWONLY runs before SETUP-C97020.
- Every case owns its records (names carry the case number), so no record is shared between cases and the cases can run in any order.
- The P- procedures are shared click paths, used with each recipe's own values.

## 7. Reset and cleanup

- Name everything with ZZAUTOTEST at the start; leave ZZAUTOTEST records in place (they are marked as test data).
- **SETUP-C614711**: Deletes "ZZAUTOTEST C614711 Dana": before the next run make a new staff member with the same name (P-TECH) and set that staff member as lead of C614711-U1 again (C614711-U1 ends on "ZZAUTOTEST C614711 Eli").
- **SETUP-N1**: Turns Time Clock off and removes the lead: turn Time Clock back on for "ZZAUTOTEST N1 Tim" and set that staff member as N1-U1's lead.
- **SETUP-C368152**: Moves C368152-U1 to Ben and C368152-U3 to Unassigned: set the leads back (U1 Ana, U3 Ben) before the next run.
- **SETUP-C590117**: Pins and unpins inside the test; ends with no pin.
- **SETUP-C590119**: Pins and unpins inside the test; ends with no pin.
- Every other recipe is safe to re-run: reuse a record that already exists with exactly the same name and state.
- **SETUP-C368131**: Steps 1 to 3 spend {Technician-B} (deactivated) and {Technician-C} (moved to {Location-B}): make two new technicians before the next run (keep ZZAUTOTEST at the start), pin them for both users and give {Work-order-2} the new {Technician-C}. Step 12 moves {Work-order-2} to Unassigned.
- **SETUP-C368167**: Step 2 invoices {Work-order-1}: make a new Complete work order (same recipe) before the next run.
- **SETUP-C96936**: Step 5 moves {Work-order-1} to Aaron Baker: set its lead back to Esther Howard before the next run.
- **SETUP-C682422 to SETUP-C682428**: each run moves leads (and C682427 clears and restores shifts, C682428 invoices its work order): make new work orders before the next run.

## 8. Traceability

Every expected result in the cases comes from the sentence quoted against its step. The quotes are word for word; a checker (build_check.py) refuses any case whose quote is not found verbatim in its source.

### [C97021](https://shopview.testrail.io/index.php?/cases/view/97021) Tab enters each view once and the arrow keys move between cards and rows

PRD v55/v60/v61 S11-R1 and S11-R3: each view is one Tab stop landing on a work order, arrow keys move between cards, rows, headers and columns, Tab then reaches the focused item's own controls and leaves the view (was: Tab on every card, row and header).

- Steps 2, 9 — **S11-R1** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “Each view is a single Tab stop. Tab lands on one work order row (Tech View) or card (Board View), the one last focused, or, when none has been, the first work order shown in on-screen order: the first row or card in Unassigned, or the first technician’s first row or card when Unassigned is collapsed or empty (never a group or column header while a work order is shown; when every group is collapsed, Tab lands on the first group header; after the user arrows onto a header and tabs out and back in, Tab returns to a work order row while any row is shown; on Board View, if the last-focused card has scrolled out of view in its column, Tab lands on the first card in view); the focused row or card shows a visible focus ring.”
- Steps 3, 4, 5, 6, 10 — **S11-R3** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Inside a view the arrow keys move focus: Up and Down move between rows and group headers in Tech View, and between cards and the column header within a Board View column; Left and Right move between Board View columns. Tab from a focused row, card or header reaches its own controls (more actions, pin, collapse) in order, then leaves the view. Tab never stops on every row.”
- Steps 7 — **S2-R17** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Tech View orders pinned technicians the same way as Board View: after the fixed Unassigned group and before unpinned technicians, each newly pinned technician after the existing pins (S3-R15, S3-R16).”
- Steps 7 — **S2-R2** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Keep Unassigned, containing work orders without a lead technician, fixed before all technician groups.”
- Steps all — **Story 11 user story** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “As a keyboard user, I want to navigate work orders and their actions so that these controls are usable without a mouse.”

Jira: SV-10054. Last checked against build v26.40.8-7a95011 on 10/8/2026, before the expected results changed on 16 Oct 2026; not yet checked against a build since.

### [C368150](https://shopview.testrail.io/index.php?/cases/view/368150) Enter opens the focused card or row, and no key drags it

PRD v55/v61 S11-R1 and S11-R3: the focused card or row is reached with one Tab and the arrow keys (was: Tab until the card). Space and Shift with the arrows still move nothing; plain arrows now move focus.

- Steps 2, 9 — **S11-R1** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “Each view is a single Tab stop. Tab lands on one work order row (Tech View) or card (Board View), the one last focused, or, when none has been, the first work order shown in on-screen order: the first row or card in Unassigned, or the first technician’s first row or card when Unassigned is collapsed or empty (never a group or column header while a work order is shown; when every group is collapsed, Tab lands on the first group header; after the user arrows onto a header and tabs out and back in, Tab returns to a work order row while any row is shown; on Board View, if the last-focused card has scrolled out of view in its column, Tab lands on the first card in view); the focused row or card shows a visible focus ring.”
- Steps 3, 10 — **S11-R3** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Inside a view the arrow keys move focus: Up and Down move between rows and group headers in Tech View, and between cards and the column header within a Board View column; Left and Right move between Board View columns. Tab from a focused row, card or header reaches its own controls (more actions, pin, collapse) in order, then leaves the view. Tab never stops on every row.”
- Steps 5, 11 — **S11-R4** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Enter on a focused row or card opens the work order, the same as a click.”
- Steps 13 — **S11-R10** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Opening a work order by keyboard is Enter (S11-R4); dragging is by mouse or touch only, so the two never conflict. A mouse click without a drag opens the work order as today (S2-R8).”
- Steps 4 — **S11-R9** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Reassigning by keyboard goes through the more-actions menu: Reassign lead technician opens the Reassign dialog, and Unassign is a menu item. There is no keyboard drag in this release, so reordering work orders and technicians is by mouse or touch only.”
- Steps 4 — **Out of Scope** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Reordering work orders or technicians by keyboard. Reordering is by mouse or touch drag in this release (S11-R9).”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 1, 6, 7, 8, 12.

Jira: SV-10054. Last checked against build v26.40.8-7a95011 on 10/8/2026, before the expected results changed on 16 Oct 2026; not yet checked against a build since.

### [C368152](https://shopview.testrail.io/index.php?/cases/view/368152) Reassign and Unassign work from the keyboard through the More actions menu

PRD v55/v61 S11-R1 and S11-R3: cards are reached with one Tab and the arrow keys, then Tab to the card's own More actions button (was: Tab until the card). The old last step (no key drags a card) is left to C368150, which checks it.

- Steps 2 — **S11-R1** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “Each view is a single Tab stop. Tab lands on one work order row (Tech View) or card (Board View), the one last focused, or, when none has been, the first work order shown in on-screen order: the first row or card in Unassigned, or the first technician’s first row or card when Unassigned is collapsed or empty (never a group or column header while a work order is shown; when every group is collapsed, Tab lands on the first group header; after the user arrows onto a header and tabs out and back in, Tab returns to a work order row while any row is shown; on Board View, if the last-focused card has scrolled out of view in its column, Tab lands on the first card in view); the focused row or card shows a visible focus ring.”
- Steps 3, 4, 9, 10 — **S11-R3** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Inside a view the arrow keys move focus: Up and Down move between rows and group headers in Tech View, and between cards and the column header within a Board View column; Left and Right move between Board View columns. Tab from a focused row, card or header reaches its own controls (more actions, pin, collapse) in order, then leaves the view. Tab never stops on every row.”
- Steps 5, 6, 11, 12 — **S11-R9** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Reassigning by keyboard goes through the more-actions menu: Reassign lead technician opens the Reassign dialog, and Unassign is a menu item. There is no keyboard drag in this release, so reordering work orders and technicians is by mouse or touch only.”
- Steps 8, 12 — **S4-R5** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “After successful reassignment, show “Lead technician updated”; after unassigning, show “Lead technician removed”.”
- Steps 6, 7 — **Tech plan Phase 11 dialog** (tech plan (upload of 8 Oct 2026)): “The dialog is the keyboard path for moving work between technicians; it runs the same permission and status checks as the pointer path (S11-N1)”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 1.

Jira: SV-10054,SV-10047. Last checked against build v26.40.8-7a95011 on 10/8/2026, before the expected results changed on 16 Oct 2026; not yet checked against a build since.

### [C97020](https://shopview.testrail.io/index.php?/cases/view/97020) The keyboard cannot get around permission or status limits

PRD v55/v61 S11-R1 and S11-R3: cards are reached with one Tab and the arrow keys (was: Tab until the card). The permission and status limits are unchanged.

- Steps 5, 6, 11, 12, 14, 16 — **S11-N1** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Keyboard access must not bypass action permissions or work order status restrictions.”
- Steps 6, 14 — **S11-R9** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Reassigning by keyboard goes through the more-actions menu: Reassign lead technician opens the Reassign dialog, and Unassign is a menu item. There is no keyboard drag in this release, so reordering work orders and technicians is by mouse or touch only.”
- Steps 5 — **S4-N1** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Require Work Orders create and edit permission to drag work orders or access Reassign lead technician.”
- Steps 11, 16 — **S4-N6** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “The disabled Reassign lead technician action on an Invoiced or Paid work order shows this tooltip: “The lead technician can’t be changed once a work order is Invoiced or Paid.””
- Steps 2, 8 — **S11-R1** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “Each view is a single Tab stop. Tab lands on one work order row (Tech View) or card (Board View), the one last focused, or, when none has been, the first work order shown in on-screen order: the first row or card in Unassigned, or the first technician’s first row or card when Unassigned is collapsed or empty (never a group or column header while a work order is shown; when every group is collapsed, Tab lands on the first group header; after the user arrows onto a header and tabs out and back in, Tab returns to a work order row while any row is shown; on Board View, if the last-focused card has scrolled out of view in its column, Tab lands on the first card in view); the focused row or card shows a visible focus ring.”
- Steps 3, 4, 9, 10 — **S11-R3** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Inside a view the arrow keys move focus: Up and Down move between rows and group headers in Tech View, and between cards and the column header within a Board View column; Left and Right move between Board View columns. Tab from a focused row, card or header reaches its own controls (more actions, pin, collapse) in order, then leaves the view. Tab never stops on every row.”
- Steps all — **Tech plan Phase 11 tests** (tech plan (upload of 8 Oct 2026)): “a keyboard-initiated reassign is refused for a locked status and without permission (S11-N1).”

Jira: SV-10054,SV-10047. Last checked against build v26.40.8-7a95011 on 10/8/2026, before the expected results changed on 16 Oct 2026; not yet checked against a build since.

### [C96945](https://shopview.testrail.io/index.php?/cases/view/96945) A card's More actions menu appears on hover or focus and offers Reassign

PRD v55/v61 S11-R1 and S11-R3: the card gets keyboard focus with one Tab and the arrow keys (was: Tab repeatedly). The menu label is now checked as "Reassign lead technician" (the build's label, as in the other cases). Automated case.

- Steps 1, 5, 8 — **S3-R13** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Reveal the card’s more-actions overlay on hover or keyboard focus.”
- Steps 3 — **S3-R14** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Include Reassign lead technician in the card’s more-actions menu.”
- Steps 7, 8 — **S11-R1** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “Each view is a single Tab stop. Tab lands on one work order row (Tech View) or card (Board View), the one last focused, or, when none has been, the first work order shown in on-screen order: the first row or card in Unassigned, or the first technician’s first row or card when Unassigned is collapsed or empty (never a group or column header while a work order is shown; when every group is collapsed, Tab lands on the first group header; after the user arrows onto a header and tabs out and back in, Tab returns to a work order row while any row is shown; on Board View, if the last-focused card has scrolled out of view in its column, Tab lands on the first card in view); the focused row or card shows a visible focus ring.”
- Steps 8 — **S11-R3** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Inside a view the arrow keys move focus: Up and Down move between rows and group headers in Tech View, and between cards and the column header within a Board View column; Left and Right move between Board View columns. Tab from a focused row, card or header reaches its own controls (more actions, pin, collapse) in order, then leaves the view. Tab never stops on every row.”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 2, 4, 6.

Jira: SV-10046. Last checked against build v26.40.8-7a95011 on 10/8/2026, before the expected results changed on 16 Oct 2026; not yet checked against a build since.

### [C614711](https://shopview.testrail.io/index.php?/cases/view/614711) Work orders of a deleted lead sit under Deleted technician, which takes no drops

PRD v59 S3-R20e, the product owner's ruling on SV-11416: a deleted lead's work orders sit under "Deleted technician" with the inactive marker and no grip, take no drops, can be dragged out, and List shows the lead blank (was: no "Unknown Technician" column, header naming the technician as in List).

- Steps 2, 5, 6, 7, 8, 10 — **S3-R20e** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Work orders whose lead technician was deleted in Settings → Staff (the name no longer exists) sit in one column on Board View and one group in Tech View labeled “Deleted technician”, with the inactive marker and no drag grip. Work orders can be dragged out of it; nothing can be dropped onto it. List shows the Lead Technician as blank for these work orders, as today.”
- Steps 6 — **S4-N5** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Nothing can be dropped onto the column/group of an inactive technician (S2-N2, S3-N2) or of a technician who is not enrolled at this location (S3-R20c).”
- Steps 5, 7 — **S3-N4** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Show an inactive indicator on deactivated technician columns.”
- Steps 7 — **S2-N3** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Indicate deactivated technicians as inactive in group headers.”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 1, 3, 4, 9.

Jira: SV-10046,SV-11416. Not yet checked against a build.

### [C96916](https://shopview.testrail.io/index.php?/cases/view/96916) Browser Back restores scroll, tab and filters in Tech View and Board View

PRD v61 S1-R8: Back now also restores the filter view (tab) and filters in Tech View and Board View; the case starts on the Work Orders tab with Status Approved and checks both come back.

- Steps 5, 10 — **S1-R8** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “In Tech View and Board View, browser Back restores both vertical and horizontal scroll position. Horizontal position comes back exactly, and so do the filter view (tab) and filters that were on screen, in Tech View and Board View. List’s Back behavior is unchanged in this release. Vertically, the row or card that was at the top of the view comes back at the top, fully shown; it may sit up to one row or card from the exact pixel position. List behaves as it does today.”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 1, 2, 3, 4, 6, 7, 8, 9.

Jira: SV-10044. Last checked against build v26.40.19-72f4f3b (staging) on 10/16/2026, before the expected results changed on 16 Oct 2026; not yet checked against a build since.

### [C368214](https://shopview.testrail.io/index.php?/cases/view/368214) After Back and Forward the List keeps its tab, search and filters

Quote refresh: PRD v61 S1-R8 reworded (Tech View and Board View now restore the tab and filters; List's Back behavior is unchanged in this release). What List must do is unchanged. Automated case.

- Steps 4, 6 — **QA handoff hotspot 3** (QA handoff test plan (8 Oct 2026)): “The rebuilt Work Orders List. Check saved preferences against URL links, Back and Forward, location switch, stale rows after an edit, and sorting and paging.”
- Steps 4, 6 — **S1-R8** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “In Tech View and Board View, browser Back restores both vertical and horizontal scroll position. Horizontal position comes back exactly, and so do the filter view (tab) and filters that were on screen, in Tech View and Board View. List’s Back behavior is unchanged in this release. Vertically, the row or card that was at the top of the view comes back at the top, fully shown; it may sit up to one row or card from the exact pixel position. List behaves as it does today.”
- Steps 4 — **PRD section 1 Business Case** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “List remains the default and stays exactly as it is in production today; the only addition to the Work Orders page is the switcher that offers the two new displays.”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 1, 2, 3, 5.

Jira: none. Last checked against build v26.40.8-7a95011 on 10/8/2026.

### [C590110](https://shopview.testrail.io/index.php?/cases/view/590110) Design: The view buttons, filter and search icons look as in the design

PRD v55/v58 S1-R9a and S2-R23: the display switcher's icons are the design's slate in every view, List included, and the toolbar icons are slate. Steps compressed to ten (the density menu now closes by switching view).

- Steps 1, 3, 7 — **S1-R9a** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “The switcher uses the design’s icons at 20px: List is Lucide \`list\`, Tech View is \`user-round\`, Board View is \`square-kanban\`. In Tech View and Board View these icons are the design’s: density (\`row-height\` in Tech View, \`card-height\` in Board View, custom icons in the design system’s icon set), collapse chevron (\`chevron-down\`), pin and unpin (\`pin\` / \`pin-off\`), Invoiced or Paid lock (\`lock\`), Unassigned avatar (\`user-round\`) and the empty state when there are no work orders at all (\`clipboard-list\`). The filtered no-results state is the List’s, magnifier included (S1-N1). The filter chips and Search use the design file’s icons in every display option, List included, each exactly as the design file draws it. The display switcher (new on every view, List included) shows the design’s slate icons in every view, so it keeps one color as the user moves between views. These are the only changes to List. Every other List icon is unchanged.”
- Steps 1, 3, 4, 7 — **S2-R23** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “In Tech View and Board View, as in the design: a technician avatar without a photo is a light-grey circle (--sv-grey-100, \#EEF2F6) with initials in --sv-grey-600 (#4B5565) in light mode, which meets accessible contrast (6.7:1; the design file’s \#697586 is 4.2:1); dark mode uses the design’s dark colors; group and column header names are 14px, weight 600, in the design’s slate text color (#364152), with the design’s smaller initials, in the same --sv-grey-600 (#4B5565) as every other avatar’s initials; Board card customer and total price are weight 500; toolbar and switcher icons are the design’s slate color (the switcher in List too, S1-R9a). Technician avatars, and the Service Advisor avatar, follow density in Tech View as in the design: 20px, 24px and 32px on rows and 24px, 28px and 36px on group headers at Compact, Regular and Comfortable; Board View card avatars stay 24px. The Progress bar is 48 by 4px at Compact, as in the design. The name bubble on hover over a technician avatar on a row or card (the +N included) opens above the avatar, in both views; group and column header avatars keep the browser’s plain name tip, because the name is printed beside them. In Tech View, Status, Waiting On Parts and Progress are left-aligned. The Density and Columns tooltips open above their button, like the switcher’s (S1-R9b), and are hidden while their menu is open. List is unchanged.”
- Steps 3, 7 — **S1-R9** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “The switcher visually indicates the active display option.”
- Steps 6 — **S6-R1** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Offer Compact, Regular, and Comfortable density in Tech View and Board View.”
- Steps 10 — **Goals** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “List remains the default and is unchanged from production. The only changes to the Work Orders page are the display switcher and the icons on the filter chips and Search, which follow the design file in every display option, List included (S1-R9a). Today’s tabs, toolbar layout and Create Work Order button stay as they are.”
- Steps 4 — **Design — \_ds_bundle.js (design library), density button icon** (design package (export of 14 Oct 2026)): “name: kanban ? 'card-height' : 'row-height',”
- Steps 4 — **Design — \_ds_bundle.js (design library), column chooser button icon** (design package (export of 14 Oct 2026)): “window.svIcon("columns-3", 20)”
- Steps 1, 2, 4 — **Design — README.md (design library), icons** (design package (export of 14 Oct 2026)): “Never emoji. Never a unicode glyph as an icon.”
- Steps 2 — **Design — \_ds_bundle.js (design library), Work Orders filter chip Status icon** (design package (export of 14 Oct 2026)): “id: "status", icon: SVIcons.ICON_LOAD, label: "Status",”
- Steps 2 — **Design — \_ds_bundle.js (design library), Work Orders filter chip Assigned to me icon** (design package (export of 14 Oct 2026)): “id: "mine", icon: svGlyph("clipboard-list", 16), label: "Assigned to me",”
- Steps 2 — **Design — \_ds_bundle.js (design library), Work Orders filter chip Asset on site icon** (design package (export of 14 Oct 2026)): “id: "asset", icon: SVIcons.ICON_TRUCK, label: "Asset on site",”
- Steps 2 — **Design — \_ds_bundle.js (design library), spinner icon** (design package (export of 14 Oct 2026)): “ICON_LOAD: lazyGlyph("loader"),”
- Steps 2 — **Design — \_ds_bundle.js (design library), Search icon** (design package (export of 14 Oct 2026)): “ICON_SEARCH: lazyGlyph("search", 20),”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 5, 8, 9.

Jira: SV-10044,SV-10049,SV-11319. Last checked against build v26.40.19-72f4f3b (staging) on 10/16/2026, before the expected results changed on 16 Oct 2026; not yet checked against a build since.

### [C590112](https://shopview.testrail.io/index.php?/cases/view/590112) Design: Tech View table fills the full width and Status fits its labels

PRD v57 S2-R22: the Status column has no minimum width and sizes to its widest pill (about 132 px with Ready For Review, narrower with only short statuses); two searches added to check it.

- Steps 1, 4, 5, 6, 7 — **S2-R22** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Tech View’s table runs edge to edge on white, with no side gutter and no card or panel around it, as in the design. When the columns are wider than the screen, the table scrolls sideways, as in the design; columns keep the design’s minimum widths and are never squeezed or clipped. The Status column is the one exception: it has no minimum width and sizes to its widest pill on the page, because its pills keep the List’s production widths (S6-R2a). With Ready for Review on the page that is about the design’s 132px; with only short statuses it is narrower.”
- Steps 2 — **S2-R1** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Group work orders by lead technician with visible separators.”
- Steps 8 — **Goals** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “List remains the default and is unchanged from production. The only changes to the Work Orders page are the display switcher and the icons on the filter chips and Search, which follow the design file in every display option, List included (S1-R9a). Today’s tabs, toolbar layout and Create Work Order button stay as they are.”
- Steps 1 — **Design — README.md (design library), list screens** (design package (export of 14 Oct 2026)): “runs edge to edge on white (never inside a card on grey)”
- Steps 1 — **Design — SKILL.md (design library), list screens** (design package (export of 14 Oct 2026)): “A list screen is white and the table runs edge to edge.”
- Steps 3 — **Design — Work Orders.dc.html, Tech View column header row** (design package (export of 14 Oct 2026)): “position: sticky; top: 0; z-index: 2; background: var(--sv-surface); border-bottom: 1px solid var(--sv-border-default);”
- Steps 2 — **Design — Work Orders.dc.html, Tech View group header** (design package (export of 14 Oct 2026)): “border-top: 3px double var(--sv-border-default);”
- Steps 1, 4 — **Design — Work Orders.dc.html, Tech View table** (design package (export of 14 Oct 2026)): “min-width: {{ rowsMinWidth }}; flex: 1; padding-bottom: 20px; background: var(--sv-surface);”

Jira: SV-10045,SV-11324. Last checked against build v26.40.17-a5c4210 (staging) on 10/15/2026, before the expected results changed on 16 Oct 2026; not yet checked against a build since.

### [C590114](https://shopview.testrail.io/index.php?/cases/view/590114) Design: Tech View rows show a blue number, a thin progress bar and an avatar

PRD v55 S2-R20: the number link is the design system's link colour (#175CD3), darker than the design file's blue (was: the same blue as the picture). PRD v55/v60 S2-R23: Status, Waiting On Parts and Progress are left-aligned, and a row avatar's name bubble opens above it. Clicking the number (opens the work order) is left to C96932.

- Steps 1, 2, 4, 10 — **S2-R20** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Tech View’s cells follow the design: the work order number shows as a link in the design system’s link color (#175CD3), which meets accessible contrast on white; Progress shows as a thin bar with the percentage beside it, with no hours line under it at any density (S6-R6); Service Advisor shows the advisor’s avatar before the name. Clocked In keeps List’s display (S5-R11).”
- Steps 3, 6 — **S2-R23** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “In Tech View and Board View, as in the design: a technician avatar without a photo is a light-grey circle (--sv-grey-100, \#EEF2F6) with initials in --sv-grey-600 (#4B5565) in light mode, which meets accessible contrast (6.7:1; the design file’s \#697586 is 4.2:1); dark mode uses the design’s dark colors; group and column header names are 14px, weight 600, in the design’s slate text color (#364152), with the design’s smaller initials, in the same --sv-grey-600 (#4B5565) as every other avatar’s initials; Board card customer and total price are weight 500; toolbar and switcher icons are the design’s slate color (the switcher in List too, S1-R9a). Technician avatars, and the Service Advisor avatar, follow density in Tech View as in the design: 20px, 24px and 32px on rows and 24px, 28px and 36px on group headers at Compact, Regular and Comfortable; Board View card avatars stay 24px. The Progress bar is 48 by 4px at Compact, as in the design. The name bubble on hover over a technician avatar on a row or card (the +N included) opens above the avatar, in both views; group and column header avatars keep the browser’s plain name tip, because the name is printed beside them. In Tech View, Status, Waiting On Parts and Progress are left-aligned. The Density and Columns tooltips open above their button, like the switcher’s (S1-R9b), and are hidden while their menu is open. List is unchanged.”
- Steps 8 — **S1-R9a** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “The switcher uses the design’s icons at 20px: List is Lucide \`list\`, Tech View is \`user-round\`, Board View is \`square-kanban\`. In Tech View and Board View these icons are the design’s: density (\`row-height\` in Tech View, \`card-height\` in Board View, custom icons in the design system’s icon set), collapse chevron (\`chevron-down\`), pin and unpin (\`pin\` / \`pin-off\`), Invoiced or Paid lock (\`lock\`), Unassigned avatar (\`user-round\`) and the empty state when there are no work orders at all (\`clipboard-list\`). The filtered no-results state is the List’s, magnifier included (S1-N1). The filter chips and Search use the design file’s icons in every display option, List included, each exactly as the design file draws it. The display switcher (new on every view, List included) shows the design’s slate icons in every view, so it keeps one color as the user moves between views. These are the only changes to List. Every other List icon is unchanged.”
- Steps 1 — **S2-R8** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Clicking anywhere on a row, outside its own controls, opens the work order. A drag starts only after the pointer has moved a few pixels, so a click never turns into a drag.”
- Steps 5 — **S7-R3** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Place the lead technician first in the avatar group.”
- Steps 5 — **S7-R6** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Keep every involved technician discoverable by name.”
- Steps 2 — **Design — Work Orders.dc.html, Tech View Progress cell, bar size at Regular** (design package (export of 14 Oct 2026)): “barW: rowDensity === "small" ? "48px" : "64px"”
- Steps 2 — **Design — Work Orders.dc.html, Tech View Progress cell, bar size at Regular** (design package (export of 14 Oct 2026)): “barH: rowDensity === "small" ? "4px" : "6px"”
- Steps 2 — **Design — Work Orders.dc.html, Tech View Progress cell** (design package (export of 14 Oct 2026)): “font-size: 12px; color: var(--sv-text-secondary); font-variant-numeric: tabular-nums;"\>{{ wo.pctLabel }}”
- Steps 4 — **Design — Work Orders.dc.html, Tech View Service Advisor cell** (design package (export of 14 Oct 2026)): “component-from-global-scope="SVAvatarFix" name="{{ wo.adv }}" size="{{ crewSize }}"”
- Steps 7 — **Design — Work Orders.dc.html, empty cell** (design package (export of 14 Oct 2026)): “\<span style="color: var(--sv-text-muted);"\>-\</span\>”
- Steps 7 — **Design — Work Orders.dc.html, Total price cell** (design package (export of 14 Oct 2026)): “text-align: right; color: var(--sv-text-primary); font-variant-numeric: tabular-nums;"\>{{ wo.total }}”
- Steps 9 — **Design — Work Orders.dc.html, tooltip** (design package (export of 14 Oct 2026)): “transform: translate(-50%, -100%); padding: 6px 10px; border-radius: var(--sv-radius-md); background: var(--sv-surface-inverse);”

Jira: SV-10045,SV-10050,SV-11319,SV-11325. Last checked against build v26.40.17-a5c4210 (staging) on 10/15/2026, before the expected results changed on 16 Oct 2026; not yet checked against a build since.

### [C590117](https://shopview.testrail.io/index.php?/cases/view/590117) Design: Tech View headings show handle, arrow, avatar, name, pin and count

PRD v55 S2-R11a: the Tech View group-header pin is always shown, grey when unpinned and blue when pinned (was: pin not judged, question open). PRD v55/v58/v61 S2-R23: initials grey-600 (darker than the design file), header names slate semibold, header avatars keep the browser's plain name tip.

- Steps 2, 6, 11 — **S2-R11a** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “The pin on each Tech View technician group header is always shown, styled as on Board View’s column headers: grey when unpinned, blue when pinned, and dimmed on unpinned technicians once three are pinned (S3-R8).”
- Steps 2, 5, 9, 10 — **S2-R23** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “In Tech View and Board View, as in the design: a technician avatar without a photo is a light-grey circle (--sv-grey-100, \#EEF2F6) with initials in --sv-grey-600 (#4B5565) in light mode, which meets accessible contrast (6.7:1; the design file’s \#697586 is 4.2:1); dark mode uses the design’s dark colors; group and column header names are 14px, weight 600, in the design’s slate text color (#364152), with the design’s smaller initials, in the same --sv-grey-600 (#4B5565) as every other avatar’s initials; Board card customer and total price are weight 500; toolbar and switcher icons are the design’s slate color (the switcher in List too, S1-R9a). Technician avatars, and the Service Advisor avatar, follow density in Tech View as in the design: 20px, 24px and 32px on rows and 24px, 28px and 36px on group headers at Compact, Regular and Comfortable; Board View card avatars stay 24px. The Progress bar is 48 by 4px at Compact, as in the design. The name bubble on hover over a technician avatar on a row or card (the +N included) opens above the avatar, in both views; group and column header avatars keep the browser’s plain name tip, because the name is printed beside them. In Tech View, Status, Waiting On Parts and Progress are left-aligned. The Density and Columns tooltips open above their button, like the switcher’s (S1-R9b), and are hidden while their menu is open. List is unchanged.”
- Steps 1, 2 — **S9-R1a** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “In Tech View every work order row, Unassigned’s rows included, shows the design’s six-dot drag grip at its left edge to users who can drag work orders (S4-N1). Every technician group header shows the grip to every user who can reorder technicians (S9-R2), view-only users included, because the technician order is personal. The Unassigned group header shows no grip, because Unassigned cannot move (S9-R8). The whole row still drags (S2-R8); the grip shows that it can.”
- Steps 2 — **S2-R12** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Each group header shows the technician’s name, avatar, and a count of the work orders currently shown in that group, after the filter view and filters are applied, so the count always matches the rows listed.”
- Steps 5 — **S2-R10** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Hovering a technician header or avatar reveals the technician’s name.”
- Steps 7, 8 — **S2-R5** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Allow each technician group to be collapsed or expanded.”
- Steps 1, 7 — **S1-R9a** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “The switcher uses the design’s icons at 20px: List is Lucide \`list\`, Tech View is \`user-round\`, Board View is \`square-kanban\`. In Tech View and Board View these icons are the design’s: density (\`row-height\` in Tech View, \`card-height\` in Board View, custom icons in the design system’s icon set), collapse chevron (\`chevron-down\`), pin and unpin (\`pin\` / \`pin-off\`), Invoiced or Paid lock (\`lock\`), Unassigned avatar (\`user-round\`) and the empty state when there are no work orders at all (\`clipboard-list\`). The filtered no-results state is the List’s, magnifier included (S1-N1). The filter chips and Search use the design file’s icons in every display option, List included, each exactly as the design file draws it. The display switcher (new on every view, List included) shows the design’s slate icons in every view, so it keeps one color as the user moves between views. These are the only changes to List. Every other List icon is unchanged.”
- Steps 3 — **Design — \_ds_bundle.js (design library), staff avatar** (design package (export of 14 Oct 2026)): “Photo when we have one, initials otherwise.”
- Steps 2 — **Design — \_ds_bundle.js (design library), staff avatar without a photo** (design package (export of 14 Oct 2026)): “background: color \|\| 'var(--sv-surface-sunken)', color: color ? 'var(--sv-accent-on-solid)' : 'var(--sv-text-secondary)',”
- Steps 2 — **Design — Work Orders.dc.html, Tech View group header name** (design package (export of 14 Oct 2026)): “font-size: 14px; font-weight: 600; color: var(--sv-text-primary); margin-right: -12px;”
- Steps 9, 10 — **Design — Work Orders.dc.html, Tech View group header height by density** (design package (export of 14 Oct 2026)): “groupH: rowDensity === "large" ? "56px" : rowDensity === "small" ? "36px" : "44px"”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 4.

Jira: SV-10045,SV-11319,SV-11338. Last checked against build v26.40.17-a5c4210 (staging) on 10/15/2026, before the expected results changed on 16 Oct 2026; not yet checked against a build since.

### [C590119](https://shopview.testrail.io/index.php?/cases/view/590119) Design: Board View column headings show handle, avatar, name, pin and count

PRD v55/v58 S2-R23: avatar initials are grey-600, a little darker than the design file's, and header names slate semibold (was: as in the design picture).

- Steps 1, 2, 3 — **S3-R12** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Each column header shows the technician’s name, avatar, and a count of the work orders currently shown in that column, after the filter view and filters are applied, so the count always matches the cards listed.”
- Steps 2 — **S2-R23** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “In Tech View and Board View, as in the design: a technician avatar without a photo is a light-grey circle (--sv-grey-100, \#EEF2F6) with initials in --sv-grey-600 (#4B5565) in light mode, which meets accessible contrast (6.7:1; the design file’s \#697586 is 4.2:1); dark mode uses the design’s dark colors; group and column header names are 14px, weight 600, in the design’s slate text color (#364152), with the design’s smaller initials, in the same --sv-grey-600 (#4B5565) as every other avatar’s initials; Board card customer and total price are weight 500; toolbar and switcher icons are the design’s slate color (the switcher in List too, S1-R9a). Technician avatars, and the Service Advisor avatar, follow density in Tech View as in the design: 20px, 24px and 32px on rows and 24px, 28px and 36px on group headers at Compact, Regular and Comfortable; Board View card avatars stay 24px. The Progress bar is 48 by 4px at Compact, as in the design. The name bubble on hover over a technician avatar on a row or card (the +N included) opens above the avatar, in both views; group and column header avatars keep the browser’s plain name tip, because the name is printed beside them. In Tech View, Status, Waiting On Parts and Progress are left-aligned. The Density and Columns tooltips open above their button, like the switcher’s (S1-R9b), and are hidden while their menu is open. List is unchanged.”
- Steps 4, 6, 7 — **S3-R7** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Allow users to pin a technician from the column header.”
- Steps 8 — **S3-R8** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “At three pinned technicians, disable other pin controls with: “You can pin up to 3 technicians.””
- Steps 5 — **S1-R9a** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “The switcher uses the design’s icons at 20px: List is Lucide \`list\`, Tech View is \`user-round\`, Board View is \`square-kanban\`. In Tech View and Board View these icons are the design’s: density (\`row-height\` in Tech View, \`card-height\` in Board View, custom icons in the design system’s icon set), collapse chevron (\`chevron-down\`), pin and unpin (\`pin\` / \`pin-off\`), Invoiced or Paid lock (\`lock\`), Unassigned avatar (\`user-round\`) and the empty state when there are no work orders at all (\`clipboard-list\`). The filtered no-results state is the List’s, magnifier included (S1-N1). The filter chips and Search use the design file’s icons in every display option, List included, each exactly as the design file draws it. The display switcher (new on every view, List included) shows the design’s slate icons in every view, so it keeps one color as the user moves between views. These are the only changes to List. Every other List icon is unchanged.”
- Steps 1 — **Design — Work Orders.dc.html, Board View Unassigned avatar** (design package (export of 14 Oct 2026)): “width: 28px; height: 28px; flex: none; border-radius: 50%; display: grid; place-items: center; background: var(--sv-surface-sunken); color: var(--sv-text-secondary);”
- Steps 2 — **Design — Work Orders.dc.html, Board View column header name** (design package (export of 14 Oct 2026)): “font-size: 14px; font-weight: 600; color: var(--sv-text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: -8px;”
- Steps 2 — **Design — \_ds_bundle.js (design library), staff avatar without a photo** (design package (export of 14 Oct 2026)): “background: color \|\| 'var(--sv-surface-sunken)', color: color ? 'var(--sv-accent-on-solid)' : 'var(--sv-text-secondary)',”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 9.

Jira: SV-10046,SV-11319,SV-11338. Last checked against build v26.40.17-a5c4210 (staging) on 10/15/2026, before the expected results changed on 16 Oct 2026; not yet checked against a build since.

### [C590128](https://shopview.testrail.io/index.php?/cases/view/590128) Design: Density changes Tech View row, avatar and bar sizes, not card avatars

PRD v60/v61 S2-R23: Tech View row avatars 20/24/32 px and group header avatars 24/28/36 px by density, the Service Advisor avatar follows density, the Compact bar is 48 × 4 px, and Board card avatars stay 24 px (new steps 8-10).

- Steps 2, 4, 6, 8, 10 — **S2-R23** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “In Tech View and Board View, as in the design: a technician avatar without a photo is a light-grey circle (--sv-grey-100, \#EEF2F6) with initials in --sv-grey-600 (#4B5565) in light mode, which meets accessible contrast (6.7:1; the design file’s \#697586 is 4.2:1); dark mode uses the design’s dark colors; group and column header names are 14px, weight 600, in the design’s slate text color (#364152), with the design’s smaller initials, in the same --sv-grey-600 (#4B5565) as every other avatar’s initials; Board card customer and total price are weight 500; toolbar and switcher icons are the design’s slate color (the switcher in List too, S1-R9a). Technician avatars, and the Service Advisor avatar, follow density in Tech View as in the design: 20px, 24px and 32px on rows and 24px, 28px and 36px on group headers at Compact, Regular and Comfortable; Board View card avatars stay 24px. The Progress bar is 48 by 4px at Compact, as in the design. The name bubble on hover over a technician avatar on a row or card (the +N included) opens above the avatar, in both views; group and column header avatars keep the browser’s plain name tip, because the name is printed beside them. In Tech View, Status, Waiting On Parts and Progress are left-aligned. The Density and Columns tooltips open above their button, like the switcher’s (S1-R9b), and are hidden while their menu is open. List is unchanged.”
- Steps 1, 3, 5 — **S6-R1** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Offer Compact, Regular, and Comfortable density in Tech View and Board View.”
- Steps 2, 4, 6 — **S6-R2** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Density adjusts spacing and the size of rows, cards, and their elements.”
- Steps 7 — **S6-R3** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Share one density selection between Tech View and Board View.”
- Steps 2 — **S6-R4** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Row and card text is 14px at every density; Compact never shrinks it. Text the design sets at 12px at every density, such as column header labels (S2-R21), the progress percentage and secondary lines, stays 12px.”
- Steps 2, 4, 6 — **S6-R6** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Changing density never changes which fields, columns, or values are displayed.”
- Steps 2, 4, 6 — **S2-R20** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Tech View’s cells follow the design: the work order number shows as a link in the design system’s link color (#175CD3), which meets accessible contrast on white; Progress shows as a thin bar with the percentage beside it, with no hours line under it at any density (S6-R6); Service Advisor shows the advisor’s avatar before the name. Clocked In keeps List’s display (S5-R11).”
- Steps 2, 4, 6 — **Design — Work Orders.dc.html, Tech View row height by density** (design package (export of 14 Oct 2026)): “rowH: rowDensity === "large" ? "64px" : rowDensity === "small" ? "36px" : "48px"”
- Steps 2 — **Design — Work Orders.dc.html, Tech View text size by density** (design package (export of 14 Oct 2026)): “cellFs: rowDensity === "small" ? "13px" : "14px"”
- Steps 2, 4, 6 — **Design — Work Orders.dc.html, Tech View avatar size by density** (design package (export of 14 Oct 2026)): “crewSize: rowDensity === "large" ? 32 : rowDensity === "small" ? 20 : 24”
- Steps 2, 4 — **Design — Work Orders.dc.html, Tech View progress bar by density** (design package (export of 14 Oct 2026)): “barW: rowDensity === "small" ? "48px" : "64px"”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 9.

Jira: SV-10049,SV-11318. Last checked against build v26.40.17-a5c4210 (staging) on 10/15/2026, before the expected results changed on 16 Oct 2026; not yet checked against a build since.

### [C590113](https://shopview.testrail.io/index.php?/cases/view/590113) Design: Tech View opens with 13 columns and small grey column headings

Quote refresh: PRD v56 removed the Out of Scope line on Collapse all / Expand all (now S2-R13a, covered by Vladimir's C614712); that quote is dropped. What the case checks is unchanged.

- Steps 1, 4, 5 — **S5-R4** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Until the user changes Tech View’s columns, Tech View shows these columns, in this order, as in the design: Status, Waiting On Parts, Number, Customer, Unit, Asset, Progress, Service Advisor, Clocked In, Lines, Assigned Techs, Created on, Total price (Total price subject to financial permission). On Site, VIN/Serial \# and Lead Technician are off by default; each can be added with the column chooser (S2-R4). Column headings use the List’s labels for List columns (for example Unit, not Unit \#) and Assigned Techs for the new column. List’s columns are unchanged.”
- Steps 1 — **S7-R7** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “In Tech View the Assigned Techs column sits immediately after Lines, matching the design. It is on by default (S5-R4) and can be removed through the column chooser (S2-R4).”
- Steps 2, 3, 7, 8, 9, 10 — **S2-R21** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Tech View’s column header labels are 12px, medium weight (500), in the secondary text color, as in the design. Labels never overlap a neighboring label.”
- Steps 1 — **Out of Scope** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Rank numbers (1, 2, 3, and so on) beside each Tech View row, as the design shows.”
- Steps 2 — **Design — Work Orders.dc.html, Tech View column header row** (design package (export of 14 Oct 2026)): “font-size: 12px; font-weight: 500; color: var(--sv-text-secondary); white-space: nowrap;”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 6.

Jira: SV-10045,SV-10048,SV-10050,SV-11317,SV-11321. Last checked against build v26.40.17-a5c4210 (staging) on 10/15/2026.

### [C590122](https://shopview.testrail.io/index.php?/cases/view/590122) Design: Empty groups, empty columns and no-results pages look as in the design

Quote refresh: PRD v58 S1-R9a reworded (the display switcher's slate icons in every view). What the case checks is unchanged.

- Steps 1 — **S2-R15** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “A technician group with no work orders under the current filters, and an empty Unassigned group, show the text “No work orders”.”
- Steps 3 — **S3-R20** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “A technician column with no work orders under the current filters, and an empty Unassigned column, show “Drag a work order here to assign it” to a user who can reassign work orders (S4-N1), and “No work orders” to everyone else.”
- Steps 1, 3, 5 — **S1-R9a** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “The switcher uses the design’s icons at 20px: List is Lucide \`list\`, Tech View is \`user-round\`, Board View is \`square-kanban\`. In Tech View and Board View these icons are the design’s: density (\`row-height\` in Tech View, \`card-height\` in Board View, custom icons in the design system’s icon set), collapse chevron (\`chevron-down\`), pin and unpin (\`pin\` / \`pin-off\`), Invoiced or Paid lock (\`lock\`), Unassigned avatar (\`user-round\`) and the empty state when there are no work orders at all (\`clipboard-list\`). The filtered no-results state is the List’s, magnifier included (S1-N1). The filter chips and Search use the design file’s icons in every display option, List included, each exactly as the design file draws it. The display switcher (new on every view, List included) shows the design’s slate icons in every view, so it keeps one color as the user moves between views. These are the only changes to List. Every other List icon is unchanged.”
- Steps 5, 6, 7, 9, 10 — **S1-N1** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “When the active filters or a search return no work orders, Tech View and Board View show the same empty state as the List, with the same messages and action.”
- Steps 5, 6, 7 — **S1-N1a** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “With filters active, with or without a search, the empty state reads “No work orders match these filters”, then “Try removing a filter to widen your results.”, with a Clear all filters button.”
- Steps 9, 10 — **S1-N1b** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “With only a search active, the empty state reads “No work orders match the search "{search}".” and shows no button.”
- Steps 3 — **Design — Work Orders.dc.html, Board View empty column** (design package (export of 14 Oct 2026)): “border-radius: 8px; border: 1px dashed var(--sv-border-strong); background: var(--sv-surface);”
- Steps 3 — **Design — Work Orders.dc.html, Board View empty column** (design package (export of 14 Oct 2026)): “font-size: 12px; font-weight: 500; color: var(--sv-text-secondary);"\>Drag a work order here to assign it”
- Steps 1, 3 — **Design — SKILL.md (design library), empty states** (design package (export of 14 Oct 2026)): “Empty-state illustrations are a deliberate omission — Shopview empty states are text only.”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 2, 4, 8.

Jira: SV-10044,SV-10045,SV-10046,SV-11319. Last checked against build v26.40.17-a5c4210 (staging) on 10/15/2026.

### [C590127](https://shopview.testrail.io/index.php?/cases/view/590127) Design: The Technician filter sits right after Assigned to me in both views

Quote refresh: PRD v58 S1-R9a reworded. What the case checks is unchanged; it stays Blocked in run 498 until SV-11326 is done.

- Steps 1, 2, 3, 6, 7 — **S1-R15** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “In Tech View and Board View the filter bar also offers a Technician filter, after Assigned to me. It is a multi-select listing Unassigned first, then the location’s technicians (the same people who get a group or column, S9-R4), by first name then last name. Choosing one or more shows only those technicians’ groups or columns; every other group or column, pinned ones included, is hidden. It filters by lead technician only.”
- Steps 7 — **S1-R15b** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “List does not offer the Technician filter and stays as in production. Switching to List while technicians are chosen shows List as if none were chosen; switching back to Tech View or Board View brings the choice back. The choice is remembered the same way as the other filters.”
- Steps 1 — **S1-R9a** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “The switcher uses the design’s icons at 20px: List is Lucide \`list\`, Tech View is \`user-round\`, Board View is \`square-kanban\`. In Tech View and Board View these icons are the design’s: density (\`row-height\` in Tech View, \`card-height\` in Board View, custom icons in the design system’s icon set), collapse chevron (\`chevron-down\`), pin and unpin (\`pin\` / \`pin-off\`), Invoiced or Paid lock (\`lock\`), Unassigned avatar (\`user-round\`) and the empty state when there are no work orders at all (\`clipboard-list\`). The filtered no-results state is the List’s, magnifier included (S1-N1). The filter chips and Search use the design file’s icons in every display option, List included, each exactly as the design file draws it. The display switcher (new on every view, List included) shows the design’s slate icons in every view, so it keeps one color as the user moves between views. These are the only changes to List. Every other List icon is unchanged.”
- Steps 1 — **Out of Scope** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “A Department filter. The design shows one, but a work order’s department is not shown or editable on any work order screen today, so users could not see why a work order matches. Revisit once the work order shows its department.”
- Steps 1 — **Design — \_ds_bundle.js (design library), Technician filter icon** (design package (export of 14 Oct 2026)): “ICON_WRENCH: lazyGlyph("wrench"),”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 4, 5.

Jira: SV-10044,SV-11326. Not yet checked against a build.

### [C614714](https://shopview.testrail.io/index.php?/cases/view/614714) A lead whose Time Clock is turned off keeps a named column that takes no drops

New, PRD v59 S3-R20d (16 Oct 2026, Chris Ward ruling on Slavcho Mitrov's question on SV-11416).

- Steps 4, 5, 6, 9, 10 — **S3-R20d** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “A lead technician whose Time Clock is turned off (not deleted) keeps their own column on Board View and group in Tech View, under their name, while they still lead work orders. Nothing can be dropped onto it, the same as S3-R20c. Once they lead no work orders, the column or group is no longer shown.”
- Steps 5 — **S3-R20c** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “The column of S3-R20b takes no drops. Dropping a work order on it is refused with "This technician can't be assigned work orders." and the work order stays where it was. The column shows no inactive marker, because the technician is not deactivated (S3-N4). Once it holds no work orders, the column is no longer shown.”
- Steps 5 — **S4-N5** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Nothing can be dropped onto the column/group of an inactive technician (S2-N2, S3-N2) or of a technician who is not enrolled at this location (S3-R20c).”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 1, 2, 3, 7, 8.

Jira: SV-10046,SV-10045. Not yet checked against a build.

### [C614715](https://shopview.testrail.io/index.php?/cases/view/614715) With no work orders at all, Tech View and Board View show No work orders yet

New, PRD v55 S1-N1c (15 Oct 2026, Chris Ward ruling on Slavcho Mitrov's v54 follow-up questions).

- Steps 2, 3, 4, 6 — **S1-N1c** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “When no filter and no search are active and the filter view has no work orders at all, Tech View and Board View show the design’s first-run state: the clipboard-list icon in a grey circle, “No work orders yet”, then “Create a work order and assign a technician to see it here.”, with a Create Work Order button that does the same as the page’s Create Work Order button. List keeps its production empty state.”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 1, 5.

Jira: SV-10044. Not yet checked against a build.

### [C614716](https://shopview.testrail.io/index.php?/cases/view/614716) Design: Density and Columns tips show above their buttons, hidden while open

New, PRD v55 S2-R23 (tooltip sentence; 15 Oct 2026, Chris Ward ruling on Slavcho Mitrov's v54 follow-up questions).

- Steps 1, 2, 4, 5 — **S2-R23** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “In Tech View and Board View, as in the design: a technician avatar without a photo is a light-grey circle (--sv-grey-100, \#EEF2F6) with initials in --sv-grey-600 (#4B5565) in light mode, which meets accessible contrast (6.7:1; the design file’s \#697586 is 4.2:1); dark mode uses the design’s dark colors; group and column header names are 14px, weight 600, in the design’s slate text color (#364152), with the design’s smaller initials, in the same --sv-grey-600 (#4B5565) as every other avatar’s initials; Board card customer and total price are weight 500; toolbar and switcher icons are the design’s slate color (the switcher in List too, S1-R9a). Technician avatars, and the Service Advisor avatar, follow density in Tech View as in the design: 20px, 24px and 32px on rows and 24px, 28px and 36px on group headers at Compact, Regular and Comfortable; Board View card avatars stay 24px. The Progress bar is 48 by 4px at Compact, as in the design. The name bubble on hover over a technician avatar on a row or card (the +N included) opens above the avatar, in both views; group and column header avatars keep the browser’s plain name tip, because the name is printed beside them. In Tech View, Status, Waiting On Parts and Progress are left-aligned. The Density and Columns tooltips open above their button, like the switcher’s (S1-R9b), and are hidden while their menu is open. List is unchanged.”
- Steps 7 — **S1-R9b** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “The switcher’s hover tooltip opens above the switcher, so it never covers the table’s column header row. The tooltips read List, Tech View and Board View.”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 3, 6.

Jira: SV-10045. Not yet checked against a build.

### [C614717](https://shopview.testrail.io/index.php?/cases/view/614717) Design: Name bubbles show above row and card avatars, headings keep a plain tip

New, PRD v60/v61 S2-R23 (16 Oct 2026, Chris Ward rulings on the QA triage of SV-11395, SV-11397, SV-11422, SV-11421).

- Steps 1, 2, 3, 5, 6, 7 — **S2-R23** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “In Tech View and Board View, as in the design: a technician avatar without a photo is a light-grey circle (--sv-grey-100, \#EEF2F6) with initials in --sv-grey-600 (#4B5565) in light mode, which meets accessible contrast (6.7:1; the design file’s \#697586 is 4.2:1); dark mode uses the design’s dark colors; group and column header names are 14px, weight 600, in the design’s slate text color (#364152), with the design’s smaller initials, in the same --sv-grey-600 (#4B5565) as every other avatar’s initials; Board card customer and total price are weight 500; toolbar and switcher icons are the design’s slate color (the switcher in List too, S1-R9a). Technician avatars, and the Service Advisor avatar, follow density in Tech View as in the design: 20px, 24px and 32px on rows and 24px, 28px and 36px on group headers at Compact, Regular and Comfortable; Board View card avatars stay 24px. The Progress bar is 48 by 4px at Compact, as in the design. The name bubble on hover over a technician avatar on a row or card (the +N included) opens above the avatar, in both views; group and column header avatars keep the browser’s plain name tip, because the name is printed beside them. In Tech View, Status, Waiting On Parts and Progress are left-aligned. The Density and Columns tooltips open above their button, like the switcher’s (S1-R9b), and are hidden while their menu is open. List is unchanged.”
- Steps 1, 2, 5, 6 — **S7-R6** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Keep every involved technician discoverable by name.”
- Steps 3, 7 — **S2-R10** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Hovering a technician header or avatar reveals the technician’s name.”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 4.

Jira: SV-10045,SV-10046,SV-10050. Not yet checked against a build.

### [C614719](https://shopview.testrail.io/index.php?/cases/view/614719) First Tab skips a collapsed or empty Unassigned to the first technician

PRD v62 S11-R1 (Chris Ward's answer 33, 16 Oct 2026): with nothing focused yet, the first Tab lands on the first row or card in Unassigned, or on the first technician's first row or card when Unassigned is collapsed or empty.

- Steps 3, 7 — **S11-R1** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “Each view is a single Tab stop. Tab lands on one work order row (Tech View) or card (Board View), the one last focused, or, when none has been, the first work order shown in on-screen order: the first row or card in Unassigned, or the first technician’s first row or card when Unassigned is collapsed or empty (never a group or column header while a work order is shown; when every group is collapsed, Tab lands on the first group header; after the user arrows onto a header and tabs out and back in, Tab returns to a work order row while any row is shown; on Board View, if the last-focused card has scrolled out of view in its column, Tab lands on the first card in view); the focused row or card shows a visible focus ring.”
- Steps 1, 4 — **S2-R2** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “Keep Unassigned, containing work orders without a lead technician, fixed before all technician groups.”
- Steps 1, 4 — **S2-R17** (PRD Confluence 845185030 version 62 (16 Oct 2026)): “Tech View orders pinned technicians the same way as Board View: after the fixed Unassigned group and before unpinned technicians, each newly pinned technician after the existing pins (S3-R15, S3-R16).”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 2, 5, 6.

Jira: SV-10054. Not yet checked against a build.

### [C665914](https://shopview.testrail.io/index.php?/cases/view/665914) Design- A long customer name stays inside the dragged card in both views

SV-11503 (19 Oct 2026). The PRD (v64) has no rule for the drag preview and the design draws none; the case applies the design's "…" cut-off of customer names on cards and rows to the preview, by the QA lead's decision of 19 Oct 2026.

- Steps 1, 5 — **S9-R1** (PRD Confluence 845185030 version 64 (16 Oct 2026)): “Allow dragging work orders within or between technician groups/columns in Tech View and Board View.”
- Step 2 — **Design — Work Orders.dc.html, Board View card customer name** (export of 14 Oct 2026): `<span style="font-size: 14px; font-weight: 500; color: {{ wo.titleColor }}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ wo.cust }}</span>`
- Step 6 — **Design — Work Orders.dc.html, Tech View row customer name** (export of 14 Oct 2026): `<span style="font-size: {{ cellFs }}; font-weight: 500; color: {{ wo.titleColor }}; overflow: hidden; text-overflow: ellipsis;">{{ wo.cust }}</span>`
- Steps 3, 7 — **Tech plan, drag files row** (upload of 8 Oct 2026): “Pointer-events drag: threshold (SQ-10) exported as a named constant and documented so tests can exceed it deterministically, rAF auto-scroll, Escape cancels, click suppressed after a drag”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 4.

Jira: SV-10052, SV-11503 (known problem). Not yet checked against a build.

### [C368131](https://shopview.testrail.io/index.php?/cases/view/368131) Pinned technician columns after deactivation or removal from this location

Preconditions and steps simplified 19 Oct 2026 (QA lead); the Expected field, its sources and quotes are unchanged. The quotes, word for word as in the case:

- S3-R20a: “The empty column of a pinned technician who has been deactivated shows “No work orders” to every user, because nothing can be dropped there (S4-N5).”
- S3-E3: “Retain a technician’s pin after deactivation.”
- S3-N4: “Show an inactive indicator on deactivated technician columns.”
- S3-R20b: “A pinned technician who is not enrolled at this location gets no column here. If they still lead work orders at this location, they appear as a normal, unpinned column holding that work.”
- S3-R20c: “The column of S3-R20b takes no drops. Dropping a work order on it is refused with "This technician can't be assigned work orders." and the work order stays where it was. The column shows no inactive marker, because the technician is not deactivated (S3-N4). Once it holds no work orders, the column is no longer shown.”
- S4-N5: “Nothing can be dropped onto the column/group of an inactive technician (S2-N2, S3-N2) or of a technician who is not enrolled at this location (S3-R20c).”
- Context note (S3-R20a, S3-R20b): “A pin only counts at locations where the technician is enrolled.”

### [C368167](https://shopview.testrail.io/index.php?/cases/view/368167) A refused lead change on the work order page shows an error, keeps the old lead

Preconditions and steps simplified 19 Oct 2026 (QA lead); the Expected field, its sources and quotes are unchanged. The quotes, word for word as in the case:

- Dev reply High 1: “A refused change now shows an error and puts the old value back.”
- QA handoff §7: “A refused change shows an error and puts the old value back.”
- QA handoff §7: “changing the lead from the dialog, by a board drag or from the detail card is refused with "The lead technician can't be changed once a work order is Invoiced or Paid."”
- PRD §4 Key Decisions (lead lock): “Lead technician cannot be changed once a work order is Invoiced or Paid. This is a product rule, not only a screen rule, so it must hold on every path that changes the lead technician — board drag, Reassign dialog, and the work order detail page.”

### [C96936](https://shopview.testrail.io/index.php?/cases/view/96936) A lead changed elsewhere moves the work order to its new group on refresh

Preconditions and steps simplified 19 Oct 2026 (QA lead); the Expected field, its sources and quotes are unchanged. The quotes, word for word as in the case:

- S2-E2: “After a lead change elsewhere, move the work order to its new technician group on the next refresh.”

### [C682422](https://shopview.testrail.io/index.php?/cases/view/682422) More actions reads Assign lead technician when a work order has no lead

SV-11522 / SV-11524 (19 Oct 2026), PRD Confluence 845185030 version 66. Quotes, word for word as in the case:

- **S3-R14**: “Include the lead technician action in the card’s more-actions menu: “Assign lead technician” on a work order with no lead technician, “Reassign lead technician” on one that has a lead technician.”
- **S4-R4**: “The card or row more-actions menu opens the lead technician dialog, titled “Assign lead technician” or “Reassign lead technician” to match the menu item it was opened from (S3-R14).”
- **PRD change log, 19 Oct 2026**: “S3-R14, S4-R4: the menu item and dialog read “Assign lead technician” on a work order with no lead and “Reassign lead technician” on one with a lead. v66.”

### [C682423](https://shopview.testrail.io/index.php?/cases/view/682423) The lead technician dialog offers no Unassigned and assigns on one click

SV-11522 / SV-11524 (19 Oct 2026), PRD Confluence 845185030 version 66. Quotes, word for word as in the case:

- **S4-R12**: “The dialog offers eligible active technicians in the current location and nothing else. Unassigned is not offered there: Unassigned is the place for work orders without a lead, not a technician, and removing the lead is the menu’s Unassign action (S11-R9) or a drag to Unassigned. It follows the design: a Search technicians box, each technician with their avatar and N open count, no grouping.”
- **S4-R13**: “Clicking a technician in the dialog assigns them at once; there is no confirm button, and the dialog’s only button is Cancel. When the shift-clearing prompt applies (S4-R28) it shows first, and the change is made from the prompt. Clicking the work order’s current lead closes the dialog with no change (S4-N4).”
- **S4-N4**: “Selecting the current lead again leaves all assignments unchanged and produces no reassignment toast.”
- **S4-R5**: “After a successful lead change on Board View or Tech View, whether by drag, the dialog or Unassign, show the design’s toast (white, with the check icon) reading “{work order number} assigned to {technician name}”, or “{work order number} unassigned” after removing the lead, with an Undo button. Example: “S1-357 assigned to Esther Howard”. This replaces the standard success toast for these two messages only.”
- **PRD change log, 19 Oct 2026**: “S4-R12, S4-R13, S4-R30: Unassigned is no longer offered in the dialog (Unassign stays in the menu, S11-R9); clicking a technician assigns at once, no Reassign button; clicking the current lead closes with no change. v66.”

### [C682424](https://shopview.testrail.io/index.php?/cases/view/682424) A lead change message names the work order and technician, with Undo

SV-11522 / SV-11524 (19 Oct 2026), PRD Confluence 845185030 version 66. Quotes, word for word as in the case:

- **S4-R5**: “After a successful lead change on Board View or Tech View, whether by drag, the dialog or Unassign, show the design’s toast (white, with the check icon) reading “{work order number} assigned to {technician name}”, or “{work order number} unassigned” after removing the lead, with an Undo button. Example: “S1-357 assigned to Esther Howard”. This replaces the standard success toast for these two messages only.”
- **PRD change log, 19 Oct 2026**: “S4-R5, S4-R16, new S4-R32: the lead-change toast is the design’s toast, “{work order number} assigned to {technician name}” / “{work order number} unassigned”, with Undo; 8 seconds, held while hovered; Undo restores the lead, the order position and any cleared shifts (was: standard toast “Lead technician updated” / “Lead technician removed”, no Undo; reverses the SV-11396 call for these two toasts). v66.”

### [C682425](https://shopview.testrail.io/index.php?/cases/view/682425) The lead change message stays while hovered and closes after 8 seconds

SV-11522 / SV-11524 (19 Oct 2026), PRD Confluence 845185030 version 66. Quotes, word for word as in the case:

- **S4-R16**: “The lead-change toast closes on its own after 8 seconds, stays open while the pointer is over it, and closes when Undo is clicked. Other success toasts dismiss automatically, as today.”
- **S4-R5**: “After a successful lead change on Board View or Tech View, whether by drag, the dialog or Unassign, show the design’s toast (white, with the check icon) reading “{work order number} assigned to {technician name}”, or “{work order number} unassigned” after removing the lead, with an Undo button. Example: “S1-357 assigned to Esther Howard”. This replaces the standard success toast for these two messages only.”
- **S4-R32**: “Undo puts the work order back exactly as it was before the change: the previous lead technician (or Unassigned), its previous place in that technician’s order, and any shifts the change cleared (removed shifts come back as they were; a shift that was ended at the moment of the change gets its original end time back). Undo is itself a lead change: it records its own audit entry (S4-R9), follows the Invoiced or Paid rule (S4-N2), and shows no shift-clearing prompt and no new toast. If Undo cannot be saved, nothing changes and the alert “Couldn’t undo the change. Please try again.” shows.”

### [C682426](https://shopview.testrail.io/index.php?/cases/view/682426) Undo puts the work order back with its old lead and in its old place

SV-11522 / SV-11524 (19 Oct 2026), PRD Confluence 845185030 version 66. Quotes, word for word as in the case:

- **S4-R32**: “Undo puts the work order back exactly as it was before the change: the previous lead technician (or Unassigned), its previous place in that technician’s order, and any shifts the change cleared (removed shifts come back as they were; a shift that was ended at the moment of the change gets its original end time back). Undo is itself a lead change: it records its own audit entry (S4-R9), follows the Invoiced or Paid rule (S4-N2), and shows no shift-clearing prompt and no new toast. If Undo cannot be saved, nothing changes and the alert “Couldn’t undo the change. Please try again.” shows.”
- **S4-R9**: “Every lead-change path records one audit entry with the previous lead, new lead, logged-in actor, and time.”

### [C682427](https://shopview.testrail.io/index.php?/cases/view/682427) Undo brings back the shifts that a lead change cleared

SV-11522 / SV-11524 (19 Oct 2026), PRD Confluence 845185030 version 66. Quotes, word for word as in the case:

- **S4-R32**: “Undo puts the work order back exactly as it was before the change: the previous lead technician (or Unassigned), its previous place in that technician’s order, and any shifts the change cleared (removed shifts come back as they were; a shift that was ended at the moment of the change gets its original end time back). Undo is itself a lead change: it records its own audit entry (S4-R9), follows the Invoiced or Paid rule (S4-N2), and shows no shift-clearing prompt and no new toast. If Undo cannot be saved, nothing changes and the alert “Couldn’t undo the change. Please try again.” shows.”
- **S4-R29**: “The prompt reads: title “Clear {Name}'s scheduled shifts?” (with no name: “Clear the lead technician's scheduled shifts?”); text “{Name} has shifts scheduled for this whole work order. Clearing removes shifts that haven't started and ends one that's under way now. Shifts on individual lines and recorded time don't change.”; buttons “Keep shifts”, “Clear shifts” and “Cancel”.”

### [C682428](https://shopview.testrail.io/index.php?/cases/view/682428) Undo cannot move back a work order that was invoiced in the meantime

SV-11522 / SV-11524 (19 Oct 2026), PRD Confluence 845185030 version 66. Quotes, word for word as in the case:

- **S4-R32**: “Undo puts the work order back exactly as it was before the change: the previous lead technician (or Unassigned), its previous place in that technician’s order, and any shifts the change cleared (removed shifts come back as they were; a shift that was ended at the moment of the change gets its original end time back). Undo is itself a lead change: it records its own audit entry (S4-R9), follows the Invoiced or Paid rule (S4-N2), and shows no shift-clearing prompt and no new toast. If Undo cannot be saved, nothing changes and the alert “Couldn’t undo the change. Please try again.” shows.”
- **S4-N2**: “Do not allow the lead technician to change in Invoiced or Paid status. An Invoiced or Paid work order can still be dragged to reorder it within its current technician (or within Unassigned), but it cannot be moved to another technician, to Unassigned, or out of Unassigned. Declined and Complete work orders can be moved freely, as today.”

## 9. VIU status

| Item                                                                 | Status                                                                                                                      |
|----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| Every recipe                                                         | UNVERIFIED in this pass: the click paths are the ones used by the staging runs of 14 to 16 Oct 2026, not re-observed today. |
| P-CLOCKIN                                                            | UNVERIFIED on screen; an API route is recorded (see the procedure).                                                         |
| P-EMPTY-LOCATION                                                     | UNVERIFIED: no recorded way to get a location with no work orders.                                                          |
| [C97021](https://shopview.testrail.io/index.php?/cases/view/97021)   | UNVERIFIED: not yet run in this layout. AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build               |
| [C368150](https://shopview.testrail.io/index.php?/cases/view/368150) | UNVERIFIED: not yet run in this layout. AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build               |
| [C368152](https://shopview.testrail.io/index.php?/cases/view/368152) | UNVERIFIED: not yet run in this layout. AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build               |
| [C97020](https://shopview.testrail.io/index.php?/cases/view/97020)   | UNVERIFIED: not yet run in this layout. AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build               |
| [C96945](https://shopview.testrail.io/index.php?/cases/view/96945)   | UNVERIFIED: not yet run in this layout. AUTOMATION: READY                                                                   |
| [C614711](https://shopview.testrail.io/index.php?/cases/view/614711) | UNVERIFIED: not yet run in this layout. AUTOMATION: READY - EXPECT FAIL (SV-11416)                                          |
| [C96916](https://shopview.testrail.io/index.php?/cases/view/96916)   | UNVERIFIED: not yet run in this layout. AUTOMATION: READY                                                                   |
| [C368214](https://shopview.testrail.io/index.php?/cases/view/368214) | UNVERIFIED: not yet run in this layout. AUTOMATION: READY                                                                   |
| [C590110](https://shopview.testrail.io/index.php?/cases/view/590110) | UNVERIFIED: not yet run in this layout. AUTOMATION: READY                                                                   |
| [C590112](https://shopview.testrail.io/index.php?/cases/view/590112) | UNVERIFIED: not yet run in this layout. AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build               |
| [C590114](https://shopview.testrail.io/index.php?/cases/view/590114) | UNVERIFIED: not yet run in this layout. AUTOMATION: READY                                                                   |
| [C590117](https://shopview.testrail.io/index.php?/cases/view/590117) | UNVERIFIED: not yet run in this layout. AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build               |
| [C590119](https://shopview.testrail.io/index.php?/cases/view/590119) | UNVERIFIED: not yet run in this layout. AUTOMATION: READY                                                                   |
| [C590128](https://shopview.testrail.io/index.php?/cases/view/590128) | UNVERIFIED: not yet run in this layout. AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build               |
| [C590113](https://shopview.testrail.io/index.php?/cases/view/590113) | UNVERIFIED: not yet run in this layout. AUTOMATION: READY                                                                   |
| [C590122](https://shopview.testrail.io/index.php?/cases/view/590122) | UNVERIFIED: not yet run in this layout. AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build               |
| [C590127](https://shopview.testrail.io/index.php?/cases/view/590127) | UNVERIFIED: not yet run in this layout. AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build               |
| [C614714](https://shopview.testrail.io/index.php?/cases/view/614714) | UNVERIFIED: not yet run in this layout. AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build               |
| [C614715](https://shopview.testrail.io/index.php?/cases/view/614715) | UNVERIFIED: not yet run in this layout. AUTOMATION: HOLD - needs a location with no work orders at all                      |
| [C614716](https://shopview.testrail.io/index.php?/cases/view/614716) | UNVERIFIED: not yet run in this layout. AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build               |
| [C614717](https://shopview.testrail.io/index.php?/cases/view/614717) | UNVERIFIED: not yet run in this layout. AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build               |
| [C614719](https://shopview.testrail.io/index.php?/cases/view/614719) | UNVERIFIED: not yet run. AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build |
| [C665914](https://shopview.testrail.io/index.php?/cases/view/665914) | UNVERIFIED: not yet run. AUTOMATION: READY - EXPECT FAIL (SV-11503) |
| [C368131](https://shopview.testrail.io/index.php?/cases/view/368131) | Passed on staging v26.40.19-e435950, 19 Oct 2026 (run 498, T3761652), in the wording before this simplification; the actions are the same. AUTOMATION: READY |
| [C368167](https://shopview.testrail.io/index.php?/cases/view/368167) | Passed on staging v26.40.19-e435950, 19 Oct 2026 (run 498, T3792488), in the wording before this simplification; the actions are the same. AUTOMATION: READY |
| [C96936](https://shopview.testrail.io/index.php?/cases/view/96936) | Passed on staging v26.40.19-e435950, 19 Oct 2026 (run 498, T3481880), in the wording before this simplification; the actions are the same. AUTOMATION: READY |
| [C682422](https://shopview.testrail.io/index.php?/cases/view/682422) | UNVERIFIED: not yet run (test T4056656 in run 498). AUTOMATION: READY - EXPECT FAIL (SV-11524) |
| [C682423](https://shopview.testrail.io/index.php?/cases/view/682423) | UNVERIFIED: not yet run (test T4056657 in run 498). AUTOMATION: READY - EXPECT FAIL (SV-11524) |
| [C682424](https://shopview.testrail.io/index.php?/cases/view/682424) | UNVERIFIED: not yet run (test T4056658 in run 498). AUTOMATION: READY - EXPECT FAIL (SV-11524) |
| [C682425](https://shopview.testrail.io/index.php?/cases/view/682425) | UNVERIFIED: not yet run (test T4056659 in run 498). AUTOMATION: READY - EXPECT FAIL (SV-11524) |
| [C682426](https://shopview.testrail.io/index.php?/cases/view/682426) | UNVERIFIED: not yet run (test T4056660 in run 498). AUTOMATION: READY - EXPECT FAIL (SV-11524) |
| [C682427](https://shopview.testrail.io/index.php?/cases/view/682427) | UNVERIFIED: not yet run (test T4056661 in run 498). AUTOMATION: READY - EXPECT FAIL (SV-11524) |
| [C682428](https://shopview.testrail.io/index.php?/cases/view/682428) | UNVERIFIED: not yet run (test T4056662 in run 498). AUTOMATION: READY - EXPECT FAIL (SV-11524) |
| [C682437](https://shopview.testrail.io/index.php?/cases/view/682437) | UNVERIFIED: not yet run (test T4060515 in run 498; ticket SV-11402). AUTOMATION: READY |
| [C682438](https://shopview.testrail.io/index.php?/cases/view/682438) | UNVERIFIED: not yet run (test T4060516 in run 498; ticket SV-11409). AUTOMATION: READY |
| [C682439](https://shopview.testrail.io/index.php?/cases/view/682439) | UNVERIFIED: not yet run (test T4060517 in run 498; ticket SV-11430). AUTOMATION: READY |
| [C682440](https://shopview.testrail.io/index.php?/cases/view/682440) | UNVERIFIED: not yet run (test T4060518 in run 498; ticket SV-11467). AUTOMATION: READY - EXPECT FAIL (SV-11467) |
| [C682420](https://shopview.testrail.io/index.php?/cases/view/682420) | Test T4054407 in run 498 is marked Passed (ticket SV-11467); the result was not recorded by this session. AUTOMATION: READY. TestRail marks the case Automated. |
| [C682445](https://shopview.testrail.io/index.php?/cases/view/682445) | UNVERIFIED: not yet run (test T4062446 in run 498; ticket SV-11119, still failing on staging 19 Oct 2026). AUTOMATION: READY - EXPECT FAIL (SV-11119) |
| [C682446](https://shopview.testrail.io/index.php?/cases/view/682446) | UNVERIFIED: not yet run (test T4062447 in run 498; ticket SV-11087, fix in the bugfix release). AUTOMATION: READY |
| [C682429](https://shopview.testrail.io/index.php?/cases/view/682429) | UNVERIFIED: not yet run (held; not in run 498). AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO |
| [C682430](https://shopview.testrail.io/index.php?/cases/view/682430) | UNVERIFIED: not yet run (held; not in run 498). AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO |
| [C682431](https://shopview.testrail.io/index.php?/cases/view/682431) | UNVERIFIED: not yet run (held; not in run 498). AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO |
| [C682432](https://shopview.testrail.io/index.php?/cases/view/682432) | UNVERIFIED: not yet run (held; not in run 498). AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO |
| [C682433](https://shopview.testrail.io/index.php?/cases/view/682433) | UNVERIFIED: not yet run (held; not in run 498). AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO |
| [C682434](https://shopview.testrail.io/index.php?/cases/view/682434) | UNVERIFIED: not yet run (held; not in run 498). AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO |
| [C682435](https://shopview.testrail.io/index.php?/cases/view/682435) | UNVERIFIED: not yet run (held; not in run 498). AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO |
| [C682436](https://shopview.testrail.io/index.php?/cases/view/682436) | UNVERIFIED: not yet run (released 19 Oct 2026 on PRD v68 S1-N1d; test T4062445 in run 498). AUTOMATION: READY |

## 10. Open questions

- QA lead: C368150 (13 steps), C368152 (12), C97020 (16) and C590117 (11) are over the 10-step limit; they were not split (safeguard). Split them?
- QA lead: the "No work orders yet" case needs a location with no work orders. Is there one we may use, or may a session create one?
- ANSWERED (Chris Ward, answer 32, 16 Oct 2026; PRD v62 S2-R23): header avatar initials use the same --sv-grey-600 (\#4B5565) as every other avatar, at the design's smaller size. The cases' "dark grey, a little darker than the design picture" matches it.
- ANSWERED (Chris Ward, answer 33, 16 Oct 2026; PRD v62 S11-R1): with nothing focused yet, the first Tab lands on the first row or card in Unassigned, or the first technician's first row or card when Unassigned is collapsed or empty. C97021 already follows the first part; C614719 covers the collapsed and empty case.
- C368214: the old "write down whether the search text is kept" note was dropped (it was not a pass/fail check; S1-R8 keeps List's Back behaviour as in production).
- PO (Chris Ward): PRD v66 changed S4-R5 to "{work order number} assigned to {technician name}" / "{work order number} unassigned" with Undo, but the messages table ("Lead technician updated", "Lead technician removed") and the Story 4 example still read the old words. The new cases follow S4-R5.
- S4-R32's failure alert ("Couldn't undo the change. Please try again.") needs a forced save failure: not checkable by hand; no manual case.
