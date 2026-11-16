"""PRD v38 and Matt Barge's answers (16 Nov 2026): the NAMED SET. Loaded after every other case module.

QA lead, 16 Nov 2026, verbatim choices: "Named set, write it (Recommended)"; "Wait for his canvas (Recommended)" (pictures untouched);
"Add both to the sheet (Recommended)" (follow-ups F1/F2 = questions 32/33). Plan: po-answers-2026-11-16/IMPACT.md and IMPACT-CASES.json.

The cases themselves were rewritten in their own files (cases_s2.py ... cases_design_batch_b.py; the edits are kept as scripts in
po-answers-2026-11-16/v38/patches/); the 25 deleted design-version cases were moved to po-answers-2026-11-16/v38/deleted-library-cases.py.
This module only (1) re-stamps the AUTOMATION marker of every case this pass writes to TestRail to the day it was checked against PRD v38,
and (2) proves the named set is exactly what the plan lists. Cases outside the named set keep their 11/14/2026 marker and their text: the
library's PRD moved to page v38 for every case, and po-answers-2026-11-16/v38/prove_unchanged.py proves their rendered TestRail fields are
byte-identical to the 16 Nov write."""
import json, os
from tp_lib import CASES, P
TODAY38 = "11/16/2026"
MARKER38 = f"AUTOMATION: Not available on Build to test Yet - Last checked {TODAY38}"
IMP = json.load(open(f"{P}/po-answers-2026-11-16/IMPACT-CASES.json"))
V = {c["key"]: c["verdict"] for c in IMP["cases"]}
NEW = ["S2-79", "S3-46", "S3-47", "S4-42", "S4-43", "S4-44", "S8-13", "S9-39", "S19-24"]
assert len(NEW) == len(IMP["new_cases"]) == 9
WRITE = sorted([k for k, v in V.items() if v in ("CHANGE", "REWRITE", "RELEASE", "REFS-ONLY")])       # updated in TestRail (49)
NO_WRITE = sorted([k for k, v in V.items() if v in ("LIBRARY-ONLY", "CONFIRMED (checked)")])          # tester text and refs unchanged (9)
DELETED = sorted([k for k, v in V.items() if v == "DELETE"])                                          # 25
BY = {c["key"]: c for c in CASES}
assert not [k for k in DELETED if k in BY], "a deleted case is still in the library"
assert all(k in BY for k in WRITE + NO_WRITE + NEW), [k for k in WRITE + NO_WRITE + NEW if k not in BY]
for k in WRITE + NEW:
    c = BY[k]
    if not c["marker"].startswith("AUTOMATION: HOLD"): c["marker"] = MARKER38
HELD38 = sorted(k for k in WRITE + NEW if BY[k]["held"])       # S3-40, held on question 33
assert HELD38 == ["S3-40"], HELD38
