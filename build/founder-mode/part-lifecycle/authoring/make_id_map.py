#!/usr/bin/env python3
"""One-off (27 Oct 2026, Phase A): writes ../testrail-id-map.csv, one row per LIVE Parts Lifecycle case that stays (274 = the 281
read-backs of 14 Oct in update-2026-10-14/applied/C<id>-after.json minus the 7 there of the 12 "Retire OR retest" cases the coordinator
deletes). Key = section prefix + two digits, in C-id order within the section (S1-01 ... S13-44, IV-01 ... for SV-10380 section 54274).
The coordinator UPDATES each row's case in place; a key with no case_id is a new case. Refuses to overwrite an existing map unless --force.
Columns: key, case_id, section_id, title (the live title of 14 Oct), link."""
import json, glob, csv, os, sys
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
OUT = f"{P}/testrail-id-map.csv"
RETIRED = {425659, 425758, 425639, 425759, 154761, 425602, 425622, 425629, 425701, 425723, 425755, 425776}
SECMAP = json.load(open(f"{P}/section-map.json")); SECMAP["IV"] = 54274
BYID = {v: k for k, v in SECMAP.items()}
if os.path.exists(OUT) and "--force" not in sys.argv: sys.exit(f"{OUT} exists; pass --force to rewrite it")
rows = []
for f in glob.glob(f"{P}/update-2026-10-14/applied/C*-after.json"):
    a = json.load(open(f))
    if a["id"] in RETIRED: continue
    if a["section_id"] not in BYID: sys.exit(f"C{a['id']} in unknown section {a['section_id']}")
    rows.append((a["section_id"], a["id"], a["title"]))
order = list(SECMAP.values())
rows.sort(key=lambda r: (order.index(r[0]), r[1]))
n = {}
with open(OUT, "w", newline="") as fh:
    w = csv.writer(fh); w.writerow(["key", "case_id", "section_id", "title", "link"])
    for sec, cid, title in rows:
        s = BYID[sec]; n[s] = n.get(s, 0) + 1
        w.writerow([f"{s}-{n[s]:02d}", cid, sec, title, f"https://shopview.testrail.io/index.php?/cases/view/{cid}"])
print("rows", len(rows), n)
