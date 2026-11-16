"""Proof that moving the library to PRD v38 changes no case outside the named set (16 Nov 2026). Compares the rendered TestRail fields and
folder of every case in proposals.json now against the copy taken before this pass (v38/proposals-before.json). Run from build/tiered-pricing
after authoring/build.py. Exit 1 on any unexpected difference."""
import json, sys
sys.path.insert(0, 'authoring')
B = json.load(open('po-answers-2026-11-16/v38/proposals-before.json')); A = json.load(open('authoring/proposals.json'))
I = json.load(open('po-answers-2026-11-16/IMPACT-CASES.json')); V = {c['key']: c['verdict'] for c in I['cases']}
NEW = ["S2-79", "S3-46", "S3-47", "S4-42", "S4-43", "S4-44", "S8-13", "S9-39", "S19-24"]
F = ["title", "refs", "custom_preconds", "custom_steps", "custom_expected", "template_id", "type_id", "priority_id", "custom_automation_type", "custom_atmstatus"]
out = {"unchanged_outside_named_set": 0, "unexpected": [], "named_set_changed": {}, "named_set_identical": [], "deleted_gone": [], "new_added": []}
for k, b in B.items():
    if k not in A:
        (out["deleted_gone"] if V.get(k) == "DELETE" else out["unexpected"]).append(k); continue
    a = A[k]
    diff = [f for f in F if a["fields"][f] != b["fields"][f]] + (["folder"] if a["sec"] != b["sec"] or (b["section_id"] and a["section_id"] != b["section_id"]) else [])
    if k in V and V[k] != "DELETE":
        if diff: out["named_set_changed"][k] = diff
        else: out["named_set_identical"].append(k)
    elif diff: out["unexpected"].append((k, diff))
    else: out["unchanged_outside_named_set"] += 1
for k in A:
    if k not in B: (out["new_added"] if k in NEW else out["unexpected"]).append(k)
json.dump(out, open('po-answers-2026-11-16/v38/prove-unchanged.json', 'w'), indent=1)
print("outside the named set, byte-identical:", out["unchanged_outside_named_set"], "| unexpected:", out["unexpected"])
print("named set changed:", len(out["named_set_changed"]), "| identical:", out["named_set_identical"])
print("deleted:", len(out["deleted_gone"]), "| new:", len(out["new_added"]))
sys.exit(1 if out["unexpected"] else 0)
