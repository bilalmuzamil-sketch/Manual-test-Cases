"""Tester read-through, 26 Oct 2026 (build/tester-readthrough-2026-10-26/WORKER-BRIEF.md). The QA lead, after a sample of 9 live cases
showed 3 a tester could not act on: "GO" to a read-through of every case, "Make sure that your work does not bite me", and "the
preconditions/steps/and expected behavior are related and the one who is running the test cases as a manual QA tester may understand
the test scenario."

Every case was read as a manual tester who has never seen the feature would read it (title, preconditions, steps, results together),
against eight checks: 1 clear setup, 2 no vague words, 3 a negative check proves its trigger ran, 4 no repeated or bundled steps,
5 related, 6 understandable, 7 no "mark this test Blocked" line (Rule 117 fifteenth amendment), 8 enrolment (A/R and A/P only, not
this suite). This module holds the fixes, applied LAST to the tester-facing parts (after pattern_cases.py and the relevance and
independence passes) by ssr_lib.pattern_parts for the library cases and by pattern-format-2026-10-26/dr_pattern.py for the six
design-recheck cases. The quotes, their From: lines, the References from Design block and the AUTOMATION line are never touched here.

Operations, applied in order (each must hit exactly once, or the build stops):
  ("pre_sub", old, new)     replace text inside the one precondition bullet that contains old
  ("pre_del", old)          remove the one precondition bullet that contains old
  ("pre_ins", before, new)  insert a bullet before the one that contains before (None: at the end)
  ("step", n, text)         replace step n
  ("steps", [..], [[..]])   replace all steps and all results (a step added, merged or split)
  ("res", n, [..])          replace the result bullets of step n
  ("res_sub", n, old, new)  replace text inside the one result bullet of step n that contains old (new may be a list: one bullet
                            becomes several)
  ("title", text)           replace the title
"""
RT = {}

def R(key, checks, why, *ops):
    e = RT.setdefault(key, {"checks": [], "why": [], "ops": []})
    e["checks"] = sorted(set(e["checks"]) | set(checks)); e["why"].append(why); e["ops"] += list(ops)

def _one(items, old, key, what):
    hit = [i for i, x in enumerate(items) if old in x]
    assert len(hit) == 1, f"readthrough {key}: {what} {old!r} hits {len(hit)} items"
    return hit[0]

def apply(key, pre, steps, res, title):
    """Return (pre, steps, res, title) with this case's read-through fixes applied."""
    e = RT.get(key)
    if not e: return pre, steps, res, title
    pre, steps, res = list(pre), list(steps), [list(r) for r in res]
    for op in e["ops"]:
        k = op[0]
        if k == "pre_sub": i = _one(pre, op[1], key, "precondition"); pre[i] = pre[i].replace(op[1], op[2], 1)
        elif k == "pre_del": pre.pop(_one(pre, op[1], key, "precondition"))
        elif k == "pre_ins": pre.insert(len(pre) if op[1] is None else _one(pre, op[1], key, "precondition"), op[2])
        elif k == "step": assert 1 <= op[1] <= len(steps), (key, op); steps[op[1] - 1] = op[2]
        elif k == "steps": assert len(op[1]) == len(op[2]), (key, "steps and results differ in number"); steps, res = list(op[1]), [list(r) for r in op[2]]
        elif k == "res": assert 1 <= op[1] <= len(res), (key, op); res[op[1] - 1] = list(op[2])
        elif k == "res_sub":
            r = res[op[1] - 1]; i = _one(r, op[2], key, f"result of step {op[1]}")
            new = op[3] if isinstance(op[3], list) else [r[i].replace(op[2], op[3], 1)]
            r[i:i + 1] = new
        elif k == "title": title = op[1]
        else: raise ValueError(op)
    assert len(steps) == len(res), (key, "steps and results differ in number")
    return pre, steps, res, title

LINES = "one approved labor line, one part, "
PICS_AT = "attached to this case beside the browser window at 100% (actual size)."

# ---------------- Story 1 ----------------
R("S1-10", [2], 'Step 1 said "for example by going offline in the browser": it now says exactly what to do, matching its result "The browser is offline".',
  ("step", 1, "Turn off this computer's network connection (Wi-Fi off or network cable unplugged), so the next save of a Sales Representative change fails."))

# ---------------- Story 2 ----------------
R("S2-07b", [1, 5], "The person the case changes (sales rep C, whose switch is turned off) was described as an existing staff member while sales rep A, who is only picked, was \"created for this test\": swapped, so the record the case changes is the one made for it.",
  ("pre_sub", 'Create an active staff member for this test at the test location with the "Sales Representative" switch on: sales rep A.',
   'Have an active staff member at the test location with the "Sales Representative" switch on: sales rep A.'),
  ("pre_sub", 'Have a second active staff member at the test location with the "Sales Representative" switch on: sales rep C.',
   'Create a second active staff member for this test at the test location with the "Sales Representative" switch on: sales rep C.'))
R("S2-08", [1], "The work order to invoice had no lines; it now has one approved labor line and one part, so it can be invoiced.",
  ("pre_sub", 'for that customer with "Sales Representative - Labor" set to sales rep A', 'for that customer with ' + LINES + '"Sales Representative - Labor" set to sales rep A'))
R("S2-10", [1, 5], "The work order to invoice had no lines (added one approved labor line and one part). The last result (the new invoice is credited to sales rep B) could not be seen: Sales By Representative shows a representative's invoices only after the row is expanded, so a step \"Expand sales rep B.\" was added and the date-range step now has its own result.",
  ("pre_sub", 'for that customer with one "Sales Representative" field set to sales rep A, and invoice it',
   'for that customer with one approved labor line, one part and one "Sales Representative" field set to sales rep A, and invoice it'),
  ("steps", ["Reverse the invoice of the work order.", "Click the Sales Representative field.", "Click sales rep B in the dropdown.", "Invoice the work order again.",
             "Open Reports > Sales By Representative.", "Set the date range to today.", "Expand sales rep B."],
   [["The invoice is reversed.", "The Sales Representative field can be changed again."], ["The dropdown opens."], ["The field reads sales rep B."],
    ["The new invoice is created.", "The field is plain text again, reading sales rep B."], ["The Sales By Representative report opens."],
    ["The report shows today's date range."],
    ["The new invoice of the work order is listed under sales rep B: it is credited to sales rep B, not sales rep A."]]))
R("S2-11", [2, 6], 'The last result said the entry is recorded "as Part Sales Update v1 records it", a name a tester does not know; it now says the entry is worded as a part sale\'s log entry was before this release. The sources give no wording for that entry, so it is listed under "could not make concrete".',
  ("res", 6, ["The log has an entry for the change of the representative to sales rep A, worded as a part sale's log entry was worded before this release."]))
R("S2-16", [1], "The work order to invoice and pay had no lines; it now has one approved labor line and one part.",
  ("pre_sub", 'for that customer with "Sales Representative - Labor" set to sales rep A', 'for that customer with ' + LINES + '"Sales Representative - Labor" set to sales rep A'))

# ---------------- Story 3 ----------------
NATIVE = "The phone's own built-in list opens, the same kind Lead Technician and Service Advisor open on a phone."
R("S3-02", [2], '"The same dropdown Lead Technician and Service Advisor open on a phone" and "the same options as on a desktop" now say what the tester sees: the phone\'s own built-in list (the design\'s "native dropdown", board 6.3 on the case\'s design page 6), with "Unassigned" first and then the sales representatives.',
  ("res", 2, [NATIVE, '"Unassigned" is first, then the sales representatives: the same options as on a desktop.', "Sales rep A is checked.", "There is no x inside the field."]))
R("S3-03", [2], '"The same native dropdown opens" now says what the tester sees: the phone\'s own built-in list, the same kind the work order fields open.',
  ("res", 2, [NATIVE]))

# ---------------- Story 4 ----------------
R("S4-17", [1, 5], 'The result "Sales rep B is not listed in the report" holds only if sales rep B has no other invoice that day; a "Make sure ..." line now says so.',
  ("pre_ins", "Open Reports > Sales By Representative", "Make sure sales rep B has no other invoices at the test location today, so the report would list sales rep B only if this invoice credited them."))
R("S4-21", [1, 4], 'The last precondition said "Open the page with the Sales Representative Assignments export", which names no page, and step 1 bundled choosing and downloading the export. The precondition now opens Reports > Export Reports (the Export Report dialog, as the report suite records it) and the download is two steps: pick the report, click Export.',
  ("pre_sub", "Open the page with the Sales Representative Assignments export in a desktop browser at least 1024 pixels wide.",
   'Open Reports > Export Reports (in the Reports left sidebar, under Accounting) in a desktop browser at least 1024 pixels wide, so the "Export Report" dialog is open.'),
  ("steps", ['Pick "Sales Representative Assignments" in the Report Name list.', "Click Export.", "Open the downloaded file."],
   [['"Sales Representative Assignments" is selected.'], ["A file named sales-representative-assignments.csv downloads."],
    ['The column after "Representative is active?" is named "Side".', 'Customer A has one row: sales rep A, Side "Parts and Service".',
     'Customer B has two rows: sales rep A "Service Labor" and sales rep B "Service Parts".', 'Customer C has one row: sales rep C, Side "Parts and Service, Part Sales".',
     "The rows run by customer name, A to Z (customer A, then customer B, then customer C).", "Within customer B, sales rep A's row comes before sales rep B's."]]))
R("S4-22", [1], 'The import file and the place to import it were not said ("Have a contacts import file that contains the customer", "Open the contacts import"). The file now holds this same customer with its current name and details, so the import is a re-import of it, and the import page is named (Settings > Imports).',
  ("pre_sub", "Have a contacts import file that contains the customer with its current details.",
   "Have a contacts import file that holds this customer with its current name and details, so importing it re-imports the same customer (it does not add a new one)."),
  ("pre_sub", "Open the contacts import in a desktop browser", "Open the contacts import page (Settings > Imports) in a desktop browser"))
R("S4-24", [2], '"The new work order can carry on with it" now says what the tester sees: the new work order shows the new customer.',
  ("res_sub", 6, "The new work order can carry on with it.", "The new work order shows the new customer."))

# ---------------- Story 5 and money ----------------
R("S5-01", [2], '"With the labor columns filled" and "counts the invoice once" now say what the tester sees: the labor cells show figures, not dashes, and each summary row shows (1) after the name (the report\'s invoice count, as the design\'s page 4 shows it, for example "Devon Whitfield (3)").',
  ("res_sub", 1, "The row shows Labor Invoiced $200.00 and Hrs Invoiced 2.00, with the labor columns filled.",
   ["The row shows Labor Invoiced $200.00 and Hrs Invoiced 2.00.", "Its Hrs Worked, Labor Delta and Labor Margin cells show figures, not dashes."]),
  ("res_sub", 1, "Sales rep A's summary row counts the invoice once.", "Sales rep A's summary row shows (1) after the name: it counts the invoice once."),
  ("res_sub", 2, "Sales rep B's summary row counts the invoice once.", "Sales rep B's summary row shows (1) after the name: it counts the invoice once."))
R("S5-08", [2], '"It counts once" now says what the tester sees: sales rep A\'s summary row shows (2) after the name, one for each work order.',
  ("res_sub", 1, "It counts once.", "It counts once: sales rep A's summary row shows (2) after the name, one for each work order."))
R("S5-13", [2], '"Counts that invoice once" and "counted once" now say what the tester sees: (1) after sales rep B\'s name and (2) after sales rep A\'s (the first work order\'s labor and this one).',
  ("res_sub", 1, "Sales rep B's summary row counts that invoice once.", "Sales rep B's summary row shows (1) after the name: it counts that invoice once."),
  ("res", 2, ["Sales rep A has a $0.00 row for the second work order.", "Sales rep A's summary row shows (2) after the name: the first work order and this one, each counted once."]))
R("S5-12", [2, 6], '"The cells of the side a row is not credited with show a dash" now names the cells, the same ones the case\'s CSV result names.',
  ("res_sub", 3, "The cells of the side a row is not credited with show a dash.",
   ["On the Labor row the parts cells show a dash.", "On the Parts row the labor, hours and Shop Supplies cells show a dash."]))
R("S5-17", [1], 'The invoices the sums are checked on were a "Make sure ..." line; they are data the result depends on, so they are now something to have, and the split work order names the two staff members.',
  ("pre_sub", "Make sure the test location has at least three invoices today: one split work order, one work order with one person on both sides and one part sale.",
   "Have, at the test location today, at least three invoices: one split work order (Labor and Parts set to the two staff members), one work order with one person on both sides and one part sale."))

# ---------------- Story 6 ----------------
R("S6-04", [3], 'The only result was "There is no Sales Representative row on the printout"; it now first shows the printout opened, so a tester knows the print ran (S6-R4: "the row is left off the printout").',
  ("res", 2, ["The printout opens.", "There is no Sales Representative row on the printout."]))

# ---------------- Story 8 ----------------
R("S8-01", [2], '"The totals and counts follow" and "shows its empty state" now say what the tester sees.',
  ("res_sub", 2, "Part Sales rows leave the report, and the totals and counts follow.",
   ["Part Sales rows leave the report.", "The totals and the invoice counts no longer include the part sale."]),
  ("res_sub", 4, "The report shows its empty state with no invoices.", "The report lists no representatives and no invoices: it shows its empty state."))

# ---------------- Release day and what must not change ----------------
def SO_PICS(clause): return ("pre_sub", PICS_AT, PICS_AT[:-1] + f", so {clause}.")
R("REL-01", [5, 6], 'The design pictures (boards 2.0 to 2.2, "Before": production today) were opened but no step used them; their bullet now says why. The last result\'s second bullet ("This is one of the few customers ...") is not something a tester sees; it is now said inside the result it explains.',
  SO_PICS("you can see how these screens looked before the release"),
  ("res", 4, ['"Sales Representative" reads "Unassigned" (customer C is one of the few customers whose representative was no longer a user of the shop).']))
R("REL-02", [5], 'The design pictures (boards 1.0 and 1.1, "Before": production today) were opened but no step said why; their bullet now does.',
  SO_PICS("you can see how the card and its list looked before the release"))
R("REL-03", [5], 'The design pictures (boards 4.0 to 4.3, "Before": production today) were opened but no step said why; their bullet now does.',
  SO_PICS("you can see how the report looked before the release"))
R("REL-06", [5], 'The design picture (board 5.0, "Before": production today) was opened but no step said why; its bullet now does.',
  SO_PICS("you can see how the filter looked before the release"))
R("REL-07", [2, 5], '"The imported work order looks as it did before" could not be judged: nothing recorded how it looked. A screenshot taken before the release is now a precondition, the work order is opened with the release installed, and the result compares with it.',
  ("pre_ins", "Open the work order in a desktop browser", "Have a screenshot of this imported work order's card taken before the release was installed, so you can compare."),
  ("pre_sub", "Open the work order in a desktop browser", "With the release installed, open the work order in a desktop browser"),
  ("res_sub", 1, "The imported work order looks as it did before.", "The imported work order looks the same as in the screenshot taken before the release."))
R("REL-12", [2, 4, 5], 'The preconditions said twice that a phone is used ("Use a phone screen." and "Open the work order on a phone ..."): the first is removed. The design pictures (boards 6.0 and 6.1, "Before": production today) now say why they are open, and "Its dropdown opens as today" points at the picture of today\'s list (board 6.1).',
  ("pre_del", "Use a phone screen."),
  SO_PICS("you can see how the details panel and the representative list look before the release"),
  ("res_sub", 1, "The card expands with the same control as before.", "The card expands with the same edit button as before the release."),
  ("res_sub", 2, "Its dropdown opens as today.", "Its list opens as it did before the release (as in the picture of board 6.1)."))
R("REL-13", [1], 'Step 2 asked the tester to open "the Sales By Representative report\'s address" without saying where to get it: a precondition now has it copied while signed in as an Admin, and the step pastes it.',
  ("pre_ins", "Open any page in a desktop browser", "Have the address of the Sales By Representative report, copied from the browser's address bar while signed in as an Admin."),
  ("step", 2, "Paste that address into the browser's address bar and open it."))
R("REL-15", [1, 2, 5], '"Only the invoiced work order counts" could not be judged without amounts, and the customer could have other invoices that day. The customer now has no other invoices today, the two work orders have amounts ($100.00 invoiced, $50.00 reversed), and the result says the row holds the $100.00 only. The customer\'s representative played no part and is no longer asked for.',
  ("pre_sub", "Use a customer with no Sales Representative assigned.", "Use a customer that has no other invoices today."),
  ("pre_sub", "Have one invoiced work order and one reversed invoice for that customer today.",
   "Have, for that customer today, one invoiced work order with one part sold at $100.00, and another work order with one part sold at $50.00 that was invoiced and then had its invoice reversed."),
  ("res", 1, ["The customer's row holds only the invoiced work order's $100.00.", "The reversed invoice is not a row.", "The reversed invoice's $50.00 adds nothing to any count or total."]))
R("REL-17", [2], 'Step 1 said "Open a filter ... (for example Location)": the preconditions set up three locations for the Location filter, so the step now opens the Location filter and the results name its labels.',
  ("step", 1, "Open the Location filter (it lets you tick several options)."),
  ("res_sub", 3, '(for example "All locations")', '(for the Location filter, "All locations")'),
  ("res_sub", 6, '(for example "2 locations")', '(for the Location filter, "2 locations")'))

# ---------------- Design — how it looks ----------------
R("D-08", [1], "The work order to invoice had no lines; it now has one approved labor line and one part.",
  ("pre_sub", "Have a work order for that customer with Labor set to sales rep A", "Have a work order for that customer with " + LINES + "Labor set to sales rep A"))
R("D-12", [2], '"They are in the window\'s order" now names the order.',
  ("res_sub", 1, "They are in the window's order.", "They show in the window's order: Service Labor, then Service Parts, then Part Sales."))
R("D-13", [2], '"The same ... as Edit Customer, in the same spot" and "the same two options as Edit Customer" now say what the tester sees (S4-R1 outlined box, S4-R6 menu order).',
  ("res", 1, ['New Customer shows the optional "Sales Representative" field in an outlined box, with the + beside it, in the same spot as on Edit Customer, as in the picture.']),
  ("res", 3, ['The menu lists "Sales Representative - Service Parts" and then "Sales Representative - Part Sales", the same two options as Edit Customer.']))
R("D-14", [2, 6], 'The title and step 2\'s result named "Part Sales Update v1", a release a tester does not know; the title now says the field keeps its look, and the result says what shows (a hover box and arrow across the full width of the card, as in the picture of board 3.2).',
  ("title", "A part sale's representative field keeps the look it has today"),
  ("res", 2, ["The field's own hover box and arrow show across the full width of the card, as in the picture of board 3.2."]))
DASHES = ["On sales rep A's Labor row of the split invoice the parts columns show a dash.",
          "On sales rep B's Parts row the labor, hours and Shop Supplies columns show a dash."]
PS_A = ("pre_sub", "and one invoiced part sale with no shop supplies.", "and one invoiced part sale for that customer with Sales Representative set to sales rep A and no shop supplies.")
R("D-15", [2, 5], 'The part sale had no representative, so the expanded rows might not show it: it is now sales rep A\'s. "A side a representative did not sell shows a dash" now names the cells (S5-R15).',
  PS_A, ("res_sub", 3, "A side a representative did not sell shows a dash (including Shop Supplies on the Parts row).", DASHES))
R("D-15c", [5], 'The part sale had no representative, so expanding sales reps A and B might not show its "Part Sales" row: it is now sales rep A\'s.', PS_A)
R("D-18", [2], '"The native dropdown opens" now says what the tester sees: the phone\'s own built-in list.',
  ("res_sub", 2, "The native dropdown opens, the same as Lead Technician.", "The phone's own built-in list opens, the same kind Lead Technician opens."))
R("D-18b", [2, 4, 6], 'Step 2 said "Add Parts" and step 3 used the same words for the menu option and the field; both now say what to tap. "The same list opens as for each row" now says what the tester sees, against the picture of board 6.7.',
  ("step", 2, 'Tap "Sales Representative - Parts" in the menu and compare with the picture of board 6.6.'),
  ("step", 3, 'Tap the "Sales Representative - Parts" field and compare with the picture of board 6.7.'),
  ("res", 3, ["The Parts field opens the same list the Labor field has, as in the picture of board 6.7."]))

# ---------------- Design-recheck cases (rendered by pattern-format-2026-10-26/dr_pattern.py) ----------------
R("DR-01", [1], "The work order to invoice had no lines; it now has one approved labor line and one part.",
  ("pre_sub", 'Have a first work order with "Sales Representative - Labor"', 'Have a first work order with ' + LINES + '"Sales Representative - Labor"'))
R("DR-06", [1], 'The first precondition selected both locations in the Location filter before the report was opened; the report is now opened with both locations selected, and the first bullet only has the second location.',
  ("pre_sub", "Have a second location open to you, and select both locations in the Location filter so that the report shows its Location column.",
   "Have a second location open to you besides the test location, so that the report can show its Location column."),
  ("pre_sub", "with the date range set to today and Show Unassigned on.", "with the date range set to today, Show Unassigned on and both locations selected in the Location filter, so that the Location column shows."))
R("DR-07", [1], 'The work order was set up as "labor $600.00, parts $400.00, shop supplies $30.00": it now says how (a labor line of 6.00 hours at $100.00, a part sold at $400.00, shop supplies typed by hand, the discount not on any line).',
  ("pre_sub", "with labor $600.00, parts $400.00, shop supplies $30.00 and a whole-invoice discount of $50.00,",
   "with one labor line of 6.00 hours at $100.00 an hour ($600.00), one part sold at $400.00, shop supplies typed by hand as $30.00 and a whole-invoice discount of $50.00 (not on any line),"))

# ---------------- Lists for the report ----------------
COULD_NOT_MAKE_CONCRETE = {
 "S2-11": 'Step 6: the sources say only that Part Sales Update v1 adds the part sale\'s log entry (Story 7 context note); they give no wording for it, so the result says it is worded as before this release.',
 "S4-01": 'Step 1: "in the place Edit Customer shows it today" (S4-R1): no source names the position.',
 "D-10": 'Step 1: "in the place Edit Customer shows it today" (S4-R1): no source names the position; the picture of board 2.3 is the reference.',
 "D-13": 'Step 1: "in the same spot as on Edit Customer" (S4-R1, board 2.16 note): no source names the position; the picture of board 2.16 is the reference.',
 "S4-19b": 'Step 1: the "Turn Off Sales Representative" warning "does not change" (S4-R21, answer 13): no source gives today\'s wording (only the product code does, which is never a source of expected results).',
 "S5-14": 'Step 2: "still shows the representatives captured when it was invoiced" (S5-R2 is about the invoice): no source says what the work order card shows after a rename.',
 "S8-07": 'Step 4: "without a full reload" (Sales By Representative spec S12-R3a): no source says what a full reload looks like to the user.',
 "REL-14": 'Step 1: "all figures as before the release": the case gives the exact figures; no source gives the pre-release figures beyond them.',
}
NEGATIVE_WITHOUT_CONTROL = {
 "S8-06b": 'Step 1 ("Nothing happens" on a Sales Type header click): the only control the sources back is sorting by a money column (Sales By Representative spec S11-R1), but no source says how a sorted column looks, so a tester could not tell that control passed; the header click itself is the trigger the tester performs.',
}
