"""Setup-file content for the 21 cases: shared procedures (P-…) and one recipe per case (SETUP-…), each item naming the exact
values the case's Preconditions and Steps use. Click paths are the ones recorded in this repo's setup docs (14-16 Oct 2026)."""

PROC = {
 "P-SIGNIN": ("ACCOUNT-A", "Sign in as ACCOUNT-A. On a QA site click the Admin quick-login button on the sign-in page (you appear as "
              "\"Admin ShopView\"); elsewhere use the access the user gave at session start. Check the role: your initials (top right) > "
              "Settings > Roles & Permissions > \"Admin\": Work orders View and Create & Edit are on.",
              "The top bar shows your initials and the location."),
 "P-LOCATION": ("ACCOUNT-A", "Your initials (top right) > \"Change Location\" > pick the location the cases use (\"Staging Heavy Duty - "
                "9919\" on staging; on another site the location the user names). Create every record below at that location.",
                "The top bar next to the bell shows that location."),
 "P-TECH": ("ACCOUNT-A", "Your initials > \"Settings\" > \"Staff\" > \"New Staff Member\": First Name \"{first}\", Last Name \"{last}\" (the "
            "name then shows as \"{first} {last}\"), an Email with ZZAUTOTEST in it, Role \"Technician\", at least one Department "
            "(required), Location = the case location, \"Time Clock\" on > \"Save & Close\". If a staff member with exactly this name "
            "already exists, is active and matches, reuse it (except where the case deletes it or changes its Time Clock: then make it "
            "new, and delete or rename the old one first).",
            "\"Settings\" > \"Staff\" lists \"{first} {last}\" as active with Time Clock on."),
 "P-PHOTO": ("ACCOUNT-A", "Give the technician a profile photo: use an Email you can open when creating them, accept the invitation "
             "email and set a password, sign in as them in a private window, your initials > \"Edit Profile\" > \"Click to upload a "
             "profile photo\", pick any photo, close that window.",
             "Their avatar in Board View shows the photo, not initials."),
 "P-CUSTOMER": ("ACCOUNT-A", "Top menu \"Customers\" > \"New Customer\" > Name \"{name}\" > Save. On the customer page \"Contacts\" > "
                "\"New Contact\" > First Name \"ZZAUTOTEST\", Last Name \"Contact\" > Save. For each unit listed for this customer: "
                "\"Assets\" > \"New Asset\" > pick the contact, Year 2022, Make (type \"Freight\", pick Freightliner), Model M2, "
                "Unit = the unit given > Save. Contact and Make are required.",
                "The customer page lists one asset per unit, each with its Unit."),
 "P-WO": ("ACCOUNT-A", "\"Work Orders\" > \"Create Work Order\" > in the New Work Order window pick the customer and the asset with the "
          "given Unit > Save (if a Confirmation about the credit limit appears, click \"Create\"). On the Lines tab's New Line form type "
          "\"grease\", pick \"Service - Full grease service\", turn \"Line Approved\" on > \"Save & Close\" (status Approved). If a lead "
          "is given, pick it in the page's \"Lead Technician\" dropdown (saves at once). Leave it empty for no lead.",
          "List with the customer's name in Search shows the work order with that Unit, status and lead."),
 "P-WO-ESTIMATE": ("ACCOUNT-A", "As P-WO, but click \"Save & Close\" with \"Line Approved\" off; the work order stays an Estimate with no lead.",
                   "List shows the Unit as an Estimate with no lead."),
 "P-WO-REVIEW": ("ACCOUNT-A", "As P-WO, then on the line click \"Complete\", type a Tech Story (fill any missing detail it asks for, for "
                 "example Mileage) and click \"Complete Line\".", "The status reads Ready For Review."),
 "P-WO-INVOICED": ("ACCOUNT-A", "As P-WO-REVIEW, then on the \"Finance\" tab click \"Mark Reviewed\" (fill Mileage or Engine Hours if "
                   "asked, \"Confirm review\"), then \"Create Invoice\".", "The status reads Invoiced."),
 "P-LINE-TECH": ("ACCOUNT-A", "On the work order's \"Lines\" tab add one approved line per technician given (\"grease\" > \"Service - "
                 "Full grease service\", \"Line Approved\" on) and, for each, click the line's name to open Edit Line, choose the "
                 "technician under Technicians and save.", "Tech View's \"Assigned Techs\" cell shows the lead first, then each line technician."),
 "P-ADVISOR": ("ACCOUNT-A", "On the work order page pick any staff member as Service Advisor.", "List's \"Service Advisor\" column shows a name for it."),
 "P-CLOCKIN": ("ACCOUNT-A", "Have the line technician clock in to the line the way technicians clock in at the shop, and leave the "
               "clock running. UNVERIFIED on screen; API route (playbook, technician tasks): POST /api/technician-tasks/check-in with "
               "task_id, line_id, work_order_id and refresh_lines true answers 201. Clock-out is not solved, so the clock stays running.",
               "List's \"Clocked In\" column shows the technician's name for the work order."),
 "P-PIN": ("ACCOUNT-A", "Work Orders > \"All\" > \"Board View\": unpin every technician not listed (click the blue pin on their column "
           "header), then click the grey pin on each listed technician's column header, in the order listed.",
           "Board View shows the listed technicians right after \"Unassigned\", their pins blue, no other pin blue."),
 "P-UNPIN-ALL": ("ACCOUNT-A", "Work Orders > \"All\" > \"Board View\": click every blue pin to unpin it.", "No column header shows a blue pin."),
 "P-FIELDS-LINETECHS": ("ACCOUNT-A", "Work Orders > \"Board View\" > \"Fields to display\": turn \"Line technicians\" on.",
                        "Board View cards show the line technicians' avatars."),
 "P-START": ("ACCOUNT-A", "Bring the page to the case's starting screen: Work Orders > the tab named; in each filter clear any choice "
             "(click the x on the Asset on Site chip if it shows Yes or No), turn \"Assigned to me\" off, set Search as named (or empty), "
             "set density with the density button as named (Regular is the default), and pick the display named.",
             "The page matches the case's starting-screen line exactly."),
 "P-VIEWONLY": ("ACCOUNT-A", "Your initials > \"Settings\" > \"Roles & Permissions\" > \"Create Custom Role\" > Skip > Role Name "
                "\"ZZAUTOTEST C97020 View Only\" > under Work orders tick only View > Create. Then \"Settings\" > \"Staff\" > \"New Staff "
                "Member\" First Name \"ZZAUTOTEST C97020\", Last Name \"Viewer\", with an email inbox you can open, that role, the case "
                "location; finish the invite so ACCOUNT-B can sign in.",
                "ACCOUNT-B signs in a second browser and sees Work Orders without a \"Create Work Order\" button."),
 "P-EMPTY-LOCATION": ("ACCOUNT-A", "UNVERIFIED (no recorded path): find or create a location with no work orders and name it \"ZZAUTOTEST "
                      "Empty Location\" (for example Settings > Locations, if the role allows it). If no such location can be made, ask the "
                      "user for an empty location and record its name; the case then needs that name.",
                      "At that location, Work Orders > \"All\" > List shows no work orders."),
}

T = lambda first, last, photo=False: ("P-TECH", {"first": first, "last": last}, photo)


def R(*items, check):
    return {"items": list(items), "check": check}


RECIPES = {
 "SETUP-ADMIN": R(("P-SIGNIN", {}), ("P-LOCATION", {}), check="ACCOUNT-A is signed in at the case location."),
 "SETUP-VIEWONLY": R(("P-VIEWONLY", {}), check="ACCOUNT-B (role \"ZZAUTOTEST C97020 View Only\") is signed in a second browser."),
}


def std(cid, cust, techs, wos, pins=None, start=None, extra=()):
    items = [("P-TECH", {"first": f, "last": l}) for f, l in techs]
    items.append(("P-CUSTOMER", {"name": cust, "units": [u for u, *_ in wos]}))
    for u, kind, lead in wos:
        items.append((kind, {"unit": u, "customer": cust, "lead": lead}))
    if pins is not None:
        items.append(("P-PIN", {"techs": pins}) if pins else ("P-UNPIN-ALL", {}))
    items += list(extra)
    items.append(("P-START", {"screen": start}))
    RECIPES[f"SETUP-{cid}"] = R(*items, check="Every precondition line of the case is true on screen, read top to bottom.")


Z = "ZZAUTOTEST"
for cid, cust in ((97021, "ZZAUTOTEST C97021 Keyboard"), (368150, "ZZAUTOTEST C368150 Enter")):
    a, b = f"{Z} C{cid} Ana", f"{Z} C{cid} Ben"
    std(cid, cust, [(f"{Z} C{cid}", "Ana"), (f"{Z} C{cid}", "Ben")],
        [(f"C{cid}-U1", "P-WO", a), (f"C{cid}-U2", "P-WO", a), (f"C{cid}-U3", "P-WO", b), (f"C{cid}-U4", "P-WO", None)],
        pins=[a, b], start=f'Board View, All tab, Search "{cust}"')
a, b = f"{Z} C368152 Ana", f"{Z} C368152 Ben"
std(368152, "ZZAUTOTEST C368152 Reassign", [(f"{Z} C368152", "Ana"), (f"{Z} C368152", "Ben")],
    [("C368152-U1", "P-WO", a), ("C368152-U3", "P-WO", b), ("C368152-U4", "P-WO", None)], pins=[a, b],
    start='Board View, All tab, Search "ZZAUTOTEST C368152 Reassign"')
a = f"{Z} C97020 Ana"
std(97020, "ZZAUTOTEST C97020 Limits", [(f"{Z} C97020", "Ana")],
    [("C97020-U1", "P-WO", a), ("C97020-U2", "P-WO-INVOICED", a)], pins=[a],
    extra=[("P-PIN", {"techs": [a], "as": "ACCOUNT-B"})],
    start='Board View, All tab, Search "ZZAUTOTEST C97020 Limits", for ACCOUNT-A and ACCOUNT-B')
a = f"{Z} C96945 Ana"
std(96945, "ZZAUTOTEST C96945 Card Menu", [(f"{Z} C96945", "Ana")], [("C96945-U1", "P-WO", a)], pins=[a],
    start='Board View, All tab, Search "ZZAUTOTEST C96945 Card Menu"')
std(614711, "ZZAUTOTEST C614711 Deleted Lead", [(f"{Z} C614711", "Dana"), (f"{Z} C614711", "Eli")],
    [("C614711-U1", "P-WO", f"{Z} C614711 Dana"), ("C614711-U2", "P-WO", None)],
    start='Settings > Staff page')
names = ["Ana", "Ben", "Cal", "Dee", "Eve", "Fay", "Gus", "Hal"]
wos = [(f"C96916-H{n:02d}", "P-WO", f"{Z} C96916 Hal") for n in range(1, 21)]
for nm in names[:-1]:
    wos += [(f"C96916-{nm[0]}{k}", "P-WO", f"{Z} C96916 {nm}") for k in (1, 2)]
std(96916, "ZZAUTOTEST C96916 Scroll Back", [(f"{Z} C96916", n) for n in names], wos, pins=[],
    start='Board View, Work Orders tab, Status "Approved" only, Search "ZZAUTOTEST C96916 Scroll Back"')
std(368214, "ZZAUTOTEST C368214 Back Forward", [], [("C368214-U1", "P-WO", None)], start="List, Work Orders tab, Search empty")
std(590110, "ZZAUTOTEST C590110 Toolbar Icons", [(f"{Z} C590110", "Ana")], [("C590110-U1", "P-WO", f"{Z} C590110 Ana")],
    start="List, All tab, density Regular, Search empty")
std(590112, "ZZAUTOTEST C590112 Short", [(f"{Z} C590112", "Ana")],
    [("C590112-S1", "P-WO", f"{Z} C590112 Ana"), ("C590112-S2", "P-WO-ESTIMATE", None)],
    extra=[("P-CUSTOMER", {"name": "ZZAUTOTEST C590112 Review", "units": ["C590112-R1"]}),
           ("P-WO-REVIEW", {"unit": "C590112-R1", "customer": "ZZAUTOTEST C590112 Review", "lead": f"{Z} C590112 Ana"})],
    start="Tech View, All tab, density Regular, Search empty")
std(590114, "ZZAUTOTEST C590114 Cell Styles", [(f"{Z} C590114", "Eva"), (f"{Z} C590114", "Finn")],
    [("C590114-U1", "P-WO", f"{Z} C590114 Eva"), ("C590114-U2", "P-WO-INVOICED", f"{Z} C590114 Eva")],
    extra=[("P-PHOTO", {"tech": f"{Z} C590114 Eva"}), ("P-ADVISOR", {"unit": "C590114-U1"}),
           ("P-LINE-TECH", {"unit": "C590114-U1", "techs": [f"{Z} C590114 Finn"], "note": "use the work order's existing approved line"}),
           ("P-CLOCKIN", {"tech": f"{Z} C590114 Finn", "unit": "C590114-U1"})],
    start='Tech View, All tab, density Regular, Search "ZZAUTOTEST C590114 Cell Styles"')
std(590117, "ZZAUTOTEST C590117 Group Header", [(f"{Z} C590117", "Ines"), (f"{Z} C590117", "Jon")],
    [("C590117-U1", "P-WO", f"{Z} C590117 Ines"), ("C590117-U2", "P-WO", f"{Z} C590117 Jon"), ("C590117-U3", "P-WO-ESTIMATE", None)],
    pins=[], extra=[("P-PHOTO", {"tech": f"{Z} C590117 Ines"})],
    start='Tech View, All tab, density Regular, Search "ZZAUTOTEST C590117 Group Header"')
std(590119, "ZZAUTOTEST C590119 Column Header",
    [(f"{Z} C590119", "Lea"), (f"{Z} C590119", "Max"), (f"{Z} C590119", "Nia"), (f"{Z} C590119", "Oli")],
    [("C590119-U1", "P-WO", f"{Z} C590119 Lea"), ("C590119-U2", "P-WO", f"{Z} C590119 Max"), ("C590119-U3", "P-WO-ESTIMATE", None)],
    pins=[], extra=[("P-PHOTO", {"tech": f"{Z} C590119 Lea"})],
    start='Board View, All tab, density Regular, Search "ZZAUTOTEST C590119 Column Header"')
std(590128, "ZZAUTOTEST C590128 Density", [(f"{Z} C590128", "Ana"), (f"{Z} C590128", "Ben")],
    [("C590128-U1", "P-WO", f"{Z} C590128 Ana")],
    extra=[("P-ADVISOR", {"unit": "C590128-U1"}),
           ("P-LINE-TECH", {"unit": "C590128-U1", "techs": [f"{Z} C590128 Ben"], "note": "use the work order's existing approved line"}),
           ("P-FIELDS-LINETECHS", {})],
    start='Tech View, All tab, density Regular, Search "ZZAUTOTEST C590128 Density"')
std(590113, "ZZAUTOTEST C590113 Columns", [(f"{Z} C590113", "Ana")], [("C590113-U1", "P-WO", f"{Z} C590113 Ana")],
    extra=[("NOTE", {"text": "ACCOUNT-A must never have changed Tech View's columns; if it has, use a brand-new Admin user for this case."})],
    start='Tech View, All tab, density Regular, Search "ZZAUTOTEST C590113 Columns"')
RECIPES["SETUP-590122"] = R(("P-TECH", {"first": f"{Z} C590122", "last": "Sam"}),
                            ("NOTE", {"text": "\"ZZAUTOTEST C590122 Sam\" must lead no work orders."}),
                            ("P-START", {"screen": "Tech View, All tab, density Regular, Search empty"}),
                            check="Tech View shows \"ZZAUTOTEST C590122 Sam\"'s group with \"No work orders\".")
std(590127, "ZZAUTOTEST C590127 Technician Filter", [(f"{Z} C590127", "Yan")], [("C590127-U1", "P-WO", f"{Z} C590127 Yan")],
    start="Tech View, All tab, density Regular, Search empty")
std("N1", "ZZAUTOTEST N1 Time Clock Off", [(f"{Z} N1", "Tim")],
    [("N1-U1", "P-WO", f"{Z} N1 Tim"), ("N1-U2", "P-WO", None)],
    extra=[("NOTE", {"text": "Each run needs \"ZZAUTOTEST N1 Tim\" with Time Clock ON at the start: turn it back on after the test "
                              "(Settings > Staff > pencil > Time Clock on) and set N1-U1's lead back to that staff member."})],
    start='Settings > Staff page')
RECIPES["SETUP-N2"] = R(("P-EMPTY-LOCATION", {}), check="At \"ZZAUTOTEST Empty Location\" List shows no work orders.")
std("N3", "ZZAUTOTEST N3 Tooltips", [(f"{Z} N3", "Tia")], [("N3-U1", "P-WO", f"{Z} N3 Tia")],
    start='Tech View, All tab, Search "ZZAUTOTEST N3 Tooltips"')
n4 = [(f"{Z} N4", n) for n in ("Ana", "Ben", "Cal", "Dee", "Eve", "Fay")]
std("N4", "ZZAUTOTEST N4 Name Bubbles", n4, [("N4-U1", "P-WO", f"{Z} N4 Ana")],
    extra=[("P-LINE-TECH", {"unit": "N4-U1", "techs": [f"{Z} N4 {n}" for n in ("Ben", "Cal", "Dee", "Eve", "Fay")],
                            "note": "five approved lines, one technician each"}), ("P-FIELDS-LINETECHS", {})],
    start='Tech View, All tab, Search "ZZAUTOTEST N4 Name Bubbles"')
RECIPES["SETUP-C614711"] = RECIPES.pop("SETUP-614711")
for k in list(RECIPES):
    if k.startswith("SETUP-") and k[6:].isdigit(): RECIPES["SETUP-C" + k[6:]] = RECIPES.pop(k)

RESET = {
 "SETUP-C614711": "Deletes \"ZZAUTOTEST C614711 Dana\": before the next run make a new staff member with the same name (P-TECH) and set "
                  "that staff member as lead of C614711-U1 again (C614711-U1 ends on \"ZZAUTOTEST C614711 Eli\").",
 "SETUP-N1": "Turns Time Clock off and removes the lead: turn Time Clock back on for \"ZZAUTOTEST N1 Tim\" and set that staff member as N1-U1's lead.",
 "SETUP-C368152": "Moves C368152-U1 to Ben and C368152-U3 to Unassigned: set the leads back (U1 Ana, U3 Ben) before the next run.",
 "SETUP-C590117": "Pins and unpins inside the test; ends with no pin.",
 "SETUP-C590119": "Pins and unpins inside the test; ends with no pin.",
}
