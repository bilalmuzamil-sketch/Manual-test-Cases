"""finish4 - the TestRail write pass.  update_case ONLY.

Zero add / delete / section / run / result writes.  custom_atmstatus is NEVER sent.
Every write re-GETs and compares EVERY field against the intended payload, and proves
every field we did not intend to change is byte-identical.  On any mismatch the batch
STOPS (Standing Rule 50).  The per-operation log is flushed AFTER EACH WRITE.

DRY RUN by default.  Pass --go to execute.
"""
import json, re, sys
sys.path.insert(0, "/tmp/testrail"); import tr

OUT = "/home/user/Manual-test-Cases/build/schedule/finish4-2026-08-12/evidence"
LOG = f"{OUT}/testrail-oplog.json"
BUILD = "v3.5-65d6500"
STAMP = f"Last checked against build {BUILD} on 12 August 2026."
STAMP_RE = re.compile(r"Last checked against build [^\s]+ on [^.\n]*\.")

# cases whose PRECONDITIONS AND STEPS were actually walked this pass.
WALKED = [29962, 30005, 30017, 30018, 30031, 30057, 30060, 30065, 30068,
          30072, 30073, 38849, 38850, 38851, 38864, 38866, 43556, 43589]

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
        if re.search(r"</?(p|ol|li|ul|br)\b", exp):
            print(f"  C{cid}: REFUSED - the body contains raw markup; a text rewrite would double the line")
            continue
        new = restamp(exp)
        if new is None:
            print(f"  C{cid}: REFUSED - no provenance sentence to attach a build line to")
            continue
        if new == exp:
            print(f"  C{cid}: no-op, already carries {BUILD}")
            continue
        ops.append({"cid": cid, "title": c["title"], "atm": c.get("custom_atmstatus"),
                    "payload": {"custom_preconds": c.get("custom_preconds") or "",
                                "custom_steps": c.get("custom_steps") or "",
                                "custom_expected": new},
                    "why": ["re-stamp Rule-54 sentence 2 to the build this case was walked on"]})
    return ops

ops = build_ops()
print(f"\n{len(ops)} write(s) planned over {len(WALKED)} walked cases")
for o in ops:
    exp = o["payload"]["custom_expected"]
    assert len(STAMP_RE.findall(exp)) == 1, ("stamp count", o["cid"])
    assert len(re.findall(r"^AUTOMATION: ", exp, re.M)) == 1, ("marker count", o["cid"])
    assert ".;" not in exp and " .." not in exp, ("punctuation artefact", o["cid"])
print("payload self-check: one stamp, one marker, no punctuation artefact - all pass")

if "--go" not in sys.argv:
    print("\nDRY RUN. Pass --go to execute.")
    # print one built payload in full so it is READ before it is sent
    if ops:
        print("\n--- sample built payload, C%d ---" % ops[0]["cid"])
        print(ops[0]["payload"]["custom_expected"][-700:])
    sys.exit(0)

log = []
for i, o in enumerate(ops, 1):
    st, vline, _b, _a = tr.update_case_verified(o["cid"], o["payload"], label=f"finish4 {i}/{len(ops)}")
    log.append({"n": i, "cid": o["cid"], "http": st, "atm_at_write_time": o["atm"],
                "verify": vline, "why": o["why"], "result": "OK"})
    json.dump(log, open(LOG, "w"), indent=1)      # flushed AFTER EACH WRITE
    print(f"  {i}/{len(ops)} C{o['cid']} -> {st}")
print("done:", len(log), "writes")
