"""Every Splitting Sales Representatives case in the QA lead's pattern (Rule 117 fourteenth amendment, 26 Oct 2026, PERMANENT).
S1-01 (C665915) is the model and stays exactly as approved in trial_layout.py; this file holds every other library case.

Per case: pre = the plain precondition bullets in setup order (the Blocked line is added last by the renderer); r = {step: [bullets]}
where a step's result reads better as separate facts than the automatic split gives; s = {step: "text"} where a step's wording changes
beyond placeholders becoming plain names; names = plain names that differ from pattern_lib.default_names; title where it changes.
Steps and results not overridden are the case's own words with its placeholders turned into the plain names (pattern_lib.sub) and each
result split into bullets at sentence and semicolon boundaries (pattern_lib.split_bullets). Every override carries exactly the meaning of
the old result; the pass report checks by script that no amount, date, quoted label or term was lost."""
from pattern_lib import *
PATTERN = {}
def E(key, pre, r=None, s=None, names=None, title=None):
    assert key not in PATTERN, key
    PATTERN[key] = dict(pre=pre, r=r or {}, s=s or {}, names=names or {}, title=title)

# ---------------- Story 1: one Sales Representative field ----------------
E("S1-02", [ADMIN_P,
   'Have three active staff members at the test location with their "Sales Representative" switch on: sales rep A, sales rep B and sales rep C. Sales rep A and sales rep B share a first name and sales rep A\'s last name comes first in the alphabet; sales rep C has a later first name.',
   'Have staff member D active at the test location with the "Sales Representative" switch off.',
   CUST_P, WO_P(), OPEN_WO_P],
  r={1: ["A dropdown opens under the field.", 'Reading it from top to bottom: the first option is "Unassigned".', '"Unassigned" is checked.',
         "The sales representatives follow, sorted by first name, then last name, A to Z, so sales rep A comes before sales rep B, and sales rep B before sales rep C.",
         "There is no search box.", "Staff member D is not listed."]})
E("S1-03", [ADMIN_P, REPS2_P, CUST_P, WO_P(), OPEN_WO_P],
  r={2: ["The dropdown closes.", "The field reads sales rep A.", "There is no Save button near the field.", "The change is already saved."]})
E("S1-04", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'), OPEN_WO_P],
  r={3: ["The dropdown closes.", 'The field reads "Unassigned".']})
E("S1-05", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'), OPEN_WO_P],
  r={2: ["The dropdown closes.", "The field still reads sales rep A."], 4: ["The dropdown closes.", "The field still reads sales rep A."]})
E("S1-06", ['Sign in at the test location as user B, whose role has "Work Orders — View" but not "Work Orders — Create & Edit".',
   REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'), OPEN_WO_P],
  r={1: ['The field shows as plain text: "Sales Representative" with sales rep A under it.', "There is no box, no arrow, no + and no remove x."]})
E("S1-07", [ADMIN_P,
   REPS2_P,
   CUST_P, WO_P('one "Sales Representative" field set to sales rep B'),
   'After sales rep B was picked on the work order, turn sales rep B\'s "Sales Representative" switch off and save (the staff account stays active).',
   OPEN_P("the Work Orders page")],
  r={2: ["Sales rep B is not in the dropdown.", "No option is checked."]})
E("S1-08", [ADMIN_P,
   'Have two active staff members at the test location with their "Sales Representative" switch on: sales rep A and sales rep B.',
   CUST_P, WO_P('one "Sales Representative" field set to sales rep B'),
   "After sales rep B was picked on the work order, deactivate sales rep B's staff account.",
   OPEN_P("the Work Orders page")],
  r={2: ["Sales rep B is not in the dropdown.", "No option is checked."]})
E("S1-09", [ADMIN_P, REPS2_P, CUST_P, WO_P(), OPEN_WO_P,
   'Open sales rep B\'s staff record in a second tab of the same browser, with the "Sales Representative" switch on.'],
  r={4: ['The change is refused with the message "The selected staff member is not a sales representative."', 'The field returns to "Unassigned".']})
E("S1-10", [ADMIN_P, REPS2_P, CUST_P, WO_P(), OPEN_WO_P],
  r={2: ['The field returns to the last saved value ("Unassigned").', "An error message shows."]})
E("S1-10b", [ADMIN_P, REPS2_P, CUST_P, WO_P(), OPEN_WO_P])
E("S1-11", [ADMIN_P, REPS2_P, CUST_P,
   'Have a first work order for that customer, open and not invoiced, whose "Sales Representative - Labor" field reads sales rep A and whose "Sales Representative - Parts" field holds staff member C, whose staff record no longer exists.',
   'Have a second work order for that customer, open and not invoiced, whose one "Sales Representative" field holds staff member D, a staff member of another organization.',
   OPEN_P("the first work order")])

# ---------------- Story 2: separate Labor and Parts representatives ----------------
E("S2-01", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'), OPEN_WO_P],
  r={4: ['The menu closes.', 'The one field becomes two, in this order: "Sales Representative - Labor" and "Sales Representative - Parts".',
         "Both read sales rep A.", "Neither dropdown has opened on its own.", "Both labels show in full.",
         '"Sales Representative - Parts" has a remove x to its right.', '"Sales Representative - Labor" has no button.', "The + is gone."],
     5: ["After the reload both fields still show.", "Both read sales rep A."]})
E("S2-02", [ADMIN_P, CUST_P, WO_P(), OPEN_WO_P])
E("S2-03", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'), OPEN_WO_P],
  r={2: ["The menu opens below the +."], 5: ["The menu closes.", 'The card still shows one "Sales Representative" field reading sales rep A.']})
E("S2-04", [ADMIN_P, REPS2_P, CUST_P, WO_P('"Sales Representative - Labor" and "Sales Representative - Parts" both set to sales rep A'), OPEN_WO_P],
  r={5: ['Labor reads "Unassigned".', "Parts reads sales rep B."], 8: ["Both fields still show after the reload.", "Both read sales rep B."]})
E("S2-05", [ADMIN_P, REPS2_P, CUST_P, WO_P('"Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B'), OPEN_WO_P],
  r={2: ['The two fields become one "Sales Representative" field reading sales rep A.', "The + shows beside it again."]})
E("S2-06", [ADMIN_P, REPS2_P, CUST_P, WO_P('"Sales Representative - Labor" reading "Unassigned" and "Sales Representative - Parts" set to sales rep B'), OPEN_WO_P])
_C_OFF = ['Have a third active staff member at the test location, sales rep C, with the "Sales Representative" switch on.']
E("S2-07", [ADMIN_P, REPS2_P] + _C_OFF + [CUST_P, WO_P('one "Sales Representative" field set to sales rep C'),
   'Then turn sales rep C\'s "Sales Representative" switch off and save (the staff account stays active), so the work order\'s field reads sales rep C\'s name followed by "(Inactive)".',
   OPEN_WO_P],
  r={3: ["The change is saved, not refused.", '"Sales Representative - Labor" and "Sales Representative - Parts" both read sales rep C\'s name followed by "(Inactive)".', "No error message shows."],
     4: ["Both fields still show.", 'Both still read sales rep C\'s name followed by "(Inactive)".']})
E("S2-07b", [ADMIN_P, REPS2_P] + _C_OFF + [CUST_P, WO_P('"Sales Representative - Labor" and "Sales Representative - Parts" both set to sales rep C'),
   'Then turn sales rep C\'s "Sales Representative" switch off and save (the staff account stays active), so both fields read sales rep C\'s name followed by "(Inactive)".',
   OPEN_WO_P],
  r={2: ["The change is saved, not refused.", "Parts reads sales rep A.", 'Labor still reads sales rep C\'s name followed by "(Inactive)".', "No error message shows."]})
E("S2-07c", [ADMIN_P, REPS2_P] + _C_OFF + [CUST_P, WO_P('"Sales Representative - Labor" set to sales rep C and "Sales Representative - Parts" set to sales rep A'),
   'Then turn sales rep C\'s "Sales Representative" switch off and save (the staff account stays active), so Labor reads sales rep C\'s name followed by "(Inactive)".',
   OPEN_WO_P])
E("S2-08", [ADMIN_P, REPS2_P, CUST_P,
   'Have a work order for that customer with "Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B, and invoice it.',
   OPEN_WO_P],
  r={2: ['"Sales Representative - Labor" with sales rep A and "Sales Representative - Parts" with sales rep B show as plain text.', "There is no box, no arrow, no + and no remove x."]})
E("S2-09", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A, ready to invoice'), OPEN_WO_P,
   "Open the same work order in a second tab of the same browser."],
  r={3: ['The change is refused with the message "The sales representative cannot be changed on an invoiced or paid work order."', "The field returns to sales rep A."]})
E("S2-10", [ADMIN_P, REPS2_P, CUST_P,
   'Have a work order for that customer with one "Sales Representative" field set to sales rep A, and invoice it (do not take a payment).',
   OPEN_WO_P],
  r={1: ["The invoice is reversed.", "The Sales Representative field can be changed again."],
     4: ["The new invoice is created.", "The field is plain text again, reading sales rep B."]})
E("S2-11", [ADMIN_P, REPS2_P, CUST_P,
   'Have an open, uninvoiced part sale for that customer, with its Sales Representative field reading "Unassigned".',
   OPEN_P("the part sale")],
  r={1: ['There is one representative field, labelled "Sales representative" with a small "r".', "There is no + button beside it."],
     3: ["The field reads sales rep A.", 'Its label still reads "Sales representative".', "There is still no + and no remove x."]})
CUST_C_P = "Use a customer whose one Sales Representative is sales rep C."
E("S2-12", [ADMIN_P, REPS3_P, CUST_C_P,
   WO_P('two approved lines (one labor line and one part), "Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B', lines=False),
   OPEN_WO_P],
  r={2: ['It shows "Sales Representative - Labor" reading sales rep A and "Sales Representative - Parts" reading sales rep B.', "Neither field shows the customer's sales rep C."]})
E("S2-14", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'),
   'Open the work order in two windows of a desktop browser at least 1024 pixels wide, side by side, both showing the one "Sales Representative" field.'],
  r={5: ["The second window's dropdown closes.", "Its one field reads sales rep B."]})
E("S2-15", [ADMIN_P, REPS3_P, CUST_C_P,
   WO_P('"Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B'),
   "After both representatives are set, add a line to the work order so that its history holds a version saved after both were set.",
   OPEN_WO_P],
  r={3: ["There is no box, no arrow, no + and no remove x."], 4: ["Nothing opens.", "Nothing can be changed."]})
E("S2-16", [ADMIN_P, REPS3_P, CUST_C_P,
   'Have a work order for that customer with "Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B, then invoice it and take payment in full.',
   OPEN_WO_P],
  r={2: ['It shows "Sales Representative - Labor" reading sales rep A and "Sales Representative - Parts" reading sales rep B.', "Neither field shows the customer's sales rep C."]})

# ---------------- Story 3: phone and touch screens ----------------
PHONE = "on a phone (a touch screen with no mouse pointer)"
E("S3-01", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'), OPEN_P(where=PHONE)],
  r={1: ["The card is collapsed.", "Lead Technician, Service Advisor and the Sales Representative field are not shown."],
     2: ["The card expands.", "It shows Lead Technician, Service Advisor and the Sales Representative field reading sales rep A."]})
E("S3-02", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'), OPEN_P(where=PHONE)],
  r={1: ["The field already shows its dropdown arrow, without any hover.", "The + button shows beside it at its full size, without any hover."],
     2: ["The same dropdown Lead Technician and Service Advisor open on a phone opens.", '"Unassigned" is first, with the same options as on a desktop.',
         "Sales rep A is checked.", "There is no x inside the field."]})
E("S3-02b", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'), OPEN_P(where=PHONE)],
  r={3: ['"Sales Representative - Labor" and "Sales Representative - Parts" show, both reading sales rep A.', "Each shows its arrow.", "The remove x shows beside Parts."]})
E("S3-03", [ADMIN_P, REPS2_P, CUST_P, OPEN_P("the customer's page", PHONE)],
  r={1: ["The Edit Customer window shows the Sales Representative field.", "The + shows beside it without any hover."],
     5: ['The first field is renamed "Sales Representative - Service Labor".', '"Sales Representative - Service Parts" shows under it.', "Both read sales rep A."],
     7: ["The customer saves.", 'Its page shows "Sales Representative" with sales rep A.']})

# ---------------- Story 4: a customer's default representatives ----------------
CEDIT_P = OPEN_P("the customer's Edit Customer window")
CUST_A_P = "Use a customer whose one Sales Representative is sales rep A."
E("S4-01", [ADMIN_P, REPS2_P, 'Have staff member D active with the "Sales Representative" switch off.', CUST_P, OPEN_P("the customer's page")],
  r={1: ["The window shows a Sales Representative field in the place Edit Customer shows it today.", "It has the same outlined box as the other fields.",
         "The + shows beside it without hovering.", "No field has an x inside it."]})
E("S4-01b", [ADMIN_P, REPS2_P, CUST_P, 'Open the customer\'s Edit Customer window in a desktop browser at least 1024 pixels wide, with the Sales Representative field reading "Unassigned".'])
E("S4-02", [ADMIN_P, REPS2_P, OPEN_P("the Customers page")],
  r={1: ["The New Customer window shows a Sales Representative field.", "The + shows beside it."], 5: ['The page shows "Sales Representative" with sales rep A.']})
E("S4-03", [ADMIN_P, REPS2_P, CUST_A_P, CEDIT_P],
  r={3: ['The first field is renamed "Sales Representative - Service Labor".', '"Sales Representative - Service Parts" shows under it.', "Both read sales rep A.",
         "No dropdown opens on its own.", "Service Parts has a remove x."]})
CUST_SPLIT_P = 'Use a customer with "Sales Representative - Service Labor" set to sales rep A and "Sales Representative - Service Parts" set to sales rep B.'
CUST_SPLIT3_P = ('Use a customer with "Sales Representative - Service Labor" set to sales rep A, "Sales Representative - Service Parts" set to sales rep B '
                 'and "Sales Representative - Part Sales" set to sales rep C.')
E("S4-04", [ADMIN_P, REPS3_P, CUST_SPLIT_P[:-1] + ", and no Part Sales field.", CEDIT_P],
  r={2: ['"Sales Representative - Part Sales" shows last, under Service Parts.', "It reads sales rep B (the person new part sales get today).",
         "It has a remove x to its right.", "The + is no longer shown beside the first field, because both fields have been added."]})
E("S4-04b", [ADMIN_P, REPS3_P,
   'Use a customer with "Sales Representative - Service Labor" set to sales rep A, "Sales Representative - Service Parts" set to sales rep B and "Sales Representative - Part Sales" set to sales rep B.',
   CEDIT_P],
  r={2: ["The customer saves.", 'Its page lists, in this order: "Sales Representative - Service Labor" sales rep A, "Sales Representative - Service Parts" sales rep C, "Sales Representative - Part Sales" sales rep B.']})
E("S4-03b", [ADMIN_P, 'Have staff member D active at the test location with the "Sales Representative" switch on.',
   "Use a customer whose one Sales Representative is staff member D.",
   'Then turn staff member D\'s "Sales Representative" switch off and save, so the customer shows staff member D\'s name followed by "(Inactive)".',
   CEDIT_P],
  r={2: ['The first field is renamed "Sales Representative - Service Labor".', 'It still reads staff member D\'s name followed by "(Inactive)".',
         '"Sales Representative - Service Parts" shows under it reading "Unassigned".'],
     3: ["The customer saves.", 'Its page lists "Sales Representative - Service Labor" with staff member D\'s name followed by "(Inactive)".',
         'Its page lists "Sales Representative - Service Parts" with Unassigned.']})
E("S4-04c", [ADMIN_P, 'Have sales rep A, an active staff member at the test location with the "Sales Representative" switch on.',
   'Have staff member D active at the test location with the "Sales Representative" switch on.',
   'Use a customer with "Sales Representative - Service Labor" set to sales rep A and "Sales Representative - Service Parts" set to staff member D, and no Part Sales field.',
   'Then turn staff member D\'s "Sales Representative" switch off and save, so Service Parts shows staff member D\'s name followed by "(Inactive)".',
   CEDIT_P],
  r={2: ['"Sales Representative - Part Sales" shows last.', 'It reads "Unassigned".', 'Service Parts still reads staff member D\'s name followed by "(Inactive)".',
         "Service Labor still reads sales rep A."],
     3: ["The customer saves.", 'Its page lists, in this order: Service Labor with sales rep A, Service Parts with staff member D\'s name followed by "(Inactive)", and "Sales Representative - Part Sales" with Unassigned.']})
E("S4-05", [ADMIN_P, REPS3_P, CUST_SPLIT3_P, CEDIT_P],
  r={1: ["Service Parts goes away.", 'The first field is renamed "Sales Representative".', "It reads sales rep A.", '"Sales Representative - Part Sales" still reads sales rep C.']})
E("S4-06", [ADMIN_P, REPS3_P, CUST_SPLIT3_P, CEDIT_P])
E("S4-07", [ADMIN_P, REPS2_P, CUST_A_P, CEDIT_P],
  r={2: ["Service Labor and Service Parts show, both reading sales rep A."]})
E("S4-08", [ADMIN_P, REPS2_P, "Use customer A, with no address and no Sales Representative assigned.",
   'Use customer B, with no address, "Sales Representative - Service Labor" set to sales rep A and "Sales Representative - Service Parts" set to sales rep B.',
   OPEN_P("the Customers page")])
E("S4-09", [ADMIN_P, REPS2_P, CUST_A_P, OPEN_P("the Work Orders page")])
E("S4-10", [ADMIN_P, REPS2_P, CUST_SPLIT_P, OPEN_P("the Work Orders page")])
E("S4-11", [ADMIN_P, REPS3_P, "Use customer A, whose one Sales Representative is sales rep A.",
   'Use customer B, with "Sales Representative - Service Labor" set to sales rep A and "Sales Representative - Service Parts" set to sales rep B.',
   'Use customer C, with "Sales Representative - Service Labor" set to sales rep A, "Sales Representative - Service Parts" set to sales rep B and "Sales Representative - Part Sales" set to sales rep C.',
   OPEN_P("the Part Sales page")])
E("S4-12", [ADMIN_P, REPS2_P,
   'Use a customer with "Sales Representative - Service Labor" set to sales rep A, "Sales Representative - Service Parts" set to sales rep B and "Sales Representative - Part Sales" reading "Unassigned".',
   OPEN_P("the Part Sales page")])
SBR_UN_P = SBR_P[:-1] + ", Show Unassigned on and the Sales Type column turned on."
E("S4-12b", [ADMIN_P, REPS2_P,
   'Use a customer with "Sales Representative - Service Labor" set to sales rep A, "Sales Representative - Service Parts" set to sales rep B and "Sales Representative - Part Sales" reading "Unassigned".',
   'Have a part sale for that customer that starts with Sales Representative "Unassigned", with one part, and invoice it today without picking a representative.',
   SBR_UN_P])
E("S4-13", [ADMIN_P, "Make sure nobody has set a representative on the test location's Counter Sale customer.",
   OPEN_P("the Part Sales page at the test location")])
E("S4-14", [ADMIN_P, REPS3_P, CUST_A_P,
   'Create an open, uninvoiced work order for that customer, with one approved labor line and one part, so that its one "Sales Representative" field reads sales rep A (copied from the customer when it was created).',
   OPEN_WO_P])
E("S4-14b", [ADMIN_P, REPS2_P, "Use customer A, whose one Sales Representative is sales rep A.", "Use customer B, whose one Sales Representative is sales rep B.",
   'Create an open, uninvoiced work order for customer A, with one approved labor line and one part, so that its one "Sales Representative" field reads sales rep A (copied from customer A when it was created).',
   OPEN_WO_P],
  r={1: ["The work order's customer is customer B.", "Its Sales Representative still reads sales rep A.", "It does not take customer B's sales rep B."]})
E("S4-14c", [ADMIN_P, REPS2_P, CUST_A_P,
   'Create an open, uninvoiced work order for that customer, with one approved labor line and one part, so that its one "Sales Representative" field reads sales rep A (copied from the customer when it was created).',
   CEDIT_P])
_B_OFF = 'Then turn sales rep B\'s "Sales Representative" switch off and save (the staff account stays active).'
E("S4-15", [ADMIN_P, REPS2_P, "Use a customer whose one Sales Representative is sales rep B.", _B_OFF, OPEN_P("the Work Orders page")],
  r={1: ['The customer still shows sales rep B, as sales rep B\'s name followed by "(Inactive)".']})
E("S4-15b", [ADMIN_P, REPS2_P, "Use a customer whose one Sales Representative is sales rep B.", _B_OFF,
   'After that, create a work order for that customer with one labor line and one part (its Sales Representative reads "Unassigned"), and invoice it today without picking a representative.',
   SBR_P])
E("S4-16", [ADMIN_P, REPS2_P, CUST_SPLIT_P,
   'Have a work order for that customer with one labor line of $100.00 and one part of $50.00, with both sides reading "Unassigned", and invoice it today without picking a representative.',
   SBR_P[:-1] + " and the Sales Type column turned on."],
  r={1: ['The labor of the work order\'s invoice ($100.00) is credited to sales rep A on a "Labor" row.'],
     2: ['The part ($50.00) is credited to sales rep B on a "Parts" row.']})
E("S4-17", [ADMIN_P, REPS2_P, "Use a customer whose one Sales Representative is sales rep B.",
   'Have a work order for that customer with one labor line and one part, "Sales Representative - Labor" reading "Unassigned" and "Sales Representative - Parts" set to sales rep A, and invoice it today.',
   SBR_UN_P])
E("S4-18", [ADMIN_P, REPS3_P,
   'Use customer A, with "Sales Representative - Service Labor" set to sales rep A, "Sales Representative - Service Parts" set to sales rep B and "Sales Representative - Part Sales" set to sales rep C.',
   "Use customer B, whose one Sales Representative is sales rep C.",
   OPEN_P("Settings > Staff")])
E("S4-19", [ADMIN_P, REPS2_P,
   'Use a customer with "Sales Representative - Service Labor" and "Sales Representative - Service Parts" both set to sales rep B. No other customer has sales rep B.',
   OPEN_P("Settings > Staff")])
E("S4-19b", [ADMIN_P, REPS2_P,
   'Use a customer with "Sales Representative - Service Labor" and "Sales Representative - Service Parts" both set to sales rep B.',
   'Open sales rep B\'s staff record in Settings > Staff in a desktop browser at least 1024 pixels wide, with the "Sales Representative" switch on.'],
  r={2: ["The switch stays on.", "Nothing changes."]})
E("S4-20", [ADMIN_P, REPS2_P,
   'Use customer A, with "Sales Representative - Service Labor" set to sales rep A and "Sales Representative - Service Parts" set to sales rep B.',
   "Use customer B, whose one Sales Representative is sales rep B.",
   "Open sales rep B's staff record in Settings > Staff in a desktop browser at least 1024 pixels wide."])
E("S4-20b", [ADMIN_P, REPS2_P, CUST_SPLIT_P,
   'Then turn sales rep A\'s "Sales Representative" switch off and save (the staff account stays active).',
   OPEN_P("the Customers page")],
  r={1: ['Service Labor still shows sales rep A, as sales rep A\'s name followed by "(Inactive)".'],
     3: ['The field reads sales rep A\'s name followed by "(Inactive)".', "Sales rep A is not offered in the dropdown.", "No option is checked."],
     5: ["The customer saves with no error message.", 'Its page still shows Service Labor with sales rep A\'s name followed by "(Inactive)".',
         "Its page still shows Service Parts with sales rep B."]})
E("S4-21", [ADMIN_P, REPS3_P, "Use customer A, whose one Sales Representative is sales rep A.",
   "Use customer B, with Service Labor set to sales rep A and Service Parts set to sales rep B.",
   'Use customer C, whose one Sales Representative is sales rep C and whose "Sales Representative - Part Sales" is also sales rep C.',
   "Make sure the customer names sort A to Z as customer A, customer B, customer C, and that sales rep A's name sorts before sales rep B's.",
   OPEN_P("the page with the Sales Representative Assignments export")],
  r={2: ['The column after "Representative is active?" is named "Side".', 'Customer A has one row: sales rep A, Side "Parts and Service".',
         'Customer B has two rows: sales rep A "Service Labor" and sales rep B "Service Parts".',
         'Customer C has one row: sales rep C, Side "Parts and Service, Part Sales".',
         "The rows run by customer name, A to Z (customer A, then customer B, then customer C).",
         "Within customer B, sales rep A's row comes before sales rep B's."]})
E("S4-22", [ADMIN_P, REPS3_P,
   'Use a customer with Service Labor set to sales rep A, Service Parts set to sales rep B and "Sales Representative - Part Sales" set to sales rep C.',
   "Have a contacts import file that contains the customer with its current details.",
   OPEN_P("the contacts import")])
E("S4-25", ['Sign in at the test location as user B, whose role has "Part Sales — Create & Edit" but not "Customers — Create & Edit" or "Work Orders — Create & Edit".',
   REPS2_P, 'Have staff member D active at the test location with the "Sales Representative" switch off.', OPEN_P("the Part Sales page")])
E("S4-26", [ADMIN_P, REPS3_P, "Use customer A, whose one Sales Representative is sales rep C.",
   'Use customer B, with "Sales Representative - Service Labor" set to sales rep A, "Sales Representative - Service Parts" set to sales rep B and "Sales Representative - Part Sales" set to sales rep C.',
   "Then deactivate sales rep C's staff account.",
   "Open sales rep C's staff record in Settings > Staff in a desktop browser at least 1024 pixels wide."],
  r={3: ['Customer B shows "Sales Representative - Service Labor" sales rep A and "Sales Representative - Service Parts" sales rep B.', "There is no Part Sales field.",
         "Sales rep C has not been put back."]})
E("S3-04", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'),
   OPEN_P(where="on a touch tablet with no mouse, held so that its screen is at least 1024 pixels wide")],
  r={1: ["The card is not collapsed.", "Lead Technician, Service Advisor and the Sales Representative field show without tapping the card's edit button.",
         "The field shows its dropdown arrow without any hover.", "The + button shows beside it at its full size, without any hover."],
     3: ["The menu closes.", '"Sales Representative - Labor" and "Sales Representative - Parts" show, in that order.',
         "Without tapping them, both fields show their dropdown arrow, without any hover.",
         'The remove x shows beside "Sales Representative - Parts", without any hover.']})
E("S4-27", [ADMIN_P, REPS3_P, 'Use a customer whose "Sales Representative - Part Sales" is sales rep C.',
   "Have an open, uninvoiced part sale for that customer, with two parts and its Sales Representative set to sales rep A.",
   OPEN_P("the part sale")],
  r={2: ["Its one Sales Representative field reads sales rep A, not the customer's sales rep C.", "There is no + beside it."]})
E("S4-28", ['Sign in at the test location as user B, whose role has "Customers — Create & Edit" but neither "Work Orders — View" nor "Work Orders — Create & Edit".',
   REPS2_P, 'Have staff member D active at the test location with the "Sales Representative" switch off.', CUST_P, OPEN_P("the customer's page")],
  r={4: ["The customer saves.", 'Its page shows "Sales Representative" with sales rep A.']})

# ---------------- Story 5: credit on the invoice and in Sales By Representative ----------------
LOC0_P = "Make sure the test location's Shop Supplies Charge is 0% and nothing else is invoiced at the test location today."
SBR_ST_P = SBR_P[:-1] + " and the Sales Type column turned on."
def INV_P(what, reps='"Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B', who="that customer"):
    return f"Have a work order for {who} with {what}, {reps}, and invoice it today."
_W1 = "one labor line of 2.00 hours at $100.00 an hour (Tech Time 2.00) and one part sold at $50.00"
E("S5-01", [ADMIN_P, REPS2_P, CUST_P, LOC0_P, INV_P(_W1), SBR_ST_P],
  r={1: ['The work order\'s invoice shows one row under sales rep A: Sales Type "Labor".', "The row shows Labor Invoiced $200.00 and Hrs Invoiced 2.00, with the labor columns filled.",
         "Parts Invoiced and Parts Margin show a dash, not $0.00.", "Sales rep A's summary row shows real sums (no dashes) and $200.00 of labor.",
         "Sales rep A's summary row counts the invoice once."],
     2: ['The work order\'s invoice shows one row under sales rep B: Sales Type "Parts".', "The row shows Parts Invoiced $50.00.",
         "Labor Invoiced, Labor Margin, Hrs Worked, Hrs Invoiced, Labor Delta and Shop Supplies show a dash.",
         "Sales rep B's summary row shows real sums (no dashes) and $50.00 of parts.", "Sales rep B's summary row counts the invoice once.",
         "The invoice is two rows, one under each representative."]})
E("S5-01b", [ADMIN_P, REPS2_P, CUST_P, LOC0_P, INV_P(_W1), SBR_P[:-1] + " and the Sales Type column off."],
  r={1: ["A Sales Type column shows right after Status, and before Location when the Location column shows.",
         "Neither representative's summary row nor the Totals row shows a Sales Type value.",
         "The representative's name cell and the Totals cell stretch across the Sales Type column."]})
E("S5-02", [ADMIN_P, REPS2_P, CUST_P,
   "Make sure the test location's Shop Supplies Charge is 10% of labor and nothing else is invoiced at the test location today.",
   "Have a work order for that customer with one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00, Labor set to sales rep A and Parts set to sales rep B.",
   "On the work order's Finance tab, type the shop supplies by hand as $15.00 in place of the calculated $20.00, then invoice the work order today.",
   SBR_ST_P])
SBR_UNO_P = SBR_P[:-1] + " and Show Unassigned on."
E("S5-03", [ADMIN_P, REPS2_P, CUST_P, LOC0_P,
   "Have an open, uninvoiced work order for that customer with one labor line of 6.00 hours at $100.00 an hour ($600.00), one part sold at $400.00, shop supplies typed by hand as $30.00 and a whole-invoice discount of $50.00 (not on any line), with Labor set to sales rep A and Parts set to sales rep B.",
   OPEN_WO_P],
  r={4: ["The work order's invoice has one row under sales rep A, its Labor row.", "That row shows Labor Invoiced $600.00 and Shop Supplies $30.00.",
         "Its Adjustments reads ($30.00), its share of the discount (600 ÷ 1,000 × 50).", "Its subtotal is $600.00."],
     5: ["Its Parts row under sales rep B shows Parts Invoiced $400.00.", "Its Adjustments reads ($20.00), its share of the discount (400 ÷ 1,000 × 50).",
         "Its subtotal is $380.00.", "The two subtotals add up to the invoice's total before tax: $600.00 + $380.00 = $980.00."]})
E("S5-04", [ADMIN_P, REPS2_P, CUST_P, LOC0_P,
   "Have an open, uninvoiced work order for that customer with one labor line of 6.00 hours at $100.00 an hour ($600.00), one returned part credited at $100.00 (a part line of -$100.00) and a whole-invoice discount of $70.00, with Labor set to sales rep A and Parts set to sales rep B.",
   OPEN_WO_P],
  r={4: ["The work order's Labor row under sales rep A has six sevenths of the discount, by size.", "Its Adjustments reads ($60.00) and its subtotal $540.00."],
     5: ["Its Parts row under sales rep B has one seventh of the discount.", "Its Adjustments reads ($10.00) and its subtotal ($110.00).",
         "The returned part reduces sales rep B.", "It is not dropped.", "The two subtotals add up to the invoice total: $540.00 + ($110.00) = $430.00."]})
E("S5-05", [ADMIN_P, REPS2_P, CUST_P, LOC0_P,
   "Have a first work order for that customer with one labor line of 1.00 hour at $100.00 ($100.00), one part sold at $200.00 and a whole-invoice discount of $1.00.",
   "Have a second work order for that customer with one labor line of 1.00 hour at $100.00, one part sold at $100.00 and a whole-invoice discount of $0.01.",
   "On both work orders set Labor to sales rep A and Parts to sales rep B, and invoice both today.",
   SBR_P],
  r={1: ["Sales rep A has a Labor row for each invoice.", "Adjustments on the first work order's row reads ($0.33), the rest of the $1.00 after the Parts share.",
         "Adjustments on the second work order's row reads ($0.01), because each exact share is half a cent and the Labor row gets the extra cent."],
     2: ["Sales rep B has a Parts row for each invoice.",
         "Adjustments on the first work order's row reads ($0.67) (the exact share 200 ÷ 300 × 1.00 = 0.666… rounded to the nearest cent), so together ($1.00).",
         "Adjustments on the second work order's row reads $0.00, so together ($0.01)."]})
E("S5-06", [ADMIN_P, REPS2_P, CUST_P, LOC0_P,
   "Have a first work order for that customer with only a whole-invoice fee of $25.00 (no labor or parts dollars), Labor set to sales rep A and Parts set to sales rep B, and invoice it today.",
   'Have a second work order for that customer with only a whole-invoice fee of $25.00 (no labor or parts dollars), Labor reading "Unassigned" and Parts set to sales rep B, and invoice it today.',
   'Have a third work order for that customer with only a whole-invoice fee of $25.00 (no labor or parts dollars) and both sides reading "Unassigned", and invoice it today.',
   SBR_UNO_P])
E("S5-07", [ADMIN_P, REPS2_P, CUST_P, LOC0_P,
   "Have a first part sale for that customer with one part at $80.00 and shop supplies of $5.00.",
   "Have a second part sale for that customer with one part at $40.00 and no shop supplies charge.",
   "Have a third part sale for that customer with one part at $30.00 and a shop supplies charge of $0.00.",
   "On all three part sales set Sales Representative to sales rep A, and invoice all three today.",
   SBR_ST_P],
  r={1: ['Each part sale is one row with Sales Type "Part Sales" holding every dollar.', "The first part sale shows $80.00 of parts with Shop Supplies $5.00.",
         "The second part sale shows $40.00 with Shop Supplies showing a dash.", "The third part sale shows $30.00 with Shop Supplies $0.00.",
         "On all three rows Labor Delta, Labor Invoiced and Labor Margin show a dash, not 0.00 or $0.00."]})
E("S5-08", [ADMIN_P, REPS2_P, CUST_P, LOC0_P,
   "Have a first work order for that customer with one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00.",
   "Have a second work order for that customer with one part sold at $50.00 and no labor.",
   'On both work orders set "Sales Representative - Labor" and "Sales Representative - Parts" to sales rep A, and invoice both today.',
   SBR_ST_P],
  r={1: ['The first work order\'s invoice is one row, Sales Type "Labor, Parts".', "It holds the sum of both sides: Labor Invoiced $200.00 and Parts Invoiced $50.00.",
         "It counts once.", 'The second work order\'s invoice is one row, Sales Type "Labor, Parts", with Parts Invoiced $50.00.',
         "Its Labor Delta reads 0.0 (not a dash), because the invoice has no labor."]})
E("S5-08b", [ADMIN_P, REPS2_P, CUST_P, LOC0_P,
   INV_P("one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00", '"Sales Representative - Labor" and "Sales Representative - Parts" both set to sales rep A'),
   SBR_ST_P],
  r={2: ['Only the "Labor" side shows.', 'The work order\'s row reads "Labor" with $200.00 of labor.'],
     3: ['Only the "Parts" side shows.', 'The work order\'s row reads "Parts" with $50.00 of parts.']})
E("S5-09", [ADMIN_P, REPS2_P, CUST_P, LOC0_P,
   INV_P("one labor line of 2.00 hours at $100.00 an hour and one part sold at $50.00", 'its one "Sales Representative" set to sales rep A'),
   SBR_P],
  r={8: ["The total is still $250.00.", "Sales rep A has a $200.00 Labor row.", "Unassigned has a $50.00 Parts row."]})
E("S5-10", [ADMIN_P, REPS2_P, CUST_P, LOC0_P,
   INV_P("one labor line of 2.00 hours at $100.00 an hour and one part with cost $30.00 sold at $50.00", "Labor set to sales rep A and Parts set to sales rep B"),
   SBR_P],
  r={1: ["The work order's Parts row under sales rep B shows Parts Margin $20.00 and Margin % 40.00% (20 ÷ 50 × 100).", "Labor plays no part."],
     2: ["The work order's Labor row under sales rep A shows a Margin % equal to Labor Margin ÷ $200.00 × 100, from the labor figures only."]})
E("S5-11", ["Sign in as an Admin at the test location, as a user who has never changed the columns of Sales By Representative since the release.",
   OPEN_P("Reports > Sales By Representative")],
  r={2: ['"Sales Type" is first in the list.', "It is off."]})
E("S5-11b", [ADMIN_P, "Make sure the Sales Type column of Sales By Representative is off for you.", OPEN_P("Reports > Sales By Representative")],
  r={1: ["The column selector opens.", "Sales Type is off."]})
E("S5-12", [ADMIN_P, REPS2_P, CUST_P, INV_P("a labor line and a part", "Labor set to sales rep A and Parts set to sales rep B"),
   SBR_P[:-1] + " and the Sales Type column off on screen."])
E("S5-13", [ADMIN_P, REPS2_P, CUST_P, LOC0_P,
   "Have a first work order for that customer with one labor line of 1.00 hour at $100.00 and no parts, Labor set to sales rep A and Parts set to sales rep B.",
   "Have a second work order for that customer that totals $0.00 (one labor line at $0.00), with its one Sales Representative set to sales rep A.",
   "Invoice both work orders today.", SBR_ST_P],
  r={1: ['Sales rep B has a "Parts" row of $0.00 for the first work order.', "Sales rep B's summary row counts that invoice once."]})
E("S5-14", [ADMIN_P, REPS2_P, CUST_P, INV_P("a labor line and a part", "Labor set to sales rep A and Parts set to sales rep B"),
   "After that invoice, change sales rep B's last name in Settings > Staff and save.", SBR_P],
  r={1: ["Sales rep B is listed under the new name.", "The invoice's Parts row is under it, in one row group (not split into an old-name and a new-name group)."]})

# ---------------- Story 6: the printed work order ----------------
E("S6-01", [ADMIN_P, 'Have two active staff members at the test location with their "Sales Representative" switch on: sales rep A and sales rep C.', CUST_P,
   'Have a first work order for that customer with one "Sales Representative" field set to sales rep A.',
   'Have a second work order for that customer with one "Sales Representative" field set to sales rep C.',
   'Then turn sales rep C\'s "Sales Representative" switch off and save (the staff account stays active).',
   OPEN_P("the first work order")],
  r={2: ["The printout opens.", "The row reads sales rep A (one name)."], 5: ["The printout opens.", 'The row reads sales rep C\'s name followed by "(Inactive)".']})
E("S6-01b", [ADMIN_P, REPS2_P, CUST_P, WO_P('"Sales Representative - Labor" and "Sales Representative - Parts" both set to sales rep A'), OPEN_WO_P],
  r={2: ["The printout opens.", "The row reads sales rep A (one name).", 'It does not read "[sales rep A\'s name] (Parts) · [sales rep A\'s name] (Labor)".']})
E("S6-02", [ADMIN_P, REPS3_P, CUST_P,
   "Have a first work order for that customer with Labor set to sales rep A and Parts set to sales rep B.",
   "Have a second work order for that customer with Labor set to sales rep A and Parts set to sales rep C.",
   'Then turn sales rep C\'s "Sales Representative" switch off and save (the staff account stays active).',
   OPEN_P("the first work order")])
E("S6-03", [ADMIN_P, REPS2_P, CUST_P,
   'Have a first work order for that customer with Labor reading "Unassigned" and Parts set to sales rep B.',
   'Have a second work order with Labor set to sales rep A and Parts reading "Unassigned".',
   OPEN_P("the first work order")])
E("S6-04", [ADMIN_P, CUST_P, WO_P(), OPEN_WO_P])
E("S6-05", [ADMIN_P, REPS2_P, CUST_P,
   "Have an open, uninvoiced work order for that customer, with one approved labor line, one part, Labor set to sales rep A and Parts holding sales rep B, whose staff record no longer exists.",
   OPEN_WO_P])

# ---------------- Story 7: the work order log ----------------
_SPLIT_AB = '"Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B'
E("S7-01", [ADMIN_P, REPS2_P, CUST_P, WO_P(), OPEN_WO_P])
E("S7-01b", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'), OPEN_WO_P],
  r={3: ["Labor reads sales rep A.", "Parts reads sales rep B."],
     5: ["There are two new entries.",
         'The first, for adding the field, reads "Sales Representative: [sales rep A\'s name] → [sales rep A\'s name] (Parts) · [sales rep A\'s name] (Labor)".',
         'The second reads "[sales rep A\'s name] (Parts) · [sales rep A\'s name] (Labor) → [sales rep B\'s name] (Parts) · [sales rep A\'s name] (Labor)".']})
E("S7-01c", [ADMIN_P, REPS2_P, CUST_P, WO_P(_SPLIT_AB), OPEN_WO_P])
E("S7-02", [ADMIN_P, REPS2_P, CUST_P, WO_P(_SPLIT_AB), OPEN_WO_P])
E("S7-03", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'), OPEN_WO_P],
  r={2: ["The log opens.", 'You have the count of "Sales representative changed" entries.'], 7: ["The count is the same.", "There is no new entry."]})
E("S7-05", [ADMIN_P, REPS2_P, CUST_P,
   'Have a first work order for that customer, open and not invoiced, whose "Sales Representative - Labor" field reads sales rep A and whose "Sales Representative - Parts" field holds staff member C, whose staff record no longer exists.',
   'Have a second work order for that customer, open and not invoiced, whose one "Sales Representative" field holds staff member D, a staff member of another organization.',
   OPEN_P("the first work order")])

# ---------------- Story 8: Sales Type filters on both sales reports ----------------
SBR_OPEN_P = OPEN_P("Reports > Sales By Representative")
SBC_OPEN_P = OPEN_P("Reports > Sales By Customer")
E("S8-01", [ADMIN_P, SBR_OPEN_P],
  r={1: ['There are three options, in this order: "Labor", "Parts", "Part Sales".', "All three are selected.", 'The filter\'s label reads "Sales Type: All".'],
     2: ['The filter\'s label reads "Sales Type: Labor, Parts".', "Part Sales rows leave the report, and the totals and counts follow."],
     3: ['The filter\'s label reads "Sales Type: Parts".'],
     4: ['The filter\'s label reads "Sales Type: None".', "The report shows its empty state with no invoices."]})
E("S8-02", [ADMIN_P, SBR_OPEN_P])
E("S8-02b", [ADMIN_P, SBR_OPEN_P], r={2: ['"Empty export" shows.', "No file is made."]})
E("S8-03", [ADMIN_P, SBC_OPEN_P],
  r={1: ['It is labelled "Sales Type".', 'It has two options, "Part Sales" and "Service Sales".', 'With both options selected its label reads "Sales Type: All Sales".']})
E("S8-04", [ADMIN_P, SBC_OPEN_P])
E("S8-04b", [ADMIN_P, SBC_OPEN_P], r={2: ['"Empty export" shows.', "No file is made."]})
E("S8-05", [ADMIN_P, REPS2_P,
   "Use a customer that has, today, one invoiced part sale of $40.00 and one invoiced work order of $250.00 that includes a part.",
   "Open Reports > Sales By Customer in a desktop browser at least 1024 pixels wide, with the date range set to today."])
E("S8-12", [ADMIN_P, "Pick a date on which the test location has no invoices.",
   "Open Reports > Sales By Representative for that date in a desktop browser at least 1024 pixels wide, so it shows no invoices."],
  r={1: ['"Empty export" does not show.', 'A CSV downloads with the filter line "Sales Type: All", the column headings and no rows.']})
E("S8-12b", [ADMIN_P, "Pick a date on which the test location has no invoices.",
   "Open Reports > Sales By Customer for that date in a desktop browser at least 1024 pixels wide, so it shows no invoices."])
E("S5-19", [ADMIN_P, REPS2_P, 'Have staff member C, a third active staff member at the test location, with the "Sales Representative" switch on.', CUST_P, LOC0_P,
   'Have a work order for that customer with "Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to staff member C, and invoice it today.',
   "After the invoice, staff member C's staff record no longer exists.",
   SBR_UN_P])
E("S5-20", [ADMIN_P, REPS2_P, "Use a customer with no Sales Representative assigned, set as tax exempt so that no tax applies to its invoices.", LOC0_P,
   "Have an open, uninvoiced work order for that customer with one labor line of 1.00 hour at $100.00 ($100.00), one part sold at $50.00 and a non-taxable whole-invoice discount of $200.00 (not on any line), with Labor set to sales rep A and Parts set to sales rep B.",
   OPEN_WO_P],
  r={1: ["The invoice total is $0.00.", "The discount does not take it below zero (100.00 + 50.00 − 200.00 would be −50.00, so $50.00 is added back)."],
     4: ["The work order's invoice has one row under sales rep A, its Labor row.", "That row shows Labor Invoiced $100.00.",
         "Its Adjustments reads ($100.00), its share of the −$150.00 net whole-invoice amount (100 ÷ 150 × 150).", "Its subtotal is $0.00."],
     5: ["Its Parts row under sales rep B shows Parts Invoiced $50.00.", "Its Adjustments reads ($50.00) (50 ÷ 150 × 150).", "Its subtotal is $0.00.",
         "$0.00 + $0.00 = $0.00, the invoice total.", "Neither row goes below zero.", "The report total for the invoice is $0.00."]})
E("S4-23", [ADMIN_P, REPS2_P, CUST_P, CEDIT_P,
   'Open sales rep B\'s staff record in a second tab of the same browser, with the "Sales Representative" switch on.'],
  r={5: ['The save is refused with "The selected staff member is not a sales representative."', "The customer keeps no representative."]})
E("S4-24", ['Sign in at the test location as user B, whose role has "Work Orders — Create & Edit" but not "Customers — Create & Edit".',
   REPS2_P, OPEN_P("the Work Orders page")],
  r={2: ["The New Customer window opens and stays open (no access-denied message).", "It has a Sales Representative field."],
     6: ["The customer is created with sales rep A.", "The new work order can carry on with it."]})
E("S5-15", [ADMIN_P, REPS2_P, CUST_P, INV_P("a labor line and a part", "Labor set to sales rep A and Parts set to sales rep B"), SBR_P])
E("S5-16", [ADMIN_P, REPS2_P, CUST_P, LOC0_P,
   "Have an open, uninvoiced work order for that customer with one labor line of 3.00 hours at $100.00 ($300.00) with a labor-line discount of $30.00, one part sold at $100.00 with a part-line fee of $10.00, and a whole-invoice fee of $38.00, with Labor set to sales rep A and Parts set to sales rep B.",
   OPEN_WO_P],
  r={4: ["The work order's invoice has one row under sales rep A, its Labor row.", "That row shows labor $270.00 after its own discount.",
         "Its Adjustments column holds its share of the whole-invoice fee, $27.00 (270 ÷ 380 × 38).", "Its subtotal is $297.00."],
     5: ["Its Parts row under sales rep B shows parts $110.00 after its own fee.",
         "Its Adjustments column holds its share of the whole-invoice fee, $11.00 (110 ÷ 380 × 38).", "Its subtotal is $121.00.",
         "The two subtotals add up to the invoice total before tax: $297.00 + $121.00 = $418.00."]})
E("S5-17", [ADMIN_P, REPS2_P,
   "Make sure the test location has at least three invoices today: one split work order, one work order with one person on both sides and one part sale.",
   SBR_UNO_P],
  r={1: ["Every representative's invoice rows show.",
         "Adding up by hand every invoice row's Labor Invoiced, Parts Invoiced, Shop Supplies and Hrs Invoiced, each representative's summary row equals the sum of its invoice rows.",
         "The report totals equal the sum of all invoice rows.", "The sums match to the cent (hours to two decimals)."]})
E("S7-04", [ADMIN_P, REPS2_P, CUST_P, WO_P(_SPLIT_AB + ", where the Parts side was changed to sales rep B today"), OPEN_WO_P])
E("S2-13", [ADMIN_P, REPS3_P, CUST_P,
   "Have a first work order for that customer with two approved lines, Labor set to sales rep A and Parts set to sales rep B.",
   "Have a second work order for that customer with one Sales Representative, sales rep C.",
   OPEN_P("the first work order")],
  s={1: "Move one line of the first work order to the existing second work order."})
E("S5-18", [ADMIN_P, REPS2_P, CUST_P,
   "Have a part sale for that customer with Sales Representative set to sales rep A and one part at $80.00, and invoice it today.",
   SBR_P])
_ONE_SPLIT = ("Have one split work order for that customer with Labor set to sales rep A and Parts set to sales rep B, invoiced today. "
              "Neither sales rep has other invoices today.")
E("S8-06", [ADMIN_P, REPS2_P, CUST_P, _ONE_SPLIT, SBR_UN_P],
  r={2: ["Sales rep A shows with the Labor row.", "Sales rep B disappears."]})
E("S8-06b", [ADMIN_P, REPS2_P, CUST_P, _ONE_SPLIT, SBR_UN_P])
E("S8-07", [ADMIN_P, REPS2_P, CUST_P,
   "Have at least one split work order invoiced today with Labor set to sales rep A and Parts set to sales rep B.", SBR_UNO_P],
  r={4: ["The report returns without a full reload.", '"Sales Type: Parts" is still selected.', "Sales rep B is still expanded.", "The scroll position is the same."]})
SBC_TODAY_P = "Open Reports > Sales By Customer in a desktop browser at least 1024 pixels wide, with the date range set to today."
E("S8-08", [ADMIN_P, SBC_TODAY_P],
  r={1: ['"Part Sales" and "Service Sales" each have a checkbox.', "Both are ticked.", 'A "Select all" row is above them.', '"Clear selection" is at the bottom.'],
     2: ["Both options are cleared.", 'The filter reads "Sales Type: No sales".'],
     3: ["Both options are ticked again.", 'The filter reads "Sales Type: All Sales".']})
E("S8-09", [ADMIN_P, CUST_P, "Have one invoiced part sale and one invoiced work order for that customer today.", SBC_TODAY_P],
  r={2: ["Every expanded row collapses.", "The customer shows only the work order's figures."]})
E("S8-09b", [ADMIN_P, CUST_P, "Have one invoiced part sale and one invoiced work order for that customer today.", SBC_TODAY_P])
E("S8-10", [ADMIN_P, "Use customer A, which today has only an invoiced part sale.", "Use customer B, which today has only an invoiced work order.",
   "Make sure the names of customer A and customer B start with the same text. That text is the search word.", SBC_TODAY_P],
  r={3: ["Customer A is offered.", "Customer B is not offered, because the search follows the Sales Type selection."]})
E("S8-10b", [ADMIN_P, SBC_TODAY_P])
TOUCH = "on a phone or tablet (a touch screen with no mouse pointer)"
E("S8-11", [ADMIN_P, OPEN_P("Reports > Sales By Representative", TOUCH)])
E("S8-11b", [ADMIN_P, OPEN_P("Reports > Sales By Customer", TOUCH)])

# ---------------- Release day and what must not change ----------------
E("REL-15", [ADMIN_P, CUST_P, "Have one invoiced work order and one reversed invoice for that customer today.", SBC_TODAY_P],
  r={1: ["Only the invoiced work order counts.", "The reversed invoice is not a row.", "The reversed invoice adds nothing to any count or total."]})
E("REL-16", [ADMIN_P, REPS2_P, CUST_P, LOC0_P,
   "Have a part sale for that customer with one part at $80.00 and Sales Representative set to sales rep A, and invoice it today.",
   "Have a work order for that customer with one labor line of 2.00 hours at $100.00 an hour and Sales Representative set to sales rep A, and invoice it today.",
   SBR_P],
  r={1: ["On the part sale's row, Labor Delta, Labor Invoiced and Labor Margin show a dash where the report used to show 0.00 and $0.00.",
         "Sales rep A's summary row reads Labor Invoiced $200.00 and Parts Invoiced $80.00, the same totals as before the release."]})
E("REL-01", [ADMIN_P, REPS2_P, "Use customer A, which had sales rep A as its sales representative before the release was installed.",
   "Use customer B, which had no sales representative before the release was installed.",
   "Use customer C, whose representative was no longer a user of the shop before the release was installed.",
   "Have notes of how the three customer pages looked before the release was installed.",
   PICS, "With the release installed, open customer A's page in a desktop browser at least 1024 pixels wide."],
  r={2: ['One "Sales Representative" field reads sales rep A.', "There is no Service Parts or Part Sales field."]})
E("REL-02", [ADMIN_P, REPS2_P, CUST_P,
   "Use a work order for that customer that was open (not invoiced), with sales rep A as its sales representative, before the release was installed.",
   PICS, "With the release installed, open the work order in a desktop browser at least 1024 pixels wide."],
  r={1: ['The card shows one "Sales Representative" field reading sales rep A.', "The card is not split and reads as before."]})
E("REL-03", [ADMIN_P,
   "Have an Expanded CSV of Sales By Representative exported before the release was installed, for a past date range with invoices, with Show Unassigned on.",
   PICS,
   "With the release installed, open Reports > Sales By Representative in a desktop browser at least 1024 pixels wide, set to the same date range as that export, with Show Unassigned on and the Sales Type column turned on."],
  r={1: ["The report shows the same representatives.", "Every summary row and every total is the same as before, to the cent."]})
E("REL-04", [ADMIN_P, "Use invoices at the test location dated before 29 Jul 2026.",
   "Open Reports > Sales By Representative in a desktop browser at least 1024 pixels wide, set to a date range before 29 Jul 2026 that holds those invoices, with Show Unassigned on."])
E("REL-05", [ADMIN_P, "Use a browser in which you changed the columns and the sort of Sales By Representative before the release was installed.",
   "With the release installed, open Reports > Sales By Representative in that browser, at a desktop width of at least 1024 pixels."],
  r={1: ["The columns and the sort are back to the defaults.", "The Sales Type column is off."]})
E("REL-05b", [ADMIN_P, "Have a bookmark, made before the release was installed, of a link to Sales By Representative that narrowed it by Product Type.",
   "With the release installed, use a desktop browser at least 1024 pixels wide."])
E("REL-06", [ADMIN_P, "Have a bookmark, made before the release was installed, of Sales By Customer with only one Product Type option selected: the parts option.",
   PICS, "With the release installed, use a desktop browser at least 1024 pixels wide."],
  r={2: ['The same option is selected under its new name, "Part Sales".', 'The filter reads "Sales Type: Part Sales".']})
E("REL-07", [ADMIN_P, "Use an imported work order at the test location (one brought in from the previous system).", OPEN_WO_P],
  r={1: ["There is no Sales Representative field.", "There is no + button.", "The imported work order looks as it did before."]})
E("REL-08", [ADMIN_P, REPS2_P, CUST_P, WO_P(_SPLIT_AB), OPEN_WO_P])
E("REL-09", [ADMIN_P, REPS2_P, CUST_P,
   "Have a split work order for that customer (Labor set to sales rep A, Parts set to sales rep B), invoiced today, and a credit memo of $20.00 for that customer today.",
   SBR_UNO_P])
E("REL-10", [ADMIN_P, OPEN_P("any page")])
E("REL-11", [ADMIN_P, REPS2_P, CUST_P, "Make sure the test location is connected to a QuickBooks test company.", WO_P(_SPLIT_AB), OPEN_WO_P])
E("REL-12", [ADMIN_P, CUST_P, WO_P(), PICS, OPEN_P(where=PHONE)],
  r={1: ["The card expands with the same control as before.", "Without tapping them, Lead Technician and Service Advisor look as they do today: no arrow until tapped.",
         "The Sales Representative field already shows its arrow."],
     2: ["The arrow shows once the field is tapped.", "Its dropdown opens as today."]})
E("REL-13", ['Sign in at the test location as user B, whose role does not have "Reports — Page Access".', OPEN_P("any page")])
E("REL-14", [ADMIN_P, REPS2_P, CUST_P, LOC0_P,
   INV_P("one labor line of 2.00 hours at $100.00 an hour and one part with cost $30.00 sold at $50.00", "its one Sales Representative set to sales rep A"),
   SBR_P[:-1] + " and the Sales Type column off."],
  r={1: ["Sales rep A has one row for the work order's invoice.", "It shows Labor Invoiced $200.00, Parts Invoiced $50.00 and Parts Margin $20.00, all figures as before the release."],
     2: ['The same one row shows, with Sales Type "Labor, Parts".']})
E("REL-17", [ADMIN_P, "Make sure at least three locations are open to you: the test location, a second location and a third location.",
   OPEN_P("Reports > Parts Velocity")])
_UNIT = "Use a customer with no Sales Representative assigned and a unit (vehicle)."
E("REL-18", [ADMIN_P, REPS2_P, _UNIT,
   'Have an open, uninvoiced work order for that customer on that unit, with one labor line, one part, "Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B.',
   OPEN_WO_P],
  r={1: ["The preview opens with the work order's lines and totals.", "No error message shows."]})
E("REL-18b", [ADMIN_P, REPS2_P, _UNIT,
   'Have a work order for that customer on that unit, with one labor line, one part, "Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B, and invoice it today.',
   OPEN_P("the unit's page")],
  r={1: ["The list opens with no error message.", "It includes the work order's invoice."]})
E("REL-19", [ADMIN_P, REPS2_P, CUST_P,
   'Use a work order for that customer, still open and not invoiced, whose Sales Representative was changed from sales rep A to sales rep B before the release was installed. That change wrote a "Sales representative changed" entry, and a version of the work order was saved to its history with sales rep B.',
   "With the release installed, open the work order in a desktop browser at least 1024 pixels wide."],
  r={2: ['The entry still reads "Sales Representative: [sales rep A\'s name] → [sales rep B\'s name]".', "There is one name on each side of the arrow, with no (Parts) or (Labor)."]})
E("REL-19b", [ADMIN_P, REPS2_P, CUST_P,
   "Use a work order for that customer, still open and not invoiced, that had sales rep B as its one Sales Representative before the release was installed, with a version saved to its history with sales rep B before the release.",
   "With the release installed, open the work order in a desktop browser at least 1024 pixels wide."])

# ---------------- Design — how it looks ----------------
WIN_WO1 = "Open the work order in that browser window."
E("D-01", [ADMIN_P, REPS2_P, CUST_P,
   "Have a first work order for that customer, open and not invoiced, with nobody in Sales Representative.",
   "Have a second work order with Sales Representative set to sales rep A.",
   PICS, "Open the first work order in that browser window."],
  r={1: ['"Sales Representative" sits directly under Service Advisor.', 'Its label is on the first line and "Unassigned" on the second.',
         "It has the same text style, size, weight and left edge as Lead Technician and Service Advisor.",
         "There is no box, no arrow and no button at rest, as in the picture.", "Measured on the screen, no blank strip remains under Lead Technician.",
         "Every gap is 16 px, including the gap under Lead Technician."],
     2: ["The name, sales rep A, shows on the second line as plain text with no box, as in the picture."]})
E("D-02", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'), PICS, WIN_WO1],
  r={1: ["One box surrounds the label and the name together.",
         "It is the same box and height Lead Technician and Service Advisor show on hover, with the same left edge.",
         "The dropdown arrow sits at the right end, vertically centred on the label and the name.", "The grey + shows to the right, as in the picture.",
         "Measured on the screen, the box ends 16 px before a 32 px column holding the +.",
         "The + is a 32 px square with 8 px corners and a 20 px plus icon, grey on no fill."]})
E("D-03", [ADMIN_P, REPS2_P, CUST_P, WO_P(), PICS, WIN_WO1],
  r={1: ["The list opens under the field.", '"Unassigned" is first and checked, then the representatives.', "There is no search box.", "The list looks as in the picture."],
     3: ["Sales rep A is the checked option.", '"Unassigned" is still first, as in the picture.']})
E("D-04", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'), PICS, WIN_WO1],
  r={1: ['The tooltip "Add representative" shows where the picture shows it.', "It does not cover the field."],
     2: ['The menu opens below the + with one option, "Sales Representative - Parts".', "The + keeps its light fill.", "The tooltip is gone, as in the picture."]})
_LP_A = '"Sales Representative - Labor" and "Sales Representative - Parts" both set to sales rep A'
E("D-05", [ADMIN_P, REPS2_P, CUST_P, WO_P(_LP_A), PICS, WIN_WO1],
  r={1: ['"Sales Representative - Labor" shows above "Sales Representative - Parts".', "Both labels show in full.", "Both are plain at rest.",
         "There is 16 px between all fields, as in the picture."],
     2: ["Both boxes show at once.", "Each arrow sits in the bottom-right corner of its field, on the name line.",
         "The remove x (32 px, 20 px x icon, grey) shows beside Parts only.", "Nothing shows beside Labor.", "There is no +."],
     3: ['The list opens under Labor, with "Unassigned" first, as in the picture.', "The person on the Parts row is not hidden."],
     5: ["The window is 1536 px wide.", "With the pointer away from the rows, the two fields look the same as in step 1 (compare with the picture of board 1.9 again).",
         "Nothing overlaps."],
     6: ["The look is the same as in step 2.", "Nothing overlaps."]})
E("D-05b", [ADMIN_P, REPS2_P, CUST_P, WO_P(_LP_A), PICS, WIN_WO1],
  r={2: ["Both labels still show in full.", "No arrow covers a label.",
         "Each arrow sits in the bottom-right corner of its field, on the name line, as in the picture of board 1.10."]})
E("D-06", [ADMIN_P, REPS2_P, CUST_P, WO_P('"Sales Representative - Labor" set to sales rep B and "Sales Representative - Parts" set to sales rep A'), PICS, WIN_WO1],
  r={1: ["Labor shows sales rep B and Parts shows sales rep A, as plain text, as in the picture."],
     2: ["The remove x shows a light fill.", 'The tooltip "Remove Sales Representative - Parts" shows, as in the picture.'],
     3: ['One "Sales Representative" field reads sales rep B (the Labor person).', "The + is back, as in the picture."]})
E("D-07", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'), PICS, WIN_WO1])
E("D-08", [ADMIN_P, REPS2_P, CUST_P, 'Have a work order for that customer with Labor set to sales rep A and Parts set to sales rep B, and invoice it.', PICS, WIN_WO1],
  r={1: ['"Sales Representative - Labor" with sales rep A and "Sales Representative - Parts" with sales rep B show as plain text.',
         "There is no box, arrow, + or remove x, even on hover, as in the picture.",
         "Lead Technician and Service Advisor keep the labels an invoiced card shows today.",
         "Measured on the screen, every gap between Lead Technician, Service Advisor and both representative fields is 16 px."]})
E("D-09", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'), PICS, WIN_WO1],
  r={5: ['Each change is a "Sales representative changed" entry with who, when and before → after.',
         'The entries are worded as in the picture, Parts first (for example "[sales rep B\'s name] (Parts) · [sales rep A\'s name] (Labor) → [sales rep A\'s name]").']})
WIN_CUST = "Open the customer's page in that browser window."
WIN_CEDIT = "Open the customer's Edit Customer window in that browser window."
E("D-10", [ADMIN_P, REPS3_P, CUST_P, PICS, WIN_CUST],
  r={1: ['There is one "Sales Representative" field, reading "Unassigned".', "It has the same outlined box as every other field in the window.",
         "It is in the place Edit Customer shows it today.", "The + shows beside it without hovering.", "The arrow is vertically centred.", "There is no x inside the field."],
     2: ['"Unassigned" is first, then the representatives, sorted by first name, then last name, A to Z.', "There is no search box."]})
E("D-10b", [ADMIN_P, REPS3_P, CUST_P, PICS, WIN_CEDIT],
  r={1: ['The tooltip "Add representative" shows, as in the picture.']})
E("D-11", [ADMIN_P, REPS3_P, CUST_A_P, PICS, WIN_CEDIT],
  r={1: ['The first field reads "Sales Representative - Service Labor".', '"Sales Representative - Service Parts" shows under it.', "Both read sales rep A.",
         "A remove x shows beside Service Parts."],
     3: ["Three fields show, in order: Service Labor, Service Parts, Part Sales.", "Each added field has a remove x.", "The + is gone.", "The labels show in full."],
     4: ['The list is the same as every other field\'s: "Unassigned" first, then the representatives.', 'There is no "Same as Service Parts" option.']})
E("D-11b", [ADMIN_P, REPS3_P, CUST_SPLIT3_P, PICS, WIN_CEDIT],
  r={1: ["The fields read, in order: Service Labor sales rep A, Service Parts sales rep B, Part Sales sales rep C, as in the picture."],
     2: ['The tooltip "Remove Sales Representative - Service Parts" shows.'],
     3: ['"Sales Representative" reads sales rep A.', '"Sales Representative - Part Sales" reads sales rep C.', "The + is back, as in the picture."]})
E("D-12", [ADMIN_P, REPS3_P, 'Use a customer with Service Labor set to sales rep A, Service Parts set to sales rep B and "Sales Representative - Part Sales" set to sales rep C.', PICS, WIN_CUST],
  r={1: ['"Sales Representative - Service Labor", "Sales Representative - Service Parts" and "Sales Representative - Part Sales" show with their names as plain text.',
         "They are in the window's order.", "They are styled like the page's other rows, as in the picture."]})
E("D-13", [ADMIN_P, REPS3_P, PICS, "Open the Customers page in that browser window."],
  r={1: ['New Customer has the same optional "Sales Representative" field and + as Edit Customer, in the same spot.'],
     3: ["The menu has the same two options as Edit Customer."],
     5: ['"Sales Representative" and "Sales Representative - Part Sales" show.', '"Sales Representative - Part Sales" reads sales rep C, with its remove x, as in the picture.']})
E("D-14", [ADMIN_P, REPS2_P, CUST_P, "Have an open, uninvoiced part sale for that customer.", PICS, "Open the part sale in that browser window."],
  r={1: ['There is one field labelled "Sales representative" (small "r").', "It is plain text at rest, the full width of the card.", "There is no + and no remove x."],
     2: ["Part Sales Update v1's own hover box and arrow show, the full width of the card."],
     3: ["The list looks as in the picture."],
     5: ["Sales rep A shows in the same field.", 'Its label still reads "Sales representative".', "There is still no + and no remove x."]})
_TODAY3 = ("Have, today, one invoiced split work order for that customer (Labor set to sales rep A, Parts set to sales rep B), one invoiced work order "
           "with sales rep A on both sides and one invoiced part sale with no shop supplies.")
E("D-15", [ADMIN_P, REPS2_P, CUST_P, _TODAY3, PICS,
   "Open Reports > Sales By Representative for today in that browser window, with the Sales Type column off."],
  r={1: ["There is one row per representative.", 'The filter reads "Sales Type: All".', "There is no Sales Type column by default."]})
E("D-15b", [ADMIN_P, REPS2_P, CUST_P, _TODAY3, PICS,
   "Open Reports > Sales By Representative for today in that browser window, with the Sales Type column turned on (as in the picture of board 4.7)."],
  r={1: ['The filter lists "Labor", "Parts", "Part Sales", all ticked.'], 3: ["All three are ticked again.", 'The filter reads "Sales Type: All".']})
E("D-15c", [ADMIN_P, REPS2_P, CUST_P, _TODAY3, PICS,
   "Open Reports > Sales By Representative for today in that browser window, with the Sales Type column off."],
  r={1: ['"Sales Type" is the first entry.', "It is off by default."],
     4: ['The Sales Type column reads "Labor", "Parts", "Part Sales" and "Labor, Parts".', "The columns line up as in the picture.", "Nothing overlaps."]})
E("D-16", [ADMIN_P, REPS2_P, CUST_P,
   "Have, today, one invoiced split work order for that customer (Labor set to sales rep A, Parts set to sales rep B) and one invoiced part sale.",
   PICS, "Open Reports > Sales By Representative in that browser window, with the Sales Type column off."],
  r={1: ["The file has the Sales Type column right after Status (and before any Location column), even though it is off on screen.",
         "The cells of the side a row is not credited with are blank.", "The part sale's labor and hours cells are blank too."],
     2: ["The PDF has the Sales Type column in the same place.", "Those cells, and the part sale's labor and hours cells, show a dash.",
         'The header lines name the filters, including "Sales Type: All".']})
E("D-17", [ADMIN_P, PICS, "Open Reports > Sales By Customer in that browser window."],
  r={2: ['The options are "Part Sales" and "Service Sales", both ticked, as in the picture.']})
_PH_OPEN = "Open the work order on a phone (a touch screen with no mouse pointer), with the card expanded."
E("D-18", [ADMIN_P, REPS2_P, CUST_P, WO_P(), PICS, _PH_OPEN],
  r={1: ['"Sales Representative" reads "Unassigned".', "The + (32 px) always shows beside it.", "The dropdown arrow shows."],
     2: ["The native dropdown opens, the same as Lead Technician.", '"Unassigned" is first, then the representatives.'],
     3: ["The field reads sales rep A.", "The + shows without any hover."]})
E("D-18b", [ADMIN_P, REPS2_P, CUST_P, WO_P('one "Sales Representative" field set to sales rep A'), PICS, _PH_OPEN],
  r={1: ['The menu shows "Sales Representative - Parts".'],
     2: ['"Sales Representative - Labor" and "Sales Representative - Parts" show, both reading sales rep A.', "Both labels show in full.",
         "The remove x (32 px) always shows beside Parts.", "Each field shows its arrow."],
     3: ["The same list opens as for each row."]})

# ---------------- 26 Oct 2026, second pass: every precondition relates to the steps and results ----------------
# QA lead: "they must make sense and relate to the steps and expected results below." A precondition stays only if the tester needs it to
# do a step or judge a result (a record that holds a field, a name the list must order, data a result reads); a record the case never
# uses is removed; what a result needs but no precondition created is added. Steps and results are not touched. FIXES records each change
# so the pass report can list it.
FIXES = {}
def RE(key, old, new=None, why=""):
    pre = PATTERN[key]["pre"]
    assert old in pre, (key, old)
    i = pre.index(old)
    if new is None: pre.pop(i)
    elif isinstance(new, list): pre[i:i + 1] = new
    else: pre[i] = new
    FIXES.setdefault(key, []).append(why)
def ADD(key, before, new, why):
    pre = PATTERN[key]["pre"]; i = pre.index(before) if before else len(pre)
    pre.insert(i, new); FIXES.setdefault(key, []).append(why)
REP1 = lambda x: f'Have an active staff member at the test location with the "Sales Representative" switch on: sales rep {x}.'
NO_REPS_REASON = "removed the two sales reps: no step or result uses them"
# a second rep the case never sees
for k in ["S1-03", "S1-04", "S1-05", "S1-06", "S1-10", "S1-11", "S2-01", "S2-03", "S2-11", "S3-01", "S3-02", "S3-02b", "S3-03", "S3-04",
          "S4-02", "S4-03", "S4-09", "S5-07", "S5-08", "S5-08b", "S5-09", "S5-18", "S5-19", "S6-01b", "S6-05", "S7-01",
          "S7-03", "REL-01", "REL-02", "REL-14", "REL-16", "D-01", "D-02", "D-03", "D-04", "D-05", "D-05b", "D-07", "D-14", "D-18", "D-18b"]:
    RE(k, REPS2_P, REP1("A"), "removed sales rep B: no step or result uses them")
for k in ["S1-07", "S1-09", "S2-06", "S4-15", "S4-15b", "S4-19", "S4-19b", "S4-23", "REL-19b"]:
    RE(k, REPS2_P, REP1("B"), "removed sales rep A: no step or result uses them")
RE("S2-07", REPS2_P, None, "removed sales reps A and B: the case uses only sales rep C")
RE("S2-07", _C_OFF[0], REP1("C"), "sales rep C is now the only staff member set up")
for k in ["S2-07b", "S2-07c"]:
    RE(k, REPS2_P, REP1("A"), "removed sales rep B: no step or result uses them")
    RE(k, _C_OFF[0], 'Have a second active staff member at the test location with the "Sales Representative" switch on: sales rep C.', "sales rep C described as the second staff member")
for k in ["S4-01b", "S8-05"]: RE(k, REPS2_P, None, NO_REPS_REASON)
RE("S4-04", REPS3_P, REPS2_P, "removed sales rep C: no step or result uses them (sales rep A stays: Service Labor must hold someone other than the Service Parts person)")
RE("S4-14", REPS3_P, 'Have two active staff members at the test location with their "Sales Representative" switch on: sales rep A and sales rep C.', "removed sales rep B: no step or result uses them")
RE("S4-27", REPS3_P, 'Have two active staff members at the test location with their "Sales Representative" switch on: sales rep A and sales rep C.', "removed sales rep B: no step or result uses them")
RE("D-10b", REPS3_P, None, "removed the three sales reps: the tooltip and menu need none")
RE("D-11", REPS3_P, REP1("A"), "removed sales reps B and C: no step or result uses them")
RE("D-13", REPS3_P, REP1("C"), "removed sales reps A and B: the case picks only sales rep C")
RE("D-10", REPS3_P, REPS3_P[:-1] + ", so the list has several names to sort.", "said why three reps are needed (the result checks their order)")
RE("S5-17", REPS2_P, 'Have two active staff members at the test location with their "Sales Representative" switch on, so that one work order can have a different Labor and Parts representative.',
   "said why two reps are needed (the split work order) and dropped their unused names")
# the sign-in user is never named in the steps or results
for k, role in [("S1-06", '"Work Orders — View" but not "Work Orders — Create & Edit"'),
                ("S4-24", '"Work Orders — Create & Edit" but not "Customers — Create & Edit"'),
                ("S4-25", '"Part Sales — Create & Edit" but not "Customers — Create & Edit" or "Work Orders — Create & Edit"'),
                ("S4-28", '"Customers — Create & Edit" but neither "Work Orders — View" nor "Work Orders — Create & Edit"')]:
    RE(k, f"Sign in at the test location as user B, whose role has {role}.", f"Sign in at the test location as a user whose role has {role}.",
       "the sign-in user is no longer called user B (no step or result names them)")
# records whose letter names no step or result uses: described by what they are
for k in ["S1-11", "S7-05"]:
    RE(k, 'Have a first work order for that customer, open and not invoiced, whose "Sales Representative - Labor" field reads sales rep A and whose "Sales Representative - Parts" field holds staff member C, whose staff record no longer exists.',
       'Have a first work order for that customer, open and not invoiced, whose "Sales Representative - Labor" field reads sales rep A and whose "Sales Representative - Parts" field holds a staff member whose staff record no longer exists.',
       "staff member C described as a staff member whose record no longer exists (the name is not used)")
    RE(k, 'Have a second work order for that customer, open and not invoiced, whose one "Sales Representative" field holds staff member D, a staff member of another organization.',
       'Have a second work order for that customer, open and not invoiced, whose one "Sales Representative" field holds a staff member of another organization.',
       "staff member D described as a staff member of another organization (the name is not used)")
RE("S6-05", "Have an open, uninvoiced work order for that customer, with one approved labor line, one part, Labor set to sales rep A and Parts holding sales rep B, whose staff record no longer exists.",
   "Have an open, uninvoiced work order for that customer, with one approved labor line, one part, Labor set to sales rep A and Parts holding a staff member whose staff record no longer exists.",
   "the Parts person described as a staff member whose record no longer exists (the name is not used)")
RE("S5-19", 'Have staff member C, a third active staff member at the test location, with the "Sales Representative" switch on.',
   'Have staff member C, a second active staff member at the test location, with the "Sales Representative" switch on.', "staff member C is now the second staff member")
# data a result needs that no precondition created
RE("S8-01", SBR_OPEN_P, ["Have, today, at least one invoiced part sale and one invoiced work order with labor and parts at the test location.",
   "Open Reports > Sales By Representative in a desktop browser at least 1024 pixels wide, with the date range set to today."],
   "added a part sale and a work order with labor and parts invoiced today, so Part Sales rows can leave the report and the totals and counts can change")
RE("S5-11b", "Make sure the Sales Type column of Sales By Representative is off for you.",
   ["Make sure the Sales Type column of Sales By Representative is off for you.", "Have at least one invoiced work order at the test location today, so the report has invoice rows."],
   "added an invoice today, so the Sales Type column has rows to show it holds words only")
RE("S5-11b", OPEN_P("Reports > Sales By Representative"),
   "Open Reports > Sales By Representative in a desktop browser at least 1024 pixels wide, with the date range set to today.", "the report opens on today")

# ---- RELEVANCE GATE pass (26 Oct 2026, ssr_lib.relevance_problems): a record a case never names after the preconditions is either
# described without a name (it only fills a field) or its bullet says why it is needed ("so ..."). ----
def SUBST(key, pairs, why):
    pre = PATTERN[key]["pre"]; done = False
    for i, x in enumerate(pre):
        y = x
        for a, b in pairs: y = y.replace(a, b)
        if y != x: pre[i] = y; done = True
    assert done, key
    FIXES.setdefault(key, []).append(why)
def SO(key, part, clause, why):
    pre = PATTERN[key]["pre"]; hit = [i for i, x in enumerate(pre) if part in x]
    assert len(hit) == 1, (key, part, hit)
    pre[hit[0]] = pre[hit[0]][:-1] + f", so {clause}."
    FIXES.setdefault(key, []).append(why)
ONE_REP = 'Have an active staff member at the test location with the "Sales Representative" switch on.'
# one rep who only fills a field: no name
for k in ["S1-04", "S3-04", "D-02", "D-04", "D-05", "D-05b", "D-07", "S5-18"]:
    SUBST(k, [(REP1("A"), ONE_REP), ("set to sales rep A", "set to that staff member"), ("both set to sales rep A", "both set to that staff member"),
              ("Sales Representative set to sales rep A", "Sales Representative set to that staff member")],
          "the one staff member who only fills the field is no longer named (no step or result names them)")
SUBST("S2-07c", [(REP1("A"), ONE_REP), ('Have a second active staff member at the test location with the "Sales Representative" switch on: sales rep C.',
                  'Have another active staff member at the test location with the "Sales Representative" switch on: sales rep C.'),
                 ('"Sales Representative - Parts" set to sales rep A', '"Sales Representative - Parts" set to the first staff member')],
      "the Parts person is no longer named (no step or result names them)")
SUBST("S5-19", [(REP1("A"), ONE_REP[:-1] + ", for the Labor side."), ('"Sales Representative - Labor" set to sales rep A', '"Sales Representative - Labor" set to that staff member'),
                ("staff member C, a second active staff member", "staff member C, another active staff member")],
      "the Labor person is no longer named (no step or result names them)")
# two reps who only make a split work order: no names
SPLIT2 = 'Have two active staff members at the test location with their "Sales Representative" switch on, so that a work order can have a different Labor and Parts representative.'
NAMELESS = [(REPS2_P, SPLIT2),
            ('"Sales Representative - Labor" set to sales rep A and "Sales Representative - Parts" set to sales rep B', '"Sales Representative - Labor" set to one of them and "Sales Representative - Parts" set to the other'),
            ("Labor set to sales rep A and Parts set to sales rep B", "Labor set to one of them and Parts set to the other"),
            ("(Labor set to sales rep A, Parts set to sales rep B)", "(Labor set to one of them, Parts set to the other)"),
            ("with sales rep A on both sides", "with one of them on both sides")]
for k in ["S5-01b", "S5-12", "S8-06b", "REL-08", "REL-11", "REL-18", "REL-18b", "D-15b", "D-16"]:
    SUBST(k, NAMELESS, "the two staff members who only make the split work order are no longer named; their bullet says why they are needed")
SUBST("S8-06b", [("Neither sales rep has other invoices today.", "Neither of them has other invoices today.")], "wording follows the unnamed staff members")
# a rep the steps never name but whose place the result depends on: say why
SO("S2-05", "switch on: sales rep A and sales rep B", "that Labor and Parts can hold different people", "said why sales rep B is needed")
SO("S2-05", '"Sales Representative - Parts" set to sales rep B', "that the remove x takes away a Parts person different from the Labor person", "said why sales rep B is needed")
SO("S4-04", "switch on: sales rep A and sales rep B", "that Service Labor and Service Parts hold different people", "said why sales rep A is needed")
SO("S4-04", '"Sales Representative - Service Labor" set to sales rep A', "you can see that Part Sales copies Service Parts, not Service Labor", "said why sales rep A is needed")
for k, clause in [("S4-05", "you can see which person stays when Service Parts is removed"), ("S4-06", "you can see that new part sales follow Service Parts once Part Sales is removed")]:
    SO(k, "switch on: sales rep A, sales rep B and sales rep C", "that each customer field holds a different person", "said why all three reps are needed")
    SO(k, '"Sales Representative - Service Labor" set to sales rep A', clause, "said why all three reps are needed")
SO("S4-12", "switch on: sales rep A and sales rep B", "that Service Labor and Service Parts hold different people", "said why sales reps A and B are needed")
SO("S4-12", '"Sales Representative - Service Labor" set to sales rep A', "you can see that new part sales take neither the Service Labor nor the Service Parts person", "said why sales reps A and B are needed")
SO("S4-20", "switch on: sales rep A and sales rep B", "that customer A's two fields hold different people", "said why sales rep A is needed")
SO("S4-20", "Use customer A,", "only its Service Parts row holds sales rep B", "said why sales rep A is needed")
SO("S4-14b", "Use customer A,", "the work order starts with sales rep A", "said why customer A is needed")
for k, clause in [("S5-14", "the invoice has a separate Parts row for sales rep B"),
                  ("S5-15", "the Expanded CSV has a representative row for sales rep A and separate Labor and Parts rows"),
                  ("S8-07", "the Parts filter leaves only sales rep B's row")]:
    SO(k, "switch on: sales rep A and sales rep B", "that the work order can have a different Labor and Parts representative", "said why both reps are needed")
    SO(k, "Labor set to sales rep A", clause, "said why both reps are needed")
SO("S7-04", "switch on: sales rep A and sales rep B", "that Labor and Parts hold different people", "said why sales rep A is needed")
SO("S7-04", "where the Parts side was changed to sales rep B today", "the log has an entry for the Parts person", "said why sales rep A is needed")
SO("D-12", "switch on: sales rep A, sales rep B and sales rep C", "that each of the three fields holds a different name", "said why all three reps are needed")
SO("D-12", "Use a customer with Service Labor set to sales rep A", "the page shows all three representative rows", "said why all three reps are needed")
SO("REL-17", "the test location, a second location and a third location", "that the Location filter has several options to tick", "said why three locations are needed")
