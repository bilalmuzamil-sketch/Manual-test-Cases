"""Known faults planted by gate_selftest.py (L-19: every check must also FAIL on a planted fault). Each plant adds one bad case, copied
from a good one, or breaks one input; build.py writes nothing while a plant is active."""
import copy, wwlib as L

def _clone(key, newkey):
    c = copy.deepcopy(next(x for x in L.CASES if x["key"] == key)); c["key"] = newkey; c["part_of"] = key; L.CASES.append(c); return c

def plant(name):
    if name == "blocked":    _clone("S1-01", "S1-01c")["pre"].append('If you cannot set up any of the above, mark this test Blocked: "setup not done".')
    elif name == "placeholder": _clone("S1-01", "S1-01c")["pre"][1] = "Have an open work order, {Work-order-1}, that is not invoiced."
    elif name == "forexample": _clone("S1-01", "S1-01c")["pre"][1] = "Have an open work order, work order 1, for example S2-15440."
    elif name == "twoactions": _clone("S1-01", "S1-01c")["steps"][0] = "Click New Line and type a title."
    elif name == "readstep": c = _clone("S1-01", "S1-01c"); c["steps"][1] = "Look at the Description box."
    elif name == "results":  _clone("S1-01", "S1-01c")["res"].pop()
    elif name == "quote":    _clone("S1-01", "S1-01c")["q"].append(("PRD", "S1-R1", "The first field is labeled Title."))
    elif name == "vague":    _clone("S1-01", "S1-01c")["res"][0].append("The window looks right.")
    elif name == "keyref":   _clone("S1-01", "S1-01c")["res"][0].append("As in S1-02, the window opens.")
    elif name == "relevance": _clone("S1-01", "S1-01c")["pre"].insert(1, "Have a canned line, canned line Z, at the test location.")
    elif name == "independence":
        c = _clone("S1-05", "S1-05c"); c["pre"][1] = "Have an open work order, work order 1, with a line, line 1, titled \"Replace tie rod\"."
    elif name == "coverage": L.CASES[:] = [c for c in L.CASES if "S3-E4" not in L.codes_of(c)]
    elif name == "lost":     L.CASES[:] = [c for c in L.CASES if c["key"] != "S1-05"]
    elif name == "notmanual": _clone("S1-01", "S1-01c")["res"][0].append("This part cannot be checked by hand.")
    elif name == "title":    _clone("S1-01", "S1-01c")["title"] = "New Line shows Title and Description; the prompts sit inside the boxes under labels"
    elif name == "jargon":   _clone("S3-01", "S3-01c")["res"][3].append("The cell holds 77 bytes.")
    elif name == "count":
        c = _clone("S3-01", "S3-01c"); c["res"][4] = ["The cell shows 78 (15 + 3 + 14 + 3 + 43 = 78), so nothing is added."]
    elif name == "linetext":
        c = _clone("S3-01", "S3-01c"); c["res"][3][0] = c["res"][3][0].replace("excessive play - Both", "excessive play; Both")
    elif name == "expectfail": _clone("S2-01", "S2-01c")["note"] = ""
    elif name == "poalone":  _clone("S3-19", "S3-19c")["q"] = [x for x in L.CASES[[c["key"] for c in L.CASES].index("S3-19")]["q"] if isinstance(x, tuple)]
    elif name == "words":    L.CASES[:] = [c for c in L.CASES if c["key"] not in ("S1-03", "S1-03b", "S1-05")]
    else: raise SystemExit(f"unknown plant {name}")
