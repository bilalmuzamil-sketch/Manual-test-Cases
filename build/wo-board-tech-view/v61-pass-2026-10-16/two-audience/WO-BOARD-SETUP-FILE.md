# WO Board and Tech View: setup file for Claude sessions (21 cases, 16 Oct 2026)

This file is for a Claude session. A manual tester never needs it: each test case is complete on its own. With this file and the access the user gives at the start of the session, a new session can put the account into every case's starting state. It holds no environment address, credentials, cookies or session data.

## 1. Header

- Feature: Work Orders, Board View and Tech View display options (epic SV-10043; stories SV-10044 to SV-10054).
- Generated: 16 Oct 2026, for the 21 cases rewritten that day in the two-audience layout (a one-time trial ordered by the QA lead).
- Sources: PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030, version 61 (16 Oct 2026 15:17 UTC, Chris Ward); Jira stories SV-10044 to SV-10054 and defects SV-11317 to SV-11326, SV-11338, SV-11416; tech plan (upload of 8 Oct 2026); Claude Design project "Work Orders" (Branko Cicovic), export of 14 Oct 2026; QA handoff test plan (8 Oct 2026); Chris Ward's answers 1 to 31 (sheet of 14 Oct 2026).
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

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- Technicians "ZZAUTOTEST C97021 Ana" and "ZZAUTOTEST C97021 Ben" are active at this location, and both are pinned in your Board View (no other technician is pinned).
- Customer "ZZAUTOTEST C97021 Keyboard" has four Approved work orders: units "C97021-U1" and "C97021-U2" led by "ZZAUTOTEST C97021 Ana", unit "C97021-U3" led by "ZZAUTOTEST C97021 Ben", and unit "C97021-U4" with no lead technician.
- Starting screen: "Work Orders" \> "All" tab, "Board View" shown, "Search" holding "ZZAUTOTEST C97021 Keyboard", no filter chosen, "Assigned to me" off, browser window at least 1024 px wide.
- If any record named above is missing, mark this test Blocked: "setup not done".

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

#### SETUP-C368150 — [C368150](https://shopview.testrail.io/index.php?/cases/view/368150) Enter opens the focused card or row, and no key drags it

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- Technicians "ZZAUTOTEST C368150 Ana" and "ZZAUTOTEST C368150 Ben" are active at this location, and both are pinned in your Board View (no other technician is pinned).
- Customer "ZZAUTOTEST C368150 Enter" has four Approved work orders: units "C368150-U1" and "C368150-U2" led by "ZZAUTOTEST C368150 Ana", unit "C368150-U3" led by "ZZAUTOTEST C368150 Ben", and unit "C368150-U4" with no lead technician.
- Starting screen: "Work Orders" \> "All" tab, "Board View" shown, "Search" holding "ZZAUTOTEST C368150 Enter", no filter chosen, "Assigned to me" off, browser window at least 1024 px wide.
- If any record named above is missing, mark this test Blocked: "setup not done".

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

#### SETUP-C368152 — [C368152](https://shopview.testrail.io/index.php?/cases/view/368152) Reassign and Unassign work from the keyboard through the More actions menu

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- Technicians "ZZAUTOTEST C368152 Ana" and "ZZAUTOTEST C368152 Ben" are active at this location, and both are pinned in your Board View (no other technician is pinned).
- Customer "ZZAUTOTEST C368152 Reassign" has three Approved work orders: unit "C368152-U1" led by "ZZAUTOTEST C368152 Ana", unit "C368152-U3" led by "ZZAUTOTEST C368152 Ben", and unit "C368152-U4" with no lead technician. None has a shift on the Schedule.
- Starting screen: "Work Orders" \> "All" tab, "Board View" shown, "Search" holding "ZZAUTOTEST C368152 Reassign", no filter chosen, "Assigned to me" off, browser window at least 1024 px wide.
- If any record named above is missing, mark this test Blocked: "setup not done".

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

#### SETUP-C97020 — [C97020](https://shopview.testrail.io/index.php?/cases/view/97020) The keyboard cannot get around permission or status limits

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run). A second user, signed in a second browser, has the custom role "ZZAUTOTEST C97020 View Only" (Work orders: View only).
- Technician "ZZAUTOTEST C97020 Ana" is active at this location and is pinned in Board View for both users.
- Customer "ZZAUTOTEST C97020 Limits" has two work orders led by "ZZAUTOTEST C97020 Ana": unit "C97020-U1", Approved, and unit "C97020-U2", Invoiced. None has a shift on the Schedule.
- Starting screen: "Work Orders" \> "All" tab, "Board View" shown, "Search" holding "ZZAUTOTEST C97020 Limits", no filter chosen, "Assigned to me" off, browser window at least 1024 px wide, for both users.
- If any record named above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A, ACCOUNT-B. **Run first:** SETUP-ADMIN, SETUP-VIEWONLY.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C97020", Last Name "Ana" (shows as "ZZAUTOTEST C97020 Ana").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C97020 Limits"; units "C97020-U1", "C97020-U2".
3.  **P-WO** (ACCOUNT-A): Unit "C97020-U1"; customer "ZZAUTOTEST C97020 Limits"; lead "ZZAUTOTEST C97020 Ana".
4.  **P-WO-INVOICED** (ACCOUNT-A): Unit "C97020-U2"; customer "ZZAUTOTEST C97020 Limits"; lead "ZZAUTOTEST C97020 Ana".
5.  **P-PIN** (ACCOUNT-A): technicians "ZZAUTOTEST C97020 Ana".
6.  **P-PIN** (ACCOUNT-B): technicians "ZZAUTOTEST C97020 Ana"; signed in as ACCOUNT-B.
7.  **P-START** (ACCOUNT-A): starting screen: Board View, All tab, Search "ZZAUTOTEST C97020 Limits", for ACCOUNT-A and ACCOUNT-B.

**Check:** Every precondition line of the case is true on screen, read top to bottom.

#### SETUP-C96945 — [C96945](https://shopview.testrail.io/index.php?/cases/view/96945) A card's More actions menu appears on hover or focus and offers Reassign

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- Technician "ZZAUTOTEST C96945 Ana" is active at this location and is pinned in your Board View.
- Customer "ZZAUTOTEST C96945 Card Menu" has one Approved work order, unit "C96945-U1", led by "ZZAUTOTEST C96945 Ana".
- Starting screen: "Work Orders" \> "All" tab, "Board View" shown, "Search" holding "ZZAUTOTEST C96945 Card Menu", no filter chosen, "Assigned to me" off, browser window at least 1024 px wide.
- If any record named above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C96945", Last Name "Ana" (shows as "ZZAUTOTEST C96945 Ana").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C96945 Card Menu"; units "C96945-U1".
3.  **P-WO** (ACCOUNT-A): Unit "C96945-U1"; customer "ZZAUTOTEST C96945 Card Menu"; lead "ZZAUTOTEST C96945 Ana".
4.  **P-PIN** (ACCOUNT-A): technicians "ZZAUTOTEST C96945 Ana".
5.  **P-START** (ACCOUNT-A): starting screen: Board View, All tab, Search "ZZAUTOTEST C96945 Card Menu".

**Check:** Every precondition line of the case is true on screen, read top to bottom.

#### SETUP-C614711 — [C614711](https://shopview.testrail.io/index.php?/cases/view/614711) Work orders of a deleted lead sit under Deleted technician, which takes no drops

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- Technicians "ZZAUTOTEST C614711 Dana" and "ZZAUTOTEST C614711 Eli" are active at this location with the "Technician" role. "ZZAUTOTEST C614711 Dana" was made for this case only and has no labor on any work order, because this test deletes that staff record.
- Customer "ZZAUTOTEST C614711 Deleted Lead" has two Approved work orders: unit "C614711-U1" led by "ZZAUTOTEST C614711 Dana", and unit "C614711-U2" with no lead technician.
- Starting screen: your initials (top right) \> "Settings" \> "Staff", in a browser window at least 1024 px wide.
- If any record named above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C614711", Last Name "Dana" (shows as "ZZAUTOTEST C614711 Dana").
2.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C614711", Last Name "Eli" (shows as "ZZAUTOTEST C614711 Eli").
3.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C614711 Deleted Lead"; units "C614711-U1", "C614711-U2".
4.  **P-WO** (ACCOUNT-A): Unit "C614711-U1"; customer "ZZAUTOTEST C614711 Deleted Lead"; lead "ZZAUTOTEST C614711 Dana".
5.  **P-WO** (ACCOUNT-A): Unit "C614711-U2"; customer "ZZAUTOTEST C614711 Deleted Lead"; no lead.
6.  **P-START** (ACCOUNT-A): starting screen: Settings \> Staff page.

**Check:** Every precondition line of the case is true on screen, read top to bottom.

#### SETUP-C96916 — [C96916](https://shopview.testrail.io/index.php?/cases/view/96916) Browser Back restores scroll, tab and filters in Tech View and Board View

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- Eight technicians are active at this location: "ZZAUTOTEST C96916 Ana", "… Ben", "… Cal", "… Dee", "… Eve", "… Fay", "… Gus" and "… Hal" (each name starts "ZZAUTOTEST C96916").
- Customer "ZZAUTOTEST C96916 Scroll Back" has about 20 Approved work orders led by "ZZAUTOTEST C96916 Hal" (units "C96916-H01" to "C96916-H20") and 2 Approved work orders led by each of the other seven technicians.
- With that search, Board View is wider than the window (you scroll right to reach "ZZAUTOTEST C96916 Hal"'s column), and that column and the Tech View table are taller than the window.
- Starting screen: "Work Orders" \> "Work Orders" tab, "Board View" shown, "Search" holding "ZZAUTOTEST C96916 Scroll Back", no filter chosen, "Assigned to me" off, "Status" filter set to "Approved" only, browser window at least 1024 px wide.
- If any record named above is missing, mark this test Blocked: "setup not done".

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

#### SETUP-C368214 — [C368214](https://shopview.testrail.io/index.php?/cases/view/368214) After Back and Forward the List keeps its tab, search and filters

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- Customer "ZZAUTOTEST C368214 Back Forward" has one Approved work order, unit "C368214-U1".
- Starting screen: "Work Orders" \> "Work Orders" tab, "List" shown, no filter chosen, "Assigned to me" off, "Search" empty, browser window at least 1024 px wide.
- If any record named above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C368214 Back Forward"; units "C368214-U1".
2.  **P-WO** (ACCOUNT-A): Unit "C368214-U1"; customer "ZZAUTOTEST C368214 Back Forward"; no lead.
3.  **P-START** (ACCOUNT-A): starting screen: List, Work Orders tab, Search empty.

**Check:** Every precondition line of the case is true on screen, read top to bottom.

#### SETUP-C590110 — [C590110](https://shopview.testrail.io/index.php?/cases/view/590110) Display switcher, filter and Search icons match the design in every display

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "DC-01-toolbar-tech-view-light-1440.png" and "DC-01-toolbar-board-view-light-1440.png" attached to this case are open beside it at 100% (actual size). Names, numbers and the rank numbers in the pictures are sample data.
- Customer "ZZAUTOTEST C590110 Toolbar Icons" has one Approved work order, unit "C590110-U1", led by technician "ZZAUTOTEST C590110 Ana".
- Starting screen: "Work Orders" \> "All" tab, "List" shown, no filter chosen, "Assigned to me" off, "Search" empty, density "Regular".
- If any record named above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590110", Last Name "Ana" (shows as "ZZAUTOTEST C590110 Ana").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590110 Toolbar Icons"; units "C590110-U1".
3.  **P-WO** (ACCOUNT-A): Unit "C590110-U1"; customer "ZZAUTOTEST C590110 Toolbar Icons"; lead "ZZAUTOTEST C590110 Ana".
4.  **P-START** (ACCOUNT-A): starting screen: List, All tab, density Regular, Search empty.

**Check:** Every precondition line of the case is true on screen, read top to bottom.

#### SETUP-C590112 — [C590112](https://shopview.testrail.io/index.php?/cases/view/590112) Tech View table runs edge to edge on white and the Status column fits its pills

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "DC-03-tech-view-regular-light-1440.png" and "DC-03-tech-view-regular-light-1536.png" attached to this case are open beside it at 100% (actual size). Names, numbers and the rank numbers in the pictures are sample data. Your screen lets you widen the window to 1536 px.
- Customer "ZZAUTOTEST C590112 Short" has an Approved work order, unit "C590112-S1", led by technician "ZZAUTOTEST C590112 Ana", and an Estimate, unit "C590112-S2", with no lead technician.
- Customer "ZZAUTOTEST C590112 Review" has a work order in "Ready For Review", unit "C590112-R1", led by "ZZAUTOTEST C590112 Ana".
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, no filter chosen, "Assigned to me" off, "Search" empty, density "Regular".
- If any record named above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590112", Last Name "Ana" (shows as "ZZAUTOTEST C590112 Ana").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590112 Short"; units "C590112-S1", "C590112-S2".
3.  **P-WO** (ACCOUNT-A): Unit "C590112-S1"; customer "ZZAUTOTEST C590112 Short"; lead "ZZAUTOTEST C590112 Ana".
4.  **P-WO-ESTIMATE** (ACCOUNT-A): Unit "C590112-S2"; customer "ZZAUTOTEST C590112 Short"; no lead.
5.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590112 Review"; units "C590112-R1".
6.  **P-WO-REVIEW** (ACCOUNT-A): Unit "C590112-R1"; customer "ZZAUTOTEST C590112 Review"; lead "ZZAUTOTEST C590112 Ana".
7.  **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, density Regular, Search empty.

**Check:** Every precondition line of the case is true on screen, read top to bottom.

#### SETUP-C590114 — [C590114](https://shopview.testrail.io/index.php?/cases/view/590114) Tech View cells show a blue number, a thin progress bar and the advisor's avatar

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- The browser window is 1440 px wide with the zoom at 100%, and the design picture "DC-05-tech-view-rows-regular-light-1440.png" attached to this case is open beside it at 100% (actual size). Names, numbers and the rank numbers in the pictures are sample data.
- Technicians "ZZAUTOTEST C590114 Eva" (with a profile photo) and "ZZAUTOTEST C590114 Finn" (no photo) are active at this location.
- Customer "ZZAUTOTEST C590114 Cell Styles" has an Approved work order, unit "C590114-U1", led by "ZZAUTOTEST C590114 Eva", with a service advisor and one approved line whose technician is "ZZAUTOTEST C590114 Finn", who is clocked in to it; and an Invoiced work order, unit "C590114-U2", led by "ZZAUTOTEST C590114 Eva".
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, "Search" holding "ZZAUTOTEST C590114 Cell Styles", no filter chosen, "Assigned to me" off, density "Regular".
- If any record named above is missing, mark this test Blocked: "setup not done".

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

#### SETUP-C590117 — [C590117](https://shopview.testrail.io/index.php?/cases/view/590117) Tech View group headers show grip, arrow, avatar, name, pin and count

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "DC-08-tech-view-group-headers-light-1440.png" and "DC-08-tech-view-collapsed-light-1440.png" attached to this case are open beside it at 100% (actual size). Names, numbers and the rank numbers in the pictures are sample data.
- Technicians "ZZAUTOTEST C590117 Ines" (with a profile photo) and "ZZAUTOTEST C590117 Jon" (no photo) are active at this location, and no technician is pinned in your Tech View.
- Customer "ZZAUTOTEST C590117 Group Header" has Approved work orders "C590117-U1" led by "ZZAUTOTEST C590117 Ines" and "C590117-U2" led by "ZZAUTOTEST C590117 Jon", and an Estimate, unit "C590117-U3", with no lead technician.
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, "Search" holding "ZZAUTOTEST C590117 Group Header", no filter chosen, "Assigned to me" off, density "Regular".
- If any record named above is missing, mark this test Blocked: "setup not done".

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

#### SETUP-C590119 — [C590119](https://shopview.testrail.io/index.php?/cases/view/590119) Board View column header shows grip, avatar, name, pin and count as designed

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "DC-10-board-column-headers-light-1440.png" and "DC-10-board-pinned-light-1440.png" attached to this case are open beside it at 100% (actual size). Names, numbers and the rank numbers in the pictures are sample data.
- Technicians "ZZAUTOTEST C590119 Lea" (with a profile photo), "ZZAUTOTEST C590119 Max" (no photo), "ZZAUTOTEST C590119 Nia" and "ZZAUTOTEST C590119 Oli" are active at this location, and no technician is pinned in your Board View.
- Customer "ZZAUTOTEST C590119 Column Header" has Approved work orders "C590119-U1" led by "ZZAUTOTEST C590119 Lea" and "C590119-U2" led by "ZZAUTOTEST C590119 Max", and an Estimate, unit "C590119-U3", with no lead technician.
- Starting screen: "Work Orders" \> "All" tab, "Board View" shown, "Search" holding "ZZAUTOTEST C590119 Column Header", no filter chosen, "Assigned to me" off, density "Regular".
- If any record named above is missing, mark this test Blocked: "setup not done".

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

#### SETUP-C590128 — [C590128](https://shopview.testrail.io/index.php?/cases/view/590128) Density changes Tech View row, avatar and bar sizes, not Board card avatars

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "DC-06-tech-view-compact-light-1440.png" and "DC-06-tech-view-regular-light-1440.png" and "DC-06-tech-view-comfortable-light-1440.png" attached to this case are open beside it at 100% (actual size). Names, numbers and the rank numbers in the pictures are sample data.
- Customer "ZZAUTOTEST C590128 Density" has an Approved work order, unit "C590128-U1", led by technician "ZZAUTOTEST C590128 Ana", with a service advisor and line technician "ZZAUTOTEST C590128 Ben" on its approved line; Board View's "Fields to display" has "Line technicians" on.
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, "Search" holding "ZZAUTOTEST C590128 Density", no filter chosen, "Assigned to me" off, density "Regular".
- If any record named above is missing, mark this test Blocked: "setup not done".

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

#### SETUP-C590113 — [C590113](https://shopview.testrail.io/index.php?/cases/view/590113) Tech View opens on 13 default columns with small grey header labels

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run). You have never changed Tech View's columns.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "DC-04-tech-view-header-row-1440.png" and "DC-04-tech-view-all-columns-1440.png" attached to this case are open beside it at 100% (actual size). Names, numbers and the rank numbers in the pictures are sample data. Your screen lets you widen the window to 1536 px.
- Customer "ZZAUTOTEST C590113 Columns" has an Approved work order, unit "C590113-U1", led by technician "ZZAUTOTEST C590113 Ana".
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, "Search" holding "ZZAUTOTEST C590113 Columns", no filter chosen, "Assigned to me" off, density "Regular".
- If any record named above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590113", Last Name "Ana" (shows as "ZZAUTOTEST C590113 Ana").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590113 Columns"; units "C590113-U1".
3.  **P-WO** (ACCOUNT-A): Unit "C590113-U1"; customer "ZZAUTOTEST C590113 Columns"; lead "ZZAUTOTEST C590113 Ana".
4.  ACCOUNT-A must never have changed Tech View's columns; if it has, use a brand-new Admin user for this case.
5.  **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, density Regular, Search "ZZAUTOTEST C590113 Columns".

**Check:** Every precondition line of the case is true on screen, read top to bottom.

#### SETUP-C590122 — [C590122](https://shopview.testrail.io/index.php?/cases/view/590122) Empty groups, empty columns and no-results pages look as designed

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "DC-18-tech-technician-chosen-light-1440.png" and "DC-13-tech-search-empty-light-1440.png" attached to this case are open beside it at 100% (actual size). Names, numbers and the rank numbers in the pictures are sample data. The pictures' words differ from the ones checked here; compare the look and the place only.
- Technician "ZZAUTOTEST C590122 Sam" is active at this location and leads no work orders.
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, no filter chosen, "Assigned to me" off, "Search" empty, density "Regular".
- If any record named above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590122", Last Name "Sam" (shows as "ZZAUTOTEST C590122 Sam").
2.  "ZZAUTOTEST C590122 Sam" must lead no work orders.
3.  **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, density Regular, Search empty.

**Check:** Tech View shows "ZZAUTOTEST C590122 Sam"'s group with "No work orders".

#### SETUP-C590127 — [C590127](https://shopview.testrail.io/index.php?/cases/view/590127) Technician filter sits after Assigned to me in Tech View and Board View

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- The browser window is 1440 px wide with the zoom at 100%, and the design picture "DC-18-tech-technician-chip-open-light-1440.png" attached to this case is open beside it at 100% (actual size). Names, numbers and the rank numbers in the pictures are sample data. The picture's Department filter is left out of this release.
- Technician "ZZAUTOTEST C590127 Yan" is active at this location and leads the Approved work order of customer "ZZAUTOTEST C590127 Technician Filter", unit "C590127-U1".
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, no filter chosen, "Assigned to me" off, "Search" empty, density "Regular".
- If any record named above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590127", Last Name "Yan" (shows as "ZZAUTOTEST C590127 Yan").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590127 Technician Filter"; units "C590127-U1".
3.  **P-WO** (ACCOUNT-A): Unit "C590127-U1"; customer "ZZAUTOTEST C590127 Technician Filter"; lead "ZZAUTOTEST C590127 Yan".
4.  **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, density Regular, Search empty.

**Check:** Every precondition line of the case is true on screen, read top to bottom.

#### SETUP-N1 — [C614714](https://shopview.testrail.io/index.php?/cases/view/614714) A lead whose Time Clock is turned off keeps a named column that takes no drops

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- Technician "ZZAUTOTEST N1 Tim" is active at this location with the "Technician" role and "Time Clock" on. It was made for this case only, because this test turns that Time Clock off.
- Customer "ZZAUTOTEST N1 Time Clock Off" has two Approved work orders: unit "N1-U1" led by "ZZAUTOTEST N1 Tim", and unit "N1-U2" with no lead technician.
- Starting screen: your initials (top right) \> "Settings" \> "Staff", in a browser window at least 1024 px wide.
- If any record named above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST N1", Last Name "Tim" (shows as "ZZAUTOTEST N1 Tim").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST N1 Time Clock Off"; units "N1-U1", "N1-U2".
3.  **P-WO** (ACCOUNT-A): Unit "N1-U1"; customer "ZZAUTOTEST N1 Time Clock Off"; lead "ZZAUTOTEST N1 Tim".
4.  **P-WO** (ACCOUNT-A): Unit "N1-U2"; customer "ZZAUTOTEST N1 Time Clock Off"; no lead.
5.  Each run needs "ZZAUTOTEST N1 Tim" with Time Clock ON at the start: turn it back on after the test (Settings \> Staff \> pencil \> Time Clock on) and set N1-U1's lead back to that staff member.
6.  **P-START** (ACCOUNT-A): starting screen: Settings \> Staff page.

**Check:** Every precondition line of the case is true on screen, read top to bottom.

#### SETUP-N2 — [C614715](https://shopview.testrail.io/index.php?/cases/view/614715) With no work orders at all, Tech View and Board View show No work orders yet

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role and can switch to location "ZZAUTOTEST Empty Location".
- Location "ZZAUTOTEST Empty Location" has no work orders at all: no work orders, estimates or completed work.
- Starting screen: any page, in a browser window at least 1024 px wide.
- If any record named above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-EMPTY-LOCATION** (ACCOUNT-A): as described in the procedure table.

**Check:** At "ZZAUTOTEST Empty Location" List shows no work orders.

#### SETUP-N3 — [C614716](https://shopview.testrail.io/index.php?/cases/view/614716) Density and Columns tooltips open above their button and hide while open

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- The browser window is 1440 px wide with the zoom at 100%.
- Customer "ZZAUTOTEST N3 Tooltips" has an Approved work order, unit "N3-U1", led by technician "ZZAUTOTEST N3 Tia".
- Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, "Search" holding "ZZAUTOTEST N3 Tooltips", no filter chosen, "Assigned to me" off.
- If any record named above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST N3", Last Name "Tia" (shows as "ZZAUTOTEST N3 Tia").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST N3 Tooltips"; units "N3-U1".
3.  **P-WO** (ACCOUNT-A): Unit "N3-U1"; customer "ZZAUTOTEST N3 Tooltips"; lead "ZZAUTOTEST N3 Tia".
4.  **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, Search "ZZAUTOTEST N3 Tooltips".

**Check:** Every precondition line of the case is true on screen, read top to bottom.

#### SETUP-N4 — [C614717](https://shopview.testrail.io/index.php?/cases/view/614717) Row and card name bubbles open above the avatar, headers keep the plain tip

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at location "Staging Heavy Duty - 9919" (on another site: the location named in the test run).
- Six technicians are active at this location: "ZZAUTOTEST N4 Ana", "… Ben", "… Cal", "… Dee", "… Eve" and "… Fay" (each name starts "ZZAUTOTEST N4").
- Customer "ZZAUTOTEST N4 Name Bubbles" has an Approved work order, unit "N4-U1", led by "ZZAUTOTEST N4 Ana", with five approved lines whose technicians are "… Ben", "… Cal", "… Dee", "… Eve" and "… Fay", so its avatars end in "+N".
- Board View's "Fields to display" has "Line technicians" on. Starting screen: "Work Orders" \> "All" tab, "Tech View" shown, "Search" holding "ZZAUTOTEST N4 Name Bubbles", no filter chosen, "Assigned to me" off, browser window at least 1024 px wide.
- If any record named above is missing, mark this test Blocked: "setup not done".

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
| [C590110](https://shopview.testrail.io/index.php?/cases/view/590110) Display switcher, filter and Search icons match the design in every display      | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590110                |
| [C590112](https://shopview.testrail.io/index.php?/cases/view/590112) Tech View table runs edge to edge on white and the Status column fits its pills  | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590112                |
| [C590114](https://shopview.testrail.io/index.php?/cases/view/590114) Tech View cells show a blue number, a thin progress bar and the advisor's avatar | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590114                |
| [C590117](https://shopview.testrail.io/index.php?/cases/view/590117) Tech View group headers show grip, arrow, avatar, name, pin and count            | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590117                |
| [C590119](https://shopview.testrail.io/index.php?/cases/view/590119) Board View column header shows grip, avatar, name, pin and count as designed     | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590119                |
| [C590128](https://shopview.testrail.io/index.php?/cases/view/590128) Density changes Tech View row, avatar and bar sizes, not Board card avatars      | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590128                |
| [C590113](https://shopview.testrail.io/index.php?/cases/view/590113) Tech View opens on 13 default columns with small grey header labels              | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590113                |
| [C590122](https://shopview.testrail.io/index.php?/cases/view/590122) Empty groups, empty columns and no-results pages look as designed                | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590122                |
| [C590127](https://shopview.testrail.io/index.php?/cases/view/590127) Technician filter sits after Assigned to me in Tech View and Board View          | ACCOUNT-A            | SETUP-ADMIN, SETUP-C590127                |
| [C614714](https://shopview.testrail.io/index.php?/cases/view/614714) A lead whose Time Clock is turned off keeps a named column that takes no drops   | ACCOUNT-A            | SETUP-ADMIN, SETUP-N1                     |
| [C614715](https://shopview.testrail.io/index.php?/cases/view/614715) With no work orders at all, Tech View and Board View show No work orders yet     | ACCOUNT-A            | SETUP-ADMIN, SETUP-N2                     |
| [C614716](https://shopview.testrail.io/index.php?/cases/view/614716) Density and Columns tooltips open above their button and hide while open         | ACCOUNT-A            | SETUP-ADMIN, SETUP-N3                     |
| [C614717](https://shopview.testrail.io/index.php?/cases/view/614717) Row and card name bubbles open above the avatar, headers keep the plain tip      | ACCOUNT-A            | SETUP-ADMIN, SETUP-N4                     |

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

## 8. Traceability

Every expected result in the cases comes from the sentence quoted against its step. The quotes are word for word; a checker (build_check.py) refuses any case whose quote is not found verbatim in its source.

### [C97021](https://shopview.testrail.io/index.php?/cases/view/97021) Tab enters each view once and the arrow keys move between cards and rows

PRD v55/v60/v61 S11-R1 and S11-R3: each view is one Tab stop landing on a work order, arrow keys move between cards, rows, headers and columns, Tab then reaches the focused item's own controls and leaves the view (was: Tab on every card, row and header).

- Steps 2, 9 — **S11-R1** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Each view is a single Tab stop. Tab lands on one work order row (Tech View) or card (Board View), the one last focused, or the first one when none has been (never a group or column header while a work order is shown; when every group is collapsed, Tab lands on the first group header; after the user arrows onto a header and tabs out and back in, Tab returns to a work order row while any row is shown; on Board View, if the last-focused card has scrolled out of view in its column, Tab lands on the first card in view); the focused row or card shows a visible focus ring.”
- Steps 3, 4, 5, 6, 10 — **S11-R3** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Inside a view the arrow keys move focus: Up and Down move between rows and group headers in Tech View, and between cards and the column header within a Board View column; Left and Right move between Board View columns. Tab from a focused row, card or header reaches its own controls (more actions, pin, collapse) in order, then leaves the view. Tab never stops on every row.”
- Steps 7 — **S2-R17** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Tech View orders pinned technicians the same way as Board View: after the fixed Unassigned group and before unpinned technicians, each newly pinned technician after the existing pins (S3-R15, S3-R16).”
- Steps 7 — **S2-R2** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Keep Unassigned, containing work orders without a lead technician, fixed before all technician groups.”
- Steps all — **Story 11 user story** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “As a keyboard user, I want to navigate work orders and their actions so that these controls are usable without a mouse.”

Jira: SV-10054. Last checked against build v26.40.8-7a95011 on 10/8/2026, before the expected results changed on 16 Oct 2026; not yet checked against a build since.

### [C368150](https://shopview.testrail.io/index.php?/cases/view/368150) Enter opens the focused card or row, and no key drags it

PRD v55/v61 S11-R1 and S11-R3: the focused card or row is reached with one Tab and the arrow keys (was: Tab until the card). Space and Shift with the arrows still move nothing; plain arrows now move focus.

- Steps 2, 9 — **S11-R1** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Each view is a single Tab stop. Tab lands on one work order row (Tech View) or card (Board View), the one last focused, or the first one when none has been (never a group or column header while a work order is shown; when every group is collapsed, Tab lands on the first group header; after the user arrows onto a header and tabs out and back in, Tab returns to a work order row while any row is shown; on Board View, if the last-focused card has scrolled out of view in its column, Tab lands on the first card in view); the focused row or card shows a visible focus ring.”
- Steps 3, 10 — **S11-R3** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Inside a view the arrow keys move focus: Up and Down move between rows and group headers in Tech View, and between cards and the column header within a Board View column; Left and Right move between Board View columns. Tab from a focused row, card or header reaches its own controls (more actions, pin, collapse) in order, then leaves the view. Tab never stops on every row.”
- Steps 5, 11 — **S11-R4** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Enter on a focused row or card opens the work order, the same as a click.”
- Steps 13 — **S11-R10** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Opening a work order by keyboard is Enter (S11-R4); dragging is by mouse or touch only, so the two never conflict. A mouse click without a drag opens the work order as today (S2-R8).”
- Steps 4 — **S11-R9** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Reassigning by keyboard goes through the more-actions menu: Reassign lead technician opens the Reassign dialog, and Unassign is a menu item. There is no keyboard drag in this release, so reordering work orders and technicians is by mouse or touch only.”
- Steps 4 — **Out of Scope** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Reordering work orders or technicians by keyboard. Reordering is by mouse or touch drag in this release (S11-R9).”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 1, 6, 7, 8, 12.

Jira: SV-10054. Last checked against build v26.40.8-7a95011 on 10/8/2026, before the expected results changed on 16 Oct 2026; not yet checked against a build since.

### [C368152](https://shopview.testrail.io/index.php?/cases/view/368152) Reassign and Unassign work from the keyboard through the More actions menu

PRD v55/v61 S11-R1 and S11-R3: cards are reached with one Tab and the arrow keys, then Tab to the card's own More actions button (was: Tab until the card). The old last step (no key drags a card) is left to C368150, which checks it.

- Steps 2 — **S11-R1** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Each view is a single Tab stop. Tab lands on one work order row (Tech View) or card (Board View), the one last focused, or the first one when none has been (never a group or column header while a work order is shown; when every group is collapsed, Tab lands on the first group header; after the user arrows onto a header and tabs out and back in, Tab returns to a work order row while any row is shown; on Board View, if the last-focused card has scrolled out of view in its column, Tab lands on the first card in view); the focused row or card shows a visible focus ring.”
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
- Steps 2, 8 — **S11-R1** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Each view is a single Tab stop. Tab lands on one work order row (Tech View) or card (Board View), the one last focused, or the first one when none has been (never a group or column header while a work order is shown; when every group is collapsed, Tab lands on the first group header; after the user arrows onto a header and tabs out and back in, Tab returns to a work order row while any row is shown; on Board View, if the last-focused card has scrolled out of view in its column, Tab lands on the first card in view); the focused row or card shows a visible focus ring.”
- Steps 3, 4, 9, 10 — **S11-R3** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Inside a view the arrow keys move focus: Up and Down move between rows and group headers in Tech View, and between cards and the column header within a Board View column; Left and Right move between Board View columns. Tab from a focused row, card or header reaches its own controls (more actions, pin, collapse) in order, then leaves the view. Tab never stops on every row.”
- Steps all — **Tech plan Phase 11 tests** (tech plan (upload of 8 Oct 2026)): “a keyboard-initiated reassign is refused for a locked status and without permission (S11-N1).”

Jira: SV-10054,SV-10047. Last checked against build v26.40.8-7a95011 on 10/8/2026, before the expected results changed on 16 Oct 2026; not yet checked against a build since.

### [C96945](https://shopview.testrail.io/index.php?/cases/view/96945) A card's More actions menu appears on hover or focus and offers Reassign

PRD v55/v61 S11-R1 and S11-R3: the card gets keyboard focus with one Tab and the arrow keys (was: Tab repeatedly). The menu label is now checked as "Reassign lead technician" (the build's label, as in the other cases). Automated case.

- Steps 1, 5, 8 — **S3-R13** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Reveal the card’s more-actions overlay on hover or keyboard focus.”
- Steps 3 — **S3-R14** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Include Reassign lead technician in the card’s more-actions menu.”
- Steps 7, 8 — **S11-R1** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Each view is a single Tab stop. Tab lands on one work order row (Tech View) or card (Board View), the one last focused, or the first one when none has been (never a group or column header while a work order is shown; when every group is collapsed, Tab lands on the first group header; after the user arrows onto a header and tabs out and back in, Tab returns to a work order row while any row is shown; on Board View, if the last-focused card has scrolled out of view in its column, Tab lands on the first card in view); the focused row or card shows a visible focus ring.”
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

### [C590110](https://shopview.testrail.io/index.php?/cases/view/590110) Display switcher, filter and Search icons match the design in every display

PRD v55/v58 S1-R9a and S2-R23: the display switcher's icons are the design's slate in every view, List included, and the toolbar icons are slate. Steps compressed to ten (the density menu now closes by switching view).

- Steps 1, 3, 7 — **S1-R9a** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “The switcher uses the design’s icons at 20px: List is Lucide \`list\`, Tech View is \`user-round\`, Board View is \`square-kanban\`. In Tech View and Board View these icons are the design’s: density (\`row-height\` in Tech View, \`card-height\` in Board View, custom icons in the design system’s icon set), collapse chevron (\`chevron-down\`), pin and unpin (\`pin\` / \`pin-off\`), Invoiced or Paid lock (\`lock\`), Unassigned avatar (\`user-round\`) and the empty state when there are no work orders at all (\`clipboard-list\`). The filtered no-results state is the List’s, magnifier included (S1-N1). The filter chips and Search use the design file’s icons in every display option, List included, each exactly as the design file draws it. The display switcher (new on every view, List included) shows the design’s slate icons in every view, so it keeps one color as the user moves between views. These are the only changes to List. Every other List icon is unchanged.”
- Steps 1, 3, 4, 7 — **S2-R23** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “In Tech View and Board View, as in the design: a technician avatar without a photo is a light-grey circle (--sv-grey-100, \#EEF2F6) with initials in --sv-grey-600 (#4B5565) in light mode, which meets accessible contrast (6.7:1; the design file’s \#697586 is 4.2:1); dark mode uses the design’s dark colors; group and column header names are 14px, weight 600, in the design’s slate text color (#364152), with the design’s smaller, lighter initials; Board card customer and total price are weight 500; toolbar and switcher icons are the design’s slate color (the switcher in List too, S1-R9a). Technician avatars, and the Service Advisor avatar, follow density in Tech View as in the design: 20px, 24px and 32px on rows and 24px, 28px and 36px on group headers at Compact, Regular and Comfortable; Board View card avatars stay 24px. The Progress bar is 48 by 4px at Compact, as in the design. The name bubble on hover over a technician avatar on a row or card (the +N included) opens above the avatar, in both views; group and column header avatars keep the browser’s plain name tip, because the name is printed beside them. In Tech View, Status, Waiting On Parts and Progress are left-aligned. The Density and Columns tooltips open above their button, like the switcher’s (S1-R9b), and are hidden while their menu is open. List is unchanged.”
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

### [C590112](https://shopview.testrail.io/index.php?/cases/view/590112) Tech View table runs edge to edge on white and the Status column fits its pills

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

### [C590114](https://shopview.testrail.io/index.php?/cases/view/590114) Tech View cells show a blue number, a thin progress bar and the advisor's avatar

PRD v55 S2-R20: the number link is the design system's link colour (#175CD3), darker than the design file's blue (was: the same blue as the picture). PRD v55/v60 S2-R23: Status, Waiting On Parts and Progress are left-aligned, and a row avatar's name bubble opens above it. Clicking the number (opens the work order) is left to C96932.

- Steps 1, 2, 4, 10 — **S2-R20** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Tech View’s cells follow the design: the work order number shows as a link in the design system’s link color (#175CD3), which meets accessible contrast on white; Progress shows as a thin bar with the percentage beside it, with no hours line under it at any density (S6-R6); Service Advisor shows the advisor’s avatar before the name. Clocked In keeps List’s display (S5-R11).”
- Steps 3, 6 — **S2-R23** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “In Tech View and Board View, as in the design: a technician avatar without a photo is a light-grey circle (--sv-grey-100, \#EEF2F6) with initials in --sv-grey-600 (#4B5565) in light mode, which meets accessible contrast (6.7:1; the design file’s \#697586 is 4.2:1); dark mode uses the design’s dark colors; group and column header names are 14px, weight 600, in the design’s slate text color (#364152), with the design’s smaller, lighter initials; Board card customer and total price are weight 500; toolbar and switcher icons are the design’s slate color (the switcher in List too, S1-R9a). Technician avatars, and the Service Advisor avatar, follow density in Tech View as in the design: 20px, 24px and 32px on rows and 24px, 28px and 36px on group headers at Compact, Regular and Comfortable; Board View card avatars stay 24px. The Progress bar is 48 by 4px at Compact, as in the design. The name bubble on hover over a technician avatar on a row or card (the +N included) opens above the avatar, in both views; group and column header avatars keep the browser’s plain name tip, because the name is printed beside them. In Tech View, Status, Waiting On Parts and Progress are left-aligned. The Density and Columns tooltips open above their button, like the switcher’s (S1-R9b), and are hidden while their menu is open. List is unchanged.”
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

### [C590117](https://shopview.testrail.io/index.php?/cases/view/590117) Tech View group headers show grip, arrow, avatar, name, pin and count

PRD v55 S2-R11a: the Tech View group-header pin is always shown, grey when unpinned and blue when pinned (was: pin not judged, question open). PRD v55/v58/v61 S2-R23: initials grey-600 (darker than the design file), header names slate semibold, header avatars keep the browser's plain name tip.

- Steps 2, 6, 11 — **S2-R11a** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “The pin on each Tech View technician group header is always shown, styled as on Board View’s column headers: grey when unpinned, blue when pinned, and dimmed on unpinned technicians once three are pinned (S3-R8).”
- Steps 2, 5, 9, 10 — **S2-R23** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “In Tech View and Board View, as in the design: a technician avatar without a photo is a light-grey circle (--sv-grey-100, \#EEF2F6) with initials in --sv-grey-600 (#4B5565) in light mode, which meets accessible contrast (6.7:1; the design file’s \#697586 is 4.2:1); dark mode uses the design’s dark colors; group and column header names are 14px, weight 600, in the design’s slate text color (#364152), with the design’s smaller, lighter initials; Board card customer and total price are weight 500; toolbar and switcher icons are the design’s slate color (the switcher in List too, S1-R9a). Technician avatars, and the Service Advisor avatar, follow density in Tech View as in the design: 20px, 24px and 32px on rows and 24px, 28px and 36px on group headers at Compact, Regular and Comfortable; Board View card avatars stay 24px. The Progress bar is 48 by 4px at Compact, as in the design. The name bubble on hover over a technician avatar on a row or card (the +N included) opens above the avatar, in both views; group and column header avatars keep the browser’s plain name tip, because the name is printed beside them. In Tech View, Status, Waiting On Parts and Progress are left-aligned. The Density and Columns tooltips open above their button, like the switcher’s (S1-R9b), and are hidden while their menu is open. List is unchanged.”
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

### [C590119](https://shopview.testrail.io/index.php?/cases/view/590119) Board View column header shows grip, avatar, name, pin and count as designed

PRD v55/v58 S2-R23: avatar initials are grey-600, a little darker than the design file's, and header names slate semibold (was: as in the design picture).

- Steps 1, 2, 3 — **S3-R12** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Each column header shows the technician’s name, avatar, and a count of the work orders currently shown in that column, after the filter view and filters are applied, so the count always matches the cards listed.”
- Steps 2 — **S2-R23** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “In Tech View and Board View, as in the design: a technician avatar without a photo is a light-grey circle (--sv-grey-100, \#EEF2F6) with initials in --sv-grey-600 (#4B5565) in light mode, which meets accessible contrast (6.7:1; the design file’s \#697586 is 4.2:1); dark mode uses the design’s dark colors; group and column header names are 14px, weight 600, in the design’s slate text color (#364152), with the design’s smaller, lighter initials; Board card customer and total price are weight 500; toolbar and switcher icons are the design’s slate color (the switcher in List too, S1-R9a). Technician avatars, and the Service Advisor avatar, follow density in Tech View as in the design: 20px, 24px and 32px on rows and 24px, 28px and 36px on group headers at Compact, Regular and Comfortable; Board View card avatars stay 24px. The Progress bar is 48 by 4px at Compact, as in the design. The name bubble on hover over a technician avatar on a row or card (the +N included) opens above the avatar, in both views; group and column header avatars keep the browser’s plain name tip, because the name is printed beside them. In Tech View, Status, Waiting On Parts and Progress are left-aligned. The Density and Columns tooltips open above their button, like the switcher’s (S1-R9b), and are hidden while their menu is open. List is unchanged.”
- Steps 4, 6, 7 — **S3-R7** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Allow users to pin a technician from the column header.”
- Steps 8 — **S3-R8** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “At three pinned technicians, disable other pin controls with: “You can pin up to 3 technicians.””
- Steps 5 — **S1-R9a** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “The switcher uses the design’s icons at 20px: List is Lucide \`list\`, Tech View is \`user-round\`, Board View is \`square-kanban\`. In Tech View and Board View these icons are the design’s: density (\`row-height\` in Tech View, \`card-height\` in Board View, custom icons in the design system’s icon set), collapse chevron (\`chevron-down\`), pin and unpin (\`pin\` / \`pin-off\`), Invoiced or Paid lock (\`lock\`), Unassigned avatar (\`user-round\`) and the empty state when there are no work orders at all (\`clipboard-list\`). The filtered no-results state is the List’s, magnifier included (S1-N1). The filter chips and Search use the design file’s icons in every display option, List included, each exactly as the design file draws it. The display switcher (new on every view, List included) shows the design’s slate icons in every view, so it keeps one color as the user moves between views. These are the only changes to List. Every other List icon is unchanged.”
- Steps 1 — **Design — Work Orders.dc.html, Board View Unassigned avatar** (design package (export of 14 Oct 2026)): “width: 28px; height: 28px; flex: none; border-radius: 50%; display: grid; place-items: center; background: var(--sv-surface-sunken); color: var(--sv-text-secondary);”
- Steps 2 — **Design — Work Orders.dc.html, Board View column header name** (design package (export of 14 Oct 2026)): “font-size: 14px; font-weight: 600; color: var(--sv-text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: -8px;”
- Steps 2 — **Design — \_ds_bundle.js (design library), staff avatar without a photo** (design package (export of 14 Oct 2026)): “background: color \|\| 'var(--sv-surface-sunken)', color: color ? 'var(--sv-accent-on-solid)' : 'var(--sv-text-secondary)',”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 9.

Jira: SV-10046,SV-11319,SV-11338. Last checked against build v26.40.17-a5c4210 (staging) on 10/15/2026, before the expected results changed on 16 Oct 2026; not yet checked against a build since.

### [C590128](https://shopview.testrail.io/index.php?/cases/view/590128) Density changes Tech View row, avatar and bar sizes, not Board card avatars

PRD v60/v61 S2-R23: Tech View row avatars 20/24/32 px and group header avatars 24/28/36 px by density, the Service Advisor avatar follows density, the Compact bar is 48 × 4 px, and Board card avatars stay 24 px (new steps 8-10).

- Steps 2, 4, 6, 8, 10 — **S2-R23** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “In Tech View and Board View, as in the design: a technician avatar without a photo is a light-grey circle (--sv-grey-100, \#EEF2F6) with initials in --sv-grey-600 (#4B5565) in light mode, which meets accessible contrast (6.7:1; the design file’s \#697586 is 4.2:1); dark mode uses the design’s dark colors; group and column header names are 14px, weight 600, in the design’s slate text color (#364152), with the design’s smaller, lighter initials; Board card customer and total price are weight 500; toolbar and switcher icons are the design’s slate color (the switcher in List too, S1-R9a). Technician avatars, and the Service Advisor avatar, follow density in Tech View as in the design: 20px, 24px and 32px on rows and 24px, 28px and 36px on group headers at Compact, Regular and Comfortable; Board View card avatars stay 24px. The Progress bar is 48 by 4px at Compact, as in the design. The name bubble on hover over a technician avatar on a row or card (the +N included) opens above the avatar, in both views; group and column header avatars keep the browser’s plain name tip, because the name is printed beside them. In Tech View, Status, Waiting On Parts and Progress are left-aligned. The Density and Columns tooltips open above their button, like the switcher’s (S1-R9b), and are hidden while their menu is open. List is unchanged.”
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

### [C590113](https://shopview.testrail.io/index.php?/cases/view/590113) Tech View opens on 13 default columns with small grey header labels

Quote refresh: PRD v56 removed the Out of Scope line on Collapse all / Expand all (now S2-R13a, covered by Vladimir's C614712); that quote is dropped. What the case checks is unchanged.

- Steps 1, 4, 5 — **S5-R4** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Until the user changes Tech View’s columns, Tech View shows these columns, in this order, as in the design: Status, Waiting On Parts, Number, Customer, Unit, Asset, Progress, Service Advisor, Clocked In, Lines, Assigned Techs, Created on, Total price (Total price subject to financial permission). On Site, VIN/Serial \# and Lead Technician are off by default; each can be added with the column chooser (S2-R4). Column headings use the List’s labels for List columns (for example Unit, not Unit \#) and Assigned Techs for the new column. List’s columns are unchanged.”
- Steps 1 — **S7-R7** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “In Tech View the Assigned Techs column sits immediately after Lines, matching the design. It is on by default (S5-R4) and can be removed through the column chooser (S2-R4).”
- Steps 2, 3, 7, 8, 9, 10 — **S2-R21** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Tech View’s column header labels are 12px, medium weight (500), in the secondary text color, as in the design. Labels never overlap a neighboring label.”
- Steps 1 — **Out of Scope** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Rank numbers (1, 2, 3, and so on) beside each Tech View row, as the design shows.”
- Steps 2 — **Design — Work Orders.dc.html, Tech View column header row** (design package (export of 14 Oct 2026)): “font-size: 12px; font-weight: 500; color: var(--sv-text-secondary); white-space: nowrap;”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 6.

Jira: SV-10045,SV-10048,SV-10050,SV-11317,SV-11321. Last checked against build v26.40.17-a5c4210 (staging) on 10/15/2026.

### [C590122](https://shopview.testrail.io/index.php?/cases/view/590122) Empty groups, empty columns and no-results pages look as designed

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

### [C590127](https://shopview.testrail.io/index.php?/cases/view/590127) Technician filter sits after Assigned to me in Tech View and Board View

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

### [C614716](https://shopview.testrail.io/index.php?/cases/view/614716) Density and Columns tooltips open above their button and hide while open

New, PRD v55 S2-R23 (tooltip sentence; 15 Oct 2026, Chris Ward ruling on Slavcho Mitrov's v54 follow-up questions).

- Steps 1, 2, 4, 5 — **S2-R23** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “In Tech View and Board View, as in the design: a technician avatar without a photo is a light-grey circle (--sv-grey-100, \#EEF2F6) with initials in --sv-grey-600 (#4B5565) in light mode, which meets accessible contrast (6.7:1; the design file’s \#697586 is 4.2:1); dark mode uses the design’s dark colors; group and column header names are 14px, weight 600, in the design’s slate text color (#364152), with the design’s smaller, lighter initials; Board card customer and total price are weight 500; toolbar and switcher icons are the design’s slate color (the switcher in List too, S1-R9a). Technician avatars, and the Service Advisor avatar, follow density in Tech View as in the design: 20px, 24px and 32px on rows and 24px, 28px and 36px on group headers at Compact, Regular and Comfortable; Board View card avatars stay 24px. The Progress bar is 48 by 4px at Compact, as in the design. The name bubble on hover over a technician avatar on a row or card (the +N included) opens above the avatar, in both views; group and column header avatars keep the browser’s plain name tip, because the name is printed beside them. In Tech View, Status, Waiting On Parts and Progress are left-aligned. The Density and Columns tooltips open above their button, like the switcher’s (S1-R9b), and are hidden while their menu is open. List is unchanged.”
- Steps 7 — **S1-R9b** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “The switcher’s hover tooltip opens above the switcher, so it never covers the table’s column header row. The tooltips read List, Tech View and Board View.”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 3, 6.

Jira: SV-10045. Not yet checked against a build.

### [C614717](https://shopview.testrail.io/index.php?/cases/view/614717) Row and card name bubbles open above the avatar, headers keep the plain tip

New, PRD v60/v61 S2-R23 (16 Oct 2026, Chris Ward rulings on the QA triage of SV-11395, SV-11397, SV-11422, SV-11421).

- Steps 1, 2, 3, 5, 6, 7 — **S2-R23** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “In Tech View and Board View, as in the design: a technician avatar without a photo is a light-grey circle (--sv-grey-100, \#EEF2F6) with initials in --sv-grey-600 (#4B5565) in light mode, which meets accessible contrast (6.7:1; the design file’s \#697586 is 4.2:1); dark mode uses the design’s dark colors; group and column header names are 14px, weight 600, in the design’s slate text color (#364152), with the design’s smaller, lighter initials; Board card customer and total price are weight 500; toolbar and switcher icons are the design’s slate color (the switcher in List too, S1-R9a). Technician avatars, and the Service Advisor avatar, follow density in Tech View as in the design: 20px, 24px and 32px on rows and 24px, 28px and 36px on group headers at Compact, Regular and Comfortable; Board View card avatars stay 24px. The Progress bar is 48 by 4px at Compact, as in the design. The name bubble on hover over a technician avatar on a row or card (the +N included) opens above the avatar, in both views; group and column header avatars keep the browser’s plain name tip, because the name is printed beside them. In Tech View, Status, Waiting On Parts and Progress are left-aligned. The Density and Columns tooltips open above their button, like the switcher’s (S1-R9b), and are hidden while their menu is open. List is unchanged.”
- Steps 1, 2, 5, 6 — **S7-R6** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Keep every involved technician discoverable by name.”
- Steps 3, 7 — **S2-R10** (PRD Confluence 845185030 version 61 (16 Oct 2026)): “Hovering a technician header or avatar reveals the technician’s name.”

Steps with no source sentence (navigation and on-screen labels, taken from the build): 4.

Jira: SV-10045,SV-10046,SV-10050. Not yet checked against a build.

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

## 10. Open questions

- QA lead: C368150 (13 steps), C368152 (12), C97020 (16) and C590117 (11) are over the 10-step limit; they were not split (safeguard). Split them?
- QA lead: the "No work orders yet" case needs a location with no work orders. Is there one we may use, or may a session create one?
- Product owner: S2-R23 gives no-photo initials --sv-grey-600 (#4B5565) and also says header avatars use "the design's smaller, lighter initials". Are header initials grey-600 too, or lighter? The cases judge only "dark grey, a little darker than the design picture".
- Product owner: S11-R1 says Tab lands on "the first one" when no work order has been focused. The cases read this as the first card on the board (the Unassigned column's first card) and the first row of the table.
- C368214: the old "write down whether the search text is kept" note was dropped (it was not a pass/fail check; S1-R8 keeps List's Back behaviour as in production).
