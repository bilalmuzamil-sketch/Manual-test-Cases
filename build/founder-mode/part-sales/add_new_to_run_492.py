#!/usr/bin/env python3
"""Add the 4 new 5-Oct Part Sales cases (C236959-C236962) to Mudassir's run 492 (FM1 · Part Sales v1 · sv9667.qa), union-only (Rule 34),
and assign them to Mudassir (user 6). Dry run unless --apply."""
import sys, json
sys.path.insert(0, "build/founder-mode/part-sales")
from ps_lib import api
RUN, MUD, NEW = 492, 6, [236959, 236960, 236961, 236962]
def tests():
    out, off = [], 0
    while True:
        r = api(f"get_tests/{RUN}&limit=250&offset={off}"); t = r["tests"] if isinstance(r, dict) else r
        out += t
        if len(t) < 250: return out
        off += 250
run = api(f"get_run/{RUN}"); before = tests(); ids = sorted({t["case_id"] for t in before})
print("run", run["name"], "include_all", run["include_all"], "tests", len(before))
want = sorted(set(ids) | set(NEW))
if "--apply" not in sys.argv:
    print("[DRY] would set", len(want), "cases; new:", [c for c in NEW if c not in ids]); sys.exit()
assert not run["include_all"] and set(ids) <= set(want)
api(f"update_run/{RUN}", {"case_ids": want})
api(f"add_results_for_cases/{RUN}", {"results": [{"case_id": c, "assignedto_id": MUD} for c in NEW]})
after = tests(); got = {t["case_id"]: t for t in after}
ok = len(after) == len(before) + len([c for c in NEW if c not in ids]) and set(ids) <= set(got) \
     and all(got[c]["assignedto_id"] == MUD for c in NEW)
print("after", len(after), "tests; new assigned:", {c: got[c]["assignedto_id"] for c in NEW}, "VERIFIED" if ok else "PROBLEM")
