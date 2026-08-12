import json, re, sys, datetime
sys.path.insert(0, "/tmp/testrail"); import tr
OUT = "/home/user/Manual-test-Cases/build/schedule/finish4-2026-08-12/evidence"
BUILD = "v3.5-65d6500"

cases = tr.get_cases(1, 1)
secs = json.load(open("/tmp/testrail/SCHED-SECTIONS.json"))
sched = [c for c in cases if str(c["section_id"]) in secs]
print("live Schedule cases:", len(sched), " ours (created_by=3):", sum(1 for c in sched if c.get("created_by") == 3))

kinds = {"READY": 0, "EXPECT-FAIL": 0, "HOLD": 0, "NONE": 0}
cur, nostamp, raw, doubled, nodate = 0, 0, 0, 0, 0
for c in sched:
    e = c.get("custom_expected") or ""
    m = re.findall(r"^AUTOMATION: ([^\n]*)", e, re.M)
    if not m: kinds["NONE"] += 1
    elif "EXPECT FAIL" in m[0]: kinds["EXPECT-FAIL"] += 1
    elif m[0].startswith("HOLD"): kinds["HOLD"] += 1
    else: kinds["READY"] += 1
    if len(m) > 1: doubled += 1
    st = re.findall(r"Last checked against build (\S+) on", e)
    if not st: nostamp += 1
    elif st[0] == BUILD: cur += 1
    if re.search(r"</?(p|ol|li|ul|br)\b", e): raw += 1
    if not re.search(r"read on \d", e): nodate += 1

gate = kinds["READY"] + kinds["EXPECT-FAIL"]
print("markers:", kinds, "gate:", gate, "| total - HOLD =", len(sched) - kinds["HOLD"])
print("GATE CLOSES BOTH WAYS:", gate == len(sched) - kinds["HOLD"])
print("naming the running build:", cur, "| no build line:", nostamp, "| doubled markers:", doubled, "| raw markup:", raw)
print("cases with no per-source read date:", nodate)

# the walked union
pos = json.load(open(f"{OUT}/position.json"))
f4 = [29962, 30005, 30017, 30018, 30031, 30057, 30060, 30065, 30068, 30072, 30073,
      38849, 38850, 38851, 38864, 38866, 43556, 43589]
walked = sorted(set(pos["walked_now"]) | set(f4))
rem = sorted(set(c["id"] for c in sched) - set(walked))
print("\nWALKED UNION:", len(walked), "of", len(sched), "| never walked:", len(rem))
holdrem = [i for i in rem if re.search(r"^AUTOMATION: HOLD", (next(c for c in sched if c["id"] == i).get("custom_expected") or ""), re.M)]
print("of those, already HOLD:", len(holdrem), "| genuinely remaining:", len(rem) - len(holdrem))
print("remaining ids:", rem)
json.dump({"read_at": datetime.datetime.utcnow().isoformat() + "Z", "n": len(sched), "ours": sum(1 for c in sched if c.get("created_by") == 3),
           "kinds": kinds, "gate": gate, "build_current": cur, "no_stamp": nostamp, "raw": raw, "doubled": doubled,
           "walked": walked, "remaining": rem, "remaining_hold": holdrem, "finish4_walked": f4},
          open(f"{OUT}/final-state.json", "w"), indent=1)
