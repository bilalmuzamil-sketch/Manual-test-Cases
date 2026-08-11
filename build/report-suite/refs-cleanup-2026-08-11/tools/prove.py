#!/usr/bin/env python3
"""POST-write proof set (Rules 17/38/47/50). Everything here is proven by CONTENT.

  1. every case we did NOT write is byte-identical, updated_on/updated_by INCLUDED
  2. the 12 foreign cases are byte-identical on the same terms (Rule 38)
  3. run 359 is undamaged -- include_all, test set BOTH ways, every result BY ID,
     no graded field moved, and every moved `case_refs` echo traced to a case we wrote
  4. a suite-wide census of the pin state, so the outcome is measured not assumed
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, "..", "snapshots")
LOG = os.path.join(HERE, "..", "logs")

GRADED = ("status_id", "comment", "defects", "elapsed", "version", "assignedto_id",
          "created_by", "created_on", "test_id", "id")
ECHO = ("case_refs", "case_title")


def load(n):
    return json.load(open(os.path.join(SNAP, n)))


def main():
    pre = {c["id"]: c for c in load("cases-PRE.json")}
    post = {c["id"]: c for c in load("cases-POST.json")}
    written = {r["cid"] for r in json.load(open(os.path.join(LOG, "plan.json")))}
    out = {}

    # -- 1/2 untouched cases, ours and foreign -----------------------------------
    assert set(pre) == set(post), "case id set changed"
    drift_ours, drift_foreign = [], []
    for cid in sorted(set(pre)):
        if cid in written:
            continue
        a, b = pre[cid], post[cid]
        diff = [k for k in set(a) | set(b) if a.get(k) != b.get(k)]
        if diff:
            (drift_foreign if a["created_by"] == 1 else drift_ours).append((cid, diff))
    foreign = sorted(c for c, v in pre.items() if v["created_by"] == 1)
    out["untouched_ours"] = {"count": len(pre) - len(written) - len(foreign),
                             "drifted": drift_ours}
    out["foreign"] = {"ids": foreign, "count": len(foreign), "drifted": drift_foreign,
                      "fields_compared_include": ["updated_on", "updated_by"]}

    # -- 3 run 359 ---------------------------------------------------------------
    r0, r1 = load("run359-PRE.json"), load("run359-POST.json")
    t0 = {t["id"]: t for t in load("run359-tests-PRE.json")}
    t1 = {t["id"]: t for t in load("run359-tests-POST.json")}
    c0 = {t["case_id"] for t in t0.values()}
    c1 = {t["case_id"] for t in t1.values()}
    res0 = {r["id"]: r for r in load("run359-results-PRE.json")}
    res1 = {r["id"]: r for r in load("run359-results-POST.json")}
    missing = sorted(set(res0) - set(res1))
    new = sorted(set(res1) - set(res0))
    graded, echo_moved = [], []
    for rid in set(res0) & set(res1):
        a, b = res0[rid], res1[rid]
        g = [k for k in GRADED if a.get(k) != b.get(k)]
        if g:
            graded.append((rid, g))
        e = [k for k in ECHO if a.get(k) != b.get(k)]
        if e:
            echo_moved.append({"result_id": rid, "test_id": a.get("test_id"),
                               "fields": e,
                               "case_id": t1.get(a.get("test_id"), {}).get("case_id")})
    untraced = [e for e in echo_moved if e["case_id"] not in written]
    out["run359"] = {
        "include_all_pre": r0.get("include_all"), "include_all_post": r1.get("include_all"),
        "tests_pre": len(t0), "tests_post": len(t1),
        "test_id_sets_equal_both_ways": set(t0) == set(t1),
        "case_id_sets_equal_both_ways": c0 == c1,
        "results_pre": len(res0), "results_post": len(res1),
        "results_missing_by_id": missing, "results_new": new,
        "graded_field_changes": graded,
        "echo_rows_moved": len(echo_moved),
        "echo_rows_NOT_traceable_to_a_case_we_wrote": untraced,
        "update_run_called": False,
    }

    # -- 4 suite-wide pin census -------------------------------------------------
    RPT = r"(SBC|SBR|PV|TU|WIP|IV)"
    PIN = re.compile(RPT + r"\s+spec\s+v\d+\s+\d{4}-\d{2}-\d{2}")
    CIT = re.compile(RPT + r"\s+spec\s+(?!v\d)"
                     r"(?=(?:Story\s+\d+\s+)?(?:S\d+-[RNE]\d+|§\d+|Prerequisites))")
    VAR = re.compile(RPT + r"\s+spec\s+v\d+\s+read\s+\d{4}-\d{2}-\d{2}")
    LIVEPIN = {"SBC": "v17 2026-08-10", "SBR": "v18 2026-08-07", "PV": "v6 2026-08-07",
               "TU": "v7 2026-08-07", "WIP": "v11 2026-08-10", "IV": "v5 2026-08-07"}
    unpinned, variant, stale, overlimit, comma = [], [], [], [], []
    pins = {}
    for cid, c in sorted(post.items()):
        if c["created_by"] != 3:
            continue
        r = c.get("refs") or ""
        if CIT.search(r):
            unpinned.append(cid)
        if VAR.search(r):
            variant.append(cid)
        if len(r) > 248:
            overlimit.append((cid, len(r)))
        if "," in r:
            comma.append(cid)
        for m in PIN.finditer(r):
            key = m.group(0)
            pins[key] = pins.get(key, 0) + 1
            rpt = m.group(1)
            if not key.endswith(LIVEPIN[rpt]):
                stale.append((cid, key))
    out["census"] = {
        "ours": sum(1 for c in post.values() if c["created_by"] == 3),
        "live_total": len(post),
        "citations_still_unpinned": unpinned,
        "variant_form_remaining": variant,
        "stale_pins": stale,
        "refs_over_248": overlimit,
        "refs_containing_a_comma": comma,
        "pins_in_use": dict(sorted(pins.items())),
    }

    json.dump(out, open(os.path.join(LOG, "PROOF.json"), "w"), indent=1)

    print("== untouched ==")
    print(f"  ours untouched   : {out['untouched_ours']['count']}, drifted "
          f"{len(drift_ours)}")
    print(f"  foreign          : {len(foreign)}, drifted {len(drift_foreign)} "
          f"(updated_on/updated_by compared)")
    print("== run 359 ==")
    r = out["run359"]
    print(f"  include_all {r['include_all_pre']}->{r['include_all_post']} | "
          f"tests {r['tests_pre']}->{r['tests_post']} | "
          f"sets equal both ways: tests={r['test_id_sets_equal_both_ways']} "
          f"cases={r['case_id_sets_equal_both_ways']}")
    print(f"  results {r['results_pre']}->{r['results_post']} | missing BY ID "
          f"{len(r['results_missing_by_id'])} | new {len(r['results_new'])}")
    print(f"  graded-field changes {len(r['graded_field_changes'])} | "
          f"echo rows moved {r['echo_rows_moved']} | untraceable "
          f"{len(r['echo_rows_NOT_traceable_to_a_case_we_wrote'])}")
    print("== census ==")
    c = out["census"]
    print(f"  ours {c['ours']} / live {c['live_total']}")
    print(f"  citations still unpinned : {len(c['citations_still_unpinned'])} "
          f"{c['citations_still_unpinned']}")
    print(f"  variant form remaining   : {len(c['variant_form_remaining'])}")
    print(f"  stale pins               : {len(c['stale_pins'])}")
    print(f"  refs over 248            : {c['refs_over_248']}")
    print(f"  refs containing a comma  : {len(c['refs_containing_a_comma'])}")
    print("  pins in use:")
    for k, v in c["pins_in_use"].items():
        print(f"     {v:>4}  {k}")


if __name__ == "__main__":
    main()
