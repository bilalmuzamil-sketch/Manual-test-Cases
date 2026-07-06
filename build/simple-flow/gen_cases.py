#!/usr/bin/env python3
"""Sanity check for the Simple Flow case JSON files.

Loads the three group files, validates the schema of every case, and asserts
that every case ID is unique across the whole set. Prints counts by area
bucket, priority and VIU status. Run before building the workbook.
"""
import json
import os
import sys
from collections import Counter

BASE = os.path.dirname(os.path.abspath(__file__))
CASES_DIR = os.path.join(BASE, "cases")

GROUP_FILES = [
    "group-A-settings-completion.json",
    "group-B-receiving-vendor.json",
    "group-C-review-permissions-validation-edge.json",
]

REQUIRED_KEYS = [
    "id", "area", "story_ref", "title", "priority", "type",
    "permissions_required", "preconditions", "steps", "expected",
    "design_ref", "viu_status", "notes",
]
VALID_VIU = {"VIU-Verified", "VIU-Pending", "Open-Question"}


def load_cases():
    cases = []
    for gf in GROUP_FILES:
        with open(os.path.join(CASES_DIR, gf), encoding="utf-8") as fh:
            cases.extend(json.load(fh))
    return cases


def main():
    cases = load_cases()
    errors = []
    ids = []
    for c in cases:
        cid = c.get("id", "<no id>")
        for k in REQUIRED_KEYS:
            if k not in c:
                errors.append(f"{cid}: missing key '{k}'")
        for arr in ("preconditions", "steps", "expected"):
            if not isinstance(c.get(arr), list) or not c.get(arr):
                errors.append(f"{cid}: '{arr}' must be a non-empty list")
        if c.get("viu_status") not in VALID_VIU:
            errors.append(f"{cid}: bad viu_status '{c.get('viu_status')}'")
        ids.append(cid)

    dups = [x for x, n in Counter(ids).items() if n > 1]
    if dups:
        errors.append(f"DUPLICATE IDS: {dups}")

    print(f"Total cases: {len(cases)}")
    print(f"Unique IDs: {len(set(ids))}")
    print("By VIU status:", dict(Counter(c["viu_status"] for c in cases)))
    print("By priority:", dict(Counter(c["priority"] for c in cases)))

    if errors:
        print("\nSANITY CHECK FAILED:")
        for e in errors:
            print("  -", e)
        sys.exit(1)
    print("\nSANITY CHECK PASSED: schema valid, all IDs unique.")


if __name__ == "__main__":
    main()
