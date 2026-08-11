#!/usr/bin/env python3
"""Re-sync the LOCAL Report Suite case source FROM LIVE, field by field.

Adapted from build/filters/resync-2026-08-11/tools/resync.py (Rule 27).

LIVE IS THE AUTHORITY. This matters more than it sounds: the sibling Filters pass
found ALL 114 of its local bodies stale, and warned that the four counts reconcile
PERFECTLY over stale content — counts cannot detect it, only a field-by-field
comparison can. So this runs before any deliverable is regenerated, never after.

Retired bodies are not touched. Foreign cases (Vladimir Tomovic) are never
imported into our source.
"""
import csv
import glob
import json
import os
import sys

ROOT = "/home/user/Manual-test-Cases/build/report-suite"
SNAP = f"{ROOT}/spec-delta-2026-08-11/snapshots"
DRY = "--apply" not in sys.argv

post = json.load(open(f"{SNAP}/cases-FINAL.json"))
live = {c["id"]: c for c in post if c.get("created_by") == 3}

idmap = {}
for r in csv.DictReader(open(f"{ROOT}/testrail-id-map.csv")):
    cid = (r.get("testrail_case_id") or "").strip()
    if cid:
        idmap[r["internal_id"]] = int(cid.lstrip("C"))

MAP = [("title", "title"), ("preconditions", "custom_preconds"),
       ("steps", "custom_steps"), ("expected", "custom_expected"), ("refs", "refs")]

changed, unmapped = [], []
per_field = {k: 0 for k, _ in MAP}

for path in sorted(glob.glob(f"{ROOT}/cases/*.json")):
    d = json.load(open(path))
    isdict = not isinstance(d, list)
    lst = d.get("cases", d) if isdict else d
    dirty = False
    for c in lst:
        if str(c.get("viu_status", "")).startswith("Retired"):
            continue
        cid = idmap.get(c["id"])
        if cid is None or cid not in live:
            unmapped.append(c["id"])
            continue
        L = live[cid]
        moved = []
        for lk, rk in MAP:
            new = (L.get(rk) or "").replace("\r\n", "\n")
            old = c.get(lk)
            old = "" if old is None else (
                "\n".join(str(x) for x in old) if isinstance(old, list) else str(old))
            if old != new:
                if not DRY:
                    c[lk] = new
                moved.append(lk)
                per_field[lk] += 1
                dirty = True
        for lk, rk in (("testrail_id", "id"), ("section_id", "section_id")):
            nv = L.get(rk)
            if lk == "testrail_id":
                nv = f"C{nv}"
            if c.get(lk) != nv:
                if not DRY:
                    c[lk] = nv
                dirty = True
        if moved:
            changed.append({"internal": c["id"], "cid": cid, "fields": moved})
    if dirty and not DRY:
        json.dump(d, open(path, "w"), indent=2, ensure_ascii=False)
        open(path, "a").write("\n")

print(("DRY RUN" if DRY else "APPLIED") + f": local bodies that differ from live: {len(changed)}")
print("per-field:", per_field)
print("unmapped local active cases:", len(unmapped), unmapped[:20])
json.dump(changed, open(f"{SNAP}/resync-changed.json", "w"), indent=1)
