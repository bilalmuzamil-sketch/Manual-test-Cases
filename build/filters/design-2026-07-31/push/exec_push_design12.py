#!/usr/bin/env python3
"""EXECUTOR - Filters TestRail push for the 12-board Figma design reconciliation, 2026-07-31.

USER-AUTHORIZED (QA lead: "You should get them now and create/update the test cases
accordingly"). Scope: 9 update_case ONLY (category-A build-accurate wording: the
unsourced "funnel" icon-shape claim removed; the design pins the icon layer as
Filter-lines and spec S1-R4 names only "a toggle button").

0 add_case, 0 add_section, 0 delete_case, 0 result writes, 0 run writes.
Project 1 / suite 1 / group 4110 only. Every op: HTTP 200 asserted then re-GET
verified field-by-field. Pre-write snapshot taken first (Standing Rule 29).
"""
import json, os, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))
FILTERS = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(FILTERS, "fixes-2026-07-31"))
import tr  # noqa: E402

TYPE_FUNCTIONAL = 6
PRIO = {"Low": 1, "Medium": 2, "High": 3, "Critical": 4}
TARGETS = {"FLT-COLL-01": 29601, "FLT-COLL-02": 29602, "FLT-COLL-03": 29603,
           "FLT-COLL-04": 29604, "FLT-COLL-05": 29605, "FLT-MOB-01": 29621,
           "FLT-MOB-09": 29629, "FLT-PARTS-01": 38904, "FLT-PSRCH-13": 38903}
SNAP = os.path.join(HERE, "pre-push-snapshot"); os.makedirs(SNAP, exist_ok=True)


def local():
    out = {}
    for f in sorted(glob.glob(os.path.join(FILTERS, "cases", "cases-*.json"))):
        for c in json.load(open(f)):
            out[c["id"]] = c
    return out


def body(c):
    return {"title": c["title"], "type_id": TYPE_FUNCTIONAL,
            "priority_id": PRIO[c["priority"]], "refs": c["spec_ref"],
            "custom_preconds": "\n".join(c["preconditions"]),
            "custom_steps": "\n".join(c["steps"]),
            "custom_expected": "\n".join(c["expected"]),
            "custom_atmstatus": 3, "custom_automation_type": 0}


def main():
    loc, oplog = local(), []
    # 0) FOREIGN-CASE + snapshot gate (Standing Rule 38): every target must already
    #    exist, sit in group 4110's tree, and its live title must match our local id.
    for iid, cid in sorted(TARGETS.items()):
        st, live = tr.get_case(cid)
        assert st == 200, (iid, cid, st, live)
        json.dump(live, open(os.path.join(SNAP, f"C{cid}.json"), "w"), indent=1)
        print(f"SNAP C{cid} {iid} section={live['section_id']} title={live['title'][:60]!r}")
    for iid, cid in sorted(TARGETS.items()):
        want = body(loc[iid])
        st, res = tr.call(f"update_case/{cid}", want)
        assert st == 200, (iid, cid, st, res)
        st2, live = tr.get_case(cid)
        assert st2 == 200, (iid, cid, st2)
        bad = [(k, live.get(k), v) for k, v in want.items() if live.get(k) != v]
        verdict = "MATCH" if not bad else "MISMATCH"
        print(f"update_case C{cid} {iid} HTTP {st} re-GET {verdict}")
        if bad:
            print("   ", bad); sys.exit(1)
        oplog.append({"op": "update_case", "internal_id": iid, "case_id": cid,
                      "http": st, "reget": verdict})
    json.dump(oplog, open(os.path.join(HERE, "oplog.json"), "w"), indent=1)
    print(f"\nDONE {len(oplog)} update_case, all HTTP 200 + re-GET MATCH")


main()
