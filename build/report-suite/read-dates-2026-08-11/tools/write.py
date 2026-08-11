#!/usr/bin/env python3
"""The authorised writes of this pass: `update_case` on Report Suite cases to add
Standing-Rule-54 READ-DATES and to correct stale specification version pins.
Nothing else.

Rule 50 — EXHAUSTIVE then EXACT:
  * ALL THREE text fields are sent on every payload, because TestRail RE-RENDERS
    any text field OMITTED from the payload through its HTML pipeline — it wraps
    the field in <p> and turns \\n into \\r\\n (playbook §J declared normalisation
    #3). This project shows markup LITERALLY to the tester, so an omission
    manufactures a visible defect. `refs` is NOT sent: this pass does not change
    it, so omitting it keeps the comma-normalisation question out of the picture
    entirely. It is byte-verified unchanged regardless.
  * Every write is re-GET and byte-compared FIELD BY FIELD: the fields sent
    against the payload, and EVERY other field against the pre-write snapshot.
  * Verification is BY CONTENT, never by `updated_on` — TestRail re-renders
    stored text hours later without moving that timestamp, and a fresh timestamp
    has already been seen on a case whose intended write never landed.
  * On ANY mismatch the run STOPS and prints both byte sequences.

`custom_atmstatus` is captured AT WRITE TIME on every case, because Rule 65 owes
Vlad a report of every Automated-flagged case we changed, and the flag must be
the value that was live at the moment of the write rather than a snapshot value.

No add. No delete. No section op. No run write. No result. No Jira write.
"""
import datetime as dt
import json
import os
import sys

import tr

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, "..", "snapshots")

PRE = json.load(open(f"{SNAP}/cases-PRE.json"))
PLAN = json.load(open("/tmp/rs_readdate_plan.json"))

SERVER = {"updated_on", "updated_by"}   # the server legitimately moves these

RULE41 = ("re-verified whole against that case's own report specification, fetched live "
          "2026-08-11 18:27Z and re-read at write start — title, preconditions, steps, "
          "expected results, refs, section, type, requirement anchors, provenance line, "
          "sentence 2, automation marker and raw-markup census all checked")


def payload(cid):
    pre, p = PRE[cid], PLAN[cid]
    return {"title": pre["title"],
            "custom_preconds": pre["custom_preconds"],
            "custom_steps": pre["custom_steps"],
            "custom_expected": p["body"] + p["new_block"]}


def verify(cid, sent, got):
    fails = []
    pre = PRE[cid]
    for k, v in sent.items():
        if got.get(k) != v:
            fails.append(("SENT-NOT-STORED", k, repr(v)[:500], repr(got.get(k))[:500]))
    for k in set(pre) | set(got):
        if k in sent or k in SERVER:
            continue
        if pre.get(k) != got.get(k):
            fails.append(("COLLATERAL-CHANGE", k, repr(pre.get(k))[:500], repr(got.get(k))[:500]))
    return fails


def run(ids, logpath):
    log = []
    if os.path.exists(logpath):
        log = json.load(open(logpath))
    done = {r["case_id"] for r in log if r["verification"] == "MATCH"}
    todo = [c for c in ids if int(c) not in done]
    print(f"{len(ids)} in batch, {len(done)} already verified in this log, {len(todo)} to write")
    for n, cid in enumerate(todo, 1):
        sent = payload(cid)
        st, resp = tr.req(f"update_case/{cid}", sent)
        if st != 200:
            print(f"!! HTTP {st} on C{cid}: {resp}")
            json.dump(log, open(logpath, "w"), indent=1)
            sys.exit(2)
        st2, got = tr.req(f"get_case/{cid}")
        assert st2 == 200, (cid, st2, got)
        fails = verify(cid, sent, got)
        rec = {"n": len(log) + 1, "op": "update_case", "case_id": int(cid), "http": st,
               "fields_compared": len(set(PRE[cid]) | set(got)),
               "verification": "MATCH" if not fails else "MISMATCH",
               "atmstatus_at_write": got.get("custom_atmstatus"),
               "ops": PLAN[cid]["ops"],
               "rule41": RULE41,
               "at": dt.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")}
        log.append(rec)
        if fails:
            rec["failures"] = fails
            json.dump(log, open(logpath, "w"), indent=1)
            print(f"!! BYTE MISMATCH on C{cid} — BATCH STOPPED (Rule 50)")
            for t, k, a, b in fails:
                print(f"   {t} field={k}\n     expected: {a}\n     actual  : {b}")
            sys.exit(3)
        if n % 20 == 0 or n == len(todo):
            print(f"  {n:>3}/{len(todo)} C{cid} 200 MATCH ({rec['fields_compared']} fields) "
                  f"atm={rec['atmstatus_at_write']}")
        json.dump(log, open(logpath, "w"), indent=1)
    ok = sum(1 for r in log if r["verification"] == "MATCH")
    print(f"OK — {ok} writes in this log, all HTTP 200 + byte-verified MATCH")


if __name__ == "__main__":
    run(sys.argv[2:], sys.argv[1])
