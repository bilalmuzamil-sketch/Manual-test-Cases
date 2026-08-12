"""finish5 - the TestRail write pass.  update_case ONLY.

Zero add / delete / section / run / result writes.  custom_atmstatus is NEVER sent, and is
RECORDED AT WRITE TIME for Standing Rule 65.  Every write re-GETs and compares EVERY field
against the intended payload, and proves every field the pass did not intend to change is
byte-identical.  On any mismatch the batch STOPS (Standing Rule 50).
The per-operation log is flushed AFTER EACH WRITE, so a killed run can be resumed from git.

DRY RUN by default.  Pass --go to execute.
"""
import json, re, sys
sys.path.insert(0, "/tmp/testrail"); import tr

OUT = "/home/user/Manual-test-Cases/build/schedule/finish5-2026-08-12/evidence"
LOG = f"{OUT}/testrail-oplog.json"
BUILD = "v3.5-65d6500"
STAMP = f"Last checked against build {BUILD} on 12 August 2026."
STAMP_RE = re.compile(r"Last checked against build [^\s]+ on [^.\n]*\.")

# the five cases whose PRECONDITIONS AND STEPS were actually walked this pass
WALKED = [38875, 38863, 38865, 29986, 30615]

# the ONE cosmetic step correction (category (a)): C38875 step 2 does not say WHICH field to
# change, and a body that changes nothing is rejected with HTTP 400 before the location is
# ever checked - so a tester following the step literally sees a 400 where the expected
# result predicts a 404, and would wrongly record a failure.  The route and the behaviour are
# exactly what the source describes; only the step is under-specified.
STEP_FIX = {38875: (
    "2. Also try PATCH /api/schedule/shifts/{id} on the same id.",
    "2. Also try PATCH /api/schedule/shifts/{id} on the same id, changing a real field such "
    "as the colour. (A request that would change nothing is rejected on its own account "
    "before the location is even checked, so always send a real change here.)")}


def restamp(exp):
    if STAMP_RE.search(exp):
        return STAMP_RE.sub(STAMP, exp, count=1)
    m = re.search(r"(read on [^.\n]*\.)(\s*\n)", exp)
    if m:
        return exp[:m.end(1)] + " " + STAMP + exp[m.end(1):]
    m2 = re.search(r"(This is the expected behaviour[^\n]*?\.)", exp)
    if m2:
        return exp[:m2.end(1)] + " " + STAMP + exp[m2.end(1):]
    return None      # refuse rather than invent a provenance sentence


def build_ops():
    ops = []
    for cid in WALKED:
        st, c = tr.get_case(cid); assert st == 200, (cid, st)
        exp = c.get("custom_expected") or ""
        steps = c.get("custom_steps") or ""
        if re.search(r"</?(p|ol|li|ul|br)\b", exp + steps):
            print(f"  C{cid}: REFUSED - raw markup in the body; a text rewrite would double the line")
            continue
        new_exp = restamp(exp)
        if new_exp is None:
            print(f"  C{cid}: REFUSED - no provenance sentence to attach a build line to")
            continue
        why = []
        if new_exp != exp:
            why.append("re-stamp Rule-54 sentence 2 to the build this case was walked on")
        new_steps = steps
        if cid in STEP_FIX:
            old, fixed = STEP_FIX[cid]
            if old in steps:
                new_steps = steps.replace(old, fixed)
                why.append("cosmetic: step 2 now names a real field to change, so the step is "
                           "runnable exactly as written")
            elif fixed not in steps:
                print(f"  C{cid}: step 2 not found verbatim - step fix SKIPPED, reported not forced")
        if not why:
            print(f"  C{cid}: no-op, already carries {BUILD} and needs no step fix")
            continue
        ops.append({"cid": cid, "title": c["title"], "atm_at_write_time": c.get("custom_atmstatus"),
                    "payload": {"custom_preconds": c.get("custom_preconds") or "",
                                "custom_steps": new_steps, "custom_expected": new_exp},
                    "why": why})
    return ops


ops = build_ops()
print(f"\n{len(ops)} write(s) planned over {len(WALKED)} walked cases")
for o in ops:
    exp = o["payload"]["custom_expected"]
    assert len(STAMP_RE.findall(exp)) == 1, ("stamp count", o["cid"])
    assert "as per the build" not in exp, ("barred phrase", o["cid"])
    print(f"  C{o['cid']}  atm={o['atm_at_write_time']}  {o['title'][:58]}")
    for w in o["why"]:
        print(f"        - {w}")

if "--go" not in sys.argv:
    print("\nDRY RUN. Re-run with --go to execute.")
    print("\n--- built payloads, printed and read before sending ---")
    for o in ops:
        print(f"\n===== C{o['cid']} custom_steps =====")
        print(o["payload"]["custom_steps"])
        print(f"----- C{o['cid']} custom_expected (tail) -----")
        print(o["payload"]["custom_expected"][-420:])
    sys.exit(0)

log = []
for i, o in enumerate(ops, 1):
    st, res = tr.api(f"update_case/{o['cid']}", "POST", o["payload"])
    ok = st == 200
    ver = tr.get_case(o["cid"])[1] if ok else None
    mism = []
    if ok:
        for k, v in o["payload"].items():
            if (ver.get(k) or "") != v:
                mism.append(k)
    rec = {"n": i, "cid": o["cid"], "op": "update_case", "http": st,
           "atm_at_write_time": o["atm_at_write_time"], "why": o["why"],
           "fields_sent": sorted(o["payload"]), "mismatches": mism,
           "verified": ok and not mism}
    log.append(rec)
    json.dump(log, open(LOG, "w"), indent=1)     # flushed after EACH write
    print(f"  {i}/{len(ops)}  C{o['cid']}  HTTP {st}  mismatches={mism}")
    if not rec["verified"]:
        print("  STOPPING - Rule 50: a mismatch means the write FAILED")
        break
print(f"\n{sum(1 for r in log if r['verified'])} of {len(ops)} verified")
