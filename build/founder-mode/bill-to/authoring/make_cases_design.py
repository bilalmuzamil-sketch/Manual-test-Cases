#!/usr/bin/env python3
"""Round 2 (9 Nov 2026): turns the design worker's 70 drafts (design-2026-11-09/DESIGN-CASE-PLAN.md, DC-01..DC-60 look cases and
DV-01..DV-10 held design-version cases) into cases_design.py (keys D-01..D-70, section DESIGN) and their References from Design into
design_refs_design.json. The drafts' words are kept; the only changes are listed in CHANGES (printed and written into REPORT.md):
  1. "AUTOMATION: READY" -> the Rule 69 marker (no build exists yet; a build check lifts it).
  2. DV markers name their PO question: "the design differs from the PRD, waiting on the PO (question n)" (merged numbering 4-15).
  3. "<customer X>" placeholders -> "[customer X's name]" with the library's note on square brackets (one placeholder style).
  4. Cases held on a design question (HELD_ON below) get the same HOLD marker.
  5. Notes for pictures that differ from their own notes (design question 13, dropped: our sources settle every verdict).
  6. Any further per-case edit made for a gate is in EDITS, applied here, never by hand in cases_design.py.
python3 make_cases_design.py   (then python3 build.py)"""
import re, json, os
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
PLAN = f"{P}/design-2026-11-09/DESIGN-CASE-PLAN.md"
t = open(PLAN).read()
secs = re.split(r"\n## (?=D[CV]-\d\d)", t)[1:]
if len(secs) != 70: raise SystemExit(f"plan has {len(secs)} drafts; expected 70")
# design question n (NEW-QUESTIONS.py) -> merged number on the PO sheet; question 13 dropped (settled by our sources)
QMAP = {1: 4, 2: 5, 3: 6, 4: 7, 5: 8, 6: 9, 7: 10, 8: 11, 9: 12, 10: 13, 11: 14, 12: 15}
DV_Q = {"DV-01": 1, "DV-02": 2, "DV-03": 3, "DV-04": 4, "DV-05": 5, "DV-06": 6, "DV-07": 7, "DV-08": 8, "DV-09": 9, "DV-10": 10}
HELD_ON = {"DC-17": 9, "DC-33": 10, "DC-35": 10}   # their expected results state the place the question asks about
UFSLAB = {"§8 Help (Edit Customer field)": "UFS-15", '§8 Help ("Bill Invoices To" window)': "UFS-14",
          "§8 Pays for (Counter tooltip / window)": "UFS-16", "§8 D8 (Confirm removal)": "UFS-12"}
PICNOTE = {   # design question 13 (dropped): the picture differs from its own note; the case follows the PRD and the note
 "DC-01": "The attached production picture shows no red error toast although its design note mentions one; compare only the window's fields.",
 "DC-14": "One attached production picture is 1600 pixels wide although its note says 1440 x 1300; compare the fields, not the width.",
 "DC-19": "The attached picture shows the payer's name cut at the card's edge although its note gives the full name; the full name is expected (the cut is asked in question 9).",
 "DC-54": "The attached picture still shows \"Pays for\" 1 although its note says it disappears at once; the counter is expected to be gone.",
}
EDITS = {   # key -> [(old, new)] applied to the draft's text (gate fixes only; each is listed in design_changes.json)
 "DC-16": [(", in the same style as the other rows (no border, arrow or button at rest).",
            ", in the same grey label and value sizes as the rows above it (no border, arrow or button at rest).")],
 "DC-22": [(", in the same style as on a work order.", ", with the same grey label above the value as on a work order.")],
 "DC-46": [("2. Tick invoice 1 and invoice 2.\n3. Print the selected invoices as one batch.",
            "2. Tick invoice 1.\n3. Tick invoice 2.\n4. Print the selected invoices as one batch."),
           ("Step 2:\n- Both rows are ticked.\nStep 3:", "Step 2:\n- Invoice 1's row is ticked.\nStep 3:\n- Both rows are ticked.\nStep 4:")],
 "DC-53": [("**Title:** Design: Remove as default Bill To confirmation reads as designed",
            "**Title:** Design: Remove as default Bill To confirmation shows its question and buttons")],
 "DC-58": [("(for example S2-16)", "(for example two work orders whose numbers both begin with the same five characters)")],
 # 14 Nov 2026 (QA lead: "Draft all 87 + 4 questions (Recommended)"): the two held design-version cases get the layout stress names
 # (LAYOUT-STRESS-GAP-SCAN-2026-11-13.md §B3, T06 and T23; lesson L-21). Still held on questions 9 and 10; rewritten top to bottom (Rule 134).
 "DV-06": [("- Give customer A a name longer than 25 characters (for example \"Valders Diesel & Fleet Repair\").\n"
            "- Have an open work order for customer B with customer A picked as its Bill To.\n",
            "- Have a new customer for this test, customer B, the customer the work is for, so each work order bills someone else.\n"
            "- Have a new customer for this test, customer A, with a name longer than 25 characters, with spaces (for example \"Valders Diesel & Fleet Repair\").\n"
            "- Have a new customer for this test, customer C, with a long name with no spaces, at least 50 characters (for example NorthernPlainsHeavyTruckandTrailerRepairServicesWest).\n"
            "- Have a new customer for this test, customer D, with a name that includes each of the characters & \" ' < > (for example A&B \"Fleet\" O'Neil <Parts> & Sons).\n"
            "- If a name field stops before the end of a name, use the longest name it takes.\n"
            "- Have an open work order, work order 1, for customer B with customer A picked as its Bill To.\n"
            "- Have an open work order, work order 2, for customer B with customer C picked as its Bill To.\n"
            "- Have an open work order, work order 3, for customer B with customer D picked as its Bill To.\n"),
           ("1. Open the work order.\n", "1. Open work order 1.\n2. Open work order 2.\n3. Open work order 3.\n"),
           ("(for example \"Valders Diesel & Fleet Re\"), with no \"...\" and no tooltip.\n",
            "(for example \"Valders Diesel & Fleet Re\"), with no \"...\" and no tooltip.\n"
            "Step 2:\n- Bill To shows the start of customer C's name cut at the card's right edge, with no \"...\" and no tooltip.\n"
            "- No part of customer C's name runs past the card into the page beside it.\n"
            "Step 3:\n- Bill To shows customer D's name, cut at the card's right edge if it is longer than the card, with no \"...\".\n"
            "- Every character of customer D's name that shows appears exactly as typed: & \" ' < > are not changed into other characters or codes.\n")],
 "DV-07": [("- Have an asset of customer B with one work order billed to customer A.\n",
            "- Have a new customer for this test, customer B, who owns the asset, so its work orders bill customers other than their own.\n"
            "- Have a new customer for this test, customer A, with a long name with no spaces, at least 50 characters (for example NorthernPlainsHeavyTruckandTrailerRepairServicesWest).\n"
            "- Have a new customer for this test, customer C, with a name that includes each of the characters & \" ' < > (for example A&B \"Fleet\" O'Neil <Parts> & Sons).\n"
            "- If a name field stops before the end of a name, use the longest name it takes.\n"
            "- Have an asset of customer B with one work order billed to customer A and one billed to customer C.\n"),
           ("- The last columns run past the right edge (the Total Price header shows only \"T\") and the table scrolls sideways.\n",
            "- The last columns run past the right edge (the Total Price header shows only \"T\") and the table scrolls sideways.\n"
            "- Customer A's name stays inside its own Bill To cell: no part of it covers the next column or the row under it.\n"
            "- Customer C's name shows exactly as saved in its Bill To cell: the & \" ' < > characters appear as typed, not changed into other characters or codes.\n")],
}
# 14 Nov 2026 (Story 8 named set): page 4 redrawn; these cases still hold, only their pictures (and canvas line) change. Each picture name
# occurs twice in the draft (precondition and "Pictures to attach"); replace_all below handles both.
EDITS_ALL = {'DC-44': [('bt-p4-18-after-modern-pays-for-itself.png', 'bt-p4-14-after-modern-pays-for-itself-2026-11-14.png'), ('bt-p4-17-before-modern-pays-for-itself.png', 'bt-p4-13-before-modern-pays-for-itself-2026-11-14.png'), ('version 1794239066-4906, read 9 Nov 2026: page "4 Service For band on invoices and estimates"', 'version 1794608112-d8a1 (page 4 redrawn), read 14 Nov 2026: page "4 Service For band on invoices and estimates"'), ('No band. Pixel-identical to production (compared).', 'No band. Identical to production (same render, same bytes).')], 'DC-45': [('bt-p4-20-after-legacy-pays-for-itself.png', 'bt-p4-16-after-legacy-pays-for-itself-2026-11-14.png'), ('bt-p4-19-before-legacy-pays-for-itself.png', 'bt-p4-15-before-legacy-pays-for-itself-2026-11-14.png'), ('version 1794239066-4906, read 9 Nov 2026: page "4 Service For band on invoices and estimates"', 'version 1794608112-d8a1 (page 4 redrawn), read 14 Nov 2026: page "4 Service For band on invoices and estimates"'), ('No band. Pixel-identical to production (compared).', 'No band. Identical to production (same render, same bytes).')], 'DV-05': [('bt-p4-04-after-legacy.png', 'bt-p4-04-after-legacy-invoice-2026-11-14.png'), ('bt-p4-02-after-modern.png', 'bt-p4-02-after-modern-invoice-2026-11-14.png'), ('version 1794239066-4906, read 9 Nov 2026: page "4 Service For band on invoices and estimates"', 'version 1794608112-d8a1 (page 4 redrawn), read 14 Nov 2026: page "4 Service For band on invoices and estimates"'), ('The same band, under Bill To and Remit payment to, above the asset table.', 'The same two-line band, under Bill To and Remit payment to, above the asset table.')]}
LIB = "Design canvas \"Bill To design\" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794510417-a68d (its boards and design library are byte-identical to version 1794239066-4906 read 9 Nov 2026), read 13 Nov 2026: design library file ds/shopview/components.css, section TOOLTIP (spec components/Tooltip/preview.html)."
RELEASE = {   # a held design-version case settled without the PO (skill 07 §6.0 check d); QA lead's go-ahead 13 Nov 2026 ("Yes, rewrite and add")
 "DV-08": dict(
   title="Design: Bill To lock tooltip sits beside the Bill To value",
   pre=["Sign in as an Admin at the test location.", "Use a desktop browser window 1440 pixels wide, at 100% zoom.",
        "Have a new work order for this test for customer B billed to customer A that has been invoiced (Invoiced or Paid), so a work order bills a customer other than its own."],
   steps=["Open the work order.", "Hover over the Bill To value."],
   res=[["The work order opens."],
        ["The tooltip appears right next to the Bill To value (above, below, left or right of it), centred on it, with a small arrow pointing at the value and a gap of about 10 pixels.",
         "The tooltip does not start at the browser window's left edge.",
         "The tooltip's dark box is no wider than 326 pixels (less than a quarter of the 1440-pixel window)."]],
   marker=None,
   refs={"pages": LIB, "pictures": [],
         "words": ["The placement class and the arrow class are INVERSES: a tooltip above the trigger carries an arrow on its bottom edge.",
                   "max-width: 326px;",
                   ".sv-tt-pop--top    { bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%) translateY(4px); }",
                   ".sv-tt-pop--bottom { top: calc(100% + 10px); left: 50%; transform: translateX(-50%) translateY(-4px); }",
                   ".sv-tt-pop--right  { left: calc(100% + 10px); top: 50%; transform: translateY(-50%) translateX(-4px); }",
                   ".sv-tt-pop--left   { right: calc(100% + 10px); top: 50%; transform: translateY(-50%) translateX(4px); }"],
         "notes": ["The design library's tooltip rule decides where the tooltip sits. The \"Hover\" pictures on page \"3 When the Bill To is blocked\" draw it at the window's left edge, which breaks that rule, so this case follows the library (BT-D08; PO question 11 withdrawn 12 Nov 2026). The two pictures still attached to this case (bt-p3-03-after-hover.png, bt-p3-07-after-hover.png) show that old place: ignore them for this check."]}),
}
# ---- 14 Nov 2026 (Story 8 named set, QA lead's approval; Rule 134): the PRD page's Story 8 was redone and the design's page 4 redrawn
# (canvas version 1794608112-d8a1). REWRITE replaces a draft's case completely (title, preconditions, steps, results, quotes, marker and
# References from Design); EDITS above only swap picture names where the case itself still holds.
F4 = {f["n"]: f for f in json.load(open(f"{P}/design-2026-11-14/DESIGN-FIGURES-P4-2026-11-14.json"))["list"]}
C14 = ('Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the '
       'other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026')
def P4(ns, words=None, notes=()):
    figs = [F4[n] for n in ns]
    pics = [os.path.basename(f["figure_picture"]) for f in figs]
    page = C14 + ': page "4 Service For band on invoices and estimates", pictures ' + ", ".join(f'"{f["heading"]}" ({f["badge"]}, row "{f["row"]}")' for f in figs) + "."
    if words is None: words = [figs[0]["captions"][0]]
    return pics, {"pages": page, "pictures": pics, "words": words, "notes": list(notes)}
def PIC(pics): return "Open the attached pictures " + ", ".join(pics) + " at 100% zoom beside the screen."
M14 = "AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026"
ADM, W = "Sign in as an Admin at the test location.", "Use a desktop browser window 1440 pixels wide, at 100% zoom."
CB = "Have a new customer for this test, customer B, the customer the work is for, with a street, city, province or state and postal or ZIP code on file."
CA = "Have a new customer for this test, customer A, the payer, so the documents bill a customer other than their own."
MOD, LEG = ("Make sure the organization's document design setting is the modern layout.",
            "Make sure the organization's document design setting is the legacy layout.")
L1 = 'Its first line reads "SERVICE FOR".'
L2 = "Its second line reads customer B's name, then \" · \", then customer B's address, in the same weight as the address (the name is not bold)."
REWRITE = {}
def rw(did, title, pre_extra, ns, steps, res, q, words=None, notes=()):
    pics, refs = P4(ns, words, notes)
    REWRITE[did] = dict(title=title, pre=[ADM, W] + pre_extra + [PIC(pics)], steps=steps, res=res, q=q, marker=None, refs=refs)
WO_INV = ("Have a new work order for this test for customer B, billed to customer A, invoiced, with an asset that has a unit, year, make and "
          "model (for example Unit 854, 2024 International CV515).")
rw("DC-36", "Design: Modern invoice billed to someone else prints the two-line band", [CB, CA, WO_INV, MOD], [2, 1],
   ["Open the work order.", "Click the print icon on the Finance tab."],
   [["The Finance tab shows the invoice."],
    ["Directly under the ADDRESSES box (Bill To | Remit payment to), a full-width band with a light gray fill and a thin gray border prints.", L1, L2,
     "The band shows no unit, year, make or model; they print once, in the asset table below the band.",
     "The Bill To block names customer A."]],
   ["S8-R1", "S8-R4", "S8-R5", "S7-R1"],
   words=['A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda\'s own address.',
          "Unit 854 and 2024 INTERNATIONAL CV515 print once, in the asset table below.",
          "Light gray fill and thin gray border, so it reads in black and white."])
rw("DC-37", "Design: Legacy invoice billed to someone else prints the two-line band", [CB, CA,
   "Have a new work order for this test for customer B, billed to customer A, invoiced.", LEG], [4, 3],
   ["Open the work order.", "Click the print icon on the Finance tab."],
   [["The Finance tab shows the invoice."],
    ["The band sits under Bill To and Remit payment to and above the asset table.", L1, L2, "The Bill To block names customer A."]],
   ["S8-R1", "S8-R6"], words=["The same two-line band, under Bill To and Remit payment to, above the asset table."])
rw("DC-38", "Design: Modern estimate prints the band with the customer's current address", [CB, CA,
   "Have a new work order for this test for customer B, billed to customer A, in Approved, so it has an estimate.", MOD], [6, 5],
   ["Open the work order.", "Click the print icon on the Finance tab."],
   [["The Finance tab shows the estimate."],
    ["The Bill To block names customer A with its address.", 'Under it, the band reads "SERVICE FOR" on its first line.',
     "Its second line reads customer B's name, \" · \" and the address shown on customer B's page today."]],
   ["S8-R1", "S8-R6", "S8-R8"],
   words=['Bill To: "Buda Truck Repair" with its address. Band: "SERVICE FOR", then "A & J Truck & Trailer Repair · 17483 Shane Drive, Patriciashire, Ontario B4Y6L9".',
          "An estimate reads the customer's current address."])
rw("DC-39", "Design: Legacy estimate billed to someone else prints the two-line band", [CB, CA,
   "Have a new work order for this test for customer B, billed to customer A, in Approved, so it has an estimate.", LEG], [8, 7],
   ["Open the work order.", "Click the print icon on the Finance tab."],
   [["The Finance tab shows the estimate."],
    ["The Bill To block names customer A.", "The band sits under the Bill To and Remit payment to row.", L1, L2]],
   ["S8-R6", "S8-R1"], words=["Bill To is Buda; the same band."])
PS_V = ("Have a new part sale for this test for customer B, billed to customer A, open, with a vehicle attached that has a unit, year, make and "
        "model (for example Unit 4417, 2011 Hyundai Santa Fe).")
PS_N = "Have a new part sale for this test for customer B, billed to customer A, open, with no vehicle attached."
VNOTE = ("The design draws the part sale without a vehicle only; its words say the band is the same \"vehicle or not\", so this case "
         "compares the band's lines with that picture.")
for did, title, extra, lay, ns, novehicle in [
        ("DC-40", "Design: Modern part sale with a vehicle prints the same band, with no unit", PS_V, MOD, [10, 9], False),
        ("DC-41", "Design: Legacy part sale with a vehicle prints the same band, with no unit", PS_V, LEG, [12, 11], False),
        ("DC-42", "Design: Modern part sale without a vehicle prints the same two-line band", PS_N, MOD, [10, 9], True),
        ("DC-43", "Design: Legacy part sale without a vehicle prints the same two-line band", PS_N, LEG, [12, 11], True)]:
    rw(did, title, [CB, CA, extra, lay], ns, ["Open the part sale.", "Click the print icon on the Finance tab."],
       [["The Finance tab shows the part sale document."],
        ["The Bill To block names customer A.", "Under the Bill To and Remit payment to row, a full-width band prints.", L1, L2]
        + ([] if novehicle else ["The band shows no unit, year, make or model of the vehicle."])],
       ["S8-R4", "S8-R6"],
       words=['Bill To is 7 Star. Band: "SERVICE FOR", then "4 Star Truck Repair · 6263 Elizabeth Causeway Apt. 973, Raystad, British Columbia V4M 8Y2".',
              "A part sale prints the same band as a work order, vehicle or not."], notes=() if novehicle else (VNOTE,))
rw("DC-46", "Design: Batch invoice prints a band only on invoices billed to someone else", [CB, CA,
   "Have two new invoiced work orders for this test for customer B: invoice 1 billed to customer A, invoice 2 billing customer B itself.", LEG],
   [18, 17], ["Open customer B's Invoices tab.", "Tick invoice 1.", "Tick invoice 2.", "Print the selected invoices as one batch."],
   [["The list opens."], ["Invoice 1's row is ticked."], ["Both rows are ticked."],
    ['Invoice 1\'s page has the band under the Bill To row: "SERVICE FOR", then customer B\'s name, " · " and customer B\'s address.',
     "Invoice 2's page has no band."]],
   ["S8-R6", "S8-N1"],
   words=['Page 1 is S2-17581 with its band. In the full PDF each invoice billed to someone else gets its own band; S2-17513 reads "SERVICE FOR", then "Orchard City Truck & Trailer Repair · 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3". S2-17322 gets none.'])
WHY = [   # Rule 137: a precondition record not named in the steps or results says why it is needed (generic reasons by the bullet's shape)
 (r"billed to customer|picked as its Bill To|billing customer [A-Z] itself|billed to customer [A-Z]", "so a work order bills a customer other than its own"),
 (r"Bill Invoices To in Edit Customer|saved as customer [A-Z]'s Bill Invoices To|billing customer [A-Z] by default", "so one customer is the other's saved payer"),
 (r"no saved Bill Invoices To", "so the customer bills itself"),
 (r"open invoices billed to customer", "so the payer has invoices for other customers' work"),
 (r"no work orders, assets or contacts", "so only the Bill To rule can stop the delete"),
 (r"phone number", "so the payer's block has a phone to print"),
 (r"asset|vehicle", "so the document has a customer, a different payer and a unit to print"),
 (r"Have customer A and customer B\.$", "so the case has a customer and a different payer"),
 (r"Have customer B\.$", "so there is a customer to pick as Bill To"),
 (r"neither on Credit Hold", "so the payer can be put on Credit Hold during the case"),
 (r"with no saved", "so the customer bills itself"),
]
FRESH = re.compile(r"^Have (\(set up by an Admin\) )?(an?|two) ((?:open |invoiced )*)(work orders?|part sales?|asset|open invoices|invoices?)\b")
LABEL = re.compile(r"\b(customer|work order|part sale|invoice|contact|asset|user|location|deposit|role) ([A-Z]|\d)\b")


def fix_pre(pre, later):
    out = []
    for x in pre:
        y = FRESH.sub(lambda m: f"Have {m.group(1) or ''}{'a' if m.group(2) in ('a', 'an') else m.group(2)} new {m.group(3)}{m.group(4)} for this test", x)
        unused = [m.group(0) for m in LABEL.finditer(y) if m.group(0).lower() not in later]
        if unused and " so " not in y:
            why = next((w for rx, w in WHY if re.search(rx, y)), None)
            if why: y = y.rstrip(".") + ", " + why + "."
        out.append(y)
    return out
CHANGES = []


def conv(s):
    return re.sub(r"<customer ([A-Z])>", r"[customer \1's name]", s)


cases, refs = [], {}
for i, s in enumerate(secs, 1):
    did = s[:5]
    for old, new in EDITS.get(did, []):
        if old not in s: raise SystemExit(f"{did}: edit text not found: {old[:60]}")
        s = s.replace(old, new); CHANGES.append(f"{did}: {old[:50]!r} -> {new[:50]!r}")
    for old, new in EDITS_ALL.get(did, []):
        if old not in s: raise SystemExit(f"{did}: edit text not found: {old[:60]}")
        s = s.replace(old, new); CHANGES.append(f"{did}: all {old[:40]!r} -> {new[:40]!r}")
    key = f"D-{i:02d}"
    title = re.search(r"\*\*Title:\*\* (.*)", s).group(1).strip()
    pre = re.findall(r"^- (.*)$", s.split("**Preconditions**")[1].split("**Steps**")[0], re.M)
    steps = re.findall(r"^\d+\. (.*)$", s.split("**Steps**")[1].split("**Expected Result**")[0], re.M)
    exp = s.split("**Expected Result**")[1].split("Exact quotes from the source")[0]
    res, notes = [], []
    for line in exp.strip().split("\n"):
        line = line.rstrip()
        if re.match(r"^Step \d+:", line): res.append([])
        elif line.startswith("- "): res[-1].append(conv(line[2:]))
        elif line.strip(): notes.append(conv(line.strip()))
    qb = s.split("Exact quotes from the source")[1].split("References from Design")[0]
    q = []
    for m in re.finditer(r"^- (.{1,60}?): “(.*)”\s*$", qb, re.M):
        lab, txt = m.group(1), m.group(2)
        q.append(lab if re.match(r"S\d+-[RNE]\d+$", lab) else (lab, txt))
    rb = s.split("References from Design")[1]
    marker_line = rb.strip().split("\n")[-1].strip()
    page = re.search(r"^- (Design canvas .*)$", rb, re.M).group(1)
    pics = [x.strip() for x in re.search(r"^- Pictures to attach: (.*)$", rb, re.M).group(1).rstrip(".").split(",")]
    words = [conv(m.group(1)) for m in re.finditer(r"^\s+- “(.*)”\s*$", rb, re.M)]
    diffs = [m.group(1).strip() for m in re.finditer(r"^- (Difference:.*)$", rb, re.M)]
    if did.startswith("DV"):
        n = QMAP[DV_Q[did]]
        diffs = [re.sub(r"question \d+", f"question {n}", x) for x in diffs]
        marker = f"AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO (question {n})"
    elif did in HELD_ON:
        n = QMAP[HELD_ON[did]]
        marker = f"AUTOMATION: HOLD - the design shows a place the PRD does not settle, waiting on the PO (question {n})"
    else:
        if marker_line != "AUTOMATION: READY": raise SystemExit(f"{did}: unexpected marker {marker_line}")
        marker = None
    if did in PICNOTE: diffs.append(PICNOTE[did])
    note = " ".join(notes)
    if any("<customer" in x for x in [title] + pre + steps + sum(res, [])) or re.search(r"\[customer [A-Z]'s name\]", " ".join(sum(res, []) + steps)):
        note = (note + " " if note else "") + "Words in square brackets stand for the value they name, such as customer A's name exactly as it is saved."
    later = " ".join([conv(x) for x in steps] + sum(res, [])).lower()
    cases.append(dict(key=key, src=did, title=conv(title), pre=fix_pre([conv(x) for x in pre], later), steps=[conv(x) for x in steps], res=res, q=q,
                      marker=marker, note=note))
    refs[key] = {"pages": page, "pictures": pics, "words": words, "notes": diffs}
    if did in ("DC-44", "DC-45"):   # 14 Nov 2026: preconditions changed (redrawn pictures): rewritten cases carry the 11/14 marker
        cases[-1]["marker"] = M14
    if did in REWRITE:
        R = REWRITE[did]; c = cases[-1]
        c.update(title=R["title"], pre=R["pre"], steps=R["steps"], res=R["res"], q=R["q"], marker=M14, note="")
        refs[key] = R["refs"]; CHANGES.append(f"{did}: rewritten for the 14 Nov 2026 Story 8 and page 4 (Rule 134)")
    if did in RELEASE:
        R = RELEASE[did]; c = cases[-1]
        c.update(title=R["title"], pre=R["pre"], steps=R["steps"], res=R["res"], marker=R["marker"], note="")
        refs[key] = R["refs"]; CHANGES.append(f"{did}: released to the design library tooltip rule (question 11 withdrawn; QA lead 13 Nov 2026)")

out = ['"""Design — how it looks (Rule 126): D-01..D-60 from the design worker\'s look drafts DC-01..DC-60, D-61..D-70 from the held',
       'design-version drafts DV-01..DV-10 (Rule 130 item 5). GENERATED by make_cases_design.py from design-2026-11-09/DESIGN-CASE-PLAN.md;',
       'edit the generator (EDITS), never this file. The References from Design blocks are in design_refs_design.json."""',
       "from bt_lib import C", "", 'S = "DESIGN"']
for c in cases:
    out.append(f"# {c['src']}")
    out.append(f"C({c['key']!r}, S, {c['title']!r},\n  {c['pre']!r},\n  {c['steps']!r},\n  {c['res']!r},\n  {c['q']!r}"
               + (f",\n  marker={c['marker']!r}" if c["marker"] else "") + (f",\n  note={c['note']!r}" if c["note"] else "") + ")")
open(f"{D}/cases_design.py", "w").write("\n".join(out) + "\n")
json.dump(refs, open(f"{D}/design_refs_design.json", "w"), indent=1, ensure_ascii=False)
CHANGES = ["all READY markers -> Rule 69 marker (no build yet)", "DV markers name merged questions 4-13",
           f"held on a design question as their results state the asked-about place: {', '.join(f'{k} (question {QMAP[v]})' for k, v in HELD_ON.items())}",
           "<customer X> -> [customer X's name] plus the square-bracket note",
           f"picture-vs-note notes added (dropped question 13): {', '.join(PICNOTE)}",
           "Rule 137: 'Have a/an ...' records made 'new ... for this test'; a precondition record not named in the steps or results gets its reason (', so ...')"] + CHANGES
json.dump({"map": {c["src"]: c["key"] for c in cases}, "changes": CHANGES}, open(f"{D}/design_changes.json", "w"), indent=1, ensure_ascii=False)
print("cases_design.py", len(cases), "| changes:", *CHANGES, sep="\n  ")
