#!/usr/bin/env python3
"""blocker_gate.py -- REFUSE TO DECLARE A BLOCKER UNTIL IT IS PROVED.

WHY THIS EXISTS
---------------
On 2026-09-10 a single session produced FIVE false blockers. Not one was the product; every one was
this session's own automation, reported as the product being broken:

  1. work order lines were searched for inside `.q-expansion-item` -- lines are TABLE ROWS
  2. the LAST three-dots button was taken as the toolbar menu -- it is a LINE's menu
  3. a menu that never opened was recorded as "the item is absent"
  4. "Receive" was called broken because no dialog appeared -- it NAVIGATES to a receive page, and
     the page was described five seconds in, before it rendered
  5. a role was driven through a script; the script failed, so "roles cannot be saved" was reported
     -- they save perfectly well through the screen

The QA lead had ALREADY unblocked two of these by hand on earlier days. Rule 97 ("search the repo
first") did not catch them, because these are a different class: not "the answer is written down
somewhere", but **"my instrument is broken and I blamed the patient"**.

THE RULE THIS ENFORCES
----------------------
A NEGATIVE claim -- absent, missing, impossible, blocked, cannot, does nothing -- is only admissible
when the same investigation proves the instrument worked. Seven proofs, all required.

USAGE
-----
    python3 build/testing-tools/blocker_gate.py --new "receive does nothing" > /tmp/claim.json
    # fill the file in, then:
    python3 build/testing-tools/blocker_gate.py --check /tmp/claim.json

Exit 0 = proved, you may report it. Exit 1 = NOT A BLOCKER YET, with the specific gaps named.
Nothing may be written to a BLOCKED-*.md file, a defect candidate, or a Blocked/Failed result whose
reason is "unavailable", until this exits 0.
"""
import argparse, json, sys, textwrap, signal

# piping this into `head` must not produce a traceback
try: signal.signal(signal.SIGPIPE, signal.SIG_DFL)
except (AttributeError, ValueError): pass

PROOFS = [
    ("positive_control",
     "Did the SAME method find this kind of thing somewhere else in this run?",
     "Without this you cannot tell a missing thing from a broken locator. Example: the Print item "
     "looked absent on four work order statuses -- the selector was opening a line's menu, not the "
     "toolbar's. One positive control would have exposed it instantly."),
    ("tried_through_the_screen",
     "Was it reproduced the way a USER does it -- clicking the real UI?",
     "A claim about the PRODUCT cannot rest on an API or script route alone. Roles were reported as "
     "unsaveable purely because a scripted write failed; through Settings they save fine."),
    ("waited_and_retried",
     "At least 2 attempts, and the page confirmed quiet before observing?",
     "A panel that never opened and a panel with nothing in it look identical. A page mid-navigation "
     "looks like a page with nothing on it."),
    ("checked_for_navigation",
     "Did the action navigate, open a tab, or change the URL?",
     "'Receive' was called broken because no dialog appeared. It navigates to a receive page. "
     "Always record url-before vs url-after and the tab count."),
    ("precondition_read_back",
     "Was the state you claim to be testing actually built, and read back?",
     "Observing the wrong state and reporting the result is worse than not observing. Read the state "
     "back from the system before trusting any observation about it."),
    ("searched_the_repo",
     "Rule 97: exact error text grepped across the repo, playbook, skills and BLOCKED-*.md?",
     "A committed harness is reused, never rebuilt. Several BLOCKED-*.md files are already RESOLVED."),
    ("asked_what_would_make_this_my_fault",
     "Name the most likely way this is YOUR mistake, and say how you ruled it out.",
     "This is the one that catches the rest. If you cannot name a plausible self-fault, you have not "
     "looked hard enough -- five for five on 2026-09-10 were self-faults."),
]

TEMPLATE_NOTE = ("fill each proof with: passed true/false, and 'evidence' naming a file, a log line "
                 "or a measurement. 'passed': true with empty evidence is rejected.")


def new_claim(claim):
    return {
        "claim": claim,
        "_note": TEMPLATE_NOTE,
        "proofs": {k: {"passed": False, "evidence": "", "_question": q} for k, q, _ in PROOFS},
    }


def check(path):
    try:
        data = json.load(open(path))
    except Exception as e:
        print("cannot read the claim file: %s" % e); return 2

    claim = data.get("claim", "(unnamed claim)")
    proofs = data.get("proofs", {})
    gaps = []
    for key, question, why in PROOFS:
        p = proofs.get(key) or {}
        if not p.get("passed"):
            gaps.append((key, question, why, "not passed"))
        elif not str(p.get("evidence", "")).strip():
            gaps.append((key, question, why, "passed but NO EVIDENCE given"))

    print("=" * 78)
    print("BLOCKER GATE -- %s" % claim)
    print("=" * 78)
    if not gaps:
        print("PROVED. %d of %d proofs carry evidence." % (len(PROOFS), len(PROOFS)))
        for key, _, _ in PROOFS:
            print("  [ok] %-32s %s" % (key, proofs[key]["evidence"][:70]))
        print("\nYou may report this as a blocker. State what it does NOT block (Rule 68).")
        return 0

    print("NOT A BLOCKER YET -- %d of %d proofs missing.\n" % (len(gaps), len(PROOFS)))
    for key, question, why, state in gaps:
        print("  [MISSING] %s  (%s)" % (key, state))
        print("      %s" % question)
        for line in textwrap.wrap(why, 72):
            print("      %s" % line)
        print()
    print("Do NOT write this into a BLOCKED-*.md file, a defect candidate, or a result whose reason")
    print("is 'unavailable'. Close the gaps above first. If a gap genuinely cannot be closed, say so")
    print("in the report AS AN UNCLOSED GAP -- never as a proved blocker.")
    return 1


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--new", metavar="CLAIM", help="print a blank claim file for this claim")
    g.add_argument("--check", metavar="FILE", help="check a filled-in claim file")
    g.add_argument("--questions", action="store_true", help="just list the seven proofs")
    a = ap.parse_args()

    if a.questions:
        for i, (k, q, why) in enumerate(PROOFS, 1):
            print("%d. %s\n   %s\n   %s\n" % (i, k, q, why))
        return 0
    if a.new:
        print(json.dumps(new_claim(a.new), indent=1)); return 0
    return check(a.check)


if __name__ == "__main__":
    sys.exit(main())
