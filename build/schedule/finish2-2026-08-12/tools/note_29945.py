#!/usr/bin/env python3
"""C29945 gets the same treatment as C29929 and C30050: a plain tester note and HOLD.

Its step 2 tells the tester to 'Choose High under Priority' and there is nothing to
choose -- the panel's ENTIRE text is
  FILTERS Unassigned 22 Assigned 71 Approved 92 Declined 0 In Progress 0 Ready for Review 1
with no Priority heading and no High/Medium/Low, re-confirmed live this pass.

This SUPERSEDES the 12 August pass's decision to leave the marker alone. That decision
was defensible -- READY asserts automatable, not passing -- but the release is tomorrow
and a tester who cannot carry out step 2 is stranded on the morning of it.
The expected behaviour is UNCHANGED (Rule 57).
"""
import json, re, sys, os, datetime
sys.path.insert(0,"/tmp/testrail"); import tr
OUT="/home/user/Manual-test-Cases/build/schedule/finish2-2026-08-12"
OPLOG=f"{OUT}/evidence/testrail-oplog.json"
NOTE=("\nWhat you will find on the build as it stands: the Filters panel has no Priority section at "
      "all, so there is no High, Medium or Low to choose at step 2. The whole panel reads: Unassigned, "
      "Assigned, Approved, Declined, In Progress, Ready for Review.\nPlease mark this test BLOCKED, "
      "not failed, and do not raise a new problem for it - it is already written up and is waiting to "
      "be reported.\n")
HOLD="AUTOMATION: HOLD - the Priority filter this test needs does not exist in this build; a ticket cannot be raised yet"
RE_MARK=re.compile(r'AUTOMATION:\s*(?:READY - EXPECT FAIL[^\n]*|READY|HOLD[^\n]*)')
RE_STAMP=re.compile(r'Last checked against build\s+\S+?\s+on\s+[^;.\n<]+(\.|(?=;))')
NEW_SENT="Last checked against build v3.5-65d6500 on 12 August 2026."

st,c=tr.get_case(29945); assert st==200
exp=c["custom_expected"]
if NOTE.strip()[:40] in exp:
    print("note already present -- nothing to do"); sys.exit(0)
new=RE_STAMP.sub(lambda m: NEW_SENT if m.group(1)=="." else NEW_SENT[:-1], exp, count=1)
sep=new.rfind("\n---\n"); assert sep!=-1
new=new[:sep].rstrip("\n")+"\n"+NOTE+new[sep:]
new=RE_MARK.sub(HOLD, new, count=1)
print("note:",new.count("What you will find on the build as it stands"),
      "| markers:",new.count("AUTOMATION:"),"| provenance:",new.count("This is the expected behaviour as per"))
print("\n--- NEW tail ---\n", repr(new[-700:]))
if "--go" not in sys.argv: print("\nDRY RUN -- nothing sent."); sys.exit(0)
p={"custom_preconds":c["custom_preconds"],"custom_steps":c["custom_steps"],"custom_expected":new}
st2,line,_,_=tr.update_case_verified(29945,p,label="update_case")
rows=json.load(open(OPLOG)) if os.path.exists(OPLOG) else []
rows.append({"op":"update_case","cid":29945,"http":st2,
  "why":"sentence 2 re-stamped; tester note added; marker -> HOLD (Priority filter absent, re-confirmed live)",
  "result":f"HTTP {st2} + byte-verified MATCH -- {line}","at":datetime.datetime.utcnow().isoformat()+"Z"})
json.dump(rows,open(OPLOG,"w"),indent=1)
print("\nDONE:",line)
