#!/usr/bin/env python3
"""build_tech_payloads.py — the Technician-session writes, built and PROVEN before
anything is sent.

WHAT MOVES:  the automation marker, and Rule-54 SENTENCE 2 only.
WHAT DOES NOT MOVE:  the expected behaviour, and Rule-54 sentence 1.  The build is
the CHECK, never the AUTHOR (Rule 57) - what the technician was observed doing does
not become the expectation, it decides the verdict.

PRECONDITIONS AND STEPS: verified against the build on all six cases and found
EXECUTABLE AS WRITTEN, so none is edited.  A correction we do not need is a
correction we must not make.
"""
import json, re, sys

NEW = "Last checked against build v3.5-65d6500 on 12 August 2026."
STAMP = re.compile(r"Last checked against build (\S+) on ([^.\n]*)\.")
MARK = re.compile(r"AUTOMATION: (?:READY - EXPECT FAIL \([^)]*\)|READY|HOLD[^\n]*)")
PROV = re.compile(r"This is the expected behaviour as per")

# cid -> (new marker, stamp override or None)
PLAN = {
    # driven end to end as the Technician (Schedule: View, no Edit, no Delete); every
    # item of each case observed and passing.
    30074: ("AUTOMATION: READY", None),
    30075: ("AUTOMATION: READY", None),
    30082: ("AUTOMATION: READY", None),
    # partly settled: the items this user CAN reach were observed and pass; the rest
    # needs a user this estate does not have.  The reason is sharpened to name the
    # exact missing thing rather than "a second sign-in", which is now done.
    30044: ("AUTOMATION: HOLD - point 4 needs a user with no staff record of their own; "
            "points 1 to 3 are observed and pass",
            "Last checked against build v3.5-65d6500 on 12 August 2026 (points 1 to 3 only)."),
    38872: ("AUTOMATION: HOLD - points 1 and 3 need a user with no Schedule permission "
            "and a user with Schedule Edit but not Delete; point 2 is observed and passes",
            "Last checked against build v3.5-65d6500 on 12 August 2026 (point 2 only)."),
    38874: ("AUTOMATION: HOLD - point 2 needs a user without Work Orders View; "
            "point 1 is observed and passes",
            "Last checked against build v3.5-65d6500 on 12 August 2026 (point 1 only)."),
}

cases = {c["id"]: c for c in json.load(open("/tmp/sched/live-after-restamp.json"))}
out, problems = {}, []

for cid, (marker, stamp) in PLAN.items():
    c = cases[cid]
    old = c["custom_expected"]
    stamp = stamp or NEW

    if len(STAMP.findall(old)) != 1:
        problems.append((cid, "stamp count %d" % len(STAMP.findall(old)))); continue
    if len(MARK.findall(old)) != 1:
        problems.append((cid, "marker count %d" % len(MARK.findall(old)))); continue

    body_before = old.split("This is the expected behaviour")[0]
    new = STAMP.sub(stamp, old, count=1)
    new = MARK.sub(marker, new, count=1)

    # the expected behaviour itself must be byte-identical
    if new.split("This is the expected behaviour")[0] != body_before:
        problems.append((cid, "EXPECTED BEHAVIOUR CHANGED")); continue
    # sentence 1 must be byte-identical
    s1_old = old.split("This is the expected behaviour")[1].split("Last checked against build")[0]
    s1_new = new.split("This is the expected behaviour")[1].split("Last checked against build")[0]
    if s1_old != s1_new:
        problems.append((cid, "PROVENANCE SENTENCE 1 CHANGED")); continue
    for pat, n, what in ((STAMP, 1, "stamps"), (MARK, 1, "markers"), (PROV, 1, "provenance")):
        if len(pat.findall(new)) != n:
            problems.append((cid, "rebuilt has %d %s" % (len(pat.findall(new)), what)))
    if re.search(r"\d{4}\.\d[-\w]*", new):
        problems.append((cid, "STRANDED VERSION FRAGMENT")); continue
    if "v3.5-65d6500" not in new:
        problems.append((cid, "new build token missing")); continue

    out[cid] = {"custom_preconds": c.get("custom_preconds") or "",
                "custom_steps": c.get("custom_steps") or "",
                "custom_expected": new,
                "_was": STAMP.findall(old)[0][0],
                "_marker_was": MARK.findall(old)[0]}

json.dump(out, open("/tmp/sched/tech-payloads.json", "w"), indent=1)
print("built %d payloads, %d problems" % (len(out), len(problems)))
for p in problems:
    print("  PROBLEM", p)
print("\n=== EVERY BUILT PAYLOAD'S TAIL, read before sending ===")
for cid in sorted(out):
    e = out[cid]["custom_expected"]
    i = e.find("This is the expected behaviour")
    print("C%d  [stamp was %s | marker was %s]" % (cid, out[cid]["_was"], out[cid]["_marker_was"]))
    print("   " + e[i:].replace("\n", "\\n") + "\n")
if problems:
    sys.exit(1)
