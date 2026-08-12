#!/usr/bin/env python3
"""build_surface_payloads.py — the writes earned by the two surface probes.

WHAT MOVES: a step label that would strand a tester, one stale known-issue note
that the build has since contradicted, the automation marker, and Rule-54
sentence 2.

WHAT DOES NOT MOVE: the expected behaviour.  C30061's expected result uses
shorthand names for the three scope options that differ from the build's wording;
that is REPORTED in DIVERGENCES.md for the QA lead, NOT silently rewritten, because
editing an expectation is not ours to do.
"""
import json, re, sys

STAMP = re.compile(r"Last checked against build (\S+) on ([^.\n]*)\.")
MARK = re.compile(r"AUTOMATION: (?:READY - EXPECT FAIL \([^)]*\)|READY|HOLD[^\n]*)")
PROV = re.compile(r"This is the expected behaviour as per")
NEW = "Last checked against build v3.5-65d6500 on 12 August 2026."

NO_TICKET = ("AUTOMATION: HOLD - an observed fault on this case has no ticket number yet, "
             "so it cannot carry an expect-fail marker")

# the stale note on C30034, replaced wholesale
C30034_OLD = ("Known issue on the build tested: The tooltip listed ALL FIVE line names on the "
              "5-line series shift with no \"+N more lines\" row.")
C30034_NEW = (
    "Known issue on the build tested: the tooltip shows the VIN only when the 'VIN Number' "
    "toggle inside 'Filter & display' is switched ON. With that toggle OFF the tooltip shows "
    "the unit on its own (for example 'G30'); with it ON the same tooltip reads "
    "'G30 - VIN 12-06696'. The expected behaviour above asks for the VIN whenever the unit has "
    "one, whichever way the toggle is set. It has been reported to the QA lead but has no "
    "developer ticket yet. Mark this test FAILED for that point only and note it in your run "
    "comment; do not raise a new ticket without asking the QA lead. The rest of point 2 now "
    "matches the expected behaviour: on a six-line shift the tooltip listed exactly three line "
    "names and a '+3 more lines' row. An earlier note on this case said all five line names "
    "were listed with no overflow row - that is no longer what the build does.")

cases = {c["id"]: c for c in json.load(open("/tmp/sched/live-final.json"))}
out, problems, changed_fields = {}, [], {}

for cid in (29946, 30058, 30059, 30061, 30034):
    c = cases[cid]
    pre = c.get("custom_preconds") or ""
    steps = c.get("custom_steps") or ""
    exp = c["custom_expected"]
    orig_body = exp.split("This is the expected behaviour")[0]
    fields = []

    if cid == 30059:
        # THE RUNNABILITY FIX: the step names a scope option that does not exist under
        # that wording.  The build's option reads 'This and all later shifts'.
        if "'this and everything after'" not in steps:
            problems.append((cid, "step label not found as expected")); continue
        steps = steps.replace("'this and everything after'", "'This and all later shifts'")
        fields.append("custom_steps")

    if cid == 30034:
        if C30034_OLD not in exp:
            problems.append((cid, "stale note not found verbatim")); continue
        head, _, tail = exp.partition(C30034_OLD)
        # the stale note runs to the end of its paragraph
        rest = tail.split("\n\n---", 1)
        exp = head + C30034_NEW + "\n\n---" + rest[1] if len(rest) > 1 else None
        if exp is None:
            problems.append((cid, "could not locate the note's paragraph end")); continue
        exp = MARK.sub(NO_TICKET, exp, count=1)
        fields.append("custom_expected(note+marker)")
        orig_body = None            # this case's body legitimately changes

    exp = STAMP.sub(NEW, exp, count=1)
    fields.append("stamp")

    for pat, n, what in ((STAMP, 1, "stamps"), (MARK, 1, "markers"), (PROV, 1, "provenance")):
        if len(pat.findall(exp)) != n:
            problems.append((cid, "rebuilt has %d %s" % (len(pat.findall(exp)), what)))
    if re.search(r"\d{4}\.\d[-\w]*", exp):
        problems.append((cid, "STRANDED VERSION FRAGMENT")); continue
    if orig_body is not None and exp.split("This is the expected behaviour")[0] != orig_body:
        problems.append((cid, "EXPECTED BEHAVIOUR CHANGED")); continue

    out[cid] = {"custom_preconds": pre, "custom_steps": steps, "custom_expected": exp}
    changed_fields[cid] = fields

json.dump(out, open("/tmp/sched/surface-payloads.json", "w"), indent=1)
print("built %d payloads, %d problems" % (len(out), len(problems)))
for p in problems:
    print("  PROBLEM", p)
print()
for cid in sorted(out):
    print("C%d  changes: %s" % (cid, ", ".join(changed_fields[cid])))
    if cid == 30059:
        print("   STEP 1 -> " + out[cid]["custom_steps"].split("\n")[0])
    e = out[cid]["custom_expected"]
    i = e.find("This is the expected behaviour")
    if cid == 30034:
        print("   NOTE   -> " + e[e.find("Known issue"):i].replace("\n", "\\n")[:520])
    print("   TAIL   -> " + e[i:].replace("\n", "\\n"))
    print()
if problems:
    sys.exit(1)
