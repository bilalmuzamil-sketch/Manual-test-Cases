#!/usr/bin/env python3
"""Cross-check every requirement anchor OUR cases cite against the LIVE body of
that case's OWN specification.

Two questions, answered separately because they have different consequences:

  EXISTS?  — an anchor cited by a case but absent from the live spec is a case
             pinned to a requirement that is GONE. That is a hard finding.
  MOVED?   — an anchor whose own text changed between the pinned version and the
             live one means the case may now assert something the requirement no
             longer says. RECORDED for a later Rule-43 coverage re-derivation;
             NOT re-verdicted here (that is not this pass's charter).

Anchors are read from BOTH tester-facing provenance text and `refs`, because a
case can cite one in either place and a check that reads only one is a sample.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from spec_compare import ANCHOR, PAIRS, anchor_texts, flatten, EV  # noqa: E402

SNAP = os.path.join(HERE, "..", "snapshots")


def live_anchor_set(slug, lv):
    return set(anchor_texts(flatten(open(os.path.join(EV, f"{slug}-v{lv}.xml")).read())))


if __name__ == "__main__":
    cases = json.load(open(f"{SNAP}/cases-PRE.json"))
    rm = json.load(open(f"{SNAP}/report-map-PRE.json"))
    reports, s2r = rm["reports"], {int(k): v for k, v in rm["section_to_report"].items()}
    cmp_ = json.load(open(os.path.join(EV, "spec-compare.json")))

    live_sets = {n: live_anchor_set(s, lv) for n, (s, pv, lv) in PAIRS.items()}
    # the report FOLDER names in TestRail differ slightly from the spec names
    fold2spec = {"Sales By Customer Report": "Sales By Customer",
                 "Sales By Representative Report": "Sales By Representative",
                 "Parts Velocity Report": "Parts Velocity",
                 "Technician Utilization": "Technician Utilization",
                 "Work In Progress": "Work In Progress",
                 "Inventory Value": "Inventory Value"}

    missing, touched = {}, {}
    per_report_cited = {}
    for cid, c in sorted(cases.items(), key=lambda x: int(x[0])):
        if c.get("created_by") != 3:
            continue
        folder = reports[str(s2r[c["section_id"]])]
        spec = fold2spec[folder]
        text = (c.get("custom_expected") or "") + " " + (c.get("refs") or "")
        cited = set(ANCHOR.findall(text))
        per_report_cited.setdefault(spec, set()).update(cited)
        gone = sorted(cited - live_sets[spec])
        if gone:
            missing[cid] = {"report": spec, "gone": gone}
        ch = set(cmp_[spec].get("changed", [])) | set(cmp_[spec].get("added", []))
        hit = sorted(cited & ch)
        if hit:
            touched.setdefault(spec, {})[cid] = hit

    print("=== ANCHOR EXISTENCE — cases citing an anchor absent from their live spec")
    print("   cases affected:", len(missing))
    for cid, v in missing.items():
        print(f"   C{cid} [{v['report']}] {v['gone']}")

    print("\n=== ANCHORS CITED per report (ours) vs anchors that MOVED v_pinned -> v_live")
    for spec, (slug, pv, lv) in PAIRS.items():
        ch = set(cmp_[spec].get("changed", []))
        cited = per_report_cited.get(spec, set())
        t = touched.get(spec, {})
        print(f"\n  {spec}: pinned v{pv} live v{lv} | anchors cited by our cases {len(cited)} "
              f"| changed in spec {len(ch)} | of those CITED by us {len(ch & cited)} {sorted(ch & cited)}")
        print(f"     cases citing a changed/added anchor: {len(t)}")
        for cid, a in sorted(t.items(), key=lambda x: int(x[0])):
            print(f"       C{cid} {a}")

    json.dump({"missing": missing, "touched": touched},
              open(os.path.join(EV, "anchor-crosscheck.json"), "w"), indent=1)
    print("\nwrote evidence/anchor-crosscheck.json")
