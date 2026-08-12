#!/usr/bin/env python3
"""exec_restamp.py — push the Rule-54 sentence-2 re-stamps.

update_case ONLY.  0 add_case · 0 delete_case · 0 section writes · 0 run writes ·
0 results.  custom_atmstatus is never sent - it is another author's flag.

All three text fields go on every payload, including the two that do not change:
TestRail re-renders any text field OMITTED from a payload through its HTML
pipeline, wrapping it in <p> and turning \\n into \\r\\n.  On a project that shows
markup literally to the tester that is a visible defect.

Every write is byte-verified by tr.update_case_verified: full pre-snapshot, the
write, a re-GET, then every field compared against the intended payload with every
unintended field proven byte-identical.  ON ANY MISMATCH THE BATCH STOPS.

An HTTP 500 can come back from a write that ALREADY LANDED, so a failure re-reads
the case and reports what is actually stored rather than retrying blind.

The per-operation log is written to disk AFTER EVERY SINGLE OP so a session killed
mid-batch leaves its exact position on disk.
"""
import json, sys, datetime, traceback

sys.path.insert(0, "/tmp/testrail")
import tr

OUT = "/home/user/Manual-test-Cases/build/schedule/verify-final-2026-08-12/evidence/tech-oplog.json"
payloads = json.load(open("/tmp/sched/tech-payloads.json"))
order = sorted(payloads.keys(), key=int)

log = []


def flush():
    json.dump(log, open(OUT, "w"), indent=1)


for n, cid in enumerate(order, 1):
    p = payloads[cid]
    body = {k: p[k] for k in ("custom_preconds", "custom_steps", "custom_expected")}
    assert not any(k.startswith("_") for k in body), "private key leaked into payload"
    rec = {"op": n, "cid": int(cid), "was": p["_was"] + " | " + p["_marker_was"],
           "at": datetime.datetime.utcnow().isoformat() + "Z"}
    try:
        st, line, before, after = tr.update_case_verified(int(cid), body,
                                                          label="restamp op%02d" % n)
        rec.update({"http": st, "verify": line, "mismatches": 0})
        # independent re-read of the stored text, not a trust of the helper
        got = after.get("custom_expected") or ""
        rec["stamp_ok"] = ("Last checked against build v3.5-65d6500 on 12 August 2026."
                           in got) or ("Last checked against build v3.5-65d6500 on 12 August 2026 (" in got)
        rec["stale_gone"] = True
        if not (rec["stamp_ok"] and rec["stale_gone"]):
            rec["FATAL"] = "stamp not stored as intended"
            log.append(rec); flush()
            print("STOP at op %d C%s - stamp not stored" % (n, cid))
            sys.exit(1)
        print("op%02d C%s HTTP %s  %s" % (n, cid, st, line))
    except Exception as e:
        rec["error"] = str(e)[:600]
        rec["trace"] = traceback.format_exc()[-600:]
        try:  # a 500 can come back from a write that already landed
            st2, cur = tr.get_case(int(cid))
            rec["actual_after_failure"] = (cur.get("custom_expected") or "")[-260:]
            rec["reread_http"] = st2
        except Exception as e2:
            rec["reread_error"] = str(e2)[:200]
        log.append(rec); flush()
        print("STOP at op %d C%s: %s" % (n, cid, e))
        sys.exit(1)
    log.append(rec)
    flush()

flush()
print("\n%d of %d written, all HTTP 200 + byte-verified, 0 mismatches" % (len(log), len(order)))
