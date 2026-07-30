#!/usr/bin/env python3
"""Stage-2b sense repairs found by the Rule-28 gate on this pass (3 cases).

Fail condition hit: "expected result doesn't follow from the steps" — three
expected lines added by APPLY-PLAN §2 assert BEHAVIOUR while the steps only
LOOKED at the buttons. Fixed by adding the one driving step each needs.
Recorded as a deliberate divergence from the plan's own §2 pre-check (which
scored these SENSIBLE); see RULE28-AUDIT-2026-07-31.md §divergences.
"""
import json, glob, os
CASES = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "cases")

files = {f: json.load(open(f)) for f in sorted(glob.glob(os.path.join(CASES, "cases-*.json")))}


def get(cid):
    for f, cs in files.items():
        for c in cs:
            if c["id"] == cid:
                return c
    raise KeyError(cid)


# --- R1 · FLT-PARTS-01: expected 11/12 asserted behaviour with no driving step
c = get("FLT-PARTS-01")
assert len(c["steps"]) == 9, len(c["steps"])
c["steps"].append("10. On each page above, open one of its filter buttons, look at the list of choices inside it, and pick a value to check the list changes.")
c["notes"] += (" SENSE REPAIR 2026-07-31 (Rule-28 Stage 2b): step 10 added because expected "
               "11 and 12 assert behaviour (every shown button really filters; the choices "
               "come from the shop's data) that steps 1-9 never drove. This is the "
               "ALL-EIGHT-VIEWS check and deliberately does NOT duplicate FLT-PARTS-11, "
               "which is the single-page apply-behaviour case.")

# --- R2 · FLT-RPTS-01: same fail condition
c = get("FLT-RPTS-01")
assert len(c["steps"]) == 15, len(c["steps"])
c["steps"].append("16. On each report above, open one of its filter buttons, look at the list of choices inside it, and pick a value to check the report changes.")
c["notes"] += (" SENSE REPAIR 2026-07-31 (Rule-28 Stage 2b): step 16 added because expected "
               "22 and 23 assert behaviour (every shown button really filters; the choices "
               "come from the shop's data) that steps 1-15 never drove. This is the "
               "ALL-REPORTS check and deliberately does NOT duplicate FLT-RPTS-21, which "
               "is the single-report apply-behaviour case.")

# --- R3 · FLT-PARTS-12: expected 1 asserts the button shows the picks; step 2 didn't look
c = get("FLT-PARTS-12")
assert c["steps"][1] == "2. Try selecting more than one choice."
c["steps"][1] = "2. Select more than one choice, then look at the filter button."
c["notes"] += (" SENSE REPAIR 2026-07-31 (Rule-28 Stage 2b): step 2 now says to look at the "
               "filter button, because expected 1 asserts the button shows what you picked.")

for f, cs in files.items():
    json.dump(cs, open(f, "w"), indent=1, ensure_ascii=False)
    open(f, "a").write("\n")
print("3 sense repairs applied: FLT-PARTS-01 step 10, FLT-RPTS-01 step 16, FLT-PARTS-12 step 2")
