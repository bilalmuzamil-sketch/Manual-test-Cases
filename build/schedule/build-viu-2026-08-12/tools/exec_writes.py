#!/usr/bin/env python3
"""exec_writes.py — push the 2026-08-12 Schedule corrections.

update_case ONLY.  Zero add_case, zero delete_case, zero section writes, zero run
writes (357 holds 529 results and is never touched), zero results, zero Jira.

Every write is byte-verified by tr.update_case_verified: full pre-snapshot, the
write, a re-GET, then EVERY field compared against the intended payload with every
unintended field proven byte-identical.  On any mismatch the batch STOPS.

An HTTP 500 can come back from a write that ALREADY LANDED, so a failure re-reads
the case and reports what is actually stored rather than retrying blind.

The per-operation log is written to disk AFTER EVERY SINGLE OP, not at the end, so
a session killed mid-batch leaves its exact position on disk.
"""
import json, sys, traceback, datetime
sys.path.insert(0, "/tmp/testrail")
sys.path.insert(0, "/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-12/tools")
import tr
import payloads as P

LOG = "/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-12/testrail-execution-log.md"
JLOG = "/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-12/evidence/exec-log.json"
RUN = 357

ops = P.build()
done = []


def flush():
    json.dump(done, open(JLOG, "w"), indent=1)
    with open(LOG, "w") as f:
        f.write("# Schedule — TestRail execution log, 2026-08-12\n\n")
        f.write("**Build `%s`** · date stamp `%s` · `update_case` only.\n\n" % (P.BUILD, P.DATE))
        f.write("Zero `add_case` · zero `delete_case` · zero section writes · **zero run writes "
                "(`update_run` never called)** · zero results · zero Jira calls.\n\n")
        f.write("Every op: full pre-snapshot, write, re-GET, **every field compared** against the "
                "intended payload, **every unintended field proven byte-identical**. "
                "`updated_on`/`updated_by` are the only fields excluded, because the server always "
                "moves them.\n\n")
        f.write("| # | Case | HTTP | Fields compared | Mismatches | Reason |\n")
        f.write("|---|---|---|---|---|---|\n")
        for i, d in enumerate(done, 1):
            f.write("| %d | [C%d](https://shopview.testrail.io/index.php?/cases/view/%d) | %s | %s | %s | %s |\n"
                    % (i, d["cid"], d["cid"], d["http"], d.get("fields", "-"),
                       d.get("mismatches", "-"), d["reason"]))
        f.write("\n**%d of %d operations complete.**\n" % (len(done), len(ops)))


# run 357 snapshot BEFORE anything, so "untouched" is provable by content
st, pre_tests = tr.api("get_tests/%d&limit=250" % RUN)
tests, off = [], 0
while True:
    st, b = tr.api("get_tests/%d&limit=250&offset=%d" % (RUN, off))
    ch = b["tests"] if isinstance(b, dict) else b
    tests += ch
    if len(ch) < 250: break
    off += 250
results, off = [], 0
while True:
    st, b = tr.api("get_results_for_run/%d&limit=250&offset=%d" % (RUN, off))
    ch = b["results"] if isinstance(b, dict) else b
    results += ch
    if len(ch) < 250: break
    off += 250
st, run = tr.api("get_run/%d" % RUN)
json.dump({"include_all": run.get("include_all"), "tests": len(tests), "results": len(results),
           "test_ids": sorted(t["id"] for t in tests), "case_ids": sorted(t["case_id"] for t in tests),
           "result_ids": sorted(r["id"] for r in results),
           "results_full": results},
          open("/tmp/sched/run357-PRE.json", "w"))
print("run 357 PRE: include_all=%s tests=%d results=%d" % (run.get("include_all"), len(tests), len(results)))

for n, op in enumerate(ops, 1):
    cid, payload, reason = op["cid"], op["payload"], op["reason"]
    try:
        code, line, before, after = tr.update_case_verified(cid, payload, "op%02d" % n)
        fields = line.split("fields compared")[0].split(":")[-1].strip()
        done.append({"cid": cid, "http": code, "fields": fields, "mismatches": 0,
                     "reason": reason, "at": datetime.datetime.utcnow().isoformat() + "Z"})
        print("op%02d C%d  HTTP %s  %s" % (n, cid, code, line))
    except Exception as e:
        # a 500 can come back from a write that landed — read, do not retry blind
        st, cur = tr.get_case(cid)
        landed = all(cur.get(k) == v for k, v in payload.items()) if st == 200 else None
        done.append({"cid": cid, "http": "ERROR", "reason": reason,
                     "error": str(e)[:800], "state_after_read": ("LANDED" if landed else "NOT LANDED"),
                     "at": datetime.datetime.utcnow().isoformat() + "Z"})
        flush()
        print("STOPPED at op%02d C%d — %s" % (n, cid, str(e)[:400]))
        print("re-read says the case is:", "LANDED" if landed else "NOT LANDED")
        traceback.print_exc()
        sys.exit(1)
    flush()          # after EVERY op, not at the end

print("\nall %d operations verified." % len(done))
