#!/usr/bin/env python3
"""Regenerate the Phase-2 per-case traceability table with a TRUE before->after,
reading the "before" side from git (commit f6b1595 = end of Phase 1) so that the
report is honest even though phase2_repair_refs.py is idempotent and can be re-run.
"""
import subprocess, json, re, csv, sys, os, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caseio import active, files

BEFORE_REF = "f6b1595"          # end of Phase 1 (the 3 known defects fixed)
ORIG_REF = "30fa315"            # the commit this pass started from
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = "/home/user/Manual-test-Cases"
SPEC = os.path.join(ROOT, "build/filters/spec-current-2026-07-31/Filters-spec-current.md")


def at(ref):
    out = {}
    for f in files():
        rel = os.path.relpath(f, ROOT)
        txt = subprocess.run(["git", "-C", ROOT, "show", "%s:%s" % (ref, rel)],
                             capture_output=True, text=True, check=True).stdout
        for c in json.loads(txt):
            out[c["id"]] = c
    return out


def main():
    valid = set(re.findall(r"\bS\d{1,2}-[RNE]\d{1,2}\b", open(SPEC).read()))
    orig, before = at(ORIG_REF), at(BEFORE_REF)
    idmap = {r["internal_id"]: r["testrail_case_id"]
             for r in csv.DictReader(open(os.path.join(ROOT, "build/filters/testrail-id-map.csv")))}
    rows = []
    for _, c in active():
        o = (orig[c["id"]].get("spec_ref") or "").strip()
        n = (c.get("spec_ref") or "").strip()
        an_o = re.findall(r"\bS\d{1,2}-[A-Z]\d{1,2}\b", o)
        an_n = re.findall(r"\bS\d{1,2}-[A-Z]\d{1,2}\b", n)
        bad = [a for a in an_n if a not in valid]
        # verdict on the ORIGINAL state
        if o.startswith("requirements.md"):
            v = "STALE — cited the V1.0 requirements.md ingest (not a live v1.6 anchor)"
        elif "spec v1.3" in o or "export awaited" in o or "conflict raised" in o:
            v = "STALE — cited spec v1.3 / an unresolved conflict"
        elif "superseded by PO ruling" in o:
            v = "STALE — annotation described a supersession v1.6 has since absorbed"
        elif re.search(r"\bFLT-[A-Z]+-\d+", o):
            v = "DEFECT — internal case id leaked into References"
        elif not an_o and "§" not in o:
            v = ("NO SPEC ANCHOR — honestly stated as absent" if "not in the ratified" in o
                 else "MISSING — no spec anchor and no statement that none exists")
        else:
            v = "PRESENT + VALID in v1.6"
        rows.append({
            "internal_id": c["id"],
            "testrail_case_id": idmap.get(c["id"], ""),
            "testrail_link": "https://shopview.testrail.io/index.php?/cases/view/%s"
                             % idmap.get(c["id"], "").lstrip("C"),
            "area": c["area"],
            "spec_anchors_after": ";".join(an_n) or "(spec section / tech-plan only — see note)",
            "anchors_valid_in_v1_6": "n/a — no numbered anchor exists" if not an_n
                                     else ("YES" if not bad else "NO: " + ",".join(bad)),
            "ticket_ref": "NONE EXISTS — Filters has no Jira epic and no stories (verified; see FILTERS-EPIC-SEARCH.md). Stated honestly, never invented.",
            "verdict_before": v,
            "changed_this_pass": "YES" if n != o else "no",
            "refs_before": o,
            "refs_after": n,
            "len_after": len(n),
        })
    with open(os.path.join(HERE, "traceability-per-case.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader(); w.writerows(rows)
    c = collections.Counter(r["verdict_before"] for r in rows)
    for k, v in c.most_common():
        print("%3d  %s" % (v, k))
    print("changed this pass:", sum(1 for r in rows if r["changed_this_pass"] == "YES"), "/", len(rows))
    print("invalid anchors after:", [r["internal_id"] for r in rows if r["anchors_valid_in_v1_6"].startswith("NO")])
    print("no-anchor cases:", [r["internal_id"] for r in rows if r["spec_anchors_after"].startswith("(")])
    print("max len:", max(r["len_after"] for r in rows))
    json.dump(rows, open(os.path.join(HERE, "traceability-per-case.json"), "w"), indent=1)


if __name__ == "__main__":
    main()
