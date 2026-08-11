#!/usr/bin/env python3
"""Execute the SV-9041 plan with Rule-50 byte verification.
STOPS the batch on any mismatch. update_case ONLY."""
import json, sys, os, datetime
sys.path.insert(0, os.getcwd()); import tr

DRY = "--apply" not in sys.argv
ops = json.load(open("/tmp/sv9041_plan.json"))
SNAP = "/home/user/Manual-test-Cases/build/filters/resync-2026-08-11/snapshots/cases-LIVE-OURS.json"
pre = {c["id"]: c for c in json.load(open(SNAP))}
log = []

def norm_refs(s): return ",".join(p.strip() for p in (s or "").split(","))

for o in ops:
    cid = o["case_id"]; payload = o["payload"]
    print(f"\n=== C{cid} ({o['internal']}) fields={o['fields_changed']} ===")
    # re-read immediately before writing (Rule 59)
    st, cur = tr.req(f"get_case/{cid}")
    if st != 200: raise SystemExit(f"pre-read failed {st}")
    for f in ("custom_preconds","custom_steps","custom_expected","refs"):
        if (cur.get(f) or "") != (pre[cid].get(f) or ""):
            raise SystemExit(f"STOP: C{cid} field {f} moved between snapshot and write")
    print("  pre-read matches snapshot on all 4 text fields")
    if DRY:
        print("  DRY RUN - no write"); continue
    st, res = tr.req(f"update_case/{cid}", payload)
    print(f"  update_case HTTP {st}")
    if st != 200:
        raise SystemExit(f"STOP: write failed {st}: {res}")
    st, back = tr.req(f"get_case/{cid}")
    if st != 200: raise SystemExit(f"re-GET failed {st}")
    # 1. intended fields byte-match the payload
    mism = []
    for f, want in payload.items():
        got = back.get(f) or ""
        ok = (norm_refs(got) == norm_refs(want)) if f == "refs" else (got == want)
        if not ok: mism.append((f, want, got))
    # 2. every OTHER field byte-identical to pre
    SKIP = set(payload) | {"updated_on","updated_by"}
    collateral = []
    for f in set(list(pre[cid].keys()) + list(back.keys())):
        if f in SKIP: continue
        if pre[cid].get(f) != back.get(f): collateral.append((f, pre[cid].get(f), back.get(f)))
    nfields = len(set(list(pre[cid].keys()) + list(back.keys())))
    print(f"  fields compared: {nfields} | intended mismatches: {len(mism)} | collateral changes: {len(collateral)}")
    if mism:
        for f,w,g in mism:
            print(f"  MISMATCH {f}\n    WANT bytes: {w!r}\n    GOT  bytes: {g!r}")
        raise SystemExit("STOP: byte verification FAILED - batch halted")
    if collateral:
        for f,a,b in collateral: print(f"  COLLATERAL {f}: {a!r} -> {b!r}")
        raise SystemExit("STOP: collateral change detected - batch halted")
    print("  VERIFIED: byte-identical MATCH, 0 collateral")
    log.append({"case_id":cid,"internal":o["internal"],"http":st,
                "fields_written":sorted(payload),"fields_changed":o["fields_changed"],
                "fields_compared":nfields,"mismatches":0,"collateral":0,
                "atmstatus":back.get("custom_atmstatus"),
                "when":datetime.datetime.utcnow().isoformat()+"Z"})

if not DRY:
    json.dump(log, open("../oplog.json","w"), indent=1)
    print(f"\nALL {len(log)} OPS VERIFIED")
