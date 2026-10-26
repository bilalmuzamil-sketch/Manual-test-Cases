#!/usr/bin/env python3
"""Tester read-through, 26 Oct 2026: for every remaining Splitting Sales Representatives case, the expected results from the quotes block
onward ("Exact quotes from the source ..." to the AUTOMATION line) must be byte-identical to the live read-back applied/C<id>-after.json.
Also checked, stronger: everything below the blank paragraph that closes the results (held / known-problem notes included), and the
refs and other non-tester fields. Cases where the read-through added a quote are listed in ADDED_QUOTE (none in this pass).
Draft source: authoring/proposals.json (library) and pattern-format-2026-10-26/DR-PATTERN.json (design-recheck).
python3 check_byte_identity.py   -> exit 0 when every case passes"""
import os, sys, json, csv
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.join(os.path.dirname(os.path.dirname(H)), "splitting-sales-reps")
ADDED_QUOTE = {}   # key -> the quote added (none: no fix needed a new quote)
Q = "<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
prop = json.load(open(f"{P}/authoring/proposals.json")); dr = json.load(open(f"{P}/pattern-format-2026-10-26/DR-PATTERN.json"))
bad, n, tails = [], 0, 0
for r in csv.DictReader(open(f"{P}/testrail-id-map.csv")):
    k, cid = r["key"], r["case_id"]; n += 1
    live = json.load(open(f"{P}/applied/C{cid}-after.json"))
    new = (dr[k] if k.startswith("DR-") else prop[k])["fields"]
    a, b = live["custom_expected"], new["custom_expected"]
    if Q not in a or Q not in b: bad.append(f"{k} C{cid}: no quotes block"); continue
    qa, qb = a[a.index(Q):], b[b.index(Q):]
    if qa != qb and k not in ADDED_QUOTE: bad.append(f"{k} C{cid}: quotes block onward differs")
    if a.split("<p></p>", 1)[1] == b.split("<p></p>", 1)[1]: tails += 1
    for f in ("refs", "template_id", "type_id", "priority_id", "custom_automation_type"):
        if f in new and live.get(f) != new.get(f): bad.append(f"{k} C{cid}: field {f} differs")
print(f"cases checked: {n} | quotes block onward byte-identical: {n - len([x for x in bad if 'quotes' in x])} | everything below the results "
      f"(notes included) byte-identical: {tails} | cases with an added quote: {len(ADDED_QUOTE)}")
for x in bad: print("DIFF", x)
sys.exit(1 if bad else 0)
