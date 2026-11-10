#!/usr/bin/env python3
"""Add links to TestRail case pictures into TMS cases (TMS has no case attachments).

QA lead, 2026-11-10: "add the screenshots/pictures to all the test cases in founder mode who do not have a result recorded
against them." TMS strips embedded pictures and has no case attachments (TMS-FACTS §21), so each TestRail attachment is
added as a LINK, in a block appended to the TMS case's preconditions:
    <p><strong>Attached pictures (stored in TestRail — sign in to TestRail to open them)</strong></p><ul><li><a …>name</a></li></ul>
The expected result is never touched (Rule 113). tms_sync.py ignores and preserves this block (PICTURES_HEAD).

Safety: a case with ANY result recorded in ANY TMS run is skipped; a case that already has the block is skipped; run
totals and every recorded result are photographed before and after and must be identical (exit 1 otherwise).

    python3 tms_picture_links.py --section 20434            # dry run: what would change
    python3 tms_picture_links.py --section 20434 --apply
"""
import argparse
import collections
import html
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tms_client import TMS  # noqa: E402
from tms_sync import PICTURES_HEAD, TestRail, id_map  # noqa: E402

LINK = "https://shopview.testrail.io/index.php?/attachments/get/%s"


def results_photo(tms):
    """Run totals + every run item that has a result: {item: (run, case, status, latest)}."""
    runs, items = {}, {}
    for r in tms.get_all("/projects/1/runs"):
        runs[r["id"]] = r["counts"]
        for it in tms.get_all("/runs/%d/items" % r["id"]):
            if it.get("latest_result"):
                items[it["id"]] = (r["id"], it["case_id"], it["current_status"], json.dumps(it["latest_result"], sort_keys=True))
    return runs, items


def block_for(atts):
    seen = collections.OrderedDict()
    for a in atts:
        seen.setdefault(a["id"], a["name"])
    return ("<p><strong>Attached pictures (stored in TestRail — sign in to TestRail to open them)</strong></p><ul>"
            + "".join('<li><a href="%s" target="_blank">%s</a></li>' % (LINK % i, html.escape(n)) for i, n in seen.items())
            + "</ul>"), len(seen)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--section", type=int, required=True)
    ap.add_argument("--apply", action="store_true")
    a = ap.parse_args()
    tr, tms, cmap = TestRail(), TMS(), id_map()
    tms.log_path = "/tmp/tms/picture-links-ops.jsonl"
    runs0, items0 = results_photo(tms)
    with_results = {v[1] for v in items0.values()}
    sub, _ = tr.subtree(a.section)
    plan, skipped = [], collections.Counter()
    for sid in sub:
        for c in tr.paged("get_cases/1&suite_id=1&section_id=%d" % sid, "cases"):
            atts = tr.get("get_attachments_for_case/%d" % c["id"])
            atts = atts.get("attachments", atts) if isinstance(atts, dict) else atts
            if not atts:
                continue
            tid = cmap.get(c["id"], c["id"])
            if tid in with_results:
                skipped["has a result in a TMS run"] += 1
                continue
            plan.append((c["id"], tid, atts))
    todo = []
    for cid, tid, atts in plan:
        code, d = tms.call("GET", "/cases/%d" % tid)
        if code != 200:
            skipped["not in TMS"] += 1
            continue
        cur = (d or {}).get("data", d)
        if PICTURES_HEAD in (cur.get("preconditions") or ""):
            skipped["already has the pictures list"] += 1
            continue
        todo.append((cid, tid, atts, cur))
    print("cases with TestRail pictures: %d | to update: %d | skipped: %s"
          % (len(plan) + skipped["has a result in a TMS run"], len(todo), dict(skipped)))
    json.dump([[c, t] for c, t, _, _ in todo], open("/tmp/tms/picture-links-plan.json", "w"))
    if not a.apply:
        return 0
    done, bad = 0, []
    for cid, tid, atts, cur in todo:
        block, n = block_for(atts)
        code, _ = tms.update_case(tid, {"preconditions": (cur.get("preconditions") or "") + block})
        g = tms.case(tid)
        g = g.get("data", g)
        ok = code == 200 and (g.get("preconditions") or "").count("attachments/get/") >= n and g.get("expected") == cur.get("expected")
        tms.log("add_picture_links", tid, code, "OK" if ok else "MISMATCH")
        done += ok
        if not ok:
            bad.append(cid)
    runs1, items1 = results_photo(tms)
    same_runs = {k: v for k, v in runs1.items() if k in runs0} == runs0
    same_items = items1 == items0
    print("updated %d/%d | problems: %s" % (done, len(todo), bad[:20] or "none"))
    print("run totals unchanged: %s | every recorded result unchanged: %s (%d results)"
          % (same_runs, same_items, len(items0)))
    if not (same_runs and same_items):
        changed = [k for k in items0 if items1.get(k) != items0[k]]
        print("CHANGED run items (check who — testers may be recording right now):", changed[:30])
    return 0 if (same_runs and same_items and not bad) else 1


if __name__ == "__main__":
    sys.exit(main())
