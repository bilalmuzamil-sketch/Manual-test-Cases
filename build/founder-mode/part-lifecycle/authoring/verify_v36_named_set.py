#!/usr/bin/env python3
"""4 Nov 2026 named-set check (PRD v36; QA lead "Named set" + "Yes, held" for SV-12010). python3 verify_v36_named_set.py  (exit 1 on any failure)

1. The set is exactly the brief's nine keys (S6-02, S11-02, S11-18, S11-21, S12-06, S12-02, S13-18c, S13-22, S13-22b) plus the new keys, and
   every one of them is on prd=36; no other case is on 36.
2. Every PRD quote in a prd=36 case is word for word in PRD v36 (raw page text above the Change Log, or a feedback-table row), checked with
   its own normaliser, independent of pllib's parser; every SV-12010 quote is word for word in the saved ticket text; answer 13-27 quotes in
   the saved answers file.
3. From lines: prd=36 cases read "version 36 (3 Nov 2026, Chris Ward), read 4 Nov 2026"; prd=35 and prd=33 cases keep their own lines.
   A NEW case stays on v36 after apply.py maps it (the Technician Toggle bug of 4 Nov 2026): every new key is rendered again with a
   pretend row in the id map and must render identically.
4. Against the latest TestRail read-back of every mapped case (../applied-2026-10-27/C<id>-after.json; the live case is fetched where no
   read-back exists), with apply.py's comparison: every mapped case outside the set renders exactly like it; every mapped set case differs.
5. The SV-12010 cases are held (marker other than the standard one) with the exact marker the brief names."""
import sys, os, re, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pllib as L, build_mods  # noqa: F401  (imports every case module)

SET = ["S6-02", "S11-02", "S11-18", "S11-21", "S12-06", "S12-02", "S13-18c", "S13-22", "S13-22b"]
HELD_MARK = "AUTOMATION: HOLD - SV-12010 is not built yet (Board Backlog, 4 Nov 2026); release when it ships"
def norm(s): return re.sub(r"\s+", " ", s.replace("\\", "").replace("**", "").replace("*", "").replace("`", "")).strip()
raw = open(L.PRD_FILES[36]).read(); body = raw.split("## 9. Change Log")[0]
RAWN = norm(body)
TABLE = norm(" ".join(" | ".join(c.strip() for c in l.strip().strip("|").split("|")) for l in body.split("\n") if l.startswith("|")))
ANS = norm(re.sub(r"<!--.*?-->", "", open(L.PO27_FILE).read(), flags=re.S))
TKT = norm(re.sub(r"<!--.*?-->", "", open(L.J12010_FILE).read(), flags=re.S))
MAP = L.id_map(); BY = {c["key"]: c for c in L.CASES}
bad = 0
def fail(*a):
    global bad; bad += 1; print("FAIL", *a)
v36 = [c for c in L.CASES if c["prd"] == 36]
new = [c["key"] for c in L.CASES if c["key"] not in MAP]
# 1. membership
for k in SET:
    if k not in BY: fail("set key missing", k)
    elif BY[k]["prd"] != 36: fail("set key not on v36", k)
    elif k not in MAP: fail("set key is not a mapped case", k)
for k in new:
    if BY[k]["prd"] != 36: fail("new key not on v36", k)
extra = [c["key"] for c in v36 if c["key"] not in SET and c["key"] not in new]
if extra: fail("on v36 but neither in the set nor new:", extra)
# 2. quotes
n_prd = n_tkt = n_po = 0
for c in v36:
    for doc, label, text in L.quotes(c):
        t = norm(text)
        if doc == "PRD":
            n_prd += 1
            if t not in RAWN and t not in TABLE: fail("NOT IN v36", c["key"], label, text[:90])
        elif doc == "J12010":
            n_tkt += 1
            if t not in TKT: fail("NOT IN SV-12010", c["key"], label, text[:90])
        elif doc == "PO27":
            n_po += 1
            if t not in ANS: fail("NOT IN ANSWERS 13-27", c["key"], label, text[:90])
        elif not L.DOCS[doc][1](text): fail("NOT VERBATIM", c["key"], doc, label)
# 3. From lines, and new cases stay on v36 once mapped
WANT = {36: "version 36 (3 Nov 2026, Chris Ward), read 4 Nov 2026", 35: "version 35 (edited 27 Oct 2026 by Chris Ward), read 28 Oct 2026",
        33: "version 33 (23 Oct 2026, owner Chris Ward), read 27 Oct 2026"}
for c in L.CASES:
    ex = L.render(c)["custom_expected"]
    if WANT[c["prd"]] not in ex: fail("FROM LINE", c["key"], "does not read", WANT[c["prd"]])
    for v, w in WANT.items():
        if v != c["prd"] and w in ex: fail("FROM LINE", c["key"], "also reads", w)
    if any(d == "J12010" for d, _, _ in L.quotes(c)) and "SV-12010" not in ex.split("References from Design")[0]: fail("no SV-12010 From line", c["key"])
before = {k: L.render(BY[k]) for k in new}
_orig = L.id_map
L.id_map = lambda: dict(_orig(), **{k: {"key": k, "case_id": str(990000 + i), "section_id": "0"} for i, k in enumerate(new)})
after = {k: L.render(BY[k]) for k in new}
L.id_map = _orig
for k in new:
    if before[k] != after[k] or WANT[36] not in after[k]["custom_expected"]: fail("new case changes or leaves v36 once mapped", k)
# 4. read-backs
def diff(a, f): return [x for x, y in f.items() if ((a.get(x) or "").replace(" ", "") != y.replace(" ", "") if x == "refs" else a.get(x) != y)]
changed, live_fetched = [], []
api = None
for c in L.CASES:
    r = MAP.get(c["key"])
    if not r: continue
    fb = f"{L.P}/applied-2026-10-27/C{r['case_id']}-after.json"
    if os.path.exists(fb): a = json.load(open(fb))
    else:
        if api is None:
            sys.path.insert(0, f"{L.P}/../../dashboards/currency-2026-10-14/apply"); from trlib import api  # noqa: E402 (read only)
        a = api(f"get_case/{r['case_id']}"); live_fetched.append(c["key"])
    if diff(a, L.render(c)): changed.append(c["key"])
outside = [k for k in changed if k not in SET]
same_set = [k for k in SET if k not in changed]
if outside: fail("mapped cases outside the set that differ from their read-back:", outside)
if same_set: fail("set cases identical to their read-back:", same_set)
# 5. held
for k in ("S9-50", "S9-51"):
    if k not in BY or BY[k]["marker"] != HELD_MARK or BY[k]["marker"] == L.MARKER: fail("SV-12010 case not held with the brief's marker", k)
held = sorted(c["key"] for c in L.CASES if c["marker"] != L.MARKER)
print(f"cases {len(L.CASES)} | on PRD v36 {len(v36)} (set {len(SET)}, new {len(new)}: {new})")
print(f"quotes checked: PRD v36 {n_prd} | SV-12010 {n_tkt} | answers 13-27 {n_po}")
print(f"mapped cases {len(MAP)} | differing from their latest read-back {len(changed)}: {changed} | outside the set {len(outside)}")
print(f"read-backs missing (live case fetched instead): {len(live_fetched)} {live_fetched}")
print(f"held cases: {held}")
print("named-set check problems:", bad); sys.exit(1 if bad else 0)
