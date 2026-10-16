"""The approved case shape (QA lead, 16 Oct 2026, from C97021), applied to the other 20 of the 21 cases.
Tester side: Preconditions say only what must exist in the account (no how-to), records named by {placeholders}; each example on a
second line of its bullet, starting "For example:". Steps and Expected results use the placeholders. Below the Expected results the
case keeps its usual parts: Source paragraph, divergence paragraph(s), Exact quotes (PRD v61), AUTOMATION line. Claude side: the
setup file holds the how-to and maps each placeholder to its value.
Each entry: pre [(state, example or None)], rep {hard-coded text in steps/results: replacement}, ph {placeholder: value for the
setup file}, div [paragraphs], src (full source sentence) or src_fix [(old, new)] applied to the case's old source line."""
ADMIN = ('You are signed in with the "Admin" role at {Location-A}.', "For example: {Location-A} is Staging Heavy Duty - 9919.")
BLK = ('If any record above is missing, mark this test Blocked: "setup not done".', None)
LOC = {"{Location-A}": "the case location (Staging Heavy Duty - 9919 on staging)"}
W = "in a browser window at least 1024 px wide"


def start(view, cust=True, tab="All", extra=""):
    s = f'Starting screen: "Work Orders" > "{tab}" tab, "{view}" shown'
    s += ', the name of {Customer-A} in "Search"' if cust else ', "Search" empty'
    s += ', no filter chosen, "Assigned to me" off'
    if extra: s += ", " + extra
    return (s + ".", None)


def pics(names):
    s = "s" if len(names) > 1 else ""
    return ("The browser window is 1440 px wide with the zoom at 100%, and the design picture" + s + " "
            + " and ".join(f'"{n}"' for n in names) + " attached to this case " + ("are" if s else "is")
            + " open beside it at 100% (actual size). Names, numbers and rank numbers in the pictures are sample data.", None)


def techs2(a, b, extra=""):
    return ('Two technicians are active at {Location-A} with the "Technician" role and Time Clock on: {Technician-A} and '
            "{Technician-B}." + (" " + extra if extra else ""), f"For example: {{Technician-A}} is {a} and {{Technician-B}} is {b}.")


def wo4(cust, n0, z):
    return ("Customer {Customer-A} has four Approved work orders: {Work-order-1} and {Work-order-2} led by {Technician-A}, "
            "{Work-order-3} led by {Technician-B}, and {Work-order-4} with no lead technician.",
            f"For example: {{Customer-A}} is {cust}, and {{Work-order-1}} to {{Work-order-4}} are S10043-{n0} to S10043-{n0 + 3}.")


PINS = ("{Technician-A} and {Technician-B} are pinned in your Board View, and no other technician is pinned.", None)
KEYBOARD_DIV = ("Chris Ward's answer 28 (15 Oct 2026) and PRD version 54 said Tab reaches every row, card and header in on-screen order. "
                "PRD versions 55, 60 and 61 (15 and 16 Oct 2026, Chris Ward rulings on Slavcho Mitrov's questions and the QA triage of "
                "SV-11395, SV-11397, SV-11422 and SV-11421) changed this: each view is one Tab stop that lands on a work order, and the "
                "arrow keys move between cards, rows, headers and columns. This case follows version 61, the latest.")


def u(z, n): return f'unit "{z}-U{n}"'
def unit_map(z, nums):  # unit "Cxxxx-Uk" -> {Work-order-i}
    return {u(z, k): f"{{Work-order-{i}}}" for i, k in enumerate(nums, 1)}
def wo_ph(z, nums): return {f"{{Work-order-{i}}}": f"the work order for unit {z}-U{k}" for i, k in enumerate(nums, 1)}


V2 = {}
Z = "ZZAUTOTEST"
# ------------------------------------------------------------------ keyboard
for cid, cust, n0 in ((368150, f"{Z} C368150 Enter", 17701),):
    z = f"C{cid}"
    V2[cid] = dict(
        pre=[ADMIN, techs2(f"{Z} {z} Ana", f"{Z} {z} Ben"), wo4(cust, n0, z), PINS, start("Board View", extra=W), BLK],
        rep={f'"{Z} {z} Ana"': "{Technician-A}", f'"{Z} {z} Ben"': "{Technician-B}", **unit_map(z, [1, 2, 3, 4])},
        ph={**LOC, "{Technician-A}": f"{Z} {z} Ana", "{Technician-B}": f"{Z} {z} Ben", "{Customer-A}": cust, **wo_ph(z, [1, 2, 3, 4])},
        div=["Until 15 Oct 2026 Story 11 only listed keyboard behaviour the design still had to define, so this case asked the tester to try "
             "keys and write down what each did. Chris Ward answered on 15 Oct 2026 (answer 28): Tab reaches every control, Enter opens, Escape "
             "closes, focus returns to the control that opened a menu or dialog, reassigning by keyboard goes through the ⋯ menu, and there is no "
             "keyboard drag. PRD version 54 rewrites Story 11 into these requirements, and this case now checks them.", KEYBOARD_DIV],
        stories="story SV-10054 (Story 11, Keyboard access and focus)", answers="answer 28")
z = "C368152"
V2[368152] = dict(
    pre=[ADMIN, techs2(f"{Z} {z} Ana", f"{Z} {z} Ben"),
         ("Customer {Customer-A} has three Approved work orders: {Work-order-1} led by {Technician-A}, {Work-order-2} led by {Technician-B}, "
          "and {Work-order-3} with no lead technician. None has a shift on the Schedule.",
          f"For example: {{Customer-A}} is {Z} {z} Reassign, and {{Work-order-1}} to {{Work-order-3}} are S10043-17721 to S10043-17723."),
         PINS, start("Board View", extra=W), BLK],
    rep={f'"{Z} {z} Ana"': "{Technician-A}", f'"{Z} {z} Ben"': "{Technician-B}", '"C368152 Ben"': "the first letters of {Technician-B}'s name",
         **unit_map(z, [1, 3, 4])},
    ph={**LOC, "{Technician-A}": f"{Z} {z} Ana", "{Technician-B}": f"{Z} {z} Ben", "{Customer-A}": f"{Z} {z} Reassign", **wo_ph(z, [1, 3, 4])},
    div=V2[368150]["div"], stories="stories SV-10054 (Story 11, Keyboard access and focus), SV-10047 (Story 4, Reassign or unassign the lead technician)",
    answers="answer 28", extra="Tech plan (revised 24 Sep 2026) Phase 11.")
z = "C97020"
V2[97020] = dict(
    pre=[ADMIN,
         ("A second user {User-B} has the custom role {Role-A}, which allows Work orders: View only, and is signed in in a second browser.",
          f"For example: {{User-B}} is {Z} {z} Viewer and {{Role-A}} is {Z} {z} View Only."),
         ('Technician {Technician-A} is active at {Location-A} with the "Technician" role and is pinned in Board View for both users.',
          f"For example: {{Technician-A}} is {Z} {z} Ana."),
         ("Customer {Customer-A} has two work orders led by {Technician-A}: {Work-order-1}, Approved, and {Work-order-2}, Invoiced. "
          "None has a shift on the Schedule.",
          f"For example: {{Customer-A}} is {Z} {z} Limits, and {{Work-order-1}} and {{Work-order-2}} are S10043-17711 and S10043-17712."),
         start("Board View", extra=W + ", for both users"), BLK],
    rep={'In the second browser (role "ZZAUTOTEST C97020 View Only")': "In the second browser (signed in as {User-B})",
         f'"{Z} {z} Ana"': "{Technician-A}", **unit_map(z, [1, 2])},
    ph={**LOC, "{User-B}": f"{Z} {z} Viewer", "{Role-A}": f"{Z} {z} View Only", "{Technician-A}": f"{Z} {z} Ana",
        "{Customer-A}": f"{Z} {z} Limits", **wo_ph(z, [1, 2])},
    div=V2[368150]["div"], stories="stories SV-10054 (Story 11, Keyboard access and focus), SV-10047 (Story 4, Reassign or unassign the lead technician)",
    answers="answer 28", extra="Tech plan (revised 24 Sep 2026) Phase 11.")
# ------------------------------------------------------------------ Board View behaviour
z = "C96945"
V2[96945] = dict(
    pre=[ADMIN,
         ('Technician {Technician-A} is active at {Location-A} with the "Technician" role and is pinned in your Board View.',
          f"For example: {{Technician-A}} is {Z} {z} Ana."),
         ("Customer {Customer-A} has one Approved work order, {Work-order-1}, led by {Technician-A}.",
          f"For example: {{Customer-A}} is {Z} {z} Card Menu and {{Work-order-1}} is S10043-17731."),
         start("Board View", extra=W), BLK],
    rep={**unit_map(z, [1])},
    ph={**LOC, "{Technician-A}": f"{Z} {z} Ana", "{Customer-A}": f"{Z} {z} Card Menu", **wo_ph(z, [1])},
    div=["Until 16 Oct 2026 this case reached the card by pressing Tab repeatedly. " + KEYBOARD_DIV.replace("Chris Ward's answer 28 (15 Oct 2026) and PRD version 54 said", "PRD version 54 said")],
    stories="story SV-10046 (Story 3, Board View — board by lead technician)",
    extra="Design: Claude Design export of 8 Oct 2026 (Work Orders.dc.html), Board card more-actions menu; on-screen labels only.")
z = "C614711"
V2[614711] = dict(
    pre=[ADMIN,
         ('Two technicians are active at {Location-A} with the "Technician" role: {Technician-A} and {Technician-B}. {Technician-A} was made '
          "for this case only and has no labor on any work order, because this test deletes that staff record.",
          f"For example: {{Technician-A}} is {Z} {z} Dana and {{Technician-B}} is {Z} {z} Eli."),
         ("Customer {Customer-A} has two Approved work orders: {Work-order-1} led by {Technician-A}, and {Work-order-2} with no lead technician.",
          f"For example: {{Customer-A}} is {Z} {z} Deleted Lead, and {{Work-order-1}} and {{Work-order-2}} are S10043-17901 and S10043-17902."),
         ('Starting screen: your initials (top right) > "Settings" > "Staff", ' + W + ".", None), BLK],
    rep={f'"{Z} {z} Dana"': "{Technician-A}", f'"{Z} {z} Eli"': "{Technician-B}", f'"{Z} {z} Deleted Lead"': "the name of {Customer-A}",
         'the staff record of "ZZAUTOTEST C614711 Dana"': "the staff record of {Technician-A}",
         'the cards for units "C614711-U1" and "C614711-U2" show': "the cards for {Work-order-1} and {Work-order-2} show", **unit_map(z, [1, 2])},
    ph={**LOC, "{Technician-A}": f"{Z} {z} Dana", "{Technician-B}": f"{Z} {z} Eli", "{Customer-A}": f"{Z} {z} Deleted Lead", **wo_ph(z, [1, 2])},
    known=['Known problem (SV-11416, open: https://shopview.atlassian.net/browse/SV-11416): today, at step 5, the column reads "Unknown '
           'Technician" with a generic person icon, no inactive marker and a drag grip, and the deleted technician\'s name is not shown.',
           "1. If you see exactly that, mark this test Failed and raise nothing new.",
           "2. If it fails in a different way, that is a new problem: report it.",
           "3. If it passes, the fix has shipped: tell the QA lead."],
    div=["SV-11416 asked the product owner what happens when a lead technician is deleted; the spec covered only a deactivated lead. PRD "
         "version 59 (16 Oct 2026, Chris Ward ruling on Slavcho Mitrov's question on SV-11416) added S3-R20e: such work orders sit under "
         "\"Deleted technician\" with the inactive marker and no grip, take no drops, can be dragged out, and List shows the lead blank. "
         "This case follows version 59 and later (was: no \"Unknown Technician\" column, the header naming the technician as List does)."],
    stories="story SV-10046 (Story 3, Board View — board by lead technician)", extra="Defect SV-11416 (open).")
# ------------------------------------------------------------------ Back
z = "C96916"
V2[96916] = dict(
    pre=[ADMIN,
         ('Eight technicians are active at {Location-A} with the "Technician" role and Time Clock on: {Technician-A}, {Technician-B}, '
          "{Technician-C}, {Technician-D}, {Technician-E}, {Technician-F}, {Technician-G} and {Technician-H}.",
          f"For example: {{Technician-A}} to {{Technician-H}} are {Z} {z} Ana, Ben, Cal, Dee, Eve, Fay, Gus and Hal."),
         ("Customer {Customer-A} has about 20 Approved work orders led by {Technician-H} and 2 led by each of the other seven technicians. "
          "With a search on its name, Board View is wider than the window (you scroll right to reach {Technician-H}'s column), and that "
          "column and the Tech View table are taller than the window.", f"For example: {{Customer-A}} is {Z} {z} Scroll Back."),
         start("Board View", tab="Work Orders", extra='"Status" filter set to "Approved" only, ' + W), BLK],
    rep={f'"{Z} {z} Hal"': "{Technician-H}"},
    ph={**LOC, **{f"{{Technician-{l}}}": f"{Z} {z} {n}" for l, n in zip("ABCDEFGH", ["Ana", "Ben", "Cal", "Dee", "Eve", "Fay", "Gus", "Hal"])},
        "{Customer-A}": f"{Z} {z} Scroll Back"},
    div=["On staging the up-and-down position came back about one row off. Chris Ward answered on 15 Oct 2026 (answer 30) that sideways "
         "comes back exactly and vertically the row or card that was at the top comes back at the top, fully shown, within one row or card; "
         "PRD version 54 says so, and this case follows it.",
         "PRD version 61 (16 Oct 2026, Chris Ward ruling on Slavcho Mitrov's questions on SV-11395, SV-11397, SV-11422 and SV-11421) adds that "
         "Back also restores the filter view (tab) and filters in Tech View and Board View; this case now starts on the Work Orders tab with "
         "Status Approved and steps 5 and 10 check that both come back."],
    stories="story SV-10044 (Story 1, Switch between display options)", answers="answer 30", extra="Review Decisions 853901313 FF-3 / DR-6.")
z = "C368214"
V2[368214] = dict(
    pre=[ADMIN,
         ("Customer {Customer-A} has one Approved work order, {Work-order-1}.",
          f"For example: {{Customer-A}} is {Z} {z} Back Forward and {{Work-order-1}} is S10043-17751."),
         start("List", cust=False, tab="Work Orders", extra=W), BLK],
    rep={f'"{Z} {z} Back Forward"': "the name of {Customer-A}", 'the row for unit "C368214-U1"': "{Work-order-1}'s row", **unit_map(z, [1])},
    ph={**LOC, "{Customer-A}": f"{Z} {z} Back Forward", **wo_ph(z, [1])},
    div=[],
    src=("Regression for epic SV-10043 (PR #3548); developer's regression list, received 8 Oct 2026; QA handoff test plan (generated "
         "2026-10-08), hotspot 3; PRD \"Work Orders — Board View & Tech View Display Options\", Confluence 845185030, version 61 (16 Oct "
         "2026, Chris Ward), S1-R8 and section 1 Business Case where quoted, read 16 Oct 2026. In versions 54 and 61 S1-R8 gained sentences "
         "about Tech View and Board View; its List sentences are unchanged, so the expected results are unchanged. Source-verified 16 October "
         "2026. Last checked against build v26.40.8-7a95011 on 10/8/2026."))
# ------------------------------------------------------------------ Design — how it looks
z = "C590110"
V2[590110] = dict(
    pre=[ADMIN, pics(["DC-01-toolbar-tech-view-light-1440.png", "DC-01-toolbar-board-view-light-1440.png"]),
         ("Customer {Customer-A} has one Approved work order, {Work-order-1}, led by technician {Technician-A}.",
          f"For example: {{Customer-A}} is {Z} {z} Toolbar Icons, {{Work-order-1}} is S10043-17801 and {{Technician-A}} is {Z} {z} Ana."),
         start("List", cust=False, extra='density "Regular"'), BLK],
    rep={}, ph={**LOC, "{Customer-A}": f"{Z} {z} Toolbar Icons", "{Technician-A}": f"{Z} {z} Ana", **wo_ph(z, [1])},
    div_fix=[("PRD version 54 says so, and this case follows it.", "PRD versions 54 to 61 say so, and this case follows them."),
             ("PRD version 54 keeps List", "PRD version 61 still keeps List")],
    div_add=["PRD versions 55 and 58 (S1-R9a, S2-R23; Chris Ward rulings on Slavcho Mitrov's questions and PR notes, 15 Oct 2026) add that "
             "the display switcher's icons and the toolbar icons are the design's slate colour in every view, List included; steps 1, 3, 4 "
             "and 7 check it."],
    stories="stories SV-10044 (Story 1, Switch between display options), SV-10049 (Story 6, Density)", answers="answers 12, 21 and 24", design=True,
    tickets="SV-11319")
z = "C590112"
V2[590112] = dict(
    pre=[ADMIN, (pics(["DC-03-tech-view-regular-light-1440.png", "DC-03-tech-view-regular-light-1536.png"])[0]
                 + " Your screen lets you widen the window to 1536 px.", None),
         ("Customer {Customer-A} has an Approved work order {Work-order-1}, led by technician {Technician-A}, and an Estimate "
          "{Work-order-2} with no lead technician. Customer {Customer-B} has a work order {Work-order-3} in \"Ready For Review\", led by {Technician-A}.",
          f"For example: {{Customer-A}} is {Z} {z} Short, {{Customer-B}} is {Z} {z} Review, {{Technician-A}} is {Z} {z} Ana, and "
          "{Work-order-1} to {Work-order-3} are S10043-17807 to S10043-17809."),
         start("Tech View", cust=False, extra='density "Regular"'), BLK],
    rep={'"ZZAUTOTEST C590112 Short"': "the name of {Customer-A}", '"ZZAUTOTEST C590112 Review"': "the name of {Customer-B}"},
    ph={**LOC, "{Customer-A}": f"{Z} {z} Short", "{Customer-B}": f"{Z} {z} Review", "{Technician-A}": f"{Z} {z} Ana",
        "{Work-order-1}": "the work order for unit C590112-S1", "{Work-order-2}": "the estimate for unit C590112-S2",
        "{Work-order-3}": "the work order for unit C590112-R1"},
    div_fix=[("PRD version 54 says so, and this case follows it.", "PRD version 61 still says so, and this case follows it.")],
    div_add=["PRD version 57 (S2-R22; Chris Ward accepted Slavcho Mitrov's resolution, Slack, 15 Oct 2026) adds that the Status column has "
             "no minimum width and sizes to its widest pill, because the pills keep List's widths; steps 6 and 7 check it."],
    stories="story SV-10045 (Story 2, Tech View)", answers="answer 13", design=True, tickets="SV-11324")
z = "C590114"
V2[590114] = dict(
    pre=[ADMIN, pics(["DC-05-tech-view-rows-regular-light-1440.png"]),
         ('Two technicians are active at {Location-A} with the "Technician" role: {Technician-A}, who has a profile photo, and '
          "{Technician-B}, who has none.", f"For example: {{Technician-A}} is {Z} {z} Eva and {{Technician-B}} is {Z} {z} Finn."),
         ("Customer {Customer-A} has an Approved work order {Work-order-1}, led by {Technician-A}, with a service advisor and one approved "
          "line {Line-1} whose technician is {Technician-B}, who is clocked in to it; and an Invoiced work order {Work-order-2}, led by {Technician-A}.",
          f"For example: {{Customer-A}} is {Z} {z} Cell Styles, {{Work-order-1}} and {{Work-order-2}} are S10043-17812 and "
          "S10043-17813, and {Line-1} is \"Service - Full grease service\"."),
         start("Tech View", extra='density "Regular"'), BLK],
    rep={f'"{Z} {z} Eva"': "{Technician-A}", f'"{Z} {z} Finn"': "{Technician-B}", 'a name bubble reading {Technician-A}': "a name bubble with {Technician-A}'s name",
         **unit_map(z, [1, 2])},
    ph={**LOC, "{Technician-A}": f"{Z} {z} Eva (with a profile photo)", "{Technician-B}": f"{Z} {z} Finn (no photo)",
        "{Customer-A}": f"{Z} {z} Cell Styles", **wo_ph(z, [1, 2]), "{Line-1}": "the approved line of C590114-U1"},
    div_fix=[],
    div_add=["PRD version 55 (S2-R20; Chris Ward ruling on Slavcho Mitrov's questions, 15 Oct 2026) sets the number link to the design "
             "system's link colour #175CD3, which meets accessible contrast; the design file's lighter blue does not, so step 1 expects a "
             "slightly darker blue than the picture. Versions 55 and 60 (S2-R23) also left-align Status, Waiting On Parts and Progress and "
             "open a row avatar's name bubble above it. Clicking the number to open the work order is checked in C96932."],
    stories="stories SV-10045 (Story 2, Tech View), SV-10044 (Story 1, Switch between display options), SV-10050 (Story 7, Line technicians)",
    answers="answer 31", design=True, tickets="SV-11319, SV-11325")
z = "C590117"
V2[590117] = dict(
    pre=[ADMIN, pics(["DC-08-tech-view-group-headers-light-1440.png", "DC-08-tech-view-collapsed-light-1440.png"]),
         ('Two technicians are active at {Location-A} with the "Technician" role: {Technician-A}, who has a profile photo, and '
          "{Technician-B}, who has none. No technician is pinned in your Tech View.",
          f"For example: {{Technician-A}} is {Z} {z} Ines and {{Technician-B}} is {Z} {z} Jon."),
         ("Customer {Customer-A} has Approved work orders {Work-order-1} led by {Technician-A} and {Work-order-2} led by {Technician-B}, "
          "and an Estimate {Work-order-3} with no lead technician.",
          f"For example: {{Customer-A}} is {Z} {z} Group Header, and {{Work-order-1}} to {{Work-order-3}} are S10043-17821 to S10043-17823."),
         start("Tech View", extra='density "Regular"'), BLK],
    rep={f'"{Z} {z} Ines"': "{Technician-A}", f'"{Z} {z} Jon"': "{Technician-B}", "to unpin it.": "to unpin it."},
    ph={**LOC, "{Technician-A}": f"{Z} {z} Ines (with a profile photo)", "{Technician-B}": f"{Z} {z} Jon (no photo)",
        "{Customer-A}": f"{Z} {z} Group Header", **wo_ph(z, [1, 2, 3])},
    div_fix=[("Pinning in Tech View: Ahtasham Amjad asked Chris Ward on 14 Oct 2026 whether to keep the pin the PRD keeps (S2-R11) although the design shows none; no pin look is judged here.",
              "Pinning in Tech View: Ahtasham Amjad asked Chris Ward on 14 Oct 2026 whether to keep the pin the PRD keeps (S2-R11) although the design shows none; PRD version 55 (S2-R11a) keeps it, always shown and styled like Board View's, and steps 2, 6 and 11 now check it."),
             ("and PRD version 54 says so.", "and PRD version 61 still says so.")],
    div_add=["PRD versions 55, 58 and 61 (S2-R23) set no-photo initials to a darker grey than the design file (#4B5565 instead of #697586, "
             "for contrast), header names slate semibold, and header avatars keep the browser's plain name tip."],
    stories="stories SV-10045 (Story 2, Tech View), SV-10044 (Story 1, Switch between display options)", answers="answer 16", design=True,
    tickets="SV-11319, SV-11338")
z = "C590119"
V2[590119] = dict(
    pre=[ADMIN, pics(["DC-10-board-column-headers-light-1440.png", "DC-10-board-pinned-light-1440.png"]),
         ('Four technicians are active at {Location-A} with the "Technician" role: {Technician-A}, who has a profile photo, {Technician-B}, '
          "who has none, {Technician-C} and {Technician-D}. No technician is pinned in your Board View.",
          f"For example: {{Technician-A}} to {{Technician-D}} are {Z} {z} Lea, Max, Nia and Oli."),
         ("Customer {Customer-A} has Approved work orders {Work-order-1} led by {Technician-A} and {Work-order-2} led by {Technician-B}, "
          "and an Estimate {Work-order-3} with no lead technician.",
          f"For example: {{Customer-A}} is {Z} {z} Column Header, and {{Work-order-1}} to {{Work-order-3}} are S10043-17827 to S10043-17829."),
         start("Board View", extra='density "Regular"'), BLK],
    rep={f'"{Z} {z} Lea"': "{Technician-A}", f'"{Z} {z} Max"': "{Technician-B}", f'"{Z} {z} Nia"': "{Technician-C}", f'"{Z} {z} Oli"': "{Technician-D}"},
    ph={**LOC, "{Technician-A}": f"{Z} {z} Lea (with a profile photo)", "{Technician-B}": f"{Z} {z} Max (no photo)",
        "{Technician-C}": f"{Z} {z} Nia", "{Technician-D}": f"{Z} {z} Oli", "{Customer-A}": f"{Z} {z} Column Header", **wo_ph(z, [1, 2, 3])},
    div_fix=[],
    div_add=["PRD versions 55 and 58 (S2-R23) set no-photo initials to a darker grey than the design file (#4B5565 instead of #697586, for "
             "contrast) and header names slate semibold; step 2 checks it."],
    stories="stories SV-10046 (Story 3, Board View), SV-10044 (Story 1, Switch between display options)", design=True, tickets="SV-11319, SV-11338")
z = "C590128"
V2[590128] = dict(
    pre=[ADMIN, pics(["DC-06-tech-view-compact-light-1440.png", "DC-06-tech-view-regular-light-1440.png", "DC-06-tech-view-comfortable-light-1440.png"]),
         ("Customer {Customer-A} has an Approved work order {Work-order-1}, led by technician {Technician-A}, with a service advisor and "
          "line technician {Technician-B} on its approved line. Board View's \"Fields to display\" has \"Line technicians\" on.",
          f"For example: {{Customer-A}} is {Z} {z} Density, {{Work-order-1}} is S10043-17830, {{Technician-A}} is {Z} {z} Ana and "
          f"{{Technician-B}} is {Z} {z} Ben."),
         start("Tech View", extra='density "Regular"'), BLK],
    rep={**unit_map(z, [1])},
    ph={**LOC, "{Customer-A}": f"{Z} {z} Density", "{Technician-A}": f"{Z} {z} Ana", "{Technician-B}": f"{Z} {z} Ben", **wo_ph(z, [1])},
    div_fix=[("PRD version 54 says so, and this case follows it.", "PRD version 61 still says so, and this case follows it.")],
    div_add=["PRD versions 60 and 61 (S2-R23; Chris Ward rulings on the QA triage of SV-11395, SV-11397, SV-11422 and SV-11421, 16 Oct 2026) "
             "add the avatar sizes by density (rows 20, 24 and 32 px; group headers 24, 28 and 36 px; the Service Advisor avatar too), the "
             "Compact progress bar of 48 × 4 px, and Board card avatars that stay 24 px; steps 2, 4, 6, 8 and 10 check them."],
    stories="story SV-10049 (Story 6, Density)", answers="answers 18 and 27", design=True, tickets="SV-11318")
z = "C590113"
V2[590113] = dict(
    pre=[("You are signed in with the \"Admin\" role at {Location-A}, and you have never changed Tech View's columns.",
          "For example: {Location-A} is Staging Heavy Duty - 9919."),
         (pics(["DC-04-tech-view-header-row-1440.png", "DC-04-tech-view-all-columns-1440.png"])[0]
          + " Your screen lets you widen the window to 1536 px.", None),
         ("Customer {Customer-A} has an Approved work order {Work-order-1}, led by technician {Technician-A}.",
          f"For example: {{Customer-A}} is {Z} {z} Columns, {{Work-order-1}} is S10043-17840 and {{Technician-A}} is {Z} {z} Ana."),
         start("Tech View", extra='density "Regular"'), BLK],
    rep={}, ph={**LOC, "{Customer-A}": f"{Z} {z} Columns", "{Technician-A}": f"{Z} {z} Ana", **wo_ph(z, [1])},
    div_fix=[("and PRD version 54 says so.", "and PRD version 61 still says so."),
             ("PRD version 54 keeps them as columns that can be added", "PRD version 61 still keeps them as columns that can be added")],
    div_add=["PRD version 56 (Chris Ward and Slavcho Mitrov, Slack, 15 Oct 2026) took Collapse all / Expand all out of the Out of Scope list "
             "(now S2-R13a, checked in C614712); that Out of Scope quote is dropped here. What this case checks is unchanged."],
    stories="stories SV-10048 (Story 5, Choose what is shown), SV-10050 (Story 7, Line technicians), SV-10045 (Story 2, Tech View)",
    answers="answers 14 and 25", design=True, tickets="SV-11317, SV-11321")
z = "C590122"
V2[590122] = dict(
    pre=[ADMIN, (pics(["DC-18-tech-technician-chosen-light-1440.png", "DC-13-tech-search-empty-light-1440.png"])[0]
                 + " The pictures' words differ from the ones checked here; compare the look and the place only.", None),
         ('Technician {Technician-A} is active at {Location-A} with the "Technician" role and leads no work orders.',
          f"For example: {{Technician-A}} is {Z} {z} Sam."),
         start("Tech View", cust=False, extra='density "Regular"'), BLK],
    rep={f'"{Z} {z} Sam"': "{Technician-A}"}, ph={**LOC, "{Technician-A}": f"{Z} {z} Sam"},
    div_fix=[("PRD version 54 says so, and steps 7 and 8 now check the magnifier.", "PRD version 61 still says so, and steps 5 to 7 check the magnifier.")],
    div_add=["PRD version 58 reworded S1-R9a (the display switcher's slate icons in every view); what this case checks is unchanged."],
    stories="stories SV-10045 (Story 2, Tech View), SV-10046 (Story 3, Board View), SV-10044 (Story 1, Switch between display options)",
    answers="answers 10 and 17", design=True, tickets="SV-11319")
z = "C590127"
V2[590127] = dict(
    pre=[ADMIN, (pics(["DC-18-tech-technician-chip-open-light-1440.png"])[0] + " The picture's Department filter is left out of this release.", None),
         ("Technician {Technician-A} is active at {Location-A} and leads the Approved work order {Work-order-1} of customer {Customer-A}.",
          f"For example: {{Technician-A}} is {Z} {z} Yan, {{Customer-A}} is {Z} {z} Technician Filter and {{Work-order-1}} is S10043-17850."),
         start("Tech View", cust=False, extra='density "Regular"'), BLK],
    rep={f'"{Z} {z} Yan"': "{Technician-A}"}, ph={**LOC, "{Technician-A}": f"{Z} {z} Yan", "{Customer-A}": f"{Z} {z} Technician Filter", **wo_ph(z, [1])},
    known=["Known problem (SV-11326, open: https://shopview.atlassian.net/browse/SV-11326): staging has no Technician filter yet. If you see "
           "no Technician filter, mark this test Blocked and raise nothing new."],
    div_fix=[("and PRD version 54 says so, so step 2 now checks the wrench icon.", "and PRD version 61 still says so, so step 1 checks the wrench icon.")],
    div_add=[], stories="story SV-10044 (Story 1, Switch between display options)", answers="answer 12", design=True, tickets="SV-11326")
# ------------------------------------------------------------------ the 4 new cases
NEW_SRC = {
 "N1-S3R20d": ("stories SV-10046 (Story 3, Board View), SV-10045 (Story 2, Tech View)",
               "S3-R20d was added in version 59 on 16 Oct 2026 (Chris Ward ruling on Slavcho Mitrov's question on SV-11416)."),
 "N2-S1N1c": ("story SV-10044 (Story 1, Switch between display options)",
              "S1-N1c was added in version 55 on 15 Oct 2026 (Chris Ward ruling on Slavcho Mitrov's v54 follow-up questions)."),
 "N3-S2R23-tooltips": ("story SV-10045 (Story 2, Tech View)",
                       "The tooltip sentence of S2-R23 was added in version 55 on 15 Oct 2026 (Chris Ward ruling on Slavcho Mitrov's v54 follow-up questions)."),
 "N4-S2R23-name-bubbles": ("stories SV-10045 (Story 2, Tech View), SV-10046 (Story 3, Board View), SV-10050 (Story 7, Line technicians)",
                           "The name-bubble sentence of S2-R23 was added in versions 60 and 61 on 16 Oct 2026 (Chris Ward rulings on the QA triage of SV-11395, SV-11397, SV-11422 and SV-11421)."),
}
V2["N1-S3R20d"] = dict(
    pre=[ADMIN,
         ('Technician {Technician-A} is active at {Location-A} with the "Technician" role and Time Clock on. It was made for this case only, '
          "because this test turns that Time Clock off.", f"For example: {{Technician-A}} is {Z} N1 Tim."),
         ("Customer {Customer-A} has two Approved work orders: {Work-order-1} led by {Technician-A}, and {Work-order-2} with no lead technician.",
          f"For example: {{Customer-A}} is {Z} N1 Time Clock Off, and {{Work-order-1}} and {{Work-order-2}} are S10043-17911 and S10043-17912."),
         ('Starting screen: your initials (top right) > "Settings" > "Staff", ' + W + ".", None), BLK],
    rep={'"ZZAUTOTEST N1 Tim"': "{Technician-A}", '"ZZAUTOTEST N1 Time Clock Off"': "the name of {Customer-A}",
         'the staff record of "ZZAUTOTEST N1 Tim"': "the staff record of {Technician-A}", 'unit "N1-U1"': "{Work-order-1}", 'unit "N1-U2"': "{Work-order-2}"},
    ph={**LOC, "{Technician-A}": f"{Z} N1 Tim", "{Customer-A}": f"{Z} N1 Time Clock Off", "{Work-order-1}": "the work order for unit N1-U1",
        "{Work-order-2}": "the work order for unit N1-U2"}, div=[])
V2["N2-S1N1c"] = dict(
    pre=[('You are signed in with the "Admin" role and can switch to location {Location-B}, which has no work orders at all: no work orders, '
          "estimates or completed work.", f"For example: {{Location-B}} is {Z} Empty Location."),
         ("Starting screen: any page, " + W + ".", None), BLK],
    rep={'"ZZAUTOTEST Empty Location"': "{Location-B}"}, ph={"{Location-B}": f"{Z} Empty Location (see SETUP-N2)"}, div=[])
V2["N3-S2R23-tooltips"] = dict(
    pre=[ADMIN, ("The browser window is 1440 px wide with the zoom at 100%.", None),
         ("Customer {Customer-A} has an Approved work order {Work-order-1}, led by technician {Technician-A}.",
          f"For example: {{Customer-A}} is {Z} N3 Tooltips, {{Work-order-1}} is S10043-17921 and {{Technician-A}} is {Z} N3 Tia."),
         start("Tech View"), BLK],
    rep={}, ph={**LOC, "{Customer-A}": f"{Z} N3 Tooltips", "{Technician-A}": f"{Z} N3 Tia", "{Work-order-1}": "the work order for unit N3-U1"}, div=[])
V2["N4-S2R23-name-bubbles"] = dict(
    pre=[ADMIN,
         ('Six technicians are active at {Location-A} with the "Technician" role: {Technician-A}, {Technician-B}, {Technician-C}, '
          "{Technician-D}, {Technician-E} and {Technician-F}.", f"For example: {{Technician-A}} to {{Technician-F}} are {Z} N4 Ana, Ben, Cal, Dee, Eve and Fay."),
         ("Customer {Customer-A} has an Approved work order {Work-order-1}, led by {Technician-A}, with five approved lines whose technicians "
          "are {Technician-B} to {Technician-F}, so its avatars end in \"+N\". Board View's \"Fields to display\" has \"Line technicians\" on.",
          f"For example: {{Customer-A}} is {Z} N4 Name Bubbles and {{Work-order-1}} is S10043-17931."),
         start("Tech View", extra=W), BLK],
    rep={'"ZZAUTOTEST N4 Ana"': "{Technician-A}", 'unit "N4-U1"': "{Work-order-1}", 'a name bubble reading {Technician-A}': "a name bubble with {Technician-A}'s name",
         'the browser\'s plain name tip shows "ZZAUTOTEST N4 Ana"': "the browser's plain name tip shows {Technician-A}'s name"},
    ph={**LOC, **{f"{{Technician-{l}}}": f"{Z} N4 {n}" for l, n in zip("ABCDEF", ["Ana", "Ben", "Cal", "Dee", "Eve", "Fay"])},
        "{Customer-A}": f"{Z} N4 Name Bubbles", "{Work-order-1}": "the work order for unit N4-U1"}, div=[])
