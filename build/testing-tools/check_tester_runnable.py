#!/usr/bin/env python3
"""Rule 115 gate — a build-verified case must be FULLY understandable and FULLY runnable by a manual tester.

Scans the TESTER-FACING text of each case (preconditions + steps + the Expected ABOVE the
`Source —` provenance block) for the two failure modes the QA lead barred on 2026-10-05 after the
manual tester (Nebojsa Glavinic) reported Dashboard cases he could not understand or run:

  (a) DEVELOPER JARGON in tester-facing text — internal codes, endpoint/API/payload, authorization
      failure / HTTP codes, server-side / p95 / circuit breaker / MAX_EXECUTION_TIME, latency in ms,
      requirement ids (S1-R6 / FR-0xx / NFR-0xx). These belong ONLY in the Source provenance block (Rule 54/110).
  (b) A NOT-HAND-TESTABLE check still marked AUTOMATION: READY — performance/latency budgets, APM/
      server-timing, the circuit breaker: these can only be proven with developer tooling, so a case
      that rests on them is not a manual READY case.

The `Source —` / `Exact quotes` provenance block is NOT scanned (requirement ids and the verbatim source
quote legitimately live there). Vladimir's cases (created_by==1) and any other protected author are skipped.

Exit 0 = clean. Exit 1 = at least one case flagged (fix the wording or re-mark, never ship).

Usage:
    python3 build/testing-tools/check_tester_runnable.py --cases 88595,88631
    python3 build/testing-tools/check_tester_runnable.py --bodies /tmp/cln/dash-live-1005.json
    python3 build/testing-tools/check_tester_runnable.py --cases 88595 --creds /tmp/testrail/creds.json
"""
import argparse, base64, json, os, re, sys, time, urllib.request
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from load_creds import testrail_creds, testrail_host

# --- jargon barred from tester-facing text (case-insensitive unless noted) ---
# (regex, human label, case_sensitive?) — case_sensitive=True means match exactly as written
JARGON = [
    (r'\b[a-z]+[A-Z][a-zA-Z]*\b', 'internal camelCase code (e.g. reportsPageAccess)', True),
    (r'\bendpoints?\b', 'endpoint', False),
    (r'\bAPIs?\b', 'API', True),                       # the acronym only, not "capital" etc.
    (r'\bpayloads?\b', 'payload', False),
    (r'\bauthorization failure\b', 'authorization failure', False),
    (r'\bHTTP\b', 'HTTP', True),
    (r'\bserver[- ]side\b', 'server-side', False),
    (r'\bp9[0-9]\b', 'p95/p99 percentile', False),
    (r'\bcircuit breaker\b', 'circuit breaker', False),
    (r'MAX_EXECUTION', 'MAX_EXECUTION_TIME', True),
    (r'\bAPM\b', 'APM', True),
    (r'\bserver timing\b', 'server timing', False),
    (r'\b\d+\s?ms\b', 'latency in milliseconds', False),
    (r'\bmilliseconds?\b', 'milliseconds', False),
    (r'\bS\d+-[RN]\d+\b', 'requirement id (S#-R#)', True),
    (r'\bFR-\d+\b', 'requirement id (FR-0xx)', True),
    (r'\bNFR-\d+\b', 'requirement id (NFR-0xx)', True),
]
# tokens that mean "only provable with developer tooling" -> never a manual READY case
NOT_HAND = [r'\bp9[0-9]\b', r'\bAPM\b', r'\bserver timing\b', r'performance tooling',
            r'\bcircuit breaker\b', r'MAX_EXECUTION', r'\b\d+\s?ms\b']
# allowed: a one-line caveat that a SUB-aspect is a dev check (main check stays manual) -> warn only
CAVEAT = [r'cannot be done by hand', r'cannot be proven by hand', r'developer/automated check', r'not by eye']

# --- Rule 115 precondition-runnability (QA lead 2026-10-05, 2nd complaint: preconditions were wrong) ---
# A precondition must let the tester REACH the start state by hand: exact role+permissions, the gating
# settings, and concrete UI-buildable data. These patterns are the two real defects the tester found.
VAGUE_ROLE = re.compile(
    r'as configured|e\.g\. via|signed in with the permissions the step needs|with the permissions the step|'
    r'signed in with the (?:right |invoicing |correct )?permissions\b|'
    r'signed in with the permissions\b|as a user with the (?:right )?permissions', re.I)
# a concrete role names the actual role word
NAMES_ROLE = re.compile(r'\b(logged in|signed in) as (?:an? )?(admin|owner|technician|service advisor|'
                        r'office user|parts|vendor|sales|reduced-role|view-only)', re.I)
# a Work Order / org setting that gates behaviour
NAMES_SETTING = re.compile(r'Require (Approval|Review|Tech Stor|Mileage|Engine Hours|Ordering|Receiving|Picking)', re.I)
# a bare state assertion with no "how to reach it"
STATE_ASSERT = re.compile(r'\b(a work order with|a work order whose|an already-invoiced|an invoiced work order|'
                          r'a WO with a|set up:\s|with a Needs Approval line|whose lines are all|'
                          r'a selection (mixing|holding)|the work order has|parts awaiting receipt|'
                          r'a line (that )?holds?|holding received parts|one holding received)\b', re.I)
# L0049: opening an existing record is NOT building the state; a non-trivial state needs BUILD steps
BUILD = re.compile(r'\b(add(ed)? (a|one|two|three|four|another|the|more)|left as added|click (&ldquo;|")?order|'
                   r'order on (it|each|every|that|the)|you (approve|decline|complete|invoice)|approve and then|'
                   r'and then (complete|add|receive)|decline it|receive it|create (a|the|an)|invoice (it|from)|'
                   r'typed in by hand|seed(ed)?|create custom role)\b', re.I)
# a concrete UI setup route (creating/opening the record / navigating to it)
HAS_ROUTE = re.compile(r'top menu|>\s|&gt;|create a (work order|customer)|open a work order by|'
                       r'Customers\s*&gt;|New Customer|add a (labour|labor|part) line|'
                       r'open (its|the|a) [^.]*?(tab|report|row|run|record|page|screen|panel|list)|'
                       r'from (Customers|the [^.]*? sidebar|the [^.]*? menu)|'
                       r'in the (history |run )?table|left sidebar|click &ldquo;|click "', re.I)


def precond_issues(case):
    """Return list of precondition problems (Rule 115 amendment)."""
    pre = strip_tags(case.get('custom_preconds'))
    issues = []
    if VAGUE_ROLE.search(pre) or not NAMES_ROLE.search(pre):
        if VAGUE_ROLE.search(pre):
            issues.append('vague role (name the exact role + permissions)')
    if STATE_ASSERT.search(pre) and not NAMES_SETTING.search(pre) and not HAS_ROUTE.search(pre):
        issues.append('asserts a start state but names no gating setting and no UI setup route')
    elif STATE_ASSERT.search(pre) and not BUILD.search(pre):
        issues.append('asserts a start state but never says how to BUILD it (opening a record is not building the state)')
    return issues


def strip_tags(s):
    s = s or ''
    s = re.sub(r'</li>|</p>|<br ?/?>', '\n', s)
    return re.sub(r'<[^>]+>', ' ', s)


def tester_text(case):
    pre = strip_tags(case.get('custom_preconds'))
    st = strip_tags(case.get('custom_steps'))
    # separated-steps template
    for s in (case.get('custom_steps_separated') or []):
        st += ' ' + strip_tags(s.get('content', '')) + ' ' + strip_tags(s.get('expected', ''))
    exp = case.get('custom_expected') or ''
    exp = re.split(r'Source\s*&mdash;|Source\s*—|Source &#8212;|Exact quotes', exp)[0]
    exp = strip_tags(exp)
    return pre + '\n' + st + '\n' + exp


def marker(case):
    e = case.get('custom_expected') or ''
    m = re.search(r'AUTOMATION:\s*(READY|HOLD|[A-Za-z ]+)', e)
    return (m.group(1).strip() if m else 'NONE')


def scan_case(case):
    t = tester_text(case)
    jh = []
    for pat, label, cs in JARGON:
        flags = 0 if cs else re.I
        if re.search(pat, t, flags):
            ex = re.search(pat, t, flags).group(0)
            jh.append(f'{label} ("{ex}")')
    nh = [p for p in NOT_HAND if re.search(p, t, re.I)]
    cav = [p for p in CAVEAT if re.search(p, t, re.I)]
    return jh, nh, cav


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cases')
    ap.add_argument('--bodies', help='local JSON {cid: case} to scan instead of fetching')
    ap.add_argument('--creds', default='/tmp/testrail/creds.json')
    ap.add_argument('--protect-authors', default='1', help='created_by ids to SKIP (default Vladimir=1)')
    ap.add_argument('--no-preconds', action='store_true', help='skip the precondition-runnability check (Rule 115 amendment)')
    a = ap.parse_args()
    protect = {int(x) for x in a.protect_authors.split(',') if x.strip()}

    cases = {}
    if a.bodies:
        cases = {str(k): v for k, v in json.load(open(a.bodies)).items()}
    else:
        email, key = testrail_creds(a.creds)
        host = testrail_host(a.creds)
        auth = base64.b64encode(f'{email}:{key}'.encode()).decode()
        def get(p, tries=6):
            for t in range(tries):
                try:
                    r = urllib.request.Request(f'{host}/index.php?/api/v2/{p}', headers={'Authorization': 'Basic ' + auth})
                    return json.load(urllib.request.urlopen(r, timeout=120))
                except Exception:
                    if t == tries - 1: raise
                    time.sleep(1.6 * (2 ** t))
        for cid in [c.strip() for c in (a.cases or '').split(',') if c.strip()]:
            cases[cid] = get(f'get_case/{cid}'); time.sleep(1.4)

    flagged = []
    warned = []
    for cid, c in sorted(cases.items(), key=lambda kv: int(kv[0])):
        if c.get('created_by') in protect:
            continue
        jh, nh, cav = scan_case(c)
        rdy = marker(c) == 'READY'
        problems = []
        if jh:
            problems.append('JARGON: ' + '; '.join(jh))
        if nh and rdy:
            problems.append('NOT-HAND-TESTABLE but READY: ' + ', '.join(sorted(nh)))
        if rdy and not a.no_preconds:
            pi = precond_issues(c)
            if pi:
                problems.append('PRECONDITION GAP: ' + '; '.join(pi))
        if problems:
            flagged.append((cid, c.get('title', ''), problems))
        elif cav:
            warned.append((cid, c.get('title', '')))

    print(f'scanned {len([c for c in cases.values() if c.get("created_by") not in protect])} cases '
          f'(skipped {sum(1 for c in cases.values() if c.get("created_by") in protect)} protected-author)')
    if warned:
        print(f'note: {len(warned)} case(s) carry a one-line "developer check" caveat with a real manual '
              f'step — allowed (Rule 115): ' + ', '.join('C' + c for c, _ in warned))
    if flagged:
        print(f'\nFAIL — {len(flagged)} case(s) violate Rule 115:')
        for cid, title, probs in flagged:
            print(f'  C{cid} :: {title}')
            for p in probs:
                print(f'       - {p}')
        sys.exit(1)
    print('PASS — all cases clear of developer jargon and no not-hand-testable case marked READY (Rule 115).')


if __name__ == '__main__':
    main()
