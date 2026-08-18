"""Batch executor for the WIP full v21->v22 re-stamp (2026-08-18).

Usage: python3 exec_restamp.py C30451 C30452 ...   (C-ids for ONE batch)

Per case (Rule 50 byte-verified via tr.update_case_verified):
  - re-GET live; if already v22 (no 'version 21' pin left AND refs already v22) -> SKIP (resumable).
  - else compute transform from the LIVE text (never a cached copy), send all text fields + refs.
  - append the op to FULL-RESTAMP-oplog.jsonl + .md AS it lands (work-loss: oplog is truth-adjacent,
    but resume verifies from LIVE per Rule G).
Then update the local case JSON for the batch's cases (expected/refs/spec_ref) so gen_import reflects it.
Git commit/push is done by the shell wrapper AFTER this exits 0.
"""
import sys, os, json, glob, time
sys.path.insert(0, "/tmp/testrail")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tr
import restamp_v22 as R

DIR = os.path.dirname(os.path.abspath(__file__))
CASES_GLOB = "/home/user/Manual-test-Cases/build/report-suite/cases/cases-wip-*.json"
OPLOG_MD = os.path.join(DIR, "FULL-RESTAMP-oplog.md")
OPLOG_JL = os.path.join(DIR, "FULL-RESTAMP-oplog.jsonl")


def already_v22(c):
    exp = c.get("custom_expected") or ""
    refs = c.get("refs") or ""
    # pin gone from expected AND refs no longer says spec v21
    return ("specification version 21" not in exp
            and "specification (version 21" not in exp
            and "spec v21" not in refs)


def load_local_specref():
    m = {}
    for f in sorted(glob.glob(CASES_GLOB)):
        for c in json.load(open(f)):
            if c.get("testrail_id"):
                m[int(c["testrail_id"][1:])] = c.get("spec_ref")
    return m


def append_oplog(rec):
    with open(OPLOG_JL, "a") as fh:
        fh.write(json.dumps(rec) + "\n")
    with open(OPLOG_MD, "a") as fh:
        fh.write("- **C%s** %s | HTTP %s | %s%s\n" % (
            rec["cid"], rec["result"], rec.get("http", "-"),
            rec.get("verify", ""), (" | " + ";".join(rec["notes"]) if rec.get("notes") else "")))


def update_local(done):
    """done = {cid: (new_exp, new_refs, new_spec_ref)}."""
    for f in sorted(glob.glob(CASES_GLOB)):
        arr = json.load(open(f))
        changed = False
        for c in arr:
            t = c.get("testrail_id")
            if not t:
                continue
            cid = int(t[1:])
            if cid in done:
                ne, nr, ns = done[cid]
                c["expected"] = ne
                c["refs"] = nr
                if ns is not None:
                    c["spec_ref"] = ns
                changed = True
        if changed:
            with open(f, "w") as fh:
                fh.write(json.dumps(arr, indent=1, ensure_ascii=False))


def main():
    cids = [int(a.lstrip("C")) for a in sys.argv[1:]]
    assert cids, "no cids"
    specref = load_local_specref()
    done = {}
    for cid in cids:
        st, live = tr.get_case(cid)
        if st != 200:
            append_oplog({"cid": cid, "result": "ERROR-GET", "http": st})
            raise SystemExit("GET C%d HTTP %d" % (cid, st))
        if live.get("created_by") != 3:
            raise SystemExit("REFUSE foreign C%d" % cid)
        if live.get("custom_atmstatus") == 3:
            raise SystemExit("REFUSE automated C%d" % cid)
        if already_v22(live):
            append_oplog({"cid": cid, "result": "SKIP-already-v22", "http": 200})
            continue
        exp = live["custom_expected"]
        refs = live.get("refs") or ""
        ne, nr, ns, notes = R.restamp(cid, exp, refs, specref.get(cid))
        payload = {
            "custom_preconds": live.get("custom_preconds"),
            "custom_steps": live.get("custom_steps"),
            "custom_expected": ne,
            "refs": nr,
        }
        http, report, before, after = tr.update_case_verified(cid, payload,
                                                              label="update_case")
        append_oplog({"cid": cid, "result": "WROTE", "http": http,
                      "verify": report, "notes": notes})
        done[cid] = (ne, nr, ns)
        time.sleep(0.2)
    update_local(done)
    print("BATCH DONE: %d cids, %d wrote, %d skipped" % (
        len(cids), len(done), len(cids) - len(done)))


if __name__ == "__main__":
    main()
