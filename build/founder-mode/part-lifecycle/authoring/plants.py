"""Known faults planted by gate_selftest.py (L-19: every check must also FAIL on a planted fault). Each plant adds one bad case,
copied from a good one, or breaks one input; build.py writes nothing while a plant is active."""
import copy, pllib as L
import requirement_map as RM

def _clone(key, newkey):
    c = copy.deepcopy(next(x for x in L.CASES if x["key"] == key)); c["key"] = newkey; c["part_of"] = key; L.CASES.append(c); return c

def plant(name):
    if name == "blocked":    _clone("S1-01", "S1-01c")["pre"].append('If you cannot set up any of the above, mark this test Blocked: "setup not done".')
    elif name == "placeholder": _clone("S1-01", "S1-01c")["pre"][1] = "Have an active part, {Part-A}, at the test location."
    elif name == "forexample": _clone("S1-01", "S1-01c")["pre"][1] = "Have an active part, part A, for example ZZAUTOTEST-1."
    elif name == "twoactions": _clone("S1-01", "S1-01c")["steps"][0] = "Click Parts in the top bar and click Inventory in the left menu."
    elif name == "readstep": c = _clone("S1-01", "S1-01c"); c["steps"][2] = "Look at the tabs."
    elif name == "results":  _clone("S1-01", "S1-01c")["res"].pop()
    elif name == "quote":    _clone("S1-01", "S1-01c")["q"].append(("PRD", "S1-R1", "The Inventory list shows three tabs."))
    elif name == "vague":    _clone("S1-01", "S1-01c")["res"][0].append("The menu looks right.")
    elif name == "keyref":   _clone("S1-01", "S1-01c")["res"][0].append("As in S1-02, the menu shows.")
    elif name == "relevance": _clone("S1-01", "S1-01c")["pre"].insert(1, "Have an active part, part Z, at the test location.")
    elif name == "independence":
        c = _clone("S2-06", "S2-06c"); c["pre"][1] = "Have three active parts, part A, part B and part C."
    elif name == "coverage": L.CASES[:] = [c for c in L.CASES if "S1-E1" not in L.codes_of(c)]
    elif name == "lost":     L.CASES[:] = [c for c in L.CASES if c["key"] != "S1-05"]
    elif name == "notmanual": _clone("S1-01", "S1-01c")["res"][0].append("This part cannot be checked by hand.")
    elif name == "title":    _clone("S1-01", "S1-01c")["title"] = "Inventory opens on the Active tab; the Inactive tab sits beside it on the same line too"
    else: raise SystemExit(f"unknown plant {name}")
