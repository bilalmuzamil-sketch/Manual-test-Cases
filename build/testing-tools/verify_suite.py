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
import argparse, base64, collections, html, json, os, re, subprocess, sys, time, urllib.request

HOST = 'https://shopview.testrail.io'
# Resolve sibling modules from THIS FILE's directory, not from the caller's cwd: the literal
# 'build/testing-tools' only worked when invoked from the repo root, and the marker declaration
# imported below must be findable however this script is launched.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from load_creds import testrail_creds

# 🛑 THE SANCTIONED MARKERS ARE IMPORTED, NEVER RE-TYPED HERE. Failure this prevents: this file
# used to carry the tuple as a literal, so it had to be hand-edited every time the QA lead
# sanctioned a form - and a list nobody remembers to edit flags CORRECT cases as invalid. Coded
# with only three literals, this gate failed C44937/C44938/C44939/C44942 - four CORRECT cases on a
# Rule-69 project - because rule 69 sanctions a fourth. The 2026-08-31 staging-only HOLD then
# survived the same tuple ONLY BY LUCK: it happens to start with the 'AUTOMATION: HOLD' prefix that
# was already there. The next sanctioned form will not be lucky.
# `automation_markers` declares the set ONCE, for this tool and every future one, and AUDITS that
# declaration against the documents that sanction it (rule 61 + its 2026-09-02 backfill, CLAUDE.md
# §5, 00-COMMON-CORE.md §5.0-b) in BOTH directions on every run. So a newly sanctioned marker is
# either picked up automatically, or the run STOPS and says the list is stale - it can never
# silently flag a valid case. Why a declared list and not a runtime scrape of the docs: canon
# quotes INVALID markers as counter-examples (`AUTOMATION: Ready` is in 00-COMMON-CORE.md), so a
# scraped accept-list would start accepting the exact bug check 5 exists to catch.
from automation_markers import MARKERS, DEFERRED_MARKER, classify, assert_current

# 🛑 A CASE ID HAS NO DIGIT WIDTH. Until 2026-09-03 this was `\bC(\d{5})\b`, and it is used for
# exactly one thing: re-reading a delegated gate's stdout to find which cases it flagged, so a
# PROTECTED author's case can be reported instead of failed (Rule 38). A five-digit assumption
# breaks that protection SILENTLY and in BOTH directions of the estate:
#   * C281 is a live case id in this workspace TODAY - and it is Vladimir Tomovic's. A 5-digit
#     pattern never sees it, so it drops out of `flagged`, the `flagged <= prot` suppression
#     never fires, and HIS case is reported as a gate FAILURE - the exact Rule 38 violation
#     this line exists to prevent, arriving with no error.
#   * at C100000 the same thing happens to every case in the estate.
# ANCHORING - why `\bC\d+\b` and not a bare `C\d+` or a widened digit count:
#   * the literal capital `C` plus a LEADING word boundary is the anchor, so nothing that is
#     not C-prefixed can leak in: '8/5/2026' -> nothing, 'v3.10-49b5fe3' -> nothing (the match
#     is case-SENSITIVE, so a lowercase 'c' in a git sha cannot match), 'SV-8582' -> nothing,
#     'ABC123' -> nothing (no boundary before that C).
#   * no digit floor, because C281 proves short ids are real. The residual risk is another
#     C-prefixed identifier (a parts CSV carries 'C1608054'); that direction is SAFE here - a
#     spurious id makes `flagged` a NON-subset of the protected set, so the run reports the
#     failure normally instead of suppressing it. Missing an id is what is unsafe.
CASE_ID_RE = re.compile(r'\bC(\d+)\b')

# 🛑 THESE TWO LISTS ARE HAND-MAINTAINED PEOPLE AND SECTION IDS. THEY CANNOT BE DERIVED.
# The QA lead names them; nothing in canon or TestRail states them in a machine-readable way,
# and inventing a discovery mechanism for NEVER_WRITE could WIDEN write permission, which is
# the one error this file must never make. So they stay declared - but the tool PRINTS THE
# LISTS IT ACTUALLY USED (check 2 below), so a reader can always see the scope that was
# applied rather than assuming the one they remember.
#
# HOW EACH ONE FAILS ON A VALUE IT DOES NOT KNOW - they fail in OPPOSITE directions, and that
# is deliberate:
#   NEVER_WRITE      fails SAFE-WIDE by policy: an author missing from it is merely not
#                    granted extra protection here; Rule 38 still governs by hand, and check 2
#                    prints every author found so an unknown one is visible in the output. If
#                    in doubt ADD a uid - erring wide costs nothing, erring narrow means
#                    someone writes to a protected case.
#   IN_SCOPE_TESTER  fails NARROW, and that is the dangerous one: a project whose root section
#                    is not a key here gets NO in-scope note, so a newly named tester's cases
#                    read as foreign. That is precisely the Rule-38-amendment failure that
#                    rejected all 30 of Mudassir Qamar's cases. The run therefore says so out
#                    loud when the root section is unknown, instead of staying quiet.
#
# 🛑 UPDATE BOTH OF THESE WHEN THE QA LEAD NAMES A NEW MANUAL QA TESTER, A NEW PROJECT/SUITE
# ROOT SECTION, OR A NEW PROTECTED AUTHOR. Last confirmed 2026-09-01 (CLAUDE.md §1, Rule 38
# bullet: "invoice refresh os for the manual QA tester Mudassir. 6597/6617 is for Viktoria.").
# Nothing else in this file needs changing; add the row and re-run.
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

    # 0 -- PROVE THE MARKER LIST IS CURRENT BEFORE JUDGING ANY CASE AGAINST IT. This runs before
    # the first TestRail call so a stale list stops the run instead of producing verdicts nobody
    # should trust. It raises StaleMarkerList - loudly, with what to add and where.
    n_forms = assert_current()
    print(f'0  MARKER LIST          {n_forms} sanctioned forms, audited against CLAUDE.md §5, '
          f'rule 61 and 00-COMMON-CORE.md §5.0-b - current')

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
    # SPEED. Paging the whole project meant 4,600+ cases parsed to look at 44 of them, and the run
    # took minutes. `get_cases/1&section_id=<id>` returns ONE section exactly (verified: asking for
    # 6760 returns only 6760, no children), so fetch the suite's sections and nothing else. Still
    # read live from TestRail, which is the part that must never be traded away for speed.
    cases = []
    for sid in sorted(keep):
        cases += paged(f'get_cases/1&section_id={sid}', 'cases', auth)
    print(f'1  LIVE CENSUS         {len(cases)} cases in {len(keep)} sections, read from TestRail')
    if not cases:
        print('   nothing to check'); return 1

    # 2 -- AUTHOR SCOPE.
    who, names = collections.Counter(c['created_by'] for c in cases), {}
    for uid in who:
        names[uid] = api(f'get_user/{uid}', auth).get('name', f'user {uid}')
    tester = IN_SCOPE_TESTER.get(a.root)
    print('2  AUTHOR SCOPE        ' + ' · '.join(f'{names[u]} {n}' for u, n in who.most_common()))
    # STATE THE SCOPE THAT WAS ACTUALLY APPLIED. These lists are hand-maintained (see the
    # declaration), so a reader must be able to see which ones this run used rather than
    # assume the ones they remember. A silent list is how a newly named tester becomes
    # "foreign" without anyone noticing.
    print('2  SCOPE APPLIED       never-write: '
          + ', '.join(f'user {u} {n}' for u, n in sorted(NEVER_WRITE.items()))
          + '  |  in-scope testers: '
          + ', '.join(f'section {s} -> user {u} {n}' for s, (u, n) in sorted(IN_SCOPE_TESTER.items())))
    if not tester:
        # NOT a failure: most sections legitimately have no named tester. But it is said out
        # loud, because "no in-scope tester" is indistinguishable from "the QA lead named one
        # and nobody added the row" - and the second treats that tester's cases as foreign.
        notes.append(f'section {a.root} is not in IN_SCOPE_TESTER, so NO author is being treated '
                     f'as the named manual QA tester for this suite. If the QA lead has named one, '
                     f'add the row to IN_SCOPE_TESTER in verify_suite.py before trusting the author '
                     f'scope above (Rule 38 amendment - this is the list that rejected all 30 of '
                     f'Mudassir Qamar\'s cases when it was wrong).')
    unknown_authors = sorted(u for u in who if u not in NEVER_WRITE
                             and (not tester or u != tester[0]) and u != 3)
    if unknown_authors:
        notes.append('authors present that are neither ours (user 3), protected, nor this '
                     'suite\'s named tester: '
                     + ', '.join(f'user {u} {names[u]} ({who[u]} case(s))' for u in unknown_authors)
                     + ' - Rule 38: report them, name the creator, do not edit them')
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
            hit = classify(m)
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
    # A protected author's case is REPORTED, never failed on. A gate that can never go green on a
    # suite containing one of Vladimir's cases is a gate people stop running - and then it protects
    # nothing. Measured on 6597: C45220 has no source and no marker, and must stay exactly as it is.
    prot = set(protected)
    mine_no_source = [i for i in no_source if i not in prot]
    for i in no_source:
        if i in prot:
            notes.append(f'C{i} has no source - but it is Vladimir Tomovic\'s, so report it and leave it (Rule 38)')
    if mine_no_source:
        fails.append(f'{len(mine_no_source)} case(s) of OURS have no source (Rule 64) - that is the '
                     f'definition of invented: ' + ', '.join('C%d' % i for i in mine_no_source[:10]))
    print(f'5  MARKER LITERAL      {len(cases)-len(bad_marker)}/{len(cases)} exact'
          + ('' if not bad_marker else '   ' + '; '.join(f'C{i}: {t}' for i, t in bad_marker[:6])))
    for i, t in bad_marker:
        if i in prot:
            notes.append(f'C{i} marker: {t} - but it is Vladimir Tomovic\'s, so report it and leave it (Rule 38)')
        else:
            # NOT "one of the three literals" - that wording is the bug this gate paid for once
            # already. Name the sanctioned prefixes from the imported declaration, so the message
            # cannot go stale the way the tuple did.
            fails.append(f'C{i} marker is not one of the sanctioned forms ({t}); '
                         f'sanctioned prefixes: ' + ', '.join(repr(k) for k in MARKERS))
    ready, ef, hold = counts['AUTOMATION: READY'], counts['AUTOMATION: READY - EXPECT FAIL'], counts['AUTOMATION: HOLD']
    defer = counts[DEFERRED_MARKER]
    # A NOT-BUILT case is excluded from any ready-to-automate figure (Rules 60/69), so it leaves the
    # arithmetic rather than breaking it.
    marked = ready + ef + hold + defer
    ok6 = (ready + ef) == (marked - hold - defer)
    print(f'6  MARKER ARITHMETIC   READY {ready} + EXPECT-FAIL {ef} = {ready+ef} ; {marked} marked '
          f'- HOLD {hold} - NOT-BUILT {defer} = {marked-hold-defer}   {"closes" if ok6 else "DOES NOT CLOSE"}')
    if not ok6:
        fails.append('the marker arithmetic does not close')
    if a.build:
        wrong = sorted({b for _, b in build_claim} - {a.build})
        print(f'9  BUILD SENTENCES     {len(build_claim)} case(s) name a build; '
              + (f'all say {a.build}' if not wrong else f'ALSO naming {wrong} - stale (Rule 91)'))
        if wrong:
            notes.append(f'build sentences name {wrong} but the build is {a.build} - re-stamp or re-check (Rule 91)')
    if deferred:
        notes.append(f'{len(deferred)} case(s) carry the Rule-69 NOT-BUILT marker: '
                     + ', '.join('C%d' % i for i in deferred[:8])
                     + ' - legitimate, but if the feature IS on the build now it is a false statement '
                       'about the build and must be lifted (that is what happened to C45123)')

    # 7/8 -- delegate to the two gates that already exist, so there is ONE implementation of each.
    ids = ','.join(str(c['id']) for c in cases)
    for n, cmd in ((7, ['python3', 'build/testing-tools/check_runnable_cases.py', '--cases', ids]),
                   (8, ['python3', 'build/testing-tools/check_precond_labels.py', '--cases', ids,
                        '--observed', a.observed])):
        r = subprocess.run(cmd, capture_output=True, text=True)
        tail = [l for l in r.stdout.strip().split('\n') if l.strip()]
        err = [l for l in (r.stderr or '').strip().split('\n') if l.strip()]
        label = 'RUNNABILITY' if n == 7 else 'PRECOND LABELS'
        # A protected author's case is reported, never failed on - same reason as checks 4 and 5.
        flagged = {int(m.group(1)) for m in CASE_ID_RE.finditer(r.stdout or '')}
        if flagged and flagged <= prot:
            print(f'{n}  {label:18} only ' + ', '.join('C%d' % i for i in sorted(flagged))
                  + " - Vladimir Tomovic's, reported not edited")
            for i in sorted(flagged):
                notes.append(f'C{i} fails the {label.lower()} gate - but it is Vladimir Tomovic\'s, '
                             f'so report it and leave it (Rule 38)')
            continue
        print(f'{n}  {label:18} ' + (tail[-1] if tail else f'(no output, exit {r.returncode})'))
        if r.returncode != 0:
            # SURFACE THE REASON. A delegated gate that fails with its stderr thrown away is a gate
            # nobody can act on - the first version of this printed "(no output, exit 1)" and left
            # the actual exception unread. If a child crashed, its last stderr lines say why.
            if not tail and err:
                fails.append(f'{label} gate CRASHED (exit {r.returncode}). Last error line:\n     '
                             + err[-1][:200] + '\n     re-run: ' + ' '.join(cmd[:3]) + ' --cases …')
                for l in err[-4:]:
                    print('     ! ' + l.strip()[:150])
            else:
                fails.append(f'{label} gate failed - run it directly for the detail:\n     ' + ' '.join(cmd[:3]) + ' --cases …')
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
