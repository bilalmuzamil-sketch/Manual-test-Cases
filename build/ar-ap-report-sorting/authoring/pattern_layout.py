"""Per-case corrections to the mechanical pattern conversion (pattern.convert), made by hand after reading every converted case in
full on 26 Oct 2026 (Rule 117 fourteenth amendment). The keys are explained in pattern.apply_layout; every replacement must find
its target or the build stops. An example value that a result depends on is written here as a plain fact (brief, point 2): the
names in S1-01 to S1-04 and S1-07, the bill due days in S2-23, the invoice amounts in S5-38 and DATA-16 / DATA-17. Every other
example value (the ZZAUTOTEST names, the example locations, invoice numbers and organizations) was only an example and stays in the
setup file for Claude sessions."""

# One result sentence that holds several facts, shared by several cases: written once (pattern.apply_layout, G)
RES_SPLIT = {}
for party, icon in (("Customer", "person"), ("Vendor", "truck")):
    low = party.lower()
    RES_SPLIT[f'The {party} chip reads "{party}: All {low}s" with a {icon} icon and the Past due chip "Past due: Any" with an hourglass '
              f'icon, both in the resting (grey) style.'] = [
        f'The {party} chip reads "{party}: All {low}s" with a {icon} icon.',
        'The Past due chip reads "Past due: Any" with an hourglass icon.',
        'Both are in the resting (grey) style.']

def dialog(kind):
    """The switch-location dialog result of S7-03 / S7-04, one fact per bullet."""
    return ["A dialog opens on the report, before leaving it.",
            'Its title reads "Switch location?".',
            f'Its message reads "This {kind} is in " followed by location B\'s name and "Switch your active location to view it?".',
            'The button "Cancel" is on the left and the button "Switch location" (small l) is on the right.',
            'A close "×" is at the top right.']

def names_order(party, names):
    """S1-01 / S1-02: the four names the result depends on."""
    p = party
    return [(f"Have four {p}s with open", [
        f"Have four {p}s with open {'invoices' if p == 'customer' else 'bills'} on today's date, named "
        f'"{names[0]}" ({p} A), "{names[1]}" ({p} B), "{names[2]}" ({p} C) and "{names[3]}" ({p} D). '
        "Their names differ by a number, a dash or capitals."])]

TRUCK = ["10 Trucking", "2 Trucking", "A-1 Towing", "a1 towing"]
LAYOUT = {
    "S1-01": dict(pre_set=names_order("customer", TRUCK), res_sub=[('With the example names: "10 Trucking"', '"10 Trucking"')]),
    "S1-02": dict(pre_set=names_order("vendor", TRUCK), res_sub=[('With the example names: "10 Trucking"', '"10 Trucking"')]),
    "S1-03": dict(
        pre_set=[("Have six customers with open invoices", [
            "Have six customers with open invoices on today's date, named \"Eagle\" (customer A), \"Émile's\" (customer B), \"Emma\" "
            "(customer C), \"Fargo\" (customer D), \"Øster\" (customer E) and \"Ozone\" (customer F). Customer B and customer E start "
            "with a capital accented letter."])],
        res_step={1: ["All six customers are listed, reading from top to bottom customer A, customer B, customer C, customer D, customer E, customer F.",
                      "\"Émile's\" sorts among the E names (between \"Eagle\" and \"Emma\"), not after the Z names.",
                      "\"Øster\" sorts as an O, before \"Ozone\"."]}),
    "S1-04": dict(
        pre_set=[("Have six vendors with open bills", [
            'Have six vendors with open bills on today\'s date, named "Ackley" (vendor A), "æble" (vendor B), "Afton" (vendor C), '
            '"Strand" (vendor D), "Straße" (vendor E) and "Strasser" (vendor F). Vendor B has "æ" and vendor E has "ß" in its name.'])],
        res_step={1: ["All six vendors are listed, reading from top to bottom vendor A, vendor B, vendor C, vendor D, vendor E, vendor F.",
                      '"æble" sorts as "aeble" (between "Ackley" and "Afton").',
                      '"Straße" sorts as "Strasse" (after "Strand", before "Strasser").']}),
    "S1-07": dict(
        pre_set=[("Have two customers with open invoices", [
            "Have two customers with open invoices on today's date whose names differ only by an accent: customer A, named "
            "\"Emile's Towing\", without it, and customer B, named \"Émile's Towing\", with it."])],
        res_step={1: ["The two customers sit next to each other (with the accent folded to its base letter their names are the same).",
                      "Customer A (no accent) is directly above customer B (with the accent).",
                      "The tie is broken by the plain lower-cased names, where the unaccented letter comes first."]}),
    "S1-14": dict(pre_sub=[("whose custom role A has", "whose custom role has")]),
    "S2-23": dict(pre_set=[("Have a vendor, vendor A, with two overdue bills", [
        "Have a vendor, vendor A, with two overdue bills, bill A (due 10 days ago) and bill B (due 20 days ago), and one unused "
        "vendor credit, vendor credit A, on today's date."])]),
    "S3-20": dict(pre_sub=[("invoice A, dated date A,", "invoice A, dated a day you note as date A,")]),
    "S3-21": dict(pre_sub=[("invoice A, dated date A,", "invoice A, dated a day you note as date A,")]),
    "S3-22": dict(pre_sub=[("bill A, dated date A,", "bill A, dated a day you note as date A,")]),
    "S3-23": dict(pre_sub=[("bill A, dated date A,", "bill A, dated a day you note as date A,")]),
    "S5-10c": dict(pre_set=[("Make sure the organization has open documents in this report", [
        "Make sure the organization has open documents in this report at location A and location B on today's date.",
        "Pick an earlier date, date A, on which location B had no open documents in this report."])]),
    "S5-11c": dict(pre_set=[("Make sure the organization has open documents in this report", [
        "Make sure the organization has open documents in this report at location A and location B on today's date.",
        "Pick an earlier date, date A, on which location B had no open documents in this report."])]),
    "S5-18": dict(pre_set=[("Make sure that on date A", [
        "Pick an earlier date, date A, on which all of the organization's open A/R documents were at location A."])]),
    "S5-26": dict(res_step={1: ["A/R Collection opens.", "Only customer A is ticked on the Customer chip.", "The as-of date is yesterday.",
                                'The Past due chip reads "Past due: 91+ days".', "Only location A is ticked."]}),
    "S5-27": dict(res_step={1: ["A/P Unpaid Invoices opens.", "Only vendor A is ticked on the Vendor chip.", "The as-of date is yesterday.",
                                'The Past due chip reads "Past due: 91+ days".', "Only location A is ticked."]}),
    "S5-32": dict(res_step={2: ['The Customer and Location filters return to their defaults ("Customer: All customers", "Location: All locations").',
                                "The as-of date stays.", "Rows show again."]}),
    "S5-37": dict(res_step={2: ["Tomorrow and every date after it cannot be picked.", 'The chip still reads "As of: " and today\'s date.']}),
    "S5-38": dict(
        pre_set=[("Make sure five customers", [
            "Have five customers, customer A, customer B, customer C, customer D and customer E, each with one open invoice on today's "
            "date and nothing else open: customer A's invoice is $100.00, customer B's $200.00, customer C's $300.00, customer D's "
            "$400.00 and customer E's $500.00."])],
        res_sub=[("The Totals row's Total is the five amounts added up (with the example amounts 100.00 + 200.00 + 300.00 + 400.00 + 500.00 = $1,500.00).",
                  "The Totals row's Total is the five amounts added up: $1,500.00 (100.00 + 200.00 + 300.00 + 400.00 + 500.00).")]),
    "S6-03": dict(res_step={1: ["The Location column is shown (All locations, three in the list)."],
                            2: ["The Location column is shown (two ticked)."],
                            3: ["The Location column is hidden (one ticked)."],
                            4: ["The Location column is hidden (none ticked).", "The empty state shows."]}),
    "S7-02": dict(res_step={1: ["The pointer does not turn into a hand.", "The row's text is not blue: only the number is a link."]}),
    "S7-03": dict(res_step={1: dialog("work order")}),
    "S7-04": dict(res_step={1: dialog("part sale")}),
    "S7-05": dict(res_step={4: ["The dialog closes.", "No message pops up.",
                                "You stay on the report exactly where you were: the same Past due filter, the Amount sort, customer A's "
                                "group still expanded and the same rows at the top and bottom of the screen (the same scroll position)."]}),
    "S7-10": dict(res_step={1: ["Credit memo A's number is plain text, not a link."], 3: ["Deposit A's number is plain text, not a link."]}),
    "S7-11": dict(res_step={1: ["The row is listed (the report stays organization-wide).", "Its number is plain text."]}),
    "S7-12": dict(res_step={2: ['Invoice B\'s number is plain text: the role lacks "Part Sales → View".']}),
    "S7-14": dict(res_step={1: ['Invoice A\'s number is plain text: the role lacks "Work Orders → View".']}),
    "S7-20": dict(res_step={4: ["The dialog closes.", "No message pops up.",
                                "You stay on the report exactly where you were: customer A still ticked, the Amount sort, every bucket "
                                "still expanded and the same rows at the top and bottom of the screen (the same scroll position).",
                                "The location switcher in the top right still shows location A."]}),
    "S8-13": dict(
        pre_set=[("Make sure you use a touch-screen device", ["Use a touch-screen device whose screen is at least 1024 px wide, with no mouse."]),
                 ("Use a desktop browser window 1440 px wide", ["On that device, use a desktop browser window 1440 px wide."]),
                 ("Leave the report on that device", [])]),
    "DATA-16": dict(pre_set=[("Have a customer, customer A, with eight open invoices", [
        "Have a customer, customer A, with eight open invoices on today's date: one of $10.00 not yet due, and one each 1, 30, 31, "
        "60, 61, 90 and 91 days past its due date, of $1.00, $30.00, $31.00, $60.00, $61.00, $90.00 and $91.00 in that order."])]),
    "DATA-17": dict(pre_set=[("Have a vendor, vendor A, with eight open bills", [
        "Have a vendor, vendor A, with eight open bills on today's date: one of $10.00 not yet due, and one each 1, 30, 31, 60, 61, "
        "90 and 91 days past its due date, of $1.00, $30.00, $31.00, $60.00, $61.00, $90.00 and $91.00 in that order."])]),
    "DATA-19": dict(pre_set=[("Make sure that on date A", [
        "Pick two as-of dates: date A, on which A/R Summary lists exactly 2,000 customers, and date B, on which it lists exactly 2,001."])]),
    "DATA-20": dict(
        pre_set=[("Make sure that today the organization has more than 2,001", [
                     "Make sure that today the organization has more than 2,001 open A/P lines.",
                     "Pick a set of vendors, the chosen vendors, whose open A/P lines today add up to exactly 2,000."]),
                 ("Make sure vendor B is not one of", [
                     "Have a vendor, vendor B, that is not one of the chosen vendors and has exactly one open A/P line today."])],
        step_sub=[("tick every vendor in vendor set A", "tick every one of the chosen vendors")]),
    "DATA-21": dict(pre_set=[("Make sure that on date A", [
        "Pick two as-of dates: date A, on which A/P Detail has exactly 50,000 open lines, and date B, on which it has exactly 50,001."])]),
    "DATA-22": dict(pre_set=[("Make sure invoice A's page is open in a second browser tab", [
        "Open invoice A's page in a second browser tab, ready to record a payment."])]),
    "REL-01": dict(
        pre_sub=[("of the three A/R reports for date A, untouched", "of the three A/R reports for an as-of date before the release (date A), untouched")],
        pre_set=[("Leave the report with date A chosen", ["On each report, as you open it, choose date A as the as-of date."])]),
    "REL-02": dict(
        pre_sub=[("of the three A/P reports for date A, untouched", "of the three A/P reports for an as-of date before the release (date A), untouched")],
        pre_set=[("Leave the report with date A chosen", ["On each report, as you open it, choose date A as the as-of date."])]),
    "REL-03": dict(pre_set=[("Make sure the test is run in the evening", [
        "Run this test in the evening at location A's local time, when the date in UTC is already tomorrow.",
        "Set this computer's clock to location A's time zone."])]),
    "REL-05": dict(pre_sub=[("for date A with one location ticked", "for an as-of date before the release (date A) with one location ticked")]),
    "REL-05b": dict(pre_sub=[("for date A with one location ticked", "for an as-of date before the release (date A) with one location ticked")]),
    "REL-05c": dict(pre_sub=[("for date A with one location ticked", "for an as-of date before the release (date A) with one location ticked")]),
    "REL-07": dict(pre_set=[("Make sure Work order 1 was made at location B", [
        "Have a work order, work order 1, made at location B, and a link to it copied from the address bar."])]),
    "REL-08": dict(pre_set=[("Have a customer, customer A, with an unused credit memo A dated date A", [
        "Have a customer, customer A, with an unused credit memo A dated a day before the release (date A).",
        "Make sure that before the release was installed, you noted which A/R Detail bucket credit memo A was in with date A as the as-of date."])]),
    "D-62": dict(pre_set=[("Have a vendor, vendor B, with unpaid bills at location A", [
        "Have a vendor, vendor B, with unpaid bills at location A.", "Make sure vendor A and vendor B both have long names."])]),
    "D-63": dict(pre_set=[("Have a customer, customer A, with an open invoice made at location B", [
        "Have a customer, customer A, with an open invoice made at location B, more than 90 days past due.",
        "Have a customer, customer B, with an unused credit memo at location A, more than 90 days past due.",
        "Have a customer, customer C, with an open invoice at location A, more than 90 days past due."])]),
    "D-70": dict(pre_set=[("Have a customer, customer A, with open invoices on date A", [
        "Have a customer, customer A, with open invoices on an earlier date, date A."])]),
}
