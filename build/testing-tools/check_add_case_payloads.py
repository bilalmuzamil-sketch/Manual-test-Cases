#!/usr/bin/env python3
"""GUARD — scan the repo for `add_case` payloads that would flag a case as Automated.

Run this before executing any push that creates cases:

    python3 build/testing-tools/check_add_case_payloads.py            # scan everything
    python3 build/testing-tools/check_add_case_payloads.py build/schedule/foo/push.py

Exit 0 = clean · exit 1 = at least one live hazard found.

WHAT IT LOOKS FOR
-----------------
Any source line assigning `custom_atmstatus` the value 3, in Python or JS/MJS. `3` means
"Automated" and is the automation engineer's flag to set, not ours (CLAUDE.md "Durable key
facts -> TestRail"; Standing Rules 38 and 65). A case we create has not been automated by
anyone, so it is 1 ("Not Automated").

ALREADY-EXECUTED SCRIPTS ARE REPORTED SEPARATELY, NOT AS FAILURES
-----------------------------------------------------------------
Thirteen scripts in this repo hardcode `3` and have all already been run. They are the audit
record of what was actually executed and were deliberately left byte-identical rather than
rewritten (the reasoning is in
build/automated-flag-and-c30041-2026-08-11/FIELD-FACTS.md section 4, and Standing Rule 46:
editing an audit record so it describes a write that never happened is its own defect).

They are listed in KNOWN_EXECUTED below so this guard can tell them apart from a NEW hazard.
The operative danger they pose is that somebody COPIES one, which is exactly what this script
exists to catch — so they are printed loudly every run, with the instruction to copy the
payload from build/testing-tools/testrail_add_case.py instead.
"""
import os
import re
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# Executed one-off push scripts that carry the historical `3`. Left byte-identical on purpose;
# see the module docstring. A file NOT on this list is a NEW hazard and fails the guard.
KNOWN_EXECUTED = {
    "build/fees-discounts/exec_sync_2026-07-22.py",
    "build/filters/branko-answers-2026-07-31/exec_push.py",
    "build/filters/design-2026-07-31/push/exec_push_design12.py",
    "build/filters/tech-plan-2026-07-29/exec_sync_2026-07-30.py",
    "build/report-suite/authenticity-2026-07-31/exec_push_closing_2026-07-31.py",
    "build/report-suite/chris-answers-2026-07-31/exec_push_2026-07-31.py",
    "build/report-suite/chris-answers-2026-08-01/exec_push_2026-08-03.mjs",
    "build/report-suite/chris-newreqs-2026-08-05/tools/audit.py",
    "build/report-suite/chris-newreqs-2026-08-05/tools/exec.py",
    "build/report-suite/chris-update-2026-07-29/exec_chris_push_2026-07-29.py",
    "build/report-suite/reconciliation-2026-07-28/exec_push_2026-07-28.py",
    "build/report-suite/tech-plan-2026-07-29/exec_techplan_push_2026-07-30.py",
    "build/report-suite/viu-push-2026-08-04/new_cases.py",
    "build/schedule/coverage-rederivation-2026-07-31/exec_sync_coverage_2026-07-31.py",
    "build/schedule/exec_sync_2026-07-22.py",
    "build/schedule/exec_sync_epic_2026-07-27.py",
    "build/schedule/exec_sync_techplan_2026-07-30.py",
    "build/schedule/panel-collapse-2026-08-11/tools/push.py",
    "build/simple-flow/sell-price-investigation-2026-07-29/exec_push_2026-07-29.py",
    "build/simple-flow/sv8183/exec_corrective_2026-07-24.py",
    # This guard and the canonical builder both mention the value in prose/constants.
    "build/testing-tools/check_add_case_payloads.py",
    "build/testing-tools/testrail_add_case.py",
}

# Matches a real payload ENTRY, not prose that happens to mention the value:
#   "custom_atmstatus": 3,      'custom_atmstatus': 3}      custom_atmstatus: 3)
#   payload["custom_atmstatus"] = 3          (end of line)
# The trailing (?=[,}\)]|\s*$) is what keeps English sentences out — a prose line reads
# "... custom_atmstatus = 3 AUTOMATED) ..." or "custom_atmstatus:3 + custom_automation_type:0",
# where the 3 is followed by a word rather than a delimiter or end-of-line.
ASSIGN = re.compile(
    r"""custom_atmstatus["']?\s*(?::|=|\]\s*=)\s*3\s*(?=[,}\)]|$)""")

# A DIFFERENT hazard, and a nastier one: a post-write VERIFIER that treats `3` as the PASS
# condition. It does not create anything wrong — it declares a correctly-created case a
# FAILURE, so it would push a future pass back towards `3` to make its own check go green.
# Reported as a warning rather than a failure, because these sit in executed audit records too.
VERIFIER = re.compile(
    r"""custom_atmstatus["']?\s*(?:\)?\s*==\s*3\b|["']\s*,\s*3\s*\)|["']\s*,\s*3\s*,)""")
KNOWN_VERIFIERS = {
    "build/report-suite/chris-newreqs-2026-08-05/tools/audit.py",
    "build/report-suite/chris-update-2026-07-29/exec_chris_push_2026-07-29.py",
    "build/report-suite/reconciliation-2026-07-28/exec_push_2026-07-28.py",
    "build/report-suite/tech-plan-2026-07-29/exec_techplan_push_2026-07-30.py",
    "build/report-suite/authenticity-2026-07-31/exec_push_closing_2026-07-31.py",
    "build/report-suite/chris-answers-2026-07-31/exec_push_2026-07-31.py",
    "build/filters/tech-plan-2026-07-29/exec_sync_2026-07-30.py",
    "build/schedule/exec_sync_2026-07-22.py",
    "build/schedule/exec_sync_epic_2026-07-27.py",
    "build/schedule/exec_sync_techplan_2026-07-30.py",
    "build/simple-flow/sell-price-investigation-2026-07-29/exec_push_2026-07-29.py",
    "build/testing-tools/check_add_case_payloads.py",
    "build/testing-tools/testrail_add_case.py",
}

# CORRECTED 2026-08-11 (Schedule follow-up push, item 4). These three were the live warning
# this guard raised on 2026-08-11: each printed "atmstatus==3" as the thing to look for, which
# would read a correctly-created case (1) as broken. Each now states 1 as the EXPECTED value
# and keeps a `== 3` comparison ONLY to report the exception, which is a positive duty under
# Standing Rule 65 (a case TestRail flags as Automated must be reported to Vlad when we change
# it). So the comparison is legitimate here and is registered rather than removed — removing it
# would delete the Rule-65 report along with the hazard.
KNOWN_VERIFIERS |= {
    "build/filters/read-dates-2026-08-11/tools/snap.py",
    "build/schedule/read-dates-2026-08-11/tools/final_verify.py",
    "build/schedule/read-dates-2026-08-11/tools/snap.py",
}
SKIP_DIRS = {".git", "__pycache__", "node_modules", ".venv"}
EXTS = {".py", ".js", ".mjs", ".cjs", ".ts"}


def scan(paths):
    new_hazards, known, verifiers = [], [], []
    for path in paths:
        rel = os.path.relpath(path, REPO)
        try:
            with open(path, "r", errors="replace") as fh:
                lines = fh.readlines()
        except OSError:
            continue
        for n, line in enumerate(lines, 1):
            hit = (rel, n, line.rstrip())
            if ASSIGN.search(line):
                (known if rel in KNOWN_EXECUTED else new_hazards).append(hit)
            elif VERIFIER.search(line) and rel not in KNOWN_VERIFIERS:
                verifiers.append(hit)
    return new_hazards, known, verifiers


def walk(root):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for f in filenames:
            if os.path.splitext(f)[1] in EXTS:
                yield os.path.join(dirpath, f)


def main(argv):
    targets = [os.path.abspath(a) for a in argv[1:]] or list(walk(REPO))
    new_hazards, known, verifiers = scan(targets)

    if verifiers:
        print(f"WARN — {len(verifiers)} verifier(s) treat custom_atmstatus == 3 as a PASS "
              f"condition, so they would call a correctly-created case a failure:")
        for rel, n, line in sorted(verifiers):
            print(f"  {rel}:{n}  {line.strip()[:100]}")
        print("  ^ verify against 1 ('Not Automated') — see "
              "testrail_add_case.py::verify_created_case()\n")

    if known:
        print(f"NOTE — {len(known)} hit(s) in already-executed scripts, left byte-identical on "
              f"purpose as the audit record of what was run:")
        for rel, n, line in sorted(known):
            print(f"  {rel}:{n}  {line.strip()[:100]}")
        print("  ^ DO NOT COPY A PAYLOAD FROM THESE. Copy it from "
              "build/testing-tools/testrail_add_case.py\n")

    if new_hazards:
        print(f"FAIL — {len(new_hazards)} NEW add_case payload(s) would flag a case as Automated:")
        for rel, n, line in sorted(new_hazards):
            print(f"  {rel}:{n}  {line.strip()[:100]}")
        print("\n`custom_atmstatus: 3` means 'Automated'. It is the automation engineer's flag to "
              "set, not ours.\nA case we create has not been automated by anyone: send 1 "
              "('Not Automated').\nUse build/testing-tools/testrail_add_case.py::add_case_payload().")
        return 1

    print(f"PASS — 0 new add_case payloads send custom_atmstatus: 3 "
          f"({len(targets)} file(s) scanned).")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
