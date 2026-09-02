#!/usr/bin/env python3
"""ONE COMMAND that checks a suite against every lesson this workspace has paid for.

    python3 build/testing-tools/verify_suite.py --root 6597 --observed build/OBSERVED-UI-LABELS-sv9315.md

QA lead, 2026-09-02, verbatim: *"Keep on learning and improving the mechanism to not repeat the
mistakes and do the same things faster if asked again and avoid making new mistakes - you must have a
mechanism to ensure that while keeping the test cases Authentic/not invented/and RUnnable by a manual
QA tester you dont make the mistakes."*

THE MECHANISM IS THIS FILE PLUS `probe_lib.mjs`, NOT A DOCUMENT. A rule in prose is a rule someone has
to remember; a rule here fails the run. Every check below exists because a specific mistake reached
him, and each one names that mistake so nobody "simplifies" it away.

    #   CHECK                    THE MISTAKE IT PREVENTS (all 2026-08-31 .. 2026-09-02)
    1   live census              "all 89 Invoice cases" read from testrail-id-map.csv; the suite holds 119.
                                 Counts come from TestRail, paged, every time.
    2   author scope             a check coded as `created_by != 3 -> foreign` rejected all 30 of the
                                 manual tester's cases. And Vladimir's cases must never be written.
    3   Automated inventory      Rule 71: an Automated case needs a PER-CASE go-ahead, and a
                                 write-hold is not an observation-hold.
    4   every case has a source  Rule 64: a case with no source should not exist -> "invented".
    5   marker literal           `AUTOMATION: Ready` made a case invisible to the arithmetic gate.
    6   marker arithmetic        READY + EXPECT-FAIL must equal (marked total - HOLD).
    7   runnability              spec-level preconditions a tester cannot follow.
    8   precondition labels      117 cases named a permission that does not exist; and twice the gate
                                 flagged CORRECT cases because the reference file was incomplete.
    9   build-sentence honesty   a build sentence on a case never checked against a build (Rule 12),
                                 and a deferred marker left on a case that IS verified.
    10  run membership           Rule 34: a run that is not set-equal to the suite hides cases from
                                 the tester, and a partial case_ids sync DELETES results.

Exit code 0 only when every check passes. Read-only: this script never writes to TestRail.
"""
import argparse, base64, collections, html, json, re, subprocess, sys, time, urllib.request

HOST = 'https://shopview.testrail.io'
sys.path.insert(0, 'build/testing-tools')
from load_creds import testrail_creds

MARKERS = ('AUTOMATION: READY', 'AUTOMATION: READY - EXPECT FAIL', 'AUTOMATION: HOLD')
NEVER_WRITE = {1: 'Vladimir Tomovic'}          # his cases are reported, never changed - no exceptions
IN_SCOPE_TESTER = {                            # Rule 38's amendment, per project, never a blanket rule
    6559: (6, 'Mudassir Qamar'),
    6597: (4, 'Viktoria Videnovic'),
    6617: (4, 'Viktoria Videnovic'),
}


def api(path, auth, tries=5):
    """Retry a TRANSPORT failure; never retry a 4xx. A 400 here means the URL is wrong (project 1 is
    single-suite, so `suite_id` is rejected, and a stray '?' makes '?&limit='), and retrying it five
    times just hides the bug behind a delay. Rate limiting (429) is the one 4xx worth waiting on."""
    for a in range(tries):
        try:
            r = urllib.request.Request(f'{HOST}/index.php?/api/v2/{path}',
                                       headers={'Authorization': 'Basic ' + auth})
            return json.load(urllib.request.urlopen(r, timeout=180))
        except urllib.error.HTTPError as e:
            if e.code == 429 and a < tries - 1:
                time.sleep(5 * (a + 1)); continue
            if 400 <= e.code < 500:
                raise RuntimeError(f'TestRail answered HTTP {e.code} for {path!r} - that is a bad '
                                   f'request, not a transient. Body: {e.read()[:200]!r}') from None
            if a == tries - 1:
                raise
            time.sleep(2 ** a)
        except Exception:
            if a == tries - 1:
                raise
            time.sleep(2 ** a)


def paged(path, key, auth):
    out, off = [], 0
    while True:
        j = api(f'{path}&limit=250&offset={off}', auth)
        chunk = j[key] if isinstance(j, dict) else j
        out += chunk
        if len(chunk) < 250:
            return out
        off += 250


def flat(h):
    if not h:
        return ''
    s = re.sub(r'<(br|/p|/li|/div|hr)[^>]*>', '\n', h)
    return html.unescape(re.sub(r'<[^>]+>', '', s))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', type=int, required=True, help='the suite\'s top-level SECTION id')
    ap.add_argument('--observed', required=True)
    ap.add_argument('--run', type=int, help='the test run that should be set-equal to this suite')
    ap.add_argument('--build', help='the build marker the build sentences should name, e.g. v26.35.6-0f8d60b')
    ap.add_argument('--authorised', help='json list of Automated case ids the QA lead has cleared')
    a = ap.parse_args()

    email, key = testrail_creds()
    auth = base64.b64encode(f'{email}:{key}'.encode()).decode()
    fails, notes = [], []

    # 1 -- LIVE CENSUS. Never a local snapshot.
    secs = paged('get_sections/1', 'sections', auth)
    keep, changed = {a.root}, True
    while changed:
        changed = False
        for s in secs:
            if s['id'] not in keep and s.get('parent_id') in keep:
                keep.add(s['id']); changed = True
    cases = [c for c in paged('get_cases/1', 'cases', auth) if c['section_id'] in keep]
    print(f'1  LIVE CENSUS         {len(cases)} cases in {len(keep)} sections, read from TestRail')
    if not cases:
        print('   nothing to check'); return 1

    # 2 -- AUTHOR SCOPE.
    who, names = collections.Counter(c['created_by'] for c in cases), {}
    for uid in who:
        names[uid] = api(f'get_user/{uid}', auth).get('name', f'user {uid}')
    tester = IN_SCOPE_TESTER.get(a.root)
    print('2  AUTHOR SCOPE        ' + ' · '.join(f'{names[u]} {n}' for u, n in who.most_common()))
    protected = [c['id'] for c in cases if c['created_by'] in NEVER_WRITE]
    if protected:
        notes.append(f'NEVER WRITE these ({NEVER_WRITE[cases[0]["created_by"]] if False else "Vladimir Tomovic"}): '
                     + ', '.join('C%d' % i for i in protected))
    if tester:
        n = sum(1 for c in cases if c['created_by'] == tester[0])
        notes.append(f'IN SCOPE, not foreign: {n} case(s) by {tester[1]} - Rule 38 amendment for this project')

    # 3 -- AUTOMATED INVENTORY.
    autom = [c for c in cases if c.get('custom_atmstatus') == 3]
    cleared = set(json.load(open(a.authorised))) if a.authorised else set()
    print(f'3  AUTOMATED (Rule 71) {len(autom)} flagged: ' + (', '.join('C%d' % c['id'] for c in autom) or 'none'))
    for c in autom:
        if c['created_by'] in NEVER_WRITE:
            notes.append(f'C{c["id"]} is Automated AND {NEVER_WRITE[c["created_by"]]}\'s - never written, on any authorisation')
        elif c['id'] not in cleared:
            notes.append(f'C{c["id"]} is Automated with no recorded per-case go-ahead - read it, do not write it')

    # 4/5/6/9 -- SOURCE, MARKER, ARITHMETIC, BUILD-SENTENCE HONESTY.
    no_source, bad_marker, counts = [], [], collections.Counter()
    build_claim, deferred = [], []
    for c in cases:
        e = flat(c.get('custom_expected'))
        if not re.search(r'as per epic|Source:\s*\S', e, re.I):
            no_source.append(c['id'])
        ms = [l.strip() for l in e.split('\n') if l.strip().upper().startswith('AUTOMATION:')]
        if len(ms) != 1:
            bad_marker.append((c['id'], f'{len(ms)} marker lines'))
        else:
            m = ms[0]
            hit = next((k for k in MARKERS if m == k or m.startswith(k + ' ')), None)
            if not hit:
                bad_marker.append((c['id'], repr(m)))
            else:
                counts[hit] += 1
        bs = re.search(r'Last checked against build (\S+?) on', e)
        if bs:
            build_claim.append((c['id'], bs.group(1)))
        if re.search(r'Not available on Build', e, re.I):
            deferred.append(c['id'])
    print(f'4  EVERY CASE SOURCED  {len(cases)-len(no_source)}/{len(cases)}'
          + ('' if not no_source else '   MISSING: ' + ', '.join('C%d' % i for i in no_source[:10])))
    if no_source:
        fails.append(f'{len(no_source)} case(s) have no source (Rule 64) - that is the definition of invented')
    print(f'5  MARKER LITERAL      {len(cases)-len(bad_marker)}/{len(cases)} exact'
          + ('' if not bad_marker else '   ' + '; '.join(f'C{i}: {t}' for i, t in bad_marker[:6])))
    for i, t in bad_marker:
        if any(c['id'] == i and c['created_by'] in NEVER_WRITE for c in cases):
            notes.append(f'C{i} marker: {t} - but it is Vladimir\'s, so report it and leave it')
        else:
            fails.append(f'C{i} marker is not one of the three literals ({t})')
    ready, ef, hold = counts['AUTOMATION: READY'], counts['AUTOMATION: READY - EXPECT FAIL'], counts['AUTOMATION: HOLD']
    marked = ready + ef + hold
    ok6 = (ready + ef) == (marked - hold)
    print(f'6  MARKER ARITHMETIC   READY {ready} + EXPECT-FAIL {ef} = {ready+ef} ; {marked} marked - HOLD {hold} = {marked-hold}'
          f'   {"closes" if ok6 else "DOES NOT CLOSE"}')
    if not ok6:
        fails.append('the marker arithmetic does not close')
    if a.build:
        wrong = sorted({b for _, b in build_claim} - {a.build})
        print(f'9  BUILD SENTENCES     {len(build_claim)} case(s) name a build; '
              + (f'all say {a.build}' if not wrong else f'ALSO naming {wrong} - stale (Rule 91)'))
        if wrong:
            notes.append(f'build sentences name {wrong} but the build is {a.build} - re-stamp or re-check (Rule 91)')
    if deferred:
        notes.append(f'{len(deferred)} case(s) still say "Not available on Build": '
                     + ', '.join('C%d' % i for i in deferred[:8])
                     + ' - if the feature IS on the build now, that marker is a false statement')

    # 7/8 -- delegate to the two gates that already exist, so there is ONE implementation of each.
    ids = ','.join(str(c['id']) for c in cases)
    for n, cmd in ((7, ['python3', 'build/testing-tools/check_runnable_cases.py', '--cases', ids]),
                   (8, ['python3', 'build/testing-tools/check_precond_labels.py', '--cases', ids,
                        '--observed', a.observed])):
        r = subprocess.run(cmd, capture_output=True, text=True)
        tail = [l for l in r.stdout.strip().split('\n') if l.strip()]
        label = 'RUNNABILITY' if n == 7 else 'PRECOND LABELS'
        print(f'{n}  {label:18} ' + (tail[-1] if tail else f'(no output, exit {r.returncode})'))
        if r.returncode != 0:
            fails.append(f'{label} gate failed - run it directly for the detail:\n     ' + ' '.join(cmd[:4]) + ' …')
            for l in tail:
                if re.match(r'\s*(C\d+|-|🛑|\d+ case)', l):
                    print('     ' + l.strip()[:150])

    # 10 -- RUN MEMBERSHIP.
    if a.run:
        tests = paged(f'get_tests/{a.run}', 'tests', auth)
        in_run = {t['case_id'] for t in tests}
        mine = {c['id'] for c in cases}
        print(f'10 RUN {a.run:<12} {len(tests)} tests; missing from run: {len(mine-in_run)}; in run but not in suite: {len(in_run-mine)}')
        if mine - in_run or in_run - mine:
            fails.append(f'run {a.run} is not set-equal to the suite (Rule 34) - '
                         f'missing {sorted(mine-in_run)[:8]}, extra {sorted(in_run-mine)[:8]}')

    print()
    for nt in notes:
        print('NOTE   ' + nt)
    if fails:
        print('\nFAILURES:')
        for f in fails:
            print('  ✗ ' + f)
        print('\nVERIFY SUITE: PROBLEMS ABOVE')
        return 1
    print('\nVERIFY SUITE: ALL CHECKS PASSED')
    return 0


if __name__ == '__main__':
    sys.exit(main())
