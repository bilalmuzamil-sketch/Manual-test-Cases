#!/usr/bin/env python3
"""plain_check.py -- REFUSE TO SEND THE QA LEAD ANYTHING WRITTEN IN OUR SHORTHAND.

WHY THIS EXISTS
---------------
Rule 103 was recorded on 2026-09-10 after asks were written in case ids and endpoint names. Hours
later this went to him anyway, in a STATUS line rather than an ask:

    "R418 now: 114 Passed - 1 Failed - 2 Blocked - 7 Untested - and both remaining Blocked
     (C44993, C44994) plus the 7 Untested are all settled verdicts waiting only on your go-ahead
     to file the one Declined ticket."

His reply: *"you must always keep things simple for me to understand, for EVERYTHING you share with
me ALL THE TIME."* So the standard is not "asks are plain". It is **everything is plain**, and this
script is the check that makes it real instead of remembered.

USAGE
    python3 build/testing-tools/plain_check.py draft.md
    echo "some text" | python3 build/testing-tools/plain_check.py -

Exit 0 = clean. Exit 1 = rewrite it, with each offending phrase named and why it fails.

REFERENCE TRAILER
    Ids are allowed AFTER a line containing only:  ---REFERENCE---
    Rule 8 still wants the C-id and its link recorded; it just may not carry the meaning.
"""
import re, sys, signal
try: signal.signal(signal.SIGPIPE, signal.SIG_DFL)
except (AttributeError, ValueError): pass

BANNED = [
    (r'\bR\d{3}\b', 'a run number', 'say "the Inline Add and Edit Parts tests" — he does not hold run numbers in his head'),
    (r'\bC\d{5}\b', 'a case id', 'describe what the test checks; put the id in the reference trailer'),
    (r'\bT\d{6,}\b', 'a test id', 'same as a case id — describe the check instead'),
    (r'\bSV-\d+\b', 'a ticket key', 'say what the ticket is about; the key goes in the trailer'),
    (r'\b(?:6597|6617|418|419)\b', 'a suite or run number', 'name the feature in words'),
    (r'/api/[\w\-/{}]+', 'an API path', 'say what the user was doing, not what the software called'),
    (r'\b(?:HTTP\s*)?(?:200|201|400|401|404|405|409|500|502)\b(?!\s*(?:parts|cases|tests))',
     'an HTTP status code', 'say "it worked" / "it was refused" / "it errored"'),
    (r'\b(?:GET|POST|PUT|PATCH|DELETE)\b', 'an HTTP verb', 'describe the action in plain words'),
    (r'\bdata-test-id\b|\btestid\b|\bselector\b|\blocator\b', 'a code-level name',
     'describe the button or field by the label the user sees'),
    (r'\bprobe\d*\b', 'a probe name', 'say what was checked, not the name of my script'),
    (r'\bpayload\b|\bendpoint\b|\bDOM\b|\bregex\b|\bJSON\b|\bAPI\b', 'developer jargon',
     'rewrite in the words a service advisor would use'),
    (r'\bprecondition[s]?\b', 'test-writing jargon', 'say "what has to be set up first"'),
    (r'\bverdict[s]?\b', 'our word', 'say "result" or "pass/fail"'),
    (r'\bsettled\b', 'our word', 'say "already checked and written up"'),
    (r'\bprovenance\b|\bid-map\b|\bmarker\b|\bfr-view\b', 'our internal vocabulary', 'drop it or explain it'),
    (r'\bblocked[- ]as[- ]unavailable\b|\bnot observed\b', 'our status vocabulary',
     'say "could not be checked, because ..."'),
    (r'\bclause\s*\d', 'our numbering', 'say which requirement in words'),
    (r'\bcl\.\s*\d', 'our numbering', 'say which requirement in words'),
]

# a bare status tally like "114 Passed - 1 Failed - 2 Blocked - 7 Untested"
TALLY = re.compile(r'\d+\s+(?:Passed|Failed|Blocked|Untested)\b.*?\d+\s+(?:Passed|Failed|Blocked|Untested)\b',
                   re.IGNORECASE)


def check(text):
    body = text.split('---REFERENCE---')[0]
    problems = []
    for line_no, line in enumerate(body.splitlines(), 1):
        if line.lstrip().startswith('>'):      # a quote of his own words is exempt
            continue
        for pat, what, fix in BANNED:
            for m in re.finditer(pat, line):
                problems.append((line_no, m.group(0), what, fix))
    for m in TALLY.finditer(body):
        problems.append((0, m.group(0)[:60], 'a bare status tally',
                         'say what the numbers MEAN: what is finished, what is left, and what he must do'))
    return problems


def main():
    if len(sys.argv) != 2:
        print(__doc__); return 2
    text = sys.stdin.read() if sys.argv[1] == '-' else open(sys.argv[1]).read()
    problems = check(text)
    if not problems:
        print("PLAIN — nothing in this would make him stop and decode.")
        return 0
    print("REWRITE THIS — %d thing(s) he would have to decode:\n" % len(problems))
    seen = set()
    for line_no, frag, what, fix in problems:
        key = (frag, what)
        if key in seen: continue
        seen.add(key)
        where = ("line %d" % line_no) if line_no else "somewhere"
        print("  %-22s %s (%s)" % (repr(frag)[:22], where, what))
        print("      -> %s\n" % fix)
    print("Rule 103: everything he reads leads with what a USER would see, why it matters, and what")
    print("he must do. Ids and keys go after a '---REFERENCE---' line, never carrying the meaning.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
