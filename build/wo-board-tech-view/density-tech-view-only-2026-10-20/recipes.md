# Setup recipes for the 8 density cases, Tech View only (draft, 20 Oct 2026)

To replace the matching recipes in `../v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md` section 4 (C590110, C590128) and to add the six behaviour cases, which have no recipe there yet. Shared procedures are that file's (section 4, "Shared procedures"). Sources: PRD v71 (Confluence 845185030, 20 Oct 2026) and each case's own setup before this change (`C<id>-before.json` in this folder). No environment address, credentials or session data.

#### SETUP-C96987 — [C96987](https://shopview.testrail.io/index.php?/cases/view/96987) Density offers Compact, Regular and Comfortable, Regular by default

**Satisfies these precondition lines, exactly as the case states them:**

- User {User-B} has the "Admin" role at {Location-A} and has never changed density. You are signed in as {User-B}, in a browser window at least 1024 px wide. For example: {User-B} is ZZAUTOTEST F1 Nora New and {Location-A} is Staging Heavy Duty - 9919.
- Customer {Customer-A} has one Approved work order, {Work-order-1}, with no lead technician. For example: {Customer-A} is ZZAUTOTEST F1 Density Choices and {Work-order-1} is S1-702.
- Starting screen: "Work Orders" > "All" tab, "List" shown, "Search" empty, no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A (creates the records) and a new Admin user made in step 3, who is {User-B} (not ACCOUNT-B). **Run first:** SETUP-ADMIN.

1.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST F1 Density Choices"; units "C96987-U1".
2.  **P-WO** (ACCOUNT-A): Unit "C96987-U1"; customer "ZZAUTOTEST F1 Density Choices"; no lead.
3.  New Admin user {User-B} (ACCOUNT-A): your initials > "Settings" > "Staff" > "New Staff Member": First Name "ZZAUTOTEST F1", Last Name "Nora New", an Email inbox you can open, Role "Admin", at least one Department (required), Location = the case location > "Save & Close". Accept the invitation email and set a password (as in P-PHOTO). The user must be brand new each run: once they open the density menu and choose, they no longer qualify; make another (for example "ZZAUTOTEST F1 Nora New 2").
4.  Sign in as {User-B} in its own browser (or a private window), then **P-START** as {User-B}: "All" tab, List, Search empty, no filter, Assigned to me off. Do not open Tech View before the test.

**Check:** signed in as {User-B}, Work Orders shows List and Search for "ZZAUTOTEST F1 Density Choices" lists {Work-order-1} with no lead. {User-B} has never opened the density menu.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {User-B} = ZZAUTOTEST F1 Nora New (or the next new user made)
- {Customer-A} = ZZAUTOTEST F1 Density Choices
- {Work-order-1} = the work order for unit C96987-U1

#### SETUP-C96988 — [C96988](https://shopview.testrail.io/index.php?/cases/view/96988) Density changes spacing and size only, never what is shown

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technician {Technician-A} is active at {Location-A}, with Time Clock on and a Role other than "Office User" or "Time Clock User". For example: {Technician-A} is Esther Howard.
- Customer {Customer-A} has one Approved work order, {Work-order-1}, led by {Technician-A}. For example: {Customer-A} is ZZAUTOTEST F1 Density Content and {Work-order-1} is S1-702.
- In Tech View's "Column Selection", "Lead Technician" is turned on (it is off until you turn it on).
- Starting screen: "Work Orders" > "All" tab, "Tech View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off, density "Regular".
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "Esther", Last Name "Howard" (P-TECH reuses an existing active Esther Howard at this location with Time Clock on).
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST F1 Density Content"; units "C96988-U1".
3.  **P-WO** (ACCOUNT-A): Unit "C96988-U1"; customer "ZZAUTOTEST F1 Density Content"; lead "Esther Howard".
4.  Tech View column (ACCOUNT-A): Work Orders > "Tech View" > "Column Selection" > turn "Lead Technician" on > close the menu (PRD v71 S5-R4: off by default).
5.  **P-START** (ACCOUNT-A): Tech View, "All" tab, density Regular, Search "ZZAUTOTEST F1 Density Content", no filter, Assigned to me off.

**Check:** Tech View shows {Work-order-1} with a "Lead Technician" column reading Esther Howard, a progress bar and a Total price amount.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = Esther Howard
- {Customer-A} = ZZAUTOTEST F1 Density Content
- {Work-order-1} = the work order for unit C96988-U1

#### SETUP-C96989 — [C96989](https://shopview.testrail.io/index.php?/cases/view/96989) Tech View density is kept after logout, in another browser and location

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- You can switch to a second location, {Location-B}, and a second browser (or a second computer) is open on the sign-in page. For example: {Location-B} is Staging Lethbridge - 4310.
- Customer {Customer-A} has one Approved work order, {Work-order-1}, with no lead technician. For example: {Customer-A} is ZZAUTOTEST F1 Density Shared and {Work-order-1} is S1-702.
- In Tech View the density is not "Comfortable". For example: it is "Regular".
- Starting screen: "Work Orders" > "All" tab, "Board View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A, in two browsers (the second one starts signed out). **Run first:** SETUP-ADMIN.

1.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST F1 Density Shared"; units "C96989-U1".
2.  **P-WO** (ACCOUNT-A): Unit "C96989-U1"; customer "ZZAUTOTEST F1 Density Shared"; no lead.
3.  **P-LOCATION** check only: your initials > "Change Location" lists a second location for {Location-B} (Staging Lethbridge - 4310 on staging); do not switch yet.
4.  Density (ACCOUNT-A): Work Orders > "Tech View" > density button > "Regular" (anything but Comfortable).
5.  Open a second browser (or a private window) on the sign-in page and leave it signed out.
6.  **P-START** (ACCOUNT-A): Board View, "All" tab, Search "ZZAUTOTEST F1 Density Shared", no filter, Assigned to me off.

**Check:** Board View shows the card of {Work-order-1}; Tech View's density is Regular; the second browser shows the sign-in page.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Location-B} = another location (Staging Lethbridge - 4310 on staging)
- {Customer-A} = ZZAUTOTEST F1 Density Shared
- {Work-order-1} = the work order for unit C96989-U1

#### SETUP-C96990 — [C96990](https://shopview.testrail.io/index.php?/cases/view/96990) Tech View row text stays the same size at every density

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technician {Technician-A} is active at {Location-A}, with Time Clock on and a Role other than "Office User" or "Time Clock User". For example: {Technician-A} is Esther Howard.
- Customer {Customer-A} has one Approved work order, {Work-order-1}, led by {Technician-A}. For example: {Customer-A} is "ZZAUTOTEST F1 Compact Text" and {Work-order-1} is S10043-17651.
- Tech View shows the "Progress" column (it is on by default).
- Starting screen: "Work Orders" > "All" tab, "Tech View" shown, the name of {Customer-A} in "Search", nothing ticked in "Status", no choice in "Asset on Site", "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "Esther", Last Name "Howard" (reuse if it already matches).
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST F1 Compact Text"; units "C96990-U1".
3.  **P-WO** (ACCOUNT-A): Unit "C96990-U1"; customer "ZZAUTOTEST F1 Compact Text"; lead "Esther Howard".
4.  Tech View column check (ACCOUNT-A): "Column Selection" shows "Progress" ticked (on by default, PRD v71 S5-R4); tick it if someone turned it off.
5.  **P-START** (ACCOUNT-A): Tech View, "All" tab, Search "ZZAUTOTEST F1 Compact Text", nothing ticked in Status, no Asset on Site choice, Assigned to me off.

**Check:** Tech View shows {Work-order-1} with its progress bar and percentage.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = Esther Howard
- {Customer-A} = ZZAUTOTEST F1 Compact Text
- {Work-order-1} = the work order for unit C96990-U1 (S10043-17651 was the example on the QA build)

#### SETUP-C96991 — [C96991](https://shopview.testrail.io/index.php?/cases/view/96991) If the saved density can't load, Regular is used

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Customer {Customer-A} has one Approved work order, {Work-order-1}, with no lead technician. For example: {Customer-A} is ZZAUTOTEST F1 Density Load Fail and {Work-order-1} is S1-702.
- A developer can make your saved density fail to load. This cannot be done from the product; without it, step 3 cannot be checked by hand.
- Starting screen: "Work Orders" > "All" tab, "Tech View" shown, "Search" empty, no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A, plus a developer for step 3. **Run first:** SETUP-ADMIN.

1.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST F1 Density Load Fail"; units "C96991-U1".
2.  **P-WO** (ACCOUNT-A): Unit "C96991-U1"; customer "ZZAUTOTEST F1 Density Load Fail"; no lead.
3.  Forced load failure: UNVERIFIED, no recorded method in this repository. Ask the user whether a developer can make this user's saved density fail to load on the site used; if not, the tester writes "load failure not checked by hand" for step 3 (the case says so).
4.  **P-START** (ACCOUNT-A): Tech View, "All" tab, Search empty, no filter, Assigned to me off.

**Check:** Search for "ZZAUTOTEST F1 Density Load Fail" shows {Work-order-1}; clear the search again.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Customer-A} = ZZAUTOTEST F1 Density Load Fail
- {Work-order-1} = the work order for unit C96991-U1

#### SETUP-C96992 — [C96992](https://shopview.testrail.io/index.php?/cases/view/96992) Density changes Tech View rows only, not Board View cards or List

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in with the "Admin" role at {Location-A}, in a browser window at least 1024 px wide. For example: {Location-A} is Staging Heavy Duty - 9919.
- Technician {Technician-A} is active at {Location-A}, with Time Clock on and a Role other than "Office User" or "Time Clock User". For example: {Technician-A} is Esther Howard.
- Customer {Customer-A} has one Approved work order, {Work-order-1}, led by {Technician-A}. For example: {Customer-A} is ZZAUTOTEST F1 Density Scope and {Work-order-1} is S1-702.
- In Tech View the density is "Regular", and a second browser tab shows the "Customers" page, opened before you start.
- Starting screen: "Work Orders" > "All" tab, "List" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off.
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "Esther", Last Name "Howard" (reuse if it already matches).
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST F1 Density Scope"; units "C96992-U1".
3.  **P-WO** (ACCOUNT-A): Unit "C96992-U1"; customer "ZZAUTOTEST F1 Density Scope"; lead "Esther Howard".
4.  Density (ACCOUNT-A): Work Orders > "Tech View" > density button > "Regular".
5.  Open a second browser tab on the top menu "Customers" page and leave it open.
6.  **P-START** (ACCOUNT-A): List, "All" tab, Search "ZZAUTOTEST F1 Density Scope", no filter, Assigned to me off.

**Check:** List shows {Work-order-1}; Board View shows its card in Esther Howard's column; a second tab shows Customers.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Technician-A} = Esther Howard
- {Customer-A} = ZZAUTOTEST F1 Density Scope
- {Work-order-1} = the work order for unit C96992-U1

#### SETUP-C590110 — [C590110](https://shopview.testrail.io/index.php?/cases/view/590110) Design: The view buttons, filter and search icons look as in the design

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in as an Admin user (the "Admin" role, which has Work orders > View and Create & Edit) at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "DC-01-toolbar-tech-view-light-1440.png" and "DC-01-toolbar-board-view-light-1440.png" attached to this case are open beside it at 100% (actual size). Names, numbers and rank numbers in the pictures are sample data.
- Customer {Customer-A} has one Approved work order, {Work-order-1}, led by technician {Technician-A}. For example: {Customer-A} is ZZAUTOTEST C590110 Toolbar Icons, {Work-order-1} is S10043-17801 and {Technician-A} is ZZAUTOTEST C590110 Ana.
- Starting screen: "Work Orders" > "All" tab, "List" shown, "Search" empty, no filter chosen, "Assigned to me" off, density "Regular".
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590110", Last Name "Ana" (shows as "ZZAUTOTEST C590110 Ana").
2.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590110 Toolbar Icons"; units "C590110-U1".
3.  **P-WO** (ACCOUNT-A): Unit "C590110-U1"; customer "ZZAUTOTEST C590110 Toolbar Icons"; lead "ZZAUTOTEST C590110 Ana".
4.  **P-START** (ACCOUNT-A): starting screen: List, All tab, density Regular (set in Tech View), Search empty.

**Check:** Every precondition line of the case is true on screen, read top to bottom. Unchanged from the setup file's SETUP-C590110 apart from the case's steps (Board View's density button is no longer looked at, PRD v71 S3-R11).

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Customer-A} = ZZAUTOTEST C590110 Toolbar Icons
- {Technician-A} = ZZAUTOTEST C590110 Ana
- {Work-order-1} = the work order for unit C590110-U1

#### SETUP-C590128 — [C590128](https://shopview.testrail.io/index.php?/cases/view/590128) Design: Density changes Tech View row, avatar and bar sizes, not card avatars

**Satisfies these precondition lines, exactly as the case states them:**

- You are signed in as an Admin user (the "Admin" role, which has Work orders > View and Create & Edit) at {Location-A}. For example: {Location-A} is Staging Heavy Duty - 9919.
- The browser window is 1440 px wide with the zoom at 100%, and the design pictures "DC-06-tech-view-compact-light-1440.png" and "DC-06-tech-view-regular-light-1440.png" and "DC-06-tech-view-comfortable-light-1440.png" attached to this case are open beside it at 100% (actual size). Names, numbers and rank numbers in the pictures are sample data.
- Customer {Customer-A} has an Approved work order {Work-order-1}, led by technician {Technician-A}, with a service advisor and line technician {Technician-B} on its approved line. On Board View cards the "Line technicians" field is turned on. For example: {Customer-A} is ZZAUTOTEST C590128 Density, {Work-order-1} is S10043-17830, {Technician-A} is ZZAUTOTEST C590128 Ana and {Technician-B} is ZZAUTOTEST C590128 Ben.
- Starting screen: "Work Orders" > "All" tab, "Tech View" shown, the name of {Customer-A} in "Search", no filter chosen, "Assigned to me" off, density "Regular".
- If any record above is missing, mark this test Blocked: "setup not done".

**Slots:** ACCOUNT-A. **Run first:** SETUP-ADMIN.

1.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590128", Last Name "Ana" (shows as "ZZAUTOTEST C590128 Ana").
2.  **P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590128", Last Name "Ben" (shows as "ZZAUTOTEST C590128 Ben").
3.  **P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590128 Density"; units "C590128-U1".
4.  **P-WO** (ACCOUNT-A): Unit "C590128-U1"; customer "ZZAUTOTEST C590128 Density"; lead "ZZAUTOTEST C590128 Ana".
5.  **P-ADVISOR** (ACCOUNT-A): Unit "C590128-U1".
6.  **P-LINE-TECH** (ACCOUNT-A): Unit "C590128-U1"; technicians "ZZAUTOTEST C590128 Ben"; use the work order's existing approved line.
7.  **P-FIELDS-LINETECHS** (ACCOUNT-A): as described in the procedure table. Board View's card field picker is labelled "Fields to display" on builds before SV-11580 ships and "Column Selection" after it (PRD v71 renames it); P-FIELDS-LINETECHS works on either label.
8.  **P-START** (ACCOUNT-A): starting screen: Tech View, All tab, density Regular, Search "ZZAUTOTEST C590128 Density".

**Check:** Every precondition line of the case is true on screen, read top to bottom; the Board View card shows the lead's and Ben's avatars.

**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):

- {Location-A} = the case location (Staging Heavy Duty - 9919 on staging)
- {Customer-A} = ZZAUTOTEST C590128 Density
- {Technician-A} = ZZAUTOTEST C590128 Ana
- {Technician-B} = ZZAUTOTEST C590128 Ben
- {Work-order-1} = the work order for unit C590128-U1
