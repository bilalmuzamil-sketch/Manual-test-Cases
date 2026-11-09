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
}
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
