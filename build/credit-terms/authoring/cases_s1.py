"""Story 1 — Credit Terms page and list (S1-R1 to S1-R16, S1-N1 to S1-N3, S1-E1 to S1-E3, Error Handling), plus page access by role
(Key Decisions, Permissions). Counts (S1-R12, S1-R13) with exact numbers are in cases_data.py."""
from ct_lib import C, HOLD, prd_sentence
from common import *
from po_questions import QN

C("S1-01", "S1", "Credit Terms sits under Payment Methods in Settings and opens on Active",
  [ADMIN(), STD_ACTIVE, ("Starting screen: the Settings page.", None)],
  ['In the Settings menu, find the Finance group.', 'Click "Credit Terms".'],
  ['Step 1: the Finance group shows "Credit Terms" directly below "Payment Methods".',
   'Step 2: the Credit Terms page opens. Its header reads "Credit Terms", with a primary "New Credit Term" button at the top right and a "⋯" menu beside it. Below the header are two tabs, "Active" and "Inactive", each followed by the number of terms in it, and the Active tab is selected.'],
  ["S1-R1", "S1-R2", "S1-R3", "S11-R4", "PERM-PAGE"])

C("S1-02", "S1", "Both tabs show the same columns at the same widths",
  [ADMIN(), ("At least one term is deactivated, {Term-A}.", "For example: {Term-A} is Net 50."), PAGE],
  ['Look at the column headings of the table on the Active tab.', 'Click the "Inactive" tab.'],
  ['Step 1: the table has one heading row reading Name, Due, Customers and Vendors, followed by a column with no heading that holds a "⋯" button on every row. There is one table only (no separate sections for standard terms and the shop\'s own terms).',
   'Step 2: the Inactive tab shows {Term-A} in a table with the same four headings and the unlabeled "⋯" column, and every column is as wide as on the Active tab (the headings do not move when you switch tabs).'],
  ["S1-R4", "S1-R14", "KD-TABLE"])

C("S1-03", "S1", "The Active tab lists terms in the fixed order, Credit Hold last",
  [ADMIN(), STD_ACTIVE,
   ("The shop has five active terms of its own: {Term-A} due 10 days after the invoice date, {Term-B} due 30 days after the invoice date, {Term-C} due on day 1 of the following month, {Term-D} due on day 22 of the following month, and {Term-E} due on day 1 of the following month. {Term-E}'s name comes after {Term-C}'s in A to Z order.",
    "For example: {Term-A} is ZZAUTOTEST S1-03 Ten, {Term-B} is ZZAUTOTEST S1-03 Thirty, {Term-C} is ZZAUTOTEST S1-03 First A, {Term-D} is ZZAUTOTEST S1-03 Twentysecond and {Term-E} is ZZAUTOTEST S1-03 First B."),
   PAGE],
  ["Without clicking any column heading, read the Name column from top to bottom."],
  ["Step 1: the rows read, top to bottom: COD, Due on Receipt, Net 7, {Term-A}, Net 15, Net 20, Net 30, {Term-B}, Net 45, Net 50, Net 60, Net 90, Net 120, {Term-C}, {Term-E}, {Term-D}, Credit Hold. Net terms (standard and the shop's own) go by number of days, lowest first; Net 30 and {Term-B} both run 30 days, so they sort A to Z by name; day-of-the-following-month terms follow by day, and the two day-1 terms sort A to Z by name; Credit Hold is last."],
  ["S1-R5", "S1-R14"],
  note=f"The order also has a place for \"any other term A to Z\" before Credit Hold; question {QN['other-term-order']} on Chris Ward's sheet (not sent yet) asks which terms those are. This case checks every kind a shop can create.")

C("S1-04", "S1", "The Inactive tab uses the same order as the Active tab",
  [ADMIN(), ("Three terms are deactivated: Net 60, Net 7 and the shop's own {Term-A}, due on day 5 of the following month.",
              "For example: {Term-A} is ZZAUTOTEST S1-04 Fifth."), PAGE],
  ['Click the "Inactive" tab.'],
  ["Step 1: the Inactive tab lists, top to bottom: Net 7, Net 60, {Term-A}. The tab's count reads 3."],
  ["S1-R5", "S1-R14", "S1-R3"])

C("S1-05", "S1", "Clicking Name sorts A to Z, and again Z to A",
  [ADMIN(), STD_ACTIVE, ("The shop has its own active term {Term-A}, due 14 days after the invoice date, whose name starts with a letter after N.",
                         "For example: {Term-A} is ZZAUTOTEST S1-05 Fourteen."), PAGE],
  ['Click the "Name" column heading.', 'Click the "Name" column heading again.'],
  ["Step 1: the rows sort by name A to Z: COD, Credit Hold and Due on Receipt come before the Net terms, and {Term-A} is last.",
   "Step 2: the order reverses: {Term-A} first and COD last."],
  ["S1-R6"])

C("S1-06", "S1", "Clicking Customers sorts lowest count first, and again highest first",
  [ADMIN(), ("Net 15 is held by 3 customers, Net 20 by 1 customer and Net 45 by 2 customers; no other term has between 1 and 3 customers.",
             "For example: the six customers are ZZAUTOTEST S1-06 Alpha to ZZAUTOTEST S1-06 Foxtrot."), PAGE],
  ['Click the "Customers" column heading.', 'Click the "Customers" column heading again.'],
  ["Step 1: the rows sort by the Customers count, lowest first: every term showing 0 comes first, then Net 20 (1), Net 45 (2), Net 15 (3), then any term with more.",
   "Step 2: the order reverses: the highest count first, and Net 15 (3) above Net 45 (2) above Net 20 (1)."],
  ["S1-R6"])

C("S1-07", "S1", "Clicking Vendors sorts lowest count first, and again highest first",
  [ADMIN(), ("Net 60 is held by 2 vendors and Net 90 by 1 vendor; no other term has 1 or 2 vendors.",
             "For example: the three vendors are ZZAUTOTEST S1-07 Vendor A to ZZAUTOTEST S1-07 Vendor C."), PAGE],
  ['Click the "Vendors" column heading.', 'Click the "Vendors" column heading again.'],
  ["Step 1: the rows sort by the Vendors count, lowest first: every term showing 0 first, then Net 90 (1), then Net 60 (2), then any term with more.",
   "Step 2: the order reverses: the highest count first, and Net 60 (2) above Net 90 (1)."],
  ["S1-R6"])

C("S1-08", "S1", "Clicking Due sorts in the page's usual order, and again in reverse",
  [ADMIN(), STD_ACTIVE, ("The shop has its own active term {Term-A}, due on day 10 of the following month.",
                         "For example: {Term-A} is ZZAUTOTEST S1-08 Tenth."), PAGE],
  ['Click the "Name" column heading.', 'Click the "Due" column heading.', 'Click the "Due" column heading again.'],
  ["Step 1: the rows are sorted by name A to Z.",
   "Step 2: the rows return to the page's usual order: COD, Due on Receipt, the Net terms by number of days, {Term-A}, Credit Hold last.",
   "Step 3: the order reverses: Credit Hold first, then {Term-A}, then the Net terms from Net 120 down to Net 7, then Due on Receipt, then COD."],
  ["S1-R6", "S1-R5"])

C("S1-09", "S1", "A column sort is not kept after leaving the page",
  [ADMIN(), STD_ACTIVE, PAGE],
  ['Click the "Name" column heading.', 'In the Settings menu, click "Payment Methods".', 'In the Settings menu, click "Credit Terms".'],
  ["Step 1: the rows are sorted by name A to Z (COD, Credit Hold, Due on Receipt, …).",
   "Step 2: the Payment Methods page opens.",
   "Step 3: the Credit Terms page opens on the Active tab in its usual order: COD, Due on Receipt, Net 7 … Net 120, Credit Hold last. The Name sort was not kept."],
  ["S1-R6"])

C("S1-10", "S1", "The Due column describes each standard term in words",
  [ADMIN(), STD_ACTIVE, PAGE],
  ["Read the Due column for every row."],
  ['Step 1: COD reads "Paid when the invoice is created"; Due on Receipt reads "Due on the invoice date"; Net 7 reads "7 days after the invoice date", Net 15 "15 days after the invoice date", Net 20 "20 days after the invoice date", Net 30 "30 days after the invoice date", Net 45 "45 days after the invoice date", Net 50 "50 days after the invoice date", Net 60 "60 days after the invoice date", Net 90 "90 days after the invoice date", Net 120 "120 days after the invoice date"; Credit Hold reads "Invoicing is blocked".'],
  ["S1-R7", "S1-R7 COD", "S1-R7 DOR", "S1-R7 CH", "S1-R7 NET", "KD-INLINE"])

C("S1-11", "S1", "The Due column reads 1 day and ordinal days correctly for the shop's terms",
  [ADMIN(), ("The shop has its own active terms: {Term-A} due 1 day after the invoice date, {Term-B} due 365 days after, and day-of-the-following-month terms {Term-C} (day 1), {Term-D} (day 2), {Term-E} (day 3), {Term-F} (day 11), {Term-G} (day 12), {Term-H} (day 13), {Term-J} (day 21), {Term-K} (day 22), {Term-L} (day 23) and {Term-M} (day 31).",
              "For example: {Term-A} is ZZAUTOTEST S1-11 N1, {Term-B} is ZZAUTOTEST S1-11 N365 and {Term-C} to {Term-M} are ZZAUTOTEST S1-11 D1, D2, D3, D11, D12, D13, D21, D22, D23 and D31."), PAGE],
  ["Read the Due column for {Term-A} to {Term-M}."],
  ['Step 1: {Term-A} reads "1 day after the invoice date" (singular); {Term-B} reads "365 days after the invoice date"; {Term-C} "1st of the following month", {Term-D} "2nd of the following month", {Term-E} "3rd of the following month", {Term-F} "11th of the following month", {Term-G} "12th of the following month", {Term-H} "13th of the following month", {Term-J} "21st of the following month", {Term-K} "22nd of the following month", {Term-L} "23rd of the following month", {Term-M} "31st of the following month".'],
  ["S1-R7", "S1-R7 NET", "S1-R7 DAY", "KD-RANGE"])

for key, row, sub, text in [
    ("S1-12", "COD", "S1-R8 COD", "Cash on delivery. COD customers can't charge to account, so payment is taken when the invoice is created."),
    ("S1-13", "Due on Receipt", "S1-R8 DOR", "Payment is due on the invoice date. You can charge the invoice to the customer's account instead of taking payment."),
    ("S1-14", "Credit Hold", "S1-R8 CH", "No invoices can be created for a customer on Credit Hold until their credit term is changed.")]:
    ufs = {"COD": "UFS-4", "Due on Receipt": "UFS-5", "Credit Hold": "UFS-6"}[row]
    C(key, "S1", f"The info icon on {row} explains the term on hover",
      [ADMIN(), STD_ACTIVE, PAGE],
      [f'Hover the info icon after the name "{row}".'],
      [f'Step 1: after the name "{row}" there is an info icon and then a lock icon. Hovering the info icon shows: "{text}"'],
      ["S1-R8", sub, ufs, "KD-INLINE"])

C("S1-15", "S1", "The lock icon on COD, Due on Receipt and Credit Hold explains why",
  [ADMIN(), STD_ACTIVE, PAGE],
  ['Hover the lock icon on the "COD" row.', 'Hover the lock icon on the "Due on Receipt" row.', 'Hover the lock icon on the "Credit Hold" row.'],
  ['Step 1: the hover shows "Always available." with the line "COD, Due on Receipt and Credit Hold can\'t be deactivated." below it.',
   "Step 2: the same two lines show.",
   "Step 3: the same two lines show."],
  ["S1-R9", "UFS-3", "KD-THREE"])

C("S1-16", "S1", "No other term shows an info icon or a lock icon",
  [ADMIN(), STD_ACTIVE, own("{Term-A}", "net 14", example="ZZAUTOTEST S1-16 Fourteen"),
   ("The shop has its own active term {Term-B}, due on day 10 of the following month.", "For example: {Term-B} is ZZAUTOTEST S1-16 Tenth."), PAGE],
  ["Look at the Name cell of every row other than COD, Due on Receipt and Credit Hold."],
  ["Step 1: Net 7, Net 15, Net 20, Net 30, Net 45, Net 50, Net 60, Net 90, Net 120, {Term-A} and {Term-B} show their name only: no info icon and no lock icon (COD, Due on Receipt and Credit Hold are the only rows with them)."],
  ["S1-R10", "KD-INLINE"])

C("S1-17", "S1", "The Default tag sits after COD's icons and on one row only",
  [ADMIN(), STD_ACTIVE, PAGE],
  ['Look at the "COD" row\'s Name cell.', "Look at the Name cell of every other row on both tabs."],
  ['Step 1: the COD row reads "COD", then the info icon, then the lock icon, then a "Default" tag.',
   'Step 2: no other row carries a "Default" tag.'],
  ["S1-R11"])

C("S1-18", "S1", "The Default tag follows the shop's own term when it is the default",
  [ADMIN(), ("The shop's own term {Term-A}, due 14 days after the invoice date, is the default for new customers.",
             "For example: {Term-A} is ZZAUTOTEST S1-18 Fourteen."), PAGE],
  ["Look at the {Term-A} row's Name cell.", 'Look at the "COD" row\'s Name cell.'],
  ['Step 1: it reads the name {Term-A} followed directly by a "Default" tag (no info or lock icon).',
   'Step 2: COD shows its info and lock icons and no "Default" tag. {Term-A} is the only row with the tag.'],
  ["S1-R11", "S1-R10"])

C("S1-19", "S1", "Customers and Vendors counts are right aligned and show 0 when none",
  [ADMIN(), ("No customer and no vendor holds Net 50.", None), ("At least one customer holds Net 30.", None), PAGE],
  ['Look at the Customers and Vendors cells of the "Net 50" row.', 'Look at the Customers cell of the "Net 30" row.'],
  ['Step 1: both cells read "0" (not blank, not a dash), right aligned in their columns.',
   "Step 2: the count is right aligned, its last digit lined up with the 0 above it."],
  ["S1-R12", "S1-R13"])

C("S1-20", "S1", "A long term name wraps onto a second line and is never cut off",
  [ADMIN(), ("The shop's own term {Term-A} has a 31-character name, due 14 days after the invoice date, and is the default for new customers.",
             "For example: {Term-A} is ZZAUTOTEST S1-20 Long Name 0123 (31 characters)."), PAGE],
  ["Look at the {Term-A} row's Name cell, with the browser window at its narrowest desktop width (for example 1280 pixels)."],
  ['Step 1: the whole name shows, every character, wrapping onto a second line if it does not fit; no "..." and no cut-off letters. The "Default" tag comes after the end of the name.'],
  ["S1-R15"])

C("S1-21", "S1", "Switching location reloads the page with the same terms and counts",
  [ADMIN(), ("You are enrolled at two locations, {Location-A} and {Location-B}.", f"For example: {{Location-A}} is {LOC_A} and {{Location-B}} is {LOC_B}."),
   ("The shop's own term {Term-A}, due 14 days after the invoice date, is the default and is held by 2 customers.",
    "For example: {Term-A} is ZZAUTOTEST S1-21 Fourteen."), PAGE],
  ["Write down every row's name, Customers count and Vendors count, and which row has the Default tag.",
   "Switch location to {Location-B} with the location switcher at the top right."],
  ["Step 1: {Term-A} shows the Default tag and 2 customers.",
   "Step 2: the page reloads and shows exactly the same rows in the same order, with the same Customers and Vendors counts and the Default tag still on {Term-A}. The terms and the default belong to the whole organization, not to a location."],
  ["S1-R16", "KD-ONELIST", "OOS-4"])

C("S1-22", "S1", "Without Settings Finance a user cannot see or open Credit Terms",
  [("You are signed in as {User-A}, whose role has every Settings page except Finance.", "For example: {User-A} is ZZAUTOTEST S1-22 User, on a custom role ZZAUTOTEST S1-22 No Finance."),
   ("You have the Credit Terms page's web address, {Address-A}, copied earlier from an Admin's browser.", "For example: {Address-A} is the address shown in an Admin's browser while the Credit Terms page is open."),
   ("Starting screen: the Settings page.", None)],
  ["Look at the Settings menu.", "Paste {Address-A} into the browser's address bar.", "Press Enter."],
  ['Step 1: there is no Finance group (or it has no items), so neither "Payment Methods" nor "Credit Terms" shows.',
   "Step 2: the address is in the address bar.",
   "Step 3: the Credit Terms page does not show; the app behaves as it does when this user opens the Payment Methods address (the same redirect or not-found page). No \"New Credit Term\" button is reachable."],
  ["S1-N1", "S3-N1", "S11-N2", "PERM-PAGE"])

C("S1-23", "S1", "An empty Inactive tab says \"No inactive terms\"",
  [ADMIN(), STD_ACTIVE, ("No term is deactivated (every standard term is active and the shop has no inactive term of its own).", None), PAGE],
  ['Click the "Inactive" tab.'],
  ['Step 1: the tab label shows a count of 0, and in place of the table the line "No inactive terms" shows.'],
  ["S1-N2", "UFS-2", "S1-R3"])

C("S1-24", "S1", "Every row has a menu, even Credit Hold and the default COD",
  [ADMIN(), STD_ACTIVE, PAGE],
  ['Click the "⋯" at the right of the "Credit Hold" row.', "Press Escape.", 'Click the "⋯" at the right of the "COD" row.'],
  ['Step 1: a menu opens, holding at least "Move Customers".',
   "Step 2: the menu closes.",
   'Step 3: a menu opens, holding at least "Move Customers". Every row on the page has a "⋯" button.'],
  ["S1-N3"])

C("S1-25", "S1", "With every term deactivated, Active keeps the three fixed terms and the default",
  [ADMIN(), ("The shop's own term {Term-A}, due 14 days after the invoice date, is the default for new customers.", "For example: {Term-A} is ZZAUTOTEST S1-25 Fourteen."),
   ("The shop also has its own term {Term-B}, due on day 10 of the following month.", "For example: {Term-B} is ZZAUTOTEST S1-25 Tenth."),
   ("Every term that can be deactivated is deactivated: Net 7, Net 15, Net 20, Net 30, Net 45, Net 50, Net 60, Net 90, Net 120 and {Term-B}.", None), PAGE],
  ["Read the rows on the Active tab.", 'Click the "Inactive" tab.'],
  ["Step 1: Active lists exactly COD, Due on Receipt, {Term-A} (with the Default tag) and Credit Hold, in that order, and its count reads 4.",
   "Step 2: Inactive lists Net 7, Net 15, Net 20, Net 30, Net 45, Net 50, Net 60, Net 90, Net 120 and {Term-B}, in that order, and its count reads 10."],
  ["S1-E1", "S1-R3"])

C("S1-26", "S1", "A term held only by an invoice shows 0 and 0 but is still in use",
  [ADMIN(), ("The shop's own term {Term-A}, due 14 days after the invoice date, is held by no customer and no vendor today, but one invoice, {Invoice-A}, was created with it (its customer was later moved to another term).",
             "For example: {Term-A} is ZZAUTOTEST S1-26 Fourteen and {Invoice-A} is the invoice of work order S2-15440."), PAGE],
  ["Look at the {Term-A} row's Customers and Vendors cells.", 'Click the "⋯" at the right of the {Term-A} row.', 'Hover "Edit".'],
  ['Step 1: both read 0.',
   'Step 2: the menu shows "Edit" and "Delete Credit Term" greyed out.',
   'Step 3: the hover reads "Used by 1 invoice" with "Deactivate it instead to take it out of the pickers." below it.'],
  ["S1-E2", "T-INUSE", "S2-R2"])

C("S1-27", "S1", "While the list loads, the Inactive tab never says \"No inactive terms\"",
  [ADMIN(), ("At least one term is deactivated.", None), ("Starting screen: the Settings page.", None)],
  ['Click "Credit Terms".', 'Click the "Inactive" tab as soon as it can be clicked, before the rows appear.'],
  ["Step 1: the page starts loading.",
   'Step 2: while the rows are still loading, the line "No inactive terms" does not show at any moment; once loaded, the inactive terms appear.'],
  ["S1-E3"],
  marker=HOLD("a manual tester cannot hold the list in its loading state long enough to look (it needs a slowed network)"),
  note="A manual tester can try step 2, but on a fast connection the loading moment is too short to judge; this part needs an automated check with a slowed network.")

C("S1-28", "S1", "If the list cannot load, the page says so above the tabs",
  [ADMIN(), ("Starting screen: the Settings page.", None)],
  ['Click "Credit Terms" while the list cannot be loaded.', "Reload the page once the list can be loaded again."],
  ['Step 1: the line "Something went wrong loading credit terms. Please try again." shows above the tabs, and it stays there.',
   "Step 2: the line is gone and the terms show."],
  ["EH-S1", "UFS-1"],
  marker=HOLD("a manual tester cannot make the term list fail to load on demand"),
  note="A manual tester cannot force the list to fail (switching the network off shows the browser's or the app's offline message instead); this case is for an automated check or a developer-made failure.")

# ---- page access by role (Key Decisions, Permissions) ---------------------------------------------------------------------------
C("S1-29", "S1", "The Admin role has Settings Finance on and it cannot be turned off",
  [ADMIN(), ("Starting screen: Settings, Roles & Permissions.", None)],
  ['Click the pencil on the "Admin" role.', 'Find the "Finance" sub-row under "Settings" in the page-access toggles.', 'Try to turn the "Finance" toggle off.'],
  ["Step 1: the Admin role opens for editing.",
   'Step 2: "Finance" is a sub-row under "Settings" and is on.',
   "Step 3: the toggle cannot be turned off (it is disabled, as every Admin toggle is)."],
  ["PERM-DEFAULTS", "PERM-SCREEN"])

for key, role in [("S1-30", "Parts Manager"), ("S1-31", "Office User")]:
    C(key, "S1", f"The out-of-the-box {role} role can open Credit Terms and move customers",
      [(f'You are signed in as {{User-A}}, on the out-of-the-box "{role}" role, reset to its template.', f"For example: {{User-A}} is ZZAUTOTEST {key} User."),
       ("At least one customer holds Net 30.", None), ("Starting screen: the Settings page.", None)],
      ['Click "Credit Terms" in the Finance group.', 'Click the "⋯" at the right of the "Net 30" row.', 'Hover "Move Customers".'],
      ["Step 1: the Credit Terms page opens on the Active tab.",
       'Step 2: the menu shows "Move Customers" in normal (not greyed) text.',
       "Step 3: no reason shows on hover (the item is not blocked)."],
      ["PERM-DEFAULTS", "PERM-OOTB"],
      note=('The PRD calls the role "Office User"; on Roles & Permissions it may read "Office". Use the out-of-the-box office role.' if role == "Office User" else ""))

for key, role in [("S1-32", "Service Manager"), ("S1-33", "Senior Service Advisor"), ("S1-34", "Sales Representative")]:
    C(key, "S1", f"The out-of-the-box {role} role cannot open Credit Terms",
      [(f'You are signed in as {{User-A}}, on the out-of-the-box "{role}" role, reset to its template.', f"For example: {{User-A}} is ZZAUTOTEST {key} User."),
       ("Starting screen: the Customers page.", None)],
      ["Open the Settings menu.", 'Click "New Customer".'],
      ['Step 1: "Credit Terms" does not show (the role does not have Settings, Finance).',
       'Step 2: New Customer shows the "Credit Terms" and "Credit Limit" fields (the role has View and Manage AP/AR Data).'],
      ["PERM-OOTB", "PERM-DEFAULTS", "S5-R1"])

C("S1-35", "S1", "Five other out-of-the-box roles have Settings Finance off",
  [ADMIN(), ("The out-of-the-box roles are reset to their templates.", None), ("Starting screen: Settings, Roles & Permissions.", None)],
  ['Open the permissions of the "Service Advisor" role.', 'Open the permissions of the "Foreman" role.', 'Open the permissions of the "Technician" role.',
   'Open the permissions of the "Parts Technician" role.', 'Open the permissions of the "Time Clock User" role.'],
  ['Step 1: "Finance" under "Settings" is off.', 'Step 2: "Finance" under "Settings" is off.', 'Step 3: "Finance" under "Settings" is off.',
   'Step 4: "Finance" under "Settings" is off.', 'Step 5: "Finance" under "Settings" is off.'],
  ["PERM-DEFAULTS"],
  note='The PRD names "Parts Technician" and "Time Clock User"; on Roles & Permissions they may read "Parts Tech" and "Time Clock".')

C("S1-36", "S1", "No new permission appears on Roles & Permissions",
  [ADMIN(), ("Starting screen: Settings, Roles & Permissions.", None)],
  ['Click "Create custom role".', "Look at the page-access toggles, the Customers row and the cross toggles."],
  ["Step 1: the role editor opens.",
   'Step 2: there is no new toggle for credit terms: Credit Terms is governed by the existing "Finance" sub-row under "Settings"; Move Customers by the existing "Customers" row\'s "Create & Edit" column and the "View and Manage AP/AR Data" cross toggle. The Settings sub-toggles are the same six as before the release (App Settings, Service, Parts, Finance, Data Import, View/Manage Wages).'],
  ["PERM-NONEW", "PERM-SCREEN"])
