#!/usr/bin/env python3
"""Rule 65: establish WHO set custom_atmstatus = 3, and when.

Rule 65 is explicit that this must be checked rather than assumed: on Schedule
NOBODY ever set the flag -- our own add_case tooling hardcoded 3 -- so those
cases are not evidence that anything is automated, and reporting them to the
automation engineer as his own would pad the list and cost it credibility on the
first reading.

Read-only: get_history_for_case only.
"""
import json
import os
import sys

sys.path.insert(0, "/tmp/testrail")
import tr  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    post = json.load(open(os.path.join(HERE, "..", "snapshots", "cases-POST.json")))
    plan = {r["cid"] for r in json.load(open(os.path.join(HERE, "..", "logs", "plan-final.json")))}
    auto = sorted(c["id"] for c in post
                  if c["created_by"] == 3 and c.get("custom_atmstatus") == 3)
    out = []
    for cid in auto:
        st, b = tr.api(f"get_history_for_case/{cid}&limit=250")
        if st != 200:
            out.append({"cid": cid, "error": f"HTTP {st}"})
            continue
        hist = b["history"] if isinstance(b, dict) else b
        events = []
        for h in hist:
            for ch in h.get("changes", []):
                if ch.get("field") == "custom_atmstatus":
                    events.append({"when": h.get("created_on"), "user_id": h.get("user_id"),
                                   "old": ch.get("old_text"), "new": ch.get("new_text")})
        out.append({"cid": cid, "touched_by_this_pass": cid in plan,
                    "atmstatus_change_events": events,
                    "created_by": next(c["created_by"] for c in post if c["id"] == cid),
                    "history_entries": len(hist)})
        print(f"C{cid}  touched={cid in plan}  atmstatus-change events={len(events)}  "
              f"{[ (e['user_id'], e['old'], e['new']) for e in events ]}")

    json.dump(out, open(os.path.join(HERE, "..", "logs", "atm-history.json"), "w"), indent=1)
    never = [r["cid"] for r in out if not r.get("atmstatus_change_events")]
    print(f"\n{len(auto)} cases flagged Automated.")
    print(f"{len(auto)-len(never)} have a recorded atmstatus change (a person set it).")
    print(f"{len(never)} have NO recorded change -- the flag has been 3 since creation: {never}")


if __name__ == "__main__":
    main()
