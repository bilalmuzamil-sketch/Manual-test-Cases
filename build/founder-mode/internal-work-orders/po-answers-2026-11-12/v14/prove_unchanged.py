#!/usr/bin/env python3
"""Proof for the v1.4 named set (14 Nov 2026): every case outside the named set builds to EXACTLY its earlier text.
Compares authoring/proposals.json now with the same file at commit 83ba7fe37 (the last commit before the named-set pass, which build.py
reproduced byte for byte on 14 Nov 2026), key by key, as canonical JSON (every field: section, title, refs, codes, automation, held, api,
prd_version and the four TestRail fields). Expected: the 606+ live cases outside the named set and the 22 library-only cases identical; the 34
touched live cases changed; S12-24 (CONFIRM) identical; the 54 drafts changed (rebuilt on v1.4); S12-49 gone.
   python3 prove_unchanged.py     (exit 1 if any case outside the named set differs)"""
import json, subprocess, os, sys, csv
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(os.path.dirname(H)); REPO = subprocess.check_output(["git", "rev-parse", "--show-toplevel"], cwd=H, text=True).strip()
REL = os.path.relpath(f"{P}/authoring/proposals.json", REPO)
BEFORE = json.loads(subprocess.check_output(["git", "show", f"83ba7fe37:{REL}"], cwd=REPO))
NOW = json.load(open(f"{P}/authoring/proposals.json"))
sys.path.insert(0, f"{P}/authoring")
MAP = {r["key"] for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
CHANGE = ["D-68", "S12-04", "S12-11", "S12-13", "S12-15", "S12-21", "S12-27", "S12-28", "S12-30", "S12-33", "S12-36", "S12-43", "S12-46", "S2-100", "S2-35", "S7-20"]
REQUOTE = ["API-22", "API-27", "S12-23", "S12-25", "S12-35", "S12-37", "S12-38", "S12-39"]
DESIGNREF = ["D-69", "S12-05", "S12-07", "S12-08", "S12-09", "S12-14", "S12-44", "S12-47", "S12-48", "S12P-08"]
TOUCHED = set(CHANGE + REQUOTE + DESIGNREF)
DRAFTS = {k for k in BEFORE if k not in MAP and not BEFORE[k]["automation"].startswith("AUTOMATION: HOLD - a tester cannot set this up")}
canon = lambda v: json.dumps(v, sort_keys=True, ensure_ascii=False)
others = [k for k in BEFORE if k not in TOUCHED and k not in DRAFTS]
diff_others = [k for k in others if k not in NOW or canon(NOW[k]) != canon(BEFORE[k])]
live_others = [k for k in others if k in MAP]; lib_only = [k for k in others if k not in MAP]
touched_changed = sorted(k for k in TOUCHED if canon(NOW[k]) != canon(BEFORE[k]))
drafts_now = sorted(k for k in DRAFTS if k in NOW); dropped = sorted(DRAFTS - set(NOW))
new_keys = sorted(set(NOW) - set(BEFORE))
out = {"before_commit": "83ba7fe37", "cases_before": len(BEFORE), "cases_now": len(NOW),
       "live_outside_named_set": len(live_others), "library_only_outside_named_set": len(lib_only),
       "outside_named_set_differing": diff_others, "S12-24_identical": canon(NOW["S12-24"]) == canon(BEFORE["S12-24"]),
       "touched": len(TOUCHED), "touched_changed": len(touched_changed), "touched_unchanged": sorted(TOUCHED - set(touched_changed)),
       "drafts_before": len(DRAFTS), "drafts_now": len(drafts_now), "drafts_changed": sum(canon(NOW[k]) != canon(BEFORE[k]) for k in drafts_now),
       "dropped": dropped, "new_keys": new_keys}
json.dump(out, open(f"{H}/prove-unchanged.json", "w"), indent=1)
print(json.dumps(out, indent=1))
ok = not diff_others and out["S12-24_identical"] and not out["touched_unchanged"] and dropped == ["S12-49"] and not new_keys
print("PROOF", "PASSED" if ok else "FAILED")
sys.exit(0 if ok else 1)
