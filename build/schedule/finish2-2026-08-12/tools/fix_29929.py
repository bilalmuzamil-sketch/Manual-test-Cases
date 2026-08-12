#!/usr/bin/env python3
"""Repair C29929: the resume re-applied the tester note, so it appears TWICE.

Cause, recorded so it is not repeated: restamp.py's skip condition was
    if "build <BUILD> on" in exp and cid not in TESTER_NOTE: skip
so the two note-carrying cases were DELIBERATELY exempted from the skip -- which is
right the first time and wrong on a resume.  The correct guard is to skip when the
note is ALREADY present.  Found by reconciling the operation count (39 writes over 38
cases) against the plan, not by chance.
"""
import json, sys, datetime, os
sys.path.insert(0, "/tmp/testrail"); import tr
OUT="/home/user/Manual-test-Cases/build/schedule/finish2-2026-08-12"
OPLOG=f"{OUT}/evidence/testrail-oplog.json"
NOTE_KEY="What you will find on the build as it stands"
BLOCK_KEY="Please mark this test BLOCKED"

st, c = tr.get_case(29929)
assert st == 200, st
exp = c["custom_expected"]
n = exp.count(NOTE_KEY)
print("note occurrences before:", n)
if n <= 1:
    print("nothing to repair"); sys.exit(0)
# keep the FIRST note, drop every later copy: split on the note start and rebuild
i1 = exp.index(NOTE_KEY)
i2 = exp.index(NOTE_KEY, i1 + 1)
# the second copy runs to the end of its BLOCKED line
end = exp.index("\n", exp.index(BLOCK_KEY, i2)) + 1
new = exp[:i2] + exp[end:]
new = new.replace("\n\n\n", "\n\n")
print("note occurrences after :", new.count(NOTE_KEY))
print("markers:", new.count("AUTOMATION:"), "| provenance:", new.count("This is the expected behaviour as per"))
print("\n--- NEW (changed region) ---")
print(repr(new[i1-80:i1+80]), "...", repr(new[-260:]))
if "--go" not in sys.argv:
    print("\nDRY RUN -- nothing sent."); sys.exit(0)
payload={"custom_preconds":c["custom_preconds"],"custom_steps":c["custom_steps"],"custom_expected":new}
st2,line,before,after = tr.update_case_verified(29929, payload, label="update_case")
rows=json.load(open(OPLOG)) if os.path.exists(OPLOG) else []
rows.append({"op":"update_case","cid":29929,"http":st2,
             "why":"REPAIR - the resume re-applied the tester note; the duplicate copy removed",
             "result":f"HTTP {st2} + byte-verified MATCH -- {line}",
             "at":datetime.datetime.utcnow().isoformat()+"Z"})
json.dump(rows, open(OPLOG,"w"), indent=1)
print("\nREPAIRED:", line)
