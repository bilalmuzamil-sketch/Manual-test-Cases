#!/usr/bin/env python3
"""Job A: re-stamp Rule-54 sentence 2 on the cases this pass actually WALKED.
Job B: the two substantive divergences get the smallest change that stops a tester
       being stranded -- a plain note and an AUTOMATION: HOLD marker.

Rule 57: no expected behaviour is changed.  Sentence 1 (the SOURCE) is untouched on
every case; only sentence 2 (the RECORD OF CHECKING) moves, in neutral language.

Rule 50: all three text fields go on every payload, and every write is re-GET and
byte-compared field by field.  A mismatch STOPS the batch.
DRY RUN prints every built payload's changed region and sends nothing.
"""
import json, re, sys, os, datetime
sys.path.insert(0, "/tmp/testrail"); import tr

OUT = "/home/user/Manual-test-Cases/build/schedule/finish2-2026-08-12"
OPLOG = f"{OUT}/evidence/testrail-oplog.json"
BUILD = "v3.5-65d6500"
DATE  = "12 August 2026"
NEW_SENT = f"Last checked against build {BUILD} on {DATE}."

WALKED = json.load(open(f"{OUT}/evidence/walked-this-pass.json"))["full"]

# Stop the match at ';' so a trailing clause is PRESERVED -- C30041 carries one.
# Group 1 captures the terminator that was actually there, so a sentence that ran
# into a ';' does NOT gain a stray '.' in front of it.  (Caught in the dry run:
# the first version produced "on 12 August 2026.; the wording above ...".)
RE_STAMP = re.compile(r'Last checked against build\s+\S+?\s+on\s+[^;.\n<]+(\.|(?=;))')

TESTER_NOTE = {
  29929: ("\nWhat you will find on the build as it stands: clicking a department group "
          "header does nothing at all - the technician rows stay where they are. There is no "
          "arrow or chevron on the header to click either. This has been checked in both week "
          "and day view, on every department header on the page, and it behaves the same way "
          "every time.\nPlease mark this test BLOCKED, not failed, and do not raise a new "
          "problem for it - it is already written up and is waiting to be reported.\n"),
  30050: ("\nWhat you will find on the build as it stands: turning Tech Hours on changes "
          "nothing you can see - no working hours appear beside any technician's name. This is "
          "not because the technicians have no hours set: their hours ARE set (7:00 AM to 7:00 PM, "
          "Monday to Friday), which was checked on the staff records first.\nPlease mark this "
          "test BLOCKED, not failed, and do not raise a new problem for it - it is already "
          "written up and is waiting to be reported.\n"),
}
HOLD = {
  29929: "AUTOMATION: HOLD - the control this test needs does not exist in this build; a ticket cannot be raised yet",
  30050: "AUTOMATION: HOLD - the toggle displays nothing in this build; a ticket cannot be raised yet",
}
RE_MARK = re.compile(r'AUTOMATION:\s*(?:READY - EXPECT FAIL[^\n]*|READY|HOLD[^\n]*)')

def log(e):
    e["at"] = datetime.datetime.utcnow().isoformat() + "Z"
    rows = json.load(open(OPLOG)) if os.path.exists(OPLOG) else []
    rows.append(e); json.dump(rows, open(OPLOG, "w"), indent=1)
    print(f"  [{e['op']}] C{e.get('cid')} {e['result']}")

def build(case):
    """Return (payload, why) or (None, reason-not-needed)."""
    cid = case["id"]; exp = case["custom_expected"] or ""
    new = exp; notes = []
    if RE_STAMP.search(exp):
        # THE SKIP MUST BE "the work is already done", not "this case is exempt".
        # The first version exempted the note-carrying cases outright, so a RESUME
        # re-applied the note and C29929 came back with it twice.  A case is done when
        # it names the running build AND (if it needs a note) already carries it.
        note_done = cid not in TESTER_NOTE or TESTER_NOTE[cid].strip()[:40] in exp
        if f"build {BUILD} on" in exp and note_done:
            return None, "already names the running build" + ("" if cid not in TESTER_NOTE else " and already carries its note")
        # keep whatever terminator was there (a "." or nothing before a ";")
        new = RE_STAMP.sub(lambda m: NEW_SENT if m.group(1) == "." else NEW_SENT[:-1], new, count=1)
        notes.append("sentence 2 re-stamped")
    else:
        # no build line: append sentence 2 after sentence 1, before the marker
        m = RE_MARK.search(new)
        if not m: return None, "no marker found - not touched"
        head, tail = new[:m.start()], new[m.start():]
        head = head.rstrip("\n")
        if not head.endswith("."): head += "."
        new = head + " " + NEW_SENT + "\n\n" + tail
        notes.append("sentence 2 ADDED (case had none)")
    if cid in TESTER_NOTE:
        m = RE_MARK.search(new)
        if not m: return None, "no marker found"
        # tester note goes BEFORE the provenance block, i.e. before the '---' separator
        sep = new.rfind("\n---\n")
        if sep == -1: return None, "no provenance separator found"
        # normalise: exactly one blank line before the note, whatever was there
        new = new[:sep].rstrip("\n") + "\n" + TESTER_NOTE[cid] + new[sep:]
        new = RE_MARK.sub(HOLD[cid], new, count=1)
        notes.append("tester note added; marker -> HOLD")
    if new == exp: return None, "no change"
    return ({"custom_preconds": case["custom_preconds"],
             "custom_steps": case["custom_steps"],
             "custom_expected": new}, "; ".join(notes))

def main():
    dry = "--go" not in sys.argv
    cases = json.load(open("/tmp/testrail/SCHED-CASES.json"))
    by = {c["id"]: c for c in cases}
    targets = sorted(set(WALKED) | set(TESTER_NOTE))
    plan = []
    for cid in targets:
        st, live = tr.get_case(cid)
        if st != 200: raise RuntimeError(f"pre-read C{cid} HTTP {st}")
        p, why = build(live)
        if p is None:
            print(f"SKIP C{cid}: {why}"); continue
        plan.append((cid, p, why, live))
    print(f"\n=== PLAN: {len(plan)} write(s) ===")
    for cid, p, why, live in plan:
        old = live["custom_expected"]; new = p["custom_expected"]
        # print ONLY the changed region so it can actually be read
        i = 0
        while i < min(len(old), len(new)) and old[i] == new[i]: i += 1
        j = 0
        while j < min(len(old), len(new)) - i and old[-1-j] == new[-1-j]: j += 1
        print(f"\n--- C{cid} [{why}]")
        print("   OLD:", repr(old[max(0,i-60):len(old)-j+60]))
        print("   NEW:", repr(new[max(0,i-60):len(new)-j+60]))
    if dry:
        print("\nDRY RUN -- nothing sent.  Re-run with --go to execute."); return
    print(f"\n=== EXECUTING {len(plan)} writes ===")
    for n, (cid, p, why, live) in enumerate(plan, 1):
        try:
            st, line, before, after = tr.update_case_verified(cid, p, label="update_case")
            log({"op": "update_case", "cid": cid, "http": st, "why": why,
                 "result": f"HTTP {st} + byte-verified MATCH -- {line}"})
        except Exception as e:
            log({"op": "update_case", "cid": cid, "result": f"FAILED: {str(e)[:400]}"})
            print("\nSTOPPING THE BATCH -- Rule 50: a mismatch means the write FAILED.")
            raise
        if n % 5 == 0: print(f"   ... {n}/{len(plan)}")
    print(f"\nDONE: {len(plan)} writes, all HTTP 200 + byte-verified.")

main()
