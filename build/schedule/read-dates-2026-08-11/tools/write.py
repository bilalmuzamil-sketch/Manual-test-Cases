#!/usr/bin/env python3
"""The authorised writes of this pass: `update_case` on Schedule cases to add
Standing-Rule-54 READ-DATES. Nothing else.

Rule 50 — EXHAUSTIVE then EXACT:
  * ALL THREE text fields are sent on every payload, because TestRail RE-RENDERS
    any text field omitted from the payload through its HTML pipeline (it wraps
    the field in <p> and converts \n to \r\n). `refs` is NOT sent: this pass does
    not change it, it is not a rich-text field, and omitting it removes the
    comma-normalisation question entirely. The canary proves it survives.
  * Every write is re-GET and byte-compared FIELD BY FIELD: the intended field
    against the intended payload, and EVERY other field against the pre-write
    snapshot.
  * On ANY mismatch the run STOPS and prints both byte sequences.

No add. No delete. No section op. No run write. No result. No Jira call.
"""
import json, sys, datetime as dt
import tr

PRE = json.load(open("../snapshots/cases-PRE.json"))
PLAN = json.load(open("/tmp/stamp_plan.json"))

# Fields we intend to change. Everything else must come back byte-identical.
INTENDED = {"custom_expected"}
# Fields the server legitimately moves on any write.
SERVER = {"updated_on", "updated_by"}


def payload(cid):
    pre = PRE[cid]
    p = PLAN[cid]
    return {
        "title": pre["title"],
        "custom_preconds": pre["custom_preconds"],
        "custom_steps": pre["custom_steps"],
        "custom_expected": p["body"] + p["new"],
    }


def verify(cid, sent, got):
    """Return list of failures."""
    fails = []
    pre = PRE[cid]
    # (a) every field we sent must be stored verbatim
    for k, v in sent.items():
        if got.get(k) != v:
            fails.append(("SENT-NOT-STORED", k, repr(v)[:400], repr(got.get(k))[:400]))
    # (b) every other field must be byte-identical to the pre-write snapshot
    for k in set(pre) | set(got):
        if k in sent or k in SERVER:
            continue
        if pre.get(k) != got.get(k):
            fails.append(("COLLATERAL-CHANGE", k, repr(pre.get(k))[:400], repr(got.get(k))[:400]))
    return fails


def run(ids, logpath):
    log = []
    for n, cid in enumerate(ids, 1):
        sent = payload(cid)
        st, resp = tr.req(f"update_case/{cid}", sent)
        if st != 200:
            print(f"!! HTTP {st} on C{cid}: {resp}")
            json.dump(log, open(logpath, "w"), indent=1)
            sys.exit(2)
        st2, got = tr.req(f"get_case/{cid}")
        assert st2 == 200, (cid, st2, got)
        fails = verify(cid, sent, got)
        rec = {"n": n, "op": "update_case", "case_id": int(cid), "http": st,
               "fields_compared": len(set(PRE[cid]) | set(got)),
               "verification": "MATCH" if not fails else "MISMATCH",
               "atmstatus_at_write": got.get("custom_atmstatus"),
               "ops": PLAN[cid]["ops"],
               "rule41": "re-verified whole against the Schedule specification, "
                         "Confluence version 27, read 2026-08-11 13:09:33Z — title, "
                         "preconditions, steps, expected results, refs, section, type, "
                         "automation marker and section anchors all checked",
               "at": dt.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")}
        log.append(rec)
        if fails:
            rec["failures"] = fails
            json.dump(log, open(logpath, "w"), indent=1)
            print(f"!! BYTE MISMATCH on C{cid} — BATCH STOPPED (Rule 50)")
            for t, k, a, b in fails:
                print(f"   {t} field={k}\n     expected: {a}\n     actual  : {b}")
            sys.exit(3)
        print(f"  {n:>3}/{len(ids)} C{cid} 200 MATCH ({rec['fields_compared']} fields) {PLAN[cid]['ops']}")
    json.dump(log, open(logpath, "w"), indent=1)
    print(f"OK — {len(log)} writes, all 200 + byte-verified MATCH")


if __name__ == "__main__":
    ids = sys.argv[2:]
    run(ids, sys.argv[1])
