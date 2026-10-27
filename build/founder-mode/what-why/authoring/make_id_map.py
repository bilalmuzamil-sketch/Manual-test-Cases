#!/usr/bin/env python3
"""One-off (27 Oct 2026, Phase A): writes ../testrail-id-map.csv, one row per LIVE What/Why case (37 = the read-backs of 13 Oct in
update-2026-10-13/applied/C<id>-after.json, the latest write; none is retired). Key = section prefix + two digits, in C-id order within
the section (S1-01 ... S4-07). The coordinator UPDATES each row's case in place; a key with no case_id is a new case. Refuses to
overwrite an existing map unless --force. Columns: key, case_id, section_id, title (the live title of 13 Oct), link."""
import json, glob, csv, os, sys
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(D)
OUT = f"{P}/testrail-id-map.csv"
SECMAP = json.load(open(f"{P}/section-map.json")); SECMAP.pop("DESIGN", None)
BYID = {v: k for k, v in SECMAP.items()}
if os.path.exists(OUT) and "--force" not in sys.argv: sys.exit(f"{OUT} exists; pass --force to rewrite it")
rows = []
for f in glob.glob(f"{P}/update-2026-10-13/applied/C*-after.json"):
    a = json.load(open(f))
    if a["section_id"] not in BYID: sys.exit(f"C{a['id']} in unknown section {a['section_id']}")
    if a["created_by"] != 3: sys.exit(f"C{a['id']} was created by user {a['created_by']}, not us: ask the QA lead first (Rule 123)")
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
