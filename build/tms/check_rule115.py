#!/usr/bin/env python3
"""Self-check for the Rule 115 (TestRail + TMS) overlay — standalone on purpose.

The repo's shared checkers (check_section1_size.py, check_rule_amendments.py) were found already
failing on 2026-10-27 for reasons that pre-date Rule 115, and the QA lead ruled they must NOT be
changed because other sessions rely on them. This script checks only what the Rule 115 change
touched, and nothing imports it.

    python3 build/tms/check_rule115.py        # exit 0 = all checks pass
"""
import os
import re
import subprocess
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RULES = os.path.join(ROOT, "build/rules/RULES-61-96.md")
INDEX = os.path.join(ROOT, "CLAUDE.md")
HANDOFF = os.path.join(ROOT, "build/handoffs/HANDOFF-5-TMS-CASE-MANAGEMENT.md")
POINTED = ["build/tms/TMS-FACTS.md", "build/tms/SYNC-POLICY.md", "build/tms/tr-tms-case-map.csv",
           "build/handoffs/HANDOFF-5-TMS-CASE-MANAGEMENT.md", "build/testing-tools/load_creds.py",
           "build/testing-tools/tms_client.py", "build/testing-tools/tms_sync.py"]


def main():
    fails = []
    rules, index, handoff = (open(p).read() for p in (RULES, INDEX, HANDOFF))

    # 1. Rule 115 exists exactly once, after 114, and the 109-114 headings are still intact.
    heads = re.findall(r"(?m)^## (11\d) · ", rules)
    if heads.count("115") != 1:
        fails.append("Rule 115 heading found %d times (want 1)" % heads.count("115"))
    if heads[-2:] != ["114", "115"]:
        fails.append("Rule 115 is not directly after 114: %s" % heads)
    for n in ("111", "112", "113", "114"):
        if n not in heads:
            fails.append("Rule %s heading missing" % n)

    # 2. No existing rule text was changed: the rule file differs from its pre-115 commit only by an append.
    base = subprocess.run(["git", "-C", ROOT, "log", "--format=%H", "-1", "--grep=^Rule 115:"],
                          capture_output=True, text=True).stdout.strip()
    if base:
        before = subprocess.run(["git", "-C", ROOT, "show", base + "~1:build/rules/RULES-61-96.md"],
                                capture_output=True, text=True).stdout
        if not rules.startswith(before.rstrip("\n")):
            fails.append("RULES-61-96.md changed above Rule 115 (must be append-only)")
    else:
        fails.append("could not find the 'Rule 115:' commit to compare against")

    # 3. The index carries Rule 115 in all three places: count line, critical core, rule notes.
    if "**plus Rules 109, 110, 111, 112, 113, 114 and 115**" not in index:
        fails.append("CLAUDE.md rule-count line does not include 115")
    core = index[index.index("## 1 ·"):index.index("## 2 ·")]
    if "(115).**" not in core:
        fails.append("CLAUDE.md critical core (section 1) has no Rule 115 entry")
    if "**Rule 115 (TestRail and TMS are both production systems)**" not in index:
        fails.append("CLAUDE.md rule notes have no Rule 115 paragraph")

    # 4. The handoff points at Rule 115.
    if "RULE 115" not in handoff:
        fails.append("handoff 5 does not point at Rule 115")

    # 5. Every file Rule 115 or the index sends a session to actually exists.
    for p in POINTED:
        if not os.path.exists(os.path.join(ROOT, p)):
            fails.append("pointed-to file missing: " + p)

    # 6. Size, reported against the failure the index was built to prevent (738 KB truncated on load).
    size, core_size = len(index.encode()), len(core.encode())
    print("CLAUDE.md %d bytes (section 1: %d bytes); the truncated original was 738,210 bytes" % (size, core_size))
    if size >= 738210 // 4:
        fails.append("CLAUDE.md has grown past a quarter of the size that truncated (%d bytes)" % size)

    for f in fails:
        print("FAIL:", f)
    print("Rule 115 overlay: %s" % ("ALL CHECKS PASS" if not fails else "%d FAILURE(S)" % len(fails)))
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
