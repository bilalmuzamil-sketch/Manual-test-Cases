#!/usr/bin/env python3
"""Prove a TestRail -> TMS case sync did not touch any test result in TMS.

QA lead, 2026-11-04: syncs must "not reset the progress/pass/fail etc marking and comments for the results
of those test runs in TMS". Take a snapshot BEFORE the sync and one AFTER, then compare. Read-only.

    python3 tms_results_snapshot.py snap --section 19397 --out /tmp/tms/before.json
    python3 tms_results_snapshot.py snap --section 19397 --out /tmp/tms/after.json
    python3 tms_results_snapshot.py compare /tmp/tms/before.json /tmp/tms/after.json   # exit 1 if anything changed

`--section` is a TestRail folder; its whole subtree's cases (mapped to TMS numbers) are tracked in EVERY TMS
run. Per run item it records status, latest result, assignee and pinned case version; per result: status,
comment, defects and timestamp. Run totals are recorded for every run that holds one of the cases.
"""
import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tms_client import TMS  # noqa: E402
from tms_sync import TestRail, id_map, section_map, tms_subtree  # noqa: E402


def tracked_cases(tms, section):
    """TMS case numbers in the TMS mirror of the TestRail folder `section` (whole subtree)."""
    root = section_map().get(section, section)
    ids = set()
    for sid in tms_subtree(tms, root):
        ids |= {c["id"] for c in tms.get_all("/projects/1/cases", {"section_id": sid})}
    return ids


def snap(section, out):
    tms = TMS()
    cases = tracked_cases(tms, section)
    s = {"section": section, "cases": sorted(cases), "runs": {}, "items": {}}
    for r in tms.get_all("/projects/1/runs"):
        hit = False
        for it in tms.get_all("/runs/%d/items" % r["id"]):
            if it["case_id"] not in cases:
                continue
            hit = True
            rec = {"run": r["id"], "case": it["case_id"], "status": it["current_status"],
                   "latest": it["latest_result"], "assigned_to": it["assigned_to"],
                   "case_version_id": it["case_version_id"], "results": []}
            if it["latest_result"]:
                rec["results"] = [{k: x.get(k) for k in ("id", "status", "comment", "defects", "created_at", "created_by")}
                                  for x in tms.get_all("/run-items/%d/results" % it["id"])]
            s["items"][str(it["id"])] = rec
        if hit:
            s["runs"][str(r["id"])] = {"name": r["name"], "counts": r["counts"], "is_closed": r["is_closed"]}
    json.dump(s, open(out, "w"))
    n = sum(len(v["results"]) for v in s["items"].values())
    print("snapshot %s: %d cases, %d runs, %d run items, %d results" % (out, len(cases), len(s["runs"]), len(s["items"]), n))


def compare(a, b):
    A, B = json.load(open(a)), json.load(open(b))
    bad = []
    for iid, x in A["items"].items():
        y = B["items"].get(iid)
        if y is None:
            bad.append("run item %s (case %s, run %s) disappeared" % (iid, x["case"], x["run"]))
            continue
        for k in ("status", "latest", "assigned_to"):
            if x[k] != y[k]:
                bad.append("run item %s (case %s, run %s): %s %r -> %r" % (iid, x["case"], x["run"], k, x[k], y[k]))
        before = {r["id"]: r for r in x["results"]}
        after = {r["id"]: r for r in y["results"]}
        for rid, r in before.items():
            if rid not in after:
                bad.append("result %s on case %s (run %s) disappeared" % (rid, x["case"], x["run"]))
            elif r != after[rid]:
                bad.append("result %s on case %s (run %s) changed" % (rid, x["case"], x["run"]))
    for rid, r in A["runs"].items():
        if B["runs"].get(rid, {}).get("counts") != r["counts"]:
            bad.append("run %s '%s' totals %s -> %s" % (rid, r["name"], r["counts"], B["runs"].get(rid, {}).get("counts")))
    new_results = sum(len(v["results"]) for v in B["items"].values()) - sum(len(v["results"]) for v in A["items"].values())
    pinned = sum(1 for i, x in A["items"].items() if i in B["items"] and x["case_version_id"] != B["items"][i]["case_version_id"])
    print("compared %d run items: %d problem(s); results added meanwhile: %d; run items now pointing at a newer case version: %d"
          % (len(A["items"]), len(bad), new_results, pinned))
    for x in bad[:50]:
        print("  ", x)
    return 1 if bad else 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    s1 = sub.add_parser("snap")
    s1.add_argument("--section", type=int, required=True)
    s1.add_argument("--out", required=True)
    s2 = sub.add_parser("compare")
    s2.add_argument("a")
    s2.add_argument("b")
    a = ap.parse_args()
    sys.exit(snap(a.section, a.out) if a.cmd == "snap" else compare(a.a, a.b))
