#!/usr/bin/env python3
"""Round 2 (2 Nov 2026): turn the 34 drafts of design-2026-11-02/DESIGN-CASE-PLAN.md (DC-01..DC-32 look cases, DV-01 and DV-02 held
design-version cases) into authoring/cases_design.py (keys D-01..D-34, section "Design — how it looks"), keeping the drafts' wording.
The only changes are the ones a gate, the QA lead's pattern or Rule 137 needs; each is listed in EDITS and printed, and REPORT.md
carries the list. Run: python3 make_cases_design.py   (then build.py)."""
import re, os, json, pprint
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
PLAN = open(f"{P}/design-2026-11-02/DESIGN-CASE-PLAN.md").read()
STORYN = {"SV-11879": 1, "SV-11880": 2, "SV-11881": 3, "SV-11882": 4, "SV-11883": 5, "SV-11884": 6}

blocks = re.split(r"\n## (?=(?:DC|DV)-\d\d · )", PLAN)[1:]
assert len(blocks) == 34, len(blocks)
drafts = []
for b in blocks:
    did = b[:5]
    title = re.search(r"\*\*Title:\*\* (.*)", b).group(1).strip()
    pre = re.findall(r"^- (.*)$", b.split("**Preconditions**")[1].split("**Steps**")[0], re.M)
    steps = re.findall(r"^\d+\. (.*)$", b.split("**Steps**")[1].split("**Expected Result**")[0], re.M)
    exp = b.split("**Expected Result**")[1].split("Exact quotes from the source")[0]
    res = [re.findall(r"^- (.*)$", part, re.M) for part in re.split(r"^Step \d+:\s*$", exp, flags=re.M)[1:]]
    qb = b.split("Exact quotes from the source (for reproducibility)")[1].split("Not yet checked against a build.")[0]
    frm = re.search(r"^From: (.*)$", qb, re.M).group(1)
    stories = sorted({STORYN[s] for s in re.findall(r"SV-118\d\d", frm)})
    quotes = []
    for m in re.finditer(r"^- (.+?): “(.*)”\s*$", qb, re.M):
        quotes.append((m.group(1), m.group(2)))
    rb = b.split("References from Design")[1].split("\nAUTOMATION:")[0]
    lines = rb.strip("\n").split("\n")
    pages, pics, words, notes = None, [], [], []
    i = 0
    while i < len(lines):
        l = lines[i]
        if l.startswith("- Design canvas"): pages = l[2:].strip()
        elif l.startswith("- Pictures to attach:"): pics = [x.strip().rstrip(".") for x in l.split(":", 1)[1].split(",")]
        elif l.startswith("- The design's own words:"):
            while i + 1 < len(lines) and lines[i + 1].startswith("  - "):
                i += 1; words.append(lines[i][4:].strip()[1:-1])
        elif l.startswith("- "): notes.append(l[2:].strip())
        i += 1
    marker = re.search(r"\nAUTOMATION: (.*)", b).group(1).strip()
    drafts.append(dict(id=did, title=title, pre=pre, steps=steps, res=res, quotes=quotes, stories=stories,
                       refs=dict(pages=pages, pictures=pics, words=words, notes=notes), draft_marker=marker))

EDITS = []
def edit(did, what, old, new, field):
    d = next(x for x in drafts if x["id"] == did)
    if field == "title":
        assert d["title"] == old, (did, d["title"]); d["title"] = new
    else:
        lst = d[field]; hit = False
        for k, v in enumerate(lst):
            if isinstance(v, list):
                for j, w in enumerate(v):
                    if old in w: v[j] = w.replace(old, new); hit = True
            elif old in v: lst[k] = v.replace(old, new); hit = True
        assert hit, (did, old)
    EDITS.append(f"{did}: {what}")

# 1) titles with the vague look word "as designed" (L-16; the suite's gate checks titles too)
for did, t in (("DC-10", "Design: Time Clock tooltip on the grayed Technician toggle looks as designed"),
               ("DC-11", "Design: Office User role tooltip on the Technician toggle looks as designed"),
               ("DC-18", "Design: Turn Off Technician warning looks as designed")):
    edit(did, 'title: "looks as designed" -> "matches the picture" (vague look word, L-16)', t, t.replace("looks as designed", "matches the picture"), "title")
# 2) inline "for example" in preconditions (fourteenth amendment: no examples in the preconditions)
for d in drafts:
    for k, p in enumerate(d["pre"]):
        q = p.replace(" (for example a Parts Manager)", ", on a role such as Parts Manager").replace(" (for example Nikola, Olivia and Parth)", "")
        if q != p: d["pre"][k] = q; EDITS.append(f"{d['id']}: precondition example in brackets reworded (no examples in the preconditions)")
# 3) Rule 137: a record the case or its setup changes is new for this test; a record only read is "any"
for did in ("DC-24", "DC-26", "DC-27", "DC-31", "DV-02"):
    edit(did, "staff member C is made new for this test (its setup switches Technician off, Rule 137)",
         "Have staff member C at the test location with Time Clock on and Technician on.",
         "Have a new staff member for this test, staff member C, at the test location, with Time Clock on and Technician on.", "pre")
edit("DC-15", "staff member A is made new for this test (the case saves it, Rule 137)",
     "Have an active staff member with Time Clock on, Technician off and Billable No, staff member A.",
     "Have a new staff member for this test, staff member A, active, with Time Clock on, Technician off and Billable No.", "pre")
for did, old in (("DC-04", "Have an active staff member with Time Clock on, Technician on and Billable No (staff member A)."),
                 ("DC-04", "Have an active staff member with Time Clock on, Technician off and Billable Yes (staff member B)."),
                 ("DC-13", "Have an active staff member with Time Clock on and Technician off, on a role such as Parts Manager, staff member A."),
                 ("DC-14", "Have an active staff member with Time Clock on and Technician off, staff member A."),
                 ("DC-16", "Have an active staff member with Time Clock on, staff member A.")):
    edit(did, "a record only read (or switched without saving) is 'any' (Rule 137 gate)", old, old.replace("Have an active", "Have any active"), "pre")
# 3b) Rule 137 gate: a work order the setup changes is new "for this test"
for d in drafts:
    for k, p in enumerate(d["pre"]):
        if p.startswith("Have a new open service work order at the test location"):
            d["pre"][k] = p.replace("Have a new open service work order at the test location", "Have a new open service work order for this test, at the test location")
            EDITS.append(f"{d['id']}: the new work order is said to be made for this test (Rule 137 gate)")
# 3c) Rule 113: a quote that joined two PRD sentences which are not next to each other is split into two verbatim quotes
import sys; sys.path.insert(0, D); import tt_lib as _L
for d in drafts:
    new_q = []
    for lab, t in d["quotes"]:
        if _L.ws(t) in _L.PRDW or _L.ws(t) in _L.PRD_RAWW: new_q.append((lab, t)); continue
        parts = [x.strip() for x in re.split(r"(?<=[.\u201d\"]) (?=[A-Z])", t) if x.strip()]
        groups, cur = [], ""
        for x in parts:
            cand = (cur + " " + x).strip()
            if _L.ws(cand) in _L.PRDW or _L.ws(cand) in _L.PRD_RAWW: cur = cand
            else: groups.append(cur); cur = x
        groups.append(cur)
        assert all(_L.ws(g) in _L.PRDW or _L.ws(g) in _L.PRD_RAWW for g in groups), (d["id"], groups)
        new_q += [(lab, g) for g in groups]
        EDITS.append(f"{d['id']}: quote {lab} joined PRD sentences that are not next to each other; split into {len(groups)} verbatim quotes (Rule 113)")
    d["quotes"] = new_q
# 4) a result that hides an action becomes its own step (Rule 135)
d = next(x for x in drafts if x["id"] == "DC-24")
d["res"][1].remove("Clicking staff member C's row does not pick it.")
d["steps"].append("Click staff member C's row."); d["res"].append(["Nothing is picked: staff member C cannot be picked and the list stays open."])
EDITS.append("DC-24: the result 'Clicking staff member C's row does not pick it.' became step 3 with its own result (Rule 135)")
d = next(x for x in drafts if x["id"] == "DC-29")
d["res"][1][1] = 'A button reads "Set Up Technicians".'
d["steps"].append('Click "Set Up Technicians".'); d["res"].append(["Settings, Staff opens."])
EDITS.append("DC-29: the result '...clicking it opens Settings, Staff.' became step 3 with its own result (Rule 135)")

# 5) the notes name the merged sheet's question numbers (design worker 1-4 -> 5-8) and the final keys
_REN = [("question 1 for Chris Ward", "question 5 for Chris Ward"), ("question 2 for Chris Ward", "question 6 for Chris Ward"),
        ("question 2; design version DV-02, held", "question 6; design version D-34, held"), ("register TT-D04, question 3", "register TT-D04, question 7")]
for d in drafts:
    for k, n in enumerate(d["refs"]["notes"]):
        for a, b in _REN:
            if a in n: d["refs"]["notes"][k] = n = n.replace(a, b); EDITS.append(f"{d['id']}: note renumbered to the merged question sheet ({b})")
# keys, markers (Rule 69 marker for every look case; PO holds by slug, resolved to the merged sheet's numbers in tt_lib)
HOLD = {"DC-27": "PO:tt-d02", "DC-29": "PO:tt-d04", "DV-01": "PO:tt-d01", "DV-02": "PO:tt-d02"}
out = ['"""Section "Design — how it looks" (Rule 126): the 34 design-case drafts of design-2026-11-02/DESIGN-CASE-PLAN.md (round 1, 2 Nov',
       '2026), generated by make_cases_design.py. Draft id -> key: DC-01..DC-32 -> D-01..D-32, DV-01 -> D-33, DV-02 -> D-34. Wording kept',
       'except the edits make_cases_design.py lists. The look comes from the design pictures (Rule 126.5); the quotes are PRD v17."""',
       "from tt_lib import C", "from design_refs import DREFS", ""]
for n, d in enumerate(drafts, 1):
    key = f"D-{n:02d}"
    marker = HOLD.get(d["id"])
    out.append(f"# {d['id']} (draft marker: {d['draft_marker']})")
    out.append(f"DREFS[{key!r}] = " + pprint.pformat(d["refs"], width=140, sort_dicts=False))
    args = (f"C({key!r}, 'DESIGN', {d['title']!r},\n  " + pprint.pformat(d["pre"], width=140) + ",\n  " + pprint.pformat(d["steps"], width=140)
            + ",\n  " + pprint.pformat(d["res"], width=140) + ",\n  " + pprint.pformat(d["quotes"], width=140)
            + f",\n  stories={d['stories']!r}" + (f", marker={marker!r}" if marker else "") + ")")
    out.append(args); out.append("")
open(f"{D}/cases_design.py", "w").write("\n".join(out))
json.dump(EDITS, open(f"{D}/design_edits.json", "w"), indent=1)
print(len(drafts), "design cases written to cases_design.py;", len(EDITS), "edits:")
for x in EDITS: print(" -", x)
