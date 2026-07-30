#!/usr/bin/env python3
"""Execute the 33 update_case ops, each HTTP 200 + re-GET byte-verified.

Resumable (Rule 29): every operation is appended to oplog.json as it completes, so a
killed run can be verified against live TestRail and finished from where it stopped.
Re-running skips any case already logged as verified.

Credentials from the environment only (TESTRAIL_USER / TESTRAIL_KEY via /tmp/tr-creds.env).
NO add_case, NO delete_case, NO section change, NO run writes.
"""
import csv
import glob
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.abspath(os.path.join(HERE, ".."))
sys.path.insert(0, HERE)
import tr  # noqa: E402

OPLOG = os.path.join(HERE, "oplog.json")
REFS_CAP = 245


def body_of(c):
    """The TestRail field payload for one of our local case bodies."""
    return {
        "refs": c["spec_ref"],
        "custom_preconds": "\n".join(c["preconditions"]),
        "custom_steps": "\n".join(c["steps"]),
        "custom_expected": "\n".join(c["expected"]),
    }


def main():
    dry = "--dry-run" in sys.argv
    idmap = {r["internal_id"]: r["testrail_case_id"]
             for r in csv.DictReader(open(os.path.join(RS, "testrail-id-map.csv"),
                                         encoding="utf-8"))}
    cases = {}
    for f in sorted(glob.glob(os.path.join(RS, "cases", "*.json"))):
        for c in json.load(open(f, encoding="utf-8")):
            if c.get("viu_status") == "VIU-Pending":
                cases[c["id"]] = c

    plan = json.load(open(os.path.join(HERE, "push-plan.json"), encoding="utf-8"))
    log = json.load(open(OPLOG, encoding="utf-8")) if os.path.exists(OPLOG) else {}

    FOREIGN = {38919, 38920, 38921, 38922, 38923}   # Vladimir Tomovic's - never touch

    ok = fail = skipped = 0
    for i, p in enumerate(plan, 1):
        iid = p["internal_id"]
        cid = int(p["case_id"][1:])
        assert cid not in FOREIGN, f"REFUSING to touch foreign case {cid}"
        if log.get(iid, {}).get("verified") is True:
            skipped += 1
            continue
        c = cases[iid]
        payload = body_of(c)
        assert len(payload["refs"]) <= REFS_CAP, (iid, len(payload["refs"]))
        assert "," not in payload["refs"], iid
        if dry:
            print(f"  [{i:>2}/33] DRY {iid} C{cid} refs={len(payload['refs'])}")
            continue

        st, d = tr.call(f"update_case/{cid}", payload)
        entry = {"case_id": cid, "kind": p["kind"], "http": st, "verified": False}
        if st != 200:
            entry["error"] = str(d)[:300]
            log[iid] = entry
            json.dump(log, open(OPLOG, "w"), indent=1)
            print(f"  [{i:>2}/33] FAIL {iid} C{cid} HTTP {st}: {str(d)[:160]}")
            fail += 1
            continue

        # re-GET byte-verify every field written
        st2, g = tr.get_case(cid)
        assert st2 == 200, (iid, st2, g)
        diffs = [k for k, v in payload.items() if (g.get(k) or "") != v]
        entry["verified"] = not diffs
        entry["diffs"] = diffs
        entry["title_unchanged"] = g.get("title") == c["title"]
        entry["section_id"] = g.get("section_id")
        log[iid] = entry
        json.dump(log, open(OPLOG, "w"), indent=1)
        if diffs:
            print(f"  [{i:>2}/33] MISMATCH {iid} C{cid}: {diffs}")
            fail += 1
        else:
            print(f"  [{i:>2}/33] 200 + MATCH {iid} C{cid} ({p['kind']})")
            ok += 1

    print(f"\nok={ok} fail={fail} skipped(already verified)={skipped}")
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
