#!/usr/bin/env python3
"""Deliverable checks: the shredding guard, the four counts set-equal BOTH ways,
the id-map, and the import header hash against its five peers.

The shredding guard is not optional. `gen_import.py`'s `joinlines()` has put a
newline between EVERY CHARACTER of preconditions/steps/expected twice in this
workspace — once on Schedule, once on all 473 Report Suite rows — SILENTLY, with
no error and no change in row count. A live re-sync writes these fields as a
STRING, and iterating a string yields one character at a time. So the guard runs
after every regeneration, and it looks at CONTENT, never at row counts.
"""
import csv
import glob
import hashlib
import json
import os
import re
import sys

ROOT = "/home/user/Manual-test-Cases"
RS = f"{ROOT}/build/report-suite"
SNAP = f"{RS}/read-dates-2026-08-11/snapshots"
IMPORT = f"{ROOT}/testrail-import/report-suite-v1-testrail-import.csv"
SHRED = re.compile(r"(?:[^\n]\n[^\n]\n){4}")   # single chars separated by newlines

peers = ["fees-discounts-v1", "simple-flow-v1", "global-search-v2",
         "filters-v1", "schedule-v1"]

if __name__ == "__main__":
    post = json.load(open(f"{SNAP}/cases-POST.json"))
    live_ids = {int(k) for k, v in post.items() if v.get("created_by") == 3}

    # local active
    local = []
    for p in sorted(glob.glob(f"{RS}/cases/*.json")):
        d = json.load(open(p))
        lst = d.get("cases", d) if not isinstance(d, list) else d
        local += [c for c in lst if not str(c.get("viu_status", "")).startswith("Retired")]
    local_ids = {int(str(c["testrail_id"]).lstrip("C")) for c in local}

    idmap = list(csv.DictReader(open(f"{RS}/testrail-id-map.csv")))
    map_ids = {int(r["testrail_case_id"].lstrip("C")) for r in idmap
               if (r.get("testrail_case_id") or "").strip()}
    blanks = [r["internal_id"] for r in idmap if not (r.get("testrail_case_id") or "").strip()]

    rows = list(csv.reader(open(IMPORT)))
    header, data = rows[0], rows[1:]

    print("=" * 66)
    print("FOUR COUNTS")
    print(f"  live (ours)   : {len(live_ids)}")
    print(f"  local active  : {len(local_ids)}")
    print(f"  id-map        : {len(map_ids)}  (blank C-ids: {len(blanks)} {blanks[:10]})")
    print(f"  import rows   : {len(data)}")
    print(f"  live == local     both ways: {live_ids == local_ids}")
    print(f"  live == id-map    both ways: {live_ids == map_ids}")
    print(f"  counts all equal          : {len(live_ids)==len(local_ids)==len(map_ids)==len(data)}")

    print("\nID-MAP refs column")
    hasrefs = sum(1 for r in idmap if (r.get("refs") or "").strip())
    print(f"  columns: {list(idmap[0].keys())}")
    print(f"  rows carrying refs: {hasrefs} of {len(idmap)}")

    print("\nSHREDDING GUARD (content, not counts)")
    bad = [i for i, r in enumerate(data, 2) if any(SHRED.search(c or "") for c in r)]
    print(f"  rows showing the shredding signature: {len(bad)} {bad[:10]}")
    maxnl = max((c.count("\n") for r in data for c in r), default=0)
    print(f"  largest newline count in any single cell: {maxnl}")

    print("\nIMPORT HEADER vs the five peer projects")
    h = hashlib.sha256((",".join(header)).encode()).hexdigest()[:16]
    print(f"  report-suite header sha256[:16] = {h}  cols={len(header)}")
    for p in peers:
        f = f"{ROOT}/testrail-import/{p}-testrail-import.csv"
        if not os.path.exists(f):
            print(f"    {p:<20} MISSING")
            continue
        ph = hashlib.sha256((",".join(next(csv.reader(open(f))))).encode()).hexdigest()[:16]
        print(f"    {p:<20} {ph}  {'IDENTICAL' if ph == h else '*** DIFFERS ***'}")

    print("\nREAD-DATES visible in the regenerated import")
    n = sum(1 for r in data if "read on 11 August 2026" in " ".join(r))
    print(f"  import rows carrying a read-date: {n} of {len(data)}")
