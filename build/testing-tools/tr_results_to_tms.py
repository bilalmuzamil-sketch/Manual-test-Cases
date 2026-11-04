#!/usr/bin/env python3
"""Copy test results from a TestRail run into its TMS run (TestRail -> TMS).

QA lead, 2026-11-04: "the progress of the Test run excluding the test runs of nebojsa, should be recorded in TMS
test run too". Rule 115: results a SYNC copies mirror the human tester exactly, every status; the writing account
(the API key owner) shows as author in TMS, so each comment names the real tester and the original time.

Idempotent: every copied TestRail result id is recorded in build/tms/results-copied-tr-to-tms.csv and never copied
again. Results with no status (TestRail assignment-only or comment-only entries) and "Untested" are skipped: TMS
cannot record those. Results are posted oldest first, so each item's current status ends up as TestRail's latest.

    python3 tr_results_to_tms.py --tr-run 556 --tms-run 17            # dry run: what would be copied
    python3 tr_results_to_tms.py --tr-run 556 --tms-run 17 --apply    # copy, then compare statuses
"""
import argparse
import collections
import csv
import datetime
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tms_client import TMS  # noqa: E402
from tms_sync import TestRail, id_map  # noqa: E402

LEDGER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "tms", "results-copied-tr-to-tms.csv")
COPYABLE = {1, 2, 4, 5}  # Passed, Blocked, Retest, Failed (TestRail ids = TMS ids)


def ledger():
    try:
        return {int(r["testrail_result_id"]) for r in csv.DictReader(open(LEDGER))}
    except OSError:
        return set()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tr-run", type=int, required=True)
    ap.add_argument("--tms-run", type=int, required=True)
    ap.add_argument("--apply", action="store_true")
    a = ap.parse_args()
    tr, tms, cmap, done = TestRail(), TMS(), id_map(), ledger()
    tms.log_path = "/tmp/tms/results-copy-ops.jsonl"
    run = tms.ok("GET", "/runs/%d" % a.tms_run)
    run = run.get("data", run)
    if run.get("is_closed"):
        sys.exit("TMS run %d is closed; it rejects results (409). Nothing done." % a.tms_run)
    in_run = {i["case_id"] for i in tms.get_all("/runs/%d/items" % a.tms_run)}
    names = {}

    def who(uid):
        if uid not in names:
            try:
                names[uid] = tr.get("get_user/%d" % uid)["name"]
            except Exception:
                names[uid] = "TestRail user %d" % uid
        return names[uid]

    results = sorted(tr.paged("get_results_for_run/%d" % a.tr_run, "results"), key=lambda r: (r["created_on"], r["id"]))
    todo, skipped = [], collections.Counter()
    for r in results:
        if r["id"] in done:
            skipped["already copied"] += 1
        elif r.get("status_id") not in COPYABLE:
            skipped["no status / untested"] += 1
        elif cmap.get(r["case_id"], r["case_id"]) not in in_run:
            skipped["case not in the TMS run"] += 1
        else:
            todo.append(r)
    print("TestRail run %d: %d results | to copy %d | skipped %s" % (a.tr_run, len(results), len(todo), dict(skipped)))
    if not a.apply or not todo:
        return
    copied = 0
    with open(LEDGER, "a", newline="") as fh:
        w = csv.writer(fh)
        if os.path.getsize(LEDGER) == 0:
            w.writerow(["testrail_result_id", "testrail_run", "tms_run", "case", "status", "copied_at"])
        for i in range(0, len(todo), 500):
            chunk = todo[i:i + 500]
            entries = []
            for r in chunk:
                when = datetime.datetime.fromtimestamp(r["created_on"], datetime.UTC).strftime("%Y-%m-%d %H:%M UTC")
                note = "Copied from TestRail run %d (result %d): recorded in TestRail by %s at %s." % (
                    a.tr_run, r["id"], who(r["created_by"]), when)
                e = {"case_id": cmap.get(r["case_id"], r["case_id"]), "status": r["status_id"],
                     "comment": (r["comment"] + "\n\n" if r.get("comment") else "") + note}
                for k in ("defects", "version"):
                    if r.get(k):
                        e[k] = r[k]
                if r.get("elapsed"):
                    e["elapsed"] = r["elapsed"].replace(" ", "")
                entries.append(e)
            code, d = tms.call("POST", "/runs/%d/results" % a.tms_run, {"results": entries})
            tms.log("copy_results", a.tms_run, code, "batch of %d" % len(entries))
            if code not in (200, 201):
                print("batch FAILED http %s %s" % (code, json.dumps(d)[:300]))
                break
            outcomes = (d or {}).get("results") or (d or {}).get("data") or []
            for r, o in zip(chunk, outcomes if outcomes else [None] * len(chunk)):
                if o is None or not o.get("error"):
                    w.writerow([r["id"], a.tr_run, a.tms_run, r["case_id"], r["status_id"],
                                datetime.datetime.now(datetime.UTC).isoformat()])
                    copied += 1
                else:
                    print("  not recorded: case %s -> %s" % (r["case_id"], o.get("error")))
    print("copied %d of %d" % (copied, len(todo)))
    # Compare: every TMS item's current status vs the TestRail test's current status.
    trs = {cmap.get(x["case_id"], x["case_id"]): x["status_id"] for x in tr.paged("get_tests/%d" % a.tr_run, "tests")}
    tmi = {i["case_id"]: i["current_status"] for i in tms.get_all("/runs/%d/items" % a.tms_run)}
    off = [c for c, s in trs.items() if c in tmi and tmi[c] != s]
    print("statuses now equal to TestRail: %d/%d%s" % (len(trs) - len(off), len(trs),
                                                      "" if not off else " | differ: %s" % off[:20]))
    run = tms.ok("GET", "/runs/%d" % a.tms_run)
    print("TMS run %d totals:" % a.tms_run, run.get("data", run)["counts"])


if __name__ == "__main__":
    main()
