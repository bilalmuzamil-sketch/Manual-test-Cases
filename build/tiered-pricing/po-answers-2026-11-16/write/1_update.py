#!/usr/bin/env python3
"""(1) Update the 49 named cases (30 changed, 11 rewritten, 5 released, 3 refs-only; S3-40 now held on question 33) to their v38 library text.
EDIT-LOCKED on the live text: a case whose live title/preconditions/steps/expected/refs/section differ from our last read-back of the 16 Nov
write (write/applied/C<id>-after.json) was edited outside our library and is SKIPPED and listed. A case already equal to the target is not
written again (resumable). Before-copy: before/C<id>.json. update_case never sends section_id; a case whose folder changes (held -> story
folder, or S3-40 -> "Waiting on Matt Barge's answers") is moved with move_cases_to_section/{dest} {"suite_id":1,"case_ids":[id]} (empty
reply) and its section_id read back. Read-back field by field: after/C<id>.json. Log: log-update.jsonl.   python3 1_update.py [--apply]"""
import json, sys
from _w import *
L = logger("update"); PR = prop(); M = idmap(); S = secs(); I = impact()
WRITE = sorted(c["key"] for c in I["cases"] if c["verdict"] in ("CHANGE", "REWRITE", "RELEASE", "REFS-ONLY"))
assert len(WRITE) == 49, len(WRITE)
readiness()
plan, skipped, done, bad = [], [], [], []
for k in WRITE:
    cid = int(M[k]["case_id"]); want = PR[k]["fields"]; dest = S[PR[k]["sec"]]["id"]
    live = api(f"get_case/{cid}"); prev = last_readback(cid)
    target_equal = all(live.get(f) == want[f] for f in FIELDS) and norm_refs(live.get("refs")) == norm_refs(want["refs"]) and live["section_id"] == dest
    if target_equal: done.append(k); L({"op": "already_current", "key": k, "case": f"C{cid}"}); continue
    locked_ok = prev is not None and all((live.get(f) if f != "refs" else norm_refs(live.get(f))) == (prev.get(f) if f != "refs" else norm_refs(prev.get(f))) for f in LOCK)
    if not locked_ok:
        diff = [f for f in LOCK if prev is None or (norm_refs(live.get(f)) if f == "refs" else live.get(f)) != (norm_refs(prev.get(f)) if f == "refs" else prev.get(f))]
        # a case we already updated in an earlier (interrupted) run of this script differs from the 16 Nov copy only towards the target
        ours = json.load(open(f"{W}/before/C{cid}.json")) if os.path.exists(f"{W}/before/C{cid}.json") else None
        if not (ours and all((norm_refs(ours.get(f)) if f == "refs" else ours.get(f)) == (norm_refs(prev.get(f)) if f == "refs" else prev.get(f)) for f in LOCK)
                and live.get("updated_by") == 3):
            skipped.append((k, cid, diff, live.get("updated_by"), live.get("updated_on"))); L({"op": "LOCKED_skip", "key": k, "case": f"C{cid}", "differs": diff,
              "updated_by": live.get("updated_by"), "updated_on": live.get("updated_on")}); continue
    plan.append((k, cid, live, dest))
print(f"PLAN: update {len(plan)} | already current {len(done)} | LOCKED (edited outside our library) {len(skipped)}: {skipped}")
for k, cid, live, dest in plan:
    ch = [f for f in FIELDS if live.get(f) != PR[k]["fields"][f]] + (["refs"] if norm_refs(live.get("refs")) != norm_refs(PR[k]["fields"]["refs"]) else []) \
         + ([f"section {live['section_id']}->{dest}"] if live["section_id"] != dest else [])
    print(f"  {k:7} C{cid}: {', '.join(ch)}")
if not APPLY: print("dry run: nothing written"); sys.exit(0)
for k, cid, live, dest in plan:
    if not os.path.exists(f"{W}/before/C{cid}.json"): json.dump(live, open(f"{W}/before/C{cid}.json", "w"), indent=1, ensure_ascii=False)
    body = {f: PR[k]["fields"][f] for f in FIELDS}; body["refs"] = PR[k]["fields"]["refs"]
    try: api(f"update_case/{cid}", body); st = LAST["status"]
    except RuntimeError as e: L({"op": "update_case", "key": k, "case": f"C{cid}", "http": e.args[0], "error": e.args[1]}); bad.append(k); continue
    mv = None
    if live["section_id"] != dest:
        try: api(f"move_cases_to_section/{dest}", {"suite_id": SUITE, "case_ids": [cid]}); mv = LAST["status"]
        except RuntimeError as e: mv = f"ERROR {e.args[0]} {e.args[1][:120]}"
    a = api(f"get_case/{cid}"); json.dump(a, open(f"{W}/after/C{cid}.json", "w"), indent=1, ensure_ascii=False)
    diff = [f for f in FIELDS if a.get(f) != PR[k]["fields"][f]] + (["refs"] if norm_refs(a.get("refs")) != norm_refs(PR[k]["fields"]["refs"]) else []) \
           + (["section"] if a["section_id"] != dest else [])
    if diff: bad.append(k)
    L({"op": "update_case", "key": k, "case": f"C{cid}", "http": st, "move_http": mv, "section": a["section_id"], "readback_ok": not diff, "bad": diff})
print("updated:", len(plan) - len(bad), "| problems:", bad, "| locked:", [s[0] for s in skipped]); sys.exit(1 if bad else 0)
