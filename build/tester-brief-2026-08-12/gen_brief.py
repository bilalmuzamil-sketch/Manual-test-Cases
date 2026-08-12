#!/usr/bin/env python3
"""Generate build/TESTER-BRIEF-2026-08-12.md from the LIVE census.

Every number is derived from TestRail in this run.  Nothing is transcribed from
a document: the counts moved repeatedly today, and a stale brief is worse than
none.
"""
import json, collections

census = json.load(open('/tmp/job12/census.json'))
holds = json.load(open('/tmp/job12/holds.json'))
FOREIGN = {'Filters': {43576,43577,43578,43579,43580},
           'Report Suite': {38919,38920,38921,38922,38923,43567,43568,43569,43570,43571,43572,43573},
           'Schedule': set()}
ORDER = ['Filters', 'Schedule', 'Report Suite']
RUNNAME = {'Filters': 'Filters - Ahtasham (Awaiting QA- ENV)',
           'Schedule': 'Schedule - Ayesha (VIU Pending)',
           'Report Suite': 'Reports Suite - Nebojsa/Viktoria (VIU Pending)'}
# Written by us today; their Passed result predates the marker change, so the
# tester did nothing wrong on these three.
OURS_TODAY = {30004, 30013, 30020}

def link(cid): return f'https://shopview.testrail.io/index.php?/cases/view/{cid}'

L = []
w = L.append

tot_run = tot_skip = tot_graded = tot_passed = 0
for p in ORDER:
    r = census[p]; h = holds[p]
    ours = r['total'] - len(FOREIGN[p])
    skip = len(h['holds'])
    tot_run += ours - skip; tot_skip += skip
    g = h['graded_holds']
    tot_graded += len(g); tot_passed += sum(1 for x in g if x['status_id'] == 1)

w('# What to test, and what to leave alone — 12 August 2026')
w('')
w('**For the manual test team. Release is tomorrow.**')
w('')
w('---')
w('')
w('## Read this first')
w('')
w('**If a test says it cannot be run yet, mark it Blocked. Do not mark it Passed.**')
w('')
w('This is not a formality. Checked in TestRail this morning, across the three test runs, '
  f'**{tot_graded} of the tests on the skip lists below already have a result recorded against them, and '
  f'{tot_passed} of those say Passed.** A test that could not be run cannot have passed, so each of '
  'those results has to be cleared up before it is read as evidence that the feature works.')
w('')
w('Every test in the skip lists carries its reason in its own words, at the bottom of its Expected '
  'Results. If you open a test and it tells you it is waiting on something, that is the case — '
  'mark it **Blocked** and move on.')
w('')
w('**The other thing worth knowing.** Some tests say, in plain words, *what you should see today* '
  'and that it is a known problem with a ticket already raised. Those you **do** run:')
w('')
w('- See exactly what the test describes → mark it **Failed** and raise nothing new.')
w('- See something **different** → that is a **new** problem. Please report it.')
w('- It **passes** → the fix has shipped. Tell the QA lead so the ticket can be closed.')
w('')
w('---')
w('')
w('## The short version')
w('')
w('| Project | Tests to run | Tests to skip | Where the run is |')
w('|---|---|---|---|')
for p in ORDER:
    r = census[p]; h = holds[p]
    ours = r['total'] - len(FOREIGN[p]); skip = len(h['holds'])
    w(f"| {p} | **{ours - skip}** | {skip} | TestRail run {r['run']} — *{RUNNAME[p]}* |")
w(f'| **All three** | **{tot_run}** | **{tot_skip}** | |')
w('')
w(f'**{tot_run} tests to run, {tot_skip} to skip, {tot_run + tot_skip} in total.**')
w('')

for p in ORDER:
    r = census[p]; h = holds[p]
    ours = r['total'] - len(FOREIGN[p]); skip = len(h['holds'])
    w('---')
    w('')
    w(f'# {p}')
    w('')
    w(f"**Run {r['run']}. {ours} tests belong to us. Run {ours - skip} of them. Skip the {skip} listed below.**")
    if FOREIGN[p]:
        w('')
        w(f"*({len(FOREIGN[p])} further tests in this area were written by a colleague and are not part of "
          f"this list or these counts.)*")
    g = h['graded_holds']
    if g:
        passed = [x for x in g if x['status_id'] == 1]
        w('')
        if len(passed) == len(g):
            isare = 'is' if len(g) == 1 else 'are'
            note = (f"**⚠️ {len(g)} of the {skip} tests below {isare} already marked Passed in this "
                    "run.** A test that could not be run cannot have passed.")
        else:
            note = (f"**⚠️ {len(g)} of the {skip} tests below already have a result recorded against "
                    f"them, {len(passed)} of them Passed.** A test that could not be run cannot have "
                    "passed.")
        mine = [x for x in g if x['case_id'] in OURS_TODAY]
        if mine:
            note += (f" **{len(mine)} of those are not the tester's doing** — C"
                     + ", C".join(str(x['case_id']) for x in mine)
                     + " were moved onto the skip list today, after the result was recorded.")
        w(note)
    w('')
    w('## Skip these')
    w('')
    w('| Test | What it is | Why it cannot be run yet |')
    w('|---|---|---|')
    by_reason = collections.defaultdict(list)
    for x in h['holds']: by_reason[x['reason']].append(x)
    for reason, items in sorted(by_reason.items(), key=lambda kv: -len(kv[1])):
        for x in sorted(items, key=lambda y: y['id']):
            t = x['title'].replace('|', '\\|')
            rr = (reason or 'no reason recorded').replace('|', '\\|')
            rr = rr[0].upper() + rr[1:] if rr else rr
            w(f"| [C{x['id']}]({link(x['id'])}) | {t} | {rr} |")
    w('')

w('---')
w('')
w('## If you are not sure')
w('')
w('- The test tells you it is waiting on something → **Blocked**.')
w('- The test tells you what you will see and it matches → **Failed**, nothing to raise.')
w('- The test tells you what you will see and you see something else → **report it**.')
w('- The test says nothing special and works → **Passed**.')
w('- Anything else, or the test simply does not make sense → **Blocked**, and tell the QA lead. '
  'Never guess a result.')
w('')
w('*Every count in this document was read from TestRail on 12 August 2026. '
  'If cases are added or changed after that, the counts move with them.*')

open('/home/user/Manual-test-Cases/build/TESTER-BRIEF-2026-08-12.md', 'w').write('\n'.join(L) + '\n')
print(f'run={tot_run} skip={tot_skip} total={tot_run+tot_skip} graded={tot_graded} passed={tot_passed}')
