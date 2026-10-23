"""DATA — Counts and due dates, exact numbers (Rule 116): every count on the page, in the Move window, in toasts and the log, and every due
date computed by hand with the arithmetic shown (S7 examples and boundaries)."""
from ct_lib import C, HOLD
from common import *

def da(key, title, pre, pairs, q, note="", marker=None, who=None):
    st = [a for a, _ in pairs]; rs = [f"Step {i}: {b}" for i, (_, b) in enumerate(pairs, 1)]
    C(key, "DATA", title, [who or ADMIN()] + pre, st, rs, q, note=note, marker=marker)

def inv_case(key, title, term_pre, example, dates, q, extra_pre=(), note=""):
    """dates: list of (invoice date, due date with arithmetic). One work order; the invoice date is changed on the preview step by step."""
    pre = [(f"Customer {{Customer-A}} holds {term_pre}.", f"For example: {{Customer-A}} is ZZAUTOTEST {key} Customer{example}."), *extra_pre,
           (wo_invoice("{Work-order-1}", "{Customer-A}"), "For example: {Work-order-1} is S2-15440.")]
    pairs = [("Open {Work-order-1}'s Finance tab.", "the invoice preview shows Invoice Date and Due date.")]
    for d, due in dates: pairs.append((f"Set Invoice Date to {d}.", f"the Due date reads {due}."))
    da(key, title, pre, pairs, q, note=note)

inv_case("DATA-01", "Net 30 is due 30 days after the invoice date",
         "Net 30", "", [("Oct 5, 2026", "Nov 4, 2026 (Oct 5 + 30 days: 26 days to Oct 31, then 4 into November)")], ["S7-R1"])
inv_case("DATA-02", "The shop's own Net 10 term is due 10 days after the invoice date",
         "the shop's own term {Term-A}, due 10 days after the invoice date", " and {Term-A} is ZZAUTOTEST DATA-02 Net 10",
         [("Oct 5, 2026", "Oct 15, 2026 (Oct 5 + 10 days)"), ("Oct 25, 2026", "Nov 4, 2026 (Oct 25 + 10 days: 6 days to Oct 31, then 4)")], ["S7-R1", "T-OWN"])
inv_case("DATA-03", "Day 10 of the following month: early and late invoice dates",
         "the shop's own term {Term-A}, due on day 10 of the following month", " and {Term-A} is ZZAUTOTEST DATA-03 Tenth",
         [("Oct 5, 2026", "Nov 10, 2026 (day 10 of November)"), ("Oct 28, 2026", "Nov 10, 2026 (still day 10 of November, whatever the invoice day)"),
          ("Oct 10, 2026", "Nov 10, 2026 (an invoice on day 10 is due in the following month, not the same day)")], ["S7-R2", "T-OWN"])
inv_case("DATA-04", "Day 31 in a 30-day month uses the month's last day",
         "the shop's own term {Term-A}, due on day 31 of the following month", " and {Term-A} is ZZAUTOTEST DATA-04 ThirtyFirst",
         [("Oct 5, 2026", "Nov 30, 2026 (November has 30 days)"), ("Mar 15, 2027", "Apr 30, 2027 (April has 30 days)"), ("May 15, 2027", "Jun 30, 2027 (June has 30 days)"),
          ("Aug 15, 2027", "Sep 30, 2027 (September has 30 days)"), ("Nov 15, 2027", "Dec 31, 2027 (December has 31 days)")], ["S7-R3"])
da("DATA-05", "Days 29 to 31 invoiced in January fall on Feb 28 in 2027",
   [("Customers {Customer-A}, {Customer-B} and {Customer-C} hold the shop's own terms {Term-A} (day 31 of the following month), {Term-B} (day 30) and {Term-C} (day 29).",
     "For example: the customers are ZZAUTOTEST DATA-05 A, B and C, and the terms ZZAUTOTEST DATA-05 D31, D30 and D29."),
    ("Work orders {Work-order-1}, {Work-order-2} and {Work-order-3}, for {Customer-A}, {Customer-B} and {Customer-C}, are complete and ready to invoice.", "For example: S2-15440, S2-15441 and S2-15442.")],
   [("Open {Work-order-1}'s Finance tab.", "the invoice preview shows."), ("Set Invoice Date to Jan 20, 2027.", "the Due date reads Feb 28, 2027 (2027 is not a leap year; February has 28 days, fewer than 31)."),
    ("Open {Work-order-2}'s Finance tab.", "the invoice preview shows."), ("Set Invoice Date to Jan 20, 2027.", "the Due date reads Feb 28, 2027 (fewer than 30)."),
    ("Open {Work-order-3}'s Finance tab.", "the invoice preview shows."), ("Set Invoice Date to Jan 20, 2027.", "the Due date reads Feb 28, 2027 (fewer than 29).")],
   ["S7-R3"])
inv_case("DATA-06", "Day 30 or 31 invoiced in January 2028 falls on Feb 29",
         "the shop's own term {Term-A}, due on day 31 of the following month", " and {Term-A} is ZZAUTOTEST DATA-06 D31",
         [("Jan 20, 2028", "Feb 29, 2028 (2028 is a leap year; February has 29 days)"), ("Jan 31, 2028", "Feb 29, 2028 (invoice on the last day of January)")], ["S7-R3"])
da("DATA-06b", "Day 28 and day 29 terms in February, leap year and not",
   [("Customers {Customer-A} and {Customer-B} hold the shop's own terms {Term-A} (day 28 of the following month) and {Term-B} (day 29).",
     "For example: the customers are ZZAUTOTEST DATA-06b A and B, {Term-A} is ZZAUTOTEST DATA-06b D28 and {Term-B} is ZZAUTOTEST DATA-06b D29."),
    ("Work orders {Work-order-1} for {Customer-A} and {Work-order-2} for {Customer-B} are complete and ready to invoice.", "For example: S2-15440 and S2-15441.")],
   [("Open {Work-order-1}'s Finance tab.", "the invoice preview shows."), ("Set Invoice Date to Jan 20, 2027.", "the Due date reads Feb 28, 2027 (day 28 exists in every February)."),
    ("Open {Work-order-2}'s Finance tab.", "the invoice preview shows."), ("Set Invoice Date to Jan 20, 2027.", "the Due date reads Feb 28, 2027 (2027 has no Feb 29, so the last day is used)."),
    ("Set Invoice Date to Jan 20, 2028.", "the Due date reads Feb 29, 2028 (2028 is a leap year, so day 29 exists).")],
   ["S7-R3"])
inv_case("DATA-07", "A December invoice is due in January of the next year",
         "the shop's own term {Term-A}, due on day 10 of the following month", " and {Term-A} is ZZAUTOTEST DATA-07 Tenth",
         [("Dec 15, 2026", "Jan 10, 2027 (the month after December is January of the next year)"), ("Dec 31, 2026", "Jan 10, 2027")], ["S7-R4"])
inv_case("DATA-08", "Invoices on the first and the last day of a month",
         "the shop's own term {Term-A}, due on day 1 of the following month", " and {Term-A} is ZZAUTOTEST DATA-08 First",
         [("Oct 1, 2026", "Nov 1, 2026"), ("Oct 31, 2026", "Nov 1, 2026 (one day later, the next month's day 1)")], ["S7-R2"])
inv_case("DATA-09", "Net 30 from the last day of January crosses a short February",
         "Net 30", "", [("Jan 31, 2027", "Mar 2, 2027 (Jan 31 + 30: 28 days of February brings Feb 28, then 2 more)"), ("Feb 1, 2027", "Mar 3, 2027 (Feb 1 + 30: 27 days to Feb 28, then 3)")], ["S7-R1"])
da("DATA-10", "Net 1 and Net 365 are exact to the day",
   [("Customers {Customer-A} and {Customer-B} hold the shop's own terms {Term-A} (due 1 day after the invoice date) and {Term-B} (due 365 days after).",
     "For example: the customers are ZZAUTOTEST DATA-10 A and B, {Term-A} is ZZAUTOTEST DATA-10 N1 and {Term-B} is ZZAUTOTEST DATA-10 N365."),
    ("Work orders {Work-order-1} for {Customer-A} and {Work-order-2} for {Customer-B} are complete and ready to invoice.", "For example: S2-15440 and S2-15441.")],
   [("Open {Work-order-1}'s Finance tab.", "the invoice preview shows."), ("Set Invoice Date to Oct 31, 2026.", "the Due date reads Nov 1, 2026 (Oct 31 + 1 day)."),
    ("Set Invoice Date to Dec 31, 2026.", "the Due date reads Jan 1, 2027 (Dec 31 + 1 day)."), ("Open {Work-order-2}'s Finance tab.", "the invoice preview shows."),
    ("Set Invoice Date to Oct 5, 2026.", "the Due date reads Oct 5, 2027 (365 days; February 2027 has 28 days, so a year is exactly 365)."),
    ("Set Invoice Date to Feb 1, 2028.", "the Due date reads Jan 31, 2029 (2028 has 366 days, so 365 days falls one day short of Feb 1).")],
   ["S7-R1", "KD-RANGE"])
inv_case("DATA-11", "Net 30 across the March clock change is due on the 30th day",
         "Net 30", "", [("Mar 1, 2027", "Mar 31, 2027 (Mar 1 + 30; the clocks change on Mar 14, 2027 and the date does not move)"),
                        ("Feb 20, 2027", "Mar 22, 2027 (Feb 20 + 30: 8 days to Feb 28, then 22)")], ["S7-R10", "S7-R6"],
         extra_pre=[("The work order belongs to {Location-A}, whose time zone has daylight saving time.", "For example: {Location-A} is in Edmonton (Mountain time).")])
inv_case("DATA-12", "Net 30 across the November clock change is due on the 30th day",
         "Net 30", "", [("Oct 20, 2026", "Nov 19, 2026 (Oct 20 + 30: 11 days to Oct 31, then 19; the clocks change on Nov 1, 2026)")], ["S7-R10", "S7-R6"],
         extra_pre=[("The work order belongs to {Location-A}, whose time zone has daylight saving time.", "For example: {Location-A} is in Edmonton (Mountain time).")])
inv_case("DATA-13", "An Edmonton invoice on day 10 of the following month is due Nov 10",
         "the shop's own term {Term-A}, due on day 10 of the following month", " and {Term-A} is ZZAUTOTEST DATA-13 Tenth",
         [("Oct 5, 2026", "Nov 10, 2026 (not Nov 9: the November clock change inside the span does not move the date)")], ["S7-R6"],
         extra_pre=[("The work order belongs to {Location-A}, in Edmonton's time zone, and you are working in a location in another time zone, {Location-B}.",
                     "For example: {Location-A} is Edmonton and {Location-B} is in Toronto.")])
inv_case("DATA-14", "A location with no time zone counts due dates on UTC",
         "Net 30", "", [("Oct 20, 2026", "Nov 19, 2026 (Oct 20 + 30 days, counted on the UTC calendar, which has no clock change)")], ["S7-R6b"],
         extra_pre=[("The work order belongs to {Location-A}, which has no time zone set.", "For example: {Location-A} is ZZAUTOTEST DATA-14 No Zone.")])
inv_case("DATA-15", "Changing the invoice date recalculates the shop's own term",
         "the shop's own term {Term-A}, due on day 10 of the following month", " and {Term-A} is ZZAUTOTEST DATA-15 Tenth",
         [("Oct 5, 2026", "Nov 10, 2026"), ("Nov 12, 2026", "Dec 10, 2026 (recalculated from the new date)"), ("Jan 31, 2027", "Feb 10, 2027")], ["S7-R8"])
da("DATA-16", "COD and Due on Receipt are due on the invoice date",
   [("Customer {Customer-A} holds COD and customer {Customer-B} holds Due on Receipt.", "For example: ZZAUTOTEST DATA-16 Cash and ZZAUTOTEST DATA-16 Receipt."),
    ("Work orders {Work-order-1} for {Customer-A} and {Work-order-2} for {Customer-B} are complete and ready to invoice.", "For example: S2-15440 and S2-15441.")],
   [("Open {Work-order-1}'s Finance tab.", "the invoice preview shows."), ("Set Invoice Date to Oct 5, 2026.", "the Due date reads Oct 5, 2026 (COD: the invoice date)."),
    ("Open {Work-order-2}'s Finance tab.", "the invoice preview shows."), ("Set Invoice Date to Oct 5, 2026.", "the Due date reads Oct 5, 2026 (Due on Receipt: the invoice date).")],
   ["S7-R5"])

da("DATA-17", "A vendor on Credit Hold has vendor invoices due on the invoice date",
   [("Vendor {Vendor-A} holds Credit Hold and vendor {Vendor-B} holds Net 45.", "For example: {Vendor-A} is ZZAUTOTEST DATA-17 Held and {Vendor-B} is ZZAUTOTEST DATA-17 Forty Five."),
    ("A new vendor invoice {Vendor-invoice-A} for {Vendor-A} is open, not yet saved.", "For example: {Vendor-invoice-A} is a vendor invoice for one part.")],
   [("Set the invoice date to Oct 5, 2026.", "the due date reads Oct 5, 2026 (Credit Hold: due on the invoice date)."),
    ("Change the vendor to {Vendor-B}.", "the due date reads Nov 19, 2026 (Oct 5 + 45 days: 26 to Oct 31, then 19)."), ("Save the vendor invoice.", "the stored due date is Nov 19, 2026.")],
   ["S7-R5", "S7-R9"])

da("DATA-18", "A vendor invoice from a delivery uses the delivery's location calendar",
   [("You are working in {Location-A}; a delivery for vendor {Vendor-A} belongs to {Location-B}, in a time zone where the date is already one day later. Run the case at a time of day when the two dates differ.",
     "For example: {Location-A} is in Edmonton, {Location-B} is in Auckland and {Vendor-A} is ZZAUTOTEST DATA-18 Vendor on Net 30."),
    ("Today's date at {Location-B} is {Date-A}; {Date-B} is {Date-A} plus 30 days.", "For example: {Date-A} is Oct 22, 2026 and {Date-B} is Nov 21, 2026.")],
   [("Receive the delivery for {Vendor-A}.", "the delivery is received and its vendor invoice is created."),
    ("Open the new vendor invoice.", "its due date reads {Date-B}, counted from {Location-B}'s date {Date-A} (not from your location's date).")],
   ["S7-R6a", "S7-R6"])

da("DATA-19", "The blue line's due date is exact for Net 365 and day 31",
   [("Today's date at {Location-A} is {Date-A}; {Date-B} is {Date-A} plus 365 days, and {Date-C} is day 31 of the month after {Date-A}, or that month's last day if it is shorter.",
     "For example: {Date-A} is Oct 23, {Date-B} is Oct 23 (of next year) and {Date-C} is Nov 30."), PAGE],
   [('Click "New Credit Term".', "the window opens."), ("Type 365 in the Days box.", 'the blue line ends "An invoice dated {Date-A} is due {Date-B}."'),
    ("Click the Day box.", "the day option is chosen."), ("Type 31 in the Day box.", 'the blue line ends "An invoice dated {Date-A} is due {Date-C}." (for example Oct 23 → Nov 30, because November has 30 days).')],
   ["S3-R5", "S3-R16", "S7-R3"])

# ---- counts ------------------------------------------------------------------------------------------------------------------
da("DATA-20", "Customers counts include odd spellings and every status, never Counter Sale",
   [("The shop's own term {Term-A} is held by no customer, and Net 30 is held by {Count-B} customers, written down before you start (the Counter Sale customer is never counted).",
     "For example: {Count-B} is 40 and {Term-A} is ZZAUTOTEST DATA-20 Fourteen."),
    ("A contacts import file with three new customers: {Customer-B} with the credit term text \"NET 30\", {Customer-C} with \"net30\" and {Customer-D} with {Term-A} written in capital letters.",
     "For example: {Customer-B}, {Customer-C} and {Customer-D} are ZZAUTOTEST DATA-20 Bravo, Charlie and Delta."), PAGE],
   [("Import the file through Settings, Data Import, Contacts.", "the three customers are created (none is refused)."),
    ("Reload the Credit Terms page.", 'Net 30 reads {Count-B} + 2 (for example 40 + 2 = 42): "NET 30" and "net30" both count as Net 30; {Term-A} reads 1.'),
    ("Set {Customer-B}'s status to inactive on its customer page.", "the customer is inactive."), ("Reload the Credit Terms page.", "Net 30 still reads {Count-B} + 2: customers count whatever their status.")],
   ["S1-R12", "T-INUSE", "A-SPELL", "S11-E2", "S10-R3"])

da("DATA-21", "A customer and a vendor stored with a blank term count under COD",
   [("Customer {Customer-A} and vendor {Vendor-A} were stored with a blank credit term before the release; COD's Customers count is {Count-A} and Vendors count {Count-B} with them included.",
     "For example: {Customer-A} is ZZAUTOTEST DATA-21 Blank, {Vendor-A} is ZZAUTOTEST DATA-21 Blank Vendor, {Count-A} is 121 and {Count-B} is 768."),
    ("The organization's Counter Sale customer is on COD.", None), PAGE],
   [("Look at the COD row.", "Customers reads {Count-A} and Vendors reads {Count-B}."),
    ("Open Edit Customer for {Customer-A}.", "the window opens."), ('Choose "Net 30" in Credit Terms.', "Net 30 is chosen."), ("Click Save.", "the customer is on Net 30."),
    ("Reload the Credit Terms page.", "COD reads {Count-A} − 1 (for example 121 − 1 = 120). The Counter Sale customer was never in the count.")],
   ["S1-R12", "S1-R13", "S11-R9", "T-INUSE", "T-COUNTER"])

da("DATA-22", "Vendors counts follow the same rules as customers",
   [("Net 45 is held by {Count-A} vendors (written down). Vendor {Vendor-A} is stored with \"NET 45\" and vendor {Vendor-B} holds Net 45 and is inactive; both are in {Count-A}.",
     "For example: {Count-A} is 5, {Vendor-A} is ZZAUTOTEST DATA-22 Upper and {Vendor-B} is ZZAUTOTEST DATA-22 Inactive."), PAGE],
   [("Look at the Net 45 row's Vendors cell.", "it reads {Count-A} (for example 5): \"NET 45\" counts as Net 45 and the inactive vendor counts."),
    ("Open Edit Vendor for {Vendor-A}.", "the window opens."), ('Choose "Net 60".', "Net 60 is chosen."), ("Click Save & Close.", "the vendor is on Net 60."),
    ("Reload the Credit Terms page.", "Net 45 reads {Count-A} − 1 (for example 4) and Net 60's Vendors count went up by 1.")],
   ["S1-R13", "S6-E2", "T-INUSE"])

da("DATA-23", "Customers counts update straight after a move",
   [("Net 15 is held by {Count-A} customers and Net 20 by {Count-B}, written down; three of the Net 15 customers are {Customer-A}, {Customer-B} and {Customer-C}.",
     "For example: {Count-A} is 7, {Count-B} is 2 and the three are ZZAUTOTEST DATA-23 Alpha to Charlie."), PAGE],
   [('Click the "⋯" at the right of the "Net 15" row.', "the menu opens."), ('Click "Move Customers".', 'the window shows "{Count-A} selected" (for example "7 selected").'),
    ('Click "Select None".', '"0 selected".'), ("Tick {Customer-A}.", '"1 selected".'), ("Tick {Customer-B}.", '"2 selected".'), ("Tick {Customer-C}.", '"3 selected"; the button reads "Move 3 Customers".'),
    ('Choose "Net 20" in "Move To".', "Net 20 is chosen."), ('Click "Move 3 Customers".', 'the toast reads "3 customers moved to Net 20." and, without reloading, Net 15 reads {Count-A} − 3 (for example 4) and Net 20 reads {Count-B} + 3 (for example 5).'),
    ("Reload the page.", "the counts are the same after the reload.")],
   ["S4-R9", "S4-R2", "S1-R12"])

da("DATA-24", "Tab counts change by one on each deactivate, reactivate, create and delete",
   [("Net 45 is active.", None), ("Before you start, the Active tab's count reads {Count-A} and the Inactive tab's {Count-B} (write them down).", "For example: {Count-A} is 12 and {Count-B} is 0."),
    ("A name {Term-A} that no term has.", "For example: {Term-A} is ZZAUTOTEST DATA-24 Fourteen."), PAGE],
   [('Click "New Credit Term".', "the window opens."), ("Type {Term-A} in Name.", "the field shows {Term-A}."), ("Type 14 in the Days box.", "the blue information line shows."),
    ('Click "Create Credit Term".', "Active reads {Count-A} + 1 (for example 13) and Inactive {Count-B}."), ('Click the "⋯" at the right of the "Net 45" row.', "the menu opens."),
    ('Click "Deactivate".', "Active reads {Count-A} (back to the starting number) and Inactive {Count-B} + 1."), ('Click the "⋯" at the right of the {Term-A} row.', "the menu opens."),
    ('Click "Deactivate".', "Active {Count-A} − 1, Inactive {Count-B} + 2."),
    ('Click the "Inactive" tab.', "Net 45 and {Term-A} are among its rows."), ('Click the "⋯" at the right of the "Net 45" row.', "the menu opens."), ('Click "Reactivate".', "Active {Count-A}, Inactive {Count-B} + 1."),
    ('Click the "⋯" at the right of the {Term-A} row.', "the menu opens."), ('Click "Delete Credit Term".', "the confirmation opens."),
    ('Click the red "Delete Credit Term" button.', "Active {Count-A} and Inactive {Count-B}: both counts are back where they started (for example 12 and 0).")],
   ["S1-R3", "S2-R7", "S2-R8", "S2-R9", "S3-R7"])

da("DATA-25", "The selected count follows search, Select All and Select None",
   [("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly five customers: {Customer-A}, {Customer-B}, {Customer-C}, {Customer-D} and {Customer-E}; only {Customer-B} and {Customer-D} have \"Fleet\" in their names.",
     "For example: {Term-A} is ZZAUTOTEST DATA-25 N20, they are ZZAUTOTEST DATA-25 Alpha, ZZAUTOTEST DATA-25 Bravo Fleet, ZZAUTOTEST DATA-25 Charlie, ZZAUTOTEST DATA-25 Delta Fleet and ZZAUTOTEST DATA-25 Echo."), PAGE],
   [('Click the "⋯" at the right of the {Term-A} row.', "the menu opens."), ('Click "Move Customers".', '"5 selected"; button "Move 5 Customers".'),
    ('Type "fleet" in "Search customers".', "only {Customer-B} and {Customer-D} are listed; still \"5 selected\"."), ('Click "Select None".', '"3 selected" (5 − 2); button "Move 3 Customers".'),
    ("Clear the search box.", "all five listed, {Customer-B} and {Customer-D} unticked, \"3 selected\"."), ("Untick {Customer-A}.", '"2 selected".'),
    ('Type "fleet" in "Search customers".', "the two Fleet customers are listed."), ('Click "Select All".', '"4 selected" (2 + 2); {Customer-A} stays unticked because the search hides it.'),
    ("Clear the search box.", "four ticked, {Customer-A} unticked, button \"Move 4 Customers\".")],
   ["S4-R2", "S4-R6"])

da("DATA-26", "Toast and log count customers moved to COD",
   [("The shop's own term {Term-A}, due 20 days after the invoice date, is held by exactly two customers, {Customer-A} and {Customer-B}.", "For example: {Term-A} is ZZAUTOTEST DATA-26 N20, they are ZZAUTOTEST DATA-26 Alpha and ZZAUTOTEST DATA-26 Bravo."), PAGE],
   [('Click the "⋯" at the right of the {Term-A} row.', "the menu opens."), ('Click "Move Customers".', '"2 selected".'), ('Choose "COD" in "Move To".', "the $0 line shows."),
    ('Click "Move 2 Customers".', 'the confirmation title reads "Set 2 customers\' credit limit to $0?".'), ('Click "Set Limits To $0 And Move".', 'the toast reads "2 customers moved to COD."'),
    ('Open the "⋯" page menu.', "the menu opens."),
    ('Click "Audit Log".', 'the newest row reads "2 customers from {Term-A} to COD" followed by "Credit limit set to $0 (previous limits are in each customer\'s note)".')],
   ["S4-R9", "S4-R14", "S12-R3 MOVED", "UFS-40", "UFS-48", "UFS-49"])
da("DATA-26b", "Toast and log use the singular for one customer moved",
   [("The shop's own term {Term-A}, due 45 days after the invoice date, is held by exactly one customer, {Customer-C}.", "For example: {Term-A} is ZZAUTOTEST DATA-26b N45, {Customer-C} is ZZAUTOTEST DATA-26b Charlie."), PAGE],
   [('Click the "⋯" at the right of the {Term-A} row.', "the menu opens."), ('Click "Move Customers".', '"1 selected"; button "Move 1 Customer".'), ('Choose "Net 30" in "Move To".', "Net 30 is chosen."),
    ('Click "Move 1 Customer".', 'the toast reads "1 customer moved to Net 30."'), ('Open the "⋯" page menu.', "the menu opens."),
    ('Click "Audit Log".', 'the newest row reads "1 customer from {Term-A} to Net 30", with no credit-limit line.')],
   ["S4-R9", "S12-R3 MOVED"])
da("DATA-27", "Reversed and paid invoices count toward a term's holders, estimates never",
   [("The shop's own term {Term-A} is held by no customer or vendor today. It was used by invoices {Invoice-A} (paid), {Invoice-B} (reversed) and {Invoice-C} (open), and by an estimate {Estimate-A} that was never invoiced; the customer was then moved to Net 30.",
     "For example: {Term-A} is ZZAUTOTEST DATA-27 Fourteen and the records belong to ZZAUTOTEST DATA-27 Customer."), PAGE],
   [('Click the "⋯" at the right of the {Term-A} row.', '"Edit" and "Delete Credit Term" are greyed.'), ('Hover "Edit".', 'the hover reads "Used by 3 invoices" (paid, reversed and open count; the estimate does not).')],
   ["T-INUSE", "S2-R2"])
