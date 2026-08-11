#!/usr/bin/env python3
"""Re-merge C-ids and the refs column into the Report Suite id-map FROM LIVE.

`gen_import.py` blanks `testrail_case_id` and DROPS the `refs` column on every
rerun — a documented gotcha, not a surprise. Title and refs are taken from LIVE
rather than from the previous file, so the id-map cannot preserve a value the
suite no longer has.
"""
import csv
import io
import json
import subprocess

ROOT = "/home/user/Manual-test-Cases"
RS = f"{ROOT}/build/report-suite"
SNAP = f"{RS}/spec-delta-2026-08-11/snapshots"

post = json.load(open(f"{SNAP}/cases-FINAL.json"))
live = {c["id"]: c for c in post if c.get("created_by") == 3}

prev = subprocess.run(["git", "show", "HEAD:build/report-suite/testrail-id-map.csv"],
                      cwd=ROOT, capture_output=True, text=True).stdout
pmap = {r["internal_id"]: r for r in csv.DictReader(io.StringIO(prev))}

NEW = {c["internal"]: c["cid"] for c in
       json.load(open(f"{RS}/spec-delta-2026-08-11/logs/newcases.json"))}
rows = list(csv.DictReader(open(f"{RS}/testrail-id-map.csv")))
out, missing = [], []
for r in rows:
    iid = r["internal_id"]
    p = pmap.get(iid)
    if not p or not (p.get("testrail_case_id") or "").strip():
        cid = NEW.get(iid)
        if cid is None:
            missing.append(iid)
            continue
    else:
        cid = int(p["testrail_case_id"].lstrip("C"))
    L = live.get(cid)
    if L is None:
        raise SystemExit(f"C{cid} ({iid}) is not live — refusing to write a stale mapping")
    out.append({"internal_id": iid, "testrail_case_id": f"C{cid}",
                "title": L["title"],                 # FROM LIVE
                "section": r["section"],
                "refs": (L.get("refs") or "")})      # FROM LIVE
if missing:
    raise SystemExit(f"no prior mapping for {len(missing)}: {missing[:10]}")

with open(f"{RS}/testrail-id-map.csv", "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=["internal_id", "testrail_case_id", "title",
                                       "section", "refs"])
    w.writeheader()
    w.writerows(out)
print(f"re-merged {len(out)} rows; blanks={sum(1 for o in out if not o['testrail_case_id'])}; "
      f"refs={sum(1 for o in out if o['refs'])}")
