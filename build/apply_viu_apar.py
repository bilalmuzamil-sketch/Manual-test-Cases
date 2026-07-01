#!/usr/bin/env python3
"""Follow-up B4: replace the toggle label 'Manage AP/AR' with 'View and Manage AP/AR Data'
everywhere it denotes the toggle/permission. Uses lookarounds so already-converted
'View and Manage AP/AR Data' strings are not touched. Idempotent."""
import json
import os
import re
from collections import Counter

BUILD = os.path.dirname(os.path.abspath(__file__))
FILES = ["sp-crud.json", "sp-noncrud.json", "te.json", "combo.json"]

# 'Manage AP/AR' NOT already preceded by 'View and ' and NOT followed by ' Data'
PAT = re.compile(r"(?<!View and )Manage AP/AR(?! Data)")
counts = Counter()


def fix(text):
    if text is None:
        return text
    new, n = PAT.subn("View and Manage AP/AR Data", text)
    counts["B4_manage_apar_label"] += n
    return new


for fname in FILES:
    path = os.path.join(BUILD, fname)
    data = json.load(open(path))
    for c in data:
        c["permission"] = fix(c.get("permission"))
        c["expected_final"] = fix(c.get("expected_final"))
        c["preconditions"] = fix(c.get("preconditions"))
        c["role_setup"] = fix(c.get("role_setup"))
        c["test_data"] = fix(c.get("test_data"))
        for s in c.get("steps", []):
            s["action"] = fix(s["action"])
            s["expected"] = fix(s["expected"])
    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

print(dict(counts))
