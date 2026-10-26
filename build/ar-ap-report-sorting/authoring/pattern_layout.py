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

# Result sentences that list several separate facts, split one fact per bullet (read 26 Oct 2026)
for doc, party, col in (("invoice", "customer", "Customer Full Name"), ("bill", "vendor", "Vendor Name")):
    RES_SPLIT[f'One row for {doc} A: its Aging Bucket reads "31-60 days past due" (the bucket\'s name as the screen shows it) and its {col} '
              f"{party} A's name, each in its own column, the Date reads date A written year-month-day (for example 2026-09-01) and the "
              "Amount reads 1250.50 (no $ sign, no thousands comma, two decimals)."] = [
        f"One row for {doc} A.",
        f'Its Aging Bucket reads "31-60 days past due" (the bucket\'s name as the screen shows it) and its {col} reads {party} A\'s name, each in its own column.',
        "Its Date reads date A written year-month-day (for example 2026-09-01).",
        "Its Amount reads 1250.50 (no $ sign, no thousands comma, two decimals)."]
for doc, party, col in (("invoice", "customer", "Customer"), ("bill", "vendor", "Vendor Name")):
    RES_SPLIT[f"One row for {doc} A: {party} A's name is in the {col} column, the Date reads date A written year-month-day (for example "
              "2026-09-01) and the Amount reads 1250.50 (no $ sign, no thousands comma, two decimals)."] = [
        f"One row for {doc} A.",
        f"{party.capitalize()} A's name is in the {col} column.",
        "Its Date reads date A written year-month-day (for example 2026-09-01).",
        "Its Amount reads 1250.50 (no $ sign, no thousands comma, two decimals)."]
for party, credit in (("customer", "credit memo"), ("vendor", "vendor credit")):
    P_ = party.capitalize()
    RES_SPLIT[f"Both {party}s stay listed (each has an amount 31 to 60 days past due) with their whole balance: {party} A's Total $1,550.00 "
              f"(1,000.00 + 400.00 + 300.00 − 150.00, the not-yet-due amount and the {credit} included) and {party} B's $750.00 (500.00 + 250.00)."] = [
        f"Both {party}s stay listed (each has an amount 31 to 60 days past due), each with its whole balance.",
        f"{P_} A's Total is $1,550.00 (1,000.00 + 400.00 + 300.00 − 150.00, the not-yet-due amount and the {credit} included).",
        f"{P_} B's Total is $750.00 (500.00 + 250.00)."]
RES_SPLIT['Then "Cancel" on the left and "Switch location" (small l) on the right, and a close "×" at the top right, as in the picture except '
          'that the picture writes "Switch Location" with a capital L (the PRD\'s small l is right: see References from Design).'] = [
    'Below them, "Cancel" is on the left and "Switch location" (small l) on the right, and a close "×" is at the top right, as in the picture '
    'except that the picture writes "Switch Location" with a capital L (the PRD\'s small l is right: see References from Design).']

# ---- Preconditions that relate to the steps and results (26 Oct 2026, relevance pass) -----------------------------------------------
# TWO_LOC: cases that never name location A or B again. Value (reason, keep "enrolled at both"): reason None removes the two-locations
# block; otherwise the bullet becomes "Have open documents in these reports at two locations, so <reason>."
_COL, _CHIP, _FILTER = "the Location column shows", "the Location chip shows", "the Location filter shows and can be cleared"
_PIC = "the Location column and the Location chip show, as in the design picture"
_LOOK = "the Location column shows, as in the layout being checked"
TWO_LOC = {}
for _k in ["S2-40", "S2-41", "S2-42", "S6-01", "S6-02", "D-01", "D-04", "D-07", "D-10", "D-13", "D-16", "D-81", "D-47", "D-48"]: TWO_LOC[_k] = (_COL, False)
for _k in ["S3-03", "S3-04", "S3-05", "S3-06", "S3-07", "S3-08"]: TWO_LOC[_k] = ("the Location column shows on screen and in the exports", False)
for _k in ["S3-15", "S3-16"]: TWO_LOC[_k] = ("the exports cover more than one location (\"Locations: All locations\")", False)
for _k in ["S5-01", "S5-02", "S5-03", "S5-04", "S5-05", "S5-06", "REL-01", "REL-02"]: TWO_LOC[_k] = (_CHIP, False)
for _k in ["S3-24", "S5-14", "REL-13", "D-37"]: TWO_LOC[_k] = (_FILTER, False)
for _k in ["REL-05", "REL-05b", "REL-05c"]: TWO_LOC[_k] = ("one location can be ticked in the filter", False)
for _k in ["D-29", "D-30"]: TWO_LOC[_k] = ("the Location menu lists two locations (\"2 selected\")", False)
for _k in ["D-02", "D-03", "D-05", "D-06", "D-08", "D-09", "D-11", "D-12", "D-14", "D-15", "D-17", "D-18"]: TWO_LOC[_k] = (_LOOK, False)
for _k in ["D-50", "D-51", "D-52", "D-54", "D-68", "D-69", "D-72"]: TWO_LOC[_k] = (_PIC, False)
TWO_LOC["D-65"] = (_PIC + ", and the location switcher names both", True)
for _k in ["D-01b", "D-01c", "D-04b", "D-04c", "D-07b", "D-07c", "D-10b", "D-10c", "D-13b", "D-13c", "D-16b", "D-16c"]: TWO_LOC[_k] = (None, False)
# PRE_ADD: data a result needs that no precondition created (inserted after the bullet that starts with the anchor)
_ADMIN = 'Sign in as an Admin user (the "Admin" role)'
PRE_ADD = {
    "D-33": [(_ADMIN, ["Have open documents in this report at two locations, so the Location chip shows."])],
    "D-34": [(_ADMIN, ["Have open documents in this report at two locations, so the Location chip shows."])],
    "D-56": [(_ADMIN, ["Have open documents in this report at two locations, so the Location column shows."])],
    "D-59": [(_ADMIN, ["Have open documents in this report at two locations, so the Location chip shows."])],
}
# EXACT: cases that add up, or change, their own records: the customers and vendors are "new (created for this test)", so no other
# case's data or failure can change the figures (QA lead, 26 Oct 2026: one failing case must not block another)
EXACT = {"S2-02", "S2-03", "S2-05", "S2-06", "S3-18", "S3-19", "S3-20", "S3-21", "S3-22", "S3-23", "S5-15", "S5-38",
         "DATA-07", "DATA-08", "DATA-09", "DATA-10", "DATA-11", "DATA-12", "DATA-13", "DATA-14", "DATA-15", "DATA-16", "DATA-17",
         "DATA-22", "DATA-23", "DATA-24"}

# ---- hand corrections from the relevance pass (26 Oct 2026) ------------------------------------------------------------------------
def _add(k, **kw):
    d = LAYOUT.setdefault(k, {})
    for f, v in kw.items():
        if isinstance(v, list): d.setdefault(f, []).extend(v)
        elif isinstance(v, dict): d.setdefault(f, {}).update(v)
        else: d[f] = v
_LONG_C = "Have a customer, customer A, with a long name (more than 40 characters) and open documents at both locations on today's date, including a credit memo."
_LONG_V = ("Have a vendor, vendor A, with a long name (more than 40 characters) and open documents at both locations on today's date, including a "
           "vendor credit (its Transaction Type is the longest).")
_WHY_C = ", so the page shows a long name and a credit memo row, which must not overlap or be cut off."
_WHY = ", so the page shows a long name and a long Transaction Type, which must not overlap or be cut off."
for _k in ["D-02", "D-03", "D-05", "D-06", "D-08", "D-09"]: _add(_k, pre_set=[(_LONG_C, [_LONG_C[:-1] + _WHY_C])])
for _k in ["D-11", "D-12", "D-14", "D-15", "D-17", "D-18"]: _add(_k, pre_set=[(_LONG_V, [_LONG_V[:-1] + _WHY])])
for _k in ["D-01b", "D-01c", "D-04b", "D-04c", "D-07b", "D-07c"]: _add(_k, pre_set=[(_LONG_C, ["Make sure the report has open documents on today's date."])])
for _k in ["D-10b", "D-10c", "D-13b", "D-13c", "D-16b", "D-16c"]: _add(_k, pre_set=[(_LONG_V, ["Make sure the report has open documents on today's date."])])
_add("D-32", pre_set=[("Have a vendor, vendor A, with unpaid bills on today's date.", ["Make sure the report has unpaid bills on today's date."])])
_add("REL-03", pre_set=[("Have a customer, customer A, with open invoices on today's date.",
                         ["Make sure the report has open invoices on today's date, so the PDF has rows."])])
for _k, _b in (("S4-09b", "bucket"), ("S4-11b", "bucket")):
    _add(_k, pre_set=[("Make sure that on today's date the report has two buckets", ["Make sure that on today's date the report has a bucket, bucket A, with more lines than fit on the screen."]),
                      ("Leave the report with the groups of bucket A and bucket B expanded.", ["Leave the report with bucket A's group expanded."])])
_add("S4-10b", pre_set=[("Make sure that on today's date the report has two customers", [
        "Make sure that on today's date the report has a customer, customer A, with more overdue invoices than fit on the screen and with a phone number and a credit term on its customer card."]),
                        ("Leave the report with the groups of customer A and customer B expanded.", ["Leave the report with customer A's group expanded."])])
_add("S4-12b", pre_set=[("Make sure that on today's date the report has two vendors", [
        "Make sure that on today's date the report has a vendor, vendor A, with more overdue bills than fit on the screen."]),
                        ("Leave the report with the groups of vendor A and vendor B expanded.", ["Leave the report with vendor A's group expanded."])])
for _k, _p in (("S2-07", "customer"), ("S2-15", "vendor")):
    _add(_k, pre_set=[('Make sure that in the "1-30 days past due" bucket there are three open documents', [
        'Make sure that in the "1-30 days past due" bucket there are three open documents: one at location B and two at location A; one of the three is a different transaction type from the others.'])])
for _k, _p in (("S2-11", "customer"), ("S2-19", "vendor")):
    _add(_k, pre_set=[(f"Make sure that in {_p} A's group there are three open documents", [
        f"Make sure that in {_p} A's group there are three open documents: one at location B and two at location A; one of the three is a different transaction type from the others."])])
for _k, _p, _d in (("S2-08", "customer", "invoices"), ("S2-09", "customer", "invoices"), ("S2-16", "vendor", "bills"), ("S2-17", "vendor", "bills")):
    _add(_k, pre_set=[('Make sure that in the "1-30 days past due" bucket there are three open', [
        f'Make sure that in the "1-30 days past due" bucket there are three open {_d}, document A, document B and document C, each for a different {_p}, so the rows sort across {_p}s:'])])
_add("DATA-13", pre_sub=[("with an invoice A of $100.00 paid $120.00 (overpaid)", "with an invoice of $100.00 paid $120.00 (overpaid)")])
for _k, _what in (("REL-01", "A/R"), ("REL-02", "A/P")):
    _add(_k, pre_sub=[("for an as-of date before the release (date A), untouched", "for one as-of date before the release, untouched")],
         pre_set=[("On each report, as you open it, choose date A as the as-of date.", ["On each report, as you open it, choose the as-of date the screenshots show."])])
for _k in ("REL-05", "REL-05b", "REL-05c"):
    LAYOUT[_k]["pre_sub"] = [("for date A with one location ticked", "for an as-of date before the release with one location ticked")]
_add("REL-08", pre_set=[("Have a customer, customer A, with an unused credit memo A dated a day before the release (date A).", [
        "Have a customer with an unused credit memo, credit memo A, dated a day before the release."]),
                        ("Make sure that before the release was installed, you noted which A/R Detail bucket", [
        "Make sure that before the release was installed, you noted which A/R Detail bucket credit memo A was in with its own date as the as-of date."]),
                        ("Leave the report with date A as the as-of date and customer A ticked.", [
        "Leave the report with credit memo A's date as the as-of date and its customer ticked."])])
_add("S2-19b", pre_set=[("Have a vendor, vendor A, with overdue bills on today's date.", [
        "Have a vendor, vendor A, with overdue bills on today's date, at least two of them with different dates."]),
                        ("Make sure vendor A has at least two open documents with different dates.", [])])
_add("S7-11", pre_set=[('Sign in as user B, an "Admin" user enrolled only at location A', ['Sign in as an "Admin" user enrolled at one location only.']),
                       ("Have a customer, customer A, with an open invoice A made at location B", [
        "Have a customer, customer A, with an open invoice A made at another location, one this user is not enrolled in."])])
