"""C368131, C368167, C96936 (WO Board and Tech View): preconditions and steps corrected and simplified in the two-audience layout
(Rule 117 ninth amendment). QA lead, 19 Oct 2026: "correct and simplify ... the expected result is not supposed to be changed and so
the sources". The Expected field is NOT touched; every step keeps the number its expected result points to."""
SETUP_LINK = ('<p><strong><a href="https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/claude/slack-session-setup-7v5itm/'
              'build/wo-board-tech-view/v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md">Setup file (for Claude sessions; '
              'a tester does not need it)</a></strong></p><p></p>')
BLOCKED = 'If any record above is missing, mark this test Blocked: "setup not done".'
ADMIN = ("You are signed in as an Admin user (Work orders > View and Create & Edit) at {Location-A}, in a desktop browser window at least 1024 px wide.",
         "For example: {Location-A} is Staging Heavy Duty - 9919.")
CASES = {
368131: dict(
  pre=[("You are signed in as an Admin user (Work orders > View and Create & Edit) at {Location-A}, in a desktop browser window at least 1024 px wide. The company has a second location, {Location-B}.",
        "For example: {Location-A} is Staging Heavy Duty - 9919 and {Location-B} is Staging Lethbridge - 4310."),
       ("A second user, {User-B}, whose role has Work orders > View only, is signed in at {Location-A} in a second browser or a private window.",
        "For example: {User-B} is ZZAUTOTEST C368131 Viewer."),
       ("Three active technicians work at {Location-A}: {Technician-A}, and {Technician-B} and {Technician-C}, who are made for this case only. {Technician-B} leads no work order.",
        "For example: {Technician-A} is Esther Howard, {Technician-B} is ZZAUTOTEST Jenny Pinned and {Technician-C} is ZZAUTOTEST Theresa Pinned."),
       ("Customer {Customer-A} has two Approved work orders, with no shift booked for them on the Schedule: {Work-order-1} led by {Technician-A}, and {Work-order-2} led by {Technician-C}.",
        "For example: {Customer-A} is ZZAUTOTEST C368131 Pinned Gone, {Work-order-1} is S10043-17691 and {Work-order-2} is S10043-17692."),
       ("You and {User-B} both have {Technician-B} and {Technician-C} pinned in Board View.", None),
       ('Starting screen: the Work Orders page with no filter set (nothing ticked in "Status", no choice in "Asset on Site", "Assigned to me" off, "Search" empty).', None)],
  steps=['Go to your initials (top right) > "Settings" > "Staff".',
         'Deactivate {Technician-B}: click the edit icon on {Technician-B}, click "Deactivate Account" and confirm.',
         'Move {Technician-C} to {Location-B}: click the edit icon on {Technician-C}, change "Location" to {Location-B} and click "Save & Close"; then click the "Department(s)" button on her row, click the bin icon next to {Location-A} and close the window (the Location field alone leaves her at {Location-A}).',
         'Click "Work Orders" in the top menu.',
         'Click the "All" tab and type the name of {Customer-A} in "Search".',
         'Click "Board View" in the display switcher.',
         'Look at the pinned columns right after "Unassigned".',
         "Find {Technician-C}'s column further along and look at its header.",
         "Drag {Work-order-1} from {Technician-A}'s column onto {Technician-B}'s column and let go.",
         "Drag {Work-order-1} from {Technician-A}'s column onto {Technician-C}'s column and let go.",
         "Read the message that appears and check where {Work-order-1} is.",
         "Drag {Work-order-2} from {Technician-C}'s column onto the \"Unassigned\" column and let go.",
         "Check which column {Work-order-2} is in and whether {Technician-C} still has a column.",
         'In the second browser, as {User-B}, go to "Work Orders" > "All" > "Board View".',
         'Look at the pinned columns right after "Unassigned".']),
368167: dict(
  pre=[ADMIN,
       ('Two active technicians work at {Location-A}: "Esther Howard" (the expected results name her) and {Technician-B}, who is offered in the work order page\'s "Lead Technician" list.',
        "For example: {Technician-B} is Jenny Wilson."),
       ('Customer {Customer-A}, used by this case only, has work order {Work-order-1}, led by "Esther Howard", with status Complete (all lines complete and reviewed, not invoiced).',
        "For example: {Customer-A} is ZZAUTOTEST Refused Lead Change and {Work-order-1} is S2-37327."),
       ("Two tabs of the same browser window are open, tab 1 and tab 2, both signed in as you. Do not sign in again in a private window: a second sign-in can end the first tab's session.", None)],
  steps=["In tab 1, open {Work-order-1} and leave the page open.",
         'In tab 2, open {Work-order-1}, click the "Finance" tab and click "Create Invoice". Leave the "New Customer Payment" window open: do not pay and do not close it (closing it with its X takes the invoice back off).',
         'In tab 1, without reloading, click "Lead Technician" on the status card.',
         "Pick {Technician-B}.",
         'Read the message that appears and the "Lead Technician" field.',
         'Reload tab 1 and read "Lead Technician".']),
96936: dict(
  pre=[ADMIN,
       ('Technicians "Esther Howard" and "Aaron Baker" are active at {Location-A} (the expected results name them, so use these two).', None),
       ("Customer {Customer-A}, used by this case only, has five Approved work orders: {Work-order-1}, {Work-order-2} and {Work-order-3} led by Esther Howard, and {Work-order-4} and {Work-order-5} led by Aaron Baker.",
        'For example: {Customer-A} is ZZAUTOTEST F2 Refresh Lead and {Work-order-1} is S2-35331 (the expected results call it "S1-702").'),
       ("Two tabs of the same browser window are open, tab A and tab B, both signed in as you.", None)],
  steps=['In tab A, click "Work Orders" in the top menu.',
         'In tab A, click the "All" tab.',
         'In tab A, type the name of {Customer-A} in "Search".',
         'In tab A, click "Tech View" in the display switcher.',
         'In tab B, open {Work-order-1} and change "Lead Technician" to Aaron Baker (it saves at once).',
         "Go back to tab A without refreshing and look at {Work-order-1}.",
         "Refresh tab A.",
         "Look at {Work-order-1} and the two group counts."]),
}
