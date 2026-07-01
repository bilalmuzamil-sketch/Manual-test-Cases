#!/usr/bin/env python3
"""Follow-up: rewrite the two prose-form financial-modal expectations (SP-FIN-004/005)
to the ACTUAL VIU-11 wording. Idempotent (skips if already applied)."""
import json
import os

BUILD = os.path.dirname(os.path.abspath(__file__))
NOTE = " [Build-vs-spec: spec wording differed — see VIU-11.]"

ACTUAL = {
    "SP-FIN-004": ('A financial confirm modal appears. Actual (VIU-11): title '
                   '"Enable See Financial Data?"; body "Part Sales requires See '
                   'Financial Data. Enable it to grant this permission?"; buttons '
                   '"Cancel" / "Enable". Cancel reverts the checkbox.' + NOTE),
    "SP-FIN-005": ('A financial confirm modal appears. Actual (VIU-11): title '
                   '"Enable See Financial Data?"; body "Invoicing & Payments requires '
                   'See Financial Data. Enable it to grant this permission?"; buttons '
                   '"Cancel" / "Enable". Cancel reverts the checkbox.' + NOTE),
}

n = 0
data = json.load(open(os.path.join(BUILD, "sp-noncrud.json")))
for c in data:
    if c["test_id"] in ACTUAL:
        for s in c["steps"]:
            if ("financial confirm modal appears" in s["expected"]
                    and "verify exact modal text" in s["expected"]):
                s["expected"] = ACTUAL[c["test_id"]]
                n += 1
with open(os.path.join(BUILD, "sp-noncrud.json"), "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write("\n")
print(f"Rewrote {n} prose financial-modal expectations (SP-FIN-004/005).")
