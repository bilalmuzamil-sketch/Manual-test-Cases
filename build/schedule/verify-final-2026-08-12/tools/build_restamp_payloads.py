#!/usr/bin/env python3
"""build_restamp_payloads.py — build the Rule-54 sentence-2 re-stamp payloads and
PROVE them before anything is sent.

Two re-stamp defects have already bitten this workspace today, BOTH of the same
class: the byte-check PASSED because the write was faithful to a payload that was
itself wrong.

  1. a regex stopped inside the version string   -> '...on 8/12/2026.5-af3a6e1...'
  2. startswith() was used on a sentence that sits MID-LINE, so nothing matched
     and the case silently kept its stale stamp

So this builder:
  * matches the build token with \\S+ (NEVER [^.]*, which stops inside 'v3.5-...')
  * matches on the literal sentence anywhere in the field, never startswith()
  * asserts EXACTLY ONE match per case before building anything
  * asserts the rebuilt field differs from the original in EXACTLY the stamp
  * asserts the new field contains exactly one stamp, one provenance line and one
    automation marker
  * prints every built payload's tail so a human reads it before it is sent

Sentence 1 - the SOURCE of the expectation - is NEVER touched (Rules 54/57).
Only sentence 2, the record of what the case was last checked against, moves.
"""
import json, re, sys

NEW_BUILD = "v3.5-65d6500"
NEW_DATE = "12 August 2026"

STAMP = re.compile(r"Last checked against build (\S+) on ([^.\n]*)\.")
PROV = re.compile(r"This is the expected behaviour as per")
MARK = re.compile(r"AUTOMATION: (?:READY - EXPECT FAIL \([^)]*\)|READY|HOLD[^\n]*)")

todo = json.load(open("/tmp/sched/todo.json"))
cases = {c["id"]: c for c in json.load(open("/tmp/sched/live-2026-08-12b.json"))}

payloads, problems = {}, []
for cid in todo:
    c = cases[cid]
    old = c["custom_expected"]

    m = STAMP.findall(old)
    if len(m) != 1:
        problems.append((cid, "stamp count %d" % len(m)))
        continue
    old_build, old_date = m[0]
    if "/" not in old_date and "August" not in old_date and "Aug" not in old_date:
        problems.append((cid, "unrecognised date %r" % old_date))
        continue
    if old_build == NEW_BUILD:
        problems.append((cid, "already on %s" % NEW_BUILD))
        continue

    new = STAMP.sub("Last checked against build %s on %s." % (NEW_BUILD, NEW_DATE),
                    old, count=1)

    # the rebuilt field must differ ONLY in the stamp sentence
    if old.replace("Last checked against build %s on %s." % (old_build, old_date), "@@") != \
       new.replace("Last checked against build %s on %s." % (NEW_BUILD, NEW_DATE), "@@"):
        problems.append((cid, "collateral change in rebuilt field"))
        continue
    if len(STAMP.findall(new)) != 1:
        problems.append((cid, "rebuilt has %d stamps" % len(STAMP.findall(new))))
        continue
    if len(PROV.findall(new)) != 1:
        problems.append((cid, "rebuilt has %d provenance lines" % len(PROV.findall(new))))
        continue
    if len(MARK.findall(new)) != 1:
        problems.append((cid, "rebuilt has %d markers" % len(MARK.findall(new))))
        continue
    if NEW_BUILD not in new or ("on %s." % NEW_DATE) not in new:
        problems.append((cid, "new stamp not present"))
        continue
    # the classic bug: a version fragment left stranded in the text
    if re.search(r"\d{4}\.\d[-\w]*", new):
        problems.append((cid, "STRANDED VERSION FRAGMENT"))
        continue

    payloads[cid] = {
        "old_build": old_build, "old_date": old_date,
        "custom_preconds": c.get("custom_preconds") or "",
        "custom_steps": c.get("custom_steps") or "",
        "custom_expected": new,
    }

json.dump(payloads, open("/tmp/sched/restamp-payloads.json", "w"), indent=1)

print("built %d payloads, %d problems" % (len(payloads), len(problems)))
for p in problems:
    print("  PROBLEM", p)
print()
print("=== EVERY BUILT PAYLOAD'S TAIL, read before sending ===")
for cid in todo:
    if cid not in payloads:
        continue
    e = payloads[cid]["custom_expected"]
    i = e.find("This is the expected behaviour")
    print("C%d  [was %s / %s]" % (cid, payloads[cid]["old_build"], payloads[cid]["old_date"]))
    print("   " + e[i:].replace("\n", "\\n"))
if problems:
    sys.exit(1)
